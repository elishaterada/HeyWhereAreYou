angular
  .module('app')
  .component('landing', {
    templateUrl: 'components/landing.html',
    controller: LandingCtrl
  })

function LandingCtrl ($firebaseArray) {
  var ctrl = this

  ctrl.$onInit = function () {
  }

  ctrl.startSession = function () {
    var session = $firebaseArray(
      firebase.database().ref('sessions')
    )

    session.$add({
      created: moment().format()
    })
  }

}
