import React from 'react'
import PropTypes from 'prop-types'
import MobileNavDrawer from 'components/recipes/MobileNavDrawer'
import RecipeListColumn from 'components/recipes/RecipeListColumn'
import FilterChips from 'components/filters/FilterChips'
import styled from 'styled-components'

const Footer = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0px;
  z-index: 1;
`
const Header = styled.div`
  top: 0px;
  position: sticky;
  z-index: 1;
  height: 100%;
`

const Body = styled.div`
  margin-bottom: 65px;
  overflow: scroll; 
`

class MobileRecipeList extends React.Component {
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

  static renderHeader({
    allTags,
    selectedFilters,
    handleFilter,
    selectedTag,
  }) {
    return (
      <Header>
        <FilterChips
          allTags={allTags}
          selectedFilters={selectedFilters}
          handleFilter={handleFilter}
          selectedTag={selectedTag}
        />
      </Header>
    )
  }

  static renderRecipes({
    authenticated,
    selectedRecipes,
    pagedRecipeCount,
    ratings,
    priorities,
    updateRecipeTag,
    handleCommentModal,
    showMoreRecipes,
    visibleRecipeCount,
    selectedTag,
  }) {
    return (
      <div>
        {selectedTag.description && selectedTag.description.length > 0 && (
          <div>
            {selectedTag.description}
            <br />
            <br />
          </div>
        )}
        <Body>
          <RecipeListColumn
            selectedRecipes={selectedRecipes}
            pagedRecipeCount={pagedRecipeCount}
            ratings={ratings}
            priorities={priorities}
            updateRecipeTag={updateRecipeTag}
            handleCommentModal={handleCommentModal}
            showMoreRecipes={showMoreRecipes}
            visibleRecipeCount={visibleRecipeCount}
            authenticated={authenticated}
          />
        </Body>
      </div>
    )
  }

  render() {
    const {
      authenticated,
      mobileDrawerState,
      updateMobileDrawerState,
      selectedRecipes,
      pagedRecipeCount,
      ratings,
      priorities,
      updateRecipeTag,
      handleCommentModal,
      showMoreRecipes,
      visibleRecipeCount,
      visibleFilterTags,
      allTags,
      tagGroups,
      selectedFilters,
      handleFilter,
      allTagTypes,
      tagsByType,
      selectedTag,
    } = this.props
    return (
      <div>
        {MobileRecipeList.renderHeader({
          allTags,
          selectedFilters,
          handleFilter,
          selectedTag,
        })}
        {MobileRecipeList.renderRecipes({
          authenticated,
          selectedRecipes,
          pagedRecipeCount,
          ratings,
          priorities,
          updateRecipeTag,
          handleCommentModal,
          showMoreRecipes,
          visibleRecipeCount,
          selectedTag,
        })}
        <Footer>
          <MobileNavDrawer
            mobileDrawerState={mobileDrawerState}
            updateMobileDrawerState={updateMobileDrawerState}
            visibleFilterTags={visibleFilterTags}
            allTags={allTags}
            tagGroups={tagGroups}
            selectedFilters={selectedFilters}
            handleFilter={handleFilter}
            allTagTypes={allTagTypes}
            tagsByType={tagsByType}
            selectedTag={selectedTag}
          />
        </Footer>
      </div>
    )
  }
}

MobileRecipeList.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  mobileDrawerState: PropTypes.shape({
    filters: PropTypes.bool,
    search: PropTypes.bool,
    similar: PropTypes.bool,
  }),
  updateMobileDrawerState: PropTypes.func.isRequired,
  loadRecipes: PropTypes.func.isRequired,
  loadTagInfo: PropTypes.func.isRequired,
  handleCommentModal: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  resetPagedCount: PropTypes.func.isRequired,
  updateRecipeTag: PropTypes.func.isRequired,
  selectedRecipes: PropTypes.arrayOf(PropTypes.shape({})),
  // recipesLoaded: PropTypes.bool,
  // loading: PropTypes.bool,
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
  // noRecipes: PropTypes.bool,
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

MobileRecipeList.defaultProps = {
  mobileDrawerState: {
    filters: false,
    search: false,
    similar: false,
  },
  selectedRecipes: [],
  visibleRecipeCount: 0,
  pagedRecipeCount: 10,
  selectedFilters: [],
  visibleFilterTags: {},
}

export default MobileRecipeList
