import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import AccountMenu from 'components/recipes/AccountMenu'

export default withRouter(connect(
  (state) => ({
    firstName: state.recipesReducer.firstName,
    authenticated: state.recipesReducer.authenticated,
  }),
  {},
)(AccountMenu))
