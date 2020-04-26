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
            chef: "todos los cocineros",
            chefsList: [],
            name: "",
            ingredient: "",
            type: "todos los platos"
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
        const filterParameters = this.state
        filterParameters[event.target.name] = event.target.value
        this.setState({
            [event.target.name]: event.target.value,
        })
        this.filterRecipes(filterParameters)
    }

    filterRecipes = (filterParameters) => {
        let { chef, name, ingredient, type } = filterParameters
        const singleIngredient = ingredient.split(" ")
        chef = chef === "todos los cocineros" ? "" : chef
        type = type === "todos los platos" ? "" : type
        let copyRecipes = this.state.recipes.filter(recipe => {
            return (
                recipe.chef.includes(chef)
            )
        })
        copyRecipes = copyRecipes.filter(recipe => {
            return (
                recipe.name.toLowerCase().includes(name.toLowerCase())
            )
        })
        for (let ing of singleIngredient) {
            copyRecipes = copyRecipes.filter(recipe => {
                return recipe.ingredients.some(checkIngredient => {
                    return checkIngredient.ingredient.toLowerCase().includes(ing.toLowerCase())
                })
            })
        }
        copyRecipes = copyRecipes.filter(recipe => {
            return (
                recipe.type.includes(type)
            )
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
            <div>
                <div className="filters">
                    <button className="btn filterButton" type="button" data-toggle="collapse" data-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">
                        Busca receta por:
                    </button>
                    <div className="collapse" id="collapseFilter">
                        <div className="card-body filterFields">
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="select" name="chef" id="chef" value={this.state.chef}>
                                    <option disabled hidden>cocinero:</option>
                                    <option>todos los cocineros</option>
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
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="select" name="type" id="type" value={this.state.type}>
                                    <option disabled hidden>típo de plato:</option>
                                    <option>todos los platos</option>
                                    <option>entrante</option>
                                    <option>primero</option>
                                    <option>segundo</option>
                                    <option>acompañamiento</option>
                                    <option>postre</option>
                                    <option>plato único</option>
                                    )}
                                </Input>
                            </FormGroup>
                        </div>
                    </div>
                </div>
                {this.state.filteredRecipes.length > 0 ?
                    (<div className="row" id="accordion">
                        {this.state.filteredRecipes.map((recipe, index) => {
                            return (
                                <div className="col-sm-6" key={index}>
                                    <RecipeCard recipe={recipe} toggler={index.toString()}></RecipeCard>
                                </div>
                            );
                        })}
                    </div>) :
                    (<div className="error">
                        NINGUN RESULTADO
                    </div>)
                }
            </div>
        );
    }
}

export default ListAll;