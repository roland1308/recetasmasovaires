import React, { Component } from 'react';

import RecipeCard from "../components/RecipeCard";

const axios = require("axios");

class ListAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: {},
            isLoaded: false
        };
    }

    async componentDidMount() {
        try {
            const response = await axios.get("/recipes/all");
            this.setState({
                recipes: response.data,
                isLoaded: true
            })
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        if (!this.state.isLoaded) {
            return null
        }
        return (
            <div className="container">
                <div className="row">
                    {this.state.recipes.map((recipe, index) => {
                        return (
                            <div className="col-sm-4" key={index}>
                                <RecipeCard recipe={recipe} toggler={index.toString()}></RecipeCard>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default ListAll;