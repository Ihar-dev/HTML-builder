const path = require('path');
const fs = require('fs');
const directory = __dirname + '/secret-folder';
/* let dirBuf = Buffer.from(directory); */
fs.readdir(directory, (err, files) => {
  if (err) throw err;
  process.stdout.write('Files list:\n');
  for (let file of files) {
    let filePath = path.join(directory, file);
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (!stats.isDirectory()) {
        process.stdout.write(`${path.parse(filePath).name}`);
        process.stdout.write(` - ${path.parse(filePath).ext.substr(1)}`);
        process.stdout.write(` - ${stats.size}bytes\n`);
      }
    })
  }
})