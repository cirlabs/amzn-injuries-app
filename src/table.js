
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


  // issue event on expand and hide
  
  // refresh sorting, once searched
  // sort.refresh();

 
  
}


_table.setFilters = function (selectedIds) {
  
//   let filters = buildFilters(selectedIds)
//   this.table.setFilter(UNKNOWNS_LAYER, filters[0])
//   this.table.setFilter(WAREHOUSE_LAYER, filters[1])

//   if (selectedIds && selectedIds.length === 1) {
//     this.table.zoomTo(5)
//     this.table.setCenter(getCoordinates(selectedIds[0]))
//     return
//   }
//   this.table.fitBounds(new tableboxgl.LngLatBounds(getBbox(selectedIds)), { padding: 20 })
}

_table.resettable = function () {
  this.setFilters(null)
}

const buildFilters = function (selectedIds) {
  if (!selectedIds) {
    return [UNKNOWNS_FILTER, WAREHOUSE_FILTER]
  }
  if (selectedIds.length === 0) {
    return [HIDE_ALL, HIDE_ALL]
  }
  let clause = ['in', 'id'].concat(selectedIds)
  return [['all', UNKNOWNS_FILTER, clause], ['all', WAREHOUSE_FILTER, clause]]
}

const resizeiFrame = function() {
    setTimeout( function (){
      _table.app.pymChild.sendHeight()
    }, 0)
}



export default _table
