import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeHeaderActions from 'components/recipes/RecipeHeaderActions'

import { handleCommentModal, updateRecipeTag } from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    priorities: state.recipesReducer.priorities,
    ratings: state.recipesReducer.ratings,
    authenticated: state.recipesReducer.authenticated,
  }),
  {
    handleCommentModal,
    updateRecipeTag,
  },
)(RecipeHeaderActions))
