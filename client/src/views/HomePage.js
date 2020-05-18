import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Spinner } from 'reactstrap';

import { checkToken, recipeReset } from "../store/actions/mainActions";
import { connect } from "react-redux";
import RecipeCarousel from '../components/RecipeCarousel';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
        };
    }

    componentDidMount() {
        const token = window.localStorage.token;
        const { isLogged } = this.props
        if (token && isLogged === false) {
            console.log(token);
            this.props.dispatch(checkToken(token));
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    isAddRecipe() {
        this.props.dispatch(recipeReset());
        this.props.history.push("/addrecipe");
    }

    render() {
        if (this.props.isLoading) {
            return (
                <div className="spinner">
                    <Spinner color="danger" />
                </div>
            )
        }
        const { language, recipes } = this.props
        const recipesForCarousel = recipes.slice(0, 4)
        let picsForCarousel = [],
            nameForCarousel = []
        recipesForCarousel.map(recipe => {
            picsForCarousel.push(recipe.pictures[0])
            nameForCarousel.push(recipe.name)
        })
        return (
            <div>
                <br></br>
                <h3>{language[1]}</h3>
                <h2>{language[2]}</h2>
                <hr></hr>
                <Link to="listall" className="linkNoDecoration">
                    <button className="chunky chunkyGreen chunkyW101">
                        {language[3]}
                    </button>
                    <span>{language[4]}</span>
                </Link>
                <hr></hr>
                <div onClick={() => { this.isAddRecipe() }}>
                    <button className="chunky chunkyGreen chunkyW101">
                        {language[5]}
                    </button>
                    <span>{language[6]}</span>
                    <hr></hr>
                </div>
                <h4>{language[7]}</h4>
                <RecipeCarousel picsForCarousel={picsForCarousel} nameForCarousel={nameForCarousel} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    language: state.main.language.homepage,
    user: state.main.user,
    isLoading: state.main.isLoading,
    recipes: state.main.recipes,
});

export default connect(mapStateToProps)(HomePage);
