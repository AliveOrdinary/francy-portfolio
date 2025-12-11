// Script to convert images to high-quality WebP format
// This preserves image quality while reducing file size

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { findImages } = require('./optimize-images');

const publicDir = path.join(__dirname, '../public');
const uploadsDir = path.join(publicDir, 'images/uploads');

/**
 * Converts an image to WebP format with high quality
 * @param {string} imagePath - Path to the original image
 * @param {number} quality - WebP quality (0-100)
 * @returns {Promise<string>} - Path to the converted WebP image
 */
async function convertToWebP(imagePath, quality = 95) {
  // Skip if already WebP
  if (path.extname(imagePath).toLowerCase() === '.webp') {
    console.log(`Skipping already WebP image: ${imagePath}`);
    return imagePath;
  }

  const outputPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  try {
    // Get image metadata first
    const metadata = await sharp(imagePath).metadata();
    
    // Convert to WebP with high quality
    await sharp(imagePath)
      .webp({ 
        quality: quality,
        effort: 6, // Higher effort = better compression but slower (0-6)
        lossless: quality === 100 // Use lossless for 100% quality
      })
      .toFile(outputPath);
    
    const originalStats = fs.statSync(imagePath);
    const webpStats = fs.statSync(outputPath);
    
    const originalSize = (originalStats.size / (1024 * 1024)).toFixed(2);
    const webpSize = (webpStats.size / (1024 * 1024)).toFixed(2);
    const savings = (100 - (webpStats.size / originalStats.size * 100)).toFixed(1);
    
    console.log(`✓ Converted: ${path.basename(imagePath)} (${metadata.width}x${metadata.height})`);
    console.log(`  ${originalSize}MB → ${webpSize}MB (${savings}% smaller)`);
    
    return outputPath;
  } catch (error) {
    console.error(`Error converting ${imagePath} to WebP:`, error);
    return imagePath;
  }
}

/**
 * Processes all images in the uploads directory
 * @param {number} quality - WebP quality (0-100)
 */
async function processAllImages(quality = 95) {
  console.log(`Converting images to WebP (quality: ${quality}%)...`);
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found.');
    return;
  }
  
  const images = findImages(uploadsDir).filter(img => 
    /\.(jpg|jpeg|png)$/i.test(img) && !img.includes('.webp')
  );
  
  if (images.length === 0) {
    console.log('No compatible images found to convert.');
    return;
  }
  
  console.log(`Found ${images.length} images to convert.`);
  
  // Create a backup directory
  const backupDir = path.join(publicDir, 'images/originals');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Process images
  for (const imagePath of images) {
    const relativePath = path.relative(publicDir, imagePath);
    const backupPath = path.join(backupDir, path.basename(imagePath));
    
    // Backup original
    fs.copyFileSync(imagePath, backupPath);
    
    // Convert to WebP
    await convertToWebP(imagePath, quality);
  }
  
  console.log('\nConversion complete!');
  console.log(`Original images backed up to: ${path.relative(process.cwd(), backupDir)}`);
}

// Run the script if called directly
if (require.main === module) {
  // Use high quality by default (95%)
  // Pass a command line argument to override, e.g. node convert-to-webp.js 90
  const quality = process.argv[2] ? parseInt(process.argv[2]) : 95;
  processAllImages(quality);
}

module.exports = { convertToWebP, processAllImages };