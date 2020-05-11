import React, { Component } from 'react'
import { connect } from 'react-redux'

import { logUser } from '../store/actions/mainActions'

import { Input } from 'reactstrap';


const axios = require("axios");

class LogIn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            welcomeText: [
                ["Hello!",
                    "What's your name?",
                    "Password?",
                    "Log In",
                    "Sign In",
                    "Choose your language:",
                    "Sign!",
                    "Cancel!",
                    "Repeat password",
                    "Book code?"],
                ["Ciao!",
                    "Come ti chiami?",
                    "Password?",
                    "Entra",
                    "Registrati",
                    "Scegli la lingua:",
                    "Registra!",
                    "Annulla!",
                    "Ripeti la password!",
                    "Codice del libro?"],
                ["¡Hola!",
                    "¿Como te llamas?",
                    "¿Contraseña?",
                    "Accede",
                    "Registrate",
                    "Elige tu idioma:",
                    "¡Registra!",
                    "¡Anula!",
                    "¡Repite la contraseña!",
                    "¿Código de libro?"],
                ["¡Hola!",
                    "¿Com es diu?",
                    "¿Contrasenya?",
                    "Accés",
                    "Registra't",
                    "Tria el teu idioma:",
                    "¡Registra!",
                    "¡Anul·la!",
                    "¡Repeteix la ¿Contrasenya!",
                    "¿Codi de llibre?",
                ]
            ],
            languagePos: 2,
            name: "",
            password: "",
            passwordCheck: "",
            book: "",
            bookCode: "",
            database: "",
            language: "",
            setLanguage: "",
            isRegister: false
        }
    }

    componentDidMount() {
        window.setInterval(() => {
            this.changeText()
        }, 2000); //every 2 seconds
        document.getElementById("name").focus()
    }

    changeText = () => {
        let lang = this.state.languagePos + 1
        if (lang === this.state.welcomeText.length) { lang = 0 }
        this.setState({
            languagePos: lang
        })
    }

    changeField = event => {
        event.preventDefault()
        switch (event.target.name) {
            case "name":
                const capitalize = event.target.value.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
                this.setState({ name: capitalize });
                break;
            default:
                this.setState({ [event.target.name]: event.target.value })
                break;
        }
    }

    async logIn(data) {
        const { name, password } = data
        if (!name || !password) {
            alert("Please fill all fields")
            return
        }
        if (password === "guest") {
            const userGuest = {
                _id: "",
                name: name,
                database: "/recipeengs/",
                language: "English",
                book: "Recipes Book",
                password: "guest"
            }
            this.props.dispatch(logUser(userGuest))
        } else {
            try {
                const response = await axios.post("/users/login", data);
                if (response.data === "error") {
                    alert("Log In Error!")
                } else {
                    this.props.dispatch(logUser(response.data))
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    toggleIsRegister = () => {
        this.setState({
            isRegister: !this.state.isRegister
        })
        document.getElementById("name").focus()
    }

    async registerUser(data) {
        const { name, password, passwordCheck, bookCode } = data
        if (!name || !password || !passwordCheck || !bookCode) {
            alert("Please fill all fields")
            return
        }
        if (password !== passwordCheck) {
            alert("Both password must be the same")
            return
        }
        const response = await axios.get("/users/book/" + bookCode)
        const { status, book, database, language } = response.data
        if (status) {
            const payload = { name, password, database, language, book }
            try {
                const responseAdd = await axios.post("/users/add", payload)
                const errorAdd = responseAdd.data.errmsg
                if (errorAdd) {
                    if (errorAdd.includes("E11000 duplicate key error collection")) {
                        alert("Name already present!")
                        return
                    }
                }
                this.props.dispatch(logUser(responseAdd.data))
            } catch (error) {
                alert(error)
            }
        } else {
            alert("Wrong Code")
        }
    }

    render() {
        const { welcomeText, languagePos, name, password, passwordCheck, isRegister, bookCode } = this.state
        return (
            <div className="logIn">
                <div className="welcomeText">
                    {welcomeText[languagePos][0]}
                </div>
                <Input onChange={this.changeField} type="text" value={name} name="name" id="name" placeholder={welcomeText[languagePos][1]} />
                <Input onChange={this.changeField} type="password" name="password" id="password" placeholder={welcomeText[languagePos][2]} />
                {isRegister ? (
                    <div>
                        <Input onChange={this.changeField} type="password" name="passwordCheck" id="passwordCheck" placeholder={welcomeText[languagePos][8]} />
                        <Input onChange={this.changeField} type="text" value={bookCode} name="bookCode" id="bookCode" placeholder={welcomeText[languagePos][9]} />
                        <button onClick={() => this.registerUser({ name, password, passwordCheck, bookCode })} className="chunky chunkyGreen chunkyW107">{welcomeText[languagePos][6]}</button>
                        <button onClick={this.toggleIsRegister} className="chunky chunkyYellow chunkyW107 float-right">{welcomeText[languagePos][7]}</button>
                    </div>
                ) : (
                        <div>
                            <button onClick={() => this.logIn({ name, password })} className="chunky chunkyGreen chunkyW107">{welcomeText[languagePos][3]}</button>
                            <button onClick={this.toggleIsRegister} className="chunky chunkyYellow chunkyW107 float-right">{welcomeText[languagePos][4]}</button>
                        </div>
                    )}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.main.user,
})

export default connect(mapStateToProps)(LogIn)
