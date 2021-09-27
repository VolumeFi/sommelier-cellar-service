import { Router } from 'express';
import axios from "axios";
import { publicVapidKey, privateVapidKey, storyblokAccessToken } from '../config';

const webpush = require('web-push');
const router = new Router();

console.log(publicVapidKey);
console.log(privateVapidKey);
webpush.setVapidDetails('mailto:val@wdev733@gmail.com', publicVapidKey, privateVapidKey);

router.get('/send', async (req, res) => {
  const response = await axios.get(
    `https://api.storyblok.com/v1/cdn/stories/?token=${storyblokAccessToken}&starts_with=events`
  )

  if ('data' in response) {
    if (response.data.stories.length > 0) {
      const story = response.data.stories[0];
      const event = {
        title: story.content.title,
        description: `A reminder that ${story.content.title} will be on ${story.content.start_date}`,
        url: story.content.location,
        image: story.content.event_image.filename
      }
      res.status(201).json({code: 201, version: '0.0.2', event });
      return;
    }
  }

  res.status(201).json({code: 201, version: '0.0.3'});
});

router.post('/subscribe', async (req, res) => {
  const response = await axios.get(
    `https://api.storyblok.com/v1/cdn/stories/?token=${storyblokAccessToken}&starts_with=events`
  )

  if ('data' in response) {
    if (response.data.stories.length > 0) {
      const story = response.data.stories[0];
      const event = {
        title: story.content.title,
        description: `A reminder that ${story.content.title} will be on ${story.content.start_date}`,
        url: story.content.location,
        image: story.content.event_image.filename
      }
      
      const subscription = req.body;

      const payload = JSON.stringify(event);
  
      webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
      });
    }
  }

  // const event = {
  //   title: "Twitter Spaces with Mysten Labs CEO Evan Cheng",
  //   content: "A reminder that Twitter Spaces with Mysten Labs CEO Evan Cheng will be on 2021-09-28 15:30",
  //   url: "https://twitter.com/sommfinance",
  //   image: "https://a.storyblok.com/f/104430/1200x674/bdcc5c7b57/som_layout_6.png"
  // }

  // const subscription = req.body;
  // const payload = JSON.stringify(event);
  // webpush.sendNotification(subscription, payload).catch(error => {
  //   console.error(error.stack);
  // });

  res.status(201).json({code: 201, success: true});
});

export default router;

