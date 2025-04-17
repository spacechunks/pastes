import { getPaste } from '../lib/pastes.server';

export async function loader({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  if (request.method.toUpperCase() !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Paste ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const paste = await getPaste(id);

    return new Response(JSON.stringify(paste), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error in get paste API:', error);

    if (
      (error as Error).message === 'Paste not found' ||
      (error as Error).message === 'Paste has expired'
    ) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(
      JSON.stringify({
        error: 'Failed to retrieve paste',
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
