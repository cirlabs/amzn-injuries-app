import utils from 'utils'

const _state = {
  options: {},
  currentFocus: null,
  query: '',
  valuesList: {},
  wordLists: {},
  categories: [],
  inputEl: null
}

// const addEventListenerToCollection = function (collection, event, handler) {
//   for (let i = 0; i < inputEls.length; i++) {
//     collection.item(i).addEventListener(event, handler)
//   }
// }

const setValueInInput = function (value) {
  _state.query = value
  _state.inputEl.value = _state.query
}

const setValidValue = function () {
  // let currVal = _state.query
  // let allVals = true

  _state.inputEl.value = _state.query

  // if (!allVals || !wordList.includes(currVal)) {
  //   currVal = window.app.searchQuery
  //   setValueInInputs(inputEls, currVal)
  // }
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
  if (elmnt && elmnt === _state.inputEl) {
    // reset state and raise event
    _state.inputEl.dispatchEvent(new window.CustomEvent('queryChanged',
      {
        detail: {
          query: '',
          values: null
        }
      }))
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
  _state.query = e.target.innerText
  setValueInInput(e.target.innerText)
  closeAllLists()
  // selection made event
  _state.inputEl.dispatchEvent(new window.CustomEvent('queryChanged', { detail:
    {
      query: _state.query,
      values: _state.valuesList[_state.query]
    }
  }))
}

const addItemsToList = function (matches, val = null) {
  closeAllLists()
  _state.currentFocus = -1

  // create a div element that will contain the items (values):
  const div = document.createElement('div')
  div.setAttribute('id', this.id + '-autocomplete-list')
  div.setAttribute('class', 'autocomplete-items')
  this.parentNode.appendChild(div)

  let totalMatchesCount = 0
  for (let cat of _state.categories) {
    let items = matches[cat]

    if (!items || items.length === 0) {
      continue
    } else {
      totalMatchesCount += items.count

      const opt = document.createElement('div')
      opt.classList.add('divider')
      opt.innerHTML = cat
      div.appendChild(opt)

      for (let el of items) {
        const opt = document.createElement('div')
        opt.classList.add('item')
        opt.innerHTML = `${utils.wrapSubstring(el, val)}
          <input type='hidden' value='${el}'>`

        // handle selection
        opt.addEventListener('click', selectionHandler)
        div.appendChild(opt)
      }
    }
  }

  if (totalMatchesCount === 0) {
    const noRes = document.createElement('div')
    noRes.innerHTML = 'No matching Amazon warehouse found.'
    noRes.classList = 'notfound'
    div.appendChild(noRes)
    // notify about invalid query
    _state.inputEl.dispatchEvent(new window.CustomEvent('queryChanged',
      {
        detail: {
          query: val,
          values: []
        }
      }))
  }
}

const inputHandler = function (e) {
  _state.query = this.value

  if (!_state.query) {
    closeAllLists()
    return
  }

  let matches = {}

  // for each item in the array...
  for (let cat of _state.categories) {
    matches[cat] = []
    for (let el of _state.wordLists[cat]) {
      if (matches[cat].length === _state.options.maxItems) {
        break
      }
      if (el.toUpperCase().includes(_state.query.toUpperCase())) {
        matches[cat].push(el)
      }
    }
  }
  addItemsToList.bind(this)(matches, _state.query)
}

const removeActive = function (x) {
  // a function to remove the 'active' class from all autocomplete items:
  for (let el of x) {
    el.classList.remove('autocomplete-active')
  }
}

const addActive = function (x) {
  if (!x) return false

  let currentFocus = _state.currentFocus

  removeActive(x)
  if (currentFocus >= x.length) currentFocus = 0
  if (currentFocus < 0) currentFocus = (x.length - 1)

  x[currentFocus].classList.add('autocomplete-active')
}

const keyDownHandler = function (e) {
  let x = document.getElementById(this.id + '-autocomplete-list')
  if (x) x = x.getElementsByClassName('item')
  if (e.keyCode === 40) {
    // If the arrow DOWN key is pressed, increase the currentFocus variable:
    _state.currentFocus++
    // and and make the current item more visible:
    addActive(x)
  } else if (e.keyCode === 38) { // up
    // If the arrow UP key is pressed, decrease the currentFocus variable:
    _state.currentFocus--
    // and and make the current item more visible:
    addActive(x)
  } else if (e.keyCode === 13) {
    e.preventDefault()
    if (_state.currentFocus > -1) {
      if (x) x[_state.currentFocus].click()
    }
  }
}

// clicks text box
const clickHandler = function (elmnt) {
  this.value = null
  _state.query = null
  inputHandler.bind(this)(elmnt)
}

const _autocomplete = {}

_autocomplete.init = function (input, words, optionsOverrides = {}) {
  let defaultOptions = {
    maxItems: 5,
    queryChangeHandler: null
  }

  _state.options = Object.assign(defaultOptions, optionsOverrides)
  _state.inputEl = input

  _state.categories = Object.keys(words)
  for (let k of _state.categories) {
    _state.wordLists[k] = Object.keys(words[k]).sort()
    Object.assign(_state.valuesList, words[k])
  }

  // handle click to dropdown
  input.addEventListener('click', clickHandler)

  // Handle input to the text box
  input.addEventListener('input', inputHandler)

  // handle keyboard nav
  input.addEventListener('keydown', keyDownHandler)

  input.addEventListener('queryChanged', _state.options.queryChangeHandler)

  // handle click away from autocompletes
  document.addEventListener('click', function (e) {
    closeAllLists(e.target)
  })
}

// _autocomplete.setQuery = function (query) {
//   setValueInInputs(inputEls, query)
// }

export default _autocomplete
