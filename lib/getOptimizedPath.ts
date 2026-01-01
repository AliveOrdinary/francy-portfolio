/**
 * Converts an original image path to its optimized version path
 * 
 * @example
 * getOptimizedPath("/images/uploads/teeta/cover.jpg")
 * // Returns: "/images/optimized/teeta/cover.webp"
 * 
 * @example
 * getOptimizedPath("/images/uploads/sanjo/01.jpg")
 * // Returns: "/images/optimized/sanjo/01.webp"
 */
export function getOptimizedPath(originalPath: string): string {
  // Replace the uploads folder with optimized folder
  let optimizedPath = originalPath.replace('/images/uploads/', '/images/optimized/');
  
  // Replace image extension with .webp
  optimizedPath = optimizedPath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
  
  return optimizedPath;
}

/**
 * Gets the original path from an optimized path (reverse operation)
 */
export function getOriginalPath(optimizedPath: string): string {
  return optimizedPath.replace('/images/optimized/', '/images/uploads/');
}

/**
 * Checks if a path is a video file
 */
export function isVideoPath(path: string): boolean {
  return /\.(mp4|webm|mov|avi)$/i.test(path);
}

/**
 * Checks if a path is an image file
 */
export function isImagePath(path: string): boolean {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(path);
}
