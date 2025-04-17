import { redirect } from 'react-router';
import type { Route } from './+types/$fullPasteId';
import { getPaste } from '@/lib/pastes.server';

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.fullPasteId) {
    throw redirect('/');
  }

  const pasteId = params.fullPasteId.split('.')[0];

  if (!pasteId) {
    throw redirect('/');
  }

  const paste = await getPaste(pasteId);

  return new Response(paste.data, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
