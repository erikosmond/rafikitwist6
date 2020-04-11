import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeFormSkeleton from 'components/recipes/RecipeFormSkeleton'

import {
  loadIngredientOptions,
  loadRecipeFormData,
  loadTagOptions,
  handleRecipeSubmit,
} from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    recipe: state.recipesReducer.recipe,
    ingredientOptions: state.recipesReducer.ingredientOptions,
    ingredientModificationOptions: state.recipesReducer.ingredientModificationOptions,
    formData: state.recipesReducer.formData,
  }),
  {
    loadIngredientOptions,
    loadRecipeFormData,
    loadTagOptions,
    handleRecipeSubmit,
  },
)(RecipeFormSkeleton))
