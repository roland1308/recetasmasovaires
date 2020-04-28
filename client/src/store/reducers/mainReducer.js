import {
    SET_LANGUAGE,
    SET_RECIPES,
    SET_USER,
    RECIPE_ADD,
    RECIPE_EDIT,
    RECIPE_RESET,
    INGREDIENT_ADD,
    INGREDIENT_REMOVE,
    SET_NR_OF_INGS,
} from '../actions/mainActions';


const initialState = {
    user: {},
    recipes: [],
    language: undefined,
    url: "",
    recipeAction: "add",
    recipe: {
        ingredients: []
    },
    nrOfIngredients: 0
};

export default function mainReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LANGUAGE:
            return {
                ...state,
                language: action.payload.lang,
                url: action.payload.url
            }
        case SET_RECIPES:
            return {
                ...state,
                recipes: action.payload
            }
        case SET_USER:
            return {
                ...state,
                user: action.payload
            }
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
                ...state,
                recipeAction: "add",
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
        case INGREDIENT_REMOVE:
            let copyRecipeForDel = state.recipe
            copyRecipeForDel.ingredients.slice(action.payload, 1)
            return {
                ...state,
                recipe: copyRecipeForDel,
                nrOfIngredients: state.nrOfIngredients - 1
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
