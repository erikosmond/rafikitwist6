import React from 'react'
import PropTypes from 'prop-types'
import RecipeForm from 'containers/RecipeFormContainer'

// Remove the props from the container that are simply being passed through to RecipeForm component.
class RecipeFormSkeleton extends React.Component {
  componentDidMount() {
    const {
      edit,
      loadEditForm,
      loadIngredientOptions,
      loadTagOptions,
      match,
    } = this.props
    loadIngredientOptions('Ingredients')
    loadTagOptions()
    if (edit) {
      const { recipeId } = match.params
      loadEditForm(recipeId)
    }
  }

  componentDidUpdate(lastProps) {
    const { history, savedRecipeId } = this.props
    if (lastProps.savedRecipeId !== savedRecipeId) {
      history.push(`/recipes/${savedRecipeId}`)
    }
  }

  submit = (values) => {
    // send the values to the store
    const { handleRecipeSubmit } = this.props
    handleRecipeSubmit(values)
  }

  render() {
    const {
      edit,
      ingredientOptions,
      ingredientModificationOptions,
      recipeFormData,
      tagOptions,
    } = this.props
    if (edit && !recipeFormData.id) {
      return null
    }
    if (
      ingredientOptions.length > 0 &&
      ingredientModificationOptions.length > 0 &&
      Object.keys(tagOptions).length > 0
    ) {
      return (
        <RecipeForm
          onSubmit={this.submit}
        />
      )
    }
    return null
  }
}

RecipeFormSkeleton.propTypes = {
  edit: PropTypes.bool,
  handleRecipeSubmit: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  ingredientOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  ingredientModificationOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  loadEditForm: PropTypes.func.isRequired,
  loadIngredientOptions: PropTypes.func.isRequired,
  loadTagOptions: PropTypes.func.isRequired,
  recipeFormData: PropTypes.shape(),
  savedRecipeId: PropTypes.number,
  tagOptions: PropTypes.shape(),
  match: PropTypes.shape({
    params: PropTypes.shape({
      recipeId: PropTypes.string,
    }),
  }),
}

RecipeFormSkeleton.defaultProps = {
  edit: false,
  ingredientOptions: [],
  ingredientModificationOptions: [],
  recipeFormData: {},
  savedRecipeId: undefined,
  tagOptions: {},
  match: { params: { recipeId: null } },
}

export default RecipeFormSkeleton
