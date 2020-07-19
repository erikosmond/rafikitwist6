import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import recipesReducer from 'bundles/recipes'
import tagsReducer from 'bundles/tags'

export default combineReducers({
  recipesReducer,
  tagsReducer,
  form: formReducer,
})
