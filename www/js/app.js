// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', [
  'ionic',
  'ionic-toast',
  'ionic-timepicker',
  'ngStorage',
  'ngCordova',
  'ui.date'
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

  .controller('mainController',function($scope,$ionicModal,ionicToast,$localStorage,$state,$ionicHistory){

    $scope.data = {};
    var url = 'http://roadsafety.go.tz/demo';

    //checking for bas url for app
    if(! $localStorage.baseUrl){
      $localStorage.baseUrl = url;
    }else{
      //authenticate using local storage data of login user
      if($localStorage.loginUser){
        var username = $localStorage.loginUser.username;
        var password = $localStorage.loginUser.password;
        authenticateUser(username,password);
      }
    }
    $scope.data.baseUrl = $localStorage.baseUrl;
    $localStorage.signatures = {
      police : {},
      driver : {},
      witness : {}
    };
    $localStorage.media = {};

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

        authenticateUser($scope.data.username,$scope.data.password);

      }else{
        ionicToast.show('Please Enter both username and password.', 'bottom', false, 1500);
      }
    };

    $scope.logOut = function(){

      $localStorage.loginUser = '';
      $state.go('login');
    };

    function authenticateUser($username, $password){

      $scope.data.loading =true;

      var base = $localStorage.baseUrl;
      Ext.Ajax.request({
        url : base + '/dhis-web-commons-security/login.action?failed=false',
        callbackKey : 'callback',
        method : 'POST',
        params : {
          j_username : $username,
          j_password : $password
        },
        withCredentials : true,
        useDefaultXhrHeader : false,
        success: function () {
          //call checking if user is available
          Ext.Ajax.request({
            url: base + '/api/me.json',
            callbackKey : 'callback',
            method : 'GET',
            params : {
              j_username : $username,
              j_password : $password
            },
            withCredentials : true,
            useDefaultXhrHeader : false,
            success : function(response){

              $scope.data.username = null;
              $scope.data.password = null;
              try{
                var userData = JSON.parse(response.responseText);
                $localStorage.loginUser = {'username' : $username,'password':$password};
                $localStorage.loginUserData = userData;
                $scope.loginUserData = $localStorage.loginUserData

                //loading library
                var dhisConfigs = {
                  baseUrl: base + '/',
                  refferencePrefix: "Program_"
                };

                $scope.onInitialize = function(){
                  var registries = new iroad2.data.Modal("Offence Registry",[]);
                  registries.getAll(function(result){

                    $localStorage.offenseRegistries = result;
                  });
                };

                dhisConfigs.onLoad = function () {
                  $scope.onInitialize();
                };
                iroad2.Init(dhisConfigs);

                //redirect to home page for success login
                $state.go('app.home');

              }catch(e){
                var message = 'Fail to login, please your username or password';
                ionicToast.show(message, 'bottom', false, 1500);
                $scope.data.password = null;
              }

              $scope.data.loading = false;
              $scope.$apply();
            },
            failure : function(){

              $scope.data.password = null;
              var message = 'Fail to login, please Check your network';
              ionicToast.show(message, 'bottom', false, 1500);
              $scope.data.loading = false;
              $scope.$apply();
            }
          });

        },
        failure : function(err) {

          $scope.data.password = null;
          //fail to connect to the server
          var message = 'Fail to connect to the server, please check base url';
          ionicToast.show(message, 'bottom', true, 1500000);
          $scope.data.loading = false;
          $scope.$apply();
        }
      });

    };


    //home button redirection
    $scope.reportAccident =  function(){

      goToSideMenuPape('app.reportAccident');
    };
    $scope.reportOffense =  function(){

      goToSideMenuPape('app.reportOffense');
    };
    $scope.driverVerification = function(){

      goToSideMenuPape('app.driverVerification');
    };
    $scope.vehicleVerification = function(){

      goToSideMenuPape('app.vehicleVerification');
    };
    function goToSideMenuPape(state){
      $ionicHistory.clearCache().then(function() {

        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        $state.go(state);
      });
    }
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
            templateUrl: 'templates/reportAccident.html',
            controller : 'accidentController'
          }
        }
      })
      .state('app.reportAccidentForm', {
        url: '/report-accident-form',
        views: {
          'menuContent': {
            templateUrl: 'templates/reportAccidentForm.html',
            controller : 'accidentController'
          }
        }
      })
      .state('app.accidentVehicle', {
        url: '/accident-vehicle',
        views: {
          'menuContent': {
            templateUrl: 'templates/accidentVehicle.html',
            controller : 'accidentController'
          }
        }
      })
      .state('app.accidentWitness', {
        url: '/accident-vehicle',
        views: {
          'menuContent': {
            templateUrl: 'templates/accidentWitness.html',
            controller : 'accidentController'
          }
        }
      })
      .state('app.confirmReportingAccident', {
        url: '/confirm-reporting-accident',
        views: {
          'menuContent': {
            templateUrl: 'templates/confirmReportingAccident.html',
            controller : 'accidentController'
          }
        }
      })

      .state('app.reportOffense', {
        url: '/report-offense',
        views: {
          'menuContent': {
            templateUrl: 'templates/reportOffense.html',
            controller : 'offenseController'
          }
        }
      })
      .state('app.confirmReportingOffense', {
        url: '/confirm-reporting-offense',
        views: {
          'menuContent': {
            templateUrl: 'templates/confirmReportingOffense.html',
            controller : 'offenseController'
          }
        }
      })
      .state('app.offensePaymentForm', {
        url: '/offense-payment-form',
        views: {
          'menuContent': {
            templateUrl: 'templates/offensePaymentForm.html',
            controller : 'offenseController'
          }
        }
      })
      .state('app.codeGenerationView', {
        url: '/code-generation-view',
        views: {
          'menuContent': {
            templateUrl: 'templates/codeGenerationView.html',
            controller : 'offenseController'
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
