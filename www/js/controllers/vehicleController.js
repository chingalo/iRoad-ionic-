angular.module('app.vehicleController', [])

  .controller('vehicleController',function($scope){

    $scope.data = {};

    $scope.verifyVehicle = function(){

      if($scope.data.vehiclePlateNumber){
        if($scope.data.vehiclePlateNumber){
          var plateNumber = $scope.data.vehiclePlateNumber.toUpperCase();
        }
        if(plateNumber.length == 7){

          plateNumber  =  plateNumber.substr(0,4) + ' ' +plateNumber.substr(4);
        }

        alert('vehicle plate number : ' + plateNumber);
      }else{

        alert('empty');
      }

    }


  });
