import '@babel/polyfill'
import 'normalize-css/normalize.css'
import 'core-js'

import fontLoader from 'font'
import map from 'map'
import table from 'table'

import autocomplete from 'autocomplete'

(function () {
  let app = {
    searchQuery: '',
    smallScreen: true
  }

  const wireEvents = () => {
    window.addEventListener('resize', () => {
      app.height = window.innerHeight
      app.width = window.innerWidth
      if (app.width <= 600) {
        app.screenSize = 's'
      } else if (app.width <= 480) {
        app.screenSize = 'xs'
      }
      map.resetMap()
    })
  }

  const handleSearchInput = (e) => {
    app.filteredIdList = e.detail.values
    map.setFilters(app.filteredIdList)

    table.setFilters(app.filteredIdList)
    console.log('handle' + app.filteredIdList)
    // TODO: add handlers for map
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

    table.init(app)

    initAutoComplete()
    app.pymChild.sendHeight()
  })

  // TODO: implement this
  app.handleError = (err) => { console.error(err) }

  window.app = app
}())
