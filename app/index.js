const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.resolve(__dirname, 'assets'));
  },
  filename(req, file, callback) {
    callback(null, file.originalname);
    // callback(null, file.fieldname + '-' + Date.now());
  },
});
const upload = multer({
  storage,
  limits: {
    fields: 10,
    files: 3,
    fileSize: 1000000,
  },
}).array('files', 3);

let APP_PORT = process.env.PORT || 3030;

const app = express();
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'development';
  const wrappack = require('wrappack');
  const config = require('./config');

  wrappack(app, config());
  /*const webpack = require('webpack');
  const webpackMiddleware = require("webpack-dev-middleware");
  const config = require('./webpack');

  const compiler = webpack(config);
  app.use(webpackMiddleware(compiler, {
    contentBase: '/public/',
    publicPath: '/js/',
    stats: { colors: true },
  }));*/
}

app.post('/upload', upload, (req, res) => {
  const file = req.files;

  setTimeout(() => {
    req.files.forEach(file => {
      fs.unlink(file.path, err => {});
    });
  }, 1 * 60000);

  res.json({
    success: true,
    files: file.map(file => {
      return {
        encoding: file.encoding,
        filename: file.filename,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.originalname,
        url: `/${file.originalname}`,
      };
    }),
  });
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'assets')));
app.use('/node_modules', express.static(path.resolve(__dirname, '..', 'node_modules')));
app.use((err, req, res) => {
  res.status(500).json(err);
});
app.listen(APP_PORT, () => {
  console.log(`Server is now running on http://localhost:${APP_PORT}`);
});
