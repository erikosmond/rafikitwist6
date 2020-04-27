import {
  put, call, select, takeLatest, takeEvery,
} from 'redux-saga/effects'
// import { startSubmit, stopSubmit, getFormValues } from 'redux-form'
import { callApi } from 'services/rest'
import {
  selectedFilterService,
  selectedRecipeService,
  visibleFilterService,
} from 'services/recipeFilters'

// Actions
// const LOGOUT = 'accounts/logout'
const LOAD_RECIPES = 'recipes/loadRecipes'
const LOAD_RECIPES_SUCCESS = 'recipes/loadRecipesSuccess'
const LOAD_ALL_TAGS = 'recipes/loadAllTags'
const LOAD_ALL_TAGS_SUCCESS = 'recipes/loadAllTagsSuccess'
const LOAD_TAG_INFO = 'recipes/loadTagInfo'
const LOAD_TAG_INFO_SUCCESS = 'recipes/loadTagInfoSuccess'
const NO_RECIPES_FOUND = 'recipes/noRecipesFound'
const LOAD_RECIPE = 'recipes/loadRecipe'
const LOAD_RECIPE_SUCCESS = 'recipes/loadRecipeSuccess'
const LOAD_RECIPE_OPTIONS = 'recipes/loadRecipeOptions'
const LOAD_RECIPE_OPTIONS_SUCCESS = 'recipes/loadRecipeOptionsSuccess'
const LOAD_CATEGORY_OPTIONS_SUCCESS = 'recipes/loadCategoriesOptionsSuccess'
const LOAD_INGREDIENT_OPTIONS = 'recipes/loadIngredientOptions'
const LOAD_INGREDIENT_OPTIONS_SUCCESS = 'recipes/loadIngredientOptionsSuccess'
const LOAD_TAG_OPTIONS = 'recipes/loadTagOptions'
const LOAD_TAG_OPTIONS_SUCCESS = 'recipes/loadTagOptionsSuccess'
const LOAD_TAG_TYPES = 'tags/loadTagTypes'
const LOAD_TAG_TYPES_SUCCESS = 'tags/loadTagTypesSuccess'
const NO_RECIPE_FOUND = 'recipes/noRecipeFound'
const NOT_LOADING = 'recipes/notLoading'
const HANDLE_FILTER = 'recipes/handleFilter'
const HANDLE_FILTER_SUCCESS = 'recipes/handleFilterSuccess'
const HANDLE_RECIPE_SUBMIT = 'recipes/handleRecipeSubmit'
const NO_TAGS = 'recipes/noTags'
const CLEAR_FILTERS = 'recipes/clearFilters'
const RESET_PAGED_COUNT = 'recipes/resetPagedCount'
const UPDATE_RECIPE_TAG = 'recipes/updateRecipeTag'
const UPDATE_RECIPE_TAG_SUCCESS = 'recipes/updateRecipeTagSuccess'
const LOAD_RECIPE_FORM_DATA = 'recipes/loadRecipeFormData'
const HANDLE_COMMENT_MODAL = 'recipes/handleCommentModal'
const HANDLE_TAG_FORM_MODAL = 'tags/handleTagFormModal'
const HANDLE_TAG_SUBMIT = 'tags/handleTagSubmit'
const SUBMIT_RECIPE_COMMENT = 'recipes/submitRecipeComment'
const UPDATE_RECIPE_COMMENT_SUCCESS = 'recipes/updateRecipeCommentSuccess'
const SHOW_MORE_RECIPES = 'recipes/showMoreRecipes'
const CLEAR_RECIPE = 'recipes/clearRecipe'
const SET_VISIBLE_RECIPE_COUNT = 'recipes/setVisibleRecipeCount'

// Reducer
const initialState = {
  selectedRecipes: [],
  selectedFilters: [],
  selectedTag: {},
  recipeOptions: [],
  visibleFilterTags: {},
  allTags: {},
  tagGroups: {},
  tagTypes: [],
  recipesLoaded: false,
  noRecipes: false,
  noTags: false,
  loading: true,
  visibleRecipeCount: 0,
  pagedRecipeCount: 10,
  openModal: false,
  openTagFormModal: false,
}

