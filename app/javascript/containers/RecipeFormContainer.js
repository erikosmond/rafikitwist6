import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeForm from 'components/recipes/RecipeForm'

import {
  handleRecipeIsIngredient,
} from 'bundles/recipes'

import {
  handleTagFormModal,
} from 'bundles/tags'

export default withRouter(connect(
  (state) => ({
    ingredientModificationOptions: state.tagsReducer.ingredientModificationOptions,
    ingredientOptions: state.tagsReducer.ingredientOptions,
    tagOptions: state.tagsReducer.tagOptions,
    initialValues: state.recipesReducer.recipeFormData,
    recipeIsIngredient: state.recipesReducer.recipeIsIngredient,
  }),
  {
    handleTagFormModal,
    handleRecipeIsIngredient,
  },
)(RecipeForm))
