import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { QuoteSchema } from "@/lib/schemas";
import { sendQuoteConfirmation } from "@/lib/email";

// Configuration des clients
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const SYSTEM_PROMPT = `Tu es un expert artisan avec 20 ans d'expérience.
Tu analyses les demandes de clients et tu génères des devis préliminaires.
Tu réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans explication.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, email, imageBase64 } = body;

    // 1. Validation des entrées
    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description trop courte (min 10 caractères)" },
        { status: 400 },
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // 2. Routeur de modèles : Qwen pour le texte, Llama pour la vision
    const hasImage = !!imageBase64;
    const model = hasImage
      ? "llama-3.2-90b-vision-preview"
      : "qwen/qwen3.8-27b";

    const imageInstruction = hasImage
      ? "Une photo est fournie. Analyse-la pour identifier les dégâts visibles, les matériaux concernés et l'ampleur du problème. Utilise ces observations pour affiner ton estimation."
      : "Aucune photo n'est fournie, base-toi uniquement sur la description textuelle.";

    const userPrompt = `Analyse cette demande de devis :

Description du client : "${description}"
${imageInstruction}

Génère un objet JSON avec cette structure exacte :
{
  "type_panne": "plomberie|electricite|chauffage|paysagisme|menuiserie|peinture|autre",
  "urgence": "haute|moyenne|basse",
  "description_technique": "description technique précise en 1-2 phrases incluant les observations visuelles si une photo est présente",
  "estimation_prix_min": nombre_entier,
  "estimation_prix_max": nombre_entier,
  "questions_complementaires": ["question1", "question2"],
  "analyse_image": "description de ce que tu vois dans l'image, ou null si pas d'image"
}

Règles :
- Les prix sont en euros, fourchette réaliste pour un artisan français
- Maximum 3 questions complémentaires pertinentes
- Sois précis sur la description technique`;

    // 3. Construction des messages (adaptée au format du modèle)
    const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

    if (hasImage) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          { type: "image_url", image_url: { url: imageBase64 } },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: userPrompt,
      });
    }

    // 4. Appel à l'API Groq
    const completion = await groq.chat.completions.create({
      model: model,
      messages: messages,
      temperature: 0.2,
      max_tokens: 800,
    });

    const rawContent = completion.choices[0].message.content;

    // Nettoyage du JSON (retrait des blocs markdown parasites)
    const cleanContent = rawContent
      ?.replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed = JSON.parse(cleanContent || "{}");

    // 5. Validation stricte avec Zod
    const validatedQuote = QuoteSchema.parse(parsed);

    // 6. Insertion en base de données
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        ...validatedQuote,
        description_client: description,
        client_email: email,
        has_image: hasImage,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // 7. Envoi de l'email de confirmation (non bloquant)
    try {
      await sendQuoteConfirmation({
        clientEmail: email,
        typePanne: validatedQuote.type_panne,
        urgence: validatedQuote.urgence,
        estimationMin: validatedQuote.estimation_prix_min,
        estimationMax: validatedQuote.estimation_prix_max,
        descriptionTechnique: validatedQuote.description_technique,
      });
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
    }

    return NextResponse.json({ quote: data }, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur quote generation:", error);

    const err = error as any;
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Réponse IA invalide", details: err.errors },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la génération du devis" },
      { status: 500 },
    );
  }
}
