import React from 'react'
import PropTypes from 'prop-types'
import RecipeListColumn from 'containers/RecipeListColumnContainer'
import RelatedTags from 'components/recipes/RelatedTags'
import FilterByIngredients from 'containers/FilterByIngredientsContainer'
import FilterChips from 'containers/FilterChipsContainer'
import { Link } from 'react-router-dom'
import PaperContent from '../styled/PaperContent'
import PaperSidebar from '../styled/PaperSidebar'

// TODO: add og meta tags to this page
class RecipeList extends React.Component {
  constructor(props) {
    super(props)
    this.noRecipes = false
  }

  componentDidUpdate(lastProps) {
    const {
      loadRecipes, loadTagInfo, location, match,
    } = this.props
    if (lastProps.location !== location) {
      lastProps.clearFilters()
      lastProps.resetPagedCount()
      const { tagId } = match.params
      if (tagId) {
        loadRecipes(tagId)
        loadTagInfo(tagId)
      }
    }
  }

  componentWillUnmount() {
    const { clearFilters, resetPagedCount } = this.props
    clearFilters()
    resetPagedCount()
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

  render() {
    const {
      recipesLoaded,
      selectedTag,
      noRecipes,
      loading,
    } = this.props
    if (loading || !selectedTag) {
      return (
        <div>
          Loading...
        </div>
      )
    } if (this.noRecipes || noRecipes) {
      return (
        <div>
          We do not have any recipes like that.
        </div>
      )
    } if (!recipesLoaded) {
      return null
    }
    return (
      <div>
        <h4>{selectedTag.name}</h4>
        {selectedTag.description && selectedTag.description.length > 0 && (
          <div>
            {selectedTag.description}
            <br />
          </div>
        )}
        {selectedTag.recipeId && selectedTag.recipeId > 0 && (
          <div>
            <Link to={`/recipes/${selectedTag.recipeId}`}>
              See recipe...
            </Link>
            <br />
          </div>
        )}
        {(selectedTag.recipeId || selectedTag.description) && (
          <br />
        )}
        <FilterChips />
        <PaperSidebar>
          <FilterByIngredients />
        </PaperSidebar>
        <PaperContent>
          <RecipeListColumn />
        </PaperContent>

        <PaperSidebar>
          <h2> Related </h2>
          <RelatedTags tags={selectedTag.grandparentTags} />
          <RelatedTags tags={selectedTag.parentTags} />
          <RelatedTags tags={selectedTag.childTags} />
          <RelatedTags tags={selectedTag.grandchildTags} />
          <RelatedTags tags={selectedTag.sisterTags} />
          <RelatedTags tags={selectedTag.modificationTags} />
          <RelatedTags tags={selectedTag.modifiedTags} />
        </PaperSidebar>
      </div>
    )
  }
}

RecipeList.propTypes = {
  loadRecipes: PropTypes.func.isRequired,
  loadTagInfo: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  resetPagedCount: PropTypes.func.isRequired,
  selectedRecipes: PropTypes.arrayOf(PropTypes.shape({})),
  recipesLoaded: PropTypes.bool,
  loading: PropTypes.bool,
  visibleRecipeCount: PropTypes.number,
  noRecipes: PropTypes.bool,
  priorities: PropTypes.shape({}).isRequired,
  ratings: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      tagId: PropTypes.string,
    }),
  }).isRequired,
  selectedTag: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    grandparentTags: PropTypes.shape({}),
    parentTags: PropTypes.shape({}),
    childTags: PropTypes.shape({}),
    grandchildTags: PropTypes.shape({}),
    sisterTags: PropTypes.shape({}),
    modificationTags: PropTypes.shape({}),
    modifiedTags: PropTypes.shape({}),
    recipeId: PropTypes.number,
  }).isRequired,
}

RecipeList.defaultProps = {
  recipesLoaded: false,
  loading: true,
  noRecipes: true,
  selectedRecipes: [],
  visibleFilterTags: {},
  visibleRecipeCount: 0,
}

export default RecipeList
