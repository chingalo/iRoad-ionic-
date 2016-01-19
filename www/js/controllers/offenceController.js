/**
 * Created by joseph on 1/13/16.
 */
angular.module('app')

.controller('offenseController',function($scope,$ionicModal,ionicToast,$localStorage,$state){

    $scope.data = {};
    $scope.data.newOffense = {};
    $scope.data.loading = false;

    if($localStorage.reportedOffenseData){

      $scope.reportedOffenseData = $localStorage.reportedOffenseData;
    }

    function progressMessage(message){
      ionicToast.show(message, 'bottom', false, 2000);
    }

    function toHomePage(){
      $ionicHistory.clearCache().then(function() {

        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
        $state.go('app.home');
      });
    }

    function formatDate(dateValue){

      var m,d = (new Date(dateValue));
      m = d.getMonth() + 1;
      var date = d.getFullYear() + '-';
      if(m > 9){
        date = date + m + '-';
      }else{
        date = date + '0' + m + '-';
      }
      if(d.getDate() > 9){
        date = date + d.getDate();
      }else{
        date = date + '0' +d.getDate();
      }
      return date;
    }

    //prepare data for submission
    $scope.prepareOffenseDataForSubmission = function(){

      pickSelectedOffenses($scope.reportingForms.editInput);
      if($scope.data.reportedOffense.offenseList.length > 0){

        var driverLicenceNumber = $scope.data.licenseNumber;
        var vehiclePlateNumber = $scope.data.plateNumber;
        if(driverLicenceNumber){
          if(vehiclePlateNumber){

            vehiclePlateNumber = vehiclePlateNumber.toUpperCase();
            if(vehiclePlateNumber.length == 7){

              vehiclePlateNumber  =  vehiclePlateNumber.substr(0,4) + ' ' +vehiclePlateNumber.substr(4);
            }
            $scope.data.loading = true;
            console.log(driverLicenceNumber);
            var driverModel =  new iroad2.data.Modal('Driver',[]);
            driverModel.get({value:driverLicenceNumber},function(driverList){
              if(driverList.length > 0){

                //driver data
                var driver = driverList[0];
                $scope.data.newOffense.Driver = driver;
                $scope.data.newOffense['Full Name'] = driver['Full Name'];
                $scope.data.newOffense['Driver License Number'] = driver['Driver License Number'];
                $scope.data.newOffense['Gender'] = driver['Gender'];
                $scope.data.newOffense['Date of Birth'] = driver['Date of Birth'];

                var vehicleModel = new iroad2.data.Modal('Vehicle',[]);
                vehicleModel.get({value:vehiclePlateNumber},function(vehicleList){

                  if(vehicleList.length > 0){

                    //vehicle data
                    var vehicle = vehicleList[0];
                    $scope.data.newOffense.Vehicle = vehicle;
                    $scope.data.newOffense['Vehicle Plate Number/Registration Number'] = vehicle['Vehicle Plate Number/Registration Number'];
                    $scope.data.newOffense['Vehicle Owner Name'] = vehicle['Vehicle Owner Name'];
                    $scope.data.newOffense['Model'] = vehicle['Model'];
                    $scope.data.newOffense['Make'] = vehicle['Make'];
                    $scope.data.newOffense['Vehicle Ownership Category'] = vehicle['Vehicle Ownership Category'];
                    $scope.data.newOffense['Vehicle Class'] = vehicle['Vehicle Class'];

                    //police data
                    var attendant = $scope.data.attendant;
                    if(attendant){

                      var accidentAttendantModal = new iroad2.data.Modal('Police',[]);
                      accidentAttendantModal.get({value:attendant},function(policeList){

                        if(policeList.length > 0){

                          $scope.data.newOffense.Police = policeList[0];
                          prepareSavingOffenseData();
                        }

                        $scope.data.loading = false;
                        $scope.$apply();
                      });
                    }else{

                      $scope.data.loading = false;
                      $scope.$apply();
                      prepareSavingOffenseData();
                    }
                  }else{

                    var message = 'Vehicle has  not been found';
                    progressMessage(message);
                    $scope.data.loading = false;
                    $scope.$apply();
                  }
                });
              }else{

                var message = 'Driver has not been found';
                progressMessage(message);
                $scope.data.loading = false;
                $scope.$apply();
              }
            });
          }else{

            var message = 'Please Enter Vehicle Plate Number.';
            progressMessage(message);
          }
        }else{

          var message = 'Please Enter Driver License Number.';
          progressMessage(message);
        }
      }
      else{

        var message = 'Please select at least one offense.';
        progressMessage(message);
      }
    };

    function prepareSavingOffenseData(){

      for(var key in $scope.data.newOffense){
        if($scope.isDate(key)){

          $scope.data.newOffense[key] = formatDate($scope.data.newOffense[key]);
        }
      }
      $localStorage.reportedOffenseData = {
        offenseData : $scope.data.newOffense,
        selectedOffenses : $scope.data.reportedOffense
      };
      $state.go('app.confirmReportingOffense');
    }

    $scope.payNow = function(){

      savingOffensesData('now');
    };

    $scope.payLater = function(){

      savingOffensesData('later');
    };

    function savingOffensesData(paymentType){

      var otherData = {orgUnit:$localStorage.loginUserData.organisationUnits[0].id,status: "COMPLETED",storedBy: "admin",eventDate:formatDate(new Date())};
      var offenseList = $scope.reportedOffenseData.selectedOffenses;
      var offenseInputData = $scope.reportedOffenseData.offenseData;

      $scope.data.loading = true;
      var offenceEventModal = new iroad2.data.Modal("Offence Event",[]);
      offenceEventModal.save(offenseInputData,otherData,function(result){
        if(result.httpStatus){

          var offenseSavingResponse = result.response;
          var offenseId = offenseSavingResponse.importSummaries[0].reference;

          var saveDataArray = [];
          angular.forEach(offenseList,function(registry){
            var off = {
              "Offence_Event":{"id": offenseId},
              "Offence_Registry":{"id":registry.id}
            };
            saveDataArray.push(off);
          });
          var i = 0;
          var offence = new iroad2.data.Modal("Offence",[]);
          offence.save(saveDataArray,otherData,function(){
              i ++;
              if(i == offenseList.length){

                $scope.data.loading = false;
                $scope.$apply();
                if(paymentType == 'now'){
                  alert('pay now');
                }else{
                  alert('pay later');
                }
              }
            },function(){

              $scope.data.loading = false;
              $scope.$apply();
            },
            offence.getModalName());
        }
      },function(){

        $scope.data.loading = false;
        $scope.$apply();
      },offenceEventModal.getModalName());
    }

    function pickSelectedOffenses(offenses){

      var selectedOffenses = [];
      var amountTotal = 0;
      angular.forEach(offenses,function(data){

        if(data.selected){
          selectedOffenses.push(data);
        }
      });

      selectedOffenses.forEach(function(selectedOffense){

        amountTotal += parseInt(selectedOffense.Amount);
      });

      $scope.data.reportedOffense = {
        offenseList : selectedOffenses,
        amount : amountTotal
      };
    }

    //offense modal
    $ionicModal.fromTemplateUrl('templates/offenseModal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openOffenseModal = function(){

      $scope.modal.show();
    };
    $scope.closeOffenseModal = function(){

      $scope.modal.hide();
    };

    prepareOffenseForms();
    //function to prepare form for reporting offense
    function prepareOffenseForms(){

      var offenseModal = new iroad2.data.Modal("Offence Event",[new iroad2.data.Relation("Offence Registry","Offence")]);
      var modalName = offenseModal.getModalName();
      var event = {};
      angular.forEach(iroad2.data.programs, function (program) {
        if (program.name == modalName) {
          angular.forEach(program.programStages[0].programStageDataElements, function (dataElement) {
            if(dataElement.dataElement.name.startsWith(iroad2.config.refferencePrefix)){
              event[dataElement.dataElement.name.replace(iroad2.config.refferencePrefix,"")] = {};
            }else{
              event[dataElement.dataElement.name] = "";
            }

          });
        }
      });
      angular.forEach(offenseModal.getRelationships(), function (relationship) {
        if(relationship.pivot){
          event[relationship.pivot] = [];
        }
      });
      $scope.editInputModal = [];

      $scope.reportingForms = {
        'dataElements' : event,
        'editInput' : $scope.editInputModal,
        'newOffenseData' : {
          'Vehicle' : {},
          'Driver' : {}
        }
      };

      var registries = $localStorage.offenseRegistries;
      angular.forEach(registries, function (registry) {
        registry.selected = false;
        angular.forEach($scope.reportingForms.offenses, function (off) {
          if(off.Offence_Registry.id == registry.id){
            registry.selected = true;
          }
        });
        $scope.editInputModal.push(registry);
      });
    }

    //functions for flexible forms on offense
    $scope.isInteger = function(key){
      return $scope.is(key,"NUMBER");
    };
    $scope.isDate = function(key){
      return $scope.is(key,"DATE");
    };
    $scope.isString = function(key){
      return $scope.is(key,"TEXT");
    };
    $scope.isBoolean = function(key){
      return $scope.is(key,"BOOLEAN");
    };

    $scope.is = function(key,dataType){
      for(var j = 0 ;j < iroad2.data.dataElements.length;j++){
        if(iroad2.data.dataElements[j].name == key){
          if(iroad2.data.dataElements[j].valueType == dataType){
            return true;
          }
          break;
        }
      }
      return false;
    };
    $scope.hasDataSets = function(key){
      for(var j = 0 ;j < iroad2.data.dataElements.length;j++){
        if(iroad2.data.dataElements[j].name == key){
          return (iroad2.data.dataElements[j].optionSet != undefined);

        }
      }
      return false;
    };
    $scope.getOptionSets = function(key){
      for(var j = 0 ;j < iroad2.data.dataElements.length;j++){
        if(iroad2.data.dataElements[j].name == key){
          if(iroad2.data.dataElements[j].optionSet){
            return iroad2.data.dataElements[j].optionSet.options;
          }
        }
      }
      return false;
    };

});
