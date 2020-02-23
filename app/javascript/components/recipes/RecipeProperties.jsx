import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import IngredientListItem from 'components/recipes/IngredientListItem'

const RecipeProperties = (props) => {
  const { title, tags } = props
  return (
    <div>
      {tags && tags.length > 0 &&
        <div>
          <Typography paragraph variant="body2">
            {title}
          </Typography>
          <ul>
            {Object.values(tags).map(ingredient => (
              <IngredientListItem key={ingredient.tagId} ingredient={ingredient} />
              ))}
          </ul>
        </div>
      }
    </div>
  )
}

RecipeProperties.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape()),
}

export default RecipeProperties
