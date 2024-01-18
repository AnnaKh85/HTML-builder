const fs = require('fs').promises;
const path = require('path');

async function replaceTemplateTags(templateContent) {
  const tagPattern = /\{\{([^{}]+)\}\}/g;
  const tagMatches = templateContent.match(tagPattern);

  if (tagMatches) {
    for (const tag of tagMatches) {
      const componentName = tag.slice(2, -2).trim();
      const componentPath = path.join(
        __dirname,
        'components',
        `${componentName}.html`,
      );

      try {
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        templateContent = templateContent.replace(tag, componentContent);
      } catch (error) {
        console.error(
          `Error reading component file (${componentPath}):`,
          error.message,
        );
      }
    }
  }

  return templateContent;
}

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
    const stylesFolderPath = path.join(__dirname, 'styles');
    const outputFolderPath = path.join(__dirname, 'project-dist');
    const outputFile = path.join(outputFolderPath, 'style.css');

    const cssFiles = await getCSSFiles(stylesFolderPath);
    const stylesArray = [];

    for (const file of cssFiles) {
      const filePath = path.join(stylesFolderPath, file);
      const styles = await readStylesFromFile(filePath);
      stylesArray.push(styles);
    }

    const bundleStyles = stylesArray.join('\n');

    await fs.writeFile(outputFile, bundleStyles, 'utf-8');

    console.log('Styles successfully compiled into style.css');
  } catch (error) {
    console.error('Error compiling styles:', error.message);
  }
}

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

async function main() {
  try {
    // Read and save the template file
    const templatePath = path.join(__dirname, 'template.html');
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    // Replace template tags with content of component files
    templateContent = await replaceTemplateTags(templateContent);

    // Create the project-dist folder if it doesn't exist
    const distFolder = path.join(__dirname, 'project-dist');
    await fs.mkdir(distFolder, { recursive: true });

    // Write modified template to index.html
    await fs.writeFile(path.join(distFolder, 'index.html'), templateContent);

    // Compile styles and create style.css
    await compileStyles();

    // Copy the assets folder into project-dist
    const assetsSourceDir = path.join(__dirname, 'assets');
    const assetsDestinationDir = path.join(distFolder, 'assets');
    await copyDir(assetsSourceDir, assetsDestinationDir);

    console.log('Script execution completed successfully.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();
