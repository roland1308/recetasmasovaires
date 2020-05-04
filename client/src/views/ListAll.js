import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';
import { connect } from "react-redux";

import RecipeCard from "../components/RecipeCard";

class ListAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: {},
            filteredRecipes: {},
            chef: props.language[33],
            chefsList: [],
            name: "",
            ingredient: "",
            type: props.language[37]
        };
    }

    componentDidMount() {
        const { recipes } = this.props
        this.setState({
            recipes,
            filteredRecipes: recipes,
            chefsList: Array.from(
                new Set(recipes.map(recipe => recipe.chef))
            )
        })
    }

    changeFilter = event => {
        event.preventDefault()
        const filterParameters = this.state
        filterParameters[event.target.name] = event.target.value
        this.setState({
            [event.target.name]: event.target.value,
        })
        this.filterRecipes(filterParameters)
        console.log(this.state.filteredRecipes);
        console.log(filterParameters);

    }

    filterRecipes = (filterParameters) => {
        let { chef, name, ingredient, type } = filterParameters
        const singleIngredient = ingredient.split(" ")
        chef = (chef === this.props.language[33]) ||
            (chef === this.props.language[34]) ? "" : chef
        type = (type === this.props.language[37]) ||
            (type === this.props.language[38]) ? "" : type
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
        console.log(this.state.filteredRecipes);

    }

    render() {
        const { language, nrOfRecipes } = this.props
        return (
            <div>
                <div className="filters">
                    <button className="btn filterButton" type="button" data-toggle="collapse" data-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">
                        {language[32]}
                    </button>
                    <div className="collapse" id="collapseFilter">
                        <div className="card-body filterFields">
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="select" name="chef" id="chef" value={this.state.chef}>
                                    <option disabled hidden>{language[33]}</option>
                                    <option>{language[34]}</option>
                                    {this.state.chefsList.map((chef, index) => {
                                        return (<option key={index}>{chef}</option>)
                                    }
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="text" name="name" id="name" placeholder={language[35]} />
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="text" name="ingredient" id="ingredient" placeholder={language[36]} />
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="select" name="type" id="type" value={this.state.type}>
                                    <option disabled hidden>{language[37]}</option>
                                    <option>{language[38]}</option>
                                    <option>{language[39]}</option>
                                    <option>{language[40]}</option>
                                    <option>{language[41]}</option>
                                    <option>{language[42]}</option>
                                    <option>{language[43]}</option>
                                    <option>{language[44]}</option>
                                    )}
                                </Input>
                            </FormGroup>
                        </div>
                    </div>
                </div>
                {(this.state.filteredRecipes.length > 0) && (nrOfRecipes > 0) ?
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
                        {language[45]}
                    </div>)
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.main.user,
    language: state.main.language,
    recipes: state.main.recipes,
    nrOfRecipes: state.main.nrOfRecipes,
});

export default connect(mapStateToProps)(ListAll);