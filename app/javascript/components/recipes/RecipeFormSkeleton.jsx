import React from 'react'
import PropTypes from 'prop-types'
import RecipeForm from './RecipeForm'

class RecipeFormSkeleton extends React.Component {
  componentDidMount() {
    const { loadIngredientOptions, loadTagOptions } = this.props
    loadIngredientOptions('Ingredients')
    loadTagOptions()
  }

  submit = (values) => {
    // send the values to the store
    const { handleRecipeSubmit } = this.props
    handleRecipeSubmit(values)
  }

  render() {
    const {
      handleTagFormModal,
      ingredientOptions,
      ingredientModificationOptions,
      tagOptions,
    } = this.props
    if (ingredientOptions.length > 0 && ingredientModificationOptions.length > 0) {
      return (
        <RecipeForm
          // TODO: add initial values when editing recipe
          initialValues={{ description: 'initial descrip' }}
          handleTagFormModal={handleTagFormModal}
          ingredientOptions={ingredientOptions}
          ingredientModificationOptions={ingredientModificationOptions}
          tagOptions={tagOptions}
          onSubmit={this.submit}
        />
      )
    }
    return null
  }
}

RecipeFormSkeleton.propTypes = {
  handleRecipeSubmit: PropTypes.func.isRequired,
  ingredientOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  ingredientModificationOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  loadIngredientOptions: PropTypes.func.isRequired,
  loadTagOptions: PropTypes.func.isRequired,
  tagOptions: PropTypes.shape(),
  handleTagFormModal: PropTypes.func.isRequired,
}

RecipeFormSkeleton.defaultProps = {
  ingredientOptions: [],
  ingredientModificationOptions: [],
  tagOptions: {},
}

export default RecipeFormSkeleton
