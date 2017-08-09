import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { bootApp, networkMiddleware } from 'tahini';

import networkHandlers from './network';

const TahiniApp = bootApp([ networkMiddleware(networkHandlers) ] )
  .getDevice(App, [], App.initState);

ReactDOM.render(<TahiniApp />, document.getElementById('root'));
registerServiceWorker();
