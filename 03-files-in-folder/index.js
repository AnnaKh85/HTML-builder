const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error('Error getting file stats:', err);
        return;
      }

      if (stats.isFile()) {
        const fileName = path.parse(file).name;
        const fileExtension = path.parse(file).ext.slice(1);
        const fileSize = stats.size / 1024;

        console.log(
          `${fileName} - ${fileExtension} - ${fileSize.toFixed(3)}kb`,
        );
      } else {
        console.info(`Info: ${file} is a directory`);
      }
    });
  });
});
