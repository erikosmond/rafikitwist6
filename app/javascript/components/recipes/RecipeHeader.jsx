import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AccountMenu from 'containers/AccountMenuContainer'
import RelatedTags from 'components/recipes/RelatedTags'

import HeaderDropdown from './HeaderDropdown'

const useStyles = makeStyles({
  searchMargin: {
    width: '90%',
  },
  searchWidth: {
    width: '90%',
  },
  searchWrapper: {
    maxHeight: '500px',
  },
})

// TODO: Should probably be renamed to something like NavMenus

const RecipeHeader = (props) => {
  const {
    loadRecipeOptions,
    recipeOptions,
    loadIngredientOptions,
    ingredientOptions,
    categoryOptions,
    history,
    mobile,
    selectedTag,
  } = props

  const classes = useStyles()

  const updateTags = (selectedOption) => {
    history.push(`/tags/${selectedOption}/recipes`)
  }

  const updateRecipes = (selectedOption) => {
    history.push(`/recipes/${selectedOption}`)
  }

  const renderAccount = () => {
    if (mobile) {
      return null
    }
    return (
      <AccountMenu />
    )
  }
  const renderRelatedTags = () => {
    if (mobile) {
      return (
        <div>
          <h3>Related</h3>
          <RelatedTags tags={selectedTag.grandparentTags} />
          <RelatedTags tags={selectedTag.parentTags} />
          <RelatedTags tags={selectedTag.childTags} />
          <RelatedTags tags={selectedTag.grandchildTags} />
          <RelatedTags tags={selectedTag.sisterTags} />
          <RelatedTags tags={selectedTag.modificationTags} />
          <RelatedTags tags={selectedTag.modifiedTags} />
        </div>
      )
    }
    return null
  }

  return (
    <div className={classes.searchWrapper}>
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
      {renderRelatedTags()}
      {renderAccount()}
    </div>
  )
}

export default RecipeHeader

RecipeHeader.propTypes = {
  loadRecipeOptions: PropTypes.func.isRequired,
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
  selectedTag: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    grandparentTags: PropTypes.shape({}),
    parentTags: PropTypes.shape({}),
    childTags: PropTypes.shape({}),
    grandchildTags: PropTypes.shape({}),
    sisterTags: PropTypes.shape({}),
    modificationTags: PropTypes.shape({}),
    modifiedTags: PropTypes.shape({}),
  }).isRequired,
}

RecipeHeader.defaultProps = {
  recipeOptions: [],
  ingredientOptions: [],
  categoryOptions: [],
  mobile: false,
}
