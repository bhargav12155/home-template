/**
 * Media utilities for handling images with error fallback
 */

/**
 * Get image URL with error handling and fallback
 */
export function getImageUrlWithFallback(
  imageUrl: string | null | undefined,
  fallbackUrl: string
): string {
  return imageUrl || fallbackUrl;
}

/**
 * Handle image load errors by switching to fallback
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackUrl: string
) {
  const img = event.currentTarget;

  // Prevent infinite loops by checking if we're already using the fallback
  if (img.src === fallbackUrl || img.src.endsWith(fallbackUrl)) {
    console.warn("Fallback image also failed to load:", fallbackUrl);
    // Hide the image instead of trying another fallback
    img.style.display = "none";
    return;
  }

  console.warn("Image failed to load, switching to fallback:", img.src);
  img.src = fallbackUrl;
}
