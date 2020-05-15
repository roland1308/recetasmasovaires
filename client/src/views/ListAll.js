import React, { Component } from 'react';
import { FormGroup, Input, Badge } from 'reactstrap';
import { connect } from "react-redux";

import FadeIn from "react-fade-in";

import RecipeCard from "../components/RecipeCard";
import { recipeList } from '../store/actions/mainActions';

import { FcSearch } from 'react-icons/fc';
import { FcGenericSortingAsc } from 'react-icons/fc';
import { FcAlphabeticalSortingAz } from 'react-icons/fc';
import { FcAlphabeticalSortingZa } from 'react-icons/fc';

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
            type: props.language[5],
            orderChef: 1,
            orderName: 1,
            orderType: 1
        };
    }

    componentDidMount() {
        const { recipes } = this.props
        this.props.dispatch(recipeList())
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

    sortChef = () => {
        let sortRecipe = this.state.filteredRecipes
        sortRecipe.sort((a, b) => {
            let nameA = a.chef.toUpperCase()
            let nameB = b.chef.toUpperCase()
            if (nameA < nameB) {
                return -this.state.orderChef;
            }
            if (nameA > nameB) {
                return this.state.orderChef;
            }
        })
        this.setState({
            filteredRecipes: sortRecipe,
            orderChef: -this.state.orderChef
        })
    }

    sortName = () => {
        let sortRecipe = this.state.filteredRecipes
        sortRecipe.sort((a, b) => {
            let nameA = a.name.toUpperCase()
            let nameB = b.name.toUpperCase()
            if (nameA < nameB) {
                return -this.state.orderName;
            }
            if (nameA > nameB) {
                return this.state.orderName;
            }
        })
        this.setState({
            filteredRecipes: sortRecipe,
            orderName: -this.state.orderName
        })
    }

    sortType = () => {
        let sortRecipe = this.state.filteredRecipes
        sortRecipe.sort((a, b) => {
            let A = this.props.language.findIndex(c => c === a.type.toString())
            let B = this.props.language.findIndex(c => c === b.type.toString())
            if (A < B) {
                return -this.state.orderType;
            }
            if (A > B) {
                return this.state.orderType;
            }
        })
        this.setState({
            filteredRecipes: sortRecipe,
            orderType: -this.state.orderType
        })
    }

    render() {
        const { language, nrOfRecipes } = this.props
        const { orderName, orderChef, orderType } = this.state
        return (
            <div>
                <FadeIn>
                    {(this.state.filteredRecipes.length > 0) && (nrOfRecipes > 0) ?
                        (<div className="row" id="accordion">
                            {this.state.filteredRecipes.map((recipe, index) => {
                                return (
                                    <div className="col-sm-6" key={index}>
                                        <RecipeCard recipe={recipe} index={index.toString()} />
                                    </div>
                                );
                            })}
                        </div>) :
                        (<div className="error">
                            {language[13]}
                        </div>)
                    }
                </FadeIn>
                <footer className="footbar">
                    <div className="dropup">
                        <FcSearch
                            className="btn filterButton" type="button" data-toggle="collapse" data-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter"
                        />
                        <div className="collapse" id="collapseFilter">
                            <div className="card-body bottomMenu filterFields">
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
                    <div className="btn-group dropup">
                        <FcGenericSortingAsc
                            className="btn filterButton" type="button" data-toggle="collapse" data-target="#collapseFilter2" aria-expanded="false" aria-controls="collapseFilter2"
                        />
                        <div className="collapse" id="collapseFilter2">
                            <div className="card-body bottomMenu sortFields">
                                <p onClick={this.sortChef} className="form-control">{language[1]}{" "}{orderChef === 1 ? <FcAlphabeticalSortingZa /> : <FcAlphabeticalSortingAz />}</p>
                                <p onClick={this.sortName} className="form-control">{language[3]}{" "}{orderName === 1 ? <FcAlphabeticalSortingZa /> : <FcAlphabeticalSortingAz />}</p>
                                <p onClick={this.sortType} className="form-control">{language[5]}{" "}{orderType === 1 ? <FcAlphabeticalSortingZa /> : <FcAlphabeticalSortingAz />}</p>
                            </div>
                        </div>
                    </div>
                </footer>
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