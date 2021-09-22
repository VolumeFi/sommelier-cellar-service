import { Router } from 'express';
import { publicVapidKey, privateVapidKey } from '../config';

const webpush = require('web-push');
const router = new Router();

console.log(publicVapidKey);
console.log(privateVapidKey);
webpush.setVapidDetails('mailto:val@wdev733@gmail.com', publicVapidKey, privateVapidKey);

router.get('/send', (req, res) => {
  res.status(201).json({code: 201, success: true});

//   console.log(req.pushManager);
//   console.log(navigator);
//   const payload = JSON.stringify({ title: 'test' });

//   webpush.sendNotification(subscription, payload).catch(error => {
//     console.error(error.stack);
//   });
});

router.post('/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({code: 201, success: true});
  
  const payload = JSON.stringify({ title: 'test' });
  
  console.log(subscription);

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
});

export default router;
