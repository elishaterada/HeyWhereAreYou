angular
  .module('app')
  .component('main', {
    templateUrl: 'components/main.html',
    controller: MainCtrl
  })

function MainCtrl ($mdSidenav, $timeout, $state) {
  var ctrl = this

  ctrl.toggleLeftNav = buildDelayedToggler('leftNav')

  ctrl.$onInit = function () {
  }

  ctrl.goTo = function (route) {
    $state.go(route)
  }

  function debounce (func, wait, context) {
    var timer

    return function debounced () {
      var context = this
      var args = Array.prototype.slice.call(arguments)
      $timeout.cancel(timer)
      timer = $timeout(function () {
        timer = undefined
        func.apply(context, args)
      }, wait || 10)
    }
  }

  function buildDelayedToggler (navID) {
    return debounce(function () {
      $mdSidenav(navID)
        .toggle()
    }, 200)
  }
}
