const fs = require('fs').promises;
const path = require('path');

async function copyDir(src, dest) {
  try {
    const files = await fs.readdir(src);
    await fs.mkdir(dest, { recursive: true });
    for (const file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      const stat = await fs.stat(srcPath);
      if (stat.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }

    console.log('Directory copied successfully!');
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

const sourceDir = path.join(__dirname, 'files');
const destinationDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, destinationDir);
