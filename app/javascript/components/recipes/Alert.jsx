import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
// import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

export default function AlertBox(props) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(true)
  const { recipeAlert, tagAlert } = props
  if (!recipeAlert && !tagAlert) {
    return null
  }
  return (
    <div className={classes.root}>
      <Collapse in={open}>
        <Alert
          severity="error"
          action={(
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )}
        >
          {recipeAlert}
          {tagAlert}
        </Alert>
      </Collapse>
      {/* <Button
        disabled={open}
        variant="outlined"
        onClick={() => {
          setOpen(true)
        }}
      >
        Re-open
      </Button> */}
    </div>
  )
}

AlertBox.propTypes = {
  recipeAlert: PropTypes.string,
  tagAlert: PropTypes.string,
}

AlertBox.defaultProps = {
  recipeAlert: null,
  tagAlert: null,
}
