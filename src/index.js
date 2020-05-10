import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store';

//import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dates/lib/css/_datepicker.css';
//import 'font-awesome/css/font-awesome.css';

// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'

// Containers
import App from './containers/App';
import Login from './containers/Login';
import Logout from './containers/Logout';

const history = createHistory({ basename: '/' });
const store = configureStore(history);
const syncHistory = syncHistoryWithStore(history, store);

ReactDOM.render((
  <Provider store={store}>
    <Router histor={syncHistory}>
      <Switch>
        <Route
          exact
          path="/login" name="Login"
          component={Login}/>
        <Route
          exact
          path="/logout" name="Logout"
          component={Logout}/>
        <Route
          path="/*" name="Stats"
          component={App}/>
      </Switch>
    </Router>
  </Provider>
), document.getElementById('root'));
