const fs = require('fs');
const path = require('path');
const { setTimeout } = require('timers');

const processingFolder = path.join(__dirname, 'Processing');
const inProgressFolder = path.join(__dirname, 'In-progress');
const completedFolder = path.join(__dirname, 'Completed');
const crashedFolder = path.join(__dirname, 'Crashed');

function initFolders() {
  [processingFolder, inProgressFolder, completedFolder, crashedFolder].forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  });
}

function generateFiles(io) {
  let count = 0;
  setInterval(() => {
    const filename = path.join(processingFolder, `file_${count}.txt`);
    fs.writeFileSync(filename, `This is file ${count}`);
    io.emit('log', { data: `File created: ${filename}` });
    count++;
  }, 3000);
}

function watchProcessingFolder(io) {
  fs.watch(processingFolder, (eventType, filename) => {
    if (eventType === 'rename' && filename) {
      const filePath = path.join(processingFolder, filename);
      if (fs.existsSync(filePath)) {
        processFile(io, filePath);
      }
    }
  });
}

function processFile(io, filePath) {
  const inProgressPath = path.join(inProgressFolder, path.basename(filePath));
  fs.renameSync(filePath, inProgressPath);
  io.emit('log', { data: `File moved to in-progress: ${inProgressPath}` });

  const processingTime = Math.floor(Math.random() * 6) + 1;
  setTimeout(() => {
    if (processingTime <= 5) {
      const completedPath = path.join(completedFolder, path.basename(inProgressPath));
      fs.renameSync(inProgressPath, completedPath);
      io.emit('log', { data: `File processed: ${completedPath}`, processingTime });
    } else {
      const crashedPath = path.join(crashedFolder, path.basename(inProgressPath));
      fs.renameSync(inProgressPath, crashedPath);
      io.emit('log', { data: `File processing failed: ${crashedPath}` });
    }
  }, processingTime * 1000);
}

function init(io) {
  initFolders();
  generateFiles(io);
  watchProcessingFolder(io);
}

module.exports = { init };
