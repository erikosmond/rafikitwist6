import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeList from 'components/recipes/RecipeList'

import {
  clearErrors,
  loadRecipes,
  handleCommentModal,
  handleFilter,
  clearFilters,
  resetPagedCount,
  showMoreRecipes,
  updateRecipeTag,
} from 'bundles/recipes'

import {
  loadTagInfo,
  loadAllTags,
} from 'bundles/tags'

export default withRouter(connect(
  (state) => ({
    selectedRecipes: state.recipesReducer.selectedRecipes,
    recipesLoaded: state.recipesReducer.recipesLoaded,
    selectedTag: state.tagsReducer.selectedTag,
    noRecipes: state.recipesReducer.noRecipes,
    startingTagId: state.recipesReducer.startingTagId,
    loading: state.recipesReducer.loading,
    visibleFilterTags: state.recipesReducer.visibleFilterTags,
    visibleRecipeCount: state.recipesReducer.visibleRecipeCount,
    allTags: state.tagsReducer.allTags,
    tagGroups: state.tagsReducer.tagGroups,
    allTagTypes: state.tagsReducer.allTagTypes,
    tagsByType: state.tagsReducer.tagsByType,
    selectedFilters: state.recipesReducer.selectedFilters,
    pagedRecipeCount: state.recipesReducer.pagedRecipeCount,
  }),
  {
    clearErrors,
    loadRecipes,
    loadAllTags,
    loadTagInfo,
    handleFilter,
    clearFilters,
    resetPagedCount,
    updateRecipeTag,
    handleCommentModal,
    showMoreRecipes,
  },
)(RecipeList))
