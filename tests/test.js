var exec = require('child_process').exec;
var fs = require('fs');

var instances = 10;

var good = true;
var terminated = 0;

if (fs.existsSync('data.json')) {
  fs.unlinkSync('data.json');
}

for (var i = 0; (i < instances); i++) {
  exec('node test-instance', function(error, stdout, stderr) {
    terminated++;
    console.log(stdout);
    if (error) {
      console.error(stderr);
      good = false;
    }
    if (stderr.length) {
      console.error(stderr);
      good = false;
    }
    if (terminated === instances) {
      finish();
    }
  });
};

function finish() {
  if (!good) {
    console.error('An error occurred. Tests failing.');
    process.exit(1);
  }
  var data = JSON.parse(fs.readFileSync('data.json'));
  if (data.count != instances) {
    console.error('Execution count is wrong, locking bug?');
    process.exit(1);
  }
  console.log('All tests passing.');
  process.exit(0);
}
