angular.module('app.DriverController', [])

.controller('DriverController',function($scope){

    $scope.data = {};

    $scope.verifyDriver = function(){

      alert('Driver Licence Number : ' + $scope.data.driverLicenceNumber);
    };

    $scope.scanDriverLicence = function(){

      cordova.plugins.barcodeScanner.scan(
        function (result) {
          $scope.data.driverLicenceNumber = result.text;
          $scope.$apply();
          $scope.verifyDriver();

        },
        function () {
          alert('fail to scan');
        }
      );
      $scope.verifyDriver();
    }
  });
