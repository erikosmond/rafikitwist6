import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import RecipeFormStyles from 'components/styled/RecipeFormStyles'
// import clsx from 'clsx';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'

const styles = () => (RecipeFormStyles)

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}))

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

let RecipeFormTagSelectors = (props) => {
  const {
    tagOptions,
    input: { onChange, value },
  } = props
  const klasses = useStyles()
  const theme = useTheme()
  const [personName, setPersonName] = React.useState([])

  const handleChange = (event) => {
    setPersonName(event.target.value)
    onChange(event.target.value)
  }

  return (
    <FormControl className={klasses.formControl}>
      <InputLabel id="demo-mutiple-checkbox-label">Tag</InputLabel>
      <Select
        labelId="demo-mutiple-checkbox-label"
        id="demo-mutiple-checkbox"
        multiple
        value={value || []}
        onChange={handleChange}
        input={<Input />}
        renderValue={(selected) => selected.map((person) => person.name).join(', ')}
        MenuProps={MenuProps}
      >
        {tagOptions.map((tag) => (
          <MenuItem key={tag.id} value={tag}>
            <Checkbox checked={personName.map((person) => person.id).indexOf(tag.id) > -1} />
            <ListItemText primary={tag.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

RecipeFormTagSelectors.propTypes = {
  tagOptions: PropTypes.arrayOf(PropTypes.shape()),
  classes: PropTypes.shape({
    container: PropTypes.string,
    nameLabel: PropTypes.string,
    nameField: PropTypes.string,
    descriptionLabel: PropTypes.string,
    descriptionField: PropTypes.string,
    instructionsField: PropTypes.string,
    instructionsLabel: PropTypes.string,
  }),
}

RecipeFormTagSelectors.defaultProps = {
  tagOptions: [],
  classes: {},
}

export default withStyles(styles)(RecipeFormTagSelectors)
