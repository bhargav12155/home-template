import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Property } from '@shared/schema';

interface GoogleMapProps {
  properties: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onPropertySelect?: (property: Property) => void;
  selectedPropertyId?: number | null;
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
  onPropertySelect,
  selectedPropertyId 
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

    if (properties.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    let markersAdded = 0;

    // Add new markers
    properties.forEach((property) => {
      // Use property coordinates if available, otherwise geocode address
      const coordinates = property.coordinates as { lat: number; lng: number } | null;
      const position = coordinates 
        ? coordinates
        : null;

      if (position) {
        addMarker(property, position);
        bounds.extend(position);
        markersAdded++;
      } else {
        // Geocode the address
        const geocoder = new window.google.maps.Geocoder();
        const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
        geocoder.geocode(
          { address: fullAddress },
          (results: any, status: any) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              const pos = { lat: location.lat(), lng: location.lng() };
              addMarker(property, pos);
              bounds.extend(pos);
              markersAdded++;
              
              // Fit bounds after adding markers
              if (markersAdded === properties.length) {
                mapInstanceRef.current?.fitBounds(bounds, { padding: 50 });
              }
            }
          }
        );
      }
    });

    // Fit bounds if we have coordinates already
    if (markersAdded > 0) {
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [properties, isLoaded]);

  // Update marker styles when selectedPropertyId changes
  useEffect(() => {
    markersRef.current.forEach(marker => {
      const propertyId = (marker as any).propertyId;
      if (propertyId !== undefined) {
        const property = properties.find(p => p.id === propertyId);
        if (property) {
          const priceNumber = parseFloat(property.price);
          const priceK = Math.round(priceNumber / 1000);
          const isSelected = selectedPropertyId === propertyId;

          marker.setIcon({
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 20 48 20 48S40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="${isSelected ? '#D4A574' : '#1f2937'}"/>
                <circle cx="20" cy="20" r="12" fill="white"/>
                <text x="20" y="24" text-anchor="middle" fill="${isSelected ? '#D4A574' : '#1f2937'}" font-size="11" font-weight="bold">${priceK > 999 ? `$${(priceK/1000).toFixed(1)}M` : `$${priceK}K`}</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(40, 48),
            anchor: new window.google.maps.Point(20, 48),
          });
          marker.setZIndex(isSelected ? 1000 : 1);
        }
      }
    });
  }, [selectedPropertyId, properties]);

  const addMarker = (property: Property, position: { lat: number; lng: number }) => {
    if (!mapInstanceRef.current) return;

    const priceNumber = parseFloat(property.price);
    const priceK = Math.round(priceNumber / 1000);
    const isSelected = selectedPropertyId === property.id;

    const marker = new window.google.maps.Marker({
      position,
      map: mapInstanceRef.current,
      title: property.address,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 20 48 20 48S40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="${isSelected ? '#D4A574' : '#1f2937'}"/>
            <circle cx="20" cy="20" r="12" fill="white"/>
            <text x="20" y="24" text-anchor="middle" fill="${isSelected ? '#D4A574' : '#1f2937'}" font-size="11" font-weight="bold">${priceK > 999 ? `$${(priceK/1000).toFixed(1)}M` : `$${priceK}K`}</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(40, 48),
        anchor: new window.google.maps.Point(20, 48),
        zIndex: isSelected ? 1000 : 1
      }
    });

    // Store property info on marker
    (marker as any).propertyId = property.id;

    // Format price for display
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceNumber);

    // Info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${property.address}</h3>
          <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #1f2937;">${formattedPrice}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${property.city}, ${property.state} ${property.zipCode}</p>
          ${property.beds || property.baths || property.sqft ? `
            <div style="display: flex; gap: 12px; margin: 8px 0; font-size: 14px; color: #666;">
              ${property.beds ? `<span><strong>${property.beds}</strong> beds</span>` : ''} 
              ${property.baths ? `<span><strong>${parseFloat(property.baths)}</strong> baths</span>` : ''} 
              ${property.sqft ? `<span><strong>${property.sqft.toLocaleString()}</strong> sqft</span>` : ''}
            </div>
          ` : ''}
          ${property.images && property.images.length > 0 ? `
            <img src="${property.images[0]}" alt="Property" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-top: 8px;" />
          ` : ''}
        </div>
      `
    });

    marker.addListener('click', () => {
      // Close any open info windows
      markersRef.current.forEach(m => {
        if ((m as any).infoWindow) {
          (m as any).infoWindow.close();
        }
      });
      
      infoWindow.open(mapInstanceRef.current, marker);
      (marker as any).infoWindow = infoWindow;
      
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
