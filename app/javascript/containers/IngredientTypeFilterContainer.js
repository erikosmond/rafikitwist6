import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { handleFilter } from 'bundles/recipes'
import IngredientTypeFilter from 'components/filters/IngredientTypeFilter'

export default withRouter(connect(
  (state) => ({
    selectedFilters: state.recipesReducer.selectedFilters,
    visibleTags: state.recipesReducer.visibleFilterTags,
    allTags: state.tagsReducer.allTags,
  }),
  { handleFilter },
)(IngredientTypeFilter))
