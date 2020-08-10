import React from 'react'
import PropTypes from 'prop-types'
import RecipeForm from './RecipeForm'

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

  submit = (values) => {
    // send the values to the store
    const { handleRecipeSubmit } = this.props
    handleRecipeSubmit(values)
  }

  render() {
    const {
      edit,
      handleTagFormModal,
      handleRecipeIsIngredient,
      ingredientOptions,
      ingredientModificationOptions,
      recipeFormData,
      recipeIsIngredient,
      tagOptions,
    } = this.props
    if (edit && !recipeFormData.id) {
      return null
    }
    if (ingredientOptions.length > 0 && ingredientModificationOptions.length > 0) {
      return (
        <RecipeForm
          initialValues={recipeFormData}
          handleTagFormModal={handleTagFormModal}
          handleRecipeIsIngredient={handleRecipeIsIngredient}
          ingredientOptions={ingredientOptions}
          ingredientModificationOptions={ingredientModificationOptions}
          tagOptions={tagOptions}
          onSubmit={this.submit}
          recipeIsIngredient={recipeIsIngredient}
        />
      )
    }
    return null
  }
}

RecipeFormSkeleton.propTypes = {
  edit: PropTypes.bool,
  handleRecipeSubmit: PropTypes.func.isRequired,
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
  tagOptions: PropTypes.shape(),
  recipeFormData: PropTypes.shape(),
  handleTagFormModal: PropTypes.func.isRequired,
  handleRecipeIsIngredient: PropTypes.func.isRequired,
  recipeIsIngredient: PropTypes.bool,
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
  recipeIsIngredient: false,
  recipeFormData: {},
  tagOptions: {},
  match: { params: { recipeId: null } },
}

export default RecipeFormSkeleton
