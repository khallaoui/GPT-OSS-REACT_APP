import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This file is not actively used since we are calling OpenRouter directly,
// but it is kept to prevent breaking imports.
// In a real application, you would either remove Genkit dependencies
// or configure it to use an OpenRouter plugin if one were available.

export const ai = genkit({
  plugins: [],
});
