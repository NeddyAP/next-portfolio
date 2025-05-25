/**
 * Utility functions for optimized image handling in the portfolio
 */

// Base64 placeholder for blur effect
export const BLUR_DATA_URL = 
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

/**
 * Get optimized image props for project images
 */
export function getProjectImageProps(index: number) {
  return {
    sizes: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
    priority: index < 3, // Prioritize first 3 images
    loading: (index < 3 ? "eager" : "lazy") as "eager" | "lazy",
    placeholder: "blur" as const,
    blurDataURL: BLUR_DATA_URL,
  };
}

/**
 * Get optimized image props for certificate images
 */
export function getCertificateImageProps() {
  return {
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw",
    priority: false,
    loading: "lazy" as const,
    placeholder: "blur" as const,
    blurDataURL: BLUR_DATA_URL,
  };
}

/**
 * Get optimized image props for profile images
 */
export function getProfileImageProps() {
  return {
    sizes: "(max-width: 640px) 12rem, (max-width: 1024px) 16rem, 24rem",
    priority: true,
    loading: "eager" as const,
    placeholder: "blur" as const,
    blurDataURL: BLUR_DATA_URL,
  };
}

/**
 * Check if a URL is a PDF file
 */
export function isPdfFile(url: string): boolean {
  return url.toLowerCase().endsWith('.pdf');
}

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string): string {
  return url.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if a file is an image
 */
export function isImageFile(url: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'];
  const extension = getFileExtension(url);
  return imageExtensions.includes(extension);
}

/**
 * Generate responsive image sizes for different breakpoints
 */
export function generateResponsiveSizes(breakpoints: { [key: string]: string }): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
    .join(', ');
}

/**
 * Common responsive breakpoints for the portfolio
 */
export const RESPONSIVE_BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1200px',
  wide: '1920px',
};

/**
 * Predefined responsive sizes for common use cases
 */
export const RESPONSIVE_SIZES = {
  fullWidth: generateResponsiveSizes({
    [RESPONSIVE_BREAKPOINTS.mobile]: '100vw',
    [RESPONSIVE_BREAKPOINTS.tablet]: '100vw',
    [RESPONSIVE_BREAKPOINTS.laptop]: '100vw',
  }),
  halfWidth: generateResponsiveSizes({
    [RESPONSIVE_BREAKPOINTS.mobile]: '100vw',
    [RESPONSIVE_BREAKPOINTS.tablet]: '50vw',
    [RESPONSIVE_BREAKPOINTS.laptop]: '50vw',
  }),
  thirdWidth: generateResponsiveSizes({
    [RESPONSIVE_BREAKPOINTS.mobile]: '100vw',
    [RESPONSIVE_BREAKPOINTS.tablet]: '50vw',
    [RESPONSIVE_BREAKPOINTS.laptop]: '33vw',
  }),
  quarterWidth: generateResponsiveSizes({
    [RESPONSIVE_BREAKPOINTS.mobile]: '100vw',
    [RESPONSIVE_BREAKPOINTS.tablet]: '50vw',
    [RESPONSIVE_BREAKPOINTS.laptop]: '33vw',
    [RESPONSIVE_BREAKPOINTS.desktop]: '25vw',
  }),
};
