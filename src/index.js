import '@babel/polyfill'
import 'normalize-css/normalize.css'
import 'core-js'

import fontLoader from 'font'
import map from 'map'
import tablesort from 'Tablesort'


(function () {
  let app = {}

  const wireEvents = () => {}

  document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded')
    app.pymChild = new pym.Child()
    fontLoader.loadFonts()
    app.height = window.innerHeight
    app.width = window.innerWidth

    map.init()
      .then((map) => {
        app.map = map
        wireEvents()
        app.pymChild.sendHeight()
      })
    
    var table =  document.getElementById('table-sortable');
    var sort = new tablesort(table);
    
    // refresh sorting, once searched
    // sort.refresh();

    app.pymChild.sendHeight()
   
  })

  // TODO: implement this
  app.handleError = (err) => { console.error(err) }

  window.app = app
}())
