import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MobileRecipeList from 'components/recipes/MobileRecipeList'

import {
  loadRecipes,
  clearFilters,
  resetPagedCount,
  updateMobileDrawerState,
} from 'bundles/recipes'

import {
  loadTagInfo,
} from 'bundles/tags'

export default withRouter(connect(
  (state) => ({
    selectedTag: state.tagsReducer.selectedTag,
    startingTagId: state.recipesReducer.startingTagId,
    visibleFilterTags: state.recipesReducer.visibleFilterTags,
    pagedRecipeCount: state.recipesReducer.pagedRecipeCount,
    mobileDrawerState: state.recipesReducer.mobileDrawerState,
  }),
  {
    loadRecipes,
    loadTagInfo,
    clearFilters,
    resetPagedCount,
    updateMobileDrawerState,
  },
)(MobileRecipeList))
