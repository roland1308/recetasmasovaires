import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

const ChefAvatar = props => {
    const [profileState, setProfileState] = useState(props);
    const classes = useStyles();
    const { name, avatarImg, size } = profileState
    console.log(profileState);

    return (
        <div className={classes.root}>
            <Avatar alt={name} src={avatarImg} className={classes.small} />
        </div>
    );
}

export default ChefAvatar