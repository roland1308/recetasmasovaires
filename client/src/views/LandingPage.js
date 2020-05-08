import React, { Component } from 'react'
import { connect } from 'react-redux'

import changeLanguage from '../components/changeLanguage';
import { setLanguage, logUser, setRecipes } from '../store/actions/mainActions'

import { Input } from 'reactstrap';

const axios = require("axios");

class LandingPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            welcomeText: [
                ["Hello!",
                    "What's your name?",
                    "Password?",
                    "Log In",
                    "Sign In",
                    "Choose your language:"],
                ["Ciao!",
                    "Come ti chiami?",
                    "Password?",
                    "Entra",
                    "Registrati",
                    "Scegli la lingua:"],
                ["¡Hola!",
                    "¿Como te llamas?",
                    "¿Contraseña?",
                    "Accede",
                    "Registrate",
                    "Elige tu idioma:"],
                ["¡Hola!",
                    "¿Com es diu?",
                    "¿Contrasenya?",
                    "Accés",
                    "Registra't",
                    "Tria el teu idioma:"]
            ],
            language: 2,
            name: "",
            setLanguage: ""
        }
    }

    componentDidMount() {
        window.setInterval(() => {
            this.changeText()
        }, 2000); //every 2 seconds
        document.getElementById("name").focus()
    }

    changeText = () => {
        let lang = this.state.language + 1
        if (lang === this.state.welcomeText.length) { lang = 0 }
        this.setState({
            language: lang
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
        if (data.password === "guest") {
            const userGuest = {
                _id: "",
                name: data.name,
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

    setLanguage = (lang) => {
        const payload = changeLanguage(lang)
        this.props.dispatch(setLanguage(payload))
        this.getData(this.props.user.database + "all")
    }

    async getData(database) {
        try {
            const response = await axios.get(database);
            this.props.dispatch(setRecipes(response.data))
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const { welcomeText, language, name, password } = this.state
        return (
            <div className="landingPage">
                <div className="welcomeText">
                    {welcomeText[language][0]}
                </div>
                <Input onChange={this.changeField} type="text" value={name} name="name" id="name" placeholder={welcomeText[language][1]} />
                <Input onChange={this.changeField} type="password" name="password" id="password" placeholder={welcomeText[language][2]} />
                <button onClick={() => this.logIn({ name, password })} className="chunky chunkyGreen chunkyW107">{welcomeText[language][3]}</button>
                <button className="chunky chunkyYellow chunkyW107 float-right">{welcomeText[language][4]}</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.main.user,
})

export default connect(mapStateToProps)(LandingPage)
