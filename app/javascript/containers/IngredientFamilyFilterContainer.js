import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { handleFilter } from 'bundles/recipes'
import IngredientFamilyFilter from 'components/filters/IngredientFamilyFilter'

export default withRouter(connect(
  (state) => ({
    selectedFilters: state.recipesReducer.selectedFilters,
    visibleTags: state.recipesReducer.visibleFilterTags,
    allTags: state.tagsReducer.allTags,
  }),
  { handleFilter },
)(IngredientFamilyFilter))
