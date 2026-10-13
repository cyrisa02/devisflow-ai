import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { QuoteSchema } from "@/lib/schemas";

// Groq utilise une API compatible OpenAI
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

function buildUserPrompt(description: string) {
  return `Analyse cette demande de devis :

Description du client : "${description}"

Génère un objet JSON avec cette structure exacte :
{
  "type_panne": "plomberie|electricite|chauffage|paysagisme|menuiserie|peinture|autre",
  "urgence": "haute|moyenne|basse",
  "description_technique": "description technique précise en 1-2 phrases",
  "estimation_prix_min": nombre_entier,
  "estimation_prix_max": nombre_entier,
  "questions_complementaires": ["question1", "question2"]
}

Règles :
- Les prix sont en euros, fourchette réaliste pour un artisan français
- Maximum 3 questions complémentaires pertinentes
- Sois précis sur la description technique`;
}

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description trop courte (min 10 caractères)" },
        { status: 400 },
      );
    }

    const completion = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(description) },
      ],
      temperature: 0.2,
      max_tokens: 500,
    });

    const rawContent = completion.choices[0].message.content;

    const cleanContent = rawContent
      ?.replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed = JSON.parse(cleanContent || "{}");

    const validatedQuote = QuoteSchema.parse(parsed);

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        ...validatedQuote,
        description_client: description,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

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
