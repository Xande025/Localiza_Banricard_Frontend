'use client';

import { useState, useEffect, useMemo } from 'react';
import { Restaurant } from '@/lib/api';
import { RestaurantCard } from './RestaurantCard';
import { Loader2 } from 'lucide-react';
import { calculateDistance } from '@/lib/distance';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const PAGE_SIZE = 5;

function getPageNumbers(
  current: number,
  total: number,
  compact: boolean
): (number | 'ellipsis')[] {
  if (total <= 0) return [];

  if (compact) {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 2) return [1, 2, 3, 'ellipsis', total];
    if (current >= total - 1) return [1, 'ellipsis', total - 2, total - 1, total];
    return [1, 'ellipsis', current, 'ellipsis', total];
  }

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', total];
  }
  if (current >= total - 3) {
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
}

interface RestaurantListProps {
  restaurants: Restaurant[];
  loading: boolean;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  userLocation?: { lat: number; lng: number } | null;
  /** Quando mudar (filtros, proximidade etc.), volta para a página 1 */
  paginationResetKey?: string;
  className?: string;
}

export function RestaurantList({
  restaurants,
  loading,
  onRestaurantClick,
  userLocation,
  paginationResetKey = '',
  className,
}: RestaurantListProps) {
  const [page, setPage] = useState(1);
  const isMobilePagination = useMediaQuery('(max-width: 639px)');

  useEffect(() => {
    setPage(1);
  }, [paginationResetKey]);

  const sortedRestaurants = useMemo(() => {
    if (userLocation) {
      return [...restaurants]
        .filter((r) => r.latitude && r.longitude)
        .map((r) => ({
          ...r,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            parseFloat(r.latitude!),
            parseFloat(r.longitude!)
          ),
        }))
        .sort((a, b) => (a as any).distance - (b as any).distance);
    }
    return restaurants;
  }, [restaurants, userLocation]);

  const totalPages = Math.max(1, Math.ceil(sortedRestaurants.length / PAGE_SIZE));

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const safePage = Math.min(page, totalPages);

  const paginatedSlice = useMemo(() => {
    const p = Math.min(page, totalPages);
    const start = (p - 1) * PAGE_SIZE;
    return sortedRestaurants.slice(start, start + PAGE_SIZE);
  }, [sortedRestaurants, page, totalPages]);

  if (loading) {
    return (
      <div className={cn('flex min-h-0 flex-1 flex-col items-center justify-center py-12', className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sortedRestaurants.length === 0) {
    return (
      <div className={cn('flex min-h-0 flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground', className)}>
        <p>Nenhum estabelecimento encontrado</p>
      </div>
    );
  }

  const pageItems = getPageNumbers(safePage, totalPages, isMobilePagination);

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {paginatedSlice.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={() => onRestaurantClick?.(restaurant)}
            distance={(restaurant as any).distance}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="shrink-0 border-t border-border/60 bg-gradient-to-b from-muted/20 to-muted/40 px-2 py-3 sm:px-4 sm:py-4">
          <p className="mb-2 text-center text-[12px] text-muted-foreground sm:mb-3 sm:text-[13px]">
            <span className="font-medium text-foreground/90">
              {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sortedRestaurants.length)}
            </span>
            <span className="mx-1.5 text-muted-foreground/50">·</span>
            <span>{sortedRestaurants.length} locais</span>
          </p>
          <p className="mb-2 text-center text-[11px] text-muted-foreground sm:hidden">
            Página <span className="font-semibold text-foreground">{safePage}</span> de{' '}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </p>
          <Pagination>
            <PaginationContent className="max-w-full overflow-x-auto px-0.5 pb-0.5 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-0 [&::-webkit-scrollbar]:hidden">
              <PaginationItem>
                <PaginationPrevious
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                />
              </PaginationItem>
              {pageItems.map((item, idx) =>
                item === 'ellipsis' ? (
                  <PaginationItem key={`e-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationLink isActive={safePage === item} onClick={() => setPage(item)} aria-label={`Página ${item}`}>
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
