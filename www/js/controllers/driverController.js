angular.module('app')

.controller('DriverController',function($scope,ionicToast,$localStorage,$http){

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
    };

    $scope.defaultPhotoID = null;
    getDriverPhoto();
    function getDriverPhoto(){
      var base = $localStorage.baseUrl;
      var defaultPhotoUrl = base +'/api/documents.json?filter=name:eq:Default Driver Photo'
      $http({
        method : 'GET',
        url : defaultPhotoUrl
      }).success(function(response){

        if(response.documents.length != 0){
          $scope.defaultPhotoID = response.documents[0].id;
        }
      });
    }

  });
