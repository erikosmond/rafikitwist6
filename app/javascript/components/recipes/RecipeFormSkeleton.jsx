import React from 'react'
import PropTypes from 'prop-types'
import RecipeForm from './RecipeForm'

class RecipeFormSkeleton extends React.Component {
  componentDidMount() {
    const { loadIngredientOptions } = this.props
    loadIngredientOptions('Ingredients')
  }

  submit = (values) => {
    // send the values to the store
    const { handleRecipeSubmit } = this.props
    handleRecipeSubmit(values)
  }

  render() {
    const { ingredientOptions } = this.props
    return <RecipeForm ingredientOptions={ingredientOptions} onSubmit={this.submit} />
  }
}

RecipeFormSkeleton.propTypes = {
  handleRecipeSubmit: PropTypes.func.isRequired,
  ingredientOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  loadIngredientOptions: PropTypes.func.isRequired,
}

RecipeFormSkeleton.defaultProps = {
  ingredientOptions: [],
}

export default RecipeFormSkeleton
