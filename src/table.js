
import tablesort from 'Tablesort'
import number from 'tablesort.number.js'

const _table = {}

_table.init = (app) => {
  let table = document.getElementById('table-sortable')
  _table.table = table
  _table.app = app

  // resize ifram when show / hide happens
  document.getElementById("show").addEventListener("click", resizeiFrame)
  document.getElementById("hide").addEventListener("click", resizeiFrame)

  // sort by numbers 
  number.shim(tablesort)
  // default
  tablesort(table, {
    descending: true
  })
  
}


_table.setFilters = function (selectedIds) {
  if(!selectedIds) {
    document.querySelectorAll("#table-sortable tr")


  }

  selectedIds.forEach(key => {
    document.querySelector(`[data-facility='${key}']`).classList.remove("hide")
  });
  resizeiFrame()
}


const resizeiFrame = function() {
    setTimeout( function (){
      _table.app.pymChild.sendHeight()
    }, 0)
}



export default _table
