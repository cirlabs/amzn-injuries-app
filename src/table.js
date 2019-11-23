
import tablesort from 'Tablesort'
import number from 'tablesort.number.js'

const _table = {}

_table.init = (app) => {
  // initiate 
  let table = document.getElementById('table-sortable')
  console.log(table)
  number.shim(tablesort)
  tablesort(table, {
    descending: true
  })
  number.shim(tablesort)

  // issue event on expand and hide
  
  // refresh sorting, once searched
  // sort.refresh();

//   app.pymChild.sendHeight()

  _table.table = table
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





export default _table
