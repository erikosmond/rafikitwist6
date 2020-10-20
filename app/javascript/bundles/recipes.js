import {
  put, call, select, takeLatest,
} from 'redux-saga/effects'
import { callApi } from 'services/rest'
import {
  selectedFilterService,
  selectedRecipeService,
  visibleFilterService,
} from 'services/recipeFilters'
import { loadIngredientOptionsTask } from 'bundles/tags'

// Actions
const LOAD_RECIPES = 'recipes/loadRecipes'
const LOAD_RECIPES_SUCCESS = 'recipes/loadRecipesSuccess'
const NO_RECIPES_FOUND = 'recipes/noRecipesFound'
const LOAD_RECIPE = 'recipes/loadRecipe'
const LOAD_RECIPE_SUCCESS = 'recipes/loadRecipeSuccess'
const LOAD_RECIPE_OPTIONS = 'recipes/loadRecipeOptions'
const LOAD_RECIPE_OPTIONS_SUCCESS = 'recipes/loadRecipeOptionsSuccess'
const NO_RECIPE_FOUND = 'recipes/noRecipeFound'
const NOT_LOADING = 'recipes/notLoading'
const LOADING = 'recipes/loading'
const HANDLE_FILTER = 'recipes/handleFilter'
const HANDLE_FILTER_SUCCESS = 'recipes/handleFilterSuccess'
const HANDLE_RECIPE_SUBMIT = 'recipes/handleRecipeSubmit'
const HANDLE_RECIPE_IS_INGREDIENT = 'recipes/handleRecipeIsIngredient'
const CLEAR_FILTERS = 'recipes/clearFilters'
const RESET_PAGED_COUNT = 'recipes/resetPagedCount'
const UPDATE_RECIPE_TAG = 'recipes/updateRecipeTag'
const UPDATE_RECIPE_TAG_SUCCESS = 'recipes/updateRecipeTagSuccess'
const LOAD_RECIPE_FORM_DATA = 'recipes/loadRecipeFormData'
const LOAD_EDIT_FORM = 'recipes/loadEditForm'
const LOAD_EDIT_FORM_SUCCESS = 'recipes/loadEditFormSuccess'
const HANDLE_COMMENT_MODAL = 'recipes/handleCommentModal'
const SUBMIT_RECIPE_COMMENT = 'recipes/submitRecipeComment'
const UPDATE_RECIPE_COMMENT_SUCCESS = 'recipes/updateRecipeCommentSuccess'
const SHOW_MORE_RECIPES = 'recipes/showMoreRecipes'
const CLEAR_RECIPE = 'recipes/clearRecipe'
const SET_VISIBLE_RECIPE_COUNT = 'recipes/setVisibleRecipeCount'
const UPDATE_MOBILE_DRAWER_STATE = 'recipes/updateMobileDrawerState'
const DEFAULT_PAGED_RECIPE_COUNT = 10

// Reducer
const initialState = {
  selectedRecipes: [],
  selectedFilters: [],
  recipeOptions: [],
  visibleFilterTags: {},
  // tagGroups: {},
  recipesLoaded: false,
  noRecipes: false,
  noTags: false,
  loading: true,
  visibleRecipeCount: 0,
  pagedRecipeCount: 10,
  openModal: false,
  openTagFormModal: false,
  recipeIsIngredient: false,
  recipeFormData: {},
  mobileDrawerState: { filters: false, search: false, similar: false },
}

