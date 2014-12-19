# prettiest

```javascript
// The simplest script: keeps track of how many
// times it has been run. It's like magic!

var data = require('prettiest')();

data.count = data.count || 0;
data.count++;
console.log('I have been run ' + data.count + ' times.');
```

`prettiest` provides simple command line apps with two important features:

1. **Persistent data.** Any changes made to the data object returned by `prettiest` are automatically saved when the app exits.

2. **Concurrency locks.** If two copies of your app start at the same time, the second one will always wait for the first one to finish before it proceeds.

If you're replacing a shell script with something a little smarter, this module is a great companion for [shelljs](http://documentup.com/arturadib/shelljs).

## Options

You can specify where the JSON data file lives:

```javascript
var data = require('prettiest')({ json: __dirname + '/mydatafile.json' });
```

If you don't, the JSON file lives in the same directory with your app, and will be called `data.json`.

`prettiest` also creates a lock file, which will have the same name as the JSON file, plus `.lock` at the end. To prevent race conditions, the lock file is not removed. Just leave it be.

## Caveats

* The save-and-unlock behavior lives in a `process.on('exit')` handler. If your code crashes node hard enough, that might not run and the lock folder might stick around until someone takes pity on it and deletes it.

* You don't want to use this in a web application. Duh. It's a simple, synchronous bit of magic for use in utilities with short execution times.

* You don't want to use this in a super-long-running script, because it only saves your data to disk at the very end. It's meant for utilities that do a relatively simple job and then exit.

## Questions

* "Can my code still be asynchronous?" Sure, knock yourself out. The save-and-unlock logic runs when your code exits.

## Credits

`prettiest` was built at [P'unk Avenue](https://punkave.com).
