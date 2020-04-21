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
            ingredient: "",
            chef: "Todos",
            chefsList: []
        };
    }

    async componentDidMount() {
        try {
            const response = await axios.get("/recipes/all");
            this.setState({
                recipes: response.data,
                filteredRecipes: response.data,
                isLoaded: true,
                chefsList: Array.from(
                    new Set(response.data.map(recipe => recipe.chef))
                )
            })
        } catch (error) {
            console.log(error);
        }
    }

    changeFilter = event => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value,
        })
        switch (event.target.name) {
            case "chef":
                this.filterRecipes(event.target.value, this.state.name, this.state.ingredient)
                break
            case "name":
                this.filterRecipes(this.state.chef, event.target.value, this.state.ingredient)
                break
            case "ingredient":
                this.filterRecipes(this.state.chef, this.state.name, event.target.value)
                break
            default:
        }
    }

    filterRecipes = (filterChef, filterName, filterIngredientes) => {
        const singleIngredient = filterIngredientes.split(" ")
        filterChef = filterChef === "Todos" ? "" : filterChef
        let copyRecipes = this.state.recipes.filter(recipe => {
            return (
                recipe.chef.includes(filterChef)
            )
        })
        copyRecipes = copyRecipes.filter(recipe => {
            return (
                recipe.name.toLowerCase().includes(filterName.toLowerCase())
            )
        })
        for (let ing of singleIngredient) {
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
                                <Input onChange={this.changeFilter} type="select" name="chef" id="name" placeholder="nombre:">
                                    <option>Todos</option>
                                    {this.state.chefsList.map((chef, index) => {
                                        return (<option key={index}>{chef}</option>)
                                    }
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="text" name="name" id="name" placeholder="nombre:" />
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="text" name="ingredient" id="ingredient" placeholder="ingredientes:" />
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