import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeSkeleton from 'components/recipes/RecipeSkeleton'

import { loadRecipe, clearRecipe } from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    recipe: state.recipesReducer.recipe,
    admin: state.recipesReducer.admin,
    noRecipe: state.recipesReducer.noRecipe,
  }),
  {
    loadRecipe,
    clearRecipe,
  },
)(RecipeSkeleton))
