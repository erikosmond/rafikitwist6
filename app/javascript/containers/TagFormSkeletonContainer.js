import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import TagFormSkeleton from 'components/tags/TagFormSkeleton'

import {
  handleRecipeSubmit,
  loadRecipeFormData,
} from 'bundles/recipes'

import {
  loadIngredientOptions,
  loadTagOptions,
  loadTagTypes,
  loadEditTagForm,
  submitTagForm,
} from 'bundles/tags'

export default withRouter(connect(
  (state) => ({
    formData: state.tagsReducer.formData,
    ingredientModificationOptions: state.tagsReducer.ingredientModificationOptions,
    ingredientOptions: state.tagsReducer.ingredientOptions,
    recipe: state.recipesReducer.recipe,
    recipeFormData: state.recipesReducer.recipeFormData,
    savedRecipeId: state.recipesReducer.savedRecipeId,
    tagOptions: state.tagsReducer.tagOptions,
    tagTypes: state.tagsReducer.tagTypes,
  }),
  {
    handleRecipeSubmit,
    loadEditForm,
    loadIngredientOptions,
    loadRecipeFormData,
    loadTagOptions,
    loadTagTypes,
    submitTagForm,
  },
)(TagFormSkeleton))
