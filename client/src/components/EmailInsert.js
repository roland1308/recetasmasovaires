import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from 'reactstrap';
import { emailSet } from '../store/actions/mainActions';

import axios from 'axios';

let instance = axios.create()
if(process.env.NODE_ENV === "production")
{
    instance = axios.create({
        baseURL: 'https://recipes-awpm.onrender.com',
                headers: {"Access-Control-Allow-Headers": "Content-Type"}
        //timeout: 1000,

        //headers: {'X-Custom-Header': 'foobar'}
    });
}

class EmailInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            isEmailSent: false,
            isEmailValid: null,
            veriCode: ""
        }
    }

    componentDidMount() {
        const { email } = this.props
        if (email !== "") {
            this.setState({
                email,
                isEmailValid: true
            })
        }
    }

    changeField = event => {
        event.preventDefault()
        this.setState({ [event.target.name]: event.target.value })
    }

    async checkEmail(payload) {
        const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        if (!re.test(payload.to)) {
            alert(this.props.text[5])
            return
        }
        try {
            const response = await instance.post("/users/sendemail", payload)
            if (response.data.code !== "success") {
                alert("Error!")
                return
            } else {
                alert(this.props.text[6])
            }
        } catch (error) {
            alert(error);
            return
        }
        this.setState({ isEmailSent: true })
    }

    async checkCode(veriCode) {
        const payload = {
            veriCode,
            to: this.state.email
        }
        try {
            const response = await instance.post("/users/checkcode", payload)
            if (response.data !== "verified") {
                alert("Error!")
                return
            } else {
                alert(this.props.text[7])
                this.setState({ isEmailValid: true })
                this.props.dispatch(emailSet(this.state.email))
                return
            }
        } catch (error) {
            alert(error);
            return
        }
    }

    render() {
        const { email, isEmailSent, isEmailValid, veriCode } = this.state
        const { text } = this.props
        let payload = {
            from: 'recetasmasovaires@gmail.com',
            to: email,
            subject: 'My Recipes - email verification',
            html: text[8]
        }
        return (
            <div>
                {isEmailValid ? (
                    <div>{email}</div>
                ) : (
                        <div>
                            {text[0]}
                            <p />
                            {isEmailSent ? (
                                <div>
                                    <Input onChange={this.changeField} type="text" value={veriCode} name="veriCode" id="veriCode" placeholder={text[3]} />
                                    <button
                                        onClick={() => this.checkCode(veriCode)}
                                        autoComplete="false"
                                        className={veriCode === "" ?
                                            "chunky chunkyGrey chunkyW133" : "chunky chunkyViolet chunkyW133"}
                                        disabled={veriCode === "" ?
                                            true : false}>
                                        {text[4]}
                                    </button>
                                </div>
                            ) : (
                                    <div>
                                        <Input onChange={this.changeField} type="text" value={email.toLowerCase()} name="email" id="email" placeholder={text[1]} />
                                        <button
                                            onClick={() => this.checkEmail(payload)}
                                            autoComplete="false"
                                            className={email === "" ?
                                                "chunky chunkyGrey chunkyW133" : "chunky chunkyBlue chunkyW133"}
                                            disabled={email === "" ?
                                                true : false}>
                                            {text[2]}
                                        </button>
                                    </div>
                                )}
                        </div>
                    )
                }
            </div>)
    }
}

const mapStateToProps = (state) => ({
    user: state.main.user,
})

export default connect(mapStateToProps)(EmailInsert)
