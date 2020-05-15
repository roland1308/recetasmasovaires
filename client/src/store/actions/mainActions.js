// Action types
import changeLanguage from '../../utils/changeLanguage';

export const SET_LANGUAGE = "SET_LANGUAGE";
export const SET_RECIPES = "SET_RECIPES";

export const SET_USER = "SET_USER";

export const LOG_OUT = "LOG_OUT";

export const RECIPE_ADD = "RECIPE_ADD";
export const RECIPE_EDIT = "RECIPE_EDIT";
export const RECIPE_RESET = "RECIPE_RESET";

export const RECIPE_PUSH = "RECIPE_PUSH";
export const RECIPE_DELETE = "RECIPE_DELETE";

export const RECIPE_LIST = "RECIPE_LIST";

export const INGREDIENTS_EDIT_LIST = "INGREDIENTS_EDIT_LIST"

export const INGREDIENT_ADD = "INGREDIENT_ADD";
export const INGREDIENT_REMOVE = "INGREDIENT_REMOVE";
export const SET_NR_OF_INGS = "SET_NR_OF_INGS";
export const SET_LOADING = "SET_LOADING";

export const ADD_LIKE = "ADD_LIKE"
export const REMOVE_LIKE = "REMOVE_LIKE"

export const ADD_FAV = "ADD_FAV"
export const REMOVE_FAV = "REMOVE_FAV"

const axios = require("axios");

export const setLanguage = (payload) => ({
    type: SET_LANGUAGE,
    payload
})
export const setRecipes = (recipes) => ({
    type: SET_RECIPES,
    payload: recipes
})
export const setUser = (user) => ({
    type: SET_USER,
    payload: user
})
export const logOut = () => ({
    type: LOG_OUT
})
export const recipeAdd = () => ({
    type: RECIPE_ADD,
});
export const recipeEdit = (recipeToEdit) => ({
    type: RECIPE_EDIT,
    payload: recipeToEdit
})
export const recipeReset = () => ({
    type: RECIPE_RESET
})

export const recipePush = (recipe) => ({
    type: RECIPE_PUSH,
    payload: recipe
})

export const recipeDelete = (id) => ({
    type: RECIPE_DELETE,
    payload: id
})

export const recipeList = () => ({
    type: RECIPE_LIST
})

export const ingredientsEditList = (newEditList) => ({
    type: INGREDIENTS_EDIT_LIST,
    payload: newEditList
})

export const ingredientAdd = (ingAdd) => ({
    type: INGREDIENT_ADD,
    payload: ingAdd
})

export const ingredientRemove = (ingDel) => ({
    type: INGREDIENT_REMOVE,
    payload: ingDel
})

export const setNrOfIngs = (nrOfIngs) => ({
    type: SET_NR_OF_INGS,
    payload: nrOfIngs
})

export const setLoading = (state) => ({
    type: SET_LOADING,
    payload: state
})

export const addLike = (payload) => {
    const { chefId, _id, token, URL } = payload
    return async dispatch => {
        try {
            const response = await axios.put(URL, { chefId, _id }, {
                headers: { authorization: `bearer ${token}` }
            })
            if (response.data.name === "MongoError") {
                return response.data.errmsg
            } else {
                dispatch(likePushSuccess({ chefId, _id }))
            }
        } catch (error) {
            return error.message
        }
        return "done";
    }
}
export const likePushSuccess = (payload) => ({
    type: ADD_LIKE,
    payload: payload
})
export const removeLike = (payload) => {
    const { chefId, _id, token, URL } = payload
    return async dispatch => {
        try {
            const response = await axios.put(URL, { chefId, _id }, {
                headers: {
                    authorization: `bearer ${token}`
                }
            })
            if (response.data.name === "MongoError") {
                return response.data.errmsg
            } else {
                dispatch(likeRemoveSuccess({ chefId, _id }));
            }
        } catch (error) {
            return error.message
        }
        return "done";
    };
}
export const likeRemoveSuccess = (payload) => ({
    type: REMOVE_LIKE,
    payload: payload
})

export const addFav = (payload) => {
    const { chefId, _id, token, URL } = payload
    return async dispatch => {
        try {
            const response = await axios.put(URL, { chefId, _id }, {
                headers: { authorization: `bearer ${token}` }
            })
            if (response.data.name === "MongoError") {
                return response.data.errmsg
            } else {
                dispatch(favPushSuccess(_id))
            }
        } catch (error) {
            return error.message
        }
        return "done";
    }
}
export const favPushSuccess = (payload) => ({
    type: ADD_FAV,
    payload: payload
})
export const removeFav = (payload) => {
    const { chefId, _id, token, URL } = payload
    return async dispatch => {
        try {
            const response = await axios.put(URL, { chefId, _id }, {
                headers: {
                    authorization: `bearer ${token}`
                }
            })
            if (response.data.name === "MongoError") {
                return response.data.errmsg
            } else {
                dispatch(favRemoveSuccess(_id));
            }
        } catch (error) {
            return error.message
        }
        return "done";
    };
}
export const favRemoveSuccess = (payload) => ({
    type: REMOVE_FAV,
    payload: payload
})

export const checkToken = token => {
    return async dispatch => {
        dispatch(setLoading(true))
        try {
            const response1 = await axios.get("/users/check", {
                headers: {
                    authorization: `bearer ${token}`
                }
            });
            dispatch(setUser(response1.data));
            const payload = changeLanguage(response1.data.language)
            dispatch(setLanguage(payload))
            try {
                const response2 = await axios.get(response1.data.database + "all");
                dispatch(setRecipes(response2.data))
            } catch (error) {
                console.log(error);
            }
            dispatch(setLoading(false))
            return "success"
        } catch (error) {
            window.localStorage.removeItem("token");
            dispatch(setLoading(false))
            return error;
        }
    };
};

export const logUser = response => {
    return async dispatch => {
        dispatch(setLoading(true))
        try {
            dispatch(setUser(response));
            const payload = changeLanguage(response.language)
            dispatch(setLanguage(payload))
            try {
                const response2 = await axios.get(response.database + "all");
                dispatch(setRecipes(response2.data))
            } catch (error) {
                console.log(error);
            }
            const token = await axios.post("/users/token", response);
            if (response.password !== "guest") { window.localStorage.setItem("token", token.data) }
            dispatch(setLoading(false))
            return "success"
        } catch (error) {
            console.log(error);
            return error;
        }
    };
};