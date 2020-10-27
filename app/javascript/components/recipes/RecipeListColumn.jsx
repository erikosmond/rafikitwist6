import React from 'react'
import PropTypes from 'prop-types'
import RecipeListItem from 'components/recipes/RecipeListItem'
import { sortRecipes } from 'services/sortService'

class RecipeListColumn extends React.Component {
  static displayShown(recipe) {
    return recipe.hidden !== true
  }

  constructor(props) {
    super(props)
    this.handleShowMoreRecipes = this.handleShowMoreRecipes.bind(this)
  }

  handleShowMoreRecipes() {
    const { pagedRecipeCount, showMoreRecipes } = this.props
    showMoreRecipes(pagedRecipeCount)
  }

  renderHeaderWithCount() {
    const { selectedRecipes, visibleRecipeCount } = this.props
    const selectedRecipeCount = selectedRecipes.length
    const prefix = selectedRecipeCount === visibleRecipeCount ? '' : `${visibleRecipeCount} of `
    return (
      <h2>
        Recipes (
        {prefix + selectedRecipeCount}
        )
      </h2>
    )
  }

  renderShowMoreRecipes() {
    const { pagedRecipeCount, visibleRecipeCount } = this.props
    if (visibleRecipeCount && visibleRecipeCount > pagedRecipeCount) {
      return (
        <button type="button" onClick={this.handleShowMoreRecipes}>Show more</button>
      )
    }
    return ''
  }

  render() {
    const {
      selectedRecipes,
      pagedRecipeCount,
    } = this.props
    const taggedRecipes = selectedRecipes.filter(
      RecipeListColumn.displayShown,
    )
    const sortedRecipes = sortRecipes(taggedRecipes)
    const viewableRecipes = sortedRecipes.splice(0, pagedRecipeCount)
    return (
      <div>
        {this.renderHeaderWithCount()}
        {viewableRecipes.map((r) => (
          <RecipeListItem
            key={r.id}
            recipe={r}
          />
        ))}
        {this.renderShowMoreRecipes()}
      </div>
    )
  }
}

RecipeListColumn.propTypes = {
  selectedRecipes: PropTypes.arrayOf(PropTypes.shape({})),
  visibleRecipeCount: PropTypes.number,
  pagedRecipeCount: PropTypes.number,
  showMoreRecipes: PropTypes.func.isRequired,
}

RecipeListColumn.defaultProps = {
  selectedRecipes: [],
  visibleRecipeCount: 0,
  pagedRecipeCount: 10,
}

export default RecipeListColumn
