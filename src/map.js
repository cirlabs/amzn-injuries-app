
const _map = {}
const AMAZON_ORANGE = '#f38d20'
const TOKEN = 'pk.eyJ1IjoiY2lyIiwiYSI6ImNqdnUyazF3ODE3a2EzeW1hZ2s5NHh3MG8ifQ.CDzm3odssJ7uOLPGrapc5'

// TODO: replace with new one
const STYLE = 'mapbox://styles/cir/ck372mcpu087g1cp8olbifhus'
const WAREHOUSE_LAYER = 'warehouses'
const STEP_COUNT = 10

mapboxgl.accessToken = TOKEN

_map.init = () => {
  const bounds = new mapboxgl.LngLatBounds([
    [-122.8, 25], [-69.5, 48.8]
  ])
  const map = new mapboxgl.Map({
    container: 'map',
    style: STYLE,
    maxZoom: 15,
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
          'circle-radius': 4,
          'circle-color': AMAZON_ORANGE
        }
      })
      document.getElementById('loadingIcon').classList.add('hide')
      document.getElementById('map').classList.remove('invisible')
      // document.getElementById('legend').classList.remove('invisible')
      map.setMaxBounds(map.getBounds())
      setPopups(map)
      resolve(map)
    })
  })
}

const setPopups = (map) => {
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true
  })
  map.on('mouseenter', WAREHOUSE_LAYER, function (e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer'

    let feature = e.features[0].properties

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(e.lngLat)
      .setHTML(tooltipBody(feature))
      .addTo(map)
  })

  // map.on('mouseleave', WAREHOUSE_LAYER, function () {
  //   map.getCanvas().style.cursor = ''
  //   popup.remove()
  // })
}

const toPrecision = function (num) {
  if (typeof num === 'string') {
    return num
  }
  return Math.round(num * 100) / 100
}

const tooltipBody = function (feature) {
  return '<div class="tooltip-body">' +
  '<p><b>Facility</b>: ' + feature.id + '</p>' +
  '<p><b>City</b>: ' + feature.city + ', ' + feature.state + '</p>' +
  '<p><b>All reported injuries</b>: ' + feature.injuryCount + '</p>' +
  '<p><b>Serious injuries</b>: ' + feature.seriousCount + '</p>' +
  '<p><b>DART</b>(▼): ' + toPrecision(feature.dart) + '</p>' +
  compareChart(toPrecision(feature.dart), META.dart) +
  '<p><em class="compare">It is ' + toPrecision(feature.diffDart) + ' times the industry average(▲) ' + toPrecision(META.dart.industry_avg) + '</em></p>' +
  '<p><b>TRIR</b>(▼): ' + toPrecision(feature.trir) + '</p>' +
  compareChart(toPrecision(feature.trir), META.trir) +
  '<p><em class="compare">It is ' + toPrecision(feature.diffTrir) + ' times the industry average(▲) ' + toPrecision(META.trir.industry_avg) + '</em></p>' +
  '<p><b>Robots used</b>: ' + feature.robots + '</p></div>'
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
      span.classList.add('bg-cat-' + currStep)
    } else {
      span.classList.add('bg-default')
    }
    if (currStep === i) {
      span.classList.add('curr-step')
      span.dataset['curr'] = curr
    }
    if (i === indAvgStep) {
      span.classList.add('ind-avg-step')
      span.classList.add('fg-cat-' + currStep)
    }
    outerDiv.appendChild(span)
  }
  label = document.createElement('p')
  label.innerText = baseline.max
  outerDiv.appendChild(label)
  return outerDiv.outerHTML
}

export default _map
