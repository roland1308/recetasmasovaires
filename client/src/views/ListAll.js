import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

import RecipeCard from "../components/RecipeCard";

const axios = require("axios");

class ListAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: {},
            filteredRecipes: {},
            isLoaded: false,
            name: "",
            ingredient: ""
        };
    }

    async componentDidMount() {
        try {
            const response = await axios.get("/recipes/all");
            this.setState({
                recipes: response.data,
                filteredRecipes: response.data,
                isLoaded: true
            })
        } catch (error) {
            console.log(error);
        }
    }

    changeName = event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value,
        })
        let copyRecipes = this.state.recipes.filter(recipe => {
            return recipe.name.toLowerCase().includes(event.target.value.toLowerCase())
        })
        this.setState({
            filteredRecipes: copyRecipes
        })
    }

    changeIngredient = event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value,
        })
        const copyRecipes = this.state.recipes.filter(recipe => {
            return recipe.ingredients.some(checkIngredient => {
                return checkIngredient.ingredient.toLowerCase().includes(event.target.value.toLowerCase())
            })
        })
        this.setState({
            filteredRecipes: copyRecipes
        })
    }

    render() {
        if (!this.state.isLoaded) {
            return null
        }
        return (
            <div className="container">
                <div className="filters">
                    <FormGroup>
                        <Label for="name">Busca receta por:</Label>
                        <Input onChange={this.changeName} type="text" name="name" id="name" placeholder="nombre:" />
                    </FormGroup>
                    <FormGroup>
                        <Input onChange={this.changeIngredient} type="text" name="ingredient" id="ingredient" placeholder="ingredientes:" />
                    </FormGroup>
                </div>
                <div className="row">
                    {this.state.filteredRecipes.map((recipe, index) => {
                        return (
                            <div className="col-sm-6" key={index}>
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