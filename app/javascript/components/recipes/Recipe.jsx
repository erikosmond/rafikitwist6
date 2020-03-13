import React from 'react'
import PropTypes from 'prop-types'
import RecipeProperties from 'components/recipes/RecipeProperties'
import RecipeInstructions from 'components/recipes/RecipeInstructions'
import RecipeDescription from 'components/recipes/RecipeDescription'
import { allIngredients } from 'services/recipes'

class Recipe extends React.Component {
  componentWillUnmount() {
    const { clearRecipe } = this.props
    clearRecipe()
  }

  render() {
    const { recipe, noRecipe } = this.props
    if (noRecipe) {
      return (
        <div>
          <div>
            `We do not have a recipe like that`
          </div>
        </div>
      )
    }
    return (
      <div>
        <h2>{recipe.name}</h2>
        <RecipeProperties title="Ingredients" tags={allIngredients(recipe)} />
        <RecipeInstructions recipe={recipe} />
        <RecipeDescription recipe={recipe} />
        <RecipeProperties title="Sources" tags={recipe.sources} />
        <RecipeProperties title="Menus" tags={recipe.menus} />
        <RecipeProperties title="Preparations" tags={recipe.preparations} />
        <RecipeProperties title="Priorities" tags={recipe.priorities} />
        <RecipeProperties title="Ratings" tags={recipe.ratings} />
        <RecipeProperties title="Vessels" tags={recipe.vessels} />
      </div>
    )
  }
}

Recipe.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    ingredients: PropTypes.shape({}).isRequired,
    ratings: PropTypes.shape({}).isRequired,
    sources: PropTypes.shape({}).isRequired,
    menus: PropTypes.shape({}).isRequired,
    preparations: PropTypes.shape({}).isRequired,
    priorities: PropTypes.shape({}).isRequired,
    vessels: PropTypes.shape({}).isRequired,
  }),
  noRecipe: PropTypes.bool,
  clearRecipe: PropTypes.func.isRequired,
}

Recipe.defaultProps = {
  recipe: {},
  noRecipe: false,
}

export default Recipe
