import { useDebouncedValue } from '@tanstack/react-pacer';
import { useFetcher } from 'react-router';
import { useEffect, useRef } from 'react';
import type { LanguageInfo } from '../lib/language';

export function useLanguageDetection(code: string, enabled: boolean = true) {
  const [debouncedQuery, debouncer] = useDebouncedValue(code, {
    wait: 800,
  });

  const languageFetcher = useFetcher<LanguageInfo>();

  const lastSubmittedQuery = useRef<string | null>(null);

  useEffect(() => {
    if (
      !debouncedQuery ||
      !enabled ||
      debouncedQuery === lastSubmittedQuery.current
    ) {
      return;
    }

    lastSubmittedQuery.current = debouncedQuery;

    languageFetcher.submit(
      { code: debouncedQuery },
      {
        method: 'post',
        action: '/api/language/detect',
        encType: 'application/json',
      }
    );
  }, [debouncedQuery, enabled]);
  return languageFetcher.data;
}
