import React from 'react'
import PropTypes from 'prop-types'

class CommentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.commentBody,
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(event) {
    const { value } = this.state
    const {
      handleCommentModal, submitRecipeComment, commentRecipeId, commentTagSelectionId,
    } = this.props
    handleCommentModal(
      { commentModalOpen: false },
    )
    submitRecipeComment(value, commentRecipeId, commentTagSelectionId)
    event.preventDefault()
  }

  render() {
    const placeholder = 'What did you think of this recipe?'
    const { value } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea
          value={value || ''}
          placeholder={placeholder}
          onChange={this.handleChange}
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}
CommentForm.propTypes = {
  commentRecipeId: PropTypes.number,
  commentTagSelectionId: PropTypes.number,
  commentBody: PropTypes.string,
  handleCommentModal: PropTypes.func.isRequired,
  submitRecipeComment: PropTypes.func.isRequired,
}

CommentForm.defaultProps = {
  commentRecipeId: null,
  commentTagSelectionId: null,
  commentBody: '',
}

export default CommentForm
