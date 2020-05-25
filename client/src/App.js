import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Spinner, Jumbotron } from 'reactstrap';
import { connect } from "react-redux";

import HomePage from './views/HomePage';
import ListAll from './views/ListAll';
import AddRecipe from './views/AddRecipe';
import EditRecipe from './components/EditRecipe';
import LogIn from './views/LogIn';
import RecipesNavbar from './components/RecipesNavbar';
import ChefProfile from './views/ChefProfile';

import { checkToken } from "./store/actions/mainActions";

class App extends Component {

  componentDidMount() {
    const token = window.localStorage.token;
    if (token && this.props.isLogged === false) {
      this.props.dispatch(checkToken(token));
    }
  }

  render() {
    const { isLoading, isLogged } = this.props
    if (isLoading) {
      return (
        <div className="spinner">
          <Spinner color="danger" />
        </div>
      )
    }
    return (
      <div className="App">
        <BrowserRouter>
          {isLogged ? (
            <div>
              <RecipesNavbar />
              <Jumbotron>
                <Switch>
                  <Route exact path='/' component={HomePage} />
                  <Route path="/listall" component={ListAll} />
                  <Route path="/addrecipe" component={AddRecipe} />
                  <Route path="/editrecipe" component={EditRecipe} />
                  <Route path="/login" component={LogIn} />
                  <Route path="/chefprofile" component={ChefProfile} />
                </Switch>
              </Jumbotron>
            </div>
          ) : (
              <LogIn />
            )
          }
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.main.isLoading,
  isLogged: state.main.isLogged,
});

export default connect(mapStateToProps)(App);
