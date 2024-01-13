const fs = require('fs');

const filePath = './01-read-file/text.txt';

const readStream = fs.createReadStream(filePath, 'utf-8');

readStream.on('data', (chunk) => {
  console.log(chunk);
});

readStream.on('end', () => {
  console.log('File reading completed.');
});

readStream.on('error', (err) => {
  console.error('Error reading the file:', err.message);
});

readStream.on('close', () => {
  console.log('Stream closed.');
});
