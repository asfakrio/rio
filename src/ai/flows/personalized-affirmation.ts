'use server';

/**
 * @fileOverview Generates a personalized affirmation message based on a user's name.
 *
 * - generateAffirmation - A function that generates a personalized affirmation message.
 * - GenerateAffirmationInput - The input type for the generateAffirmation function.
 * - GenerateAffirmationOutput - The return type for the generateAffirmation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAffirmationInputSchema = z.object({
  userName: z.string().describe('The name of the user to personalize the affirmation for.'),
});
export type GenerateAffirmationInput = z.infer<typeof GenerateAffirmationInputSchema>;

const GenerateAffirmationOutputSchema = z.object({
  affirmationMessage: z.string().describe('A personalized affirmation message for the user.'),
});
export type GenerateAffirmationOutput = z.infer<typeof GenerateAffirmationOutputSchema>;

export async function generateAffirmation(input: GenerateAffirmationInput): Promise<GenerateAffirmationOutput> {
  return generateAffirmationFlow(input);
}

const affirmationPrompt = ai.definePrompt({
  name: 'affirmationPrompt',
  input: {schema: GenerateAffirmationInputSchema},
  output: {schema: GenerateAffirmationOutputSchema},
  prompt: `Generate a personalized and romantic affirmation message for {{userName}}. The message should express love and appreciation, and include some emojis.`,
});

const generateAffirmationFlow = ai.defineFlow(
  {
    name: 'generateAffirmationFlow',
    inputSchema: GenerateAffirmationInputSchema,
    outputSchema: GenerateAffirmationOutputSchema,
  },
  async input => {
    const {output} = await affirmationPrompt(input);
    return output!;
  }
);
