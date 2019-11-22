
const _map = {}
const AMAZON_ORANGE = '#f38d20'
const DEFAULT_GREY = '#666'
const TOKEN = 'pk.eyJ1IjoiY2lyIiwiYSI6ImNqdnUyazF3ODE3a2EzeW1hZ2s5NHh3MG8ifQ.CDzm3odssJ7uOLPGrapc5Q'

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
          'circle-radius': ['match', ['get', 'valid'], 1, 5, 3],
          'circle-color': ['match', ['get', 'valid'], 1, AMAZON_ORANGE, 'rgba(0,0,0,0.1)'],
          'circle-stroke-color': ['match', ['get', 'valid'], 1, AMAZON_ORANGE, DEFAULT_GREY],
          'circle-stroke-width': 1

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
  let content = document.createElement('div')
  content.classList.add('tooltip-body')

  let h = document.createElement('h3')
  h.innerHTML = feature.id

  let sub = document.createElement('h5')
  sub.innerHTML = feature.city + ', ' + feature.state + ' &mdash; ' + feature.zip
  content.appendChild(h)
  content.appendChild(sub)
  content.appendChild(formatProperty('Uses robot',
    boolToString(feature.robots)))

  if (feature.valid === 1) {
    let deets = document.createElement('div')
    deets.classList.add('details')
    deets.appendChild(formatProperty('Injuries reported', feature.injuryCount))
    deets.appendChild(formatProperty('Serious injuries reported', feature.seriousCount))
    deets.appendChild(formatProperty('TRIR', toPrecision(feature.trir) + ' (' + toPrecision(feature.diffTrir) + 'x industry average)'))
    deets.appendChild(compareChart(toPrecision(feature.trir), META.trir))
    deets.appendChild(formatProperty('DART', toPrecision(feature.dart) + ' (' + toPrecision(feature.diffDart) + 'x industry average)'))
    deets.appendChild(compareChart(toPrecision(feature.dart), META.dart))
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

// const filterData = function (data, validOnly) {
//   let filterfx = (f) => typeof f.properties.injuryCount !== 'string'
//   if (!validOnly) {
//     filterfx = (f) => typeof f.properties.injuryCount === 'string'
//   }
//   let clonedData = JSON.parse(JSON.stringify(data))
//   clonedData.features = clonedData.features.filter(filterfx)
//     .map((f) => {
//       f.valid = validOnly
//       return f
//     })
//   return clonedData
// }

const boolToString = function (bool) {
  if (typeof bool !== 'boolean') {
    return 'Unknown'
  }
  return bool ? 'yes' : 'no'
}
export default _map
