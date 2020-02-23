import React from 'react';
import PropTypes from 'prop-types'

class CommentForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: props.commentBody
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      const { handleCommentModal, submitRecipeComment, commentRecipeId, commentTagSelectionId } = this.props
      handleCommentModal(
        {commentModalOpen: false}
      )
      submitRecipeComment(this.state.value, commentRecipeId, commentTagSelectionId)
      event.preventDefault();
    }
  
    render() {
      const placeholder = 'What did you think of this recipe?'
      return (
        <form onSubmit={this.handleSubmit}>
          <textarea 
            value={this.state.value || ''}
            placeholder={placeholder}
            onChange={this.handleChange} 
          />
          <br />
          <input type="submit" value="Submit" />
        </form>
      );
    }
}
CommentForm.propTypes = {
    commentRecipeId: PropTypes.number,
    commentTagSelectionId: PropTypes.number,
    commentBody: PropTypes.string,
    recipeOptions: PropTypes.arrayOf(PropTypes.shape({})),
    handleCommentModal: PropTypes.func.isRequired,
    submitRecipeComment: PropTypes.func.isRequired,
}

CommentForm.defaultProps = {
    commentModalOpen: false,
    commentRecipeId: null,
    commentTagSelectionId: null,
    commentBody: '',
    recipeOptions: [],
}

export default CommentForm