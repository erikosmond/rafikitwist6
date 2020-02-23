import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import IngredientFilter from 'components/filters/IngredientFilter'

const styles = () => ({
  details: {
    display: 'block',
  },
})

class IngredientTypeFilter extends React.Component {
  state = {}

  hasVisibleChildren = () => {
    const { childTags, visibleTags, id } = this.props
    if (visibleTags[id]) {
      return true
    }
    for (let ct = 0, n = childTags.length; ct < n; ct += 1) {
      if (visibleTags[childTags[ct]]) {
        return true
      }
    }
    return false
  }

  handleChange = id => (event) => {
    const { handleFilter } = this.props
    handleFilter(id, event.target.checked)
  }

  isVisible = () => {
    const { id, visibleTags } = this.props
    return Array.isArray(visibleTags) && visibleTags.indexOf(parseInt(id, 10)) > -1
  }

  render() {
    if (this.isVisible() || this.hasVisibleChildren()) {
      const {
        visibleTags,
        tagNameById,
        childTags,
        handleFilter,
        selectedFilters,
        id,
        classes,
        selectable,
        label,
      } = this.props
      return (
        <ExpansionPanel expanded={this.state.expansionPanelOpen}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            {selectable && <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFilters.indexOf(parseInt(id, 10)) > -1}
                  onChange={this.handleChange(id)}
                  value={id}
                />
              }
              label={tagNameById(id)}
            />}
            { !selectable && label }
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            {childTags.map(t => (
              visibleTags[parseInt(t, 10)] &&
                <IngredientFilter
                  key={`${id}--${t}`}
                  id={t}
                  label={tagNameById(parseInt(t, 10))}
                  visibleTags={visibleTags}
                  handleFilter={handleFilter}
                  selectedFilters={selectedFilters}
                />
              ))}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    }
    return null
  }
}

IngredientTypeFilter.propTypes = {
  id: PropTypes.string.isRequired,
  classes: PropTypes.shape().isRequired,
  childTags: PropTypes.arrayOf(PropTypes.number),
  handleFilter: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.number),
  visibleTags: PropTypes.shape().isRequired,
  tagNameById: PropTypes.func.isRequired,
  selectable: PropTypes.bool,
  label: PropTypes.string,
}

IngredientTypeFilter.defaultProps = {
  childTags: [],
  selectedFilters: [],
  selectable: false,
  label: '',
}

export default withStyles(styles)(IngredientTypeFilter)
