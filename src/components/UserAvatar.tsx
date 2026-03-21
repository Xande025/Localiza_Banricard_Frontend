'use client';

import { cn } from '@/lib/utils';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type UserAvatarProps = {
  name: string;
  /** Se definido, substitui o cálculo automático a partir do nome (ex.: "UR" para "Usuário") */
  initials?: string;
  avatarUrl?: string | null;
  className?: string;
  size?: 'sm' | 'md';
};

const sizeClass = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
};

export function UserAvatar({ name, initials: initialsProp, avatarUrl, className, size = 'md' }: UserAvatarProps) {
  const url = avatarUrl?.trim();
  const letterMark = (initialsProp?.trim().slice(0, 2).toUpperCase() || initials(name)).slice(0, 2);

  if (url) {
    return (
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-full border border-border bg-muted ring-2 ring-background',
          sizeClass[size],
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- URL externo opcional (OAuth futuro) */}
        <img src={url} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground ring-2 ring-background',
        sizeClass[size],
        className
      )}
      aria-hidden
    >
      {letterMark}
    </div>
  );
}
