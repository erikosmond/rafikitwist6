import React from 'react'
import PropTypes from 'prop-types'
import FormControl from '@material-ui/core/FormControl'
import RecipeFormStyles from 'components/styled/RecipeFormStyles'
import { sortByName } from 'services/sortService'
import { makeStyles, withStyles } from '@material-ui/core/styles'
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
    title,
    id,
    input: { onChange, value },
  } = props
  const classes = useStyles()
  const [tags, setTags] = React.useState(value || [])

  const handleChange = (event) => {
    let updatedTags = []
    if (tags.map((x) => x.name).indexOf(event.currentTarget.innerText) > -1) {
      // hack for updating multi select when editing recipe
      updatedTags = event.target.value.filter((x) => x.name !== event.currentTarget.innerText)
    } else {
      updatedTags = event.target.value
    }

    setTags(updatedTags)
    onChange(updatedTags)
  }
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id={`${id}-label`}>{title}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        multiple
        value={tags}
        onChange={handleChange}
        input={<Input />}
        renderValue={(selected) => selected.map((tag) => tag.name).join(', ')}
        MenuProps={MenuProps}
      >
        {sortByName(tagOptions).map((tag) => (
          <MenuItem key={title + tag.id} value={tag}>
            <Checkbox checked={tags.map((t) => t.id).indexOf(tag.id) > -1} />
            <ListItemText primary={tag.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

RecipeFormTagSelectors.propTypes = {
  tagOptions: PropTypes.arrayOf(PropTypes.shape()),
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  input: PropTypes.shape({
    value: '',
    onChange: PropTypes.func,
  }).isRequired,
}

RecipeFormTagSelectors.defaultProps = {
  tagOptions: [],
}

export default withStyles(styles)(RecipeFormTagSelectors)
