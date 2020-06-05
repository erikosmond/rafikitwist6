/* eslint-disable react/jsx-no-bind */

import React from 'react'
import Media from 'react-media'

import LargeHome from 'components/recipes/LargeHome'
import MolbileHome from 'components/recipes/MobileHome'

const Home = () => (
  <div>
    <Media queries={{
      small: '(max-width: 599px)',
      medium: '(min-width: 600px) and (max-width: 1199px)',
      large: '(min-width: 1200px)',
    }}
    >
      {(matches) => (
        <>
          {matches.small && <MolbileHome />}
          {matches.medium && <p>I am medium!</p>}
          {matches.large && <LargeHome />}
        </>
      )}
    </Media>
  </div>
)

export default Home
