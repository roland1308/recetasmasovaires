import React, { Component } from 'react';
import { Link } from "react-router-dom";

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
        Axios.delete('recipes/delete', {
            data: { _id }
        })
        window.open("/", "_self")
    };

    render() {
        const { _id, name, type, chef, pax, pictures, ingredients, preparation } = this.props.recipe
        return (
            <div className="card">
                <div className="card-header" id={"heading" + this.props.toggler}>
                    <TiDeleteOutline onClick={() => { if (window.confirm(`¿Estás seguro que quieres eliminar la receta ${name}?`)) this.deleteRecipe(_id) }} className="float-right linkNoDecoration deletePen" />
                    <button className="btnFullWidth linkNoDecoration btn btn-link collapsed" data-toggle="collapse" data-target={"#collapse" + this.props.toggler} aria-expanded="false" aria-controls={"collapse" + this.props.toggler}>
                        <CardBody>
                            <CardTitle>{name}</CardTitle>
                            <CardSubtitle>{"Un " + type + " de: " + chef + "."}</CardSubtitle>
                            {pax > 0 && (
                                <CardSubtitle>{"Para " + pax + " personas."}</CardSubtitle>
                            )}
                        </CardBody>
                    </button>
                    <Link to={{ pathname: "/editrecipe", state: this.props }} className="float-right linkNoDecoration editPen"><FaPencilAlt /></Link>
                </div>
                <div id={"collapse" + this.props.toggler} className="card-body collapse" aria-labelledby={"heading" + this.props.toggler} data-parent="#accordion">
                    <UncontrolledCarousel items={pictures} />
                    <CardBody>
                        <Button color="primary" id={"ingredientToggler" + this.props.toggler} style={{ marginTop: "0.5rem", width: "113px" }}>
                            Ingredientes
                        </Button>
                        <UncontrolledCollapse toggler={"#ingredientToggler" + this.props.toggler}>
                            <RecipeTable ingredients={ingredients} />
                        </UncontrolledCollapse>
                        <br></br>
                        <Button color="primary" id={"preparationToggler" + this.props.toggler} style={{ marginTop: "0.5rem", width: "113px" }}>
                            Preparación
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

export default RecipeCard;
