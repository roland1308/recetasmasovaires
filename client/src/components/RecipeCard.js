import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
    Card,
    CardBody,
    CardTitle, CardSubtitle, UncontrolledCarousel,
    UncontrolledCollapse, Button
} from 'reactstrap';

import RecipeTable from './RecipeTable';

import { FaPencilAlt } from 'react-icons/fa'
import { TiDeleteOutline } from 'react-icons/ti'
import Axios from 'axios';
import { recipeDelete } from '../store/actions/mainActions';

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
            // window.open("/", "_self")
        }
    };

    render() {
        const { language, user } = this.props
        const { _id, name, type, chef, pax, pictures, ingredients, preparation } = this.props.recipe
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
        return (
            <div style={cardColor} className="card">
                <div style={cardStyle} className="card-header" id={"heading" + this.props.toggler}>
                    {user.name === chef &&
                        <div id="red" className="button red text-blanco text-shadow-negra float-right" onClick={() => { if (window.confirm(language[0] + name + "?")) this.deleteRecipe(_id) }}>
                            <TiDeleteOutline className="deleteSvg" />
                        </div>
                    }
                    <button className="btnFullWidth linkNoDecoration btn btn-link collapsed" data-toggle="collapse" data-target={"#collapse" + this.props.toggler} aria-expanded="false" aria-controls={"collapse" + this.props.toggler}>
                        <CardBody>
                            <CardTitle>{name}</CardTitle>
                            <CardSubtitle>{language[1] + type + language[2] + chef + "."}</CardSubtitle>
                            {pax > 0 && (
                                <CardSubtitle>{language[3] + pax + language[4]}</CardSubtitle>
                            )}
                        </CardBody>
                    </button>
                    {user.name === chef &&
                        <Link id="green" className="button green text-blanco text-shadow-negra float-right" to={{ pathname: "/editrecipe", state: this.props.recipe }}>
                            <FaPencilAlt className="deleteSvg" style={{ fontSize: "1rem", margin: "3px" }} />
                        </Link>
                    }
                </div>
                <div id={"collapse" + this.props.toggler} className="card-body collapse" aria-labelledby={"heading" + this.props.toggler} data-parent="#accordion">
                    <UncontrolledCarousel items={pictures} />
                    <CardBody>
                        <Button color="primary" id={"ingredientToggler" + this.props.toggler} style={{ marginTop: "0.5rem", width: "113px" }}>
                            {language[5]}
                        </Button>
                        <UncontrolledCollapse toggler={"#ingredientToggler" + this.props.toggler}>
                            <RecipeTable ingredients={ingredients} />
                        </UncontrolledCollapse>
                        <br></br>
                        <Button color="primary" id={"preparationToggler" + this.props.toggler} style={{ marginTop: "0.5rem", width: "113px" }}>
                            {language[6]}
                        </Button>
                        <UncontrolledCollapse toggler={"#preparationToggler" + this.props.toggler}>
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
});

export default connect(mapStateToProps)(RecipeCard);
