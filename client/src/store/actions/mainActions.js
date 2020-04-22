// Action types
export const RECIPE_ADD = "RECIPE_ADD";
export const RECIPE_EDIT = "RECIPE_EDIT";

export const recipeAdd = () => ({
    type: RECIPE_ADD,
});

export const recipeEdit = (payload) => ({
    type: RECIPE_EDIT,
    payload
})