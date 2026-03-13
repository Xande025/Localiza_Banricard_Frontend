import { Restaurant } from '@/lib/api';
import { RestaurantCard } from './RestaurantCard';
import { Loader2 } from 'lucide-react';
import { calculateDistance } from '@/lib/distance';

interface RestaurantListProps {
  restaurants: Restaurant[];
  loading: boolean;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  userLocation?: { lat: number; lng: number } | null;
}

export function RestaurantList({ restaurants, loading, onRestaurantClick, userLocation }: RestaurantListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Nenhum estabelecimento encontrado</p>
      </div>
    );
  }

  // Ordenar por distância se tiver localização do usuário
  const sortedRestaurants = userLocation
    ? [...restaurants]
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
        .sort((a, b) => (a as any).distance - (b as any).distance)
    : restaurants;

  return (
    <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
      {sortedRestaurants.map((restaurant) => (
        <RestaurantCard 
          key={restaurant.id} 
          restaurant={restaurant}
          onClick={() => onRestaurantClick?.(restaurant)}
          distance={(restaurant as any).distance}
        />
      ))}
    </div>
  );
}
