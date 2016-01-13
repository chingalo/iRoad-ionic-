angular.module('app')

  .controller('vehicleController',function($scope,ionicToast){

    $scope.data = {};

    $scope.verifyVehicle = function(){

      if($scope.data.vehiclePlateNumber){
        if($scope.data.vehiclePlateNumber){
          var plateNumber = $scope.data.vehiclePlateNumber.toUpperCase();
        }
        if(plateNumber.length == 7){

          plateNumber  =  plateNumber.substr(0,4) + ' ' +plateNumber.substr(4);
        }
        var message = 'vehicle plate number : ' + plateNumber;
        ionicToast.show(message, 'bottom', false, 1500);
      }else{

        ionicToast.show('Please Enter Vehicle plate Number', 'bottom', false, 1500);
      }

    }


  });
