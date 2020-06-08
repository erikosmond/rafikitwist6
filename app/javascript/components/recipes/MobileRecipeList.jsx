import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import GroupIcon from '@material-ui/icons/Group'
import SearchIcon from '@material-ui/icons/Search'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'

const useStyles = makeStyles({
  bottom: {
    width: '100%',
    position: 'fixed',
    bottom: 10,
  },
  header: {
    top: 5,
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

export default function MobileRecipeList({ mobileDrawerState, updateMobileDrawerState }) {
  return (
    <div>
      {renderHeader()}
      {renderRecipes()}
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
}

MobileRecipeList.defaultProps = {
  mobileDrawerState: {
    filters: false,
    search: false,
    similar: false,
  },
}
