import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Badge } from 'reactstrap';
import RecipeTable from '../components/RecipeTable';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { TiDeleteOutline } from 'react-icons/ti';

import { connect } from "react-redux";
import { ingredientAdd, setNrOfIngs, recipeReset, recipePush, recipeDelete } from '../store/actions/mainActions';

const axios = require("axios");

class AddRecipe extends Component {
    constructor(props) {
        super(props)

        this.state = {
            _id: "",
            name: "",
            chef: "",
            type: "",
            ingredient: "",
            qty: "",
            pax: 0,
            preparation: "",
            nrOfPictures: 0,
            picture: "",
            pictures: [],
            removingImg: []
        }
    }

    componentDidMount = () => {
        this.setState({
            type: this.props.language[12],
            chef: this.props.user.name
        })
        let submitTag = document.getElementById("submitForm")
        const { recipeAction, editRecipe } = this.props
        if (recipeAction === "edit") {
            const {
                _id,
                name,
                chef,
                type,
                pax,
                preparation,
                pictures
            } = editRecipe
            this.props.dispatch(setNrOfIngs(editRecipe.editIngredients.length))
            const nrOfPictures = pictures.length
            this.setState({
                _id,
                name,
                chef,
                type,
                pax,
                preparation,
                nrOfPictures,
                pictures
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
                // submitTag.addEventListener("click", () => this.sendData(this.state));
            } else {
                let submitTag = document.getElementById("submitForm")
                submitTag.classList.add("disabled")
                // submitTag.removeEventListener("click", () => this.sendData(this.state));
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
        let { ingredient, qty } = this.state
        this.props.dispatch(ingredientAdd({ ingredient, qty }))
        this.setState({
            ingredient: "",
            qty: ""
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
        const { name, chef, preparation, nrOfPictures } = data
        if (name !== "" &&
            chef !== "" &&
            this.props.nrOfIngredients > 0 &&
            preparation !== "" &&
            nrOfPictures > 0) {
            let recipeComplete = {
                _id: data._id,
                name: data.name,
                chef: data.chef,
                type: data.type,
                ingredients: this.props.editRecipe.editIngredients,
                pax: data.pax,
                preparation: data.preparation,
                pictures: data.pictures,
                removingImg: data.removingImg
            }
            let submitTag = document.getElementById("submitForm")
            submitTag.classList.add("disabled")
            let URL = ""
            if (this.props.recipeAction === "add") {
                URL = this.props.user.database + "add";
            } else {
                URL = this.props.user.database + "update"
                this.props.dispatch(recipeDelete(recipeComplete._id))
            }
            try {
                let response = await axios.post(URL, recipeComplete)
                if (this.props.recipeAction === "add") {
                    recipeComplete._id = response.data._id
                }
            } catch (error) {
                console.log(error.message);
            }
            this.props.dispatch(recipePush(recipeComplete))
            this.props.dispatch(recipeReset())
            this.props.history.push("/");
        }
    };

    cancelInput = () => {
        this.props.dispatch(recipeReset())
        this.props.history.push("/");
    }

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
        let { name, type, pax, ingredient, qty, preparation, nrOfPictures, picture, pictures } = this.state
        const { nrOfIngredients, editRecipe, language } = this.props
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
            < div >
                <Form className="container">
                    <FormGroup className="underline">
                        <Label for="name">{language[7]}</Label>
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="name"
                            id="name"
                            placeholder={language[8]}
                            value={name} />
                    </FormGroup>
                    {/* <FormGroup className="underline">
                        <Label for="chef">{language[9]}</Label>
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="chef"
                            id="chef"
                            placeholder={language[10]}
                            value={chef} />
                    </FormGroup> */}
                    <FormGroup className="underline">
                        <Label for="type">{language[11]}</Label>
                        <Input onChange={this.changeField} type="select" name="type" id="type" value={type}>
                            <option>{language[12]}</option>
                            <option>{language[13]}</option>
                            <option>{language[14]}</option>
                            <option>{language[15]}</option>
                            <option>{language[16]}</option>
                            <option>{language[17]}</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="pax">{language[18]}</Label>
                        <Input
                            onChange={this.changeField}
                            type="number"
                            name="pax"
                            id="pax"
                            placeholder={language[19]}
                            value={pax > 0 ? pax : undefined} />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="ingredient">{language[20]}</Label>
                        {nrOfIngredients > 0 && <><RecipeTable ingredients={editRecipe.editIngredients} /><br></br></>}
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="ingredient"
                            id="ingredient"
                            placeholder={language[21] + (nrOfIngredients + 1)}
                            value={ingredient} />
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="qty"
                            id="qty"
                            placeholder={language[22]}
                            value={qty}
                        />
                        <Button
                            color="primary"
                            onClick={this.addIngredient}
                            disabled={ingredient === "" || qty === "" ?
                                true : false
                            }>
                            {language[23]}
                            <Badge color="info" pill>+</Badge>
                        </Button>
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="preparation">{language[24]}</Label>
                        <br></br>
                        <ReactQuill
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            onChange={this.changePreparation}
                            name="preparation"
                            id="preparation"
                            placeholder={language[25]}
                            value={preparation}
                        />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="picture">{language[26]}</Label>
                        <div className="row">
                            {nrOfPictures > 0 &&
                                pictures.map((picture, index) => {
                                    return (
                                        <div className="col-sm-3" key={index}>
                                            {this.props.recipeAction !== "add" &&
                                                <TiDeleteOutline onClick={() => { if (window.confirm(language[28])) this.deleteImage(index) }} className="deleteSvg float-right" style={{ transform: "translate(-5px, 30px)" }} />
                                            }
                                            <img className="pictureSmall" src={picture.src} alt={index} />
                                        </div>
                                    )
                                })}
                        </div>
                        <Input onChange={this.changeField} type="file" name="picture" id="picture" />
                        <Button color="primary" onClick={this.addPhoto} disabled={picture === "" ? true : false}>{language[27]}<Badge color="info" pill>+</Badge></Button>
                    </FormGroup>
                </Form>
                <nav className="navbar fixed-bottom navbar-light bg-light">
                    <Button className="navbar-brand recipeButton" onClick={() => this.sendData(this.state)} color="success" id="submitForm">
                        {this.props.recipeAction === "add" ? language[29] : language[30]}
                    </Button>
                    <Button className="navbar-brand recipeButton" color="warning" onClick={this.cancelInput} id="submitForm">{language[31]}</Button>
                </nav>
            </div >
        );
    }
}

const mapStateToProps = state => ({
    language: state.main.language,
    user: state.main.user,
    recipeAction: state.main.recipeAction,
    editRecipe: state.main.editRecipe,
    nrOfIngredients: state.main.nrOfIngredients,
});

export default connect(mapStateToProps)(AddRecipe);