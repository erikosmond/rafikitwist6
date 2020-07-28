import {
  put, call, select, takeLatest, takeEvery,
} from 'redux-saga/effects'
import { callApi } from 'services/rest'
import { loading, noRecipesFound, notLoading } from 'bundles/recipes'

const HANDLE_TAG_FORM_MODAL = 'tags/handleTagFormModal'
const HANDLE_TAG_SUBMIT = 'tags/handleTagSubmit'
const LOAD_TAG_OPTIONS = 'tags/loadTagOptions'
const LOAD_TAG_OPTIONS_SUCCESS = 'recipes/loadTagOptionsSuccess'
const LOAD_TAG_TYPES = 'tags/loadTagTypes'
const LOAD_TAG_TYPES_SUCCESS = 'tags/loadTagTypesSuccess'
const LOAD_ALL_TAGS = 'tags/loadAllTags'
const LOAD_ALL_TAGS_SUCCESS = 'tags/loadAllTagsSuccess'
const LOAD_TAG_INFO = 'tags/loadTagInfo'
const LOAD_TAG_INFO_SUCCESS = 'tags/loadTagInfoSuccess'
const NO_TAGS = 'tags/noTags'
const TAG_SUBMIT_SUCCESS = 'tags/tagSubmitSuccess'
const LOAD_INGREDIENT_OPTIONS_SUCCESS = 'tags/loadIngredientOptionsSuccess'
const LOAD_CATEGORY_OPTIONS_SUCCESS = 'tags/loadCategoriesOptionsSuccess'
const LOAD_INGREDIENT_OPTIONS = 'tags/loadIngredientOptions'
const INGREDIENT_MODIFICATION = 'ingredientModification'
const INGREDIENT_TYPES = ['ingredient', 'ingredientCategory', 'ingredientFamily', 'ingredientType']

// Reducer

const initialState = {
  selectedTag: {},
  tagFormModalOpen: false,
  tagTypes: [],
  allTags: {},
}

export default function tagsReducer(store, action = {}) {
  const state = { ...initialState, ...store }
  switch (action.type) {
    case HANDLE_TAG_FORM_MODAL:
      return {
        ...state,
        tagFormModalOpen: action.payload.tagFormModalOpen,
      }
    case LOAD_TAG_OPTIONS_SUCCESS:
      return {
        ...state,
        tagOptions: action.payload,
      }
    case LOAD_TAG_TYPES_SUCCESS:
      return {
        ...state,
        tagTypes: action.payload,
      }
    case LOAD_TAG_INFO:
      return {
        ...state,
        selectedTag: {},
      }
    case LOAD_TAG_INFO_SUCCESS:
      return {
        ...state,
        selectedTag: action.payload.tag,
      }
    case LOAD_ALL_TAGS_SUCCESS:
      return {
        ...state,
        allTags: action.payload.tags,
        tagGroups: action.payload.tagGroups,
      }
    case TAG_SUBMIT_SUCCESS:
      return {
        ...state,
        tagFormModalOpen: false,
        tagOptions: tagOptionsUpdater(state.tagOptions, action.payload),
        ingredientOptions: ingredientOptionsUpdater(state.ingredientOptions, action.payload),
        ingredientModificationOptions:
          ingredientModOptionsUpdater(state.ingredientModificationOptions, action.payload),
      }
    case LOAD_INGREDIENT_OPTIONS_SUCCESS:
      return {
        ...state,
        ingredientOptions: action.payload.ingredientOptions,
        ingredientModificationOptions: action.payload.ingredientModificationOptions,
      }
    case LOAD_CATEGORY_OPTIONS_SUCCESS:
      return {
        ...state,
        categoryOptions: action.payload.ingredientOptions,
      }
    case NO_TAGS:
      return {
        ...state,
        noTags: true,
      }
    default:
      return state
  }
}

function ingredientOptionsUpdater(ingredientOptions, newTag) {
  if (INGREDIENT_TYPES.includes(newTag.tagType)) {
    return [
      ...ingredientOptions,
      { value: newTag.id, label: newTag.name },
    ]
  }
  return ingredientOptions
}

// Helpers

function tagOptionsUpdater(tagOptions, newTag) {
  return {
    ...tagOptions,
    [newTag.tagType]: [
      ...tagOptions[newTag.tagType],
      { id: newTag.id, name: newTag.name },
    ],
  }
}

function ingredientModOptionsUpdater(ingredientModOptions, newTag) {
  if (INGREDIENT_MODIFICATION === newTag.tagType) {
    return [
      ...ingredientModOptions,
      { value: newTag.id, label: newTag.name },
    ]
  }
  return ingredientModOptions
}

// Action Creators

export function handleTagFormModal(payload) {
  return {
    payload,
    type: HANDLE_TAG_FORM_MODAL,
  }
}

export function loadAllTags() {
  return {
    type: LOAD_ALL_TAGS,
  }
}

