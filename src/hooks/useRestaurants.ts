'use client';

import { useState, useEffect } from 'react';
import { restaurantApi, Restaurant } from '@/lib/api';

interface UseRestaurantsFilters {
  city?: string;
  neighborhood?: string;
  region?: string;
  search?: string;
  verified?: boolean;
}

export function useRestaurants(filters: UseRestaurantsFilters = {}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        setLoading(true);
        setError(null);
        const response = await restaurantApi.getAll(filters);
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
  }, [filters.city, filters.neighborhood, filters.region, filters.search, filters.verified]);

  return { restaurants, loading, error, refetch: () => {
    return restaurantApi.getAll(filters);
  }};
}
