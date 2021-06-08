import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  tag: {
    marginBottom: '5px',
  },
})

const RelatedTags = ({ tags }) => {
  if (tags && Object.keys(tags).length > 0) {
    const classes = useStyles()
    return (
      <div>
        {Object.keys(tags).map((k) => (
          <div className={classes.tag} key={tags[k]}>
            <Link key={k} to={`/tags/${k}/recipes`}>
              {tags[k]}
            </Link>
            <br />
          </div>
        ))}
      </div>
    )
  }
  return null
}

RelatedTags.propTypes = {
  tags: PropTypes.shape({}),
}

RelatedTags.defaultProps = {
  tags: {},
}

export default RelatedTags
