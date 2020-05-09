import React, { Component } from 'react';
import { connect } from "react-redux";

import { Table, Card, CardBody, } from 'reactstrap';

import { ingredientRemove, ingredientsEditList } from '../store/actions/mainActions';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { TiDeleteOutline } from 'react-icons/ti'
import { GrDrag } from 'react-icons/gr'

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

    onDragEnd = result => {
        const { destination, source } = result
        const { editIngredients } = this.props.editRecipe
        if (!destination || (destination.index === source.index)) {
            return
        }
        const draggingIngredient = editIngredients[source.index]
        const newIngredientList = editIngredients
        newIngredientList.splice(source.index, 1)
        newIngredientList.splice(destination.index, 0, draggingIngredient)
        this.props.dispatch(ingredientsEditList(newIngredientList))
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
                        {this.props.recipeAction === "list" ? (
                            <tbody>
                                {this.state.editedIngredients.length > 0 && this.state.editedIngredients.map((ingredient, index) => {
                                    return (
                                        <tr>
                                            <td>{ingredient.ingredient}</td>
                                            <td>{ingredient.qty}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        ) : (
                                <DragDropContext
                                    // onDragStart
                                    // onDragUpdate
                                    onDragEnd={this.onDragEnd}
                                >
                                    <Droppable droppableId="ingredientList">
                                        {(providedDrop) => (
                                            <tbody
                                                ref={providedDrop.innerRef}
                                                {...providedDrop.droppableProps}
                                            >
                                                {this.state.editedIngredients.length > 0 && this.state.editedIngredients.map((ingredient, index) => {
                                                    return (
                                                        <Draggable draggableId={index.toString()} index={index}>
                                                            {(providedDrag, snapshot) => (
                                                                <tr key={index}
                                                                    className={snapshot.isDragging && "tdBackground " + snapshot.isDragging && "tdBackgroundDragging"}
                                                                    {...providedDrag.draggableProps}
                                                                    ref={providedDrag.innerRef}
                                                                >
                                                                    <td
                                                                        {...providedDrag.dragHandleProps}
                                                                    ><GrDrag />{" "}{ingredient.ingredient}</td>
                                                                    <td>{ingredient.qty}</td>
                                                                    <td onClick={() => { if (window.confirm(language[2])) this.deleteIngredient(index) }}>
                                                                        <TiDeleteOutline className="deleteSvgBack" style={{ fontSize: "1rem", margin: "-5px" }} />
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </Draggable>
                                                    )
                                                })}
                                                {providedDrop.placeholder}
                                            </tbody>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            )}
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
