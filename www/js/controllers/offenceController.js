/**
 * Created by joseph on 1/13/16.
 */
angular.module('app')

.controller('offenseController',function($scope,$ionicModal,ionicToast,$localStorage,$state){

    $scope.data = {};

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

    //prepare data for submission
    $scope.prepareOffenseDataForSubmission = function(){

      pickSelectedOffenses($scope.reportingForms.editInput);

      if($scope.data.reportedOffense.offenseList.length > 0){

        var vehiclePlateNumber = $scope.data.licenseNumber;
        var driverLicenceNumber = $scope.data.plateNumber;
        if(driverLicenceNumber){
          if(vehiclePlateNumber){

            console.log('Data : '+JSON.stringify($scope.data));
            var message = 'Data ready for submission';
            progressMessage(message);
          }else{

            var message = 'Please Enter Vehicle Plate Number';
            progressMessage(message);
          }
        }else{

          var message = 'Please Enter Driver License Number';
          progressMessage(message);
        }
      }
      else{

        var message = 'Please select at least one offense';
        progressMessage(message);
      }
    };

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

      console.log('Forms : ' + JSON.stringify($scope.reportingForms));
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
