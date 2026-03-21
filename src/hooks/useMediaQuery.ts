'use client';

import { useEffect, useState } from 'react';

/**
 * Retorna se a media query corresponde (após montagem no cliente).
 * Antes do mount, devolve `defaultValue` para evitar divergência de hidratação.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);

  return matches;
}
