import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { handleFilter } from 'bundles/recipes'
import FilterChips from 'components/filters/FilterChips'

export default withRouter(connect(
  (state) => ({
    selectedFilters: state.recipesReducer.selectedFilters,
    allTags: state.tagsReducer.allTags,
    selectedTag: state.tagsReducer.selectedTag,
  }),
  { handleFilter },
)(FilterChips))
