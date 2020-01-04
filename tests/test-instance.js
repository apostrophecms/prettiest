// The simplest prettiest app: keeps track of how many
// times it has been run. Magic!

const data = require('../index.js')();

data.count = data.count || 0;
data.count++;
console.log('I have been run ' + data.count + ' times.');