export default function recipesReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_RECIPES:
      return {
        ...state,
        selectedRecipes: [],
        loading: true,
      }
    case LOAD_TAG_INFO:
      return {
        ...state,
        selectedTag: {},
        loading: true,
      }
    case LOAD_RECIPES_SUCCESS:
      return {
        ...state,
        selectedRecipes: action.payload.recipes.recipes,
        recipesLoaded: true,
        loading: false,
        noRecipes: false,
      }
    case LOAD_TAG_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedTag: action.payload.tag,
      }
    case LOAD_ALL_TAGS_SUCCESS:
      return {
        ...state,
        allTags: action.payload.tags,
        tagGroups: action.payload.tagGroups,
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
    case NO_RECIPE_FOUND:
      return {
        ...state,
        noRecipe: true,
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
    case NO_TAGS:
      return {
        ...state,
        noTags: true,
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
    case HANDLE_TAG_FORM_MODAL:
      return {
        ...state,
        tagFormModalOpen: action.payload.tagFormModalOpen,
      }
    case SHOW_MORE_RECIPES:
      return {
        ...state,
        pagedRecipeCount: action.payload,
      }
    case RESET_PAGED_COUNT:
      return {
        ...state,
        pagedRecipeCount: 10,
      }
    default:
      return state
  }
}

// Action Creators

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

export function loadTagInfo(tagId) {
  return {
    type: LOAD_TAG_INFO,
    payload: tagId,
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

export function loadTagInfoSuccess({ tag }) {
  return {
    type: LOAD_TAG_INFO_SUCCESS,
    payload: {
      tag,
    },
  }
}

export function loadAllTags() {
  return {
    type: LOAD_ALL_TAGS,
  }
}

export function loadAllTagsSuccess({ tags, tagGroups }) {
  return {
    type: LOAD_ALL_TAGS_SUCCESS,
    payload: {
      tags,
      tagGroups,
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

export function loadIngredientOptions(payload) {
  return {
    type: LOAD_INGREDIENT_OPTIONS,
    payload: {
      ingredientType: payload,
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

export function loadTagOptions() {
  return {
    type: LOAD_TAG_OPTIONS,
  }
}

export function loadTagOptionsSuccess({ tagOptions }) {
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

export function loadTagTypesSuccess({ tagTypes }) {
  return {
    type: LOAD_TAG_TYPES_SUCCESS,
    payload: tagTypes,
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

export function noTagsFound() {
  return {
    type: NO_TAGS,
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

export function handleTagFormModal(payload) {
  return {
    payload,
    type: HANDLE_TAG_FORM_MODAL,
  }
}

export function handleRecipeSubmit(payload) {
  return {
    payload,
    type: HANDLE_RECIPE_SUBMIT,
  }
}

export function submitTagForm(payload) {
  return {
    payload,
    type: HANDLE_TAG_SUBMIT,
  }
}

function countVisibleRecipes(visibleRecipes) {
  // use reduce instead of forEach
  let count = 0
  visibleRecipes.forEach((r) => {
    if (!r.hidden) {
      count += 1
    }
  })
  return count
}

// Saga

export function* handleFilterTask({ payload: { id, checked } }) {
  const selectRecipes = (store) => store.recipesReducer
  const recipesState = yield select(selectRecipes)
  const selectedFilters = yield call(selectedFilterService, id, checked, recipesState)
  const selectedRecipes = yield call(
    selectedRecipeService,
    selectedFilters,
    recipesState,
  )
  const visibleRecipeCount = yield call(countVisibleRecipes, selectedRecipes)
  yield put(setVisibleRecipeCount(visibleRecipeCount))
  // take selectedRecipes and count which ones are visible - set that in visibleRecipeCount
  const visibleFilters = yield call(visibleFilterService, selectedRecipes, recipesState.allTags)
  yield put(handleFilterSuccess(selectedRecipes, selectedFilters, visibleFilters))
}

export function* loadRecipesTask({ payload }) {
  const url = `/api/tags/${payload}/recipes`
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadRecipesSuccess({ recipes: result.data }))
    yield put(handleFilter())
  } else {
    yield put(noRecipesFound())
  }
}

export function* loadTagInfoTask({ payload }) {
  const url = `/api/tags/${payload}`
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadTagInfoSuccess({ tag: result.data }))
  } else {
    yield put(noRecipesFound())
  }
}

export function* loadAllTagsTask() {
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

export function* loadRecipeTask({ payload }) {
  const url = `/api/recipes/${payload}`
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadRecipeSuccess({ recipe: result.data }))
  } else {
    yield put(noRecipeFound())
  }
}

export function* loadRecipeOptionsTask() {
  const url = '/api/recipes/'
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadRecipeOptionsSuccess({ recipeOptions: result.data }))
  } else {
    yield put(notLoading())
  }
}

export function* handleRecipeSubmitTask({ payload }) {
  const url = '/api/recipes'
  const params = { data: payload, method: 'POST' }
  const result = yield call(callApi, url, params)
  // if (result.success) {
  //   yield put(recipeSumbitSuccess(
  //     TODO: update recipe dropdown
  //   ))
  // }
  console.log(result)
}

export function* handleTagSubmitTask({ payload }) {
  const url = '/api/tags'
  const params = { data: payload, method: 'POST' }
  const result = yield call(callApi, url, params)
  // if (result.success) {
  //   yield put(recipeSumbitSuccess(
  //     TODO: update recipe dropdown
  //   ))
  // }
  console.log(result)
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

export function* loadTagOptionsTask() {
  const url = '/api/tag_types?grouped=true'
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadTagOptionsSuccess({ tagOptions: result.data }))
  } else {
    yield put(notLoading())
  }
}

export function* loadTagTypesTask() {
  const url = '/api/tag_types'
  const result = yield call(callApi, url)
  if (result.success) {
    yield put(loadTagTypesSuccess({ tagTypes: result.data }))
  } else {
    yield put(notLoading())
  }
}

export function* updateTagSelectionTask({
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

export function* submitRecipeCommentTask({
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
/* recipes */

export function* recipesSaga() {
  yield takeLatest(LOAD_RECIPES, loadRecipesTask)
  yield takeLatest(LOAD_TAG_INFO, loadTagInfoTask)
  yield takeLatest(LOAD_RECIPE, loadRecipeTask)
  yield takeLatest(LOAD_RECIPE_OPTIONS, loadRecipeOptionsTask)
  yield takeLatest(HANDLE_FILTER, handleFilterTask)
  yield takeLatest(LOAD_ALL_TAGS, loadAllTagsTask)
  yield takeEvery(LOAD_INGREDIENT_OPTIONS, loadIngredientOptionsTask)
  yield takeEvery(LOAD_TAG_OPTIONS, loadTagOptionsTask)
  yield takeEvery(LOAD_TAG_TYPES, loadTagTypesTask)
  yield takeLatest(UPDATE_RECIPE_TAG, updateTagSelectionTask)
  yield takeLatest(SUBMIT_RECIPE_COMMENT, submitRecipeCommentTask)
  yield takeLatest(HANDLE_TAG_SUBMIT, handleTagSubmitTask)
  yield takeLatest(HANDLE_RECIPE_SUBMIT, handleRecipeSubmitTask)
}
