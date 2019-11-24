
import tablesort from 'Tablesort'
import number from 'tablesort.number.js'

const _table = {}

_table.init = (app) => {
  let table = document.getElementById('table-sortable')
  _table.table = table
  _table.app = app

  // resize iframe when show / hide happens
  document.getElementById("show").addEventListener("click", resizeiFrame)
  document.getElementById("hide").addEventListener("click", resizeiFrame)

  // add support for sorting numeric values 
  number.shim(tablesort)
  // default
  tablesort(table, {
    descending: true
  })
  
  resizeiFrame()
}

_table.setFilters = function (selectedIds) {
  if(!selectedIds || selectedIds === null) {
    let rows = document.querySelectorAll("#table-sortable tbody tr, .action")
    showAll(rows)
    return
  }

  let items = document.querySelectorAll("#table-sortable tbody tr, .action")
  hideAll(items)

  selectedIds.forEach(key => {
    document.querySelector(`[data-facility='${key}']`).classList.remove("hide-row")
  });
  resizeiFrame()
}

const showAll = function(items) {
  for (var i = 0; i < items.length; i++) {
    items[i].classList.remove("hide-row")
  }
}

const hideAll = function(items) {
  for (var i = 0; i < items.length; i++) {
    items[i].classList.add("hide-row")
  }
}

const resizeiFrame = function() {
    setTimeout( function (){
      _table.app.pymChild.sendHeight()
    }, 0)
}



export default _table
