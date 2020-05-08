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
                                <th>{language[0]}</th>
                                <th>{language[1]}</th>
                                {this.props.recipeAction !== "list" &&
                                    <th style={{ width: "25px" }}></th>
                                }
                            </tr>
                        </thead>
                        {this.state.editedIngredients.length > 0 && this.state.editedIngredients.map((ingredient, index) => {
                            return (
                                <tbody key={index}>
                                    <tr>
                                        <td>{ingredient.ingredient}</td>
                                        <td>{ingredient.qty}</td>
                                        {this.props.recipeAction !== "list" && (
                                            <td id="red" className="button red text-blanco text-shadow-negra ingredientDel" onClick={() => { if (window.confirm(language[2])) this.deleteIngredient(index) }}>
                                                <TiDeleteOutline className="deleteSvg" style={{ fontSize: "1rem", margin: "-5px" }} />
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
    language: state.main.language.recipetable,
    recipeAction: state.main.recipeAction,
    editRecipe: state.main.editRecipe,
    nrOfIngredients: state.main.nrOfIngredients,
});

export default connect(mapStateToProps)(RecipeTable);
