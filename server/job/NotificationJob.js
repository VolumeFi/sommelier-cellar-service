import axios from "axios";
import { publicVapidKey, privateVapidKey, storyblokAccessToken } from '../config';



const Subscription = require('../models/subscription.model');

const webpush = require('web-push');
webpush.setVapidDetails('mailto:val@wdev733@gmail.com', publicVapidKey, privateVapidKey);

const leadZero = (val) => {
  return val > 9 ? val : `0${val}`;
}

const NotificationJob = function () {
    this.sendNotification();

    setInterval(this.sendNotification.bind(this), 60 * 1000);
}

const beforeDayHour = 7;
const todayHour = 6;

NotificationJob.prototype.sendNotification = async function() {

  const d = new Date();     // today
  const dt = new Date(d.getTime() + 86400 * 1000);   // tomorrow

  const pdt = new Date(d.getTime() + (3600 * 1000 * (-7)));   // pdt timezone

  const hour = Math.floor((pdt.getTime() % (86400 * 1000)) / (3600  * 1000));
  const min = Math.floor((pdt.getTime() % (3600 * 1000)) / (60 * 1000));

  const today = `${d.getFullYear()}-${leadZero(d.getMonth() + 1)}-${leadZero(d.getDate())}`;
  const tomorrow = `${dt.getFullYear()}-${leadZero(dt.getMonth() + 1)}-${leadZero(dt.getDate())}`;

  // console.log(hour, min);
  if ((hour === beforeDayHour || hour === todayHour) && (min === 0)) {
    const response = await axios.get(
      `https://api.storyblok.com/v1/cdn/stories/?starts_with=events&token=${storyblokAccessToken}`
    )

    if (!('data' in response)) {
      return;
    }

    if (response.data.stories.length === 0) {
      return;
    }

    const subscriptions = await Subscription.find({});

    if (subscriptions.length === 0) {
      return;
    }

    for (let j = 0; j < response.data.stories.length; j++) {

      const story = response.data.stories[j];

      const startTime = story.content.start_date;
      const startDate = startTime.split(' ')[0];

      // console.log(startDate);

      let shouldSend = false;
      if ((startDate === today) && (hour === todayHour)) {
        shouldSend = true;
      }

      if ((startDate === tomorrow) && (hour === beforeDayHour)) {
        shouldSend = true;
      }

      if (shouldSend === false) {
        return;
      }

      // console.log(`https://api.storyblok.com/v1/cdn/stories/?token=${storyblokAccessToken}&starts_with=events`);
      // console.log(story);

      const event = {
        title: story.content.title,
        description: `A reminder that ${story.content.title} will be on ${story.content.start_date}`,
        url: story.full_slug,
        image: story.content.event_image.filename
      }
          
      const payload = JSON.stringify(event);

      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = {
          endpoint: subscriptions[i].endpoint,
          expirationTime: null,
          keys: {
            p256dh: subscriptions[i].p256dh,
            auth: subscriptions[i].auth
          }
        }

        webpush.sendNotification(subscription, payload).catch(error => {
          console.error(error.stack);
        });
      }
    }
  }
}

module.exports = NotificationJob;
