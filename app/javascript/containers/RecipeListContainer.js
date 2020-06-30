import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import RecipeListSkeleton from 'components/recipes/RecipeListSkeleton'

import {
  loadRecipes,
  loadTagInfo,
  handleCommentModal,
  handleFilter,
  loadAllTags,
  clearFilters,
  resetPagedCount,
  updateRecipeTag,
  showMoreRecipes,
} from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    selectedRecipes: state.recipesReducer.selectedRecipes,
    recipesLoaded: state.recipesReducer.recipesLoaded,
    selectedTag: state.recipesReducer.selectedTag,
    noRecipes: state.recipesReducer.noRecipes,
    startingTagId: state.recipesReducer.startingTagId,
    loading: state.recipesReducer.loading,
    visibleFilterTags: state.recipesReducer.visibleFilterTags,
    visibleRecipeCount: state.recipesReducer.visibleRecipeCount,
    allTags: state.recipesReducer.allTags,
    tagGroups: state.recipesReducer.tagGroups,
    allTagTypes: state.recipesReducer.allTagTypes,
    tagsByType: state.recipesReducer.tagsByType,
    priorities: state.recipesReducer.priorities,
    ratings: state.recipesReducer.ratings,
    selectedFilters: state.recipesReducer.selectedFilters,
    pagedRecipeCount: state.recipesReducer.pagedRecipeCount,
    authenticated: state.recipesReducer.authenticated,
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
