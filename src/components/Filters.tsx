'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { restaurantApi } from '@/lib/api';
import { Search, X } from 'lucide-react';

interface FiltersProps {
  filters: {
    city?: string;
    neighborhood?: string;
    region?: string;
    search?: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState<string>(filters.search || '');

  useEffect(() => {
    async function loadFilters() {
      setLoading(true);
      try {
        const [citiesRes, neighborhoodsRes, regionsRes] = await Promise.all([
          restaurantApi.getCities(),
          restaurantApi.getNeighborhoods(filters.city),
          restaurantApi.getRegions(),
        ]);

        if (citiesRes.success) setCities(citiesRes.data || []);
        if (neighborhoodsRes.success) setNeighborhoods(neighborhoodsRes.data || []);
        if (regionsRes.success) setRegions(regionsRes.data || []);
      } catch (error) {
        console.error('Erro ao carregar filtros:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFilters();
  }, [filters.city]);

  const handleCityChange = (value: string) => {
    onFiltersChange({ ...filters, city: value, neighborhood: '' });
  };

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchInput });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      city: '',
      neighborhood: '',
      region: '',
      search: '',
    });
  };

  // Sincroniza o input local com o filtro quando ele muda externamente (ex: limpar filtros)
  useEffect(() => {
    if (filters.search !== searchInput) {
      setSearchInput(filters.search || '');
    }
  }, [filters.search]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou endereço..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          className="pl-10"
        />
        </div>
        <Button onClick={handleSearch} type="button">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
        <Button onClick={handleClearFilters} type="button" variant="outline">
          <X className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Cidade</Label>
          <select
            value={filters.city || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={loading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todas as cidades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Bairro</Label>
          <select
            value={filters.neighborhood || ''}
            onChange={(e) => onFiltersChange({ ...filters, neighborhood: e.target.value })}
            disabled={!filters.city || loading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todos os bairros</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Região</Label>
          <select
            value={filters.region || ''}
            onChange={(e) => onFiltersChange({ ...filters, region: e.target.value })}
            disabled={loading}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Todas as regiões</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
