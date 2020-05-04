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

class RecipeCardShort extends Component {

    deleteRecipe = (_id) => {
        if (_id !== "") {
            let URL = this.props.user.database + "delete"
            Axios.delete(URL, {
                data: { _id }
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
        let color = 5
        switch (type) {
            case "antipasto":
                color = 0
                break;
            case "primo":
                color = 1
                break;
            case "secondo":
                color = 2
                break;
            case "contorno":
                color = 3
                break;
            case "dolce":
                color = 4
                break;
            case "piatto unico":
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
                        <TiDeleteOutline onClick={() => { if (window.confirm(language[46] + name + "?")) this.deleteRecipe(_id) }} className="float-right linkNoDecoration deletePen" />
                    }
                    <button className="btnFullWidth linkNoDecoration btn btn-link collapsed" data-toggle="collapse" data-target={"#collapse" + this.props.toggler} aria-expanded="false" aria-controls={"collapse" + this.props.toggler}>
                        <CardBody>
                            <CardTitle>{name}</CardTitle>
                            {false && <CardSubtitle>{language[47] + type + language[48] + chef + "."}</CardSubtitle>}
                            {pax > 0 && false && (
                                <CardSubtitle>{language[49] + pax + language[50]}</CardSubtitle>
                            )}
                        </CardBody>
                    </button>
                    {user.name === chef &&
                        <Link to={{ pathname: "/editrecipe", state: this.props.recipe }} className="float-right linkNoDecoration editPen"><FaPencilAlt /></Link>
                    }
                </div>
                <div id={"collapse" + this.props.toggler} className="card-body collapse" aria-labelledby={"heading" + this.props.toggler} data-parent="#accordion">
                    <UncontrolledCarousel items={pictures} />
                    <CardBody>
                        <Button color="primary" id={"ingredientToggler" + this.props.toggler} style={{ marginTop: "0.5rem", width: "113px" }}>
                            {language[51]}
                        </Button>
                        <UncontrolledCollapse toggler={"#ingredientToggler" + this.props.toggler}>
                            <RecipeTable ingredients={ingredients} />
                        </UncontrolledCollapse>
                        <br></br>
                        <Button color="primary" id={"preparationToggler" + this.props.toggler} style={{ marginTop: "0.5rem", width: "113px" }}>
                            {language[52]}
                        </Button>
                        <UncontrolledCollapse toggler={"#preparationToggler" + this.props.toggler}>
                            <Card>
                                <CardBody>
                                    <div dangerouslySetInnerHTML={{ __html: preparation }}></div>
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
    language: state.main.language,
    user: state.main.user,
});

export default connect(mapStateToProps)(RecipeCardShort);
