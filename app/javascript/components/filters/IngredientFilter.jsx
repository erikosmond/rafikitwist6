import React from 'react'
import PropTypes from 'prop-types'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

class IngredientFilter extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (id) => (event) => {
    const { handleFilter } = this.props
    handleFilter(id, event.target.checked)
  }

  render() {
    const {
      id,
      label,
      selectedFilters,
    } = this.props
    return (
      <FormControlLabel
        control={(
          <Checkbox
            checked={selectedFilters.indexOf(id) > -1}
            onChange={this.handleChange(id)}
            value={id}
          />
        )}
        label={label}
      />
    )
  }
}

IngredientFilter.propTypes = {
  id: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  handleFilter: PropTypes.func.isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.number).isRequired,
}

export default IngredientFilter
