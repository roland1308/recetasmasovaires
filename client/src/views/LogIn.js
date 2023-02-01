import React, { Component } from 'react'
import { connect } from 'react-redux'

import { logUser } from '../store/actions/mainActions'

import { Input } from 'reactstrap';
import { Avatar } from '@material-ui/core';
import EmailInsert from '../components/EmailInsert';

import axios from 'axios';

let instance = axios.create()
if(process.env.NODE_ENV === "production")
{
    instance = axios.create({
        baseURL: 'https://recipes-awpm.onrender.com',
                headers: {"Access-Control-Allow-Origin": "https://recipes2-9i2m.onrender.com/"}
        //timeout: 1000,

        //headers: {'X-Custom-Header': 'foobar'}
    });
}

class LogIn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            welcomeText: [
                [
                    "Hello!",
                    "What's your name?",
                    "Password?",
                    "Log In",
                    "Sign In",
                    "Choose your language:",
                    "Sign!",
                    "Cancel!",
                    "Repeat password",
                    "Book code?",
                    "Don't you have an account?",
                    "Do you wanna add a photo to your profile?",
                    "If you want to share recipes, please ..",
                    ".. add your e-mail address",
                    "Send email!",
                    "Insert verification code",
                    "Verify!"
                ],
                [
                    "Ciao!",
                    "Come ti chiami?",
                    "Password?",
                    "Entra",
                    "Registrati",
                    "Scegli la lingua:",
                    "Registra!",
                    "Annulla!",
                    "Ripeti la password!",
                    "Codice del libro?",
                    "Non hai un account?",
                    "Vuoi aggiungere una foto al tuo profilo?",
                    "Se vuoi condividere ricette ..",
                    ".. aggiungi la tua e-mail",
                    "Invia email!",
                    "Inserisci il codice di verifica",
                    "Verifica!"
                ],
                [
                    "¡Hola!",
                    "¿Como te llamas?",
                    "¿Contraseña?",
                    "Accede",
                    "Registrate",
                    "Elige tu idioma:",
                    "¡Registra!",
                    "¡Anula!",
                    "¡Repite la contraseña!",
                    "¿Código de libro?",
                    "¿No tienes una cuenta?",
                    "¿Quieres añadir una foto a tu perfil?",
                    "Si quieres compartir recetas ..",
                    ".. añade tu correo electronico",
                    "¡Envia!",
                    "Código de verificación",
                    "¡Cheque!"
                ],
                [
                    "¡Hola!",
                    "¿Com es diu?",
                    "¿Contrasenya?",
                    "Accés",
                    "Registra't",
                    "Tria el teu idioma:",
                    "¡Registra!",
                    "¡Anul·la!",
                    "¡Repeteix la ¿Contrasenya!",
                    "¿Codi de llibre?",
                    "¿No tens un compte?",
                    "¿Vols afegir una foto al teu perfil?",
                    "Si vols compartir receptes ..",
                    ".. afegeix el teu correu electrònic",
                    "¡Envia!",
                    "Introduïu el codi de verificació",
                    "Comproveu!"
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
            isRegister: false,
            avatarImg: "",
            email: "",
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
            case "avatarImg":
                let formPicture = new FormData();
                formPicture.append("picture", event.target.files[0]);
                instance.post("/users/addavatar", formPicture)
                    .then(
                        (response, error) => {
                            if (!response.data.error) {
                                const avatarImgLink = response.data.replace("upload", "upload/w_150,h_150,c_thumb,g_faces")
                                this.setState({
                                    avatarImg: avatarImgLink
                                });
                            } else {
                                alert(response.data.error)
                                this.setState({
                                    avatarImg: ""
                                });
                                // document.getElementById('picture').value = ''
                            }
                        })
                    .catch(error => {
                        console.log(error)
                    });
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
                const response = await instance.post("/users/login", data);
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
            isRegister: !this.state.isRegister,
            isEmailSent: false
        })
        document.getElementById("name").focus()
    }

    async registerUser(data) {
        const { name, password, passwordCheck, bookCode, avatarImg } = data
        const { user } = this.props
        const email = user.email
        if (!name || !password || !passwordCheck || !bookCode) {
            alert("Please fill all required fields")
            return
        }
        if (password !== passwordCheck) {
            alert("Both password must be the same")
            return
        }
        const response = await instance.get("/users/book/" + bookCode)
        const { status, book, database, language } = response.data
        if (status) {
            // const verifiedEmail = this.state.isEmailValid ? email : ""
            const payload = { name, password, database, language, book, avatarImg, email }
            try {
                const responseAdd = await instance.post("/users/add", payload)
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
        const englishText = [
            "Invalid email address!",
            "Email sent successfully.",
            "Email verified, now you can enjoy sharing recipes!",
            "<p>This message has been sent from <strong>My Recipes</strong>, to verify your email address.</p><p>If you didn't ask for this verification, please ignore it.</p><h2>Verification code is:</h2>"
        ]
        const { welcomeText, languagePos, name, password, passwordCheck, isRegister, bookCode, avatarImg, email } = this.state
        const emailInsertText = welcomeText[languagePos].slice(12, 17).concat(englishText)
        return (
            <div className="logIn">
                {!isRegister && (
                    < div className="welcomeText">
                        {welcomeText[languagePos][0]}
                    </div>)
                }
                <Input onChange={this.changeField} type="text" value={name} name="name" id="name" placeholder={welcomeText[languagePos][1]} />
                <Input onChange={this.changeField} type="password" name="password" id="password" placeholder={welcomeText[languagePos][2]} />
                {
                    isRegister ? (
                        <div>
                            <Input onChange={this.changeField} type="password" name="passwordCheck" id="passwordCheck" placeholder={welcomeText[languagePos][8]} />
                            <Input onChange={this.changeField} type="text" value={bookCode} name="bookCode" id="bookCode" placeholder={welcomeText[languagePos][9]} />
                            <hr />
                            <EmailInsert text={emailInsertText} email={""} />
                            <hr />
                            {welcomeText[languagePos][11]}
                            {avatarImg !== "" && <Avatar alt={name} src={avatarImg} className="avatarBig" />}
                            <p />
                            {avatarImg === "" && <Input onChange={this.changeField} type="file" name="avatarImg" id="avatarImg" />}
                            <hr />
                            <button
                                onClick={() => this.registerUser({ name, password, passwordCheck, bookCode, avatarImg, email })}
                                className={name === "" || password === "" || passwordCheck === "" || bookCode === "" ?
                                    "chunky chunkyGrey chunkyW107" : "chunky chunkyGreen chunkyW107"}
                                disabled={name === "" || password === "" || passwordCheck === "" || bookCode === "" ?
                                    true : false
                                }>
                                {welcomeText[languagePos][6]}
                            </button>
                            <button onClick={this.toggleIsRegister} className="chunky chunkyYellow chunkyW107 float-right">{welcomeText[languagePos][7]}</button>
                        </div>
                    ) : (
                            <div>
                                <button onClick={() => this.logIn({ name, password })} className="chunky chunkyGreen chunkyW107">{welcomeText[languagePos][3]}</button>
                                <hr></hr>
                                <h4>{welcomeText[languagePos][10]}</h4>
                                <button onClick={this.toggleIsRegister} className="chunky chunkyBlue chunkyW107">{welcomeText[languagePos][4]}</button>
                            </div>
                        )
                }
            </div >
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.main.user,
})

export default connect(mapStateToProps)(LogIn)
