import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Avatar } from '@material-ui/core';
import { Input } from 'reactstrap';

import { setPage, updateUser } from '../store/actions/mainActions';
import EmailInsert from '../components/EmailInsert';

import axios from 'axios';
let instance = axios.create()
if(process.env.NODE_ENV === "production")
{
    instance = axios.create({
        baseURL: 'https://recipes-awpm.onrender.com',
        //timeout: 1000,

        //headers: {'X-Custom-Header': 'foobar'}
    });
}


export class ChefProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            avatarImg: "",
        }
    }

    componentDidMount() {
        if (this.props.user.avatarimg) {
            this.setState({
                avatarImg: this.props.user.avatarimg
            })
        }
        this.props.dispatch(setPage("basic"))
    }

    changeField = (event) => {
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
    }

    async updateUser() {
        const token = localStorage.token;
        try {
            await instance.post("/users/update/",
                {
                    chef: this.props.user.name,
                    _id: this.props.user._id,
                    avatarImg: this.state.avatarImg,
                    email: this.props.user.email
                },
                {
                    headers: {
                        authorization: `bearer ${token}`
                    }
                });
        } catch (error) {
            console.log(error.message);
        }
        this.props.dispatch(updateUser(this.state.avatarImg))
        this.props.history.goBack()
    }

    render() {
        const { user, language, emailinsert } = this.props
        const { avatarImg } = this.state
        return (
            <div className="logIn">
                <h3>{language[0]}</h3>
                <hr />
                <Avatar alt={user.name} src={avatarImg} className="avatarBig" >{user.name.substr(0, 1)}</Avatar>
                <p />
                <Input onChange={this.changeField} type="file" name="avatarImg" id="avatarImg" />
                <hr />
                <EmailInsert text={emailinsert} email={user.email} />
                <hr />
                <button onClick={() => this.updateUser({ user, avatarImg })} className="chunky chunkyGreen chunkyW107">{user.avatarimg === "" ? language[1] : language[2]}</button>
                <button onClick={() => this.props.history.goBack()} className="chunky chunkyYellow chunkyW107 float-right">{language[3]}</button>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.main.user,
    language: state.main.language.chefprofile,
    emailinsert: state.main.language.emailinsert

})

export default connect(mapStateToProps)(ChefProfile)
