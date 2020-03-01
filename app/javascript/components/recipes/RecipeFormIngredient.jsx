import React from 'react'
import PropTypes from 'prop-types'
import HeaderDropdown from './HeaderDropdown'

const RecipeFormIngredient = (props) => {
  const { ingredientOptions } = props

  const selectionChanged = (selectedOption) => {
    selectedOption
  }

  const recipesAreLoaded = () => {
    true
  }

  return (
      <HeaderDropdown
        dropdownOptions={ingredientOptions}
        loadOptions={recipesAreLoaded}
        placeholder="New Ingredient"
        updateHistory={selectionChanged}
      />
  )
}

RecipeFormIngredient.propTypes = {
  ingredientOptions: PropTypes.arrayOf(PropTypes.shape({name: PropTypes.string, id: PropTypes.number})),
}

export default RecipeFormIngredient
