import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import TagFormModal from 'components/tags/TagFormModal'

import {
  handleTagFormModal,
  loadTagTypes,
  submitTagForm,
} from 'bundles/tags'

export default withRouter(connect(
  (state) => ({
    tagFormModalOpen: state.tagsReducer.tagFormModalOpen,
    tagTypes: state.tagsReducer.tagTypes,
    tagOptions: state.tagsReducer.tagOptions,
  }),
  {
    handleTagFormModal,
    loadTagTypes,
    submitTagForm,
  },
)(TagFormModal))
