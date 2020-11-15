function compare(a, b) {
  if (a > b) return 1
  if (a < b) return -1
  return 0
}

function compareName(a, b) {
  const aname = a.name.toUpperCase()
  const bname = b.name.toUpperCase()
  return compare(aname, bname)
}

const compareTagName = (allTags) => (a, b) => compare(allTags[a], allTags[b])

const priotiesRanks = {
  'On Deck': 5,
  'Highest priority': 4,
  'High priority': 3,
  'Medium priority': 2,
  'Low priority': 1,
}

export function sortByName(array) {
  return array.sort(compareName)
}

export function sortByTagName(array, allTags) {
  return array.sort(compareTagName(allTags))
}

function compareRecipeTagsAndName(a, b) {
  if (a.priorities && a.priorities[0].tagName === 'On Deck') return 1
  if (b.priorities && b.priorities[0].tagName === 'On Deck') return -1
  if (a.ratings && !b.ratings) return -1
  if (!a.ratings && b.ratings) return 1
  if (a.ratings && b.ratings) {
    if (a.ratings[0].tagName > b.ratings[0].tagName) return -1
    if (a.ratings[0].tagName < b.ratings[0].tagName) return 1
  }

  if (a.priorities && !b.priorities) return -1
  if (!a.priorities && b.priorities) return 1
  if (a.priorities && b.priorities) {
    if (priotiesRanks[a.priorities[0].tagName] > priotiesRanks[b.priorities[0].tagName]) return -1
    if (priotiesRanks[a.priorities[0].tagName] < priotiesRanks[b.priorities[0].tagName]) return 1
  }
  return compareName(a, b)
}

export function sortRecipes(array) {
  return array.sort(compareRecipeTagsAndName)
}
