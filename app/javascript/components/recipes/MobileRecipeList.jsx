import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import GroupIcon from '@material-ui/icons/Group'
import SearchIcon from '@material-ui/icons/Search'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import RecipeListColumn from 'components/recipes/RecipeListColumn'

const useStyles = makeStyles({
  mobileRecipeFooter: {
    gridColumnStart: 1,
    gridColumnEnd: 2,
    gridRowStart: 3,
    gridRowEnd: 4,
    alignSelf: 'center',
  },
  bottom: {
    width: '100%',
    position: 'fixed',
    bottom: 10,
  },
  header: {
    top: 5,
  },
  content: {
    maxHeight: '650px',
    height: '75%',
    overflow: 'scroll',
    position: 'absolute',
  },
})

function renderHeader() {
  const classes = useStyles()
  return (
    <h2 className={classes.header}>
      RafikiTwist
    </h2>
  )
}

function updateDrawerState(newValue) {
  switch (newValue) {
    case 0:
      return {
        filters: true,
        search: false,
        similar: false,
      }
    case 1:
      return {
        filters: false,
        search: true,
        similar: false,
      }
    case 2:
      return {
        filters: false,
        search: false,
        similar: true,
      }
    default:
      return {
        filters: false,
        search: false,
        similar: false,
      }
  }
}

function renderNavDrawer(drawerState, setMobileDrawerState) {
  const classes = useStyles()
  const [value, setValue] = React.useState(-1)

  const handleDrawerState = (drawerValue) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setValue(drawerValue)
    setMobileDrawerState(updateDrawerState(drawerValue))
  }

  const noop = () => {
  }

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={drawerState.filters}
        onClose={handleDrawerState(-1)}
        onOpen={noop}
      >
        <div className={classes.filters}> Filters! </div>
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="bottom"
        open={drawerState.search}
        onClose={handleDrawerState(-1)}
        onOpen={noop}
      >
        <div> Search! </div>
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="bottom"
        open={drawerState.similar}
        onClose={handleDrawerState(-1)}
        onOpen={noop}
      >
        <div> Similar! </div>
      </SwipeableDrawer>

      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
        showLabels
        className={classes.bottom}
      >
        <BottomNavigationAction
          onClick={handleDrawerState(0)}
          label="Filters"
          icon={<CheckBoxIcon />}
        />
        <BottomNavigationAction
          onClick={handleDrawerState(1)}
          label="Search"
          icon={<SearchIcon />}
        />
        <BottomNavigationAction
          onClick={handleDrawerState(2)}
          label="Similar"
          icon={<GroupIcon />}
        />
      </BottomNavigation>
    </>
  )
}

function renderRecipes({
  selectedRecipes,
  pagedRecipeCount,
  ratings,
  priorities,
  updateRecipeTag,
  handleCommentModal,
  showMoreRecipes,
  visibleRecipeCount,
}) {
  const classes = useStyles()
  return (
    <div className={classes.content}>
      <RecipeListColumn
        selectedRecipes={selectedRecipes}
        pagedRecipeCount={pagedRecipeCount}
        ratings={ratings}
        priorities={priorities}
        updateRecipeTag={updateRecipeTag}
        handleCommentModal={handleCommentModal}
        showMoreRecipes={showMoreRecipes}
        visibleRecipeCount={visibleRecipeCount}
      />
    </div>
  )
}

export default function MobileRecipeList(
  {
    mobileDrawerState,
    updateMobileDrawerState,
    selectedRecipes,
    pagedRecipeCount,
    ratings,
    priorities,
    updateRecipeTag,
    handleCommentModal,
    showMoreRecipes,
    visibleRecipeCount,
  },
) {
  return (
    <div>
      {renderHeader()}
      {renderRecipes({
        selectedRecipes,
        pagedRecipeCount,
        ratings,
        priorities,
        updateRecipeTag,
        handleCommentModal,
        showMoreRecipes,
        visibleRecipeCount,
      })}
      {renderNavDrawer(mobileDrawerState, updateMobileDrawerState)}
    </div>
  )
}

MobileRecipeList.propTypes = {
  mobileDrawerState: PropTypes.shape({
    filters: PropTypes.bool,
    search: PropTypes.bool,
    similar: PropTypes.bool,
  }),
  updateMobileDrawerState: PropTypes.func.isRequired,
  handleCommentModal: PropTypes.func.isRequired,
  updateRecipeTag: PropTypes.func.isRequired,
  selectedRecipes: PropTypes.arrayOf(PropTypes.shape({})),
  visibleRecipeCount: PropTypes.number,
  pagedRecipeCount: PropTypes.number,
  showMoreRecipes: PropTypes.func.isRequired,
  priorities: PropTypes.shape({}).isRequired,
  ratings: PropTypes.shape({}).isRequired,
}

renderRecipes.propTypes = {
  handleCommentModal: PropTypes.func.isRequired,
  updateRecipeTag: PropTypes.func.isRequired,
  selectedRecipes: PropTypes.arrayOf(PropTypes.shape({})),
  visibleRecipeCount: PropTypes.number,
  pagedRecipeCount: PropTypes.number,
  showMoreRecipes: PropTypes.func.isRequired,
  priorities: PropTypes.shape({}).isRequired,
  ratings: PropTypes.shape({}).isRequired,
}

MobileRecipeList.defaultProps = {
  mobileDrawerState: {
    filters: false,
    search: false,
    similar: false,
  },
  selectedRecipes: [],
  visibleRecipeCount: 0,
  pagedRecipeCount: 10,
}

renderRecipes.defaultProps = {
  selectedRecipes: [],
  visibleRecipeCount: 0,
  pagedRecipeCount: 10,
}
