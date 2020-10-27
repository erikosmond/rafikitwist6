import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import SvgIcon from '@material-ui/core/SvgIcon'

class RecipeHeaderComment extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = () => {
    const { handleCommentModal, recipeId, recipeComment } = this.props
    handleCommentModal({
      commentRecipeId: recipeId,
      commentTagSelectionId: recipeComment.id,
      commentBody: recipeComment.body,
      commentModalOpen: true,
    })
  }

  render() {
    const {
      iconSvgPath,
      label,
    } = this.props

    return (
      <div>
        <IconButton
          aria-label={label}
          onClick={this.handleClick}
        >
          <SvgIcon>
            <path d={iconSvgPath} />
          </SvgIcon>
        </IconButton>
      </div>
    )
  }
}

RecipeHeaderComment.propTypes = {
  label: PropTypes.string.isRequired,
  iconSvgPath: PropTypes.string.isRequired,
  recipeId: PropTypes.number.isRequired,
  recipeComment: PropTypes.shape({ id: PropTypes.number, body: PropTypes.string }),
  handleCommentModal: PropTypes.func.isRequired,
}

RecipeHeaderComment.defaultProps = {
  recipeComment: {},
}

export default RecipeHeaderComment
