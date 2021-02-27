import React from 'react'
import PropTypes from 'prop-types'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import SearchIcon from '@material-ui/icons/Search'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import AccountMenu from 'containers/AccountMenuContainer'
import NavMenus from 'containers/NavMenusContainer'
import FilterByIngredients from 'containers/FilterByIngredientsContainer'
import styled from 'styled-components'

import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  root: {
    backgroundColor: 'lavender',
    marginLeft: '-20px',
  },
})

const FilterWrapper = styled.div`
  max-height: 501px;
  min-height: 450px;
`

class MobileNavDrawer extends React.Component {
  static updateDrawerState(newValue) {
    return {
      filters: newValue === 0,
      search: newValue === 1,
      similar: newValue === 2,
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      drawerState: -1,
    }
    this.setDrawerState = this.setDrawerState.bind(this)
    this.changeDrawerState = this.changeDrawerState.bind(this)
  }

  componentDidUpdate() {
    const { drawerValueFromStore } = this.props
    const { drawerState } = this.state
    if (drawerValueFromStore !== drawerState) {
      this.setDrawerState(drawerValueFromStore)
    }
  }

  setDrawerState(value) {
    this.setState({ drawerState: value })
  }

  changeDrawerState = () => (event, newValue) => {
    this.setDrawerState(newValue)
  }

  render() {
    const noop = () => { }

    const {
      classes,
      mobileDrawerState,
      updateMobileDrawerState,
    } = this.props
    const { drawerState } = this.state

    const handleDrawerState = (drawerValue) => (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return
      }
      this.setDrawerState(drawerValue)
      updateMobileDrawerState(MobileNavDrawer.updateDrawerState(drawerValue))
    }

    return (
      <>
        <SwipeableDrawer
          anchor="bottom"
          open={mobileDrawerState.filters}
          onClose={handleDrawerState(-1)}
          onOpen={noop}
        >
          <FilterWrapper>
            <FilterByIngredients />
          </FilterWrapper>
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="bottom"
          open={mobileDrawerState.search}
          onClose={handleDrawerState(-1)}
          onOpen={noop}
        >
          <FilterWrapper>
            <NavMenus mobile />
          </FilterWrapper>
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="bottom"
          open={mobileDrawerState.similar}
          onClose={handleDrawerState(-1)}
          onOpen={noop}
        >
          <FilterWrapper>
            <AccountMenu mobile />
          </FilterWrapper>
        </SwipeableDrawer>

        <BottomNavigation
          value={drawerState}
          onChange={this.changeDrawerState()}
          showLabels
          className={classes.root}
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
            label="Account"
            icon={<AccountCircleIcon />}
          />
        </BottomNavigation>
      </>
    )
  }
}

export default withStyles(styles)(MobileNavDrawer)

MobileNavDrawer.propTypes = {
  classes: PropTypes.shape().isRequired,
  mobileDrawerState: PropTypes.shape({
    filters: PropTypes.bool,
    search: PropTypes.bool,
    similar: PropTypes.bool,
  }),
  updateMobileDrawerState: PropTypes.func.isRequired,
  visibleFilterTags: PropTypes.shape({}),
  drawerValueFromStore: PropTypes.number,
}

MobileNavDrawer.defaultProps = {
  mobileDrawerState: {
    filters: false,
    search: false,
    similar: false,
  },
  visibleFilterTags: {},
  drawerValueFromStore: -1,
}
