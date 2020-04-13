import React from 'react'
import { Table, Card, CardBody, } from 'reactstrap';

export default function RecipeTable(props) {
    return (
        <Card>
            <CardBody>
                <Table hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ingrediente</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    {props.ingredients.length && props.ingredients.map((ingredient, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td>{ingredient.ingredient}</td>
                                    <td>{ingredient.qty}</td>
                                </tr>
                            </tbody>
                        )
                    })}
                </Table>
            </CardBody>
        </Card>
    )
}
