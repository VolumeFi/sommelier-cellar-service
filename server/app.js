import http from 'http';
import https from 'https';
import fs from 'fs';
import { env, port, ip, apiRoot, certFilePath, keyFilePath, keyChainPath, mongodbUrl } from './config';
import express from './services/express';
import api from './api';

const mongoose = require('mongoose');

const app = express(apiRoot, api);

mongoose.connect(mongodbUrl).then(() => {
  console.log('Connected to MongoDB');
  
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/msg.sommelier.finance/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/msg.sommelier.finance/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/msg.sommelier.finance/chain.pem', 'utf8');
  const options = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const server = env === 'production' ? https.createServer(options, app) : http.createServer(app);
  // const server = http.createServer(app);

  setImmediate(() => {
    server.listen(port, ip, () => {
      console.log(
        'Express server listening on https://%s:%d, in %s mode',
        ip,
        port,
        env
      );
    });
  });
});

export default app;
