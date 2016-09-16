import 'babel-polyfill';
import App from './app';
import React from 'react';
import ReactDOM from 'react-dom';
import '../lib/style.less';

ReactDOM.render(
  <App />,
  document.getElementById('target')
);
