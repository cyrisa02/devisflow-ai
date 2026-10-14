import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.VISION_BACKEND_URL || "https://cyrilgourdon.pythonanywhere.com";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Aucun message fourni" },
        { status: 400 },
      );
    }

    const lastUserMessage = messages[messages.length - 1];

    // Construire le payload pour le backend Python
    const payload: any = {
      prompt: lastUserMessage.content,
    };

    // Extraire l'email si présent dans le contenu
    const emailMatch = lastUserMessage.content.match(/Email[:\s]+([^\n]+)/i);
    if (emailMatch) {
      payload.email = emailMatch[1].trim();
    }

    // Ajouter l'image si présente (base64)
    if (lastUserMessage.image) {
      payload.image_base64 = lastUserMessage.image;
    }

    // Appel au backend PythonAnywhere
    const response = await fetch(`${BACKEND_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Erreur du serveur" },
        { status: response.status },
      );
    }

    return NextResponse.json({
      text: data.text,
      model: data.model,
      tokens_used: data.tokens_used,
    });
  } catch (error) {
    console.error("Erreur API chat:", error);
    return NextResponse.json(
      { error: "Erreur de connexion au serveur" },
      { status: 500 },
    );
  }
}
