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
    if ( tagTypes === []) {
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

    if ( tagTypes === [] || !tagFormModalOpen ) {
      return null
    }

    // const recipeNameFromId = (recipeOptionsArr, id) => {
    //   for (let i = 0; i < recipeOptionsArr.length; i += 1) {
    //     if (recipeOptionsArr[i].value === id) {
    //       return recipeOptionsArr[i].label
    //     }
    //   }
    //   return ''
    // }
    //
    // const handleClose = () => {
    //   handleCommentModal({
    //     commentRecipeId,
    //     commentTagSelectionId,
    //     commentBody,
    //     commentModalOpen: false,
    //   })
    // }

    return (
      <div>
        <Modal
          aria-labelledby="recipe-comment"
          aria-describedby="simple-modal-description"
          open={tagFormModalOpen}
          onClose={handleClose}
        >
          <div style={getModalStyle()}>
            <h2 id="simple-modal-title">{`${recipeNameFromId(recipeOptions, commentRecipeId)}`}</h2>
            <TagForm
              handleCommentModal={handleCommentModal}
              allTags={allTags}
              tagTypes={tagTypes}
              submitRecipeComment={submitTagForm}
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
  submitTagForm: PropTypes.func.isRequired,
  tagFormModalOpen: PropTypes.bool,
}

TagFormModal.defaultProps = {
  tagFormModalOpen: false
}
