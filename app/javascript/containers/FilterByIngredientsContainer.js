import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import FilterByIngredients from 'components/filters/FilterByIngredients'

export default withRouter(connect(
  (state) => ({
    visibleTags: state.recipesReducer.visibleFilterTags,
    allTags: state.tagsReducer.allTags,
    allTagTypes: state.tagsReducer.allTagTypes,
    tagGroups: state.tagsReducer.tagGroups,
    tagsByType: state.tagsReducer.tagsByType,
  }),
  {},
)(FilterByIngredients))
