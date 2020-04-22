import React from 'react'

export default class RecipeForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
            isFormInvalid: true
        }
    };

    componentDidMount = () => {
        let submitTag = document.getElementById("submitForm")
        submitTag.classList.add("disabled")
        this.setState({
            props
        })
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
                if (event.target.value === "\n") {
                    console.log("ACCAPO")
                }
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
        try {
            await axios.post("recipes/add", data)
        } catch (error) {
            console.log(error.message);
        }
        this.props.history.push("/");
    };

    render() {
        return (
            <div>
                <Form className="container">
                    <FormGroup className="underline">
                        <Label for="name">Nombre receta:</Label>
                        <Input onChange={this.changeField} type="text" name="name" id="name" placeholder="¿Como se llama tu receta?" />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="chef">Tu nombre:</Label>
                        <Input onChange={this.changeField} type="text" name="chef" id="chef" placeholder="¿Quien és el chef?" />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="type">¿Que plato és?</Label>
                        <Input onChange={this.changeField} type="select" name="type" id="type">
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
                            placeholder="¿Como se hace?" />
                    </FormGroup>
                    <FormGroup className="underline">
                        <Label for="picture">Foto(s):</Label>
                        <div className="row">
                            {this.state.nrOfPictures > 0 &&
                                this.state.pictures.map((picture, index) => {
                                    return (
                                        <div className="col-sm-3" key={index}>
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
                    <Button className="navbar-brand" color="success" onClick={() => this.sendData(this.state)} id="submitForm">¡Envía!</Button>
                </nav>
            </div>
        )
    }
}