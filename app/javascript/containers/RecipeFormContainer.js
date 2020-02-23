import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeFormSkeleton from 'components/recipes/RecipeFormSkeleton'

import { loadRecipeFormData, handleRecipeSubmit } from 'bundles/recipes'

export default withRouter(connect(
  state => ({
    recipe: state.recipesReducer.recipe,
    formData: state.recipesReducer.formData,
  }),
  {
    loadRecipeFormData,
    handleRecipeSubmit,
  },
)(RecipeFormSkeleton))
