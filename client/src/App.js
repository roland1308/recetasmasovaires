import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import HomePage from './views/HomePage';
import ListAll from './views/ListAll';
import AddRecipe from './views/AddRecipe';
import EditRecipe from './components/EditRecipe';

import { languages } from './components/languages'
import { setLanguage } from "./store/actions/mainActions";
import { connect } from "react-redux";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Jumbotron
} from 'reactstrap';
import RecipeCard from './components/RecipeCard';
import LandingPage from './views/LandingPage';

class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  // componentDidMount() {
  //   this.props.dispatch(setLanguage(languages().esp))
  // }

  setLanguage = (lang) => {
    let payload = {
      lang: "",
      url: this.props.url
    }
    this.toggle()
    switch (lang) {
      case "English":
        payload.lang = languages().eng
        break;
      case "Italiano":
        payload.lang = languages().ita
        break;
      case "Español":
        payload.lang = languages().esp
        break;
      case "Català":
        payload.lang = languages().cat
        break;
      default:
        break;
    }
    this.props.dispatch(setLanguage(payload))
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    const { language } = this.props
    return (
      <div className="App">
        {language !== undefined ? (
          <BrowserRouter>
            <Navbar color="inverse" light expand="md">
              <Link className="linkNoDecoration navbar" to="/">
                {language[0]}
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
            </Navbar>
            <Jumbotron>
              <Switch>
                <Route exact path='/' component={HomePage} />
                <Route path="/listall" component={ListAll} />
                <Route path="/addrecipe" component={AddRecipe} />
                <Route path="/editrecipe" component={EditRecipe} />
                <Route path="/recipecard" component={RecipeCard} />
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
  url: state.main.url,
});

export default connect(mapStateToProps)(App);
