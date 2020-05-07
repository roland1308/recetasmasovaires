import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import HomePage from './views/HomePage';
import ListAll from './views/ListAll';
import AddRecipe from './views/AddRecipe';
import EditRecipe from './components/EditRecipe';
import { Spinner } from 'reactstrap';

import { setLanguage, checkToken } from "./store/actions/mainActions";
import changeLanguage from './components/changeLanguage';
import { connect } from "react-redux";

import { MdFavorite } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";

import MenuRoundedIcon from "@material-ui/icons/MenuRounded";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Jumbotron
} from 'reactstrap';
import LandingPage from './views/LandingPage';
import { RecipeNavBar } from './views/RecipeNavBar';

class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    const token = window.localStorage.token;
    if (token && this.props.isLogged === false) {
      this.props.dispatch(checkToken(token));
    }
  }

  setLanguage = (lang) => {
    const payload = changeLanguage(lang)
    this.props.dispatch(setLanguage(payload))
    this.toggle()
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    const { user, isLogged } = this.props
    if (this.props.isLoading) {
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
            <div className="flexNavbar">
              <Link className="pumpkin-flat-button linkNoDecoration" to="/">
                {user.book}
              </Link>
              <div className="dropdown">
                <MenuRoundedIcon
                  className="colorPrimary"
                  data-toggle="dropdown"
                />
                <div className="dropdown-menu menu-left">
                  <NavItem>
                    <NavLink onClick={() => this.setLanguage("English")}>English</NavLink>
                    <NavLink onClick={() => this.setLanguage("Italiano")}>Italiano</NavLink>
                    <NavLink onClick={() => this.setLanguage("Español")}>Español</NavLink>
                    <NavLink onClick={() => this.setLanguage("Català")}>Català</NavLink>
                  </NavItem>
                </div>
              </div>
            </div>
            {/* <Navbar color="inverse" light expand="md">
              <Link className="pumpkin-flat-button linkNoDecoration" to="/">
                {user.book}
              </Link>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink onClick={() => this.setLanguage("English")}>English</NavLink>
                    <NavLink onClick={() => this.setLanguage("Italiano")}>Italiano</NavLink>
                    <NavLink onClick={() => this.setLanguage("Español")}>Español</NavLink>
                    <NavLink onClick={() => this.setLanguage("Català")}>Català</NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Navbar> */}
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
  language: state.main.language,
  isLoading: state.main.isLoading,
  isLogged: state.main.isLogged,
  user: state.main.user,
});

export default connect(mapStateToProps)(App);
