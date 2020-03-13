import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

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
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    instructions: PropTypes.string.isRequired,
    ingredients: PropTypes.shape({}).isRequired,
  }).isRequired,
}

export default RecipeInstructions