export default function recipesReducer(store, action = {}) {
  const state = { ...initialState, ...store }
  switch (action.type) {
    case LOAD_RECIPES:
      return {
        ...state,
        selectedRecipes: [],
        loading: true,
        mobileDrawerState: { filters: false, search: false, similar: false },
      }
    case LOAD_RECIPES_SUCCESS:
      return {
        ...state,
        selectedRecipes: action.payload.recipes.recipes,
        recipesLoaded: true,
        loading: false,
        noRecipes: false,
      }
    case NO_RECIPES_FOUND:
      return {
        ...state,
        noRecipes: true,
      }
    case LOAD_RECIPE:
      return {
        ...state,
        selectedRecipe: {},
      }
    case LOAD_RECIPE_SUCCESS:
      return {
        ...state,
        recipe: action.payload.recipe,
      }
    case LOAD_RECIPE_OPTIONS_SUCCESS:
      return {
        ...state,
        recipeOptions: action.payload.recipeOptions.recipes,
      }
    case NO_RECIPE_FOUND:
      return {
        ...state,
        noRecipe: true,
      }
    case LOADING:
      return {
        ...state,
        loading: true,
      }
    case NOT_LOADING:
      return {
        ...state,
        loading: false,
      }
    case HANDLE_FILTER_SUCCESS:
      return {
        ...state,
        selectedRecipes: action.payload.selectedRecipes,
        selectedFilters: action.payload.selectedFilters,
        visibleFilterTags: action.payload.visibleFilters,
      }
    case CLEAR_FILTERS:
      return {
        ...state,
        selectedFilters: [],
        visibleRecipeCount: 0,
        selectedRecipeCount: 0,
        selectedRecipes: [],
      }
    case CLEAR_RECIPE:
      return {
        ...state,
        recipe: null,
        noRecipe: false,
      }
    case UPDATE_RECIPE_TAG_SUCCESS:
      return {
        ...state,
        selectedRecipes: state.selectedRecipes.map((r) => tagSelectionReducer(r, { ...action })),
      }
    case UPDATE_RECIPE_COMMENT_SUCCESS:
      return {
        ...state,
        selectedRecipes: state.selectedRecipes.map((r) => commentReducer(r, { ...action })),
      }
    case UPDATE_MOBILE_DRAWER_STATE:
      return {
        ...state,
        mobileDrawerState: action.payload.mobileDrawerState,
      }
    case SET_VISIBLE_RECIPE_COUNT:
      return {
        ...state,
        visibleRecipeCount: action.payload,
      }
    case HANDLE_COMMENT_MODAL:
      return {
        ...state,
        commentModalOpen: action.payload.commentModalOpen,
        commentRecipeId: action.payload.commentRecipeId,
        commentTagSelectionId: action.payload.commentTagSelectionId,
        commentBody: action.payload.commentBody,
      }
    case SHOW_MORE_RECIPES:
      return {
        ...state,
        pagedRecipeCount: action.payload,
      }
    case RESET_PAGED_COUNT:
      return {
        ...state,
        pagedRecipeCount: DEFAULT_PAGED_RECIPE_COUNT,
      }
    case LOAD_EDIT_FORM_SUCCESS:
      return {
        ...state,
        recipeFormData: action.payload.recipeFormData,
      }
    case HANDLE_RECIPE_IS_INGREDIENT:
      return {
        ...state,
        recipeIsIngredient: action.payload.recipeIsIngredient,
      }
    default:
      return state
  }
}

// Helpers

function tagSelectionReducer(recipe, action) {
  const {
    payload: {
      taggableType,
      taggableId,
      tagType,
      tagId,
      id,
    },
  } = action
  if (taggableType === 'Recipe') {
    if (recipe.id === taggableId) {
      return { ...recipe, [tagType]: { tagId, id } }
    }
  }
  return recipe
}

function commentReducer(recipe, action) {
  const {
    payload: {
      taggableType,
      taggableId,
      tagType,
      body,
      id,
    },
  } = action
  if (taggableType === 'Recipe') {
    if (recipe.id === taggableId) {
      return { ...recipe, [tagType]: { body, id } }
    }
  }
  return recipe
}

// Action Creators

export function loadRecipes(tagId) {
  return {
    type: LOAD_RECIPES,
    payload: tagId,
  }
}

export function showMoreRecipes(pagedRecipeCount) {
  return {
    type: SHOW_MORE_RECIPES,
    payload: pagedRecipeCount + 10,
  }
}

export function loadRecipesSuccess({ recipes }) {
  return {
    type: LOAD_RECIPES_SUCCESS,
    payload: {
      recipes,
    },
  }
}

export function noRecipesFound() {
  return {
    type: NO_RECIPES_FOUND,
  }
}

export function loadRecipe(recipeId) {
  return {
    type: LOAD_RECIPE,
    payload: recipeId,
  }
}

export function loadRecipeSuccess({ recipe }) {
  return {
    type: LOAD_RECIPE_SUCCESS,
    payload: {
      recipe,
    },
  }
}

