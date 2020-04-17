import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Jumbotron, Badge } from 'reactstrap';
import RecipeTable from '../components/RecipeTable';

const axios = require("axios");

export default class AddRecipe extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: "",
            chef: "",
            type: "Entrante",
            nrOfIngredients: 0,
            ingredient: "",
            ingQty: "",
            ingredients: [],
            preparation: "",
            nrOfPictures: 0,
            picture: "",
            pictures: [],
        }
    };

    changeField = event => {
        switch (event.target.name) {
            case "picture":
                let formPicture = new FormData();
                formPicture.append("picture", event.target.files[0]);
                axios.post("/recipes/addphoto", formPicture)
                    .then(response => {
                        this.setState({
                            picture: response.data
                        });
                    });
                break;
            default:
                this.setState({ [event.target.name]: event.target.value });
        }
    }

    addIngredient = () => {
        if (this.state.ingredient) {
            let ings = this.state.ingredients
            ings.push({
                ingredient: this.state.ingredient,
                qty: this.state.ingQty
            })
            this.setState({
                ingredients: ings,
                nrOfIngredients: this.state.nrOfIngredients + 1,
                ingredient: "",
                ingQty: ""
            })
        }
    }

    addPhoto = () => {
        if (this.state.picture) {
            let pics = this.state.pictures
            pics.push({
                src: this.state.picture
            })
            this.setState({
                pictures: pics,
                nrOfPictures: this.state.nrOfPictures + 1,
                picture: ""
            })
        }
    }

    async sendData(data) {
        try {
            await axios.post("recipes/add", data)
        } catch (error) {
            console.log(error.message);
        }
        this.props.history.push("/");
    };


    render() {
        return (
            <Jumbotron>
                <Form className="container">
                    <FormGroup>
                        <Label for="name">Nombre Receta:</Label>
                        <Input onChange={this.changeField} type="text" name="name" id="name" placeholder="¿Como se llama tu receta?" required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="chef">Tu nombre:</Label>
                        <Input onChange={this.changeField} type="text" name="chef" id="chef" placeholder="¿Quien és el chef?" required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="type">¿Que plato és?</Label>
                        <Input onChange={this.changeField} type="select" name="type" id="type">
                            <option>Entrante</option>
                            <option>Primero</option>
                            <option>Segundo</option>
                            <option>Acompañamiento</option>
                            <option>Postre</option>
                            <option>Plato único</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="ingredient">Ingredientes:</Label>
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="ingredient"
                            id="ingredient"
                            placeholder={"Ingrediente nr. " + (this.state.nrOfIngredients + 1)}
                            value={this.state.ingredient}
                        />
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="ingQty"
                            id="ingQty"
                            placeholder={"Cantitad"}
                            value={this.state.ingQty}
                        />
                        {this.state.nrOfIngredients > 0 && <RecipeTable ingredients={this.state.ingredients} />}
                        <h6 onClick={this.addIngredient}>¡Añade ingrediente! <Badge color="info" pill>+</Badge></h6>
                    </FormGroup>
                    <FormGroup>
                        <Label for="preparation">Preparación:</Label>
                        <Input onChange={this.changeField} type="textarea" name="preparation" id="preparation" placeholder="¿Como se hace?" required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="picture">Photo:</Label>
                        <Input onChange={this.changeField} type="file" name="picture" id="picture" />
                        <h6 onClick={this.addPhoto}>¡Añade foto(s)! <Badge color="info" pill>+</Badge></h6>
                    </FormGroup>
                    <div className="row">
                        {this.state.nrOfPictures > 0 &&
                            this.state.pictures.map((picture, index) => {
                                return (
                                    <div className="col-sm-2" key={index}>
                                        <img className="pictureSmall" src={picture.src} alt={index} />
                                    </div>
                                )
                            })}
                    </div>
                    <Button onClick={() => this.sendData(this.state)}>¡Envía!</Button>
                </Form>
            </Jumbotron>
        );
    }
}
