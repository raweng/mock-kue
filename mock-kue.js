'use strict';

var kue = require('kue')
	, Q = require('q');

var mockJobs = [];
var jobsProcessor = {};

kue.Job.prototype.save = function(fn){
	this._state = this._state || 'inactive';
	this.id = mockJobs.length;
	mockJobs.push(this);
}

kue.prototype.process = function(type, n, fn){
	jobsProcessor[type] = fn;
}	

kue.jobCount = function(){
	return mockJobs.length;
}

kue.drain = function(){
	var promises = [];
	var self = this;
	while(mockJobs.length > 0){
		var job = mockJobs.shift();
		var fn = jobsProcessor[job.type];
		if(fn){
			var deferred = Q.defer();
			var done = callback(job, deferred);
			job._state = 'active';
			fn(job, done);
			promises.push(deferred.promise);
		}
	}
	return Q.all(promises);
}

kue.clear = function(){
	mockJobs = [];
}

var callback = function(job, deferred){
	return function(err){
			if(err){
				job._state = 'failed';
				deferred.reject(err);
			}else{
				job._progress = 100;
				job._state = 'complete';
				deferred.resolve();
			}
	};
}