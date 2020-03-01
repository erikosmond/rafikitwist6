import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeFormSkeleton from 'components/recipes/RecipeFormSkeleton'

import { 
  loadIngredientOptions,
  loadRecipeFormData,
  handleRecipeSubmit,
} from 'bundles/recipes'

export default withRouter(connect(
  state => ({
    recipe: state.recipesReducer.recipe,
    ingredientOptions: state.recipesReducer.ingredientOptions,
    formData: state.recipesReducer.formData,
  }),
  {
    loadIngredientOptions,
    loadRecipeFormData,
    handleRecipeSubmit,
  },
)(RecipeFormSkeleton))
