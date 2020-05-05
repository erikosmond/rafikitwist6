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
    const data = {
      description: 'initial descrip',
      instructions: 'initial instructions',
      recipeName: 'existing name',
      sources: [{ id: 1, name: 'a good source' }, { id: 2, name: 'a second source' }],
      ingredients: [
        {
          ingredientAmount: '2 ounces',
          ingredientModification: { value: 6, label: 'salty' },
          ingredient: { value: 4, label: 'pepper' },
          ingredientPrep: 'diced',
        },
        {
          ingredientAmount: '1 ounce',
          ingredientModification: { value: 15, label: 'peppery' },
          ingredient: { value: 7, label: 'salt' },
          ingredientPrep: 'minced',
        },
      ],
    }
    if (ingredientOptions.length > 0 && ingredientModificationOptions.length > 0) {
      return (
        <RecipeForm
          // TODO: add initial values when editing recipe
          // TODO: add hidden id field so I know it's an update, not create
          initialValues={data}
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
