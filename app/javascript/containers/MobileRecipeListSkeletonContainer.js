import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MobileRecipeListSkeleton from 'components/recipes/MobileRecipeListSkeleton'

import {
  loadRecipes,
} from 'bundles/recipes'

import {
  loadTagInfo,
} from 'bundles/tags'

export default withRouter(connect(
  (state) => ({
    selectedRecipes: state.recipesReducer.selectedRecipes,
    selectedTag: state.tagsReducer.selectedTag,
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
    pagedRecipeCount: state.recipesReducer.pagedRecipeCount,
  }),
  {
    loadRecipes,
    loadTagInfo,
  },
)(MobileRecipeListSkeleton))
