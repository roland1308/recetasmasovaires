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

import {
  // Collapse,
  Navbar,
  // NavbarToggler,
  // Nav,
  // NavItem,
  // NavLink,
  Jumbotron
} from 'reactstrap';
import LandingPage from './views/LandingPage';

class App extends Component {
  constructor(props) {
    super(props);

    // this.toggle = this.toggle.bind(this);
    this.state = {
      // isOpen: false,
    };
  }

  componentDidMount() {
    const token = window.localStorage.token;
    let result = ""
    if (token && this.props.isLogged === false) {
      result = this.props.dispatch(checkToken(token));
    }
    console.log(result);

  }

  setLanguage = (lang) => {
    const payload = changeLanguage(lang)
    this.props.dispatch(setLanguage(payload))
    this.toggle()
  }

  // toggle() {
  //   this.setState({
  //     isOpen: !this.state.isOpen
  //   });
  // }
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
            {/* <Navbar color="inverse" light expand="md">
              <Link className="pumpkin-flat-button linkNoDecoration" to="/">
                {user.book}
              </Link> */}
            <nav className="navbar navbar-light bg-light  navbar-expand-lg">
              <Link className="pumpkin-flat-button linkNoDecoration" to="/">
                {user.book}
              </Link>
              <form className="form-inline">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                  <ul className="navbar-nav">
                    <li className="nav-item active">
                      <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Features</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">Pricing</a>
                    </li>
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown link
        </a>
                      <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a className="dropdown-item" href="#">Action</a>
                        <a className="dropdown-item" href="#">Another action</a>
                        <a className="dropdown-item" href="#">Something else here</a>
                      </div>
                    </li>
                  </ul>
                </div>
              </form>
            </nav>
            {/* <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink onClick={() => this.setLanguage("English")}>English</NavLink>
                    <NavLink onClick={() => this.setLanguage("Italiano")}>Italiano</NavLink>
                    <NavLink onClick={() => this.setLanguage("Español")}>Español</NavLink>
                    <NavLink onClick={() => this.setLanguage("Català")}>Català</NavLink>
                  </NavItem>
                </Nav>
              </Collapse> */}
            {/* </Navbar> */}
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
  isLoading: state.main.isLoading,
  isLogged: state.main.isLogged,
});

export default connect(mapStateToProps)(App);
