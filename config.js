const path = require('path');
const isDebug = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3030;
const devPort = port + 1;

module.exports = () => ({
  output: path.resolve(__dirname, 'docs'),
  port: port,
  root: path.resolve(__dirname),
  app: path.resolve(__dirname, 'app', 'app.js'),
  cssModules: false,
  alias: {
    'slate-mate': path.resolve(__dirname, 'lib'),
  },
  assets: [
    path.resolve(__dirname, 'docs'),
  ],
  url: isDebug ? `http://localhost:${port}` : 'https://slate-mate.herokuapps.com',
});
