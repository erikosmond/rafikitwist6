import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeFormSkeleton from 'components/recipes/RecipeFormSkeleton'

import {
  handleRecipeSubmit,
  handleTagFormModal,
  loadIngredientOptions,
  loadRecipeFormData,
  loadTagOptions,
} from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    formData: state.recipesReducer.formData,
    ingredientModificationOptions: state.recipesReducer.ingredientModificationOptions,
    ingredientOptions: state.recipesReducer.ingredientOptions,
    recipe: state.recipesReducer.recipe,
    tagOptions: state.recipesReducer.tagOptions,
  }),
  {
    handleRecipeSubmit,
    handleTagFormModal,
    loadIngredientOptions,
    loadRecipeFormData,
    loadTagOptions,
  },
)(RecipeFormSkeleton))
