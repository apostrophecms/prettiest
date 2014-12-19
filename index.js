var fs = require('fs');
var sleep = require('sleep');
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

  // Use a classic directory creation lock. All filesystems
  // scrupulously avoid allowing two directories with the
  // same name

  function lock() {
    while(true) {
      try {
        fs.mkdirSync(lockFile);
        return;
      } catch (e) {
        sleep.usleep(50000);
      }
    }
  }

  function unlock() {
    fs.rmdirSync(lockFile);
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
