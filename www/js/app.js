// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', [
  'ionic',
  'app.controllers',
  'app.DriverController',
  'app.vehicleController'
])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html'
          }
        }
      })

      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html'
          }
        }
      })

      .state('app.reportAccident', {
        url: '/report-accident',
        views: {
          'menuContent': {
            templateUrl: 'templates/reportAccident.html'
          }
        }
      })

      .state('app.reportOffense', {
        url: '/report-offense',
        views: {
          'menuContent': {
            templateUrl: 'templates/reportOffense.html'
          }
        }
      })

      .state('app.driverVerification', {
        url: '/driver-verification',
        views: {
          'menuContent': {
            templateUrl: 'templates/driverVerification.html',
            controller : 'DriverController'
          }
        }
      })
      .state('app.vehicleVerification', {
        url: '/vehicle-verification',
        views: {
          'menuContent': {
            templateUrl: 'templates/vehicleVerification.html',
            controller : 'vehicleController'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
  });
