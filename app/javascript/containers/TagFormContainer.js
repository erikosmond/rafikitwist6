import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import TagFormModal from 'components/tags/TagFormModal'

import {
  handleTagFormModal,
  loadTagTypes,
  submitTagForm,
} from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    tagFormModalOpen: state.recipesReducer.tagFormModalOpen,
    tagTypes: state.recipesReducer.tagTypes,
    tagOptions: state.recipesReducer.tagOptions,
  }),
  {
    handleTagFormModal,
    loadTagTypes,
    submitTagForm,
  },
)(TagFormModal))
