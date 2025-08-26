import { useQuery } from "@tanstack/react-query";
import type { Property, PropertySearch } from "@shared/schema";

// External API response structure
interface ExternalProperty {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  beds: number;
  baths: number;
  sqft: number;
  listPrice: number;
  soldPrice?: number;
  yearBuilt: number;
  propertyType: string;
  status: string;
  style: string;
  latitude: number;
  longitude: number;
  subdivision?: string;
  imageUrl?: string;
}

interface ExternalApiResponse {
  data: ExternalProperty[];
  total: number;
  page: number;
  limit: number;
}

// Transform external API data to match our Property schema
function transformExternalProperty(external: ExternalProperty): Property {
  const addressParts = external.address.split(",");
  const cleanAddress = addressParts[0]?.trim() || external.address;
  const state = external.state || "NE";
  const zipCode = external.zipCode || "";

  return {
    id: parseInt(external.id) || Math.floor(Math.random() * 1000000),
    mlsId: external.id,
    listingKey: external.id,
    title: `${external.beds} Bed, ${external.baths} Bath ${external.style} in ${external.city}`,
    description: `Beautiful ${external.style.toLowerCase()} home in ${
      external.subdivision || external.city
    }`,
    price: external.listPrice.toString(),
    address: cleanAddress,
    city: external.city,
    state: state,
    zipCode: zipCode,
    beds: external.beds,
    baths: external.baths.toString(),
    sqft: external.sqft,
    yearBuilt: external.yearBuilt,
    propertyType: external.propertyType,
    status: external.status.toLowerCase(),
    standardStatus: external.status,
    featured: external.listPrice >= 250000, // Mark higher priced homes as featured
    luxury: external.listPrice >= 400000, // Mark as luxury if over $400k
    images: external.imageUrl ? [external.imageUrl] : [],
    neighborhood: external.subdivision || null,
    schoolDistrict: null,
    style: external.style,
    coordinates: {
      lat: external.latitude,
      lng: external.longitude,
    },
    features: [],
    architecturalStyle: external.style,
    secondaryStyle: null,
    styleConfidence: null,
    styleFeatures: [],
    styleAnalyzed: false,
    listingAgentKey: null,
    listingOfficeName: null,
    listingContractDate: null,
    daysOnMarket: null,
    originalListPrice: null,
    mlsStatus: external.status,
    modificationTimestamp: null,
    photoCount: external.imageUrl ? 1 : 0,
    virtualTourUrl: null,
    isIdxListing: true, // Mark as external data
    idxSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function usePropertySearch(searchParams: PropertySearch) {
  // For development, always use external API since we're routing through /api/properties to Paragon
  const useExternalApi = false; // Use internal API which routes to Paragon in development

  // Build external params (include Paragon specific ones)
  const paragonParams: Record<string, any> = { ...searchParams };
  if (!paragonParams.status) paragonParams.status = "Active"; // default
  if (!paragonParams.limit) paragonParams.limit = 50;
  if (
    paragonParams.status &&
    !paragonParams.days &&
    (paragonParams.status === "Closed" || paragonParams.status === "Both")
  ) {
    paragonParams.days = 30; // sensible default window
  }

  // Internal API query
  const internalQuery = useQuery<Property[]>({
    queryKey: ["/api/properties", searchParams],
    enabled: !useExternalApi,
  });

  // External API query (CMA or Paragon). Prefer Paragon now for Omaha.
  const externalQuery = useQuery<any>({
    queryKey: ["/api/paragon/properties", paragonParams],
    enabled: useExternalApi,
    staleTime: 60 * 1000, // allow refresh every minute matching server cache TTL
  });

  if (useExternalApi) {
    const rawList: any[] = externalQuery.data?.data || [];
    const transformedData = rawList.map((p: any) => {
      if (p.mlsId) return p as Property; // already mapped by server
      return transformExternalProperty(p as any);
    });

    // Apply additional filtering based on search params
    const filteredData = transformedData.filter((property) => {
      if (searchParams.beds && property.beds < searchParams.beds) return false;
      if (searchParams.baths && parseFloat(property.baths) < searchParams.baths)
        return false;
      if (
        searchParams.propertyType &&
        property.propertyType !== searchParams.propertyType
      )
        return false;
      if (searchParams.luxury && !property.luxury) return false;
      if (searchParams.featured && !property.featured) return false;
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        const searchableText =
          `${property.title} ${property.description} ${property.address} ${property.city} ${property.neighborhood}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }
      return true;
    });

    return {
      data: filteredData,
      isLoading: externalQuery.isLoading,
      error: externalQuery.error,
      isExternal: true,
    };
  }

  return {
    data: internalQuery.data?.data || internalQuery.data || [],
    isLoading: internalQuery.isLoading,
    error: internalQuery.error,
    isExternal: false,
  };
}