export function loadRecipeOptions() {
  return {
    type: LOAD_RECIPE_OPTIONS,
  }
}

export function loadRecipeOptionsSuccess({ recipeOptions }) {
  return {
    type: LOAD_RECIPE_OPTIONS_SUCCESS,
    payload: {
      recipeOptions,
    },
  }
}

export function noRecipeFound() {
  return {
    type: NO_RECIPE_FOUND,
  }
}

export function notLoading() {
  return {
    type: NOT_LOADING,
  }
}

export function loading() {
  return {
    type: LOADING,
  }
}

export function clearFilters() {
  return {
    type: CLEAR_FILTERS,
  }
}

export function clearRecipe() {
  return {
    type: CLEAR_RECIPE,
  }
}

export function resetPagedCount() {
  return {
    type: RESET_PAGED_COUNT,
  }
}

export function handleFilter(id, checked) {
  return {
    type: HANDLE_FILTER,
    payload: {
      id,
      checked,
    },
  }
}

export function loadEditForm(id) {
  return {
    type: LOAD_EDIT_FORM,
    payload: id,
  }
}

export function handleFilterSuccess(selectedRecipes, selectedFilters, visibleFilters) {
  return {
    type: HANDLE_FILTER_SUCCESS,
    payload: {
      selectedRecipes,
      selectedFilters,
      visibleFilters,
    },
  }
}

export function loadEditFormSuccess(recipeFormData) {
  return {
    type: LOAD_EDIT_FORM_SUCCESS,
    payload: { recipeFormData },
  }
}

export function submitRecipeComment(body, recipeId, tagSelectionId) {
  return {
    type: SUBMIT_RECIPE_COMMENT,
    payload: {
      tagSelectionId,
      body,
      taggableId: recipeId,
      taggableType: 'Recipe',
    },
  }
}

export function updateRecipeTag(recipeId, tagId, tagType, tagSelectionId) {
  return {
    type: UPDATE_RECIPE_TAG,
    payload: {
      tagSelectionId,
      tagId,
      tagType,
      taggableId: recipeId,
      taggableType: 'Recipe',
    },
  }
}

export function updateMobileDrawerState(mobileDrawerState) {
  return {
    type: UPDATE_MOBILE_DRAWER_STATE,
    payload: { mobileDrawerState },
  }
}

export function updateTagSelectionSuccess(taggableType, taggableId, tagType, tagId, id) {
  return {
    type: UPDATE_RECIPE_TAG_SUCCESS,
    payload: {
      taggableType,
      taggableId,
      tagType,
      tagId,
      id,
    },
  }
}

export function updateRecipeCommentSuccess(taggableType, taggableId, tagType, tagId, body, id) {
  return {
    type: UPDATE_RECIPE_COMMENT_SUCCESS,
    payload: {
      taggableType,
      taggableId,
      tagType,
      tagId,
      body,
      id,
    },
  }
}

export function loadRecipeFormData() {
  return {
    type: LOAD_RECIPE_FORM_DATA,
    payload: {},
  }
}

function setVisibleRecipeCount(count) {
  return {
    type: SET_VISIBLE_RECIPE_COUNT,
    payload: count,
  }
}

export function handleCommentModal(payload) {
  return {
    payload,
    type: HANDLE_COMMENT_MODAL,
  }
}

export function handleRecipeIsIngredient(payload) {
  return {
    payload,
    type: HANDLE_RECIPE_IS_INGREDIENT,
  }
}

export function handleRecipeSubmit(payload) {
  return {
    payload,
    type: HANDLE_RECIPE_SUBMIT,
  }
}

function countVisibleRecipes(visibleRecipes) {
  return visibleRecipes.filter((r) => !r.hidden).length
}

// Sagas

function* handleFilterTask({ payload: { id, checked } }) {
  const selectRecipes = (store) => store.recipesReducer
  const recipesState = yield select(selectRecipes)
  const selectTags = (store) => store.tagsReducer
  const tagsState = yield select(selectTags)
  const selectedFilters = yield call(selectedFilterService, id, checked, recipesState)
  const selectedRecipes = yield call(
    selectedRecipeService,
    selectedFilters,
    recipesState,
  )
  const visibleRecipeCount = yield call(countVisibleRecipes, selectedRecipes)
  yield put(setVisibleRecipeCount(visibleRecipeCount))
  // take selectedRecipes and count which ones are visible - set that in visibleRecipeCount
  const visibleFilters = yield call(visibleFilterService, selectedRecipes, tagsState.allTags)
  yield put(handleFilterSuccess(selectedRecipes, selectedFilters, visibleFilters))
}

