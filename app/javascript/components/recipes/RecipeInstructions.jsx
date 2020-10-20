import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

// TODO: no update required
const RecipeInstructions = (props) => {
  const { recipe } = props

  return (
    <div>
      <Typography paragraph variant="body2">
        Instructions:
      </Typography>
      <Typography paragraph>
        {recipe.instructions}
      </Typography>
    </div>
  )
}

RecipeInstructions.propTypes = {
  recipe: PropTypes.shape({
    instructions: PropTypes.string.isRequired,
  }).isRequired,
}

export default RecipeInstructions
