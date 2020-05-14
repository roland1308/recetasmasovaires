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

import Axios from 'axios';
import { recipeDelete, addLike, removeLike } from '../store/actions/mainActions';

class RecipeCard extends Component {

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
        const { likes } = this.props.recipe
        const chefId = this.props.user._id
        const indexLike = likes.findIndex(likedIds => likedIds === chefId)
        const likeId = "like" + index
        const likeTag = document.getElementById(likeId)
        const token = window.localStorage.token
        if (indexLike === -1) {
            this.props.dispatch(addLike({ chefId, _id, token, URL: this.props.user.database + "/pushlike" }))
            likeTag.classList.add("blue")
            likeTag.children[0].classList.add("whiteText")
            likeTag.classList.remove("grey")
            likeTag.children[0].classList.remove("blackText")
        } else {
            this.props.dispatch(removeLike({ chefId, indexLike, _id, token, URL: this.props.user.database + "/pulllike" }))
            likeTag.classList.add("grey")
            likeTag.children[0].classList.add("blackText")
            likeTag.classList.remove("blue")
            likeTag.children[0].classList.remove("whiteText")
        }
    }

    render() {
        const { language, user, index, likeUpdated } = this.props
        const { _id, name, type, chef, pax, pictures, ingredients, preparation, likes, nrOfLikes } = this.props.recipe
        const bwLink = pictures[0].src.replace("/upload/", "/upload/e_grayscale/")
        const cardStyle = {
            backgroundImage: "linear-gradient(rgba(250, 250, 250, 0.7), rgba(250, 250, 250, 0.7)), url(" + bwLink + ")",
            backgroundSize: "cover",
            backgroundPosition: "center",
            // backgroundRepeat: "no-repeat"
        }
        const colorTable = [
            "153,204,204",
            "153,179,204",
            "153,153,204",
            "179,153,204",
            "153,204,179",
            "113,183,183"
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
                break;
        }
        const cardColor = {
            backgroundColor: "rgb(" + colorTable[color] + ")"
        }

        let likeButtonClass = "button grey text-blanco text-shadow-negra float-right",
            likeSvgClass = "likeSvg blackText"
        if (likes.includes(user._id)) {
            likeButtonClass = "button blue text-blanco text-shadow-negra float-right"
            likeSvgClass = "likeSvg whiteText"
        }

        return (
            <div style={cardColor} className="card">
                <div style={cardStyle} className="card-header row" id={"heading" + index}>
                    <button className="btnFullWidth linkNoDecoration btn btn-link collapsed col-10  noPadding" data-toggle="collapse" data-target={"#collapse" + index} aria-expanded="false" aria-controls={"collapse" + index}>
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
                            (<div id={"like" + index} className={likeButtonClass} onClick={() => this.toggleLike({ _id, index })}>
                                <AiOutlineLike className={likeSvgClass} />
                            </div>)
                        }
                    </div>
                </div>
                {nrOfLikes > 0 && likeUpdated != undefined && (
                    <Badge color="primary">{"This recipe likes to "}{nrOfLikes}</Badge>
                )}
                <div id={"collapse" + index} className="card-body collapse" aria-labelledby={"heading" + index} data-parent="#accordion">
                    <UncontrolledCarousel items={pictures} />
                    <CardBody>
                        <Button color="primary" id={"ingredientToggler" + index} style={{ marginTop: "0.5rem", width: "113px" }}>
                            {language[5]}
                        </Button>
                        <UncontrolledCollapse toggler={"#ingredientToggler" + index}>
                            <RecipeTable ingredients={ingredients} />
                        </UncontrolledCollapse>
                        <br></br>
                        <Button color="primary" id={"preparationToggler" + index} style={{ marginTop: "0.5rem", width: "113px" }}>
                            {language[6]}
                        </Button>
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
    likeUpdated: state.main.likeUpdated,
});

export default connect(mapStateToProps)(RecipeCard);
