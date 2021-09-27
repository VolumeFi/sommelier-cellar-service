import axios from "axios";
import { publicVapidKey, privateVapidKey, storyblokAccessToken } from '../config';

const webpush = require('web-push');
const router = new Router();

console.log(publicVapidKey);
console.log(privateVapidKey);
webpush.setVapidDetails('mailto:val@wdev733@gmail.com', publicVapidKey, privateVapidKey);

const NotificationJob = function () {
    this.sendNotification();

    setInterval(this.sendNotification.bind(this), 60 * 1000);
}

module.exports = MarketPlaceEventScanner;