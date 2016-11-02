angular
  .module('app', [
    'ngAnimate',
    'ngMaterial',
    'ngAria',
    'ngStorage',
    'ui.router',
    'firebase'
  ])
  .controller('AppCtrl', AppCtrl)
  .config(config)
  .run(run)
  .constant('_', _)
  .constant('moment', moment)
  .constant('mapboxgl', mapboxgl)
  .constant('mapboxToken', 'pk.eyJ1IjoiZWxpc2hhdGVyYWRhIiwiYSI6ImNpdXo1c2JkejA1NnkyemwxdGJhcWVqbW8ifQ.wYvVE-loAnN1jq2WlqnR3g')

function config (
  $animateProvider,
  $mdThemingProvider,
  $urlRouterProvider,
  $stateProvider,
  $locationProvider
) {
  // ng-animate disable method
  $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/)

  // Angular Material Setup
  // Angular Material Setup
  $mdThemingProvider.definePalette('customPalette', {
    '50': 'E1F5FE',
    '100': 'B3E5FC',
    '200': '81D4FA',
    '300': '4FC3F7',
    '400': '29B6F6',
    '500': '03A9F4',
    '600': '039BE5',
    '700': '0288D1',
    '800': '0277BD',
    '900': '01579B',
    'A100': '80D8FF',
    'A200': '40C4FF',
    'A400': '00B0FF',
    'A700': '0091EA',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', // hues which contrast should be 'dark' by default
      '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'
  })

  $mdThemingProvider.theme('custom')
    .primaryPalette('customPalette')

  $mdThemingProvider.theme('custom-dark')
    .primaryPalette('customPalette')
    .dark()

  $mdThemingProvider.setDefaultTheme('custom')

  // HTML 5 Mode
  $locationProvider
    .html5Mode({
      enabled: true,
      requireBase: true
    })

  // Router Setup
  $urlRouterProvider.when('', '/')
  $urlRouterProvider.otherwise('/notfound')

  // State Setup
  $stateProvider

  // Landing
    .state('landing', {
      url: '/',
      component: 'landing'
    })

    .state('sessions', {
      url: '/sessions/:id',
      component: 'session'
    })

    // Not Found
    .state('notfound', {
      url: '/notfound',
      component: 'notFound'
    })
}

function run () {
  var config = {
    apiKey: 'AIzaSyDq7YJhhf8hX24SppdPgK3DZTK-pZPJN9Q',
    authDomain: 'hey-where-are-you.firebaseapp.com',
    databaseURL: 'https://hey-where-are-you.firebaseio.com',
    storageBucket: 'hey-where-are-you.appspot.com'
  }

  firebase.initializeApp(config)
}

function AppCtrl () {
}
