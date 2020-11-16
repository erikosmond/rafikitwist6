import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeFormSkeleton from 'components/recipes/RecipeFormSkeleton'

import {
  handleRecipeSubmit,
  loadEditForm,
  loadRecipeFormData,
} from 'bundles/recipes'

import {
  loadIngredientOptions,
  loadTagOptions,
} from 'bundles/tags'

export default withRouter(connect(
  (state) => ({
    formData: state.recipesReducer.formData,
    ingredientModificationOptions: state.tagsReducer.ingredientModificationOptions,
    ingredientOptions: state.tagsReducer.ingredientOptions,
    recipe: state.recipesReducer.recipe,
    recipeFormData: state.recipesReducer.recipeFormData,
    savedRecipeId: state.recipesReducer.savedRecipeId,
  }),
  {
    handleRecipeSubmit,
    loadEditForm,
    loadIngredientOptions,
    loadRecipeFormData,
    loadTagOptions,
  },
)(RecipeFormSkeleton))
