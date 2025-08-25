import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  address: string;
  price: number;
  lat?: number;
  lng?: number;
  images?: string[];
  beds?: number;
  baths?: number;
  sqft?: number;
}

interface GoogleMapProps {
  properties: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onPropertySelect?: (property: Property) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleMap({ 
  properties, 
  center = { lat: 40.8136, lng: -96.7026 }, // Lincoln, NE
  zoom = 12,
  onPropertySelect 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if Google Maps is loaded
  useEffect(() => {
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };
    checkGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeId: mapType,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    // Add drawing manager
    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#1f2937',
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeColor: '#1f2937',
        clickable: false,
        editable: true,
        zIndex: 1
      }
    });
    drawingManager.setMap(map);

    // Enable drawing mode function
    (window as any).enableDrawing = () => {
      drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
    };

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [isLoaded, center, zoom]);

  // Update map type
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  // Add property markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    properties.forEach((property) => {
      // Use property coordinates if available, otherwise geocode address
      const position = property.lat && property.lng 
        ? { lat: property.lat, lng: property.lng }
        : null;

      if (position) {
        addMarker(property, position);
      } else {
        // Geocode the address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { address: `${property.address}, Lincoln, NE` },
          (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              const position = results[0].geometry.location;
              addMarker(property, { lat: position.lat(), lng: position.lng() });
            }
          }
        );
      }
    });
  }, [properties, isLoaded]);

  const addMarker = (property: Property, position: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current) return;

    const marker = new window.google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title: property.address,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40S32 24.837 32 16C32 7.163 24.837 0 16 0Z" fill="#1f2937"/>
            <circle cx="16" cy="16" r="8" fill="white"/>
            <text x="16" y="20" text-anchor="middle" fill="#1f2937" font-size="10" font-weight="bold">$${Math.round(property.price / 1000)}K</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 40),
        anchor: new window.google.maps.Point(16, 40)
      }
    });

    // Info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 10px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${property.address}</h3>
          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1f2937;">$${property.price.toLocaleString()}</p>
          ${property.beds || property.baths || property.sqft ? `
            <p style="margin: 0; font-size: 14px; color: #666;">
              ${property.beds ? `${property.beds} beds` : ''} 
              ${property.baths ? `• ${property.baths} baths` : ''} 
              ${property.sqft ? `• ${property.sqft} sqft` : ''}
            </p>
          ` : ''}
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current, marker);
      if (onPropertySelect) {
        onPropertySelect(property);
      }
    });

    markersRef.current.push(marker);
  };

  if (!isLoaded) {
    return (
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjork-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <Button 
          size="sm" 
          variant={mapType === 'roadmap' ? 'default' : 'outline'} 
          className="bg-white"
          onClick={() => setMapType('roadmap')}
        >
          Map
        </Button>
        <Button 
          size="sm" 
          variant={mapType === 'satellite' ? 'default' : 'outline'} 
          className="bg-white"
          onClick={() => setMapType('satellite')}
        >
          Satellite
        </Button>
      </div>
      
      <div className="absolute top-4 right-4">
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-white"
          onClick={() => (window as any).enableDrawing?.()}
        >
          Draw
        </Button>
      </div>
    </div>
  );
}
