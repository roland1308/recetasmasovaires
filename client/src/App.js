import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import HomePage from './views/HomePage';
import ListAll from './views/ListAll';
import AddRecipe from './views/AddRecipe';
import EditRecipe from './components/EditRecipe';

import { setLanguage } from "./store/actions/mainActions";
import changeLanguage from './components/changeLanguage';
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
    const { language, user } = this.props
    return (
      <div className="App">
        {language !== undefined ? (
          <BrowserRouter>
            <Navbar color="inverse" light expand="md">
              <Link className="linkNoDecoration navbar" to="/">
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
            </Navbar>
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
  user: state.main.user,
});

export default connect(mapStateToProps)(App);
