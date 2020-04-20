import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import TagFormModal from 'components/tags/TagFormModal'

import { handleTagFormModal, handleTagSubmit, loadTagTypes } from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    tagFormModalOpen: state.recipesReducer.tagFormModalOpen,
    tagTypes: state.recipesReducer.tagTypes,
    allTags: state.recipesReducer.allTags,
  }),
  {
    handleTagFormModal,
    handleTagSubmit,
    loadTagTypes,
  },
)(TagFormModal))
