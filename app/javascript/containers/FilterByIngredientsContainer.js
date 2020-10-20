import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import FilterByIngredients from 'components/filters/FilterByIngredients'

export default withRouter(connect(
  (state) => ({
    allTags: state.recipesReducer.allTags,
    tagGroups: state.recipesReducer.tagGroups,
    tagsByType: state.tagsReducer.tagsByType,
  }),
  {},
)(FilterByIngredients))
