
const _map = {}
const AMAZON_ORANGE = '#f38d20'
const DEFAULT_GREY = '#666'
const TOKEN = 'pk.eyJ1IjoiY2lyIiwiYSI6ImNqdnUyazF3ODE3a2EzeW1hZ2s5NHh3MG8ifQ.CDzm3odssJ7uOLPGrapc5Q'

// TODO: replace with new one
const STYLE = 'mapbox://styles/cir/ck372mcpu087g1cp8olbifhus'
const WAREHOUSE_LAYER = 'warehouses'
const UNKNOWNS_LAYER = 'unknowns'
const WAREHOUSE_FILTER = ['==', 'valid', 1]
const UNKNOWNS_FILTER = ['==', 'valid', 0]
const HIDE_ALL = ['==', 'valid', 3]
const STEP_COUNT = 10
const DEFAULT_BBOX = [[-122.8, 25], [-69.5, 48.8]]
const COLORS = ['#00429d', '#3c66ae', '#5f8bbe', '#82b2cf', '#acd7df', '#ffcab9', '#fd9291', '#e75d6f', '#c52a52', '#93003a']

mapboxgl.accessToken = TOKEN

_map.init = () => {
  const bounds = new mapboxgl.LngLatBounds(DEFAULT_BBOX)
  const map = new mapboxgl.Map({
    container: 'map',
    style: STYLE,
    maxZoom: 6,
    bounds: bounds,
    fitBoundsOptions: { padding: 20 }
  })
  _map.map = map

  return new Promise((resolve, reject) => {
    map.on('load', () => {
      map.addSource('incidents', {
        'type': 'geojson',
        'data': INCIDENTS
      })

      map.addLayer({
        'id': WAREHOUSE_LAYER,
        'type': 'circle',
        'source': 'incidents',
        'paint': {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 5, 10, 15],
          'circle-color': createStyle(),
          'circle-stroke-color': ['case', ['boolean', ['feature-state', 'hover'], false], AMAZON_ORANGE, DEFAULT_GREY],
          'circle-stroke-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2, 1],
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 10, 0.4]
        },
        'filter': ['==', 'valid', 1]
      })
      map.addLayer({
        'id': UNKNOWNS_LAYER,
        'type': 'circle',
        'source': 'incidents',
        'paint': {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 3, 10, 7],
          'circle-color': 'rgba(0,0,0,0.3)',
          'circle-stroke-color': ['case', ['boolean', ['feature-state', 'hover'], false], AMAZON_ORANGE, DEFAULT_GREY],
          'circle-stroke-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2, 0.5]
        },
        'filter': ['all', ['==', 'valid', 0]]
      }, WAREHOUSE_LAYER)

      document.getElementById('loadingIcon').classList.add('hide')
      document.getElementById('map').classList.remove('invisible')
      // document.getElementById('legend').classList.remove('invisible')
      map.setMaxBounds(map.getBounds())
      map.doubleClickZoom.enable()
      setPopups(map)
      resolve(map)
    })
  })
}

_map.setFilters = function (selectedIds) {
  setHoverState(this.map, null)
  hideInfo()

  let filters = buildFilters(selectedIds)
  this.map.setFilter(UNKNOWNS_LAYER, filters[0])
  this.map.setFilter(WAREHOUSE_LAYER, filters[1])

  if (selectedIds && selectedIds.length === 1) {
    this.map.flyTo({ center: getCoordinates(selectedIds[0]), zoom: 5 })
    return
  }
  this.map.fitBounds(new mapboxgl.LngLatBounds(getBbox(selectedIds)), { padding: 20 })
}

