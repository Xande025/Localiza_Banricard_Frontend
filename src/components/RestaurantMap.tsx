'use client';

import { useEffect, useRef, useState } from 'react';
import { Restaurant } from '@/lib/api';
import { useLoadScript } from '@react-google-maps/api';
import { calculateDistance } from '@/lib/distance';

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places'];

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onMarkerClick?: (restaurant: Restaurant) => void;
  selectedRestaurant?: Restaurant | null;
  userLocation?: { lat: number; lng: number } | null;
}

export function RestaurantMap({ restaurants, onMarkerClick, selectedRestaurant, userLocation }: RestaurantMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const userInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    // Limpar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    infoWindowsRef.current.forEach(iw => iw.close());
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }
    if (userInfoWindowRef.current) {
      userInfoWindowRef.current.close();
    }
    markersRef.current = [];
    infoWindowsRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    let hasValidLocation = false;

    // Adicionar marcador da localização do usuário
    if (userLocation) {
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map: mapRef.current!,
        title: 'Sua localização',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
        zIndex: 1000,
      });

      const userInfoWindow = new google.maps.InfoWindow({
        content: '<div class="p-2"><strong>📍 Sua localização</strong></div>',
      });

      userMarker.addListener('click', () => {
        infoWindowsRef.current.forEach(iw => iw.close());
        userInfoWindow.open(mapRef.current!, userMarker);
      });

      userMarkerRef.current = userMarker;
      userInfoWindowRef.current = userInfoWindow;
      bounds.extend(userLocation);
      hasValidLocation = true;
    }

    // Adicionar marcadores dos restaurantes
    restaurants.forEach((restaurant) => {
      if (restaurant.latitude && restaurant.longitude) {
        const position = {
          lat: parseFloat(restaurant.latitude),
          lng: parseFloat(restaurant.longitude),
        };

        // Calcular distância se tiver localização do usuário
        let distanceText = '';
        if (userLocation) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            position.lat,
            position.lng
          );
          distanceText = `<p class="text-sm font-semibold text-green-600 mb-1">📍 Distância: ${distance.toFixed(2)} km</p>`;
        }

        // Criar link do Google Maps usando nome do estabelecimento e endereço
        const searchQuery = [
          restaurant.name,
          restaurant.address,
          restaurant.city,
          'RS',
          'Brasil'
        ].filter(part => part && part.trim().length > 0).join(', ');
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;

        const marker = new google.maps.Marker({
          position,
          map: mapRef.current!,
          title: restaurant.name,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(32, 32),
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2 min-w-[200px]">
              <h3 class="font-semibold mb-1 text-lg">${restaurant.name}</h3>
              ${distanceText}
              <p class="text-sm text-gray-600 mb-1">${restaurant.address}</p>
              <p class="text-sm text-blue-600 font-medium">${restaurant.city}</p>
              ${restaurant.phone ? `<p class="text-sm mt-1">📞 ${restaurant.phone}</p>` : ''}
              <a 
                href="${googleMapsUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                style="
                  display: inline-block;
                  margin-top: 8px;
                  padding: 6px 12px;
                  background-color: #4285F4;
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  font-size: 12px;
                  font-weight: 500;
                  transition: background-color 0.2s;
                "
                onmouseover="this.style.backgroundColor='#357ae8'"
                onmouseout="this.style.backgroundColor='#4285F4'"
              >
                🗺️ Ver no Google Maps
              </a>
            </div>
          `,
        });

        marker.addListener('click', () => {
          // Fechar outros info windows
          infoWindowsRef.current.forEach(iw => iw.close());
          if (userInfoWindowRef.current) {
            userInfoWindowRef.current.close();
          }
          infoWindow.open(mapRef.current!, marker);
          onMarkerClick?.(restaurant);
        });

        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
        bounds.extend(position);
        hasValidLocation = true;
      }
    });

    // Ajustar bounds para mostrar todos os marcadores
    if (markersRef.current.length > 0) {
      // Sempre ajustar bounds para incluir todos os marcadores
      mapRef.current.fitBounds(bounds, { padding: 50 });
      
      // Garantir que o zoom não fique muito alto (máximo 15)
      // Isso evita que o mapa fique muito próximo e esconda alguns pinos
      setTimeout(() => {
        if (mapRef.current) {
          const currentZoom = mapRef.current.getZoom();
          if (currentZoom && currentZoom > 15) {
            mapRef.current.setZoom(15);
          }
        }
      }, 100);
    } else if (userLocation) {
      // Se não tiver marcadores mas tiver localização do usuário
      mapRef.current.setCenter(userLocation);
      mapRef.current.setZoom(13);
    } else if (hasValidLocation) {
      // Fallback: centralizar em algum ponto válido
      mapRef.current.setCenter(bounds.getCenter());
      mapRef.current.setZoom(11);
    }
  }, [isLoaded, restaurants, userLocation, onMarkerClick]);

  // Centralizar no restaurante selecionado
  useEffect(() => {
    if (!mapRef.current || !selectedRestaurant) return;
    
    if (selectedRestaurant.latitude && selectedRestaurant.longitude) {
      const position = {
        lat: parseFloat(selectedRestaurant.latitude),
        lng: parseFloat(selectedRestaurant.longitude),
      };
      
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(15);
      
      // Abrir info window do marcador selecionado
      const markerIndex = restaurants.findIndex(r => r.id === selectedRestaurant.id);
      if (markerIndex >= 0 && infoWindowsRef.current[markerIndex]) {
        infoWindowsRef.current.forEach(iw => iw.close());
        infoWindowsRef.current[markerIndex].open(mapRef.current!, markersRef.current[markerIndex]);
      }
    }
  }, [selectedRestaurant, restaurants]);

  if (loadError) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted">
        <p className="text-destructive">Erro ao carregar o mapa. Verifique a chave da API do Google Maps.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted">
        <p>Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full">
      {userLocation && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
          📍 Mostrando estabelecimentos próximos à sua localização
        </div>
      )}
      <div
        ref={(node) => {
          if (node && !mapRef.current) {
            mapRef.current = new google.maps.Map(node, {
              center: userLocation || { lat: -30.0346, lng: -51.2177 },
              zoom: userLocation ? 13 : 11,
            });
            setMapLoaded(true);
          }
        }}
        className="h-full w-full rounded-lg"
      />
    </div>
  );
}
