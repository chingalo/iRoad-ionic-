// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', [
  'ionic',
  'ionic-toast',
  'ngStorage',
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

  .controller('mainController',function($scope,$ionicModal,ionicToast,$localStorage,$state,$location){

    $scope.data = {};
    var url = 'http://roadsafety.go.tz/demo';

    if(! $localStorage.baseUrl){
      $localStorage.baseUrl = 'http://roadsafety.go.tz/demo';
    }
    $scope.data.baseUrl = $localStorage.baseUrl;

    $ionicModal.fromTemplateUrl('templates/setConfiguration.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.closeSetting = function() {
      $scope.modal.hide();
    };

    $scope.setConfiguration = function() {
      $scope.modal.show();
    };

    $scope.saveSetting = function(){

      $localStorage.baseUrl = $scope.data.baseUrl;
      $scope.closeSetting();
    };

    $scope.login = function(){

      if($scope.data.username && $scope.data.password){

        $scope.authenticateUser($scope.data.username,$scope.data.password);
        $scope.data.username = null;
        $scope.data.password = null;
      }else{
        ionicToast.show('Please Enter both username and password.', 'bottom', false, 1500);
      }
    };

    $scope.logOut = function(){

      $state.go('login');
    };

    $scope.authenticateUser = function($username, $password){

      $state.go('app.home');
    };


    //home button redirection
    $scope.reportAccident =  function(){

      $state.go('app.reportAccident');
    };
    $scope.reportOffense =  function(){

      $state.go('app.reportOffense');
    };


  })
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('login',{
        url : '/login',
        templateUrl : 'templates/login.html',
        controller : 'mainController'
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
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
    $urlRouterProvider.otherwise('/login');
  });
