import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
    CardBody,
    CardTitle, CardSubtitle, UncontrolledCarousel,
    UncontrolledCollapse, Button
} from 'reactstrap';

import RecipeTable from './RecipeTable';

import { FaPencilAlt } from 'react-icons/fa'
import { TiDeleteOutline } from 'react-icons/ti'
import Axios from 'axios';

class RecipeCard extends Component {
    deleteRecipe = (_id) => {
        let URL = this.props.url + "delete"
        Axios.delete(URL, {
            data: { _id }
        })
        window.open("/", "_self")
    };

    render() {
        const { language } = this.props
        const { _id, name, type, chef, pax, pictures, ingredients, preparation } = this.props.recipe
        return (
            <div className="card">
                <div className="card-header" id={"heading" + this.props.toggler}>
                    <TiDeleteOutline onClick={() => { if (window.confirm(language[46] + name + "?")) this.deleteRecipe(_id) }} className="float-right linkNoDecoration deletePen" />
                    <button className="btnFullWidth linkNoDecoration btn btn-link collapsed" data-toggle="collapse" data-target={"#collapse" + this.props.toggler} aria-expanded="false" aria-controls={"collapse" + this.props.toggler}>
                        <CardBody>
                            <CardTitle>{name}</CardTitle>
                            <CardSubtitle>{language[47] + type + language[48] + chef + "."}</CardSubtitle>
                            {pax > 0 && (
                                <CardSubtitle>{language[49] + pax + language[50]}</CardSubtitle>
                            )}
                        </CardBody>
                    </button>
                    <Link to={{ pathname: "/editrecipe", state: this.props.recipe }} className="float-right linkNoDecoration editPen"><FaPencilAlt /></Link>
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
                            <CardBody>
                                <div dangerouslySetInnerHTML={{ __html: preparation }}></div>
                            </CardBody>
                        </UncontrolledCollapse>
                    </CardBody>
                </div>
            </div>
        );
    };
}

const mapStateToProps = state => ({
    language: state.main.language,
    url: state.main.url,
});

export default connect(mapStateToProps)(RecipeCard);
