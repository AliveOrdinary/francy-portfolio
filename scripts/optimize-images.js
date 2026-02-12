#!/usr/bin/env node

/**
 * Image optimization script
 * Converts JPG/PNG images in uploads/ to WebP in optimized/ using cwebp.
 * Quality 95 for high-fidelity portfolio images.
 * 
 * Usage: node scripts/optimize-images.js
 * 
 * Prerequisites: brew install webp (provides cwebp)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, '../public');
const uploadsDir = path.join(publicDir, 'images/uploads');
const optimizedDir = path.join(publicDir, 'images/optimized');

const QUALITY = 95;

function findImages(dir) {
  const images = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      images.push(...findImages(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(file.name)) {
      images.push(fullPath);
    }
  }

  return images;
}

function optimizeImages() {
  // Check for cwebp
  try {
    execSync('which cwebp', { stdio: 'ignore' });
  } catch {
    console.error('Error: cwebp not found. Install with: brew install webp');
    process.exit(1);
  }

  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found.');
    return;
  }

  // Ensure optimized directory exists
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }

  const images = findImages(uploadsDir);
  console.log(`Found ${images.length} images to optimize.\n`);

  let converted = 0;
  let skipped = 0;

  for (const imagePath of images) {
    const relativePath = path.relative(uploadsDir, imagePath);
    const webpName = relativePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(optimizedDir, webpName);

    // Ensure output subdirectory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Skip if optimized version is newer than source
    if (fs.existsSync(outputPath)) {
      const srcStat = fs.statSync(imagePath);
      const outStat = fs.statSync(outputPath);
      if (outStat.mtimeMs > srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    }

    try {
      const srcSize = (fs.statSync(imagePath).size / 1024).toFixed(0);
      execSync(`cwebp -q ${QUALITY} "${imagePath}" -o "${outputPath}"`, { stdio: 'ignore' });
      const outSize = (fs.statSync(outputPath).size / 1024).toFixed(0);
      const savings = (((srcSize - outSize) / srcSize) * 100).toFixed(1);
      console.log(`  ✓ ${relativePath} (${srcSize}KB → ${outSize}KB, ${savings}% smaller)`);
      converted++;
    } catch (err) {
      console.error(`  ✗ Failed: ${relativePath} - ${err.message}`);
    }
  }

  console.log(`\nDone! Converted: ${converted}, Skipped (up-to-date): ${skipped}`);
}

if (require.main === module) {
  optimizeImages();
}

module.exports = { findImages, optimizeImages };