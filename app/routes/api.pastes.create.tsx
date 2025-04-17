import { savePaste } from '../lib/pastes.server';
import { z } from 'zod';

const createPasteSchema = z.object({
  data: z.string().min(1, 'Paste content is required'),
  languageId: z.string().min(1, 'Language ID is required'),
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

    const validatedData = createPasteSchema.safeParse(body);

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

    const pasteId = await savePaste(validatedData.data);

    return new Response(JSON.stringify({ id: pasteId }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in paste creation API:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to create paste',
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
