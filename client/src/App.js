import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import HomePage from './views/HomePage';
import ListAll from './views/ListAll';
import AddRecipe from './views/AddRecipe';
import EditRecipe from './components/EditRecipe';
import { Spinner } from 'reactstrap';

import { checkToken } from "./store/actions/mainActions";
import { connect } from "react-redux";

import {
  Jumbotron
} from 'reactstrap';
import LandingPage from './views/LandingPage';
import RecipesNavbar from './components/RecipesNavbar';

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
        {isLogged ? (
          <BrowserRouter>
            <RecipesNavbar />
            <Jumbotron>
              <Switch>
                <Route exact path='/' component={HomePage} />
                <Route path="/listall" component={ListAll} />
                <Route path="/addrecipe" component={AddRecipe} />
                <Route path="/editrecipe" component={EditRecipe} />
              </Switch>
            </Jumbotron>
          </BrowserRouter>
        ) : (
            <LandingPage />
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.main.isLoading,
  isLogged: state.main.isLogged,
});

export default connect(mapStateToProps)(App);
