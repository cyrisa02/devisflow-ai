import { z } from 'zod';

// Schéma strict de ce qu'on attend de l'IA
export const QuoteSchema = z.object({
  type_panne: z.enum([
    'plomberie',
    'electricite',
    'chauffage',
    'paysagisme',
    'menuiserie',
    'peinture',
    'autre'
  ]),
  urgence: z.enum(['haute', 'moyenne', 'basse']),
  description_technique: z.string().min(10),
  estimation_prix_min: z.number().min(0),
  estimation_prix_max: z.number().min(0),
  questions_complementaires: z.array(z.string()).max(5)
}).refine(
  (data) => data.estimation_prix_min <= data.estimation_prix_max,
  {
    message: "Le prix minimum doit être inférieur ou égal au prix maximum",
    path: ["estimation_prix_min"]
  }
);

// Type TypeScript dérivé automatiquement du schéma
export type Quote = z.infer<typeof QuoteSchema>;