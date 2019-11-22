const utils = {}

utils.wrapSubstring = function (str, substr, before, after) {
  let i = str.toUpperCase().indexOf(substr.toUpperCase())
  let l = substr.length
  before = before || "<span class='yellow-bg black-fg'>"
  after = after || '</span>'
  return `${str.substr(0, i)}${before}${str.substr(i, l)}${after}${str.substr(i + l)}`
}

utils.collectionContains = function (collection, el) {
  let id = el.getAttribute('id')
  if (id) {
    return collection.namedItem(id) !== null
  }
  let ret = false
  for (let i in collection) {
    ret = ret || collection.item(i) === el
    if (ret) {
      break
    }
  }
  return ret
}
export default utils
