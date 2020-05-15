import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { setLanguage } from "../store/actions/mainActions";
import changeLanguage from '../utils/changeLanguage';
import { connect } from "react-redux";

import MenuRoundedIcon from "@material-ui/icons/MenuRounded";

import { logOut } from '../store/actions/mainActions'

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
        const { user } = this.props
        return (
            <div className="flexNavbar">
                <Link className="pumpkin-flat-button linkNoDecoration" to="/">
                    {user.book}
                </Link>
                <div className="dropdown">
                    <MenuRoundedIcon
                        className="btn dropdown-toggle hamburger" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                    />
                    <div className="dropdown-menu menu-left dropleft languageMenu">
                        {/* <div className="dropdown-item" href="#">Commenti</div>
                        <div className="dropdown-item" href="#">Preferiti</div> */}
                        <button type="button" className="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.props.language.recipesnavbar[0]}
                        </button>
                        <div className="dropdown-menu languageMenu">
                            <div onClick={() => this.setLanguage("English")}>English</div>
                            <div onClick={() => this.setLanguage("Italiano")}>Italiano</div>
                            <div onClick={() => this.setLanguage("Español")}>Español</div>
                            <div onClick={() => this.setLanguage("Català")}>Català</div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button onClick={() => this.logOut()} className="dropdown-item">LogOut</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    language: state.main.language,
    user: state.main.user,
});

export default connect(mapStateToProps)(RecipesNavbar);