import React from 'react'
import PropTypes from 'prop-types'
import RecipeHeaderActions from 'containers/RecipeHeaderActionsContainer'
import RecipeProperties from 'components/recipes/RecipeProperties'
import RecipeInstructions from 'components/recipes/RecipeInstructions'
import RecipeDescription from 'components/recipes/RecipeDescription'
import NavMenus from 'containers/NavMenusContainer'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import SearchIcon from '@material-ui/icons/Search'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import styled from 'styled-components'
import { allIngredients } from 'services/recipes'

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0px;
  z-index: 1;
  padding-bottom: 5px;
  background-color: white;
`
const Footer = styled.div`
  width: 100%;
  position: sticky;
  bottom: 0px;
  z-index: 1;
`
const Body = styled.div`
  margin-bottom: 70px;
`

class Recipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drawerState: false,
    }
    this.setDrawerState = this.setDrawerState.bind(this)
  }

  componentWillUnmount() {
    const { clearRecipe } = this.props
    clearRecipe()
  }

  setDrawerState(value) {
    this.setState({ drawerState: value })
  }

  static renderHeader(mobile, recipe) {
    if (mobile) {
      return (
        <Header><h2>{recipe.name}</h2></Header>
      )
    }
    return (
      <h2>{recipe.name}</h2>
    )
  }

  static renderActions(recipe) {
    return (
      <RecipeHeaderActions
        rating={recipe.newRating || (recipe.ratings && recipe.ratings[0])}
        priority={recipe.newPriority || (recipe.priorities && recipe.priorities[0])}
        recipeId={recipe.id}
        recipeComment={recipe.newComment || (recipe.comments && recipe.comments[0]) || {}}
        fullRecipe
      />
    )
  }

  renderFooter(mobile) {
    if (!mobile) {
      return null
    }
    const { drawerState } = this.state
    const noop = () => {
    }
    const handleDrawerState = (drawerValue) => (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return
      }
      this.setState({ drawerState: drawerValue })
    }
    return (
      <Footer>
        <SwipeableDrawer
          anchor="bottom"
          open={drawerState}
          onClose={handleDrawerState(false)}
          onOpen={noop}
        >
          <NavMenus mobile />
        </SwipeableDrawer>
        <BottomNavigation
          value={drawerState}
          onChange={(event, newValue) => {
            this.setDrawerState(newValue)
          }}
          showLabels
        >
          <BottomNavigationAction
            onClick={handleDrawerState(true)}
            label="Search"
            icon={<SearchIcon />}
          />
        </BottomNavigation>
      </Footer>
    )
  }

  render() {
    const { recipe, noRecipe, mobile } = this.props
    if (noRecipe) {
      return (
        <div>
          We do not have a recipe like that
        </div>
      )
    }
    return (
      <div>
        {Recipe.renderHeader(mobile, recipe)}
        {Recipe.renderActions(recipe)}
        <Body>
          <RecipeProperties title="Ingredients" tags={allIngredients(recipe)} />
          <RecipeInstructions recipe={recipe} />
          <RecipeDescription recipe={recipe} />
          <RecipeProperties title="Sources" tags={recipe.sources} />
          <RecipeProperties title="Menus" tags={recipe.menus} />
          <RecipeProperties title="Preparations" tags={recipe.preparations} />
          <RecipeProperties title="Priorities" tags={recipe.priorities} />
          <RecipeProperties title="Ratings" tags={recipe.ratings} />
          <RecipeProperties title="Vessels" tags={recipe.vessels} />
          <RecipeProperties title="Flavors" tags={recipe.flavors} />
          <RecipeProperties title="Recipe Types" tags={recipe.recipeTypes} />
          <RecipeProperties title="Components" tags={recipe.components} />
        </Body>
        {this.renderFooter(mobile)}
      </div>
    )
  }
}

Recipe.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    ingredients: PropTypes.shape({}),
    ratings: PropTypes.arrayOf(PropTypes.shape({})),
    sources: PropTypes.arrayOf(PropTypes.shape({})),
    menus: PropTypes.arrayOf(PropTypes.shape({})),
    preparations: PropTypes.arrayOf(PropTypes.shape({})),
    priorities: PropTypes.arrayOf(PropTypes.shape({})),
    vessels: PropTypes.arrayOf(PropTypes.shape({})),
    flavors: PropTypes.arrayOf(PropTypes.shape({})),
    recipeTypes: PropTypes.arrayOf(PropTypes.shape({})),
    components: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  mobile: PropTypes.bool,
  noRecipe: PropTypes.bool,
  clearRecipe: PropTypes.func.isRequired,
}

Recipe.defaultProps = {
  recipe: {
    ratings: [],
    priorities: [],
    ingredients: [],
    sources: [],
    menus: [],
    preparations: [],
    vessels: [],
    flavors: [],
    recipeTypes: [],
    components: [],
  },
  noRecipe: false,
  mobile: false,
}

export default Recipe
