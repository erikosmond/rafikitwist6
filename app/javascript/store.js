/* global window */

import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'

export default function configureStore(rootReducer, rootSaga, initialState) {
  const sagaMiddleware = createSagaMiddleware()

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // Redux DevTools Extension
  /* eslint-enable */
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware)),
  )

  sagaMiddleware.run(rootSaga)

  store.close = () => store.dispatch(END)
  return store
}
