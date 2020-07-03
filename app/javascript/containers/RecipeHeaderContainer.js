import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeHeader from 'components/recipes/RecipeHeader'

import { loadRecipeOptions, loadIngredientOptions } from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    authenticated: state.recipesReducer.authenticated,
    recipeOptions: state.recipesReducer.recipeOptions,
    ingredientOptions: state.recipesReducer.ingredientOptions,
    categoryOptions: state.recipesReducer.categoryOptions,
    firstName: state.recipesReducer.firstName,
    selectedTag: state.recipesReducer.selectedTag,
  }),
  {
    loadRecipeOptions,
    loadIngredientOptions,
  },
)(RecipeHeader))
