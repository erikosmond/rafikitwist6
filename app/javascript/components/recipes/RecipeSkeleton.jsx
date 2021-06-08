import React from 'react'
import PropTypes from 'prop-types'
import Recipe from './Recipe'

class RecipeSkeleton extends React.Component {
  componentDidMount() {
    const { loadRecipe, match } = this.props
    const { recipeId } = match.params
    loadRecipe(recipeId)
  }

  componentDidUpdate(lastProps) {
    const { loadRecipe, location, match } = this.props
    if (lastProps.location !== location) {
      const { recipeId } = match.params
      if (recipeId) {
        loadRecipe(recipeId)
      }
    }
  }

  render() {
    const {
      admin,
      recipe,
      noRecipe,
      clearRecipe,
      mobile,
    } = this.props
    if (!recipe || !recipe.name) {
      return null
    }
    return (
      <Recipe
        admin={admin}
        recipe={recipe}
        noRecipe={noRecipe}
        clearRecipe={clearRecipe}
        mobile={mobile}
      />
    )
  }
}

RecipeSkeleton.propTypes = {
  loadRecipe: PropTypes.func.isRequired,
  recipe: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    ingredients: PropTypes.shape({}),
  }),
  admin: PropTypes.bool,
  mobile: PropTypes.bool,
  noRecipe: PropTypes.bool,
  clearRecipe: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      recipeId: PropTypes.string,
    }),
  }).isRequired,
}

RecipeSkeleton.defaultProps = {
  admin: false,
  recipe: {},
  noRecipe: false,
  mobile: false,
}

export default RecipeSkeleton
