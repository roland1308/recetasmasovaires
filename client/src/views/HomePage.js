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
        const { language } = this.props
        return (
            <div>
                <br></br>
                <h3>{language[1]}</h3>
                <h2>{language[2]}</h2>
                <hr></hr>
                <Link to="listall" className="linkNoDecoration">
                    <Button className="landButton" color="success" size="large">
                        {language[3]}
                    </Button>
                    <span>{language[4]}</span>
                </Link>
                <hr></hr>
                <div onClick={() => { this.isAddRecipe() }}>
                    <Button className="landButton" color="success" size="large">
                        {language[5]}
                    </Button>
                    <span>{language[6]}</span>
                    <hr></hr>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.main.language
});

export default connect(mapStateToProps)(LandingPage);
