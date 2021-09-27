const NotificationJob = require('./NotificationJob');

const Job = function () { }

Job.prototype.start = function () {
    new NotificationJob();
}
  
module.exports = new Job();
