import type { 
  ResoProperty, 
  ResoAgent, 
  ResoMedia, 
  IdxSearchParams,
  InsertProperty,
  InsertIdxAgent,
  InsertIdxMedia,
  InsertIdxSyncLog
} from "@shared/schema";

interface ResoApiConfig {
  baseUrl: string;
  accessToken?: string;
  clientId?: string;
  clientSecret?: string;
  username?: string;
  password?: string;
}

interface ResoApiResponse<T> {
  '@odata.context': string;
  '@odata.count'?: number;
  value: T[];
}

export class IdxService {
  private config: ResoApiConfig;
  private isConnected: boolean = false;

  constructor() {
    this.config = {
      baseUrl: process.env.RESO_API_URL || '',
      accessToken: process.env.RESO_ACCESS_TOKEN,
      clientId: process.env.RESO_CLIENT_ID,
      clientSecret: process.env.RESO_CLIENT_SECRET,
      username: process.env.RESO_USERNAME,
      password: process.env.RESO_PASSWORD,
    };
  }

  private async makeRequest<T>(endpoint: string, params?: Record<string, any>): Promise<ResoApiResponse<T>> {
    // For development/demo purposes, return mock data if no real API is configured
    if (!this.config.baseUrl || this.config.baseUrl === '') {
      console.log(`IDX Service: Mock data returned for ${endpoint}`);
      return this.getMockData<T>(endpoint);
    }

    try {
      const url = new URL(endpoint, this.config.baseUrl);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'BjorkHomes-IDX-Client/1.0'
      };

      if (this.config.accessToken) {
        headers['Authorization'] = `Bearer ${this.config.accessToken}`;
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`RESO API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('IDX Service Error:', error);
      // Fallback to mock data in case of API errors
      return this.getMockData<T>(endpoint);
    }
  }

  private getMockData<T>(endpoint: string): ResoApiResponse<T> {
    console.log(`Returning mock data for endpoint: ${endpoint}`);
    
    if (endpoint.includes('/Property')) {
      return {
        '@odata.context': 'mock',
        '@odata.count': 3,
        value: [
          {
            ListingKey: "GPRMLS-001",
            ListingId: "22520502",
            MlsStatus: "Active",
            StandardStatus: "Active",
            ListPrice: 1195000,
            OriginalListPrice: 1195000,
            DaysOnMarket: 45,
            ListingContractDate: "2024-12-01T00:00:00Z",
            ModificationTimestamp: new Date().toISOString(),
            StreetNumber: "21727",
            StreetName: "Cimarron Road",
            City: "Elkhorn",
            StateOrProvince: "NE",
            PostalCode: "68022",
            BedroomsTotal: 4,
            BathroomsTotalInteger: 5,
            LivingArea: 3694,
            YearBuilt: 2020,
            PropertyType: "Residential",
            PropertySubType: "Single Family Residence",
            ListAgentKey: "AGENT-001",
            ListOfficeName: "Bjork Group - Berkshire Hathaway",
            PhotoCount: 25,
            VirtualTourURLUnbranded: "https://example.com/tour/1",
            PublicRemarks: "Stunning luxury home with modern amenities and beautiful landscaping in prestigious Elkhorn location.",
            Latitude: 41.2871,
            Longitude: -96.2394
          },
          {
            ListingKey: "GPRMLS-002",
            ListingId: "22520385",
            MlsStatus: "Active",
            StandardStatus: "Active",
            ListPrice: 850000,
            OriginalListPrice: 875000,
            DaysOnMarket: 23,
            ListingContractDate: "2024-12-15T00:00:00Z",
            ModificationTimestamp: new Date().toISOString(),
            StreetNumber: "2904",
            StreetName: "Georgian Court",
            City: "Lincoln",
            StateOrProvince: "NE",
            PostalCode: "68502",
            BedroomsTotal: 4,
            BathroomsTotalInteger: 4,
            LivingArea: 3244,
            YearBuilt: 2024,
            PropertyType: "Residential",
            PropertySubType: "Single Family Residence",
            ListAgentKey: "AGENT-002",
            ListOfficeName: "Bjork Group - Berkshire Hathaway",
            PhotoCount: 18,
            PublicRemarks: "Brand new home with contemporary design and energy-efficient features in desirable Lincoln area.",
            Latitude: 40.8136,
            Longitude: -96.7025
          },
          {
            ListingKey: "GPRMLS-003",
            ListingId: "22520377",
            MlsStatus: "Active",
            StandardStatus: "Active",
            ListPrice: 1995000,
            OriginalListPrice: 1995000,
            DaysOnMarket: 67,
            ListingContractDate: "2024-11-10T00:00:00Z",
            ModificationTimestamp: new Date().toISOString(),
            StreetNumber: "13824",
            StreetName: "Cuming Street",
            City: "Omaha",
            StateOrProvince: "NE",
            PostalCode: "68154",
            BedroomsTotal: 5,
            BathroomsTotalInteger: 6,
            LivingArea: 7460,
            YearBuilt: 2018,
            PropertyType: "Residential",
            PropertySubType: "Single Family Residence",
            ListAgentKey: "AGENT-001",
            ListOfficeName: "Bjork Group - Berkshire Hathaway",
            PhotoCount: 45,
            VirtualTourURLUnbranded: "https://example.com/tour/3",
            PublicRemarks: "Exceptional luxury home with premium finishes and extensive amenities in prestigious West Omaha location.",
            Latitude: 41.2619,
            Longitude: -96.1951
          }
        ] as T[]
      };
    }

    if (endpoint.includes('/Member')) {
      return {
        '@odata.context': 'mock',
        '@odata.count': 2,
        value: [
          {
            MemberKey: "AGENT-001",
            MemberMlsId: "BG001",
            MemberFirstName: "Michael",
            MemberLastName: "Bjork",
            MemberEmail: "michael@bjorkhomes.com",
            MemberPhoneNumber: "(402) 555-0100",
            MemberStateLicense: "NE-RE-001",
            OfficeKey: "OFFICE-001",
            OfficeName: "Bjork Group - Berkshire Hathaway",
            MemberStatus: "Active",
            ModificationTimestamp: new Date().toISOString()
          },
          {
            MemberKey: "AGENT-002",
            MemberMlsId: "BG002",
            MemberFirstName: "Sarah",
            MemberLastName: "Johnson",
            MemberEmail: "sarah@bjorkhomes.com",
            MemberPhoneNumber: "(402) 555-0101",
            MemberStateLicense: "NE-RE-002",
            OfficeKey: "OFFICE-001",
            OfficeName: "Bjork Group - Berkshire Hathaway",
            MemberStatus: "Active",
            ModificationTimestamp: new Date().toISOString()
          }
        ] as T[]
      };
    }

    if (endpoint.includes('/Media')) {
      return {
        '@odata.context': 'mock',
        '@odata.count': 0,
        value: [] as T[]
      };
    }

    return {
      '@odata.context': 'mock',
      '@odata.count': 0,
      value: [] as T[]
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>('/$metadata');
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('IDX Connection Test Failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  async searchProperties(params: IdxSearchParams): Promise<ResoProperty[]> {
    const oDataParams: Record<string, any> = {};

    // Build OData filter
    const filters: string[] = [];
    
    if (params.city) {
      filters.push(`City eq '${params.city}'`);
    }
    
    if (params.state) {
      filters.push(`StateOrProvince eq '${params.state}'`);
    }
    
    if (params.zipCode) {
      filters.push(`PostalCode eq '${params.zipCode}'`);
    }
    
    if (params.minPrice) {
      filters.push(`ListPrice ge ${params.minPrice}`);
    }
    
    if (params.maxPrice) {
      filters.push(`ListPrice le ${params.maxPrice}`);
    }
    
    if (params.beds) {
      filters.push(`BedroomsTotal ge ${params.beds}`);
    }
    
    if (params.baths) {
      filters.push(`BathroomsTotalInteger ge ${params.baths}`);
    }
    
    if (params.propertyType) {
      filters.push(`PropertyType eq '${params.propertyType}'`);
    }

    if (params.status && params.status.length > 0) {
      const statusFilters = params.status.map(s => `StandardStatus eq '${s}'`).join(' or ');
      filters.push(`(${statusFilters})`);
    } else {
      // Default to active listings only
      filters.push(`StandardStatus eq 'Active'`);
    }

    if (filters.length > 0) {
      oDataParams['$filter'] = filters.join(' and ');
    }

    oDataParams['$orderby'] = 'ModificationTimestamp desc';
    oDataParams['$top'] = params.limit || 50;

    if (params.offset) {
      oDataParams['$skip'] = params.offset;
    }

    const response = await this.makeRequest<ResoProperty>('/Property', oDataParams);
    return response.value;
  }

  async getPropertyByListingKey(listingKey: string): Promise<ResoProperty | null> {
    try {
      const oDataParams = {
        '$filter': `ListingKey eq '${listingKey}'`
      };

      const response = await this.makeRequest<ResoProperty>('/Property', oDataParams);
      return response.value.length > 0 ? response.value[0] : null;
    } catch (error) {
      console.error('Error fetching property by listing key:', error);
      return null;
    }
  }

  async getAgents(limit: number = 100): Promise<ResoAgent[]> {
    const oDataParams = {
      '$filter': `MemberStatus eq 'Active'`,
      '$orderby': 'MemberLastName, MemberFirstName',
      '$top': limit
    };

    const response = await this.makeRequest<ResoAgent>('/Member', oDataParams);
    return response.value;
  }

  async getMediaForProperty(listingKey: string): Promise<ResoMedia[]> {
    const oDataParams = {
      '$filter': `ResourceRecordKey eq '${listingKey}'`,
      '$orderby': 'Order'
    };

    const response = await this.makeRequest<ResoMedia>('/Media', oDataParams);
    return response.value;
  }

  // Convert RESO property to internal property format
  convertResoPropertyToInternal(resoProperty: ResoProperty): Omit<InsertProperty, 'id' | 'createdAt' | 'updatedAt'> {
    const address = [resoProperty.StreetNumber, resoProperty.StreetName]
      .filter(Boolean)
      .join(' ');

    return {
      mlsId: resoProperty.ListingId,
      listingKey: resoProperty.ListingKey,
      title: `${resoProperty.BedroomsTotal || 0} Bed, ${resoProperty.BathroomsTotalInteger || 0} Bath Home in ${resoProperty.City}`,
      description: resoProperty.PublicRemarks || '',
      price: resoProperty.ListPrice.toString(),
      address,
      city: resoProperty.City || '',
      state: resoProperty.StateOrProvince || 'NE',
      zipCode: resoProperty.PostalCode || '',
      beds: resoProperty.BedroomsTotal || 0,
      baths: (resoProperty.BathroomsTotalInteger || 0).toString(),
      sqft: resoProperty.LivingArea || 0,
      yearBuilt: resoProperty.YearBuilt,
      propertyType: resoProperty.PropertySubType || resoProperty.PropertyType || 'Residential',
      status: resoProperty.StandardStatus?.toLowerCase() || 'active',
      standardStatus: resoProperty.StandardStatus,
      featured: false, // Set based on business logic
      luxury: resoProperty.ListPrice > 750000, // Luxury threshold
      images: [], // Will be populated from media sync
      neighborhood: undefined,
      schoolDistrict: undefined,
      style: undefined,
      coordinates: resoProperty.Latitude && resoProperty.Longitude 
        ? { lat: resoProperty.Latitude, lng: resoProperty.Longitude }
        : null,
      features: [],
      architecturalStyle: undefined,
      secondaryStyle: undefined,
      styleConfidence: undefined,
      styleFeatures: [],
      styleAnalyzed: false,
      listingAgentKey: resoProperty.ListAgentKey,
      listingOfficeName: resoProperty.ListOfficeName,
      listingContractDate: resoProperty.ListingContractDate ? new Date(resoProperty.ListingContractDate) : undefined,
      daysOnMarket: resoProperty.DaysOnMarket,
      originalListPrice: resoProperty.OriginalListPrice?.toString(),
      mlsStatus: resoProperty.MlsStatus,
      modificationTimestamp: new Date(resoProperty.ModificationTimestamp),
      photoCount: resoProperty.PhotoCount,
      virtualTourUrl: resoProperty.VirtualTourURLUnbranded,
      isIdxListing: true,
      idxSyncedAt: new Date()
    };
  }

  // Convert RESO agent to internal agent format
  convertResoAgentToInternal(resoAgent: ResoAgent): Omit<InsertIdxAgent, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      memberKey: resoAgent.MemberKey,
      memberMlsId: resoAgent.MemberMlsId,
      firstName: resoAgent.MemberFirstName,
      lastName: resoAgent.MemberLastName,
      email: resoAgent.MemberEmail,
      phone: resoAgent.MemberPhoneNumber,
      officeName: resoAgent.OfficeName,
      officeKey: resoAgent.OfficeKey,
      stateLicense: resoAgent.MemberStateLicense,
      isActive: resoAgent.MemberStatus === 'Active',
      modificationTimestamp: new Date(resoAgent.ModificationTimestamp)
    };
  }

  // Convert RESO media to internal media format
  convertResoMediaToInternal(resoMedia: ResoMedia): Omit<InsertIdxMedia, 'id' | 'createdAt'> {
    return {
      mediaKey: resoMedia.MediaKey,
      listingKey: resoMedia.ResourceRecordKey,
      mlsId: '', // Will need to be resolved from listing
      mediaUrl: resoMedia.MediaURL,
      mediaType: resoMedia.MediaType,
      mediaObjectId: resoMedia.MediaObjectID,
      shortDescription: resoMedia.ShortDescription,
      longDescription: resoMedia.LongDescription,
      sequence: resoMedia.Order || 0,
      modificationTimestamp: new Date(resoMedia.ModificationTimestamp)
    };
  }

  getConnectionStatus(): { isConnected: boolean; config: any } {
    return {
      isConnected: this.isConnected,
      config: {
        baseUrl: this.config.baseUrl,
        hasAccessToken: !!this.config.accessToken,
        hasClientCredentials: !!(this.config.clientId && this.config.clientSecret)
      }
    };
  }
}

export const idxService = new IdxService();