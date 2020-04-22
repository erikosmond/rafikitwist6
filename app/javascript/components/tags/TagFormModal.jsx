import React from 'react'
import PropTypes from 'prop-types'
import TagForm from 'components/tags/TagForm'
import Modal from '@material-ui/core/Modal'

function getModalStyle() {
  return {
    position: 'absolute',
    top: '20%',
    left: '30%',
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 5,
    padding: 3,
    width: 400,
  }
}

export default class TagFormModal extends React.Component {
  componentDidMount() {
    const { loadTagTypes, tagTypes } = this.props
    if (tagTypes === []) {
      loadTagTypes()
    }
  }

  render() {
    const {
      allTags,
      handleTagFormModal,
      submitTagForm,
      tagFormModalOpen,
      tagTypes,
    } = this.props

    if (tagTypes === [] || !tagFormModalOpen) {
      return null
    }

    const handleClose = () => {
      handleTagFormModal({
        tagFormModalOpen: false,
      })
    }

    const submit = (values) => {
      // send the values to the store
      submitTagForm(values)
    }

    return (
      <div>
        <Modal
          aria-labelledby="tag-form-modal"
          aria-describedby="simple-modal-form"
          open={tagFormModalOpen}
          onClose={handleClose}
        >
          <div style={getModalStyle()}>
            <TagForm
              handleTagFormModal={handleTagFormModal}
              allTags={allTags}
              tagTypes={tagTypes}
              onSubmit={submit}
            />
          </div>
        </Modal>
      </div>
    )
  }
}

TagFormModal.propTypes = {
  allTags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleTagFormModal: PropTypes.func.isRequired,
  loadTagTypes: PropTypes.func.isRequired,
  submitTagForm: PropTypes.func.isRequired,
  tagFormModalOpen: PropTypes.bool,
  tagTypes: PropTypes.arrayOf(PropTypes.shape({})),
}

TagFormModal.defaultProps = {
  tagFormModalOpen: false,
  tagTypes: [],
}
