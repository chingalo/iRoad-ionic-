angular.module('app')

  .controller('vehicleController',function($scope,ionicToast){

    $scope.data = {};
    $scope.data.loading = false;

    function progressMessage(message){

      ionicToast.show(message, 'bottom', false, 2000);
    }


    $scope.verifyVehicle = function(){

      $scope.data.vehicle = null;
      $scope.data.accidentData = null;
      $scope.data.offenceData = null;

      if($scope.data.vehiclePlateNumber){

        $scope.data.loading = true;
        if($scope.data.vehiclePlateNumber){

          var plateNumber = $scope.data.vehiclePlateNumber.toUpperCase();
        }
        if(plateNumber.length == 7){

          plateNumber  =  plateNumber.substr(0,4) + ' ' +plateNumber.substr(4);
        }

        var vehicleModal = new iroad2.data.Modal('Vehicle',[]);
        vehicleModal.get({value:plateNumber},function(result){

          if(result.length > 0){

            $scope.data.vehicle = result[0];

          }else{

            var message = 'Vehicle has not found';
            progressMessage(message);
          }
          $scope.data.loading = false;
          $scope.$apply();
        });

      }else{

        var message = 'Please Enter Vehicle Plate Number';
        progressMessage(message);
      }
    };



  });
