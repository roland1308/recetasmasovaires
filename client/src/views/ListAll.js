import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';

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
        const filterIngredient = event.target.value.split(" ")
        let copyRecipes = this.state.recipes
        for (let ing of filterIngredient) {
            copyRecipes = copyRecipes.filter(recipe => {
                return recipe.ingredients.some(checkIngredient => {
                    return checkIngredient.ingredient.toLowerCase().includes(ing.toLowerCase())
                })
            })
        }
        this.setState({
            filteredRecipes: copyRecipes
        })
    }

    render() {
        if (!this.state.isLoaded) {
            return null
        }
        return (
            <div>
                <div className="filters">
                    <button className="btn filterButton" type="button" data-toggle="collapse" data-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">
                        Busca receta por:
                    </button>
                    <div class="collapse" id="collapseFilter">
                        <div className="card-body filterFields">
                            <FormGroup>
                                <Input onChange={this.changeName} type="text" name="name" id="name" placeholder="nombre:" />
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={this.changeIngredient} type="text" name="ingredient" id="ingredient" placeholder="ingredientes:" />
                            </FormGroup>
                        </div>
                    </div>
                </div>
                <div className="row" id="accordion">
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