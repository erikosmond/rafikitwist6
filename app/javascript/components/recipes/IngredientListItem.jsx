import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// TODO: no update required
const IngredientListItem = ({ ingredient }) => {
  const {
    body,
    modificationName,
    tagName,
    tagId,
    value,
  } = ingredient
  const amount = value || ''
  const presentModificationName = (modificationName === null) ? '' : modificationName
  const instruction = body || ''
  const ingredientDetails = (modificationName === 'Juice of') ?
    `${amount} ${tagName} Juice` :
    `${amount} ${presentModificationName} ${tagName} ${instruction}`
  return (
    <li>
      <Link to={`/tags/${tagId}/recipes`}>
        {ingredientDetails}
      </Link>
    </li>
  )
}

IngredientListItem.propTypes = {
  ingredient: PropTypes.shape({
    body: PropTypes.string,
    value: PropTypes.string,
    modificationName: PropTypes.string,
    tagName: PropTypes.string.isRequired,
    tagId: PropTypes.number.isRequired,
  }).isRequired,
}

export default IngredientListItem
