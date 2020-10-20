import React, { Component } from 'react'
import PropTypes from 'prop-types'
import StyledSelect from '../styled/StyledSelect'

// TODO: no change required
class RecipeFormIngredient extends Component {
  handleChange = (selectedOption) => {
    const { input: { onChange } } = this.props
    onChange(selectedOption)
  }

  render() {
    const {
      ingredientOptions,
      placeholder,
      input: { value },
    } = this.props
    return (
      <StyledSelect
        value={value}
        onChange={this.handleChange}
        options={ingredientOptions}
        placeholder={placeholder}
        isSearchable
        isClearable
      />
    )
  }
}

RecipeFormIngredient.propTypes = {
  ingredientOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string, id: PropTypes.number,
  })).isRequired,
  placeholder: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.shape({}),
    onChange: PropTypes.func,
  }).isRequired,
}

RecipeFormIngredient.defaultProps = {
  placeholder: 'Placeholder',
}

export default RecipeFormIngredient
