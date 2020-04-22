import {
    RECIPE_ADD,
    RECIPE_EDIT
} from '../actions/mainActions';

const initialState = {
    recipeAction: "",
    recipe: {}
};

export default function mainReducer(state = initialState, action) {
    switch (action.type) {
        case RECIPE_ADD:
            return {
                ...state,
                recipeAction: "add"
            };
        case RECIPE_EDIT:
            return {
                ...state,
                recipeAction: "edit",
                recipe: action.payload
            }

        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}
