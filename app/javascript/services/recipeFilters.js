export function selectedFilterService(fId, checked, state) {
  const filterId = parseInt(fId, 10)
  if (Array.isArray(state.selectedFilters)) {
    const idIndex = state.selectedFilters.indexOf(filterId)
    if (checked && idIndex === -1) {
      return [...state.selectedFilters, filterId]
    }
    if (!checked && idIndex > -1) {
      const a = [...state.selectedFilters]
      a.splice(idIndex, 1)
      return a
    }
    return [...state.selectedFilters]
  }
  if (checked) {
    return [filterId]
  }
  return []
}

export function visibleFilterService(selectedRecipes = [], allTags = []) {
  const visibleFilters = {}
  const filterList = []
  selectedRecipes.forEach((r) => {
    if (!r.hidden) {
      const ids = Object.keys(r.tagIds) || []
      ids.forEach((id) => {
        const i = parseInt(id, 10)
        visibleFilters[i] = allTags[i]
      })
    }
  })
  Object.keys(visibleFilters).forEach((f) => { // should probably remove
    filterList.push([f, visibleFilters[f]])
  })
  return visibleFilters // filterList is old implementation
}

export function selectedRecipeService(
  selectedFilters,
  state,
) {
  return state.selectedRecipes.map((r) => recipeReducer(
    r,
    selectedFilters,
  ))
}

function recipeReducer(recipe, filters) {
  let visible = true
  filters.forEach((f) => {
    visible = visible && recipe.tagIds[f]
  })
  return {
    ...recipe,
    hidden: !visible,
  }
}
