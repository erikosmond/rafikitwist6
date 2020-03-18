import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

const RecipeDescription = (props) => {
  const { recipe } = props

  if (recipe.description && recipe.description.length > 0) {
    return (
      <div>
        <Typography paragraph variant="body2">
          Description:
        </Typography>
        <Typography paragraph>
          {recipe.description}
        </Typography>
      </div>
    )
  }
  return null
}

RecipeDescription.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    ingredients: PropTypes.shape({}).isRequired,
    description: PropTypes.string,
  }).isRequired,
}

export default RecipeDescription
