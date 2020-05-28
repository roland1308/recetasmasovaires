import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';
import { connect } from "react-redux";

import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import SortByAlphaRoundedIcon from '@material-ui/icons/SortByAlphaRounded';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

import { Container, Button } from 'react-floating-action-button'

import FadeIn from "react-fade-in";

import RecipeCard from "../components/RecipeCard";
import { recipeList, setPage, setLongList, setFilterFav, recipeReset } from '../store/actions/mainActions';

import { FaSortAmountDown } from 'react-icons/fa';
import { FaSortAmountDownAlt } from 'react-icons/fa';
import { MdViewHeadline } from 'react-icons/md';
import { TiDeleteOutline } from 'react-icons/ti'

class ListAll extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipes: {},
            filteredRecipes: {},
            chef: "",
            chefsList: [],
            name: "",
            ingredient: "",
            type: "",
            orderChef: 1,
            orderName: 1,
            orderType: 1,
            orderId: 1,
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

    handleKey = event => {
        if (event.key === "Enter") {
            const dropdownTitleDiv = document.getElementById("menuSearchTitle")
            const dropdownDiv = document.getElementById("menuSearch")
            dropdownTitleDiv.classList.remove("show")
            dropdownDiv.classList.remove("show")
        }
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
                recipe.chefid[0].name.toLowerCase().includes(chef.toLowerCase())
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
            let nameA = a.chefid[0].name.toUpperCase()
            let nameB = b.chefid[0].name.toUpperCase()
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
        this.closeSortMenu()
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
        this.closeSortMenu()
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
        this.closeSortMenu()
    }

    sortId = () => {
        let sortRecipe = this.state.filteredRecipes
        let result = null
        sortRecipe.sort((a, b) => {
            if (a._id < b._id) {
                result = -this.state.orderId;
            }
            if (a._id > b._id) {
                result = this.state.orderId;
            }
            return result
        })
        this.setState({
            filteredRecipes: sortRecipe,
            orderId: -this.state.orderId
        })
        this.closeSortMenu()
    }

    closeSortMenu = () => {
        const dropdownTitleDiv = document.getElementById("menuSortTitle")
        const dropdownDiv = document.getElementById("menuSort")
        dropdownTitleDiv.classList.remove("show")
        dropdownDiv.classList.remove("show")
    }

    removeFilter = (field) => {
        const filterParameters = this.state
        let inputToReset = document.getElementById(field)
        inputToReset.value = ""
        filterParameters[field] = ""
        this.setState({
            [field]: "",
        })
        this.filterRecipes(filterParameters)
    }

    filterFav = () => {
        this.props.dispatch(setFilterFav())
    }

    toggleList = () => {
        this.props.dispatch(setLongList())
    }

    isAddRecipe() {
        this.props.dispatch(recipeReset());
        this.props.history.push("/addrecipe");
    }

    render() {
        const { language, nrOfRecipes, isLongList, filterFav, renderToggle, recipes } = this.props
        const { orderName, orderChef, orderType, orderId } = this.state
        const { chef, name, ingredient, type, filteredRecipes } = this.state
        const isChefFiltering = chef !== ""
        const isNameFiltering = name !== ""
        const isIngredientFiltering = ingredient !== ""
        const isTypeFiltering = type !== ""
        return (
            <div className="jumboTop">
                <div
                    className="headBar">
                    <div className="dropdown" id="menuSearchTitle">
                        <SearchRoundedIcon
                            className="dropdown-toggle filterButton" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        />
                        <div className="dropdown-menu menu-right dropright filterMenu" id="menuSearch">
                            {language[0]}
                            <div className="dropdown-items">
                                <FormGroup>
                                    <Input onChange={this.changeFilter} onKeyDown={this.handleKey} type="text" name="chef" id="chef" placeholder={language[1]} />
                                </FormGroup>
                                <FormGroup>
                                    <Input onChange={this.changeFilter} onKeyDown={this.handleKey} type="text" name="name" id="name" placeholder={language[3]} />
                                </FormGroup>
                                <FormGroup>
                                    <Input onChange={this.changeFilter} onKeyDown={this.handleKey} type="text" name="ingredient" id="ingredient" placeholder={language[4]} />
                                </FormGroup>
                                <FormGroup>
                                    <Input onChange={this.changeFilter} onKeyDown={this.handleKey} type="text" name="type" id="type" placeholder={language[5]} />
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown" id="menuSortTitle">
                        <SortByAlphaRoundedIcon
                            className="dropdown-toggle filterButton" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        />
                        <div className="dropdown-menu menu-right dropright filterMenu" id="menuSort">
                            <div className="dropdown-items">
                                {language[14]}
                                <p onClick={this.sortChef} className="form-control">{language[1]}{" "}{orderChef === 1 ? <FaSortAmountDownAlt className="sortingSvg" /> : <FaSortAmountDown className="sortingSvg" />}</p>
                                <p onClick={this.sortName} className="form-control">{language[3]}{" "}{orderName === 1 ? <FaSortAmountDownAlt className="sortingSvg" /> : <FaSortAmountDown className="sortingSvg" />}</p>
                                <p onClick={this.sortType} className="form-control">{language[5]}{" "}{orderType === 1 ? <FaSortAmountDownAlt className="sortingSvg" /> : <FaSortAmountDown className="sortingSvg" />}</p>
                                <p onClick={this.sortId} className="form-control">{language[16]}{" "}{orderId === 1 ? <FaSortAmountDownAlt className="sortingSvg" /> : <FaSortAmountDown className="sortingSvg" />}</p>
                            </div>
                        </div>
                    </div>
                    <div onClick={this.toggleList}>
                        <MdViewHeadline className={isLongList ? "filterButton" : "filterButton blueFilter"} />
                    </div>
                    <div className="dropup">
                        <FavoriteBorderRoundedIcon className={filterFav ? "filterButton redFilter" : "filterButton"} type="button" onClick={this.filterFav} />
                    </div>
                </div>
                <FadeIn>
                    {(this.state.filteredRecipes.length > 0) && (nrOfRecipes > 0) && (renderToggle !== undefined) ?
                        (<div className="row" id="accordion">
                            {this.state.filteredRecipes.map((recipe, index) => {
                                if (!filterFav || (this.props.user.favorites.includes(recipe._id) && filterFav)) {
                                    return (
                                        <div className="col-sm-6" key={index}>
                                            <RecipeCard recipe={recipe} isLongList={isLongList} filterFav={filterFav} index={index.toString()} />
                                        </div>
                                    );
                                }
                                return null
                            })}
                        </div>) :
                        (<div className="error">
                            {language[13]}
                        </div>)
                    }
                </FadeIn>
                <Container className="addButton">
                    <Button
                        tooltip="Add a new recipe!"
                        rotate={false}
                        onClick={() => { this.isAddRecipe() }}> <AddRoundedIcon className="addSvg" />
                    </Button>
                </Container>
                {(isChefFiltering || isNameFiltering || isIngredientFiltering || isTypeFiltering) ?
                    (
                        <Container className="filterInfo active">
                            <p>{language[15]} {filteredRecipes.length}/{recipes.length}</p>
                            {isChefFiltering &&
                                <div onClick={() => this.removeFilter("chef")}>
                                    <TiDeleteOutline className="deleteSvgBack filtering" />
                                    {language[1]}
                                </div>
                            }
                            {isNameFiltering &&
                                <div onClick={() => this.removeFilter("name")}>
                                    <TiDeleteOutline className="deleteSvgBack filtering" />
                                    {language[3]}
                                </div>}
                            {isIngredientFiltering &&
                                <div onClick={() => this.removeFilter("ingredient")}>
                                    <TiDeleteOutline className="deleteSvgBack filtering" />
                                    {language[4]}
                                </div>}
                            {isTypeFiltering &&
                                <div onClick={() => this.removeFilter("type")}>
                                    <TiDeleteOutline className="deleteSvgBack filtering" />
                                    {language[5]}
                                </div>}
                        </Container>)
                    :
                    (
                        <Container className="filterInfo">
                        </Container>)
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
    isLongList: state.main.isLongList,
    filterFav: state.main.filterFav,
    renderToggle: state.main.renderToggle,
});

export default connect(mapStateToProps)(ListAll);