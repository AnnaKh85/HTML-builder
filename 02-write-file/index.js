const fs = require('fs');
const readline = require('readline');

const filePath = '02-write-file/data.txt';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function writeToFile(text) {
  fs.appendFileSync(filePath, text + '\n');
}

function promptUser() {
  rl.question('Enter text (or type "exit" to quit): ', (input) => {
    if (input.toLowerCase() === 'exit') {
      console.log('See you!');
      rl.close();
    } else {
      writeToFile(input);
      promptUser();
    }
  });
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '');
}

promptUser();
