import React, { Component } from 'react'
import { Provider } from 'react-redux'
//import routes from './routes'
import { Router, Route, IndexRoute, browserHistory, Redirect } from 'react-router'

import Login from '../containers/Login.jsx';
import Dashboard from '../containers/Dashboard.jsx';
import MasterPage from '../containers/MasterPage.jsx';
import Welcome from '../containers/Welcome.jsx';

class Root extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
        <Router history={browserHistory}   >
          <Redirect from="/" to="/login" />
          <Route path="/login" component={Login} />
          <Route path="/" component={MasterPage} >
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/welcome" component={Welcome} />
          </Route>
        </Router>
      </Provider>
    )
  }
}

export default Root;
