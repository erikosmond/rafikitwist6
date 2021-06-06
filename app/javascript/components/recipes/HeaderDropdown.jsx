import React from 'react'
import PropTypes from 'prop-types'
import SearchIcon from '@material-ui/icons/Search'
import { withStyles } from '@material-ui/core/styles'
import StyledSelect from '../styled/StyledSelect'

const styles = () => ({
  searchIcon: {
    position: 'relative',
    top: '4px',
  },
})

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
    this.setState((state) => ({ ...state, selectedOption }))
    const { updateHistory } = this.props
    if (selectedOption && selectedOption.value) {
      updateHistory(selectedOption.value)
    }
  }

  placeholderWithIcon = (placeholder, classes) => (
    <h2>
      <div>
        <SearchIcon className={classes.searchIcon} />
        &nbsp;
        {placeholder}
      </div>
    </h2>
  )

  render() {
    const { selectedOption } = this.state
    const {
      classes,
      dropdownOptions,
      placeholder,
      className,
      mobile,
    } = this.props
    const options = dropdownOptions || []
    return (
      <StyledSelect
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
        placeholder={this.placeholderWithIcon(placeholder, classes)}
        isSearchable
        isClearable
        className={className}
        mobile={mobile}
      />
    )
  }
}

export default withStyles(styles)(HeaderDropdown)

HeaderDropdown.propTypes = {
  classes: PropTypes.shape({
    searchIcon: PropTypes.string.isRequired,
  }).isRequired,
  loadOptions: PropTypes.func.isRequired,
  updateHistory: PropTypes.func.isRequired,
  dropdownOptions: PropTypes.arrayOf(PropTypes.shape(
    { name: PropTypes.string, id: PropTypes.number },
  )).isRequired,
  placeholder: PropTypes.string.isRequired,
  className: PropTypes.string,
  mobile: PropTypes.bool,
}

HeaderDropdown.defaultProps = {
  className: '',
  mobile: false,
}
