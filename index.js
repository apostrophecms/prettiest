const fs = require('fs');
const flockSync = require('fs-ext').flockSync;
const dirname = require('path').dirname;

module.exports = function(options) {
  const dir = dirname(require.main.filename);
  options = options || {};
  const dataFile = options.json || (dir + '/data.json');
  const lockFile = dataFile + '.lock';
  let data;
  let lockFd;

  // Prevent race conditions
  lock();
  load();
  process.on('exit', function() {
    save();
    unlock();
  });

  return data;

  function lock() {
    lockFd = fs.openSync(lockFile, 'a');
    flockSync(lockFd, 'ex');
  }

  function unlock() {
    flockSync(lockFd, 'un');
    try {
      fs.closeSync(lockFd);
      // We do NOT delete the lockfile. That can cause
      // race conditions.
    } catch (e) {
      // Another instance may have jumped on the file,
      // but as we've already unlocked, we don't
      // care anymore
    }
  }

  function load() {
    if (!fs.existsSync(dataFile)) {
      data = {};
      return;
    }
    const content = fs.readFileSync(dataFile);
    data = JSON.parse(content);
  }

  function save() {
    // For data integrity, don't overwrite the old file until
    // we're sure it worked
    fs.writeFileSync(dataFile + '.tmp', JSON.stringify(data));
    fs.renameSync(dataFile + '.tmp', dataFile);
  }
};
