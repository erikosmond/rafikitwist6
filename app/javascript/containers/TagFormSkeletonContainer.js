import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import TagFormSkeleton from 'components/tags/TagFormSkeleton'

import {
  loadTagOptions,
  loadTagTypes,
  loadEditTagForm,
  submitTagForm,
} from 'bundles/tags'

export default withRouter(connect(
  (state) => ({
    formData: state.tagsReducer.tagFormData,
    savedTagId: state.tagsReducer.savedTagId,
    tagOptions: state.tagsReducer.tagOptions,
    tagTypes: state.tagsReducer.tagTypes,
  }),
  {
    loadEditTagForm,
    loadTagOptions,
    loadTagTypes,
    submitTagForm,
  },
)(TagFormSkeleton))
