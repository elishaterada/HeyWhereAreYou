angular
  .module('app')
  .component('session', {
    templateUrl: 'components/session.html',
    controller: SessionCtrl,
    bindings: {
      user: '<'
    }
  })

function SessionCtrl ($log, $interval, $timeout, $stateParams, $window, $firebaseArray, $firebaseObject, $localStorage, mapboxToken, mapboxgl) {
  var ctrl = this
  var map = null
  var intervalID

  var geo_options = {
    enableHighAccuracy: true,
    maximumAge        : 30000,
    timeout           : 27000
  }

  ctrl.$onInit = function () {
    // Get session
    ctrl.session = $firebaseArray(
      firebase.database().ref('sessions/' + $stateParams.id)
    )

    // Load markers anytime there is change in geolocations in the session
    ctrl.session.$watch(function(){
      if (map && map.loaded()) {
        loadMarkers()
      }
    })

    // Get existing user or create new one
    if($localStorage[$stateParams.id]) {
      initSessionUser($localStorage[$stateParams.id])
    } else {
      // Create new user in the session
      ctrl.session.$add({
        created: moment().format()
      }).then(function(ref) {
        $localStorage[$stateParams.id] = ref.key
        initSessionUser($localStorage[$stateParams.id])
      })
    }

    // Map init
    mapboxgl.accessToken = mapboxToken

    $timeout(function(){
      map = new mapboxgl.Map({
        container: 'graph-map',
        style: 'mapbox://styles/mapbox/dark-v9'
      })
    }, 0)

    intervalID = $interval(
      mapInitLoadMarkers, 250
    )
  }

  // User
  function initSessionUser (userStorage) {
    ctrl.sessionUser = $firebaseObject(
      firebase.database().ref('sessions/' + $stateParams.id).child(userStorage)
    )
    $window.navigator.geolocation.watchPosition(geoSuccess, geoError, geo_options)
  }

  // Map functions
  function mapInitLoadMarkers () {
    if (map && map.loaded()) {
      loadMarkers()
      $interval.cancel(intervalID)
    }
  }

  function loadMarkers () {
    var bounds = new mapboxgl.LngLatBounds()
    var numGeoLocations = 0
    var maxActive = 15 // minutes
    var now = moment()

    if(!ctrl.session || !ctrl.sessionUser) { return }

    _.each(ctrl.session, function (value, key) {

      var lastActive = now.diff(value.timestamp, 'minutes')
      var previousMarker = document.getElementById(value.$id)

      // Check for geolocation
      if(!value.timestamp) { return }

      // Skip if last active is more than a minute ago
      if(lastActive > maxActive) { return }

      // Remove old marker of same user
      if(previousMarker) {
        previousMarker.remove()
      }

      // Count how many profiles exists with geo locations
      numGeoLocations += 1

      // Extend boundary to reset map view later
      bounds.extend([value.longitude, value.latitude])

      var el = document.createElement('div')
      el.id = value.$id

      if(value.$id === ctrl.sessionUser.$id) {
        el.className = 'marker me'
      } else {
        el.className = 'marker other'
      }

      var marker = new mapboxgl.Marker(el)
        .setLngLat([value.longitude, value.latitude])
        .addTo(map)
    })

    if (numGeoLocations === 1) {
      // Assume the current user
      map.setZoom(20)
      map.setCenter([ctrl.sessionUser.longitude, ctrl.sessionUser.latitude])
    } else if (numGeoLocations > 1) {
      // Show all users
      map.fitBounds(bounds, { padding: 100 })
    }
  }

  // Geo location functions
  // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
  function geoSuccess(position) {
    ctrl.sessionUser.timestamp = position.timestamp
    ctrl.sessionUser.accuracy = position.coords.accuracy
    ctrl.sessionUser.latitude = position.coords.latitude
    ctrl.sessionUser.longitude = position.coords.longitude

    ctrl.sessionUser.$save()
  }

  function geoError() {
    $log.debug('no location available')
  }
}
