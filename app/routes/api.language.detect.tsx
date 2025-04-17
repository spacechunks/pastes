import { detectLanguage } from '../lib/language.server';
import { z } from 'zod';

const detectLanguageSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

export async function action({ request }: { request: Request }) {
  if (request.method.toUpperCase() !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const body = await request.json();

    const validatedData = detectLanguageSchema.safeParse(body);

    if (!validatedData.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request data',
          details: validatedData.error.format(),
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { code } = validatedData.data;

    const result = await detectLanguage(code);

    return new Response(
      JSON.stringify(result || { error: 'Language detection failed' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in language detection API:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
