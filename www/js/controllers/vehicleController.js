angular.module('app')

  .controller('vehicleController',function($scope,ionicToast,$ionicModal){

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
            getAccidentData(plateNumber);
            getOffenseData(plateNumber);
          }else{

            var message = 'Vehicle has not been found';
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

    //getting rap sheet for a given vehicle
    function getAccidentData(plateNumber){

      $scope.data.loading = true;
      var accidentModal = new  iroad2.data.Modal('Accident Vehicle',[]);
      var accidents = [];
      accidentModal.get(new iroad2.data.SearchCriteria('Vehicle Plate Number/Registration Number',"=",plateNumber),function(accidentResults){

        for(var i = 0; i < accidentResults.length; i++){
          var data = accidentResults[i];
          if(!(JSON.stringify(data.Accident) === '{}' )){
            accidents.push(data);
          }
        }
        $scope.data.accidentData = accidents;
        $scope.data.loading = false;
        $scope.$apply();
      });
    }
    function getOffenseData(plateNumber){

      $scope.data.loading = true;
      var offenseModal = new  iroad2.data.Modal('Offence Event',[]);
      var offenses = [];
      offenseModal.get(new iroad2.data.SearchCriteria('Vehicle Plate Number/Registration Number',"=",plateNumber),function(offensesResults){

        $scope.data.offenceData = offensesResults;
        $scope.data.loading = false;
        $scope.$apply();
      });
    }

    //show rap sheet for driver
    $ionicModal.fromTemplateUrl('templates/vehicleRapSheetHistory.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.rapSheetReport = function(type){

      $scope.data.rapSheetType = type;
      $scope.modal.show();
    };
    $scope.closeRapSheetHistory = function(){

      $scope.modal.hide();
    };

  });
