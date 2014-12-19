var fs = require('fs-ext');
var dirname = require('path').dirname;

module.exports = function(options) {
  var dir = dirname(require.main.filename);
  options = options || {};
  var dataFile = options.json || (dir + '/data.json');
  var lockFile = dataFile + '.lock';
  var data;

  // Prevent race conditions
  lock();
  load();
  process.on('exit', function() {
    save();
    unlock();
  });

  return data;

  var lockFd;

  function lock() {
    lockFd = fs.openSync(lockFile, 'a');
    fs.flockSync(lockFd, 'ex');
  }

  function unlock() {
    fs.flockSync(lockFd, 'un');
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
    var content = fs.readFileSync(dataFile);
    data = JSON.parse(content);
  }

  function save() {
    // For data integrity, don't overwrite the old file until
    // we're sure it worked
    fs.writeFileSync(dataFile + '.tmp', JSON.stringify(data));
    fs.renameSync(dataFile + '.tmp', dataFile);
  }
};
