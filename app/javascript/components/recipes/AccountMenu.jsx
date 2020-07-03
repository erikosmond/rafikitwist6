import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import styled from 'styled-components'
import Menu from '@material-ui/core/Menu'
import SvgIcon from '@material-ui/core/SvgIcon'
import MenuItem from '@material-ui/core/MenuItem'

const ITEM_HEIGHT = 48
const accountIcon = `M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 
C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M12,5 C13.66,5 15,6.34 
15,8 C15,9.66 13.66,11 12,11 C10.34,11 9,9.66 9,8 C9,6.34 10.34,5 12,5 Z 
M12,19.2 C9.5,19.2 7.29,17.92 6,15.98 C6.03,13.99 10,12.9 12,12.9 C13.99,12.9 
17.97,13.99 18,15.98 C16.71,17.92 14.5,19.2 12,19.2 Z`

const StyledIcon = styled.div`
  display: inline-block;
`

class AccountMenu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
    }
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  renderLoginLogout() {
    const { authenticated } = this.props
    if (authenticated) {
      return (
        <MenuItem>
          <a href="/users/sign_out"> Sign Out </a>
        </MenuItem>
      )
    }
    return (
      <div>
        <MenuItem>
          <a href="/users/sign_up"> Create Account </a>
        </MenuItem>
        <MenuItem>
          <a href="/users/sign_in"> Sign In </a>
        </MenuItem>
      </div>
    )
  }

  renderMenu(anchorEl, open, firstName) {
    return (
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
        <MenuItem>
          {`Welcome ${firstName}`}
        </MenuItem>
        {this.renderLoginLogout()}
      </Menu>
    )
  }


  render() {
    const { anchorEl } = this.state
    const open = Boolean(anchorEl)
    const { firstName, mobile } = this.props

    if (mobile) {
      return (
        this.renderLoginLogout()
      )
    }
    return (
      <StyledIcon>
        <IconButton
          aria-label="Account"
          aria-owns={open ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <SvgIcon>
            <path d={accountIcon} />
          </SvgIcon>
        </IconButton>
        {this.renderMenu(anchorEl, open, firstName)}
      </StyledIcon>
    )
  }
}

AccountMenu.propTypes = {
  mobile: PropTypes.bool,
  firstName: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
}

AccountMenu.defaultProps = {
  firstName: '',
  mobile: false,
}

export default AccountMenu
