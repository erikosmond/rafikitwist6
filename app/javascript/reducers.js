import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import recipesReducer from 'bundles/recipes'

export default combineReducers({
  recipesReducer,
  form: formReducer,
})
