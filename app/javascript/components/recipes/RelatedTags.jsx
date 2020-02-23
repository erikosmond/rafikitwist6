import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const RelatedTags = ({ tags }) => {
  if (tags) {
    return (
      <div>
        {Object.keys(tags).map(k => (
          <div key={tags[k]}>
            <Link key={k} to={`/tags/${k}/recipes`}> {tags[k]} </Link>
            <br/>
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
  tags: {}
}

export default RelatedTags
