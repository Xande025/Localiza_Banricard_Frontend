'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/ui/searchable-select';
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
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou endereço..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          className="pl-10"
        />
        </div>
        <Button
          onClick={handleSearch}
          type="button"
          aria-label="Buscar"
          className="h-10 w-10 shrink-0 p-0 sm:h-10 sm:w-auto sm:px-4"
        >
          <Search className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Buscar</span>
        </Button>
        <Button
          onClick={handleClearFilters}
          type="button"
          variant="outline"
          aria-label="Limpar filtros"
          className="h-10 w-10 shrink-0 p-0 sm:h-10 sm:w-auto sm:px-4"
        >
          <X className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Limpar</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Cidade</Label>
          <SearchableSelect
            value={filters.city || ''}
            onValueChange={handleCityChange}
            options={cities}
            emptyLabel="Todas as cidades"
            disabled={loading}
            loading={loading}
          />
        </div>

        <div>
          <Label>Bairro</Label>
          <SearchableSelect
            value={filters.neighborhood || ''}
            onValueChange={(v) => onFiltersChange({ ...filters, neighborhood: v })}
            options={neighborhoods}
            emptyLabel="Todos os bairros"
            disabled={!filters.city || loading}
            loading={loading}
          />
        </div>

        <div>
          <Label>Região</Label>
          <SearchableSelect
            value={filters.region || ''}
            onValueChange={(v) => onFiltersChange({ ...filters, region: v })}
            options={regions}
            emptyLabel="Todas as regiões"
            disabled={loading}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
