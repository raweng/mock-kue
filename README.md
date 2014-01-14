mock-kue is a small mocking library for [kue](https://github.com/learnboost/kue). It mocks out `trigger` and `process` functions in kue, while maintaining the jobs in an internal array. You can then inspect the job count and run them at any given time. No connection to redis will be made by kue.

## Installation

Node.js:

```
npm install mock-kue
```

To use, simply require the library:

```
require('mock-kue');
```

## Job Count

You can inspect the job count as follows:

```javascript
var kue = require('kue'),
    jobs = kue.createQueue();

jobs.create('email', {
    title: 'welcome email for tj'
  , to: 'tj@learnboost.com'
  , template: 'welcome-email'
}).save();

kue.jobCount(); // -> '1'
```

## Processing Jobs

To process the jobs in the queue, you need to call the `.drain()` method. `.drain()`
returns a [promise](https://github.com/kriskowal/q). The promise will be fulfilled once all the jobs are done processing. Here's an example:

```javascript
kue.drain()
.then(function() {
    kue.jobCount(); // -> '0'
}, function(err) {
    // there was an error in processing the jobs
    console.log(err.message); 
});
```

## Clearing Jobs

To clear a job, call the `.clear()` method:

```javascript
jobs.create(...).save();
kue.jobCount(); // -> '1'
kue.clear();
kue.jobCount(); // -> '0'
```

## Clearing Jobs

To get the access to created jobs, call the `.getJobs()` method:

```javascript
jobs.create(...).save();
jobs.create(...).save();
kue.jobCount(); // -> '2'
kue.getJobs(); // -> rturns the array of created jobs
```

## License

Copyright (c) 2014 built.io team. This software is licensed under the [MIT License](http://github.com/raweng/mock-kue/raw/master/LICENSE).