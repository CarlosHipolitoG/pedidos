'use server';

/**
 * @fileOverview Un flujo para generar descripciones de eventos usando IA.
 *
 * - generateEventDescription - Una función que genera descripciones de eventos.
 * - GenerateEventDescriptionInput - El tipo de entrada para la función generateEventDescription.
 * - GenerateEventDescriptionOutput - El tipo de retorno para la función generateEventDescription.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventDescriptionInputSchema = z.object({
  eventDetails: z
    .string()
    .describe('Detalles sobre el evento, incluyendo tema, actividades y público objetivo.'),
});
export type GenerateEventDescriptionInput = z.infer<typeof GenerateEventDescriptionInputSchema>;

const GenerateEventDescriptionOutputSchema = z.object({
  description: z.string().describe('Una descripción de evento atractiva y cautivadora.'),
});
export type GenerateEventDescriptionOutput = z.infer<typeof GenerateEventDescriptionOutputSchema>;

export async function generateEventDescription(input: GenerateEventDescriptionInput): Promise<GenerateEventDescriptionOutput> {
  return generateEventDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventDescriptionPrompt',
  input: {schema: GenerateEventDescriptionInputSchema},
  output: {schema: GenerateEventDescriptionOutputSchema},
  prompt: `Eres un experto redactor de descripciones de eventos.

  Basándote en los detalles del evento proporcionados, crea una descripción de evento atractiva y cautivadora.

  Detalles del Evento: {{{eventDetails}}}`,
});

const generateEventDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEventDescriptionFlow',
    inputSchema: GenerateEventDescriptionInputSchema,
    outputSchema: GenerateEventDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
