import http from 'http';
import https from 'https';
import fs from 'fs';
import { env, port, ip, apiRoot, certFilePath, keyFilePath } from './config';
import express from './services/express';
import api from './api';

const key = fs.readFileSync(`${certFilePath}`);
const cert = fs.readFileSync(`${keyFilePath}`);
const options = {
  key: key,
  cert: cert
};

const app = express(apiRoot, api);

const server = env === 'production' ? https.createServer(app, options) : http.createServer(app);

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

export default app;
