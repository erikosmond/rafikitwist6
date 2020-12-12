import React from 'react'
import PropTypes from 'prop-types'
import TagFormSkeleton from 'containers/TagFormSkeletonContainer'
import Modal from '@material-ui/core/Modal'

function getModalStyle() {
  return {
    position: 'absolute',
    top: '20%',
    left: '30%',
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: 4,
    padding: 3,
    width: 400,
    height: 350,
  }
}

const TagFormModal = (props) => {
  const {
    handleTagFormModal,
    tagFormModalOpen,
  } = props

  if (!tagFormModalOpen) {
    return null
  }

  const handleClose = () => {
    handleTagFormModal({
      tagFormModalOpen: false,
    })
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
          <TagFormSkeleton
            handleTagFormModal={handleTagFormModal}
          />
        </div>
      </Modal>
    </div>
  )
}

TagFormModal.propTypes = {
  handleTagFormModal: PropTypes.func.isRequired,
  tagFormModalOpen: PropTypes.bool,
}

TagFormModal.defaultProps = {
  tagFormModalOpen: false,
}

export default TagFormModal
