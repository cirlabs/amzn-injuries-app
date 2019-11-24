const utils = {}

utils.wrapSubstring = function (str, substr, before, after) {
  let i = str.toUpperCase().indexOf(substr.toUpperCase())
  let l = substr.length
  before = before || "<span class='highlight'>"
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

utils.isScrolledIntoView = function (elem) {
  debugger
  let docViewTop = document.documentElement.scrollTop
  let docViewBottom = docViewTop + window.app.height
  return elem.offsetTop < docViewBottom && elem.offsetTop > docViewTop
}

export default utils
