import React, {Component} from 'react';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'redux';
import Navbar from '../Navbar/Navbar';
import Report from '../Report/Report';
import UsersList from '../UsersList/UsersList';

class App extends Component {
  render() {
    let routes = (
      <Switch>
        <Route path="/" exact component={Report} />
        <Redirect to="/" />
      </Switch>
    );

    // if (this.props.isAuth) {
    routes = (
      <Switch>
        <Route path="/" exact component={Report} />
        <Route path="/users" component={UsersList} />
        <Redirect to="/" />
      </Switch>
    );
    // }

    return (
      <React.Fragment>
        <Navbar />
        <main role="main" className="bg-light">
          {routes}
        </main>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    // isAuth: !!state.auth.token
  };
}

const withConnect = connect(
    mapStateToProps
);

export default withRouter(compose(
    withConnect
)(App));