_map.resetMap = function () {
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

const setHoverState = function (map, id) {
  if (window.app.currentHover) {
    map.setFeatureState({ source: 'incidents', id: window.app.currentHover }, { hover: false })
  }
  if (id) {
    map.setFeatureState({ source: 'incidents', id: id }, { hover: true })
    window.app.currentHover = id
  }
}

const hideInfo = function() {
  let defaultInfo = document.getElementById('defaultInfo')
  defaultInfo.classList.remove('hide')
  let content = document.getElementById('innerInfobox')
  content.classList.add('hide')
}
const setPopups = (map) => {
  // const popup = new mapboxgl.Popup({
  //   closeButton: false,
  //   closeOnClick: true
  // })
  const showPopup = function (e) {
    e.originalEvent.preventDefault()
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer'

    // pick most prominent feature from under the cursor
    let feature = e.features[0].properties
    setHoverState(map, e.features[0].id)
    tooltipBody(feature)
    let defaultInfo = document.getElementById('defaultInfo')
    defaultInfo.classList.add('hide')
    let content = document.getElementById('innerInfobox')
    content.classList.remove('hide')
  }
  const hidePopup = function (e) {
    map.getCanvas().style.cursor = ''
  }

  map.on('mouseenter', UNKNOWNS_LAYER, showPopup)
  map.on('mouseleave', UNKNOWNS_LAYER, hidePopup)
  map.on('click', UNKNOWNS_LAYER, showPopup)
  map.on('mouseenter', WAREHOUSE_LAYER, showPopup)
  map.on('mouseleave', WAREHOUSE_LAYER, hidePopup)
  map.on('click', WAREHOUSE_LAYER, showPopup)

  document.getElementById('mapHolder').addEventListener('mouseleave', hidePopup)
}

const toPrecision = function (num) {
  if (typeof num === 'string') {
    return num
  }
  return Math.round(num * 100) / 100
}

const formatProperty = function (key, value) {
  let p = document.createElement('p')

  let keyDisplay = document.createElement('span')
  keyDisplay.classList.add('key')
  keyDisplay.innerText = key
  p.appendChild(keyDisplay)
  p.innerHTML = p.innerHTML + ': ' + value
  return p
}

const tooltipBody = function (feature) {
  let content = document.getElementById('innerInfobox')
  content.innerHTML = ''
  let h = document.createElement('h3')
  h.innerHTML = '<span class="indicator"></span>' + feature.id

  let sub = document.createElement('h5')
  sub.innerHTML = feature.city + ', ' + feature.state + ' &mdash; ' + feature.zipcode
  content.appendChild(h)
  content.appendChild(sub)

  if (feature.valid === 1) {
    let deets = document.createElement('div')
    deets.classList.add('details')
    deets.appendChild(formatProperty('Uses robots',
      boolToString(feature.robots)))
    deets.appendChild(formatProperty('Injuries reported', feature.injuryCount))
    deets.appendChild(formatProperty('Serious injury rates', toPrecision(feature.dart) + '(' + toPrecision(feature.diffDart) + 'x industry average'))
    deets.appendChild(compareChart(toPrecision(feature.dart), META.dart))
    content.appendChild(deets)
  } else {
    let deets = document.createElement('p')
    deets.classList.add('contact')
    deets.innerText = "We don't have the records. If you work or have worked here, "

    let a = document.createElement('a')
    let linkText = document.createTextNode('here')
    a.appendChild(linkText)
    a.title = 'Revealnews: Amazon records'
    a.href = 'https://www.revealnews.org/amazonrecords'
    deets.appendChild(a)

    let text = document.createTextNode('\'s how you can get the records.')
    deets.appendChild(text)
    content.appendChild(deets)
  }
  return content.outerHTML
}

const compareChart = function (curr, baseline) {
  if (typeof curr === 'string') {
    return ''
  }
  let stepSize = baseline.max / STEP_COUNT
  let currStep = Math.floor(curr / stepSize)
  let indAvgStep = Math.floor(baseline.industry_avg / stepSize)

  let outerDiv = document.createElement('div')
  outerDiv.classList.add('comparer-chart')
  let label = document.createElement('p')
  label.innerText = 0
  outerDiv.appendChild(label)
  for (let i = 0; i < STEP_COUNT; i++) {
    let span = document.createElement('span')
    if (i <= currStep) {
      span.classList.add('bg-cat-' + (i + 1))
    } else {
      span.classList.add('bg-default')
    }
    if (i === currStep) {
      span.classList.add('curr-step')
      span.dataset['curr'] = curr
    }
    if (i === indAvgStep && i !== currStep) {
      span.classList.add('ind-avg-step')
      span.classList.add('fg-cat-' + currStep)
      span.dataset['avg'] = baseline.industry_avg
    }
    outerDiv.appendChild(span)
  }
  label = document.createElement('p')
  label.innerText = baseline.max
  outerDiv.appendChild(label)
  return outerDiv
}

const getCoordinates = (id) => {
  const feature = INCIDENTS.features.find((f) => f.properties.id === id)
  return feature.geometry.coordinates
}

const getBbox = (selectedIds) => {
  if (!selectedIds || selectedIds.length === 0) {
    return DEFAULT_BBOX
  }

  const features = INCIDENTS.features.filter((f) => selectedIds.includes(f.properties.id))

  const lats = []
  const lngs = []
  for (let f of features) {
    const coords = f.geometry.coordinates
    lngs.push(coords[0])
    lats.push(coords[1])
  }

  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)]
  ]
}

const boolToString = function (bool) {
  if (typeof bool !== 'boolean') {
    return 'Unknown'
  }
  return bool ? 'yes' : 'no'
}

const createStyle = () => {
  let baseline = META.trir
  let stepSize = baseline.max / STEP_COUNT
  let conditions = ['step', ['get', 'trir'], 'red']
  for (let i = 0; i < STEP_COUNT; i++) {
    conditions.push(i * stepSize)
    conditions.push(COLORS[i])
  }
  return conditions
}

export default _map
