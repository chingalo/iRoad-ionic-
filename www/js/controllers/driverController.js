angular.module('app')

.controller('DriverController',function($scope,ionicToast,$localStorage,$http){

    $scope.data = {};
    $scope.data.loading = false;

    function progressMessage(message){
      ionicToast.show(message, 'bottom', false, 1500);
    }
    $scope.verifyDriver = function(){

      if($scope.data.driverLicenceNumber){

        $scope.data.loading = true;

        var driverModal =  new iroad2.data.Modal('Driver',[]);
        driverModal.get({'value':$scope.data.driverLicenceNumber},function(result){
          if(result.length > 0){

            $scope.data.loading = false;
            $scope.data.driver = result[0];

            var imageUrl = $localStorage.baseUrl + '/api/documents/';
            if($scope.data.driver['Driver Photo']){
              $scope.data.driverPhotoUrl = imageUrl + $scope.data.driver['Driver Photo'] + '/data';
            }
            else{
              $scope.data.driverPhotoUrl = imageUrl + $scope.defaultPhotoID + '/data';
            }
            $scope.data.loading = false;
            $scope.$apply();
            console.log(JSON.stringify($scope.data.driver));
          }else{
            $scope.data.loading = false;
            $scope.$apply();
            var message = 'Driver has not Found';
            progressMessage(message);
          }
        });

      }else{

        var message = 'Please Enter Driver Licence Number.';
        progressMessage(message);
      }
    };

    $scope.scanDriverLicence = function(){

      cordova.plugins.barcodeScanner.scan(
        function (result) {
          $scope.data.driverLicenceNumber = result.text;
          var message = "Driver Licence Number has successfully scanned";
          progressMessage(message);
          $scope.$apply();
          $scope.verifyDriver();

        },
        function () {
          var message = 'Fail to scan Driver Licence Number.';
          progressMessage(message);
        }
      );
      $scope.verifyDriver();
    };


    /*
    getting default photo data
     */
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
