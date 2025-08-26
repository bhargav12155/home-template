import { useInfiniteQuery } from "@tanstack/react-query";
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
    featured: external.listPrice >= 250000,
    luxury: external.listPrice >= 400000,
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
    isIdxListing: true,
    idxSyncedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function useInfinitePropertySearch(searchParams: PropertySearch) {
  const PAGE_SIZE = 20; // Load 20 properties per page

  const query = useInfiniteQuery({
    queryKey: ["/api/properties", searchParams],
    queryFn: async ({ pageParam = 1 }) => {
      // Build query parameters
      const params = new URLSearchParams();

      // Add search parameters
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      // Add pagination
      params.append("page", pageParam.toString());
      params.append("limit", PAGE_SIZE.toString());

      const response = await fetch(`/api/properties?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();

      // Handle both paginated and non-paginated responses
      if (data.data && Array.isArray(data.data)) {
        // Paginated response
        return {
          properties: data.data,
          nextPage: data.hasMore ? pageParam + 1 : undefined,
          total: data.total || data.data.length,
        };
      } else if (Array.isArray(data)) {
        // Non-paginated response - simulate pagination
        const startIndex = (pageParam - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const pageData = data.slice(startIndex, endIndex);

        return {
          properties: pageData,
          nextPage: endIndex < data.length ? pageParam + 1 : undefined,
          total: data.length,
        };
      } else {
        throw new Error("Invalid response format");
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  // Flatten all pages into a single array
  const allProperties =
    query.data?.pages?.flatMap((page) => page.properties) || [];

  return {
    data: allProperties,
    isLoading: query.isLoading,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isExternal: false,
  };
}
