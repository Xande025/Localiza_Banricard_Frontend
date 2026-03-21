'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/** Tablet e celular: painel em tela cheia parcial (bottom sheet). Desktop: dropdown ancorado. */
const MOBILE_SHEET = '(max-width: 767px)';

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [query]);

  return matches;
}

export interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  emptyLabel: string;
  filterPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  emptyLabel,
  filterPlaceholder = 'Buscar na lista…',
  disabled,
  loading,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  const isMobileSheet = useMediaQuery(MOBILE_SHEET);
  const canUseDom = typeof document !== 'undefined';

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  React.useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  React.useEffect(() => {
    if (!open || isMobileSheet) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, isMobileSheet]);

  React.useEffect(() => {
    if (!canUseDom || !open || !isMobileSheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobileSheet, canUseDom]);

  React.useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);

  React.useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      if (sheetRef.current?.contains(t)) return;
      close();
    }
    if (open && !isMobileSheet) {
      document.addEventListener('pointerdown', onPointerDown, true);
      return () => document.removeEventListener('pointerdown', onPointerDown, true);
    }
  }, [open, isMobileSheet, close]);

  const handleSelect = (next: string) => {
    onValueChange(next);
    close();
  };

  const displayLabel = value || emptyLabel;

  const itemBtn = cn(
    'touch-manipulation flex w-full min-h-[48px] items-center gap-3 rounded-lg px-3 py-2 text-left text-base',
    'active:bg-accent/90 md:min-h-0 md:gap-2 md:rounded-md md:px-2 md:py-2 md:text-sm',
    'hover:bg-accent hover:text-accent-foreground'
  );

  const listSection = (
    <>
      <div className="shrink-0 border-b border-border bg-background px-3 pb-3 pt-1 md:p-2">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={filterPlaceholder}
          className="h-12 text-base md:h-9 md:text-sm"
          inputMode="search"
          autoComplete="off"
          autoCorrect="off"
          enterKeyHint="search"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.stopPropagation();
              close();
            }
          }}
        />
      </div>
      <ul
        className={cn(
          'min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-2 md:max-h-60 md:flex-none md:p-1',
          'max-h-[min(55vh,420px)] md:max-h-60'
        )}
      >
        <li role="option" aria-selected={!value}>
          <button type="button" className={cn(itemBtn, !value && 'bg-accent/60')} onClick={() => handleSelect('')}>
            {!value ? <Check className="h-5 w-5 shrink-0 md:h-4 md:w-4" /> : <span className="w-5 shrink-0 md:w-4" />}
            <span className="truncate font-medium">{emptyLabel}</span>
          </button>
        </li>
        {filtered.map((opt) => (
          <li key={opt} role="option" aria-selected={value === opt}>
            <button
              type="button"
              className={cn(itemBtn, value === opt && 'bg-accent/60')}
              onClick={() => handleSelect(opt)}
            >
              {value === opt ? (
                <Check className="h-5 w-5 shrink-0 md:h-4 md:w-4" />
              ) : (
                <span className="w-5 shrink-0 md:w-4" />
              )}
              <span className="truncate">{opt}</span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && query.trim() !== '' && (
          <li className="px-3 py-6 text-center text-base text-muted-foreground md:py-3 md:text-sm">
            Nenhum resultado
          </li>
        )}
      </ul>
    </>
  );

  const desktopPanel = open && !isMobileSheet && (
    <div
      className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg"
      role="listbox"
    >
      {listSection}
    </div>
  );

  const mobileSheet =
    canUseDom &&
    isMobileSheet &&
    open &&
    createPortal(
      <div className="fixed inset-0 z-[200] md:hidden" role="presentation">
        <button
          type="button"
          className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
          aria-label="Fechar"
          onClick={close}
        />
        <div
          ref={sheetRef}
          className={cn(
            'absolute inset-x-0 bottom-0 flex max-h-[min(92dvh,720px)] flex-col overflow-hidden rounded-t-2xl border border-border',
            'bg-popover text-popover-foreground shadow-2xl',
            'pb-[max(1rem,env(safe-area-inset-bottom))] pt-3'
          )}
          role="listbox"
        >
          <div className="mx-auto mb-2 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/35" aria-hidden />
          {listSection}
        </div>
      </div>,
      document.body
    );

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled || loading}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          if (disabled || loading) return;
          setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
        className={cn(
          'touch-manipulation flex min-h-[48px] w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2.5 text-left text-base ring-offset-background md:h-10 md:min-h-0 md:rounded-md md:py-2 md:text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          !value && 'text-muted-foreground'
        )}
      >
        <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
        <ChevronDown
          className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform md:h-4 md:w-4', open && 'rotate-180')}
        />
      </button>

      {desktopPanel}
      {mobileSheet}
    </div>
  );
}
