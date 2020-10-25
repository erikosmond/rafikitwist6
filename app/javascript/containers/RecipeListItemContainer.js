import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeListItem from 'components/recipes/RecipeListItem'

import { handleCommentModal, updateRecipeTag } from 'bundles/recipes'

// TODO: I think I can remove this whole container because the component
// only requires the recipe being passed in
export default withRouter(connect(
  (state) => ({
    authenticated: state.recipesReducer.authenticated,
    priorities: state.recipesReducer.priorities,
    ratings: state.recipesReducer.ratings,
  }),
  {
    handleCommentModal,
    updateRecipeTag,
  },
)(RecipeListItem))
