
const _map = {}
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

  return new Promise((resolve, reject) => {
    map.on('load', () => {
      document.getElementById('loadingIcon').classList.add('hide')
      document.getElementById('map').classList.remove('invisible')
      document.getElementById('legend').classList.remove('invisible')
      // map.setMaxBounds(map.getBounds())
      resolve(map)
    })
  })
}

export default _map
