require('dotenv').config();
const path = require('path');
const express = require('express');
const ms = require('ms');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');

const app = express();
const router = require('./routes/router');
const __DEV__ = process.env.NODE_ENV === 'development';
const accessLogStream = rfs('access.log', {
  interval: '1d',
  path: path.resolve(process.cwd(), 'log'),
  size: '10M',
  compress: 'gzip'
});
const errorLogStream = rfs('error.log', {
  interval: '1d',
  path: path.resolve(process.cwd(), 'log'),
  size: '10M',
  compress: 'gzip'
});

app.locals.__DEV__ = __DEV__;
app.locals.__APP_NAME__ = process.env.APP_NAME;

app
  .set('view engine', 'ejs')
  .set('views', path.resolve(process.cwd(), 'views'))
  .set('view cache', !__DEV__)
  .set('PORT', process.env.PORT || 3000)
  .set('ENV', process.env.NODE_ENV || 'production')
  .set('case sensitive routing', false)
  .set('json escape', true)
  .set('trust proxy', true)
  .set('x-powered-by', false)

app
  .use(express.static(path.resolve(process.cwd(), 'public'), {
    index: false,
    cacheControl: !__DEV__,
    dotfiles: 'deny',
    etag: !__DEV__,
    immutable: !__DEV__,
    maxAge: !__DEV__ ? ms('30d') : 0
  }))
  .use(morgan('combined', {
    stream: errorLogStream,
    skip: function (req, res) { return res.statusCode < 400 }
  }))
  .use(morgan('combined', {
    stream: accessLogStream,
    skip: function (req, res) { return res.statusCode > 400 }
  }))
  .use(router);

app.listen(app.get('PORT'), () => {
  console.log(`SERVER RUNNING\nPORT: ${app.get('PORT')}\nENV: ${app.get('ENV')}`);
});