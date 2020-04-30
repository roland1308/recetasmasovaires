import React, { Component } from 'react';
import { connect } from "react-redux";

import { Table, Card, CardBody, } from 'reactstrap';

import { TiDeleteOutline } from 'react-icons/ti'
import { ingredientRemove } from '../store/actions/mainActions';

class RecipeTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editedIngredients: []
        }
    }

    componentDidMount() {
        const { recipeAction, editRecipe, ingredients } = this.props
        if ((recipeAction === "edit") && (editRecipe.editIngredients.length > 0)) {
            this.setState({ editedIngredients: editRecipe.editIngredients })
        } else {
            this.setState({ editedIngredients: ingredients })
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.nrOfIngredients !== this.props.nrOfIngredients) {
            const { recipeAction, editRecipe, ingredients } = this.props
            if ((recipeAction === "edit") && (editRecipe.editIngredients.length > 0)) {
                this.setState({ editedIngredients: editRecipe.editIngredients })
            } else {
                this.setState({ editedIngredients: ingredients })
            }
        }
    }

    deleteIngredient(index) {
        this.props.dispatch(ingredientRemove(index))
        this.state.editedIngredients.splice(index, 1)
    }

    render() {
        const { language } = this.props
        return (
            <Card>
                <CardBody>
                    <Table hover size="sm">
                        <thead>
                            <tr>
                                <th>{language[53]}</th>
                                <th>{language[54]}</th>
                                {this.props.recipeAction === "edit" && <th></th>}
                            </tr>
                        </thead>
                        {this.state.editedIngredients.length > 0 && this.state.editedIngredients.map((ingredient, index) => {
                            return (
                                <tbody key={index}>
                                    <tr>
                                        <td>{ingredient.ingredient}</td>
                                        <td>{ingredient.qty}</td>
                                        {this.props.recipeAction === "edit" && (
                                            <td>
                                                <TiDeleteOutline onClick={() => { if (window.confirm(language[55])) this.deleteIngredient(index) }} className="float-right linkNoDecoration deletePen" />
                                            </td>
                                        )}
                                    </tr>
                                </tbody>
                            )
                        })}
                    </Table>
                </CardBody>
            </Card>
        )
    }
}
const mapStateToProps = state => ({
    language: state.main.language,
    recipeAction: state.main.recipeAction,
    editRecipe: state.main.editRecipe,
    nrOfIngredients: state.main.nrOfIngredients,
});

export default connect(mapStateToProps)(RecipeTable);
