import React from 'react'
import PropTypes from 'prop-types'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import SearchIcon from '@material-ui/icons/Search'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import AccountMenu from 'containers/AccountMenuContainer'
import RecipeHeader from 'containers/RecipeHeaderContainer'
import FilterByIngredients from 'containers/FilterByIngredientsContainer'
import styled from 'styled-components'


const FilterWrapper = styled.div`
  max-height: 500px;
`

class MobileNavDrawer extends React.Component {
  static updateDrawerState(newValue) {
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

  constructor(props) {
    super(props)
    this.state = {
      drawerState: -1,
    }
    this.setDrawerState = this.setDrawerState.bind(this)
  }

  setDrawerState(value) {
    this.setState({ drawerState: value })
  }

  render() {
    const noop = () => {
    }

    const {
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

    // TODO: I don't think I need to pass in any of these props - don't get them from parent
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
          <RecipeHeader mobile />
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="bottom"
          open={mobileDrawerState.similar}
          onClose={handleDrawerState(-1)}
          onOpen={noop}
        >
          <AccountMenu mobile />
        </SwipeableDrawer>

        <BottomNavigation
          value={drawerState}
          onChange={(event, newValue) => {
            this.setDrawerState(newValue)
          }}
          showLabels
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

export default MobileNavDrawer

MobileNavDrawer.propTypes = {
  mobileDrawerState: PropTypes.shape({
    filters: PropTypes.bool,
    search: PropTypes.bool,
    similar: PropTypes.bool,
  }),
  updateMobileDrawerState: PropTypes.func.isRequired,
  handleFilter: PropTypes.func.isRequired,
  tagGroups: PropTypes.shape({}).isRequired,
  allTags: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  allTagTypes: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  tagsByType: PropTypes.shape({}).isRequired,
  visibleFilterTags: PropTypes.shape({}),
  selectedFilters: PropTypes.arrayOf(PropTypes.number),
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

MobileNavDrawer.defaultProps = {
  mobileDrawerState: {
    filters: false,
    search: false,
    similar: false,
  },
  selectedFilters: [],
  visibleFilterTags: {},
}
