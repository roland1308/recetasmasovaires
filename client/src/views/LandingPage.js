import React, { Component } from 'react'
import { connect } from 'react-redux'

import { languages } from '../components/languages'
import { setLanguage } from '../store/actions/mainActions'

import { Input, Button } from 'reactstrap';

import { setRecipes, setUser } from '../store/actions/mainActions';

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
        try {
            const response = await axios.post("/users/login", data);
            if (response.data === "error") {
                alert("Log In Error!")
                console.log(response.data)
            } else {
                this.props.dispatch(setUser(response.data))
                this.setLanguage(response.data.language)
            }
        } catch (error) {
            console.log(error);
        }
    }

    setLanguage = (language) => {
        let payload = ""
        switch (language) {
            case "English":
                payload = {
                    lang: languages().eng,
                    url: "/recipeseng/"
                }
                break;
            case "Italiano":
                payload = {
                    lang: languages().ita,
                    url: "/recipesita/"
                }
                break;
            case "Español":
                payload = {
                    lang: languages().esp,
                    url: "/recipes/"
                }
                break;
            case "Català":
                payload = {
                    lang: languages().cat,
                    url: "/recipescat/"
                }
                break;
            default:
                break;
        }
        this.props.dispatch(setLanguage(payload))
        this.getData(payload.url + "all")
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
                {/* {welcomeText[language][1]} */}
                {/* <Label for="name">{welcomeText[language][1]}</Label> */}
                <Input onChange={this.changeField} type="text" value={name} name="name" id="name" placeholder={welcomeText[language][1]} />
                <Input onChange={this.changeField} type="password" name="password" id="password" placeholder={welcomeText[language][2]} />
                <Button onClick={() => this.logIn({ name, password })} className="landButton" color="success">{welcomeText[language][3]}</Button>
                <Button className="landButton float-right" color="warning">{welcomeText[language][4]}</Button>
                {/* <Input onChange={this.setLanguage} type="select" name="setLanguage" id="setLanguage" value="----">
                    <option disabled hidden>----</option>
                    <option>English</option>
                    <option>Italiano</option>
                    <option>Español</option>
                    <option>Català</option>
                </Input> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(LandingPage)
