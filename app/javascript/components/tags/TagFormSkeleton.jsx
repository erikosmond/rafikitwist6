import React from 'react'
import PropTypes from 'prop-types'
import TagForm from 'components/tags/TagForm'

export default class TagFormSkeleton extends React.Component {
  componentDidMount() {
    const {
      edit,
      loadEditTagForm,
      loadTagOptions,
      match,
      loadTagTypes,
      tagTypes,
    } = this.props
    loadTagOptions()
    if (tagTypes.length === 0) {
      loadTagTypes()
    }
    if (edit) {
      const { tagId } = match.params
      loadEditTagForm(tagId)
    }
  }

  render() {
    const {
      formData,
      submitTagForm,
      tagTypes,
      tagOptions,
    } = this.props

    if (tagTypes.length === 0 || Object.keys(tagOptions).length === 0) {
      return null
    }

    const submit = (values) => {
      // send the values to the store
      submitTagForm(values)
    }

    return (
      <div>
        <TagForm
          tagOptions={tagOptions}
          tagTypes={tagTypes}
          initialValues={formData}
          onSubmit={submit}
        />
      </div>
    )
  }
}

TagFormSkeleton.propTypes = {
  edit: PropTypes.bool,
  formData: PropTypes.shape({}),
  loadEditTagForm: PropTypes.func.isRequired,
  loadTagOptions: PropTypes.func.isRequired,
  loadTagTypes: PropTypes.func.isRequired,
  submitTagForm: PropTypes.func.isRequired,
  tagTypes: PropTypes.arrayOf(PropTypes.shape({})),
  tagOptions: PropTypes.shape({}),
  match: PropTypes.shape({
    params: PropTypes.shape({
      tagId: PropTypes.string,
    }),
  }),
}

TagFormSkeleton.defaultProps = {
  edit: false,
  formData: {},
  tagTypes: [],
  tagOptions: {},
  match: { params: { tagId: null } },
}
