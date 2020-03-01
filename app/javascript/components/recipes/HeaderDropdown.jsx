import React from 'react'
import PropTypes from 'prop-types'
import StyledSelect from '../styled/StyledSelect'

class HeaderDropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: null,
    }
  }

  componentDidMount() {
    const { loadOptions, placeholder } = this.props
    loadOptions(placeholder)
  }

  handleChange = (selectedOption) => {
    this.setState(state => ({ ...state, selectedOption }))
    const { updateHistory } = this.props
    if (selectedOption && selectedOption.value) {
      updateHistory(selectedOption.value)
    }
  }

  render() {
    const { selectedOption } = this.state
    const { dropdownOptions, placeholder } = this.props
    const options = dropdownOptions || []
    return (
      <StyledSelect
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
        placeholder={placeholder}
        isSearchable
        isClearable
      />
    )
  }
}

export default HeaderDropdown

HeaderDropdown.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  updateHistory: PropTypes.func.isRequired,
  dropdownOptions: PropTypes.arrayOf(PropTypes.shape({name: PropTypes.string, id: PropTypes.number})).isRequired,
  placeholder: PropTypes.string.isRequired,
}
