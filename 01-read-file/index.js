const fs = require('fs');
const filePath = __dirname + '/text.txt';
/* const path = require('path');
const filePath = path.join(__dirname, 'text.txt'); */      // another option
const myReadStream = fs.createReadStream(filePath);
myReadStream.on('data', chunk => {
  const textData = '' + Buffer.from(chunk);
  process.stdout.write(textData + '\n');
  /* const textData = Buffer.from(chunk).toString();
  console.log(textData); */                                // another option
});