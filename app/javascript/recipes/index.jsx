/* global document */

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'

import rootReducer from 'reducers'
import rootSaga from 'saga'
import configureStore from 'store'

import Home from '../components/recipes/Home'

require('react-hot-loader/patch')
require('idempotent-babel-polyfill')

const home = document.querySelector('#home')

const myStore = {
  recipesReducer: {
    startingTagId: home.dataset.startingTagId,
    commentTagId: home.dataset.commentTagId,
    firstName: home.dataset.firstName,
    allTags: JSON.parse(home.dataset.allTags),
    allTagTypes: JSON.parse(home.dataset.allTagTypes),
    tagGroups: JSON.parse(home.dataset.tagGroups),
    tagsByType: JSON.parse(home.dataset.tagsByType),
    ratings: JSON.parse(home.dataset.ratings),
    priorities: JSON.parse(home.dataset.priorities),
  },
}

const store = configureStore(rootReducer, rootSaga, myStore)
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    home,
  )
}

render(Home)

if (module.hot) {
  module.hot.accept('../components/recipes/Home', () => { render(Home) })
}
