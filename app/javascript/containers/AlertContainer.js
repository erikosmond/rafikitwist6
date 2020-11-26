import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import AlertBox from 'components/recipes/Alert'

export default withRouter(connect(
  (state) => ({
    recipeAlert: state.recipesReducer.alert,
    tagAlert: state.tagsReducer.alert,
  }),
  {},
)(AlertBox))
