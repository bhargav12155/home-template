import { useQuery } from "@tanstack/react-query";
import type { Property } from "@shared/schema";

interface PropertyDetailResponse {
  property: Property;
  success: boolean;
  error?: string;
}

export function usePropertyDetail(propertyId: string) {
  return useQuery<PropertyDetailResponse>({
    queryKey: ["/api/property", propertyId],
    queryFn: async () => {
      const response = await fetch(`/api/property/${propertyId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch property details");
      }
      return response.json();
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
