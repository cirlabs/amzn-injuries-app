
const _map = {}
const AMAZON_ORANGE = '#f38d20'
const TOKEN = 'pk.eyJ1IjoiY2lyIiwiYSI6ImNqdnUyazF3ODE3a2EzeW1hZ2s5NHh3MG8ifQ.CDzm3odssJ7uOLPGrapc5Q'

// TODO: replace with new one
const STYLE = 'mapbox://styles/cir/ck372mcpu087g1cp8olbifhus'
const WAREHOUSE_LAYER = 'warehouses'

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
    console.log(e.features.length)

    let location = feature.city + ', ' + feature.state
    let dart = feature.dart + ' (' + toPrecision(feature.diffDart) + ' times the industry average)'

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(e.lngLat)
      .setHTML('<h3>' + location + '</h3><p>' + dart + '</p>')
      .addTo(map)
  })

  map.on('mouseleave', WAREHOUSE_LAYER, function () {
    map.getCanvas().style.cursor = ''
    popup.remove()
  })
}

const toPrecision = function (num) {
  return Math.round(num * 100) / 100
}
export default _map
