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
    RECIPE_PUSH,
    RECIPE_DELETE,
    SET_LOADING,
    RECIPE_LIST,
} from '../actions/mainActions';


const initialState = {
    user: undefined,
    recipes: [],
    nrOfRecipes: 0,
    language: undefined,
    recipeAction: undefined,
    editRecipe: {
        editIngredients: []
    },
    nrOfIngredients: 0,
    isLoading: false,
    isLogged: false
};

export default function mainReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LANGUAGE:
            return {
                ...state,
                language: action.payload
            }
        case SET_RECIPES:
            return {
                ...state,
                recipes: action.payload,
                nrOfRecipes: action.payload.length
            }
        case SET_USER:
            return {
                ...state,
                user: action.payload,
                isLogged: true
            }
        case RECIPE_ADD:
            return {
                ...state,
                recipeAction: "add"
            };
        case RECIPE_EDIT:
            const edit = {
                editIngredients: action.payload.ingredients,
                pictures: action.payload.pictures,
                _id: action.payload._id,
                name: action.payload.name,
                chef: action.payload.chef,
                type: action.payload.type,
                pax: action.payload.pax,
                preparation: action.payload.preparation
            }
            return {
                ...state,
                recipeAction: "edit",
                editRecipe: edit
            }
        case RECIPE_RESET:
            return {
                ...state,
                recipeAction: "add",
                editRecipe: {
                    editIngredients: []
                },
                nrOfIngredients: 0
            }
        case RECIPE_PUSH:
            let copyRecipes = state.recipes
            copyRecipes.push(action.payload)
            return {
                ...state,
                recipes: copyRecipes,
                nrOfRecipes: state.nrOfRecipes + 1
            }
        case RECIPE_DELETE:
            let copyRecipeDeleted = state.recipes
            const index = copyRecipeDeleted.findIndex(x => x._id === action.payload)
            copyRecipeDeleted.splice(index, 1)
            return {
                ...state,
                recipes: copyRecipeDeleted,
                nrOfRecipes: state.nrOfRecipes - 1
            }
        case RECIPE_LIST:
            return {
                ...state,
                recipeAction: "list"
            }
        case INGREDIENT_ADD:
            let copyRecipe = state.editRecipe
            copyRecipe.editIngredients = [
                ...copyRecipe.editIngredients,
                action.payload
            ]
            return {
                ...state,
                editRecipe: copyRecipe,
                nrOfIngredients: state.nrOfIngredients + 1
            }
        case INGREDIENT_REMOVE:
            let copyRecipeForDel = state.editRecipe
            copyRecipeForDel.editIngredients.slice(action.payload, 1)
            return {
                ...state,
                editRecipe: copyRecipeForDel,
                nrOfIngredients: state.nrOfIngredients - 1
            }
        case SET_NR_OF_INGS:
            return {
                ...state,
                nrOfIngredients: action.payload
            }
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }

        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}
