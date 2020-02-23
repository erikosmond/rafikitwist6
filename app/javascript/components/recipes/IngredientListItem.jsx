import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const IngredientListItem = ({ ingredient }) => {
  const {
    value,
    modificationName,
    tagName,
    tagId,
  } = ingredient
  const amount = value || ''
  const presentModificationName = (modificationName === null) ? '' : modificationName
  const ingredientDetails = (modificationName === 'Juice of') ?
    `${amount} ${tagName} Juice` :
    `${amount} ${presentModificationName} ${tagName}`
  return (
    <li>
      <Link to={`/tags/${tagId}/recipes`}> {ingredientDetails} </Link>
    </li>
  )
}

IngredientListItem.propTypes = {
  ingredient: PropTypes.shape({
    value: PropTypes.string,
    modificationName: PropTypes.string,
    tagName: PropTypes.string.isRequired,
    tagId: PropTypes.number.isRequired,
  }).isRequired,
}

export default IngredientListItem
