import { Restaurant } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, CheckCircle, Navigation } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
  distance?: number;
}

export function RestaurantCard({ restaurant, onClick, distance }: RestaurantCardProps) {
  return (
    <Card 
      className="m-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{restaurant.name}</h3>
          {distance !== undefined && (
            <Badge variant="secondary" className="ml-2">
              <Navigation className="h-3 w-3 mr-1" />
              {distance.toFixed(2)} km
            </Badge>
          )}
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{restaurant.address}</span>
          </div>
          <p className="text-primary font-medium">
            {restaurant.neighborhood && `${restaurant.neighborhood} - `}
            {restaurant.city}
          </p>
          {restaurant.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{restaurant.phone}</span>
            </div>
          )}
        </div>
        <Badge className="mt-3 bg-green-600 hover:bg-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aceita Banricard
        </Badge>
      </CardContent>
    </Card>
  );
}
