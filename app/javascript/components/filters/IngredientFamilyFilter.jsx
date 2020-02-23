import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import IngredientTypeFilter from 'components/filters/IngredientTypeFilter'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const styles = () => ({
  details: {
    display: 'block',
  },
})

class IngredientFamilyFilter extends React.Component {
  hasVisibleChildren = () => {
    const { childTags, visibleTags } = this.props
    if (typeof (childTags) === 'object') {
      const tagList = Object.keys(childTags)
      return this.hasVisibleLevel(tagList, visibleTags)
    }
    return false
  }

  hasVisibleLevel = (childTags, visibleTags) => {
    if (childTags.length > 0) {
      for (let ct = 0; ct < childTags.length; ct += 1) {
        const key = childTags[ct]
        const values = childTags[key]
        if (visibleTags[key]) {
          return true
        } else if (values && values.length > 0) {
          return this.hasVisibleLevel(values, visibleTags)
        }
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
      } = this.props
      return (
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFilters.indexOf(parseInt(id, 10)) > -1}
                  onChange={this.handleChange(id)}
                  value={id}
                />
              }
              label={tagNameById(id)}
            />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            {childTags && Object.keys(childTags).map(t => (
              <IngredientTypeFilter
                key={`${id}--${t}`}
                id={t}
                label={tagNameById(parseInt(t, 10))}
                childTags={childTags[parseInt(t, 10)]}
                tagNameById={tagNameById}
                visibleTags={visibleTags}
                handleFilter={handleFilter}
                selectedFilters={selectedFilters}
                selectable
              />
            ))}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    }
    return null
  }
}

IngredientFamilyFilter.propTypes = {
  id: PropTypes.string.isRequired,
  classes: PropTypes.shape().isRequired,
  childTags: PropTypes.shape({}),
  handleFilter: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.number),
  visibleTags: PropTypes.shape({}).isRequired,
  tagNameById: PropTypes.func.isRequired,
}

IngredientFamilyFilter.defaultProps = {
  childTags: [],
  selectedFilters: [],
}

export default withStyles(styles)(IngredientFamilyFilter)
