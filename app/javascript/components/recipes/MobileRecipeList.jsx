import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import GroupIcon from '@material-ui/icons/Group'
import SearchIcon from '@material-ui/icons/Search'
import clsx from 'clsx'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'

const useStyles = makeStyles({
  bottom: {
    width: '100%',
    position: 'fixed',
    bottom: 10,
  },
  header: {
    top: 5,
  },
  list: {
    width: 250,
  },
  filters: {
    top: 100,
  },
  fullList: {
    width: 'auto',
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

function renderBottomNav() {
  const classes = useStyles()
  const [value, setValue] = React.useState(4)
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
      showLabels
      className={classes.bottom}
    >
      <BottomNavigationAction label="Filters" icon={<CheckBoxIcon />} />
      <BottomNavigationAction label="Search" icon={<SearchIcon />} />
      <BottomNavigationAction label="Similar" icon={<GroupIcon />} />
    </BottomNavigation>
  )
}

// /////////START//////////

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
    console.log('handle drawer state')
    console.log(drawerValue)
    console.log(event)
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setMobileDrawerState(updateDrawerState(drawerValue))
  }

  const changeDrawerState = (drawerValue) => {
    console.log('change drawer state')
    console.log(drawerValue)
    setMobileDrawerState(updateDrawerState(drawerValue))
  }

  console.log('render nav')
  console.log(value)
  console.log(drawerState)
  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={drawerState.filters}
        onClose={handleDrawerState(-1)}
        onOpen={handleDrawerState(0)}
      >
        <div className={classes.filters}> Filters! </div>
      </SwipeableDrawer>

      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          handleDrawerState(newValue)
          changeDrawerState(newValue)
          setValue(newValue)
        }}
        showLabels
        className={classes.bottom}
      >
        <BottomNavigationAction onClick={handleDrawerState(0)} label="Filters" icon={<CheckBoxIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction label="Similar" icon={<GroupIcon />} />
      </BottomNavigation>
    </>
  )
}

// /////////END//////////

function renderSwipeableTemporaryDrawer() {
  const classes = useStyles()
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })

  // TODO -- this is the type of function I need to pass to onOpen drawer and onClose drawer
  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <div>
      {['left', 'right', 'top', 'bottom'].map((anchor) => (
        <React.Fragment key={anchor}>
          {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
          <Button onClick={toggleDrawer(anchor, true)}><CheckBoxIcon /></Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  )
}

export default function MobileRecipeList({ mobileDrawerState, updateMobileDrawerState }) {
  return (
    <div>
      {renderHeader()}
      {/* {renderSwipeableTemporaryDrawer()} */}
      {renderNavDrawer(mobileDrawerState, updateMobileDrawerState)}
      {/* {renderBottomNav()} */}
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
