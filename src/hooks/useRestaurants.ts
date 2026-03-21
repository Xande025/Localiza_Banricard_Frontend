'use client';

import { useState, useEffect } from 'react';
import { restaurantApi, Restaurant } from '@/lib/api';

interface UseRestaurantsFilters {
  city?: string;
  neighborhood?: string;
  region?: string;
  search?: string;
  verified?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  /** Enquanto true, não chama a API (ex.: aguardando geolocalização) */
  skipFetch?: boolean;
  /**
   * Se true e não houver lat/lng nos filtros, não busca na API (evita carregar lista inteira
   * quando a geolocalização falhou e o app depende só de coordenadas).
   */
  blockFallbackWithoutGeo?: boolean;
}

export function useRestaurants(filters: UseRestaurantsFilters = {}) {
  const { skipFetch, blockFallbackWithoutGeo, ...apiFilters } = filters;
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skipFetch) {
      setLoading(true);
      setRestaurants([]);
      setError(null);
      return;
    }

    if (
      blockFallbackWithoutGeo &&
      (apiFilters.lat == null || apiFilters.lng == null)
    ) {
      setLoading(false);
      setRestaurants([]);
      setError(null);
      return;
    }

    async function fetchRestaurants() {
      try {
        setLoading(true);
        setError(null);
        const response = await restaurantApi.getAll(apiFilters);
        if (response.success && response.data) {
          setRestaurants(response.data);
        } else {
          setError(response.message || 'Erro ao carregar restaurantes');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar restaurantes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurants();
  }, [
    skipFetch,
    blockFallbackWithoutGeo,
    apiFilters.city,
    apiFilters.neighborhood,
    apiFilters.region,
    apiFilters.search,
    apiFilters.verified,
    apiFilters.lat,
    apiFilters.lng,
    apiFilters.radiusKm,
  ]);

  return {
    restaurants,
    loading,
    error,
    refetch: () => restaurantApi.getAll(apiFilters),
  };
}
