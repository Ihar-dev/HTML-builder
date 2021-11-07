const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const dirPath = path.join(__dirname, 'project-dist');
const dirComponents = path.join(__dirname, 'components');
const indexFilePath = path.join(__dirname, 'project-dist', 'index.html');
const assetsDirPath = path.join(__dirname, 'project-dist', 'assets');
const prevAssetsDirPath = path.join(__dirname, 'assets');
const templateFilePath = path.join(__dirname, 'template.html');
const makeDirectory = async () => {
  try {
    await fsPromises.mkdir(dirPath, {
      recursive: true
    });
    clearDirectory();
  } catch (err) {
    if (err) throw err;
  }
}
const clearDirectory = () => {
  fs.readdir(dirPath, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      let filePath = path.join(dirPath, file);
      fs.rm(filePath, {
        recursive: true
      }, err => {
        if (err) throw err;
      })
    }
    setTimeout(readTemplateFile);
  })
}
let template = '';
const readTemplateFile = () => {
  const myReadStream = fs.createReadStream(templateFilePath);
  myReadStream.on('data', chunk => {
    const textData = '' + Buffer.from(chunk);
    template += textData;
  });
  setTimeout(() => {
    correctTemplate();
  }, 200);
}
const correctTemplate = () => {
  fs.readdir(dirComponents, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      let filePath = path.join(dirComponents, file);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        if (!stats.isDirectory() && path.parse(filePath).ext === '.html') {
          const myReadStream = fs.createReadStream(filePath);
          myReadStream.on('data', chunk => {
            const textData = '' + Buffer.from(chunk);
            template = template.replace(`{{${path.parse(filePath).name}}}`, textData)
          });
        }
      })
    }
    setTimeout(() => {
      makeIndexFile();
    }, 200);
  })
}
const makeIndexFile = () => {
  fs.appendFile(indexFilePath, template, err => {
    if (err) throw err;
    mergeStyles();
  });
}
const mergeStyles = () => {
  const prevDir = path.join(__dirname, 'styles');
  const filePath = path.join(__dirname, 'project-dist', 'style.css');
  const arr = [];
  const copyStyles = () => {
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
      else makeAssetsDir();
    });
  }
  copyStyles();
}
const makeAssetsDir = async () => {
  try {
    await fsPromises.mkdir(assetsDirPath, {
      recursive: true
    });
    copyDirectory(prevAssetsDirPath, assetsDirPath);
  } catch (err) {
    if (err) throw err;
  }
}
const copyDirectory = (currentPrevDirectory, currentNextDirectory) => {
  fs.readdir(currentPrevDirectory, (err, files) => {
    if (err) throw err;
    for (let file of files) {
      let prevFilePath = path.join(currentPrevDirectory, file);
      let nextFilePath = path.join(currentNextDirectory, file);
      fs.stat(prevFilePath, (err, stats) => {
        if (err) throw err;
        if (!stats.isDirectory()) fsPromises.copyFile(prevFilePath, nextFilePath);
        else {
          fs.mkdir(nextFilePath, {
            recursive: true
          }, err => {
            if (err) throw err;
            copyDirectory(prevFilePath, nextFilePath);
          })
        }
      })
    }
  })
}
makeDirectory();