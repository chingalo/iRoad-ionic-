angular.module('app')

.controller('DriverController',function($scope,$ionicModal,ionicToast,$localStorage,$http){

    $scope.data = {};
    $scope.data.loading = false;

    function progressMessage(message){
      ionicToast.show(message, 'bottom', false, 1500);
    }
    $scope.verifyDriver = function(){

      $scope.data.driver = null;
      $scope.data.accidentData = null;
      $scope.data.offenceData = null;

      if($scope.data.driverLicenceNumber){

        $scope.data.loading = true;

        var driverLicenceNumber =$scope.data.driverLicenceNumber;
        var driverModal =  new iroad2.data.Modal('Driver',[]);
        driverModal.get({'value':driverLicenceNumber},function(result){
          if(result.length > 0){

            $scope.data.loading = false;
            $scope.data.driver = result[0];

            getAccidentData(driverLicenceNumber);
            getOffenseData(driverLicenceNumber);
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

    //show rap sheet for driver
    $ionicModal.fromTemplateUrl('templates/driverRapSheetHistory.html', {
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

    function getAccidentData(driverLicenceNumber){

      $scope.data.loading = true;
      $scope.$apply();
      var accidentModal = new  iroad2.data.Modal('Accident Vehicle',[]);
      var accidents = [];
      accidentModal.get(new iroad2.data.SearchCriteria('Licence Number',"=",driverLicenceNumber),function(accidentResults){

        for(var i = 0; i < accidentResults.length; i++){
          var dataResult = accidentResults[i];
          if(!(JSON.stringify(dataResult.Accident) === '{}' )){
            accidents.push(dataResult);
          }
        }
        $scope.data.accidentData = accidents;
        $scope.data.loading = false;
        $scope.$apply();
      });
    }
    function getOffenseData(driverLicenceNumber){

      $scope.data.loading = true;
      $scope.$apply();
      var offenseModal = new  iroad2.data.Modal('Offence Event',[]);
      var offenses = [];
      offenseModal.get(new iroad2.data.SearchCriteria('Driver License Number',"=",driverLicenceNumber),function(offensesResults){

        $scope.data.offenceData = offensesResults;

        $scope.data.loading = false;
        $scope.$apply();
      });
    }
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
