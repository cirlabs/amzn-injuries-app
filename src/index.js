import '@babel/polyfill'
import 'normalize-css/normalize.css'
import 'core-js'

import fontLoader from 'font'
import map from 'map'
import tablesort from 'Tablesort'
import number from 'tablesort.number.js'
import autocomplete from 'autocomplete'

(function () {
  let app = {
    searchQuery: ''
  }

  const wireEvents = () => {}

  const handleSearchInput = (e) => {
    app.filteredIdList = e.detail.values
    map.setFilters(app.filteredIdList)

    // TODO: add handlers for map and table
  }

  const initAutoComplete = () => {
    let searchBars = document.getElementById('autocomplete')
    autocomplete.init(searchBars, SEARCH_TERMS, {
      queryChangeHandler: handleSearchInput
    })
  }

  document.addEventListener('DOMContentLoaded', function () {
    app.pymChild = new pym.Child()
    fontLoader.loadFonts()
    app.height = window.innerHeight
    app.width = window.innerWidth

    app.filteredIdList = INCIDENTS.features.map((f) => f.properties.id)
    map.init()
      .then((map) => {
        app.map = map
        wireEvents()
        app.pymChild.sendHeight()
      })

    let table = document.getElementById('table-sortable')
    number.shim(tablesort)
    let sort = tablesort(table, {
      descending: true
    })
    initAutoComplete()

    number.shim(tablesort)

    // issue event on expand and hide
    
    // refresh sorting, once searched
    // sort.refresh();

    app.pymChild.sendHeight()
  })

  // TODO: implement this
  app.handleError = (err) => { console.error(err) }

  window.app = app
}())
