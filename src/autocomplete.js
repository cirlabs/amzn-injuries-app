import utils from 'utils'

let currentFocus
let inputEls
let wordList
let options
let valueMap

const addEventListenerToCollection = function (collection, event, handler) {
  for (let i = 0; i < inputEls.length; i++) {
    collection.item(i).addEventListener(event, handler)
  }
}

const setValueInInputs = function (collection, value) {
  for (let i = 0; i < inputEls.length; i++) {
    collection.item(i).value = value
  }
}

const setValidValue = function () {
  let currVal = inputEls.item(0).value
  let allVals = true

  for (let i = 1; i < inputEls.length; i++) {
    allVals = allVals && inputEls.item(i).value === currVal
  }

  if (!allVals || !wordList.includes(currVal)) {
    currVal = window.app.searchQuery
    setValueInInputs(inputEls, currVal)
  }
  // inputEls.item(0).dispatchEvent(new window.CustomEvent('queryChanged',
  //   { detail: {
  //     query: currVal,
  //     values: valueMap[currVal]
  //   }
  //   }))
}

const closeAllLists = function (elmnt) {
  let x = document.getElementsByClassName('autocomplete-items')

  // ignore if click is triggered on an inputEl
  if (elmnt && utils.collectionContains(inputEls, elmnt)) {
    return
  }

  for (let el of x) {
    el.parentNode.removeChild(el)
  }

  if (elmnt) {
    setValidValue()
  }
}

const selectionHandler = function (e) {
  const query = this.getElementsByTagName('input')[0].value
  setValueInInputs(inputEls, query)
  closeAllLists()
  console.log('here', query, valueMap[query]);
  inputEls.item(0).dispatchEvent(new window.CustomEvent('queryChanged', { detail:
    {
      query: query,
      values: valueMap[query]
    }
  }))
}

const addItemsToList = function (items, val = null) {
  closeAllLists()
  currentFocus = -1

  // create a div element that will contain the items (values):
  const div = document.createElement('div')
  div.setAttribute('id', this.id + '-autocomplete-list')
  div.setAttribute('class', 'autocomplete-items')
  this.parentNode.appendChild(div)

  for (let el of items) {
    const opt = document.createElement('div')
    opt.innerHTML = `${utils.wrapSubstring(el, val)}
      <input type='hidden' value='${el}'>`

    // handle selection
    opt.addEventListener('click', selectionHandler)
    div.appendChild(opt)
  }
  if (!items || items.length === 0) {
    const noRes = document.createElement('div')
    noRes.innerHTML = 'No matching Amazon warehouse found.'
    noRes.classList = 'notfound'
    div.appendChild(noRes)
  }
}

const inputHandler = function (e) {
  let val = this.value
  if (!val) {
    closeAllLists()
    return
  }

  let matches = []
  // for each item in the array...
  for (let el of wordList) {
    if (matches.length === options.maxItems) {
      break
    }
    if (el.toUpperCase().includes(val.toUpperCase())) {
      matches.push(el)
    }
  }
  addItemsToList.bind(this)(matches, val)
}

const removeActive = function (x) {
  // a function to remove the 'active' class from all autocomplete items:
  for (let el of x) {
    el.classList.remove('autocomplete-active')
  }
}

const addActive = function (x) {
  if (!x) return false

  removeActive(x)
  if (currentFocus >= x.length) currentFocus = 0
  if (currentFocus < 0) currentFocus = (x.length - 1)

  x[currentFocus].classList.add('autocomplete-active')
}

const keyDownHandler = function (e) {
  let x = document.getElementById(this.id + '-autocomplete-list')
  if (x) x = x.getElementsByTagName('div')
  if (e.keyCode === 40) {
    // If the arrow DOWN key is pressed, increase the currentFocus variable:
    currentFocus++
    // and and make the current item more visible:
    addActive(x)
  } else if (e.keyCode === 38) { // up
    // If the arrow UP key is pressed, decrease the currentFocus variable:
    currentFocus--
    // and and make the current item more visible:
    addActive(x)
  } else if (e.keyCode === 13) {
    e.preventDefault()
    if (currentFocus > -1) {
      if (x) x[currentFocus].click()
    }
  }
}

const clickHandler = function (elmnt) {
  this.value = null
  inputHandler.bind(this)(elmnt)
}

const _autocomplete = {}

_autocomplete.init = function (inputs, words, optionsOverrides = {}) {
  let defaultOptions = {
    maxItems: 10,
    queryChangeHandler: null
  }

  options = Object.assign(defaultOptions, optionsOverrides)
  inputEls = inputs
  wordList = Object.keys(words)
  valueMap = words

  // handle click to dropdown
  addEventListenerToCollection(inputs, 'click', clickHandler)

  // Handle input to the text box
  addEventListenerToCollection(inputs, 'input', inputHandler)

  // handle keyboard nav
  addEventListenerToCollection(inputs, 'keydown', keyDownHandler)

  // handle click away from autocompletes
  document.addEventListener('click', function (e) {
    closeAllLists(e.target)
  })

  addEventListenerToCollection(inputs, 'queryChanged', options.queryChangeHandler)
}

_autocomplete.setCity = function (query) {
  setValueInInputs(inputEls, query)
}

export default _autocomplete
