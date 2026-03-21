'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Footer } from '@/components/Footer';
import { SiteHeader } from '@/components/SiteHeader';
import { RestaurantMap } from '@/components/RestaurantMap';
import { RestaurantList } from '@/components/RestaurantList';
import { Filters } from '@/components/Filters';
import { RestaurantForm } from '@/components/RestaurantForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Restaurant } from '@/lib/api';

const DEFAULT_RADIUS_KM = 10;

type GeoState = 'pending' | 'ok' | 'error';

export default function Home() {
  const [filters, setFilters] = useState({
    city: '',
    neighborhood: '',
    region: '',
    search: '',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<GeoState>('pending');
  const [locationError, setLocationError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocalização não suportada pelo navegador');
      setGeoState('error');
      return;
    }

    setLocationError(null);
    setGeoState('pending');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
        setGeoState('ok');
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização';
        if (error.code === 1) {
          errorMessage =
            'Permissão de localização negada. Por favor, permita o acesso à localização nas configurações do navegador.';
        } else if (error.code === 2) {
          errorMessage = 'Localização indisponível';
        } else if (error.code === 3) {
          errorMessage = 'Tempo de espera esgotado ao obter localização';
        }
        setLocationError(errorMessage);
        setUserLocation(null);
        setGeoState('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  /** Com algum filtro preenchido, a lista vem só dos critérios (sem raio de 10 km). */
  const hasActiveFilters = useMemo(
    () =>
      Boolean(filters.city.trim()) ||
      Boolean(filters.neighborhood.trim()) ||
      Boolean(filters.region.trim()) ||
      Boolean(filters.search.trim()),
    [filters.city, filters.neighborhood, filters.region, filters.search]
  );

  const useGeoForQuery =
    geoState === 'ok' && userLocation != null && !hasActiveFilters;

  const { restaurants, loading } = useRestaurants({
    ...filters,
    ...(useGeoForQuery
      ? {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radiusKm: DEFAULT_RADIUS_KM,
        }
      : {}),
    skipFetch: geoState === 'pending' && !hasActiveFilters,
    blockFallbackWithoutGeo: geoState === 'error' && !hasActiveFilters,
  });

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const paginationResetKey = [
    filters.city,
    filters.neighborhood,
    filters.region,
    filters.search,
    String(geoState),
    String(hasActiveFilters),
  ].join('|');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader onCadastrarEstabelecimento={() => setIsFormOpen(true)} />

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Filters filters={filters} onFiltersChange={setFilters} />

          <div className="flex flex-wrap gap-4 items-center mt-4">
            {geoState === 'pending' && (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Obtendo sua localização para mostrar estabelecimentos em até {DEFAULT_RADIUS_KM} km…
              </span>
            )}
            {geoState === 'error' && (
              <Button type="button" variant="outline" size="sm" onClick={requestLocation}>
                Tentar obter localização novamente
              </Button>
            )}
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Estabelecimento</DialogTitle>
              </DialogHeader>
              <RestaurantForm
                onSuccess={() => {
                  setIsFormOpen(false);
                  window.location.reload();
                }}
              />
            </DialogContent>
          </Dialog>

          {locationError && !hasActiveFilters && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              ⚠️ {locationError}
            </div>
          )}

          {hasActiveFilters && (
            <div className="mt-4 rounded border border-border bg-muted/40 p-3 text-sm text-foreground">
              Filtros ativos: listagem por cidade, bairro, região ou busca (sem limite de distância).
            </div>
          )}

          {geoState === 'ok' && userLocation && !hasActiveFilters && (
            <div className="mt-4 rounded border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
              📍 Mostrando {restaurants.length} estabelecimento(s) em até {DEFAULT_RADIUS_KM} km da sua
              localização
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-5">
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-lg bg-white shadow-md lg:col-span-2 lg:h-[720px]">
            <div className="shrink-0 bg-primary p-4 text-primary-foreground flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {hasActiveFilters ? 'Resultados' : 'Estabelecimentos próximos'}
              </h2>
              <span className="bg-primary-foreground text-primary px-3 py-1 rounded-full text-sm font-bold">
                {restaurants.length}
              </span>
            </div>
            <RestaurantList
              className="min-h-0 flex-1"
              restaurants={restaurants}
              loading={loading}
              onRestaurantClick={handleRestaurantClick}
              userLocation={userLocation}
              paginationResetKey={paginationResetKey}
            />
          </aside>

          <div className="flex min-h-0 flex-col overflow-hidden rounded-lg bg-white p-4 shadow-md lg:col-span-3 lg:h-[720px]">
            <RestaurantMap
              restaurants={restaurants}
              onMarkerClick={handleRestaurantClick}
              selectedRestaurant={selectedRestaurant}
              userLocation={userLocation}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
