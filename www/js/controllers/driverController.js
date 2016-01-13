angular.module('app')

.controller('DriverController',function($scope,ionicToast){

    $scope.data = {};

    $scope.verifyDriver = function(){

      var message = 'Driver Licence Number : ' + $scope.data.driverLicenceNumber;
      ionicToast.show(message, 'bottom', false, 1500);
    };

    $scope.scanDriverLicence = function(){

      cordova.plugins.barcodeScanner.scan(
        function (result) {
          $scope.data.driverLicenceNumber = result.text;
          $scope.$apply();
          $scope.verifyDriver();

        },
        function () {
          ionicToast.show('fail to scan', 'bottom', false, 1500);
        }
      );
      $scope.verifyDriver();
    }
  });
