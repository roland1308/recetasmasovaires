import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Badge } from 'reactstrap';
import RecipeTable from '../components/RecipeTable';
import TextareaAutosize from 'react-textarea-autosize';

import { TiDeleteOutline } from 'react-icons/ti';

import { connect } from "react-redux";

const axios = require("axios");

class AddRecipe extends Component {
    constructor(props) {
        super(props)

        this.state = {
            _id: "",
            name: "",
            chef: "",
            type: "entrante",
            nrOfIngredients: 0,
            ingredient: "",
            ingQty: "",
            ingredients: [],
            pax: undefined,
            preparation: "",
            nrOfPictures: 0,
            picture: "",
            pictures: [],
            isFormInvalid: true,
            removingImg: []
        }
    };

    componentDidMount = () => {
        let submitTag = document.getElementById("submitForm")
        const { recipeAction, recipe } = this.props
        if (recipeAction !== "edit") { submitTag.classList.add("disabled") }
        if (recipeAction === "edit") {
            const {
                _id,
                name,
                chef,
                type,
                ingredients,
                pax,
                preparation,
                pictures
            } = recipe
            const nrOfIngredients = ingredients.length
            const nrOfPictures = pictures.length
            this.setState({
                _id,
                name,
                chef,
                type,
                nrOfIngredients,
                ingredients,
                pax,
                preparation,
                nrOfPictures,
                pictures,
                isFormInvalid: false
            })
        }
    }

    changeField = event => {
        event.preventDefault()
        switch (event.target.name) {
            case "picture":
                let formPicture = new FormData();
                formPicture.append("picture", event.target.files[0]);
                axios.post("/recipes/addphoto", formPicture)
                    .then(
                        (response, error) => {
                            if (!response.data.error) {
                                const croppedImgLink = response.data //.replace("upload", "upload/w_150,h_100,c_fill")
                                this.setState({
                                    picture: croppedImgLink
                                });
                            } else {
                                alert(response.data.error)
                                this.setState({
                                    picture: ""
                                });
                                document.getElementById('picture').value = ''
                            }
                        }
                    );
                break;
            default:
                this.setState({
                    [event.target.name]: event.target.value,
                })
        }
    }

    addIngredient = (e) => {
        e.preventDefault()
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

    addPhoto = (e) => {
        e.preventDefault()
        let pics = this.state.pictures
        pics.push({
            src: this.state.picture
        })
        this.setState({
            pictures: pics,
            nrOfPictures: this.state.nrOfPictures + 1,
            picture: ""
        })
        document.getElementById('picture').value = ''
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState !== this.state) {
            const { name, chef, nrOfIngredients, preparation, nrOfPictures } = this.state
            if (name !== "" &&
                chef !== "" &&
                nrOfIngredients > 0 &&
                preparation !== "" &&
                nrOfPictures > 0) {
                let submitTag = document.getElementById("submitForm")
                submitTag.classList.remove("disabled")
            } else {
                let submitTag = document.getElementById("submitForm")
                submitTag.classList.add("disabled")
            }
        }
    }

    async sendData(data) {
        let submitTag = document.getElementById("submitForm")
        submitTag.classList.add("disabled")
        if (this.props.recipeAction === "add") {
            try {
                await axios.post("recipes/add", data)
            } catch (error) {
                console.log(error.message);
            }
        } else {
            try {
                await axios.post("recipes/update", data)
            } catch (error) {
                console.log(error.message)
            }
        }
        this.props.history.push("/");
    };

    deleteImage = (index) => {
        let imgArray = this.state.pictures
        let imgRemoveList = this.state.removingImg
        imgRemoveList.push(imgArray[index].src)
        imgArray.splice(index, 1)
        this.setState({
            pictures: imgArray,
            nrOfPictures: this.state.nrOfPictures - 1,
            removingImg: imgRemoveList
        })
    }

    render() {
        return (
            < div >
                <Form className="container">
                    <FormGroup className="underline">
                        <Label for="name">Nombre receta:</Label>
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="¿Como se llama tu receta?"
                            value={this.state.name} />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="chef">Tu nombre:</Label>
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="chef"
                            id="chef"
                            placeholder="¿Quien és el chef?"
                            value={this.state.chef} />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="type">¿Que plato és?</Label>
                        <Input onChange={this.changeField} type="select" name="type" id="type" value={this.state.type}>
                            <option>entrante</option>
                            <option>primero</option>
                            <option>segundo</option>
                            <option>acompañamiento</option>
                            <option>postre</option>
                            <option>plato único</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="pax">Personas: (0 = sin especificar)</Label>
                        <Input
                            onChange={this.changeField}
                            type="number"
                            name="pax"
                            id="pax"
                            placeholder={"¿Para cuantas personas?"}
                            value={this.state.pax}
                        />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="ingredient">Ingredientes:</Label>
                        {this.state.nrOfIngredients > 0 && <><RecipeTable ingredients={this.state.ingredients} /><br></br></>}
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
                        <Button color="primary" onClick={this.addIngredient} disabled={this.state.ingredient === "" || this.state.ingQty === "" ? true : false}>¡Añade ingrediente! <Badge color="info" pill>+</Badge></Button>
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="preparation">Preparación:</Label>
                        <br></br>
                        <TextareaAutosize
                            style={{ width: "100%" }}
                            useCacheForDOMMeasurements
                            minRows={3}
                            onChange={this.changeField}
                            name="preparation"
                            id="preparation"
                            value={this.state.preparation}
                            placeholder="¿Como se hace?" />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="picture">Foto(s):</Label>
                        <div className="row">
                            {this.state.nrOfPictures > 0 &&
                                this.state.pictures.map((picture, index) => {
                                    return (
                                        <div className="col-sm-3" key={index}>
                                            {this.props.recipeAction !== "add" &&
                                                <TiDeleteOutline onClick={() => this.deleteImage(index)} className="deleteSvg float-right" />
                                            }
                                            <img className="pictureSmall" src={picture.src} alt={index} />
                                        </div>
                                    )
                                })}
                        </div>
                        <Input onChange={this.changeField} type="file" name="picture" id="picture" />
                        <Button color="primary" onClick={this.addPhoto} disabled={this.state.picture === "" ? true : false}>¡Añade foto(s)! <Badge color="info" pill>+</Badge></Button>
                    </FormGroup>
                </Form>
                <nav className="navbar fixed-bottom navbar-light bg-light">
                    <Button className="navbar-brand recipeButton" color="success" onClick={() => this.sendData(this.state)} id="submitForm">
                        {this.props.recipeAction === "add" ? "¡Añade!" : "¡Cambia!"}
                    </Button>
                    <Button className="navbar-brand recipeButton" color="warning" onClick={() => this.props.history.push("/")} id="submitForm">¡Anula!</Button>
                </nav>
            </div >
        );
    }
}

const mapStateToProps = state => ({
    recipeAction: state.main.recipeAction,
    recipe: state.main.recipe
});

export default connect(mapStateToProps)(AddRecipe);