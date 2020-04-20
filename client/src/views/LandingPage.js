import React, { Component } from 'react';
import { Link } from "react-router-dom";

import {
    Jumbotron,
    Button
} from 'reactstrap';

class LandingPage extends Component {
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
            <div>
                <h1>Bienvenid@s a nuestro libro de cocina!</h1>
                <hr></hr>
                <Link to="./listall" className="linkNoDecoration">
                    <Button className="landButton" color="success" size="large">
                        Mirar
                        </Button>
                    <span>Visualiza las recetas presentes.</span>
                </Link>
                <hr></hr>
                <Link to="./addrecipe" className="linkNoDecoration">
                    <Button className="landButton" color="success" size="large">
                        Añadir
                        </Button>
                    <span>Añade tu receta de familia.</span>
                </Link>
                <hr></hr>
            </div>
        );
    }
}

export default LandingPage;