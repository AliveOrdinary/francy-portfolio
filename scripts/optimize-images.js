// Image optimization script for development
// This script can be used to batch optimize images before deployment

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const uploadsDir = path.join(publicDir, 'images/uploads');

function findImages(dir) {
  const images = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      images.push(...findImages(fullPath));
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      images.push(fullPath);
    }
  }
  
  return images;
}

function analyzeImages() {
  if (!fs.existsSync(uploadsDir)) {
    console.log('No uploads directory found.');
    return;
  }
  
  const images = findImages(uploadsDir);
  console.log(`Found ${images.length} images:`);
  
  images.forEach(imagePath => {
    const stats = fs.statSync(imagePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    const relativePath = path.relative(publicDir, imagePath);
    console.log(`  ${relativePath} - ${sizeInMB}MB`);
  });
  
  console.log('\nOptimization recommendations:');
  console.log('- Images over 500KB should be compressed');
  console.log('- Consider converting to WebP format');
  console.log('- Use responsive image breakpoints');
}

if (require.main === module) {
  analyzeImages();
}

module.exports = { findImages, analyzeImages };