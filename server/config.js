/* eslint-disable no-unused-vars */
import path from 'path';
import merge from 'lodash/merge';

/* istanbul ignore next */
const requireProcessEnv = name => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
};

/* istanbul ignore next */
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '../.env'),
  sample: path.join(__dirname, '../.env.example')
});

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 3001,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    publicVapidKey: process.env.PUBLIC_VAPID_KEY || '',
    privateVapidKey: process.env.PRIVATE_VAPID_KEY || '',
    storyblokAccessToken: process.env.STORYBLOK_ACCESS_TOKEN || '',
    certFilePath: process.env.CERT || '',
    keyFilePath: process.env.KEY || '',
    keyChainPath: process.env.CHAIN || '',
    mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/sommelier-notification',
    mixpanelToken: process.env.MIXPANEL_TOKEN || ''
  }
};

module.exports = merge(config.all, config[config.all.env]);
export default module.exports;
