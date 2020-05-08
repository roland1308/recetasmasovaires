import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";

import { IoIosSettings } from "react-icons/io";
import { IoIosPower } from "react-icons/io";
import { MdFavorite } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";

import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import React, { Component } from "react";
import { connect } from "react-redux";

export class RecipeNavBar extends Component {
    render() {
        const { user } = this.props;
        return (
            <div className="flexNavbar">
                <Link className="pumpkin-flat-button linkNoDecoration" to="/">
                    {user.book}
                </Link>
                <div className="dropdown">
                    <MenuRoundedIcon
                        style={{ fontSize: 100 }}
                        className="colorPrimary"
                        data-toggle="dropdown"
                    />
                    <div className="dropdown-menu menu-left">
                        <Link
                            to={"/managefavorites"}
                            className="dropdown-item linkNoDecoration menuText"
                        >
                            MYFavorites <MdFavorite />
                        </Link>
                        <Link
                            to={"/manageComments"}
                            className="dropdown-item linkNoDecoration menuText"
                        >
                            MYComments <FaRegComment />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.main.user
});

export default connect(mapStateToProps)(RecipeNavBar);
