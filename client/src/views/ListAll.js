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
            chef: props.language[1],
            chefsList: [],
            name: "",
            ingredient: "",
            type: props.language[5]
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
    }

    filterRecipes = (filterParameters) => {
        let { chef, name, ingredient, type } = filterParameters
        const singleIngredient = ingredient.split(" ")
        chef = (chef === this.props.language[1]) ||
            (chef === this.props.language[2]) ? "" : chef
        type = (type === this.props.language[5]) ||
            (type === this.props.language[6]) ? "" : type
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
        const { language, nrOfRecipes } = this.props
        return (
            <div>
                <div className="filters">
                    <button className="btn filterButton" type="button" data-toggle="collapse" data-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">
                        {language[0]}
                    </button>
                    <div className="collapse" id="collapseFilter">
                        <div className="card-body filterFields">
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="select" name="chef" id="chef" value={this.state.chef}>
                                    <option disabled hidden>{language[1]}</option>
                                    <option>{language[2]}</option>
                                    {this.state.chefsList.map((chef, index) => {
                                        return (<option key={index}>{chef}</option>)
                                    }
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="text" name="name" id="name" placeholder={language[3]} />
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="text" name="ingredient" id="ingredient" placeholder={language[4]} />
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={this.changeFilter} type="select" name="type" id="type" value={this.state.type}>
                                    <option disabled hidden>{language[5]}</option>
                                    <option>{language[6]}</option>
                                    <option>{language[7]}</option>
                                    <option>{language[8]}</option>
                                    <option>{language[9]}</option>
                                    <option>{language[10]}</option>
                                    <option>{language[11]}</option>
                                    <option>{language[12]}</option>
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
                        {language[13]}
                    </div>)
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.main.user,
    language: state.main.language.listall,
    recipes: state.main.recipes,
    nrOfRecipes: state.main.nrOfRecipes,
});

export default connect(mapStateToProps)(ListAll);