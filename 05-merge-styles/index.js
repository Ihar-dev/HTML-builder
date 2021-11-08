const fs = require('fs');
const path = require('path');
const prevDir = path.join(__dirname, 'styles');
const filePath = path.join(__dirname, 'project-dist', 'bundle.css');
const arr = [];
const copyStyles = () => {
  fs.readdir(prevDir, (err, files) => {
    if (err) throw err;
    if (files.length) {
      let i = 0;
      for (let file of files) {
        i++;
        let prevFilePath = path.join(prevDir, file);
        fs.stat(prevFilePath, (err, stats) => {
          if (err) throw err;
          if (!stats.isDirectory() && path.parse(prevFilePath).ext === '.css') {
            const myReadStream = fs.createReadStream(prevFilePath);
            myReadStream.on('data', chunk => {
              const textData = '' + Buffer.from(chunk);
              arr.push(textData);
              if (files.length === i) makeBundle();
            });
          }
        })
      }
    } else makeBundle();
  })
}
const makeBundle = () => {
  fs.writeFile(filePath, '', err => {
    if (err) throw err;
    if (arr.length > 0) copyToBundle();
  });
}
let i = 0;
const copyToBundle = () => {
  fs.appendFile(filePath, arr[i], err => {
    if (err) throw err;
    i++;
    if (i < arr.length) copyToBundle();
  });
}
copyStyles();