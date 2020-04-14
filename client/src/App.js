import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LandingPage from './views/LandingPage';
import ListAll from './views/ListAll';
import AddRecipe from './views/AddRecipe';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar color="inverse" light expand="md">
            <NavbarBrand href="/">Recetas de los Masovaires</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href="/components/">Acceso</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <Route path="/listall" component={ListAll} />
            <Route path="/addrecipe" component={AddRecipe} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}