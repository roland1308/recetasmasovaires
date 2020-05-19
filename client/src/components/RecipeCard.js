import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
    Card,
    CardBody,
    CardTitle, CardSubtitle, UncontrolledCarousel,
    UncontrolledCollapse, Button, Badge
} from 'reactstrap';

import RecipeTable from './RecipeTable';

import { FaPencilAlt } from 'react-icons/fa'
import { TiDeleteOutline } from 'react-icons/ti'
import { AiOutlineLike } from 'react-icons/ai'
import { MdFavoriteBorder } from 'react-icons/md'

import Axios from 'axios';
import { recipeDelete, addLike, removeLike, addFav, removeFav } from '../store/actions/mainActions';

class RecipeCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLiked: [],
            isFaved: [],
        }
    }

    componentDidMount() {
        const { user, index } = this.props
        const { likes, _id } = this.props.recipe
        if (likes.filter(userLiked => userLiked === user._id).length !== 0) {
            let momIsLiked = this.state.isLiked
            momIsLiked[index] = true
            this.setState({ isLiked: momIsLiked })
        }
        if (user.favorites.filter(userFaved => userFaved === _id).length !== 0) {
            let momIsFaved = this.state.isFaved
            momIsFaved[index] = true
            this.setState({ isFaved: momIsFaved })
        }
    }

    deleteRecipe = (_id) => {
        const token = window.localStorage.token;
        if (_id !== "") {
            let URL = this.props.user.database + "delete"
            Axios.delete(URL, {
                data: { _id },
                headers: { authorization: `bearer ${token}` }
            })
            this.props.dispatch(recipeDelete(_id))
        }
    };

    toggleLike = ({ _id, index }) => {
        const { user } = this.props
        const { likes } = this.props.recipe
        const chefId = user._id
        const token = window.localStorage.token
        if (likes.filter(userLiked => userLiked === chefId).length !== 0) {
            this.props.dispatch(removeLike({ chefId, _id, token, URL: this.props.user.database + "/pulllike" }))
        } else {
            this.props.dispatch(addLike({ chefId, _id, token, URL: this.props.user.database + "/pushlike" }))
        }
    }

    toggleFav = ({ _id, index }) => {
        const { user } = this.props
        const chefId = user._id
        const token = window.localStorage.token
        if (user.favorites.filter(userFaved => userFaved === _id).length !== 0) {
            this.props.dispatch(removeFav({ chefId, _id, token, URL: "/users/pullfav" }))
        } else {
            this.props.dispatch(addFav({ chefId, _id, token, URL: "/users/pushfav" }))
        }
    }

    render() {
        const { language, user, index, renderToggle } = this.props
        const { _id, name, type, chef, pax, pictures, ingredients, preparation, likes } = this.props.recipe
        const bwLink = pictures[0].src.replace("/upload/", "/upload/e_grayscale/")
        const cardStyle = {
            backgroundImage: "linear-gradient(rgba(250, 250, 250, 0.7), rgba(250, 250, 250, 0.7)), url(" + bwLink + ")",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }
        const colorTable = [
            "153,204,204",
            "153,179,204",
            "153,153,204",
            "179,153,204",
            "153,204,179",
            "113,183,183",
            "153,204,179"
        ]
        let color = undefined
        switch (type) {
            case language[7]:
                color = 0
                break;
            case language[8]:
                color = 1
                break;
            case language[9]:
                color = 2
                break;
            case language[10]:
                color = 3
                break;
            case language[11]:
                color = 4
                break;
            case language[12]:
                color = 5
                break;
            default:
                color = 6
                break;
        }
        const cardColor = {
            backgroundColor: "rgb(" + colorTable[color] + ")"
        }

        const NOlikeButtonClass = "button grey text-blanco text-shadow-negra float-right",
            NOlikeSvgClass = "likeSvg blackText",
            likeButtonClass = "button blue text-blanco text-shadow-negra float-right",
            likeSvgClass = "likeSvg whiteText"
        const NOfavButtonClass = "button grey text-blanco text-shadow-negra float-right",
            NOfavSvgClass = "favSvg blackText",
            favButtonClass = "button redStrong text-blanco text-shadow-negra float-right",
            favSvgClass = "favSvg whiteText"
        return (
            <div style={cardColor} className="card">
                <div style={cardStyle} className="card-header row" id={"heading" + index}>
                    <button className="btnFullWidth linkNoDecoration btn btn-link collapsed col-10 noPadding" data-toggle="collapse" data-target={"#collapse" + index} aria-expanded="false" aria-controls={"collapse" + index}>
                        <CardBody>
                            <CardTitle>{name}</CardTitle>
                            <CardSubtitle>{language[1] + type + language[2] + chef + "."}</CardSubtitle>
                            {pax > 0 && (
                                <CardSubtitle>{language[3] + pax + language[4]}</CardSubtitle>
                            )}
                        </CardBody>
                    </button>
                    <div className="col-2 noPadding">
                        {user.name === chef ?
                            (<div className="flexButtons float-right">
                                <div id="delete" className="button red text-blanco text-shadow-negra float-right" onClick={() => { if (window.confirm(language[0] + name + "?")) this.deleteRecipe(_id) }}>
                                    <TiDeleteOutline className="deleteSvg" />
                                </div>
                                <Link id="edit" className="button green text-blanco text-shadow-negra float-right" to={{ pathname: "/editrecipe", state: this.props.recipe }}>
                                    <FaPencilAlt className="editSvg" />
                                </Link>
                            </div>) :
                            (<div className="flexButtons float-right">
                                <div id={"like" + index} className={(likes.filter(userLiked => userLiked === user._id).length !== 0) ? likeButtonClass : NOlikeButtonClass} onClick={() => this.toggleLike({ _id, index })}>
                                    <AiOutlineLike className={(likes.filter(userLiked => userLiked === user._id).length !== 0) ? likeSvgClass : NOlikeSvgClass} />
                                </div>
                                <div id={"fav" + index} className={(user.favorites.filter(userFaved => userFaved === _id).length !== 0) ? favButtonClass : NOfavButtonClass} onClick={() => this.toggleFav({ _id, index })}>
                                    <MdFavoriteBorder className={(user.favorites.filter(userFaved => userFaved === _id).length !== 0) ? favSvgClass : NOfavSvgClass} />
                                </div>
                            </div>)
                        }
                    </div>
                    {likes.length > 0 && renderToggle !== undefined && (
                        <Badge color="primary">
                            {language[13]}
                            {likes.length}
                            {likes.length === 1 ? language[14] : language[4]}</Badge>
                    )}
                </div>
                <div id={"collapse" + index} className="card-body collapse" aria-labelledby={"heading" + index} data-parent="#accordion">
                    <UncontrolledCarousel items={pictures} />
                    <CardBody>
                        <button id={"ingredientToggler" + index} className="chunky chunkyBlue chunkyW133">
                            {language[5]}
                        </button>
                        <UncontrolledCollapse toggler={"#ingredientToggler" + index}>
                            <RecipeTable ingredients={ingredients} />
                        </UncontrolledCollapse>
                        <br></br>
                        <button id={"preparationToggler" + index} className="chunky chunkyBlue chunkyW133">
                            {language[6]}
                        </button>
                        <UncontrolledCollapse toggler={"#preparationToggler" + index}>
                            <Card>
                                <CardBody>
                                    <div className="preparationField" dangerouslySetInnerHTML={{ __html: preparation }}></div>
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>
                    </CardBody>
                </div>
            </div>
        );
    };
}

const mapStateToProps = state => ({
    language: state.main.language.recipecard,
    user: state.main.user,
    recipes: state.main.recipes,
    renderToggle: state.main.renderToggle,
});

export default connect(mapStateToProps)(RecipeCard);
