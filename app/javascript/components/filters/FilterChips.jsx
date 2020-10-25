import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'

// TODO:
// do not pass in props from MobileRecipeList and RecipeList

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing(0.5),
  },
  chip: {
    margin: theme.spacing(0.5),
  },
})

class FilterChips extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chipData: [],
    }
  }

  componentDidUpdate(lastProps) {
    if (lastProps !== this.props) {
      const { allTags, selectedFilters } = this.props
      this.setChips(allTags, selectedFilters)
    }
  }

  setChips(allTags, selectedFilters) {
    const chipData = selectedFilters.map((filter) => ({
      key: filter, label: allTags[filter],
    }
    ))
    this.setState((state) => ({ ...state, chipData }))
  }

  handleDelete = (data) => () => {
    const { handleFilter } = this.props
    handleFilter(data.key, false)

    this.setState((state) => {
      const chipData = [...state.chipData]
      const chipToDelete = chipData.indexOf(data)
      chipData.splice(chipToDelete, 1)
      return { chipData }
    })
  }

  render() {
    const { classes, selectedTag } = this.props
    const { chipData } = this.state
    return (
      <Paper className={classes.root}>
        <Chip
          label={selectedTag.name}
          className={classes.chip}
        />
        {chipData.map((data) => (
          <Chip
            key={data.key}
            label={data.label}
            onDelete={this.handleDelete(data)}
            className={classes.chip}
          />
        ))}
      </Paper>
    )
  }
}

FilterChips.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired, chip: PropTypes.string.isRequired,
  }).isRequired,
  handleFilter: PropTypes.func.isRequired,
  allTags: PropTypes.shape({}).isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.number),
  selectedTag: PropTypes.shape({ name: PropTypes.string }).isRequired,
}

FilterChips.defaultProps = {
  selectedFilters: [],
}

export default withStyles(styles)(FilterChips)
