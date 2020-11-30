import React from 'react'
import PropTypes from 'prop-types'
import TagForm from 'components/tags/TagForm'

export default class TagFormSkeleton extends React.Component {
  componentDidMount() {
    const {
      edit,
      loadEditTagForm,
      loadIngredientOptions,
      loadTagOptions,
      match,
      loadTagTypes,
      tagTypes,
    } = this.props
    loadIngredientOptions('Ingredients')
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
      submitTagForm,
      tagTypes,
      tagOptions,
    } = this.props
    debugger
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
          onSubmit={submit}
        />
      </div>
    )
  }
}

TagFormSkeleton.propTypes = {
  edit: PropTypes.bool,
  loadEditTagForm: PropTypes.func.isRequired,
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
  tagTypes: [],
  tagOptions: {},
  match: { params: { tagId: null } },
}
