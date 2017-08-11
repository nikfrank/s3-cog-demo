import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route, Switch, Redicrect} from 'react-router-dom';
import {bootApp, networkMiddleware} from 'tahini';
import createHashHistory from 'history/createHashHistory';

import networkHandlers from './network';

const TahiniApp = bootApp([networkMiddleware(networkHandlers)]).getDevice(App, [], App.initState);
const history = createHashHistory();

ReactDOM.render(
  <Router history={history}>
  <Switch>
    <Route path='/' component={TahiniApp}/>
  </Switch>
</Router>, document.getElementById('root'));
registerServiceWorker();
