const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
  {
    endpoint: {
      type: String,
    },
    p256dh: {
      type: String,
    },
    auth: {
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * @typedef Subscription
 */
const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
