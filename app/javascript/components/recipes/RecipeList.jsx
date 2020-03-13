import React from 'react'
import PropTypes from 'prop-types'
import FilterByIngredients from 'components/filters/FilterByIngredients'
import FilterChips from 'components/filters/FilterChips'
import RecipeListItem from 'components/recipes/RecipeListItem'
import RelatedTags from 'components/recipes/RelatedTags'
import PaperContent from '../styled/PaperContent'
import PaperSidebar from '../styled/PaperSidebar'

class RecipeList extends React.Component {
  static displayShown(recipe) {
    if (recipe.hidden !== true) {
      return recipe
    }
    return {}
  }

  constructor(props) {
    super(props)
    this.noRecipes = false
    this.handleShowMoreRecipes = this.handleShowMoreRecipes.bind(this)
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
      recipesLoaded,
      selectedRecipes,
      selectedTag,
      noRecipes,
      loading,
      visibleFilterTags,
      allTags,
      tagGroups,
      handleCommentModal,
      pagedRecipeCount,
      handleFilter,
      allTagTypes,
      tagsByType,
      ratings,
      priorities,
      updateRecipeTag,
      selectedFilters,
    } = this.props
    if (loading) {
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
        <h1>{selectedTag.name}</h1>
        {selectedTag.description && selectedTag.description.length > 0 && (
          <div>
            {selectedTag.description}
            <br />
            <br />
          </div>
        )}

        <FilterChips
          allTags={allTags}
          selectedFilters={selectedFilters}
          handleFilter={handleFilter}
          selectedTag={selectedTag}
        />

        <FilterByIngredients
          visibleTags={visibleFilterTags}
          allTags={allTags}
          tagGroups={tagGroups}
          selectedFilters={selectedFilters}
          handleFilter={handleFilter}
          allTagTypes={allTagTypes}
          tagsByType={tagsByType}
        />

        <PaperContent>
          {this.renderHeaderWithCount()}
          {selectedRecipes.filter(RecipeList.displayShown).splice(0, pagedRecipeCount).map((r) => (
            <RecipeListItem
              key={r.id}
              recipe={r}
              ratings={ratings}
              priorities={priorities}
              updateRecipeTag={updateRecipeTag}
              handleCommentModal={handleCommentModal}
            />
          ))}
          {this.renderShowMoreRecipes()}
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
  handleCommentModal: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  resetPagedCount: PropTypes.func.isRequired,
  updateRecipeTag: PropTypes.func.isRequired,
  selectedRecipes: PropTypes.arrayOf(PropTypes.shape({})),
  recipesLoaded: PropTypes.bool,
  loading: PropTypes.bool,
  tagGroups: PropTypes.shape({}).isRequired,
  allTags: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  allTagTypes: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  tagsByType: PropTypes.shape({}).isRequired,
  visibleFilterTags: PropTypes.shape({}),
  selectedFilters: PropTypes.arrayOf(PropTypes.number),
  visibleRecipeCount: PropTypes.number,
  pagedRecipeCount: PropTypes.number,
  showMoreRecipes: PropTypes.func.isRequired,
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
  }).isRequired,
}

RecipeList.defaultProps = {
  recipesLoaded: false,
  loading: true,
  noRecipes: true,
  selectedFilters: [],
  selectedRecipes: [],
  visibleFilterTags: {},
  visibleRecipeCount: 0,
  pagedRecipeCount: 10,
}

export default RecipeList
