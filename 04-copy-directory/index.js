const fs = require('fs');
const path = require('path');
const prevDir = path.join(__dirname, 'files');
const nextDir = path.join(__dirname, 'files-copy');
const fsPromises = fs.promises;
const makeDirectory = async () => {
  try {
    fsPromises.mkdir(nextDir, {
      recursive: true
    });
    clearDirectory();
  } catch (err) {
    if (err) throw err;
  }
}
const clearDirectory = async () => {
  try {
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
    copyDirectory();
  } catch (err) {
    if (err) throw err;
  }
}
const copyDirectory = async () => {
  try {
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
  } catch (err) {
    if (err) throw err;
  }
}
makeDirectory();