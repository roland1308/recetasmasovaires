import React from 'react';
import {
    CardBody,
    CardTitle, CardSubtitle, UncontrolledCarousel,
    UncontrolledCollapse, Button
} from 'reactstrap';
import RecipeTable from './RecipeTable';

const RecipeCard = (props) => {
    return (
        <div className="card">
            <div className="card-header" id={"heading" + props.toggler}>
                <button className="linkNoDecoration btn btn-link collapsed" data-toggle="collapse" data-target={"#collapse" + props.toggler} aria-expanded="false" aria-controls={"collapse" + props.toggler}>
                    <CardBody>
                        <CardTitle>{props.recipe.name}</CardTitle>
                        <CardSubtitle>{"Un " + props.recipe.type + " de: " + props.recipe.chef + "."}</CardSubtitle>
                        {props.recipe.pax > 0 && (
                            <CardSubtitle>{"Para " + props.recipe.pax + " personas."}</CardSubtitle>
                        )}
                    </CardBody>
                </button>
            </div>
            <div id={"collapse" + props.toggler} className="card-body collapse" aria-labelledby={"heading" + props.toggler} data-parent="#accordion">
                <UncontrolledCarousel items={props.recipe.pictures} />
                <CardBody>
                    <Button color="primary" id={"ingredientToggler" + props.toggler} style={{ marginTop: "0.5rem", width: "113px" }}>
                        Ingredientes
                        </Button>
                    <UncontrolledCollapse toggler={"#ingredientToggler" + props.toggler}>
                        <RecipeTable ingredients={props.recipe.ingredients} />
                    </UncontrolledCollapse>
                    <br></br>
                    <Button color="primary" id={"preparationToggler" + props.toggler} style={{ marginTop: "0.5rem", width: "113px" }}>
                        Preparación
                        </Button>
                    <UncontrolledCollapse toggler={"#preparationToggler" + props.toggler}>
                        <CardBody>
                            {props.recipe.preparation}
                        </CardBody>
                    </UncontrolledCollapse>
                </CardBody>
            </div>
        </div>
    );
};

export default RecipeCard;
