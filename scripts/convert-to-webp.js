// Enhanced script to convert and optimize images for web
// - Converts to WebP format
// - Resizes to max dimension (preserves aspect ratio)
// - Saves to /images/optimized/ folder (mirrors folder structure)
// - Keeps originals in place for high-res viewer

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { findImages } = require('./optimize-images');

const publicDir = path.join(__dirname, '../public');
const uploadsDir = path.join(publicDir, 'images/uploads');
const optimizedDir = path.join(publicDir, 'images/optimized');

// Configuration
const CONFIG = {
  maxWidth: 2400,     // Max width for optimized images
  maxHeight: 2400,    // Max height for optimized images
  quality: 90,        // WebP quality (90 is visually identical to original)
  effort: 6,          // Compression effort (0-6, higher = smaller but slower)
};

/**
 * Ensures a directory exists, creating it recursively if needed
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Gets the output path for an optimized image
 * Mirrors the folder structure from uploads to optimized
 */
function getOutputPath(imagePath) {
  const relativePath = path.relative(uploadsDir, imagePath);
  const parsedPath = path.parse(relativePath);
  const webpRelativePath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
  return path.join(optimizedDir, webpRelativePath);
}

/**
 * Converts and optimizes an image
 * @param {string} imagePath - Path to the original image
 * @returns {Promise<{original: string, optimized: string, originalSize: number, optimizedSize: number}>}
 */
async function optimizeImage(imagePath) {
  const outputPath = getOutputPath(imagePath);
  
  // Ensure output directory exists
  ensureDir(path.dirname(outputPath));
  
  try {
    // Get original metadata
    const metadata = await sharp(imagePath).metadata();
    const originalStats = fs.statSync(imagePath);
    
    // Determine if resize is needed
    const needsResize = metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight;
    
    // Build the sharp pipeline
    let pipeline = sharp(imagePath);
    
    // Resize if larger than max dimensions (maintains aspect ratio)
    if (needsResize) {
      pipeline = pipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to WebP
    pipeline = pipeline.webp({
      quality: CONFIG.quality,
      effort: CONFIG.effort,
    });
    
    // Save the optimized image
    await pipeline.toFile(outputPath);
    
    const optimizedStats = fs.statSync(outputPath);
    
    return {
      original: imagePath,
      optimized: outputPath,
      originalSize: originalStats.size,
      optimizedSize: optimizedStats.size,
      wasResized: needsResize,
      originalDimensions: `${metadata.width}x${metadata.height}`
    };
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error.message);
    return null;
  }
}

/**
 * Formats bytes to human readable string
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Processes all images in the uploads directory
 */
async function processAllImages() {
  console.log('🖼️  Media Optimization Script');
  console.log('================================\n');
  console.log(`Config: max ${CONFIG.maxWidth}x${CONFIG.maxHeight}, quality ${CONFIG.quality}%\n`);
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('❌ No uploads directory found at:', uploadsDir);
    return;
  }
  
  // Find all images (jpg, jpeg, png, webp)
  const images = findImages(uploadsDir);
  
  if (images.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  console.log(`Found ${images.length} images to process.\n`);
  
  // Ensure optimized directory exists
  ensureDir(optimizedDir);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  let skippedCount = 0;
  
  for (const imagePath of images) {
    const relativePath = path.relative(uploadsDir, imagePath);
    const outputPath = getOutputPath(imagePath);
    
    // Check if optimized version already exists and is newer than original
    if (fs.existsSync(outputPath)) {
      const originalMtime = fs.statSync(imagePath).mtime;
      const optimizedMtime = fs.statSync(outputPath).mtime;
      
      if (optimizedMtime > originalMtime) {
        console.log(`⏭️  Skipping (already optimized): ${relativePath}`);
        skippedCount++;
        continue;
      }
    }
    
    const result = await optimizeImage(imagePath);
    
    if (result) {
      const savings = ((1 - result.optimizedSize / result.originalSize) * 100).toFixed(1);
      const resizeNote = result.wasResized ? ` (resized from ${result.originalDimensions})` : '';
      
      console.log(`✅ ${relativePath}${resizeNote}`);
      console.log(`   ${formatBytes(result.originalSize)} → ${formatBytes(result.optimizedSize)} (${savings}% smaller)\n`);
      
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      successCount++;
    }
  }
  
  console.log('================================');
  console.log(`✨ Optimization complete!`);
  console.log(`   Processed: ${successCount} images`);
  if (skippedCount > 0) {
    console.log(`   Skipped: ${skippedCount} (already optimized)`);
  }
  if (successCount > 0) {
    const totalSavings = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
    console.log(`   Total savings: ${formatBytes(totalOriginalSize - totalOptimizedSize)} (${totalSavings}% reduction)`);
  }
  console.log(`\n📁 Optimized images saved to: public/images/optimized/`);
}

// Run the script
if (require.main === module) {
  processAllImages().catch(console.error);
}

module.exports = { optimizeImage, processAllImages, getOutputPath, CONFIG };