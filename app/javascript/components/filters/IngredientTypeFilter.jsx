import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import IngredientFilter from 'components/filters/IngredientFilter'
import { sortByTagName } from 'services/sortService'

const styles = () => ({
  details: {
    display: 'block',
  },
})

// TODO:
// Add container for selectedFilters, visibleTags, allTags, handleFilter
class IngredientTypeFilter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

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

  handleChange = (id) => (event) => {
    const { handleFilter } = this.props
    handleFilter(id, event.target.checked)
  }

  render() {
    if (this.hasVisibleChildren()) {
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
        allTags,
      } = this.props
      const { expansionPanelOpen } = this.state
      return (
        <Accordion expanded={expansionPanelOpen}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {selectable && (
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
            )}
            { !selectable && label }
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            {sortByTagName(childTags, allTags).map((t) => (
              visibleTags[parseInt(t, 10)] && (
                <IngredientFilter
                  key={`${id}--${t}`}
                  id={t}
                  label={tagNameById(parseInt(t, 10))}
                  visibleTags={visibleTags}
                  handleFilter={handleFilter}
                  selectedFilters={selectedFilters}
                />
              )
            ))}
          </AccordionDetails>
        </Accordion>
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
  allTags: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
}

IngredientTypeFilter.defaultProps = {
  childTags: [],
  selectedFilters: [],
  selectable: false,
  label: '',
}

export default withStyles(styles)(IngredientTypeFilter)
