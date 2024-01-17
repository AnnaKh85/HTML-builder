const fs = require('fs/promises');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolderPath, 'bundle.css');

async function readStylesFromFile(filePath) {
  try {
    const styles = await fs.readFile(filePath, 'utf-8');
    return styles;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    throw error;
  }
}

async function getCSSFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    return files.filter((file) => file.endsWith('.css'));
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error.message);
    throw error;
  }
}

async function compileStyles() {
  try {
    const cssFiles = await getCSSFiles(stylesFolderPath);
    const stylesArray = [];

    for (const file of cssFiles) {
      const filePath = path.join(stylesFolderPath, file);
      const styles = await readStylesFromFile(filePath);
      stylesArray.push(styles);
    }

    const bundleStyles = stylesArray.join('\n');

    await fs.writeFile(outputFile, bundleStyles, 'utf-8');

    console.log('Styles successfully compiled into bundle.css');
  } catch (error) {
    console.error('Error compiling styles:', error.message);
  }
}

compileStyles();
