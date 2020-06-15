import React from 'react'
import PropTypes from 'prop-types'
import AccountMenu from './AccountMenu'
import HeaderDropdown from './HeaderDropdown'

const RecipeHeader = (props) => {
  const {
    loadRecipeOptions,
    recipeOptions,
    loadIngredientOptions,
    ingredientOptions,
    categoryOptions,
    history,
    firstName,
    styles,
  } = props

  const updateTags = (selectedOption) => {
    history.push(`/tags/${selectedOption}/recipes`)
  }

  const updateRecipes = (selectedOption) => {
    history.push(`/recipes/${selectedOption}`)
  }

  return (
    <div className={styles.headerWrapper}>
      <HeaderDropdown
        dropdownOptions={recipeOptions}
        loadOptions={loadRecipeOptions}
        placeholder="Recipes"
        updateHistory={updateRecipes}
        className={styles.searchWidth}
      />
      <HeaderDropdown
        dropdownOptions={ingredientOptions}
        loadOptions={loadIngredientOptions}
        placeholder="Ingredients"
        updateHistory={updateTags}
        className={styles.searchWidth}
      />
      <HeaderDropdown
        dropdownOptions={categoryOptions}
        loadOptions={loadIngredientOptions}
        placeholder="More"
        updateHistory={updateTags}
        className={styles.searchMargin}
      />
      <AccountMenu
        firstName={firstName}
      />
    </div>
  )
}

export default RecipeHeader

RecipeHeader.propTypes = {
  loadRecipeOptions: PropTypes.func.isRequired,
  firstName: PropTypes.string,
  recipeOptions: PropTypes.arrayOf(PropTypes.shape(
    { name: PropTypes.string, id: PropTypes.number },
  )),
  loadIngredientOptions: PropTypes.func.isRequired,
  ingredientOptions: PropTypes.arrayOf(PropTypes.shape(
    { name: PropTypes.string, id: PropTypes.number },
  )),
  categoryOptions: PropTypes.arrayOf(PropTypes.shape(
    { name: PropTypes.string, id: PropTypes.number },
  )),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  styles: PropTypes.shape({
    headerWrapper: PropTypes.string,
    searchMargin: PropTypes.string,
    searchWidth: PropTypes.string,
  }).isRequired,
}

RecipeHeader.defaultProps = {
  recipeOptions: [],
  ingredientOptions: [],
  categoryOptions: [],
  firstName: '',
}
