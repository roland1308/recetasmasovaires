import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';
import { connect } from "react-redux";

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import SortByAlphaRoundedIcon from '@material-ui/icons/SortByAlphaRounded';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

import { Container, Button, Link } from 'react-floating-action-button'

import FadeIn from "react-fade-in";

import RecipeCard from "../components/RecipeCard";
import { recipeList, setPage } from '../store/actions/mainActions';

import { FaSortAmountDown } from 'react-icons/fa';
import { FaSortAmountDownAlt } from 'react-icons/fa';

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
            orderType: 1,
            filterFav: false
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
        this.props.dispatch(setPage("basic"))
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
                recipe.chef.toLowerCase().includes(chef.toLowerCase())
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
        let result = null
        sortRecipe.sort((a, b) => {
            let nameA = a.chef.toUpperCase()
            let nameB = b.chef.toUpperCase()
            if (nameA < nameB) {
                result = -this.state.orderChef;
            }
            if (nameA > nameB) {
                result = this.state.orderChef;
            }
            return result
        })
        this.setState({
            filteredRecipes: sortRecipe,
            orderChef: -this.state.orderChef
        })
    }

    sortName = () => {
        let sortRecipe = this.state.filteredRecipes
        let result = null
        sortRecipe.sort((a, b) => {
            let nameA = a.name.toUpperCase()
            let nameB = b.name.toUpperCase()
            if (nameA < nameB) {
                result = -this.state.orderName;
            }
            if (nameA > nameB) {
                result = this.state.orderName;
            }
            return result
        })
        this.setState({
            filteredRecipes: sortRecipe,
            orderName: -this.state.orderName
        })
    }

    sortType = () => {
        let sortRecipe = this.state.filteredRecipes
        let result = null
        sortRecipe.sort((a, b) => {
            let A = this.props.language.findIndex(c => c === a.type.toString())
            let B = this.props.language.findIndex(c => c === b.type.toString())
            if (A < B) {
                result = -this.state.orderType;
            }
            if (A > B) {
                result = this.state.orderType;
            }
            return result
        })
        this.setState({
            filteredRecipes: sortRecipe,
            orderType: -this.state.orderType
        })
    }

    filterFav = () => {
        let favRecipes = this.props.recipes
        if (!this.state.filterFav) {
            favRecipes = favRecipes.filter(recipe => this.props.user.favorites.includes(recipe._id))
        }
        this.setState({
            filteredRecipes: favRecipes,
            filterFav: !this.state.filterFav
        })
    }

    render() {
        const { language, nrOfRecipes } = this.props
        const { orderName, orderChef, orderType, filterFav } = this.state
        return (
            <div className="jumboTop">
                <div
                    className="headBar">
                    <div className="dropdown">
                        <SearchRoundedIcon
                            className="dropdown-toggle filterButton" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        />
                        <div className="dropdown-menu menu-right dropright filterMenu">
                            {language[0]}
                            <div className="dropdown-items">
                                <FormGroup>
                                    <Input onChange={this.changeFilter} type="text" name="chef" id="chef" placeholder={language[1]} />
                                </FormGroup>
                                <FormGroup>
                                    <Input onChange={this.changeFilter} type="text" name="name" id="name" placeholder={language[3]} />
                                </FormGroup>
                                <FormGroup>
                                    <Input onChange={this.changeFilter} type="text" name="ingredient" id="ingredient" placeholder={language[4]} />
                                </FormGroup>
                                <FormGroup>
                                    <Input onChange={this.changeFilter} type="text" name="type" id="type" placeholder={language[5]} />
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown">
                        <SortByAlphaRoundedIcon
                            className="dropdown-toggle filterButton" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        />
                        <div className="dropdown-menu menu-right dropright filterMenu">
                            <div className="dropdown-items">
                                {language[14]}
                                <p onClick={this.sortChef} className="form-control">{language[1]}{" "}{orderChef === 1 ? <FaSortAmountDownAlt className="sortingSvg" /> : <FaSortAmountDown className="sortingSvg" />}</p>
                                <p onClick={this.sortName} className="form-control">{language[3]}{" "}{orderName === 1 ? <FaSortAmountDownAlt className="sortingSvg" /> : <FaSortAmountDown className="sortingSvg" />}</p>
                                <p onClick={this.sortType} className="form-control">{language[5]}{" "}{orderType === 1 ? <FaSortAmountDownAlt className="sortingSvg" /> : <FaSortAmountDown className="sortingSvg" />}</p>
                            </div>
                        </div>
                    </div>
                    <div className="dropup">
                        <FavoriteBorderRoundedIcon className={filterFav ? "filterButton redFilter" : "filterButton"} type="button" onClick={this.filterFav} />
                    </div>
                </div>
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
                <Container className="addButton">
                    <Button
                        tooltip="The big plus button!"
                        rotate={false}
                        onClick={() => this.props.history.push("/addrecipe")}> <AddRoundedIcon className="addSvg" /> </Button>
                </Container>
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