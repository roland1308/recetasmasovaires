import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { recipeAdd } from "../store/actions/mainActions";
import { connect } from "react-redux";

import {
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

    isAddRecipe() {
        this.props.dispatch(recipeAdd());
        this.props.history.push("/addrecipe");
    }

    render() {
        return (
            <div>
                <h2>¡Bienvenid@s a nuestro Libro de Recetas!</h2>
                <hr></hr>
                <Link to="./listall" className="linkNoDecoration">
                    <Button className="landButton" color="success" size="large">
                        Buscar
                    </Button>
                    <span>Busca entre las recetas presentes.</span>
                </Link>
                <hr></hr>
                <div onClick={() => { this.isAddRecipe() }}>
                    <Button className="landButton" color="success" size="large">
                        Añadir
                    </Button>
                    <span>Añade tu receta de familia.</span>
                    <hr></hr>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(LandingPage);
