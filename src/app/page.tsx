'use client';

import { useState, useEffect } from 'react';
import { RestaurantMap } from '@/components/RestaurantMap';
import { RestaurantList } from '@/components/RestaurantList';
import { Filters } from '@/components/Filters';
import { RestaurantForm } from '@/components/RestaurantForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, MapPin, X, Loader2 } from 'lucide-react';
import { useRestaurants } from '@/hooks/useRestaurants';
import { Restaurant } from '@/lib/api';
import { calculateDistance } from '@/lib/distance';

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
  const [showNearby, setShowNearby] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState(10); // km
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { restaurants, loading } = useRestaurants(filters);

  // Função para obter localização manualmente
  const handleGetLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocalização não suportada pelo navegador');
      return;
    }

    setLocationError(null);
    setShowNearby(true);
    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Erro ao obter localização';
        if (error.code === 1) {
          errorMessage = 'Permissão de localização negada. Por favor, permita o acesso à localização nas configurações do navegador.';
        } else if (error.code === 2) {
          errorMessage = 'Localização indisponível';
        } else if (error.code === 3) {
          errorMessage = 'Tempo de espera esgotado ao obter localização';
        }
        setLocationError(errorMessage);
        setShowNearby(false);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Filtrar restaurantes por proximidade
  const nearbyRestaurants = userLocation && showNearby
    ? restaurants
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
        .filter((r) => (r as any).distance <= maxDistance)
        .sort((a, b) => (a as any).distance - (b as any).distance)
    : restaurants;

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleClearNearby = () => {
    setShowNearby(false);
    setUserLocation(null);
    setLocationError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-blue-600 to-red-600 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📍 Localiza Banricard</h1>
          <p className="text-lg opacity-90">
            Encontre restaurantes, postos, farmácias e outros estabelecimentos que aceitam Banricard Vale Refeição no RS
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Filters 
            filters={filters} 
            onFiltersChange={setFilters}
          />
          
          <div className="flex flex-wrap gap-4 items-center mt-4">
            {!showNearby ? (
              <Button 
                onClick={handleGetLocation}
                variant="outline"
                className="flex items-center gap-2"
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Obtendo localização...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Ver estabelecimentos perto de mim
                  </>
                )}
              </Button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Button 
                  onClick={handleClearNearby}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Limpar filtro de proximidade
                </Button>
                {userLocation && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="maxDistance" className="text-sm text-muted-foreground">
                      Distância máxima:
                    </label>
                    <Select value={maxDistance.toString()} onValueChange={(value) => setMaxDistance(parseInt(value))}>
                      <SelectTrigger id="maxDistance" className="w-32">
                        <SelectContent>
                          <SelectItem value="1">1 km</SelectItem>
                          <SelectItem value="5">5 km</SelectItem>
                          <SelectItem value="10">10 km</SelectItem>
                          <SelectItem value="20">20 km</SelectItem>
                          <SelectItem value="50">50 km</SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </div>
                )}
              </div>
            )}
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Estabelecimento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
          </div>

          {locationError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              ⚠️ {locationError}
            </div>
          )}

          {showNearby && userLocation && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
              📍 Localização obtida! Mostrando {nearbyRestaurants.length} estabelecimento(s) em até {maxDistance} km
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <aside className="bg-white rounded-lg shadow-md overflow-hidden lg:col-span-2">
            <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {showNearby ? 'Estabelecimentos Próximos' : 'Estabelecimentos'}
              </h2>
              <span className="bg-primary-foreground text-primary px-3 py-1 rounded-full text-sm font-bold">
                {nearbyRestaurants.length}
              </span>
            </div>
            <RestaurantList 
              restaurants={nearbyRestaurants} 
              loading={loading}
              onRestaurantClick={handleRestaurantClick}
              userLocation={userLocation}
            />
          </aside>

          <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 lg:col-span-3">
            <RestaurantMap 
              restaurants={nearbyRestaurants}
              onMarkerClick={handleRestaurantClick}
              selectedRestaurant={selectedRestaurant}
              userLocation={userLocation}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
