process.env.NODE_ENV = 'production';
const config = require('./config')();
require('powr/build')(config);
