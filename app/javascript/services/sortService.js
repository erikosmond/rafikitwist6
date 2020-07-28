export function sortByName(array) {
  return array.sort(compareName)
}

const compareTagName = (allTags) => (a, b) => compare(allTags[a], allTags[b])

export function sortByTagName(array, allTags) {
  return array.sort(compareTagName(allTags))
}

export function sortRecipes(array) {
  return array.sort(compareRatingThenName)
}

function compareRatingThenName(a, b) {
  if (a.ratings && !b.ratings) return -1
  if (!a.ratings && b.ratings) return 1
  if (a.ratings && b.ratings) {
    if (a.ratings[0].tagName > b.ratings[0].tagName) return -1
    if (a.ratings[0].tagName < b.ratings[0].tagName) return 1
  }

  if (a.name > b.name) return 1
  if (a.name < b.name) return -1
  return 0
}

function compareName(a, b) {
  const aname = a.name.toUpperCase()
  const bname = b.name.toUpperCase()
  return compare(aname, bname)
}

function compare(a, b) {
  if (a > b) return 1
  if (a < b) return -1
  return 0
}
