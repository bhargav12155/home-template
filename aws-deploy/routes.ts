import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  analyzePropertyStyle,
  batchAnalyzeStyles,
  getStyleKeywords,
  SUPPORTED_STYLES,
} from "./ai-style-analyzer";
import IdxSyncService from "./idx-sync-service";
import { emailService } from "./email-service";
import { externalPropertyAPI } from "./external-api";
import { AuthenticatedRequest, authenticateUser } from "./auth-middleware";
import {
  insertPropertySchema,
  insertCommunitySchema,
  insertBlogPostSchema,
  insertLeadSchema,
  contactFormSchema,
  propertySearchSchema,
  insertTrackingCodeSchema,
} from "@shared/schema";

// Function to generate market insight blog posts from property data
function generateMarketInsightPosts(properties: any[]) {
  if (!properties || properties.length === 0) return [];

  const posts = [];
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate market statistics
  const totalProperties = properties.length;
  const averagePrice =
    properties.reduce(
      (sum, prop) => sum + (prop.listPrice || prop.soldPrice || 0),
      0
    ) / totalProperties;
  const averageSqft =
    properties.reduce((sum, prop) => sum + (prop.sqft || 0), 0) /
    totalProperties;
  const pricePerSqft = averagePrice / averageSqft;

  // Group by neighborhoods
  const neighborhoods = properties.reduce((acc, prop) => {
    const neighborhood = prop.subdivision || prop.city;
    if (!acc[neighborhood]) acc[neighborhood] = [];
    acc[neighborhood].push(prop);
    return acc;
  }, {});

  // Market Overview Post
  posts.push({
    id: 1,
    title: `Omaha Real Estate Market Report - ${formattedDate}`,
    slug: "omaha-market-report-" + currentDate.toISOString().split("T")[0],
    excerpt: `Current market analysis of ${totalProperties} properties showing average price of $${Math.round(
      averagePrice
    ).toLocaleString()}`,
    content: `# Omaha Real Estate Market Analysis

**Market Overview for ${formattedDate}**

Our latest analysis of ${totalProperties} properties in the Omaha area reveals important market trends:

## Key Market Statistics
- **Average List Price**: $${Math.round(averagePrice).toLocaleString()}
- **Average Square Footage**: ${Math.round(averageSqft).toLocaleString()} sq ft
- **Average Price Per Square Foot**: $${Math.round(pricePerSqft)}
- **Properties Analyzed**: ${totalProperties}

## Market Insights
The Omaha real estate market continues to show strong fundamentals with properties ranging from $${Math.min(
      ...properties.map((p) => p.listPrice || p.soldPrice || 0)
    ).toLocaleString()} to $${Math.max(
      ...properties.map((p) => p.listPrice || p.soldPrice || 0)
    ).toLocaleString()}.

${
  Object.keys(neighborhoods).length > 1
    ? `## Neighborhood Highlights
${Object.entries(neighborhoods)
  .slice(0, 5)
  .map(
    ([name, props]) =>
      `- **${name}**: ${(props as any[]).length} properties, avg $${Math.round(
        (props as any[]).reduce(
          (sum, p) => sum + (p.listPrice || p.soldPrice || 0),
          0
        ) / (props as any[]).length
      ).toLocaleString()}`
  )
  .join("\n")}`
    : ""
}

*Data sourced from current MLS listings and recent sales.*`,
    category: "Market Analysis",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    published: true,
    featured: true,
    createdAt: currentDate,
    updatedAt: currentDate,
  });

  // Price Range Analysis Post
  const priceRanges = {
    "Under $200k": properties.filter(
      (p) => (p.listPrice || p.soldPrice || 0) < 200000
    ).length,
    "$200k-$300k": properties.filter((p) => {
      const price = p.listPrice || p.soldPrice || 0;
      return price >= 200000 && price < 300000;
    }).length,
    "$300k-$400k": properties.filter((p) => {
      const price = p.listPrice || p.soldPrice || 0;
      return price >= 300000 && price < 400000;
    }).length,
    "Over $400k": properties.filter(
      (p) => (p.listPrice || p.soldPrice || 0) >= 400000
    ).length,
  };

  posts.push({
    id: 2,
    title: "Understanding Omaha Home Price Ranges: Where to Find Value",
    slug: "omaha-price-ranges-analysis",
    excerpt:
      "Comprehensive breakdown of property availability across different price segments in the Omaha market.",
    content: `# Understanding Omaha Home Price Ranges

Finding the right home at the right price requires understanding the current market distribution. Here's what our latest data shows:

## Price Distribution Analysis
${Object.entries(priceRanges)
  .map(
    ([range, count]) =>
      `- **${range}**: ${count} properties (${Math.round(
        (count / totalProperties) * 100
      )}% of market)`
  )
  .join("\n")}

## What This Means for Buyers
- **First-time buyers**: ${
      priceRanges["Under $200k"]
    } homes available under $200k
- **Move-up buyers**: Strong selection in the $200k-$400k range with ${
      priceRanges["$200k-$300k"] + priceRanges["$300k-$400k"]
    } properties
- **Luxury buyers**: ${priceRanges["Over $400k"]} premium properties available

The current market offers opportunities across all price points, with particularly strong inventory in the middle price ranges.

*Contact our team to explore properties in your preferred price range.*`,
    category: "Buyer Guide",
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    published: true,
    featured: false,
    createdAt: new Date(currentDate.getTime() - 86400000), // 1 day ago
    updatedAt: new Date(currentDate.getTime() - 86400000),
  });

  // Investment Opportunities Post
  const investmentProperties = properties.filter(
    (p) => (p.listPrice || p.soldPrice || 0) < averagePrice
  );

  posts.push({
    id: 3,
    title: "Investment Opportunities in Omaha Real Estate",
    slug: "omaha-investment-opportunities",
    excerpt: `Discover ${investmentProperties.length} potential investment properties below market average pricing.`,
    content: `# Investment Opportunities in Omaha

The Omaha real estate market presents compelling investment opportunities for both new and experienced investors.

## Current Investment Landscape
- **Below-Average Pricing**: ${
      investmentProperties.length
    } properties priced below the market average of $${Math.round(
      averagePrice
    ).toLocaleString()}
- **Average Price Per Square Foot**: $${Math.round(
      pricePerSqft
    )} provides good value compared to national averages
- **Diverse Property Types**: Options ranging from single-family homes to multi-unit properties

## Key Investment Metrics
- **Market Average Price**: $${Math.round(averagePrice).toLocaleString()}
- **Value Properties**: Properties starting at $${Math.min(
      ...investmentProperties.map((p) => p.listPrice || p.soldPrice || 0)
    ).toLocaleString()}
- **Potential ROI**: Favorable cap rates in emerging neighborhoods

## Why Invest in Omaha?
- Strong job market with Fortune 500 companies
- Stable property values with consistent appreciation
- Growing population and economic development
- Affordable compared to coastal markets

*Ready to explore investment opportunities? Contact us for a personalized market analysis.*`,
    category: "Investment",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    published: true,
    featured: false,
    createdAt: new Date(currentDate.getTime() - 172800000), // 2 days ago
    updatedAt: new Date(currentDate.getTime() - 172800000),
  });

  return posts;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Elastic Beanstalk
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "bjork-homes-real-estate",
    });
  });

  // Initialize IDX sync service
  const paragonCache = new Map<string, { ts: number; data: any }>();
  const PARAGON_TTL_MS = 60_000; // 1 minute cache

  app.get("/api/paragon/properties", async (req, res) => {
    try {
      const {
        minPrice,
        maxPrice,
        city = "omaha",
        status = "Active", // Active | Closed | Both
        days = "30", // recent days for closed
        limit = "50",
        noCache = "0",
        includeImages = "0", // when 1, attempt to pull media (best-effort)
      } = req.query as Record<string, string>;

      const sinceDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() - (parseInt(days, 10) || 30));
        return d.toISOString().split("T")[0];
      })();

      const normalizedCity = city.toLowerCase();

      // Build price clause only if min/max price are provided
      let priceClause = "";
      if (minPrice && maxPrice) {
        priceClause = `((ListPrice ge ${minPrice} and ListPrice le ${maxPrice}) or (ClosePrice ge ${minPrice} and ClosePrice le ${maxPrice}))`;
      } else if (minPrice) {
        priceClause = `(ListPrice ge ${minPrice} or ClosePrice ge ${minPrice})`;
      } else if (maxPrice) {
        priceClause = `(ListPrice le ${maxPrice} or ClosePrice le ${maxPrice})`;
      }

      const cityClause = `tolower(City) eq '${normalizedCity}'`;

      let statusClause = "";
      if (status.toLowerCase() === "active") {
        statusClause = `StandardStatus eq 'Active'`;
      } else if (status.toLowerCase() === "closed") {
        statusClause = `(StandardStatus eq 'Closed' and CloseDate ge ${sinceDate})`;
      } else if (status.toLowerCase() === "both") {
        statusClause = `((StandardStatus eq 'Active') or (StandardStatus eq 'Closed' and CloseDate ge ${sinceDate}))`;
      }

      const filterParts = [cityClause];
      if (priceClause) filterParts.push(priceClause);
      if (statusClause) filterParts.push(statusClause);
      const filter = encodeURIComponent(filterParts.join(" and "));

      const select = encodeURIComponent(
        [
          "ListingKey",
          "City",
          "UnparsedAddress",
          "ListPrice",
          "ClosePrice",
          "CloseDate",
          "PostalCode",
          "StateOrProvince",
          "BedroomsTotal",
          "BathroomsTotalInteger",
          "AboveGradeFinishedArea",
          "YearBuilt",
          "SubdivisionName",
          "Latitude",
          "Longitude",
          "StandardStatus",
        ].join(",")
      );

      const accessToken =
        process.env.PARAGON_ACCESS_TOKEN || "429b18690390adfa776f0b727dfc78cc";
      const top = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
      const url = `https://api.paragonapi.com/api/v2/OData/bk9/Properties?access_token=${accessToken}&$filter=${filter}&$select=${select}&$orderby=ListPrice%20desc&$top=${top}`;

      const cacheKey = url;
      const now = Date.now();
      // Normalize helper for matching ids reliably
      const normalizeId = (v: string | null | undefined) =>
        (v || "").trim().toLowerCase();
      const excludedMlsIdsRaw = ["655d2b69f2d8ddd5f56afd5312a543ca"]; // extendable
      const excludedMlsIds = new Set<string>(
        excludedMlsIdsRaw.map((id) => normalizeId(id))
      );
      const cached = paragonCache.get(cacheKey);
      if (noCache !== "1" && cached && now - cached.ts < PARAGON_TTL_MS) {
        // sanitize cached data for exclusions
        const cleanedData = cached.data.data.filter(
          (p: any) => !excludedMlsIds.has(normalizeId(p.mlsId))
        );
        let finalPayload = cached.data;
        if (cleanedData.length !== cached.data.data.length) {
          finalPayload = { ...cached.data, data: cleanedData };
          paragonCache.set(cacheKey, { ts: now, data: finalPayload });
        }
        return res.json({ ...finalPayload, cached: true });
      }

      const r = await fetch(url, { headers: { Accept: "application/json" } });
      if (!r.ok) {
        const body = await r.text();
        return res.status(500).json({
          message: "Failed to fetch Paragon properties",
          error: `Paragon API ${r.status}: ${body}`,
          request: { url, filter: decodeURIComponent(filter) },
        });
      }
      const data = await r.json();
      const rawItems = data.value || data.data || [];
      if (!Array.isArray(rawItems)) {
        console.warn("Unexpected Paragon response shape", Object.keys(data));
      }
      const mapped = rawItems.map((p: any) => {
        // Attempt to surface first media URLs if present (only if Paragon included them implicitly)
        const media: any[] = Array.isArray(p.Media) ? p.Media : [];
        const imageUrls = media
          .sort((a, b) => (a?.Order || 0) - (b?.Order || 0))
          .slice(0, 5)
          .map((m) => m?.MediaURL)
          .filter(Boolean);
        return {
          id: p.ListingKey || Math.random().toString(36).slice(2),
          mlsId: p.ListingKey,
          listingKey: p.ListingKey,
          title: `${p.BedroomsTotal || "?"} Bed ${
            p.BathroomsTotalInteger || "?"
          } Bath in ${p.City}`,
          description: null,
          price: String(p.ListPrice || p.ClosePrice || 0),
          address: p.UnparsedAddress,
          city: p.City,
          state: p.StateOrProvince,
          zipCode: p.PostalCode,
          beds: p.BedroomsTotal || 0,
          baths: String(p.BathroomsTotalInteger || 0),
          sqft: p.AboveGradeFinishedArea || 0,
          yearBuilt: p.YearBuilt || null,
          propertyType: p.PropertySubType || "Residential",
          status: (p.StandardStatus || "").toLowerCase(),
          standardStatus: p.StandardStatus,
          featured: (p.ListPrice || p.ClosePrice || 0) >= 150000,
          luxury: (p.ListPrice || p.ClosePrice || 0) >= 400000,
          images: imageUrls,
          neighborhood: p.SubdivisionName || null,
          schoolDistrict: null,
          style: null,
          coordinates: { lat: p.Latitude, lng: p.Longitude },
          features: [],
          architecturalStyle: null,
          secondaryStyle: null,
          styleConfidence: null,
          styleFeatures: [],
          styleAnalyzed: false,
          listingAgentKey: null,
          listingOfficeName: null,
          listingContractDate: null,
          daysOnMarket: null,
          originalListPrice: p.ListPrice || null,
          mlsStatus: p.StandardStatus,
          modificationTimestamp: p.CloseDate || null,
          photoCount: media.length || 0,
          virtualTourUrl: null,
          isIdxListing: true,
          idxSyncedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      // Exclude specific MLS ids (user provided) - can be expanded (same set as cache sanitization)
      const cleaned = mapped.filter(
        (p: any) => !excludedMlsIds.has(normalizeId(p.mlsId))
      );
      if (mapped.length !== cleaned.length) {
        console.log(
          `Excluded ${
            mapped.length - cleaned.length
          } listing(s) by MLS id filter.`
        );
      }

      // Optionally enrich images via per-listing fetch (only if includeImages=1 and we still have empties)
      if (includeImages === "1") {
        const needImages = cleaned.filter((p: any) => !p.images.length);
        const MAX_ENRICH = 20; // safety cap
        const subset = needImages.slice(0, MAX_ENRICH);
        if (subset.length) {
          const detailPromises = subset.map(async (prop: any) => {
            try {
              const detailUrl = `https://api.paragonapi.com/api/v2/OData/bk9/Property('${prop.mlsId}')?access_token=${accessToken}`;
              const dr = await fetch(detailUrl, {
                headers: { Accept: "application/json" },
              });
              if (!dr.ok) return;
              const dj = await dr.json();
              const media: any[] = Array.isArray(dj.Media) ? dj.Media : [];
              const imgs = media
                .sort((a, b) => (a?.Order || 0) - (b?.Order || 0))
                .slice(0, 5)
                .map((m) => m?.MediaURL)
                .filter(Boolean);
              if (imgs.length) {
                prop.images = imgs;
                prop.photoCount = media.length || imgs.length;
              }
            } catch (e) {
              // swallow individual errors
            }
          });
          await Promise.all(detailPromises);
        }
      }

      const payload = {
        data: cleaned,
        source: "paragon",
        query: {
          city: normalizedCity,
          minPrice,
          maxPrice,
          status,
          sinceDate:
            status.toLowerCase() === "closed" || status.toLowerCase() === "both"
              ? sinceDate
              : null,
          limit: top,
          includeImages: includeImages === "1",
        },
        cached: false,
      };
      paragonCache.set(cacheKey, { ts: now, data: payload });
      res.json(payload);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch Paragon properties",
        error: (error as any)?.message || String(error),
      });
    }
  });
  const idxSyncService = new IdxSyncService(storage);
  // Properties endpoints
  app.get("/api/properties", async (req, res) => {
    try {
      const searchParams = propertySearchSchema.parse(req.query);

      // In development mode, use Paragon API instead of database
      if (process.env.NODE_ENV === "development") {
        // Build Paragon API parameters based on search criteria
        const paragonParams = new URLSearchParams({
          city: searchParams.city || "lincoln", // Default to Lincoln, NE as per header
          status: "Active",
          limit: (searchParams.limit || 20).toString(),
          includeImages: "1",
        });

        // Add price filters if specified
        if (searchParams.minPrice) {
          paragonParams.set("minPrice", searchParams.minPrice.toString());
        }
        if (searchParams.maxPrice) {
          paragonParams.set("maxPrice", searchParams.maxPrice.toString());
        }

        // For featured listings, remove any price constraints and get higher-end properties
        if (searchParams.featured) {
          paragonParams.delete("minPrice");
          paragonParams.delete("maxPrice");
          paragonParams.set("minPrice", "150000"); // Set a minimum for featured
        }

        // For luxury listings, set high minimum price
        if (searchParams.luxury) {
          paragonParams.delete("minPrice");
          paragonParams.delete("maxPrice");
          paragonParams.set("minPrice", "400000"); // Luxury threshold
        }

        const paragonUrl = `http://localhost:5080/api/paragon/properties?${paragonParams}`;
        try {
          const response = await fetch(paragonUrl);
          if (response.ok) {
            const data = await response.json();

            // If we have data, filter it further based on search criteria
            if (data.data && Array.isArray(data.data)) {
              let filteredData = data.data;

              // Filter by beds if specified
              if (searchParams.beds) {
                filteredData = filteredData.filter(
                  (prop: any) => prop.beds >= searchParams.beds!
                );
              }

              // Filter by baths if specified
              if (searchParams.baths) {
                filteredData = filteredData.filter(
                  (prop: any) => parseFloat(prop.baths) >= searchParams.baths!
                );
              }

              // Filter by property type if specified
              if (searchParams.propertyType) {
                filteredData = filteredData.filter(
                  (prop: any) =>
                    prop.propertyType
                      ?.toLowerCase()
                      .includes(searchParams.propertyType!.toLowerCase()) ||
                    (searchParams.propertyType === "Single Family" &&
                      (prop.propertyType
                        ?.toLowerCase()
                        .includes("residential") ||
                        prop.propertyType?.toLowerCase().includes("single")))
                );
              }

              // Text search in address, city, or neighborhood
              if (searchParams.query) {
                const query = searchParams.query.toLowerCase();
                filteredData = filteredData.filter(
                  (prop: any) =>
                    prop.address?.toLowerCase().includes(query) ||
                    prop.city?.toLowerCase().includes(query) ||
                    prop.neighborhood?.toLowerCase().includes(query) ||
                    prop.zipCode?.includes(query)
                );
              }

              // Apply limit after filtering
              const finalLimit = searchParams.limit || 20;
              filteredData = filteredData.slice(0, finalLimit);

              res.json({
                data: filteredData,
                total: filteredData.length,
                hasMore: false,
                page: 1,
              });
              return;
            }

            res.json(data);
            return;
          }
        } catch (error) {
          console.error("Error calling Paragon API:", error);
        }

        // Fallback to external API if Paragon fails
        if (searchParams.featured || searchParams.luxury) {
          const luxuryProperties =
            await externalPropertyAPI.getLuxuryProperties();
          const transformedProperties = luxuryProperties.map((p: any) =>
            externalPropertyAPI.transformToProperty(p)
          );
          const limitedProperties = searchParams.limit
            ? transformedProperties.slice(0, searchParams.limit)
            : transformedProperties;
          res.json(limitedProperties);
          return;
        }

        // For other searches, get properties from Lincoln (default) or specified city
        const city = searchParams.city || "Lincoln";
        const externalProperties =
          await externalPropertyAPI.getPropertiesForCity(city, {
            minPrice: searchParams.minPrice,
            maxPrice: searchParams.maxPrice,
            limit: searchParams.limit || 20,
          });
        const transformedProperties = externalProperties.map((p: any) =>
          externalPropertyAPI.transformToProperty(p)
        );
        res.json(transformedProperties);
        return;
      }

      // Production mode uses database
      const properties = await storage.getProperties(searchParams);
      res.json(properties);
    } catch (error) {
      console.error("Properties endpoint error:", error);
      res.status(400).json({ message: "Invalid search parameters", error });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      // Parse query parameters for filtering
      const {
        propertyType,
        minPrice,
        maxPrice,
        beds,
        baths,
        location,
        features,
        sortBy,
        limit = 20,
      } = req.query;

      // In development mode, use Paragon API with filters
      if (process.env.NODE_ENV === "development") {
        const paragonParams = new URLSearchParams({
          city: (location as string) || "lincoln",
          status: "Active",
          limit: limit.toString(),
          includeImages: "1",
          minPrice: minPrice ? minPrice.toString() : "150000", // Featured minimum
        });

        if (maxPrice) paragonParams.set("maxPrice", maxPrice.toString());
        if (beds) paragonParams.set("beds", beds.toString());
        if (baths) paragonParams.set("baths", baths.toString());

        const paragonUrl = `http://localhost:5080/api/paragon/properties?${paragonParams}`;

        try {
          const response = await fetch(paragonUrl);
          if (response.ok) {
            let data = await response.json();

            // Apply additional filtering
            if (data.properties) {
              let filteredProperties = data.properties;

              // Filter by property type if specified
              if (propertyType && propertyType !== "any") {
                filteredProperties = filteredProperties.filter((prop: any) => {
                  const propType = prop.PropertyType?.toLowerCase() || "";
                  switch (propertyType) {
                    case "single-family":
                      return (
                        propType.includes("residential") ||
                        propType.includes("single")
                      );
                    case "condo":
                      return (
                        propType.includes("condo") ||
                        propType.includes("condominium")
                      );
                    case "townhouse":
                      return (
                        propType.includes("townhouse") ||
                        propType.includes("town")
                      );
                    case "luxury":
                      return (prop.ListPrice || 0) >= 500000;
                    default:
                      return true;
                  }
                });
              }

              // Filter by features if specified
              if (features && typeof features === "string") {
                const requestedFeatures = features.split(",");
                filteredProperties = filteredProperties.filter((prop: any) => {
                  const propFeatures = [
                    prop.PublicRemarks || "",
                    prop.PrivateRemarks || "",
                    prop.InteriorFeatures || "",
                    prop.ExteriorFeatures || "",
                  ]
                    .join(" ")
                    .toLowerCase();

                  return requestedFeatures.some((feature: string) => {
                    const featureLower = feature.toLowerCase();
                    return (
                      propFeatures.includes(featureLower) ||
                      propFeatures.includes(featureLower.replace(/\s+/g, "")) ||
                      propFeatures.includes(featureLower.replace("-", " "))
                    );
                  });
                });
              }

              // Sort the results
              if (sortBy) {
                filteredProperties = filteredProperties.sort(
                  (a: any, b: any) => {
                    switch (sortBy) {
                      case "price-low":
                        return (a.ListPrice || 0) - (b.ListPrice || 0);
                      case "price-high":
                        return (b.ListPrice || 0) - (a.ListPrice || 0);
                      case "beds":
                        return (b.BedroomsTotal || 0) - (a.BedroomsTotal || 0);
                      case "size":
                        return (b.LivingArea || 0) - (a.LivingArea || 0);
                      case "newest":
                      default:
                        return (
                          new Date(b.ModificationTimestamp || 0).getTime() -
                          new Date(a.ModificationTimestamp || 0).getTime()
                        );
                    }
                  }
                );
              }

              data.properties = filteredProperties;
              data.total = filteredProperties.length;
            }

            res.json(data);
            return;
          }
        } catch (paragonError) {
          console.log("Paragon API error, falling back to database");
        }
      }

      // Fallback to database
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch featured properties", error });
    }
  });

  // Add a new search endpoint for featured properties
  app.get("/api/properties/search", async (req, res) => {
    try {
      const searchParams = propertySearchSchema.parse(req.query);

      // In development mode, use Paragon API instead of database
      if (process.env.NODE_ENV === "development") {
        // Build Paragon API parameters based on search criteria
        const paragonParams = new URLSearchParams({
          city: searchParams.city || "lincoln",
          status: "Active",
          limit: (searchParams.limit || 20).toString(),
          includeImages: "1",
        });

        // Add price filters if specified
        if (searchParams.minPrice) {
          paragonParams.set("minPrice", searchParams.minPrice.toString());
        }
        if (searchParams.maxPrice) {
          paragonParams.set("maxPrice", searchParams.maxPrice.toString());
        }

        // For featured listings, set a minimum for quality
        if (searchParams.featured) {
          if (!searchParams.minPrice) {
            paragonParams.set("minPrice", "150000");
          }
        }

        const paragonUrl = `http://localhost:5080/api/paragon/properties?${paragonParams}`;

        try {
          const response = await fetch(paragonUrl);
          if (response.ok) {
            const data = await response.json();
            res.json(data);
            return;
          }
        } catch (paragonError) {
          console.log("Paragon API error, falling back to database");
        }
      }

      // Production mode uses database
      const properties = await storage.getProperties(searchParams);
      res.json(properties);
    } catch (error) {
      console.error("Properties search endpoint error:", error);
      res.status(400).json({ message: "Invalid search parameters", error });
    }
  });

  app.get("/api/properties/luxury", async (req, res) => {
    try {
      const properties = await storage.getLuxuryProperties();
      res.json(properties);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch luxury properties", error });
    }
  });

  app.get("/api/property/:id", async (req, res) => {
    try {
      const id = req.params.id;

      // In development mode, try to fetch from Paragon API first
      if (process.env.NODE_ENV === "development") {
        try {
          // First, try direct lookup by ListingKey
          let paragonUrl = `https://api.paragonapi.com/api/v2/OData/bk9/Property('${id}')?access_token=429b18690390adfa776f0b727dfc78cc&$expand=Media`;

          let response = await fetch(paragonUrl);
          let paragonData = null;

          if (response.ok) {
            paragonData = await response.json();
          } else {
            // If direct lookup fails, try searching by different criteria
            console.log(`Direct lookup failed for ID: ${id}, trying search...`);

            // Try searching in the properties list to find a match
            const searchUrl = `http://localhost:5080/api/paragon/properties?city=lincoln&limit=100&includeImages=1`;
            const searchResponse = await fetch(searchUrl);

            if (searchResponse.ok) {
              const searchData = await searchResponse.json();
              const matchingProperty = searchData.data?.find(
                (prop: any) =>
                  prop.id === id || prop.mlsId === id || prop.listingKey === id
              );

              if (matchingProperty) {
                // Convert the search result to the expected format
                paragonData = {
                  ListingKey: matchingProperty.mlsId || matchingProperty.id,
                  BedroomsTotal: matchingProperty.beds,
                  BathroomsTotalInteger: parseInt(matchingProperty.baths) || 0,
                  PropertySubType: matchingProperty.propertyType,
                  City: matchingProperty.city,
                  PublicRemarks: matchingProperty.description,
                  ListPrice: parseInt(matchingProperty.price) || 0,
                  UnparsedAddress: matchingProperty.address,
                  StateOrProvince: matchingProperty.state,
                  PostalCode: matchingProperty.zipCode,
                  LivingArea: matchingProperty.sqft,
                  AboveGradeFinishedArea: matchingProperty.sqft,
                  YearBuilt: matchingProperty.yearBuilt,
                  PropertyType: matchingProperty.propertyType,
                  StandardStatus: matchingProperty.standardStatus || "Active",
                  SubdivisionName: matchingProperty.neighborhood,
                  Latitude: matchingProperty.coordinates?.lat,
                  Longitude: matchingProperty.coordinates?.lng,
                  Media:
                    matchingProperty.images?.map(
                      (url: string, index: number) => ({
                        MediaURL: url,
                        Order: index,
                      })
                    ) || [],
                };
              }
            }
          }

          if (paragonData) {
            // Transform Paragon data to our Property schema
            const property = {
              id: parseInt(id) || Math.floor(Math.random() * 1000000),
              mlsId: paragonData.ListingKey,
              listingKey: paragonData.ListingKey,
              title: `${paragonData.BedroomsTotal || "N/A"} Bed, ${
                paragonData.BathroomsTotalInteger || "N/A"
              } Bath ${paragonData.PropertySubType || "Home"} in ${
                paragonData.City
              }`,
              description:
                paragonData.PublicRemarks ||
                `Beautiful ${(
                  paragonData.PropertySubType || "home"
                ).toLowerCase()} in ${paragonData.City}`,
              price: (paragonData.ListPrice || 0).toString(),
              address: paragonData.UnparsedAddress || "",
              city: paragonData.City || "",
              state: paragonData.StateOrProvince || "NE",
              zipCode: paragonData.PostalCode || "",
              beds: paragonData.BedroomsTotal || 0,
              baths: (paragonData.BathroomsTotalInteger || 0).toString(),
              sqft:
                paragonData.LivingArea ||
                paragonData.AboveGradeFinishedArea ||
                0,
              yearBuilt: paragonData.YearBuilt || null,
              propertyType: paragonData.PropertyType || "Residential",
              status: (paragonData.StandardStatus || "Active").toLowerCase(),
              standardStatus: paragonData.StandardStatus || "Active",
              featured: (paragonData.ListPrice || 0) >= 250000,
              luxury: (paragonData.ListPrice || 0) >= 400000,
              images:
                paragonData.Media && Array.isArray(paragonData.Media)
                  ? paragonData.Media.sort(
                      (a: any, b: any) => (a.Order || 0) - (b.Order || 0)
                    )
                      .map((m: any) => m.MediaURL)
                      .filter(Boolean)
                  : [],
              neighborhood: paragonData.SubdivisionName || null,
              schoolDistrict: paragonData.ElementarySchool || null,
              style: paragonData.PropertySubType || null,
              coordinates:
                paragonData.Latitude && paragonData.Longitude
                  ? {
                      lat: parseFloat(paragonData.Latitude),
                      lng: parseFloat(paragonData.Longitude),
                    }
                  : null,
              features: [],
              architecturalStyle: paragonData.PropertySubType || null,
              secondaryStyle: null,
              styleConfidence: null,
              styleFeatures: [],
              styleAnalyzed: false,
              listingAgentKey: paragonData.ListAgentKey || null,
              listingOfficeName: paragonData.ListOfficeName || null,
              listingContractDate: paragonData.ContractStatusChangeDate || null,
              daysOnMarket: paragonData.DaysOnMarket || null,
              originalListPrice:
                paragonData.OriginalListPrice?.toString() || null,
              mlsStatus: paragonData.MlsStatus || paragonData.StandardStatus,
              modificationTimestamp: paragonData.ModificationTimestamp || null,
              photoCount:
                paragonData.PhotosCount ||
                (paragonData.Media ? paragonData.Media.length : 0),
              virtualTourUrl: paragonData.VirtualTourURLUnbranded || null,
              isIdxListing: true,
              idxSyncedAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            res.json({ property, success: true });
            return;
          }
        } catch (error) {
          console.error("Error fetching from Paragon API:", error);
        }
      }

      // Fallback: In development mode, return error to avoid database connection issues
      if (process.env.NODE_ENV === "development") {
        return res.status(404).json({
          message: "Property not found",
          success: false,
          note: "Development mode: Paragon API lookup failed",
        });
      }

      // Production fallback to database
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        return res
          .status(400)
          .json({ message: "Invalid property ID", success: false });
      }

      const property = await storage.getProperty(numericId);
      if (!property) {
        return res
          .status(404)
          .json({ message: "Property not found", success: false });
      }

      res.json({ property, success: true });
    } catch (error) {
      console.error("Property details endpoint error:", error);
      res
        .status(500)
        .json({ message: "Failed to fetch property", error, success: false });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data", error });
    }
  });

  // External API proxy endpoint for featured luxury listings
  app.get("/api/properties/external/featured", async (req, res) => {
    try {
      const response = await fetch(
        "http://gbcma.us-east-2.elasticbeanstalk.com/api/cma-comparables?city=Omaha&min_price=200000&max_price=400000"
      );
      if (!response.ok) {
        throw new Error(
          `External API returned ${response.status}: ${response.statusText}`
        );
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch external properties:", error);
      res.status(500).json({
        message: "Failed to fetch external properties",
        error: (error as any)?.message || String(error),
      });
    }
  });

  // CMA API proxy endpoint for home search and general listings
  app.get("/api/cma-comparables", async (req, res) => {
    try {
      const {
        city = "Omaha",
        min_price = "150000",
        max_price = "350000",
        ...otherParams
      } = req.query;

      // Build the query string for the external API
      const queryParams = new URLSearchParams({
        city: city as string,
        min_price: min_price as string,
        max_price: max_price as string,
        ...Object.fromEntries(
          Object.entries(otherParams).map(([key, value]) => [
            key,
            String(value),
          ])
        ),
      });

      const externalUrl = `http://gbcma.us-east-2.elasticbeanstalk.com/api/cma-comparables?${queryParams}`;
      const response = await fetch(externalUrl);

      if (!response.ok) {
        throw new Error(
          `External API returned ${response.status}: ${response.statusText}`
        );
      }

      const raw = await response.json();
      const normalized = Array.isArray(raw?.data)
        ? raw
        : { data: Array.isArray(raw) ? raw : [], raw }; // ensure consistent shape
      res.json(normalized);
    } catch (error) {
      console.error("Failed to fetch CMA data:", error);
      res.status(500).json({
        message: "Failed to fetch CMA data",
        error: (error as any)?.message || String(error),
      });
    }
  });

  // (Removed duplicate simplified Paragon route below in favor of unified implementation defined earlier.)

  // Communities endpoints
  app.get("/api/communities", async (req, res) => {
    try {
      // In development mode, return static Nebraska community data
      if (process.env.NODE_ENV === "development") {
        const staticCommunities = [
          {
            id: 1,
            name: "Benson",
            slug: "benson",
            city: "Omaha",
            state: "NE",
            description:
              "Historic neighborhood with vibrant arts scene and walkable streets.",
            averagePrice: 185000,
            medianPrice: 175000,
            pricePerSqft: 95,
            averageDaysOnMarket: 35,
            inventoryCount: 85,
            schoolDistrict: "Omaha Public Schools",
            walkScore: 78,
            transitScore: 45,
            bikeScore: 65,
            demographics: { medianAge: 34, medianIncome: 52000 },
            amenities: [
              "Historic Architecture",
              "Art Galleries",
              "Local Restaurants",
              "Parks",
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: "Dundee",
            slug: "dundee",
            city: "Omaha",
            state: "NE",
            description:
              "Upscale neighborhood known for historic homes and tree-lined streets.",
            averagePrice: 425000,
            medianPrice: 395000,
            pricePerSqft: 180,
            averageDaysOnMarket: 28,
            inventoryCount: 42,
            schoolDistrict: "Omaha Public Schools",
            walkScore: 82,
            transitScore: 38,
            bikeScore: 72,
            demographics: { medianAge: 42, medianIncome: 85000 },
            amenities: [
              "Historic Homes",
              "Elmwood Park",
              "Happy Hollow Country Club",
              "Memorial Park",
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 3,
            name: "Blackstone",
            slug: "blackstone",
            city: "Omaha",
            state: "NE",
            description:
              "Trendy district with excellent dining and entertainment options.",
            averagePrice: 275000,
            medianPrice: 255000,
            pricePerSqft: 125,
            averageDaysOnMarket: 31,
            inventoryCount: 58,
            schoolDistrict: "Omaha Public Schools",
            walkScore: 88,
            transitScore: 52,
            bikeScore: 78,
            demographics: { medianAge: 29, medianIncome: 62000 },
            amenities: [
              "Restaurants",
              "Entertainment",
              "Walkable",
              "Historic Character",
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        res.json(staticCommunities);
        return;
      }

      // Production mode uses database
      const communities = await storage.getCommunities();
      res.json(communities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch communities", error });
    }
  });

  app.get("/api/communities/:slug", async (req, res) => {
    try {
      const community = await storage.getCommunity(req.params.slug);
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
      res.json(community);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch community", error });
    }
  });

  // Blog endpoints - proxy to external data for market insights
  app.get("/api/blog", async (req, res) => {
    try {
      // First try to get external property data to generate market insights
      try {
        const response = await fetch(
          "http://gbcma.us-east-2.elasticbeanstalk.com/api/cma-comparables?city=Omaha&min_price=150000&max_price=350000"
        );
        if (response.ok) {
          const externalData = await response.json();
          const properties = externalData.data || [];

          // Generate blog posts from property market data
          const marketInsightPosts = generateMarketInsightPosts(properties);
          return res.json(marketInsightPosts);
        }
      } catch (externalError) {
        console.log(
          "External data not available, falling back to local blog posts"
        );
      }

      // Fallback to local database
      const published = req.query.published === "true";
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts", error });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post", error });
    }
  });

  // Contact/Lead endpoints
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactFormSchema.parse(req.body);
      const lead = await storage.createLead({
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        propertyAddress: contactData.propertyAddress,
        interest: contactData.interest,
        message: contactData.message,
        source: "website",
      });

      // Send email notifications
      if (emailService.isConfigured()) {
        try {
          // Send notification to admin
          await emailService.sendLeadNotification(lead);

          // Send confirmation to lead
          await emailService.sendLeadConfirmation(lead);

          console.log(`Email notifications sent for lead ${lead.id}`);
        } catch (emailError) {
          console.error("Failed to send email notifications:", emailError);
          // Don't fail the request if email fails
        }
      }

      res.status(201).json({
        message: "Contact form submitted successfully",
        leadId: lead.id,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data", error });
    }
  });

  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads", error });
    }
  });

  // Tracking codes endpoints (admin)
  app.get("/api/tracking-codes", async (req, res) => {
    try {
      const active = req.query.active === "true";
      const codes = await storage.getTrackingCodes(active);
      res.json(codes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch tracking codes", error });
    }
  });

  app.post("/api/tracking-codes", async (req, res) => {
    try {
      const codeData = insertTrackingCodeSchema.parse(req.body);
      const code = await storage.createTrackingCode(codeData);
      res.status(201).json(code);
    } catch (error) {
      res.status(400).json({ message: "Invalid tracking code data", error });
    }
  });

  app.put("/api/tracking-codes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertTrackingCodeSchema.partial().parse(req.body);
      const code = await storage.updateTrackingCode(id, updateData);
      if (!code) {
        return res.status(404).json({ message: "Tracking code not found" });
      }
      res.json(code);
    } catch (error) {
      res.status(400).json({ message: "Invalid tracking code data", error });
    }
  });

  // Market stats endpoint
  app.get("/api/market-stats", async (_req, res) => {
    try {
      const stats = await storage.getMarketStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch market stats",
        error: (error as any)?.message || String(error),
      });
    }
  });

  // IDX Integration endpoints
  app.get("/api/idx/status", async (req, res) => {
    try {
      const status = await idxSyncService.getLastSyncStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get IDX status", error });
    }
  });

  app.post("/api/idx/sync", async (req, res) => {
    try {
      const { type } = req.body;
      let result;

      if (type === "properties") {
        result = await idxSyncService.syncProperties();
      } else if (type === "full") {
        result = await idxSyncService.fullSync();
      } else {
        return res
          .status(400)
          .json({ message: "Invalid sync type. Use 'properties' or 'full'" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "IDX sync failed", error });
    }
  });

  // IDX agents endpoint removed per user request

  app.get("/api/idx/sync-logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const logs = await storage.getIdxSyncLogs(limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sync logs", error });
    }
  });

  // **TEMPLATE ROUTES** - Multi-tenant customization with user authentication
  // Get public template (no authentication required - for public display)
  app.get("/api/template/public", async (req, res) => {
    try {
      // Try to get saved template from database first
      let template = await storage.getTemplate();

      // If no template exists in database, return default template for public display
      if (!template) {
        const defaultTemplate = {
          companyName: "Bjork Group Real Estate",
          agentName: "Real Estate Expert",
          agentTitle: "Principal Broker",
          agentEmail: "contact@bjorkgroup.com",
          companyDescription:
            "Discover exceptional homes with Nebraska's premier luxury real estate team",
          heroTitle: "Ready to Find Your Dream Home?",
          heroSubtitle:
            "Let's start your luxury real estate journey today. Our team is here to make your Nebraska home buying or selling experience exceptional.",
          contactPhone: "(402) 522-6131",
          contactPhoneText: "Call or text anytime",
          officeAddress: "331 Village Pointe Plaza",
          officeCity: "Omaha",
          officeState: "NE",
          officeZip: "68130",
          homesSold: 500,
          totalSalesVolume: "$250M+",
          serviceAreas: ["Omaha", "Lincoln", "Elkhorn", "Papillion"],
          phone: "(402) 555-0123",
          address: {
            street: "123 Main Street",
            city: "Omaha",
            state: "NE",
            zip: "68102",
          },
        };
        template = defaultTemplate;
      }

      console.log("Public template endpoint returning:", template);
      res.json(template);
    } catch (error) {
      console.error("Error fetching public template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Get user's template (requires authentication)
  app.get(
    "/api/template",
    authenticateUser,
    async (req: AuthenticatedRequest, res) => {
      try {
        const userId = req.user!.id;

        // Get user-specific template
        let template = await storage.getTemplateByUser(userId);

        // If no template exists for user, create one with default values
        if (!template) {
          const defaultTemplate = {
            companyName: `${
              req.user!.firstName || req.user!.username
            }'s Real Estate Company`,
            agentName: `${req.user!.firstName || req.user!.username} ${
              req.user!.lastName || ""
            }`.trim(),
            agentTitle: "Principal Broker",
            agentEmail: req.user!.email,
            companyDescription:
              "We believe that luxury is not a price point but an experience.",
            homesSold: 0,
            totalSalesVolume: "$0",
            serviceAreas: ["Your Primary City", "Your Secondary City"],
            phone: "",
            address: {
              street: "123 Main Street",
              city: "Your City",
              state: "Your State",
              zip: "12345",
            },
          };

          template = await storage.createTemplateForUser(
            userId,
            defaultTemplate
          );
        }

        res.json(template);
      } catch (error) {
        console.error("Error fetching user template:", error);
        res.status(500).json({ message: "Failed to fetch template" });
      }
    }
  );

  // Update user's template (requires authentication)
  app.post(
    "/api/template",
    authenticateUser,
    async (req: AuthenticatedRequest, res) => {
      try {
        const userId = req.user!.id;

        console.log(
          `Template update for user ${userId}:`,
          JSON.stringify(req.body, null, 2)
        );

        // Validate required fields
        const requiredFields = ["companyName", "agentName"];
        for (const field of requiredFields) {
          if (!req.body[field]) {
            return res.status(400).json({
              message: `Missing required field: ${field}`,
              received: req.body,
            });
          }
        }

        // Clean the data - remove empty strings and convert them to null
        const cleanedData = Object.entries(req.body).reduce(
          (acc, [key, value]) => {
            if (value === "") {
              acc[key] = null;
            } else {
              acc[key] = value;
            }
            return acc;
          },
          {} as any
        );

        console.log(
          `Cleaned template data for user ${userId}:`,
          JSON.stringify(cleanedData, null, 2)
        );

        const template = await storage.updateTemplateByUser(
          userId,
          cleanedData
        );
        console.log("User template updated successfully:", template);
        res.json(template);
      } catch (error) {
        console.error("Error updating user template:", error);
        console.error(
          "Error stack:",
          error instanceof Error ? error.stack : "No stack trace"
        );
        res.status(500).json({
          message: "Failed to update template",
          error: error instanceof Error ? error.message : "Unknown error",
          details: req.body,
        });
      }
    }
  );

  const httpServer = createServer(app);
  return httpServer;
}
