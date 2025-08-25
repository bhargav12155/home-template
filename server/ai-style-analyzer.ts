import OpenAI from "openai";

// Lazy OpenAI client so server can start without a key (style analysis becomes a no-op fallback)
let openai: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  if (!openai) {
    openai = new OpenAI({ apiKey: key });
  }
  return openai;
}

export interface ArchitecturalStyle {
  primary: string;
  secondary?: string;
  confidence: number;
  features: string[];
}

const SUPPORTED_STYLES = [
  "Modern",
  "Contemporary",
  "Farmhouse",
  "Colonial",
  "Victorian",
  "Craftsman",
  "Ranch",
  "Tudor",
  "Mediterranean",
  "Mid-Century Modern",
  "Traditional",
  "Transitional",
  "Industrial",
  "Cape Cod",
  "Georgian",
  "Prairie",
  "Neoclassical",
  "Art Deco",
  "Minimalist",
  "Luxury Custom",
];

export async function analyzePropertyStyle(
  imageUrl: string
): Promise<ArchitecturalStyle> {
  try {
    const client = getOpenAI();
    if (!client) {
      return {
        primary: "Traditional",
        confidence: 0.0,
        features: ["OpenAI key not configured; skipped analysis"],
      };
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert architectural style analyst for luxury real estate. Analyze the architectural style of homes and provide detailed classifications.

Available styles: ${SUPPORTED_STYLES.join(", ")}

Respond with JSON in this exact format:
{
  "primary": "Primary architectural style",
  "secondary": "Secondary style if mixed (optional)",
  "confidence": 0.85,
  "features": ["Notable architectural features", "Design elements", "Style characteristics"]
}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this property's architectural style. Focus on exterior design elements, rooflines, materials, windows, and overall aesthetic. Provide the primary style and any secondary influences.",
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      primary: result.primary || "Traditional",
      secondary: result.secondary,
      confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
      features: Array.isArray(result.features) ? result.features : [],
    };
  } catch (error) {
    console.error("AI style analysis failed:", error);
    return {
      primary: "Traditional",
      confidence: 0.0,
      features: ["Analysis unavailable"],
    };
  }
}

export async function batchAnalyzeStyles(
  properties: Array<{ id: string; imageUrl: string }>
): Promise<Map<string, ArchitecturalStyle>> {
  const results = new Map<string, ArchitecturalStyle>();

  // Process in batches to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < properties.length; i += batchSize) {
    const batch = properties.slice(i, i + batchSize);
    const promises = batch.map(async (property) => {
      const style = await analyzePropertyStyle(property.imageUrl);
      return { id: property.id, style };
    });

    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ id, style }) => {
      results.set(id, style);
    });

    // Small delay between batches
    if (i + batchSize < properties.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

export function getStyleKeywords(style: string): string[] {
  const styleKeywords: Record<string, string[]> = {
    Modern: [
      "clean lines",
      "geometric",
      "flat roof",
      "large windows",
      "minimal ornamentation",
    ],
    Contemporary: [
      "current trends",
      "mixed materials",
      "open floor plans",
      "energy efficient",
    ],
    Farmhouse: [
      "wraparound porch",
      "metal roof",
      "barn-style",
      "rustic",
      "country",
    ],
    Colonial: [
      "symmetrical",
      "columns",
      "shutters",
      "dormer windows",
      "brick or wood",
    ],
    Victorian: [
      "ornate details",
      "turrets",
      "bay windows",
      "decorative trim",
      "asymmetrical",
    ],
    Craftsman: [
      "low-pitched roof",
      "exposed rafters",
      "stone pillars",
      "natural materials",
    ],
    Ranch: [
      "single story",
      "horizontal orientation",
      "attached garage",
      "simple roofline",
    ],
    Tudor: [
      "half-timbering",
      "steep roofs",
      "stained glass",
      "arched doorways",
    ],
    Mediterranean: [
      "stucco walls",
      "red tile roof",
      "arched windows",
      "courtyards",
    ],
    "Mid-Century Modern": [
      "flat planes",
      "post and beam",
      "floor-to-ceiling windows",
    ],
    Traditional: [
      "classic proportions",
      "conventional materials",
      "timeless design",
    ],
    Transitional: ["blend of styles", "neutral colors", "comfortable elegance"],
    Industrial: [
      "exposed brick",
      "metal elements",
      "warehouse aesthetic",
      "urban loft",
    ],
    "Cape Cod": ["steep roof", "central chimney", "shingle siding", "dormers"],
    Georgian: ["formal symmetry", "brick construction", "pediment doorway"],
    Prairie: ["horizontal lines", "low roofs", "natural integration"],
    Neoclassical: ["columns", "pediments", "classical proportions"],
    "Art Deco": ["geometric patterns", "streamlined forms", "metallic accents"],
    Minimalist: ["simple forms", "neutral palette", "functional design"],
    "Luxury Custom": [
      "high-end materials",
      "unique design",
      "premium finishes",
    ],
  };

  return styleKeywords[style] || [];
}

export { SUPPORTED_STYLES };
