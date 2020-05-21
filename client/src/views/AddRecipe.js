import React, { Component } from 'react'
import { Form, FormGroup, Label, Input, Badge } from 'reactstrap';
import RecipeTable from '../components/RecipeTable';

import 'react-quill/dist/quill.snow.css';

import { TiDeleteOutline } from 'react-icons/ti';
// import { GrRotateRight } from 'react-icons/gr';

import { connect } from "react-redux";
import { ingredientAdd, setNrOfIngs, recipeReset, recipePush, recipeDelete, setLoading, setPage } from '../store/actions/mainActions';
import QuillText from '../components/QuillText';

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
        this.props.dispatch(setPage("basic"))
        this.setState({
            type: this.props.language[5],
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
            submitTag.classList.add("chunkyGreen")
        }
        document.getElementById("name").focus()
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState !== this.state) {
            const { name, preparation, nrOfPictures } = this.state
            let preparationDiv = preparation
            const quillDiv = document.getElementById("quillDiv").firstElementChild
            if (quillDiv) { preparationDiv = quillDiv.innerHTML };

            if (name !== "" &&
                this.props.nrOfIngredients > 0 &&
                preparationDiv !== "" &&
                nrOfPictures > 0) {
                let submitTag = document.getElementById("submitForm")
                submitTag.classList.remove("chunkyGrey")
                submitTag.classList.add("chunkyGreen")
                // submitTag.addEventListener("click", () => this.sendData(this.state));
            } else {
                let submitTag = document.getElementById("submitForm")
                submitTag.classList.add("chunkyGrey")
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
                        })
                    .catch(error => {
                        console.log(error)
                    });
                break;
            default:
                this.setState({
                    [event.target.name]: event.target.value,
                })
        }
    }

    addIngredient = (e) => {
        e.preventDefault()
        let { ingredient, qty } = this.state
        this.props.dispatch(ingredientAdd({ ingredient, qty }))
        this.setState({
            ingredient: "",
            qty: ""
        })
        document.getElementById("ingredient").focus()
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
        const token = window.localStorage.token;
        const { name, nrOfPictures } = data
        const preparation = document.getElementById("quillDiv").firstElementChild.innerHTML;
        if (name !== "" &&
            this.props.nrOfIngredients > 0 &&
            preparation !== "" &&
            nrOfPictures > 0) {
            this.props.dispatch(setLoading(true))
            let recipeComplete = {
                _id: data._id,
                name: data.name,
                chef: data.chef,
                type: data.type,
                ingredients: this.props.editRecipe.editIngredients,
                pax: data.pax,
                preparation,
                pictures: data.pictures,
                removingImg: data.removingImg,
                likes: []
            }
            let submitTag = document.getElementById("submitForm")
            submitTag.classList.add("chunkyGrey")
            let URL = ""
            if (this.props.recipeAction === "add") {
                URL = this.props.user.database + "add";
            } else {
                URL = this.props.user.database + "update"
                this.props.dispatch(recipeDelete(recipeComplete._id))
            }
            try {
                const response = await axios.post(URL,
                    recipeComplete,
                    {
                        headers: {
                            authorization: `bearer ${token}`
                        }
                    });
                if (this.props.recipeAction === "add") {
                    recipeComplete._id = response.data._id
                }
            } catch (error) {
                console.log(error.message);
            }
            this.props.dispatch(recipePush(recipeComplete))
            this.props.dispatch(recipeReset())
            this.props.history.push("/listall")
            this.props.dispatch(setLoading(false))
        }
    };

    cancelInput = () => {
        this.props.dispatch(recipeReset())
        if (this.props.recipeAction === "add") {
            this.props.history.push("/")
        } else {
            this.props.history.push("/listall")
        };
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

    rotateImage = (index) => {
        let imgArray = this.state.pictures
        // let rotation = 0
        imgArray[index].src = imgArray[index].src.replace("/upload/", `/upload/w_300,h_200,c_fit/`)
        // let position = imgArray[index].src.indexOf("/a_")
        // console.log(position);
        // if (position !== -1) {
        //     rotation = parseInt(imgArray[index].src.substr(position + 3, 3))
        //     console.log(rotation);
        // }
        // rotation = rotation + 90
        imgArray[index].src = imgArray[index].src.replace("/upload/", `/upload/a_90/`)
        this.setState({
            pictures: imgArray
        })
        console.log(this.state.pictures[index].src);

    }

    render() {
        const { name, type, pax, ingredient, qty, preparation, nrOfPictures, picture, pictures } = this.state
        const { nrOfIngredients, editRecipe, language, recipeAction } = this.props
        let ingredientClass = "chunky chunkyViolet"
        let pictureClass = "chunky chunkyViolet"
        if (ingredient === "" || qty === "") {
            ingredientClass = "chunky chunkyGrey"
        }
        if (picture === "") {
            pictureClass = "chunky chunkyGrey"
        } return (
            <div className="jumboBottom">
                <Form className="container">
                    <FormGroup className="underline">
                        <Label for="name">{language[0]}</Label>
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="name"
                            id="name"
                            placeholder={language[1]}
                            value={name} />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="type">{language[4]}</Label>
                        <Input onChange={this.changeField} type="select" name="type" id="type" value={type}>
                            <option>{language[5]}</option>
                            <option>{language[6]}</option>
                            <option>{language[7]}</option>
                            <option>{language[8]}</option>
                            <option>{language[9]}</option>
                            <option>{language[10]}</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="pax">{language[11]}</Label>
                        <Input
                            onChange={this.changeField}
                            type="number"
                            name="pax"
                            id="pax"
                            placeholder={language[12]}
                            value={pax > 0 ? pax : undefined} />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="ingredient">{language[13]}</Label>
                        {nrOfIngredients > 0 && <><RecipeTable ingredients={editRecipe.editIngredients} /><br></br></>}
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="ingredient"
                            id="ingredient"
                            placeholder={language[14] + (nrOfIngredients + 1)}
                            value={ingredient} />
                        <Input
                            onChange={this.changeField}
                            type="text"
                            name="qty"
                            id="qty"
                            placeholder={language[15]}
                            value={qty}
                        />
                        <button
                            className={ingredientClass}
                            onClick={this.addIngredient}
                            disabled={ingredient === "" || qty === "" ?
                                true : false
                            }>
                            {language[16]}
                            <Badge color="info" pill>+</Badge>
                        </button>
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="preparation">{language[17]}</Label>
                        <br></br>
                        <QuillText placeholder={language[18]} value={preparation} />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="picture">{language[20]}</Label>
                        <div className="row">
                            {nrOfPictures > 0 &&
                                pictures.map((picture, index) => {
                                    return (
                                        <div className="col-sm-3" key={index}>
                                            <div id="red" className="button red text-blanco text-shadow-negra float-right" style={{ transform: "translate(-5px, 32px)" }} onClick={() => { if (window.confirm(language[21])) this.deleteImage(index) }}>
                                                <TiDeleteOutline className="deleteSvg" />
                                            </div>
                                            {/* <div id="blue" className="button blue text-blanco text-shadow-negra float-right" style={{ transform: "translate(-5px, 32px)" }} onClick={() => this.rotateImage(index)}>
                                                <GrRotateRight className="deleteSvg" />
                                            </div> */}
                                            <img className="pictureSmall" src={picture.src} alt={index} />
                                        </div>
                                    )
                                })}
                        </div>
                        <Input onChange={this.changeField} type="file" name="picture" id="picture" />
                        <button className={pictureClass} onClick={this.addPhoto} disabled={picture === "" ? true : false}>{language[20]}<Badge color="info" pill>+</Badge></button>
                    </FormGroup>
                </Form>
                <nav className="footbar">
                    <button className="chunky chunkyW101 chunkyM25" onClick={() => this.sendData(this.state)} id="submitForm">
                        {recipeAction === "add" ? language[22] : language[23]}
                    </button>
                    <button className="chunky chunkyYellow chunkyW101 chunkyM25" onClick={this.cancelInput} id="submitForm">{language[24]}</button>
                </nav>
            </div >
        );
    }
}

const mapStateToProps = state => ({
    language: state.main.language.addrecipe,
    user: state.main.user,
    recipeAction: state.main.recipeAction,
    editRecipe: state.main.editRecipe,
    nrOfIngredients: state.main.nrOfIngredients,
});

export default connect(mapStateToProps)(AddRecipe);