import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import RecipeHeaderAction from 'components/recipes/RecipeHeaderAction'
import RecipeHeaderComment from 'components/recipes/RecipeHeaderComment'

const styles = () => ({
  actions: {
    display: 'inline-flex',
  },
})

const starIcon = `M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2
                  9.19 8.63 2 9.24l5.46 4.73L5.82 21z`

const playlistAddIcon = `M14 10H2v2h12v-2zm0-4H2v2h12V6zm4
                         8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z`

const commentIcon = `M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9
                     2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z`

const renderStyles = (props) => {
  const { classes, fullRecipe } = props
  const cName = fullRecipe ? classes.actions : ''
  return renderBody(props, cName)
}

const renderBody = (props, cName) => {
  const {
    ratings,
    priorities,
    rating,
    priority,
    recipeId,
    recipeComment,
    updateRecipeTag,
    handleCommentModal,
  } = props
  return (
    <div className={cName}>
      <RecipeHeaderComment
        label="Comment"
        iconSvgPath={commentIcon}
        options={ratings}
        selectedOption={rating}
        recipeId={recipeId}
        recipeComment={recipeComment}
        updateRecipeTag={updateRecipeTag}
        handleCommentModal={handleCommentModal}
      />
      <RecipeHeaderAction
        label="Rating"
        iconSvgPath={starIcon}
        options={ratings}
        selectedOption={rating}
        recipeId={recipeId}
        updateRecipeTag={updateRecipeTag}
      />
      <RecipeHeaderAction
        label="Priority"
        iconSvgPath={playlistAddIcon}
        options={priorities}
        selectedOption={priority}
        recipeId={recipeId}
        updateRecipeTag={updateRecipeTag}
      />
    </div>
  )
}

const RecipeHeaderActions = (props) => {
  const { authenticated } = props
  if (!authenticated) {
    return null
  }
  return (
    renderStyles(props)
  )
}

RecipeHeaderActions.propTypes = {
  authenticated: PropTypes.bool.isRequired,
}

renderBody.propTypes = {
  classes: PropTypes.shape({
    actions: PropTypes.string.isRequired,
  }).isRequired,
  ratings: PropTypes.shape({}).isRequired,
  priorities: PropTypes.shape({}).isRequired,
  rating: PropTypes.shape({
    tagId: PropTypes.number,
  }),
  priority: PropTypes.shape({
    tagId: PropTypes.number,
  }),
  recipeId: PropTypes.number.isRequired,
  recipeComment: PropTypes.shape({}),
  updateRecipeTag: PropTypes.func.isRequired,
  handleCommentModal: PropTypes.func.isRequired,
}

renderBody.defaultProps = {
  rating: undefined,
  priority: undefined,
  recipeComment: {},
}

renderStyles.propTypes = {
  fullRecipe: PropTypes.bool,
  classes: PropTypes.shape({
    actions: PropTypes.string.isRequired,
  }).isRequired,
}

renderStyles.defaultProps = {
  fullRecipe: false,
}

export default withStyles(styles)(RecipeHeaderActions)
