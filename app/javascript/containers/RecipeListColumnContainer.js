import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeListColumn from 'components/recipes/RecipeListColumn'

import { showMoreRecipes } from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    pagedRecipeCount: state.recipesReducer.pagedRecipeCount,
    visibleRecipeCount: state.recipesReducer.visibleRecipeCount,
    selectedRecipes: state.recipesReducer.selectedRecipes,
  }),
  {
    showMoreRecipes,
  },
)(RecipeListColumn))