function loadAllTagsSuccess({ tags, tagGroups }) {
  return {
    type: LOAD_ALL_TAGS_SUCCESS,
    payload: {
      tags,
      tagGroups,
    },
  }
}

export function loadTagInfo(tagId) {
  return {
    type: LOAD_TAG_INFO,
    payload: tagId,
  }
}

export function loadTagOptions() {
  return {
    type: LOAD_TAG_OPTIONS,
  }
}

function loadTagOptionsSuccess({ tagOptions }) {
  return {
    type: LOAD_TAG_OPTIONS_SUCCESS,
    payload: tagOptions,
  }
}

export function loadTagTypes() {
  return {
    type: LOAD_TAG_TYPES,
  }
}

export function submitTagForm(payload) {
  return {
    payload,
    type: HANDLE_TAG_SUBMIT,
  }
}

function loadTagTypesSuccess({ tagTypes }) {
  return {
    type: LOAD_TAG_TYPES_SUCCESS,
    payload: tagTypes,
  }
}

function tagSumbitSuccess(payload) {
  return {
    payload,
    type: TAG_SUBMIT_SUCCESS,
  }
}

function noTagsFound() {
  return {
    type: NO_TAGS,
  }
}

function loadTagInfoSuccess({ tag }) {
  return {
    type: LOAD_TAG_INFO_SUCCESS,
    payload: {
      tag,
    },
  }
}

export function loadCategoryOptionsSuccess({ ingredientOptions }) {
  return {
    type: LOAD_CATEGORY_OPTIONS_SUCCESS,
    payload: {
      ingredientOptions,
    },
  }
}

export function loadIngredientOptionsSuccess(payload) {
  const { ingredientOptions, ingredientModificationOptions } = payload
  return {
    type: LOAD_INGREDIENT_OPTIONS_SUCCESS,
    payload: {
      ingredientModificationOptions,
      ingredientOptions,
    },
  }
}

export function loadIngredientOptions(payload) {
  return {
    type: LOAD_INGREDIENT_OPTIONS,
    payload: {
      ingredientType: payload,
    },
  }
}

// Sagas

function* loadTagOptionsTask() {
  const url = '/api/tag_types?grouped=true'
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadTagOptionsSuccess({ tagOptions: result.data }))
  } else {
    yield put(notLoading())
  }
}

function* loadTagTypesTask() {
  const url = '/api/tag_types'
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadTagTypesSuccess({ tagTypes: result.data }))
  } else {
    yield put(notLoading())
  }
}

function* handleTagSubmitTask({ payload }) {
  const url = '/api/tags'
  const params = { data: payload, method: 'POST' }
  const result = yield call(callApi, url, params)
  if (result.success) {
    yield put(tagSumbitSuccess(result.data))
  }
  console.log(result)
}

function* loadTagInfoTask({ payload }) {
  yield put(loading())
  const url = `/api/tags/${payload}`
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadTagInfoSuccess({ tag: result.data }))
    yield put(notLoading())
  } else {
    yield put(noRecipesFound())
  }
}

function* loadAllTagsTask() {
  const selectRecipes = (store) => store.recipesReducer
  const recipesState = yield select(selectRecipes)
  const { allTags } = recipesState
  if (!allTags || allTags.length === 0) {
    const url = '/api/tags'
    const result = yield call(callApi, url)
    if (result.success) {
      const tagObj = {}
      result.data.tags.forEach((t) => {
        tagObj[t.value] = t.label
      })
      const { tagGroups } = result.data
      yield put(loadAllTagsSuccess({ tags: tagObj, tagGroups }))
    } else {
      yield put(noTagsFound())
    }
  }
}

export function* loadIngredientOptionsTask({ payload }) {
  const url = `/api/tags?type=${payload.ingredientType}`
  const result = yield call(callApi, url)
  if (result.success) {
    if (payload.ingredientType === 'Ingredients') {
      const modUrl = '/api/tags?type=ingredient_modifications'
      const modResult = yield call(callApi, modUrl)
      yield put(loadIngredientOptionsSuccess({
        ingredientOptions: result.data.tags,
        ingredientModificationOptions: modResult.data.tags,
      }))
    } else {
      yield put(loadCategoryOptionsSuccess({ ingredientOptions: result.data.tags }))
    }
  } else {
    yield put(notLoading())
  }
}

export function* tagsSaga() {
  yield takeLatest(LOAD_ALL_TAGS, loadAllTagsTask)
  yield takeLatest(LOAD_TAG_INFO, loadTagInfoTask)
  yield takeEvery(LOAD_TAG_OPTIONS, loadTagOptionsTask)
  yield takeEvery(LOAD_TAG_TYPES, loadTagTypesTask)
  yield takeEvery(LOAD_INGREDIENT_OPTIONS, loadIngredientOptionsTask)
  yield takeLatest(HANDLE_TAG_SUBMIT, handleTagSubmitTask)
}
