const fs = require('fs');
const path = require('path');
const prevDir = path.join(__dirname, 'styles');
const filePath = path.join(__dirname, 'project-dist', 'bundle.css');
const arr = [];
const copyStyles = async () => {
  try {
    fs.readdir(prevDir, (err, files) => {
      if (err) throw err;
      for (let file of files) {
        let prevFilePath = path.join(prevDir, file);
        fs.stat(prevFilePath, (err, stats) => {
          if (err) throw err;
          if (!stats.isDirectory() && path.parse(prevFilePath).ext === '.css') {
            const myReadStream = fs.createReadStream(prevFilePath);
            myReadStream.on('data', chunk => {
              const textData = '' + Buffer.from(chunk);
              arr.push(textData);
            });
          }
        })
      }
      setTimeout(makeBundle);
    })
  } catch (err) {
    if (err) throw err;
  }
}
const makeBundle = async () => {
  try {
    fs.writeFile(filePath, '', err => {
      if (err) throw err;
      copyToBundle();
    });
  } catch (err) {
    if (err) throw err;
  }
}
let i = 0;
const copyToBundle = async () => {
  try {
    fs.appendFile(filePath, arr[i], err => {
      if (err) throw err;
      i++;
      if (i < arr.length) copyToBundle();
    });
  } catch (err) {
    if (err) throw err;
  }
}
copyStyles();