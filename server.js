const path = require('path');
const isDebug = process.env.NODE_ENV !== 'production';
const config = require('./config')();

require('powr/dev-server')(config).listenAsync(config.port)
  .then(() => console.log('Listening on ', config.port))
  .catch(err => console.error(err));
