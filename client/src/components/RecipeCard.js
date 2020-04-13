import React from 'react';
import {
    Card, CardBody,
    CardTitle, CardSubtitle, UncontrolledCarousel,
    UncontrolledCollapse, Button,
} from 'reactstrap';
import RecipeTable from './RecipeTable';

const RecipeCard = (props) => {
    return (
        <Card>
            <CardBody>
                <CardTitle>{props.recipe.name}</CardTitle>
                <CardSubtitle>{props.recipe.chef}</CardSubtitle>
            </CardBody>
            <UncontrolledCarousel items={props.recipe.pictures} />
            <CardBody>
                <div>
                    <Button color="primary" id={"ingredientToggler" + props.toggler} style={{ marginBottom: '1rem' }}>
                        Ingredientes
                    </Button>
                    <UncontrolledCollapse toggler={"#ingredientToggler" + props.toggler}>
                        <RecipeTable ingredients={props.recipe.ingredients} />
                    </UncontrolledCollapse>
                    <br></br>
                    <Button color="primary" id={"preparationToggler" + props.toggler} style={{ marginBottom: '1rem' }}>
                        Preparación
                    </Button>
                    <UncontrolledCollapse toggler={"#preparationToggler" + props.toggler}>
                        <Card>
                            <CardBody>
                                {props.recipe.preparation}
                            </CardBody>
                        </Card>
                    </UncontrolledCollapse>
                </div>
            </CardBody>
        </Card>
    );
};

export default RecipeCard;
