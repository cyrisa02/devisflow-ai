import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  clientEmail: string;
  clientName?: string;
  typePanne: string;
  urgence: string;
  estimationMin: number;
  estimationMax: number;
  descriptionTechnique: string;
}

export async function sendQuoteConfirmation(data: EmailData) {
  const { data: emailData, error } = await resend.emails.send({
    from: "DevisFlow IA <onboarding@resend.dev>", // Temporaire, on changera après
    to: ["cyril.gourdon.02@gmail.com"],
    subject: `Votre devis préliminaire - ${data.typePanne}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">DevisFlow IA</h1>
        <p>Merci pour votre demande. Voici votre estimation préliminaire :</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">${data.typePanne}</h2>
          <p><strong>Urgence :</strong> ${data.urgence}</p>
          <p><strong>Description :</strong> ${data.descriptionTechnique}</p>
          <p style="font-size: 24px; color: #2563eb; font-weight: bold;">
            Estimation : ${data.estimationMin}€ - ${data.estimationMax}€
          </p>
        </div>

        <p style="color: #666; font-size: 14px;">
          ️ Il s'agit d'une estimation préliminaire basée sur votre description. 
          Un artisan vous contactera sous 2h pour confirmer le devis final.
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          Propulsé par DevisFlow IA
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Erreur envoi email:", error);
    throw error;
  }

  return emailData;
}
