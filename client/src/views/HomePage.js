import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Spinner } from 'reactstrap';

import { checkToken, recipeReset } from "../store/actions/mainActions";
import { connect } from "react-redux";

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    componentDidMount() {
        const token = window.localStorage.token;
        if (token && this.props.isLogged === false) {
            console.log(token);
            this.props.dispatch(checkToken(token));
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    isAddRecipe() {
        this.props.dispatch(recipeReset());
        this.props.history.push("/addrecipe");
    }

    render() {
        if (this.props.isLoading) {
            return (
                <div className="spinner">
                    <Spinner color="danger" />
                </div>
            )
        }
        const { language } = this.props
        return (
            <div>
                <br></br>
                <h3>{language[1]}</h3>
                <h2>{language[2]}</h2>
                <hr></hr>
                <Link to="listall" className="linkNoDecoration">
                    <button className="chunky chunkyGreen chunkyW101">
                        {language[3]}
                    </button>
                    <span>{language[4]}</span>
                </Link>
                <hr></hr>
                <div onClick={() => { this.isAddRecipe() }}>
                    <button className="chunky chunkyGreen chunkyW101">
                        {language[5]}
                    </button>
                    <span>{language[6]}</span>
                    <hr></hr>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.main.language.homepage,
    user: state.main.user,
    isLoading: state.main.isLoading,
});

export default connect(mapStateToProps)(HomePage);
