import React, { Component } from 'react';
import { connect } from "react-redux";

import { recipeEdit } from "../store/actions/mainActions";

class editRecipe extends Component {

    componentDidMount() {
        this.props.dispatch(recipeEdit(this.props.location.state));
        this.props.history.push("/addrecipe")
    }

    render() {
        return (
            <div>EDIT</div>
        );
    };
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps)(editRecipe);
