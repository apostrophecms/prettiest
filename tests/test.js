const exec = require('child_process').exec;
const fs = require('fs');

const instances = 100;

let good = true;
let terminated = 0;

if (fs.existsSync('data.json')) {
  fs.unlinkSync('data.json');
}

console.log('Starting ' + instances + ' instances simultaneously.\nThey may run in any order, but they will not\nrun simultaneously, and the final count in the database\nwill be ' + instances + '.\n');

for (let i = 0; (i < instances); i++) {
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
  const data = JSON.parse(fs.readFileSync('data.json'));
  if (data.count != instances) {
    console.error('Execution count is wrong, locking bug (or you are testing on a filesystem that does not support flock)');
    process.exit(1);
  }
  console.log('All tests passing.');
  process.exit(0);
}
