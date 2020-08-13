import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeFormSkeleton from 'components/recipes/RecipeFormSkeleton'

import {
  handleRecipeSubmit,
  loadEditForm,
  loadRecipeFormData,
  handleRecipeIsIngredient,
} from 'bundles/recipes'

import {
  handleTagFormModal,
  loadIngredientOptions,
  loadTagOptions,
} from 'bundles/tags'

export default withRouter(connect(
  (state) => ({
    formData: state.recipesReducer.formData,
    ingredientModificationOptions: state.tagsReducer.ingredientModificationOptions,
    ingredientOptions: state.tagsReducer.ingredientOptions,
    recipe: state.recipesReducer.recipe,
    tagOptions: state.tagsReducer.tagOptions,
    recipeFormData: state.recipesReducer.recipeFormData,
    recipeIsIngredient: state.recipesReducer.recipeIsIngredient,
  }),
  {
    handleRecipeSubmit,
    handleTagFormModal,
    handleRecipeIsIngredient,
    loadEditForm,
    loadIngredientOptions,
    loadRecipeFormData,
    loadTagOptions,
  },
)(RecipeFormSkeleton))
