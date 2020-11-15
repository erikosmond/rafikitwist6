import React from 'react'
import Media from 'react-media'

import LargeHome from 'components/recipes/LargeHome'
import MolbileHome from 'components/recipes/MobileHome'

const Home = () => (
  <div>
    <Media queries={{
      small: '(max-width: 599px)',
      large: '(min-width: 600px)',
    }}
    >
      {(matches) => (
        <>
          {matches.small && <MolbileHome />}
          {matches.large && <LargeHome />}
        </>
      )}
    </Media>
  </div>
)

export default Home
