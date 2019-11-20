
const _map = {}
const AMAZON_ORANGE = '#f38d20'
const TOKEN = 'pk.eyJ1IjoiY2lyIiwiYSI6ImNqdnUyazF3ODE3a2EzeW1hZ2s5NHh3MG8ifQ.CDzm3odssJ7uOLPGrapc5Q'

// TODO: replace with new one
const STYLE = 'mapbox://styles/cir/ck372mcpu087g1cp8olbifhus'

mapboxgl.accessToken = TOKEN

_map.init = () => {
  const map = new mapboxgl.Map({
    container: 'map',
    style: STYLE,
    maxZoom: 15,
    fitBoundsOptions: { padding: 20 }
  })
  _map.map = map
    // map.setBounds({ '_sw': {"lng":-126.34948837523882,"lat":23.653877779353053},"_ne":{"lng":-70.1761206403349,"lat":51.49357860804878}})

  return new Promise((resolve, reject) => {
    map.on('load', () => {
      map.addSource('incidents', {
        'type': 'geojson',
        'data': INCIDENTS
      })
      map.addLayer({
        'id': 'warehouses',
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
      resolve(map)
    })
  })
}

export default _map
