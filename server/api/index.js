import { Router } from 'express';

const Subscription = require('../models/subscription.model');

const router = new Router();

var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('d6a6208c71b46a6965913df792f505f9');


mixpanel.track('Sommelier:Notification:Subscribe', { end_point: 'create' });

router.get('/send', async (req, res) => {

  const data = await Subscription.find().limit(5);

  res.status(201).json({ code: 201, version: '0.0.3', data });

  mixpanel.track('Sommelier:Notification:Send', { data: data });
});

router.post('/subscribe', async (req, res) => {
  const subscription = req.body;

  const subData = await Subscription.findOne({
    endpoint: subscription.endpoint,
    p256dh: subscription.keys.p256dh,
    auth: subscription.keys.auth
  });

  if (!subData) {
    const newSubscriptionData = new Subscription({
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    })
    newSubscriptionData.save();

    mixpanel.track('Sommelier:Notification:Subscribe', { end_point: subscription.endpoint });
  }

  res.status(201).json({code: 201, success: true, subscription});
});

export default router;

