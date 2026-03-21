'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, LogOut, Plus } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Dados estáticos até existir login no backend — substituir por props/API depois */
const STATIC_USER = {
  name: 'Usuário',
  initials: 'UR',
  avatarUrl: null as string | null,
};

type SiteHeaderProps = {
  onCadastrarEstabelecimento: () => void;
};

export function SiteHeader({ onCadastrarEstabelecimento }: SiteHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;
    const close = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [userMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [userMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/85">
      <div
        aria-hidden
        className="h-1 w-full bg-gradient-to-r from-brand-yellow via-brand-blue to-brand-yellow"
      />
      <div className="container mx-auto px-4">
        <h1 className="sr-only">
          Localiza Banricard — estabelecimentos que aceitam Banricard Vale Refeição no RS
        </h1>

        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:gap-6 md:py-5">
          <div className="flex min-w-0 flex-col items-center gap-2 md:flex-row md:items-center md:gap-6 lg:gap-8">
            <div className="flex shrink-0 justify-center md:justify-start">
              <Image
                src="/logo_mobile2.svg"
                alt="Localiza Banricard"
                width={360}
                height={80}
                className="h-32 w-auto max-w-[min(100%,460px)] object-contain sm:h-36 md:hidden"
                priority
              />
              <Image
                src="/Logo_desktop.svg"
                alt="Localiza Banricard"
                width={440}
                height={80}
                className="hidden h-[52px] w-auto max-w-[min(100%,480px)] object-contain object-left md:block lg:h-[72px]"
                priority
              />
            </div>
            <div className="hidden max-w-md md:block">
              <p className="text-sm font-medium leading-snug text-muted-foreground">
                Encontre onde aceitam Banricard Vale Refeição em todo o Rio Grande do Sul.
              </p>
            </div>
            <p className="text-center text-xs text-muted-foreground md:hidden">
              Banricard Vale Refeição no{' '}
              <span className="font-semibold text-primary">Rio Grande do Sul</span>
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 sm:justify-end md:gap-3">
            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              onClick={onCadastrarEstabelecimento}
            >
              <Plus className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Cadastrar estabelecimento</span>
              <span className="sm:hidden">Cadastrar</span>
            </Button>
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                id="user-menu-trigger"
                className={cn(
                  'flex max-w-[min(100%,240px)] items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left transition hover:bg-muted sm:max-w-xs',
                  userMenuOpen && 'border-border bg-muted/60'
                )}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                aria-controls="user-menu-dropdown"
                onClick={() => setUserMenuOpen((o) => !o)}
              >
                <UserAvatar
                  name={STATIC_USER.name}
                  initials={STATIC_USER.initials}
                  avatarUrl={STATIC_USER.avatarUrl}
                  size="md"
                />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                  {STATIC_USER.name}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                    userMenuOpen && 'rotate-180'
                  )}
                  aria-hidden
                />
              </button>
              {userMenuOpen && (
                <div
                  id="user-menu-dropdown"
                  role="menu"
                  aria-labelledby="user-menu-trigger"
                  className="absolute right-0 top-full z-[60] mt-1.5 min-w-[12rem] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted"
                    onClick={() => {
                      setUserMenuOpen(false);
                      /* TODO: logout quando houver autenticação no backend */
                    }}
                  >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
