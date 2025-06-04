import { savePaste } from '../lib/pastes.server';
import { detectLanguage } from '../lib/language.server';

export async function action({ request }: { request: Request }) {
  if (request.method.toUpperCase() !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const data = await request.text();

    if (!data) {
      return new Response(JSON.stringify({ error: 'No content provided' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const detectedLanguage = await detectLanguage(data);

    const pasteId = await savePaste({
      data,
      languageId: detectedLanguage?.id || 'plaintext',
    });

    return new Response(JSON.stringify({ key: pasteId }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
