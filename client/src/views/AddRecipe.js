import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Badge } from 'reactstrap';
import RecipeTable from '../components/RecipeTable';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { TiDeleteOutline } from 'react-icons/ti';

import { connect } from "react-redux";
import { ingredientAdd, setNrOfIngs, recipeReset } from '../store/actions/mainActions';

const axios = require("axios");

class AddRecipe extends Component {
    constructor(props) {
        super(props)

        this.state = {
            _id: "",
            name: "",
            chef: "",
            type: "entrante",
            ingredient: "",
            ingQty: "",
            pax: 0,
            preparation: "",
            nrOfPictures: 0,
            picture: "",
            pictures: [],
            isFormInvalid: true,
            removingImg: []
        }
    }

    componentDidMount = () => {
        let submitTag = document.getElementById("submitForm")
        const { recipeAction, recipe } = this.props
        if (recipeAction === "edit") {
            const {
                _id,
                name,
                chef,
                type,
                pax,
                preparation,
                pictures
            } = recipe
            this.props.dispatch(setNrOfIngs(recipe.ingredients.length))
            const nrOfPictures = pictures.length
            this.setState({
                _id,
                name,
                chef,
                type,
                pax,
                preparation,
                nrOfPictures,
                pictures,
                isFormInvalid: false
            })
        } else {
            this.props.dispatch(recipeReset())
            submitTag.classList.add("disabled")
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState !== this.state) {
            const { name, chef, preparation, nrOfPictures } = this.state
            if (name !== "" &&
                chef !== "" &&
                this.props.nrOfIngredients > 0 &&
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

    changePreparation = (value) => {
        this.setState({
            preparation: value
        })
    }

    addIngredient = (e) => {
        e.preventDefault()
        let { ingredient, ingQty } = this.state
        this.props.dispatch(ingredientAdd({ ingredient, ingQty }))
        this.setState({
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

    async sendData(data) {
        const recipeComplete = {
            _id: data._id,
            name: data.name,
            chef: data.chef,
            type: data.type,
            ingredients: this.props.recipe.ingredients,
            pax: data.pax,
            preparation: data.preparation,
            pictures: data.pictures,
            removingImg: data.removingImg
        }
        let submitTag = document.getElementById("submitForm")
        submitTag.classList.add("disabled")
        let URL = "recipes/update"
        if (this.props.recipeAction === "add") {
            URL = "recipes/add"
        }
        try {
            await axios.post(URL, recipeComplete)
        } catch (error) {
            console.log(error.message);
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
        let { name, chef, type, pax, ingredient, ingQty, preparation, nrOfPictures, picture, pictures } = this.state
        const { nrOfIngredients, recipe } = this.props
        const modules = {
            toolbar: [
                ['bold', 'italic'],
                [{ 'list': 'bullet' }],
                ['clean']
            ],
        }
        const formats = [
            'bold', 'italic',
            'list', 'bullet'
        ]
        return (
            <div>
                <Form className="container">
                    <FormGroup className="underline">
                        <Label for="name">Nombre receta:</Label>
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="¿Como se llama tu receta?"
                            value={name} />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="chef">Tu nombre:</Label>
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="chef"
                            id="chef"
                            placeholder="¿Quien és el chef?"
                            value={chef} />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="type">¿Que plato és?</Label>
                        <Input onChange={this.changeField} type="select" name="type" id="type" value={type}>
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
                            placeholder="¿Para cuantas personas?"
                            value={pax > 0 ? pax : undefined} />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="ingredient">Ingredientes:</Label>
                        {nrOfIngredients > 0 && <><RecipeTable ingredients={recipe.ingredients} /><br></br></>}
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="ingredient"
                            id="ingredient"
                            placeholder={"Ingrediente nr. " + (nrOfIngredients + 1)}
                            value={ingredient} />
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="ingQty"
                            id="ingQty"
                            placeholder={"Cantitad"}
                            value={ingQty}
                        />
                        <Button color="primary" onClick={this.addIngredient} disabled={ingredient === "" || ingQty === "" ? true : false}>¡Añade ingrediente! <Badge color="info" pill>+</Badge></Button>
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="preparation">Preparación:</Label>
                        <br></br>
                        <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            onChange={this.changePreparation}
                            name="preparation"
                            id="preparation"
                            placeholder={"¿Como se hace?"}
                            value={preparation}
                        />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="picture">Foto(s):</Label>
                        <div className="row">
                            {nrOfPictures > 0 &&
                                pictures.map((picture, index) => {
                                    return (
                                        <div className="col-sm-3" key={index}>
                                            {this.props.recipeAction !== "add" &&
                                                <TiDeleteOutline onClick={() => { if (window.confirm(`¿Estás seguro que quieres eliminar esta foto?`)) this.deleteImage(index) }} className="deleteSvg float-right" style={{ transform: "translate(-5px, 30px)" }} />
                                            }
                                            <img className="pictureSmall" src={picture.src} alt={index} />
                                        </div>
                                    )
                                })}
                        </div>
                        <Input onChange={this.changeField} type="file" name="picture" id="picture" />
                        <Button color="primary" onClick={this.addPhoto} disabled={picture === "" ? true : false}>¡Añade foto(s)! <Badge color="info" pill>+</Badge></Button>
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
    recipe: state.main.recipe,
    nrOfIngredients: state.main.nrOfIngredients,
});

export default connect(mapStateToProps)(AddRecipe);