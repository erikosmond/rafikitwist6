import React from 'react'
import PropTypes from 'prop-types'
import CommentForm from 'components/recipes/CommentForm'
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
  }
}

export default function CommentModal(props) {
  const {
    commentModalOpen,
    commentRecipeId,
    commentTagSelectionId,
    commentBody,
    handleCommentModal,
    recipeOptions,
    submitRecipeComment,
  } = props

  const recipeNameFromId = (recipeOptionsArr, id) => {
    for (let i = 0; i < recipeOptionsArr.length; i += 1) {
      if (recipeOptionsArr[i].value === id) {
        return recipeOptionsArr[i].label
      }
    }
    return ''
  }

  const handleClose = () => {
    handleCommentModal({
      commentRecipeId,
      commentTagSelectionId,
      commentBody,
      commentModalOpen: false,
    })
  }

  return (
    <div>
      <Modal
        aria-labelledby="recipe-comment"
        aria-describedby="simple-modal-description"
        open={commentModalOpen}
        onClose={handleClose}
      >
        <div style={getModalStyle()}>
          <h2 id="simple-modal-title">{`${recipeNameFromId(recipeOptions, commentRecipeId)}`}</h2>
          <CommentForm
            handleCommentModal={handleCommentModal}
            commentRecipeId={commentRecipeId}
            commentTagSelectionId={commentTagSelectionId}
            commentBody={commentBody}
            submitRecipeComment={submitRecipeComment}
          />
        </div>
      </Modal>
    </div>
  )
}

CommentModal.propTypes = {
  commentModalOpen: PropTypes.bool,
  commentRecipeId: PropTypes.number,
  commentTagSelectionId: PropTypes.number,
  commentBody: PropTypes.string,
  recipeOptions: PropTypes.arrayOf(PropTypes.shape({})),
  handleCommentModal: PropTypes.func.isRequired,
  submitRecipeComment: PropTypes.func.isRequired,
}

CommentModal.defaultProps = {
  commentModalOpen: false,
  commentRecipeId: null,
  commentTagSelectionId: null,
  commentBody: '',
  recipeOptions: [],
}
