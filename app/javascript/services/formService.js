export function sortByName(array) {
  return array.sort(compareName)
}

function compareName(a, b) {
  const aname = a.name.toUpperCase()
  const bname = b.name.toUpperCase()
  return compare(aname, bname)
}

function compare(a, b) {
  let comparison = 0
  if (a > b) {
    comparison = 1
  } else if (a < b) {
    comparison = -1
  }
  return comparison
}
