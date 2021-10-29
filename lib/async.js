const { arrayForEach } = require("./utils");

class AsyncJobManager {
    constructor() {
        this.jobs = [];
    }

    addPendingJob(job) {
        this.jobs.push(job);
    }

    executePendingJobs() {
        return arrayForEach(this.jobs, job => job(), this);
    }

    asSyncFunction(f, thisArg) {
        const addPendingJob = this.addPendingJob.bind(this);
        return function() {
            const boundThis = thisArg || this, args = Array.from(arguments);
            addPendingJob(() => f.apply(boundThis, args));
        };
    }
}

module.exports = { AsyncJobManager };