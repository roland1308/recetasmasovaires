import React, { Component } from 'react'

import { setLanguage } from "../store/actions/mainActions";
import changeLanguage from '../utils/changeLanguage';
import { connect } from "react-redux";

import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import { Avatar } from '@material-ui/core';

import { logOut } from '../store/actions/mainActions'
import { Link } from 'react-router-dom';


class RecipesNavbar extends Component {

    setLanguage = (lang) => {
        const payload = changeLanguage(lang)
        this.props.dispatch(setLanguage(payload))
    }

    logOut = () => {
        window.localStorage.removeItem("token");
        this.props.dispatch(logOut())
    }

    render() {
        const { page, language, user } = this.props
        return (
            <div>
                {page === "home" &&
                    <div className="flexNavbar">
                        <img src={require("../images/uk.png")} height="45" onClick={() => this.setLanguage("English")} alt="English" />
                        <img src={require("../images/Italy.png")} height="45" onClick={() => this.setLanguage("Italiano")} alt="Italiano" />
                        <img src={require("../images/Spain.png")} height="45" onClick={() => this.setLanguage("Español")} alt="Español" />
                        <img src={require("../images/Catalonia.png")} height="45" onClick={() => this.setLanguage("Català")} alt="Català" />
                    </div>
                }
                {page === "basic" &&
                    <div className="flexNavbar">
                        {/* <ShareRoundedIcon className="btn shareSvg" /> */}
                        <Link to="/">
                            <HomeRoundedIcon className="btn homeSvg" />
                        </Link>
                        <div className="btn dropdown avatarSvg">
                            <Avatar
                                alt={user.name}
                                src={user.avatarimg}
                                className="avatarSmall"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                                {user.name.substr(0, 1)}
                            </Avatar>
                            {/* <MenuRoundedIcon
                                className="btn dropdown-toggle menuSvg" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            /> */}
                            <div className="dropdown-menu menu-left dropleft languageMenu">
                                <Link to="ChefProfile" className="dropdown-item" href="#">{language[1]}</Link>
                                <div className="dropdown-divider"></div>
                                <button onClick={() => this.logOut()} className="dropdown-item">{language[0]}</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    language: state.main.language.recipesnavbar,
    user: state.main.user,
    page: state.main.page,
});

export default connect(mapStateToProps)(RecipesNavbar);