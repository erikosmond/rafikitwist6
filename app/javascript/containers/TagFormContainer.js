import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import TagFormModal from 'components/tags/TagFormModal'

import {
  handleTagFormModal,
  handleTagSubmit,
  loadTagTypes,
  submitTagForm,
} from 'bundles/recipes'

export default withRouter(connect(
  (state) => ({
    // use all tags and tags by type to populate the parent tag dropdown
    // stay on the add form tag modal so i can add parent tags
    // - and add parent tags to the dropdown when they are added in the modal
    tagFormModalOpen: state.recipesReducer.tagFormModalOpen,
    tagTypes: state.recipesReducer.tagTypes,
    allTags: state.recipesReducer.allTags,
    tagsByType: state.recipesReducer.tagsByType,
  }),
  {
    handleTagFormModal,
    handleTagSubmit,
    loadTagTypes,
    submitTagForm,
  },
)(TagFormModal))
