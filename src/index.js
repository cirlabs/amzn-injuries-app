import '@babel/polyfill'
import 'normalize-css/normalize.css'
import 'core-js'

import fontLoader from 'font'
import map from 'map'

(function () {
  let app = {}

  const wireEvents = () => {}

  document.addEventListener('DOMContentLoaded', function () {
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
    app.pymChild.sendHeight()
  })

  // TODO: implement this
  app.handleError = (err) => { console.error(err) }

  window.app = app
}())
