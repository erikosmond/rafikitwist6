import React from 'react'
import PropTypes from 'prop-types'
import MobileNavDrawer from 'components/recipes/MobileNavDrawer'
import { makeStyles } from '@material-ui/core/styles'
import RecipeListColumn from 'components/recipes/RecipeListColumn'
import FilterChips from 'components/filters/FilterChips'

const useStyles = makeStyles({
  mobileRecipeFooter: {
    gridColumnStart: 1,
    gridColumnEnd: 2,
    gridRowStart: 3,
    gridRowEnd: 4,
    alignSelf: 'center',
  },
  bottom: {
    width: '100%',
    position: 'fixed',
    bottom: 10,
  },
  header: {
    top: 5,
    position: 'fixed',
    zIndex: '1',
  },
  content: {
    marginTop: '30px',
    maxHeight: '650px',
    height: '75%',
    overflow: 'scroll',
    position: 'absolute',
  },
  headerWrapper: {
    display: 'contents',
    backgroundColor: 'white',
    zIndex: 1,
  },
  searchMargin: {
    width: '90%',
    marginBottom: '50%',
  },
  searchWidth: {
    width: '90%',
  },
  relatedWrapper: {
    minHeight: '500px',
  },
})

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
    // TODO: useStyles seems to be breaking everything? see if i can use it in a class?
    const classes = {} // useStyles()
    return (
      <div className={classes.header}>
        <FilterChips
          allTags={allTags}
          selectedFilters={selectedFilters}
          handleFilter={handleFilter}
          selectedTag={selectedTag}
        />
      </div>
    )
  }

  static renderRecipes({
    selectedRecipes,
    pagedRecipeCount,
    ratings,
    priorities,
    updateRecipeTag,
    handleCommentModal,
    showMoreRecipes,
    visibleRecipeCount,
  }) {
    const classes = {} // useStyles()
    return (
      <div className={classes.content}>
        <RecipeListColumn
          selectedRecipes={selectedRecipes}
          pagedRecipeCount={pagedRecipeCount}
          ratings={ratings}
          priorities={priorities}
          updateRecipeTag={updateRecipeTag}
          handleCommentModal={handleCommentModal}
          showMoreRecipes={showMoreRecipes}
          visibleRecipeCount={visibleRecipeCount}
        />
      </div>
    )
  }

  // export default function MobileRecipeList(
  render() {
    const {
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
        {MobileRecipeList.renderHeader({
          allTags,
          selectedFilters,
          handleFilter,
          selectedTag,
        })}
        {MobileRecipeList.renderRecipes({
          selectedRecipes,
          pagedRecipeCount,
          ratings,
          priorities,
          updateRecipeTag,
          handleCommentModal,
          showMoreRecipes,
          visibleRecipeCount,
        })}
      </div>
    )
  }
}

MobileRecipeList.propTypes = {
  mobileDrawerState: PropTypes.shape({
    filters: PropTypes.bool,
    search: PropTypes.bool,
    similar: PropTypes.bool,
  }),
  updateMobileDrawerState: PropTypes.func.isRequired,
  // handleCommentModal: PropTypes.func.isRequired,
  // updateRecipeTag: PropTypes.func.isRequired,
  // selectedRecipes: PropTypes.arrayOf(PropTypes.shape({})),
  // visibleRecipeCount: PropTypes.number,
  // pagedRecipeCount: PropTypes.number,
  // showMoreRecipes: PropTypes.func.isRequired,
  // priorities: PropTypes.shape({}).isRequired,
  // ratings: PropTypes.shape({}).isRequired,
  // visibleFilterTags: PropTypes.shape({}),
  // allTags: PropTypes.shape({
  //   id: PropTypes.number,
  // }).isRequired,
  // allTagTypes: PropTypes.shape({
  //   id: PropTypes.number,
  // }).isRequired,
  // tagGroups: PropTypes.shape({}).isRequired,
  // selectedFilters: PropTypes.arrayOf(PropTypes.number),
  // handleFilter: PropTypes.func.isRequired,
  // tagsByType: PropTypes.shape({}).isRequired,
  // selectedTag: PropTypes.shape({
  //   name: PropTypes.string,
  //   description: PropTypes.string,
  //   grandparentTags: PropTypes.shape({}),
  //   parentTags: PropTypes.shape({}),
  //   childTags: PropTypes.shape({}),
  //   grandchildTags: PropTypes.shape({}),
  //   sisterTags: PropTypes.shape({}),
  //   modificationTags: PropTypes.shape({}),
  //   modifiedTags: PropTypes.shape({}),
  // }).isRequired,
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

// renderRecipes.propTypes = {
//   handleCommentModal: PropTypes.func.isRequired,
//   updateRecipeTag: PropTypes.func.isRequired,
//   selectedRecipes: PropTypes.arrayOf(PropTypes.shape({})),
//   visibleRecipeCount: PropTypes.number,
//   pagedRecipeCount: PropTypes.number,
//   showMoreRecipes: PropTypes.func.isRequired,
//   priorities: PropTypes.shape({}).isRequired,
//   ratings: PropTypes.shape({}).isRequired,
// }

// renderHeader.propTypes = {
//   allTags: PropTypes.shape({
//     id: PropTypes.number,
//   }).isRequired,
//   selectedFilters: PropTypes.arrayOf(PropTypes.number),
//   handleFilter: PropTypes.func.isRequired,
//   selectedTag: PropTypes.shape({
//     name: PropTypes.string,
//   }).isRequired,
// }

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

// renderRecipes.defaultProps = {
//   selectedRecipes: [],
//   visibleRecipeCount: 0,
//   pagedRecipeCount: 10,
// }

// renderHeader.defaultProps = {
//   selectedFilters: [],
// }

export default MobileRecipeList
