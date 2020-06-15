import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AccountMenu from './AccountMenu'
import HeaderDropdown from './HeaderDropdown'

const useStyles = makeStyles({
  searchMargin: {
    width: '90%',
    marginBottom: '50%',
  },
  searchWidth: {
    width: '90%',
  },
})

const RecipeHeader = (props) => {
  const {
    loadRecipeOptions,
    recipeOptions,
    loadIngredientOptions,
    ingredientOptions,
    categoryOptions,
    history,
    firstName,
    mobile,
  } = props

  const classes = useStyles()

  const updateTags = (selectedOption) => {
    history.push(`/tags/${selectedOption}/recipes`)
  }

  const updateRecipes = (selectedOption) => {
    history.push(`/recipes/${selectedOption}`)
  }

  return (
    <div>
      <HeaderDropdown
        dropdownOptions={recipeOptions}
        loadOptions={loadRecipeOptions}
        placeholder="Recipes"
        updateHistory={updateRecipes}
        className={mobile ? classes.searchWidth : ''}
      />
      <HeaderDropdown
        dropdownOptions={ingredientOptions}
        loadOptions={loadIngredientOptions}
        placeholder="Ingredients"
        updateHistory={updateTags}
        className={mobile ? classes.searchWidth : ''}
      />
      <HeaderDropdown
        dropdownOptions={categoryOptions}
        loadOptions={loadIngredientOptions}
        placeholder="More"
        updateHistory={updateTags}
        className={mobile ? classes.searchMargin : ''}
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
  mobile: PropTypes.bool,
}

RecipeHeader.defaultProps = {
  recipeOptions: [],
  ingredientOptions: [],
  categoryOptions: [],
  firstName: '',
  mobile: false,
}
