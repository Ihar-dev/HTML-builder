const fs = require('fs');
const path = require('path');
const prevDir = path.join(__dirname, 'files');
const nextDir = path.join(__dirname, 'files-copy');
const fsPromises = fs.promises;
fsPromises.mkdir(nextDir, {
  recursive: true
});
fs.readdir(nextDir, (err, files) => {
  if (err) throw err;
  for (let file of files) {
    let nextFilePath = path.join(nextDir, file);
    fs.stat(nextFilePath, (err, stats) => {
      if (err) throw err;
      if (!stats.isDirectory()) {
        fs.unlink(nextFilePath, err => {
          if (err) throw err;
        });
      }
    });
  }
})
setTimeout(() => {
  fs.readdir(prevDir, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      let prevFilePath = path.join(prevDir, file);
      let nextFilePath = path.join(nextDir, file);
      fs.stat(prevFilePath, (err, stats) => {
        if (err) throw err;
        if (!stats.isDirectory()) {
          fsPromises.copyFile(prevFilePath, nextFilePath);
        }
      })
    }
  })
}, 1000);