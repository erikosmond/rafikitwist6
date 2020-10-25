import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import IngredientTypeFilter from 'containers/IngredientTypeFilterContainer'
import { sortByTagName } from 'services/sortService'

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
        }
        if (values && values.length > 0) {
          return this.hasVisibleLevel(values, visibleTags)
        }
      }
    }
    return false
  }

  handleChange = (id) => (event) => {
    const { handleFilter } = this.props
    handleFilter(id, event.target.checked)
  }

  render() {
    if (this.hasVisibleChildren()) {
      const {
        tagNameById,
        childTags,
        selectedFilters,
        id,
        classes,
        allTags,
      } = this.props
      return (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={selectedFilters.indexOf(parseInt(id, 10)) > -1}
                  onChange={this.handleChange(id)}
                  value={id}
                />
              )}
              label={tagNameById(id)}
            />
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            {childTags && sortByTagName(Object.keys(childTags), allTags).map((t) => (
              <IngredientTypeFilter
                key={`${id}--${t}`}
                id={t}
                label={tagNameById(parseInt(t, 10))}
                childTags={childTags[parseInt(t, 10)]}
                tagNameById={tagNameById}
                selectable
              />
            ))}
          </AccordionDetails>
        </Accordion>
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
  allTags: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
}

IngredientFamilyFilter.defaultProps = {
  childTags: [],
  selectedFilters: [],
}

export default withStyles(styles)(IngredientFamilyFilter)
