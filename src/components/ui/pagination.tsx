import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="Paginação"
    className={cn('mx-auto flex w-full min-w-0 max-w-full justify-center px-0', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn(
        'inline-flex max-w-full flex-nowrap flex-row items-center justify-center gap-0 rounded-full border border-border/80 bg-gradient-to-b from-background to-muted/40 p-0.5 shadow-inner shadow-black/[0.03] sm:gap-0.5 sm:p-1 md:gap-1',
        className
      )}
      {...props}
    />
  )
);
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('flex items-center', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({ className, isActive, size = 'icon', ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? 'default' : 'ghost',
          size,
        }),
        'h-8 min-w-[2rem] rounded-full px-1.5 text-xs font-semibold tabular-nums transition-all duration-200 sm:h-9 sm:min-w-[2.25rem] sm:px-2.5 sm:text-sm',
        !isActive && 'text-muted-foreground hover:bg-muted/90 hover:text-foreground active:scale-95',
        isActive && 'shadow-md ring-1 ring-primary/30',
        className
      )}
      {...props}
    />
  )
);
PaginationLink.displayName = 'PaginationLink';

const navArrowClass = cn(
  buttonVariants({ variant: 'ghost', size: 'default' }),
  'h-8 shrink-0 rounded-full px-1.5 text-muted-foreground transition-all duration-200 sm:h-9 sm:px-2.5',
  'hover:bg-muted hover:text-foreground active:scale-95',
  'disabled:pointer-events-none disabled:opacity-35'
);

const PaginationPrevious = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Página anterior"
      className={cn(navArrowClass, 'gap-0.5 pl-1.5 pr-2 sm:gap-1 sm:pl-2.5 sm:pr-3.5', className)}
      {...props}
    >
      <ChevronLeft className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2.25} />
      <span className="hidden text-sm font-medium sm:inline">Anterior</span>
    </button>
  )
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Próxima página"
      className={cn(navArrowClass, 'gap-0.5 pl-2 pr-1.5 sm:gap-1 sm:pl-3.5 sm:pr-2.5', className)}
      {...props}
    >
      <span className="hidden text-sm font-medium sm:inline">Próxima</span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2.25} />
    </button>
  )
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'flex h-8 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 sm:h-9 sm:w-9',
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
    <span className="sr-only">Mais páginas</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };
