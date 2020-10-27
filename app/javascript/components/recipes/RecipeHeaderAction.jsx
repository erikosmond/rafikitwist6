import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import SvgIcon from '@material-ui/core/SvgIcon'
import MenuItem from '@material-ui/core/MenuItem'

const ITEM_HEIGHT = 48

class RecipeHeaderAction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
    }
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  };

  handleClose = (event) => {
    const {
      recipeId,
      updateRecipeTag,
      selectedOption,
      label,
    } = this.props
    if (event.currentTarget.value) {
      if (selectedOption && selectedOption.id) {
        updateRecipeTag(recipeId, event.currentTarget.value, label, selectedOption.id)
      } else {
        updateRecipeTag(recipeId, event.currentTarget.value, label)
      }
    }
    this.setState({ anchorEl: null })
  }

  render() {
    const {
      iconSvgPath,
      options,
      label,
      selectedOption,
    } = this.props
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div>
        <IconButton
          aria-label={label}
          aria-owns={open ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <SvgIcon>
            <path d={iconSvgPath} />
          </SvgIcon>
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 200,
            },
          }}
        >
          {Object.keys(options).sort().reverse().map((option) => (
            <MenuItem
              key={option}
              value={options[option]}
              selected={options[option] === selectedOption.tagId}
              onClick={this.handleClose}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

RecipeHeaderAction.propTypes = {
  label: PropTypes.string.isRequired,
  iconSvgPath: PropTypes.string.isRequired,
  options: PropTypes.shape({}).isRequired,
  selectedOption: PropTypes.shape({ id: PropTypes.number, tagId: PropTypes.number }),
  recipeId: PropTypes.number.isRequired,
  updateRecipeTag: PropTypes.func.isRequired,
}

RecipeHeaderAction.defaultProps = {
  selectedOption: {},
}
export default RecipeHeaderAction
