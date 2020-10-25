import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeListSkeleton from 'components/recipes/RecipeListSkeleton'

import {
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
    priorities: state.recipesReducer.priorities,
    ratings: state.recipesReducer.ratings,
    selectedFilters: state.recipesReducer.selectedFilters,
    pagedRecipeCount: state.recipesReducer.pagedRecipeCount,
    // authenticated: state.recipesReducer.authenticated,
  }),
  {
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
)(RecipeListSkeleton))