function* loadRecipesTask({ payload }) {
  const url = `/api/tags/${payload}/recipes`
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadRecipesSuccess({ recipes: result.data }))
    yield put(handleFilter())
  } else {
    yield put(noRecipesFound())
  }
}

function* loadRecipeTask({ payload }) {
  const url = `/api/recipes/${payload}`
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadRecipeSuccess({ recipe: result.data }))
  } else {
    yield put(noRecipeFound())
  }
}

function* loadRecipeOptionsTask() {
  const url = '/api/recipes/'
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadRecipeOptionsSuccess({ recipeOptions: result.data }))
  } else {
    yield put(notLoading())
  }
}

function* handleRecipeSubmitTask({ payload }) {
  const method = payload.id ? 'PUT' : 'POST'
  const id = payload.id ? `/${payload.id}` : ''
  const url = `/api/recipes${id}`
  const params = {
    method,
    data: payload,
  }
  const result = yield call(callApi, url, params)
  if (result.success) {
    console.log(result)
  }
}

function* loadEditFormTask({ payload }) {
  const url = `/api/recipes/${payload}/edit`
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadEditFormSuccess(result.data))
  } else {
    yield put(notLoading())
  }
}

function* updateTagSelectionTask({
  payload: {
    tagId,
    taggableId,
    taggableType,
    tagSelectionId,
    tagType,
  },
}) {
  const method = tagSelectionId ? 'PUT' : 'POST'
  const id = tagSelectionId ? `/${tagSelectionId}` : ''
  const url = `/api/tag_selections${id}`
  const mapping = {
    Rating: 'newRating',
    Priority: 'newPriority',
  }
  const params = {
    method,
    data: {
      tagSelection: {
        tagId,
        taggableId,
        taggableType,
      },
      id: tagSelectionId,
    },
  }
  const result = yield call(callApi, url, params)
  if (result.success) {
    yield put(updateTagSelectionSuccess(
      taggableType, taggableId, mapping[tagType], tagId, result.data.id,
    ))
    yield call(loadIngredientOptionsTask, { payload: { ingredientType: 'More' } })
  } else {
    console.log('Unable to update recipe')
  }
}

function* submitRecipeCommentTask({
  payload: {
    tagSelectionId,
    body,
    taggableId,
    taggableType,
  },
}) {
  const selectRecipes = (store) => store.recipesReducer
  const recipesState = yield select(selectRecipes)
  const { commentTagId } = recipesState
  const method = tagSelectionId ? 'PUT' : 'POST'
  const id = tagSelectionId ? `/${tagSelectionId}` : ''
  const url = `/api/tag_selections${id}`
  const params = {
    method,
    data: {
      tagSelection: {
        body,
        taggableId,
        taggableType,
        tagId: commentTagId,
      },
      id: tagSelectionId,
    },
  }
  const result = yield call(callApi, url, params)
  if (result.success) {
    yield put(updateRecipeCommentSuccess(
      taggableType, taggableId, 'newComment', commentTagId, body, result.data.id,
    ))
  } else {
    console.log('Unable to save comment')
  }
}

export function* recipesSaga() {
  yield takeLatest(LOAD_RECIPES, loadRecipesTask)
  yield takeLatest(LOAD_RECIPE, loadRecipeTask)
  yield takeLatest(LOAD_RECIPE_OPTIONS, loadRecipeOptionsTask)
  yield takeLatest(HANDLE_FILTER, handleFilterTask)
  yield takeLatest(UPDATE_RECIPE_TAG, updateTagSelectionTask)
  yield takeLatest(SUBMIT_RECIPE_COMMENT, submitRecipeCommentTask)
  yield takeLatest(HANDLE_RECIPE_SUBMIT, handleRecipeSubmitTask)
  yield takeLatest(LOAD_EDIT_FORM, loadEditFormTask)
}
