import React from 'react'
import PropTypes from 'prop-types'
import FilterByIngredients from 'components/filters/FilterByIngredients'
import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import GroupIcon from '@material-ui/icons/Group'
import SearchIcon from '@material-ui/icons/Search'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import RelatedTags from 'components/recipes/RelatedTags'
import RecipeHeader from 'containers/RecipeHeaderContainer'

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
    position: 'fixed',
    zIndex: '1',
  },
  content: {
    marginTop: '30px',
    maxHeight: '650px',
    height: '75%',
    overflow: 'scroll',
    position: 'absolute',
  },
  headerWrapper: {
    display: 'contents',
    backgroundColor: 'white',
    zIndex: 1,
  },
  searchMargin: {
    width: '90%',
    marginBottom: '50%',
  },
  searchWidth: {
    width: '90%',
  },
  relatedWrapper: {
    minHeight: '500px',
  },
})

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

class MobileNavDrawer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      drawerState: -1,
    }
    this.setDrawerState = this.setDrawerState.bind(this)
    // this.handleDrawerState = this.handleDrawerState.bind(this)
  }

  setDrawerState(value) {
    this.setState({ drawerState: value })
  }

  // function renderNavDrawer(drawerState, setMobileDrawerState, {
  //   visibleFilterTags,
  //   allTags,
  //   tagGroups,
  //   selectedFilters,
  //   handleFilter,
  //   allTagTypes,
  //   tagsByType,
  //   selectedTag,
  // }) {
  render() {
    const classes = {} // useStyles()
    // TODO: update this to class component
    // const [value, setValue] = React.useState(-1)

    const noop = () => {
    }

    const {
      mobileDrawerState,
      updateMobileDrawerState,
      visibleFilterTags,
      allTags,
      tagGroups,
      selectedFilters,
      handleFilter,
      allTagTypes,
      tagsByType,
      selectedTag,
    } = this.props
    const { drawerState } = this.state

    const handleDrawerState = (drawerValue) => (event) => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return
      }
      this.setDrawerState(drawerValue)
      // setValue(drawerValue)
      updateMobileDrawerState(updateDrawerState(drawerValue))
    }


    return (
      <>
        <SwipeableDrawer
          anchor="bottom"
          open={mobileDrawerState.filters}
          onClose={handleDrawerState(-1)}
          onOpen={noop}
        >
          <div className={classes.filters}>
            <FilterByIngredients
              visibleTags={visibleFilterTags}
              allTags={allTags}
              tagGroups={tagGroups}
              selectedFilters={selectedFilters}
              handleFilter={handleFilter}
              allTagTypes={allTagTypes}
              tagsByType={tagsByType}
            />
          </div>
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="bottom"
          open={mobileDrawerState.search}
          onClose={handleDrawerState(-1)}
          onOpen={noop}
        >
          <RecipeHeader styles={classes} />
        </SwipeableDrawer>

        <SwipeableDrawer
          anchor="bottom"
          open={mobileDrawerState.similar}
          onClose={handleDrawerState(-1)}
          onOpen={noop}
        >
          <div className={classes.relatedWrapper}>
            <RelatedTags tags={selectedTag.grandparentTags} />
            <RelatedTags tags={selectedTag.parentTags} />
            <RelatedTags tags={selectedTag.childTags} />
            <RelatedTags tags={selectedTag.grandchildTags} />
            <RelatedTags tags={selectedTag.sisterTags} />
            <RelatedTags tags={selectedTag.modificationTags} />
            <RelatedTags tags={selectedTag.modifiedTags} />
          </div>
        </SwipeableDrawer>

        <BottomNavigation
          value={drawerState}
          onChange={(event, newValue) => {
            this.setDrawerState(newValue)
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
  // noRecipes: PropTypes.bool,
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
