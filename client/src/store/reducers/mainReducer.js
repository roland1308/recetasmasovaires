import {
    RECIPE_ADD,
    RECIPE_EDIT,
    RECIPE_RESET,
    INGREDIENT_ADD,
    SET_NR_OF_INGS
} from '../actions/mainActions';

const initialState = {
    recipeAction: "",
    recipe: {
        ingredients: []
    },
    nrOfIngredients: 0
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
        case RECIPE_RESET:
            return {
                recipeAction: "",
                recipe: {
                    ingredients: []
                },
                nrOfIngredients: 0
            }
        case INGREDIENT_ADD:
            let copyRecipe = state.recipe
            copyRecipe.ingredients.push({
                ingredient: action.payload.ingredient,
                qty: action.payload.ingQty
            })
            return {
                ...state,
                recipe: copyRecipe,
                nrOfIngredients: state.nrOfIngredients + 1
            }
        case SET_NR_OF_INGS:
            return {
                ...state,
                nrOfIngredients: action.payload
            }

        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}
