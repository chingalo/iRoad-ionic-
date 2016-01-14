/**
 * Created by joseph on 1/13/16.
 */
angular.module('app')

.controller('accidentController',function($scope,ionicToast,$localStorage,$state){

    $scope.reportingForms = {};
    prepareAccidentForms();


    function prepareAccidentForms(){

      //load basic information for accident
      var accidentModal = new iroad2.data.Modal('Accident',[]);
      var modalName = accidentModal.getModalName();
      var eventAccident = {};
      angular.forEach(iroad2.data.programs, function (program) {
        if (program.name == modalName) {
          angular.forEach(program.programStages[0].programStageDataElements, function (dataElement) {
            if(dataElement.dataElement.name.startsWith(iroad2.config.refferencePrefix)){
              //eventAccident[dataElement.dataElement.name.replace(iroad2.config.refferencePrefix,"")] = {};
              var data = null;
            }else{
              eventAccident[dataElement.dataElement.name] = "";
            }
          });
        }
      });
      console.log(eventAccident);
     $scope.reportingForms.basicInfo = eventAccident;

      //loading accident vehicle form
      var accidentVehilce = new iroad2.data.Modal('Accident Vehicle',[]);
      var modalName = accidentVehilce.getModalName();
      var eventAccidentVehicle = {};
      angular.forEach(iroad2.data.programs, function (program) {
        if (program.name == modalName) {
          angular.forEach(program.programStages[0].programStageDataElements, function (dataElement) {
            if(dataElement.dataElement.name.startsWith(iroad2.config.refferencePrefix)){
              //eventAccidentVehicle[dataElement.dataElement.name.replace(iroad2.config.refferencePrefix,"")] = {};
              var data = null;
            }else{
              eventAccidentVehicle[dataElement.dataElement.name] = "";
            }
          });
        }
      });
      $scope.reportingForms.accidentVehicle = eventAccidentVehicle;

      //loading accident passengers
      var accidentVehiclePassenger = new iroad2.data.Modal('Accident Passenger',[]);
      var modalName = accidentVehiclePassenger.getModalName();
      var eventAccidentVehiclePassenger = {};
      angular.forEach(iroad2.data.programs, function (program) {
        if (program.name == modalName) {
          angular.forEach(program.programStages[0].programStageDataElements, function (dataElement) {
            if(dataElement.dataElement.name.startsWith(iroad2.config.refferencePrefix)){
              //eventAccidentVehiclePassenger[dataElement.dataElement.name.replace(iroad2.config.refferencePrefix,"")] = {};
              var data = null;
            }else{
              eventAccidentVehiclePassenger[dataElement.dataElement.name] = "";
            }
          });
        }
      });
      $scope.reportingForms.accidentVehiclePassenger = eventAccidentVehiclePassenger;

      //load accident witness form
      var accidentWitness = new iroad2.data.Modal('Accident Witness',[]);
      var modalName = accidentWitness.getModalName();
      var eventAccidentWitness = {};
      angular.forEach(iroad2.data.programs, function (program) {
        if (program.name == modalName) {
          angular.forEach(program.programStages[0].programStageDataElements, function (dataElement) {
            if(dataElement.dataElement.name.startsWith(iroad2.config.refferencePrefix)){
              //eventAccidentWitness[dataElement.dataElement.name.replace(iroad2.config.refferencePrefix,"")] = {};
              var data = null;
            }else{
              eventAccidentWitness[dataElement.dataElement.name] = "";
            }
          });
        }
      });
      $scope.reportingForms.accidentWitnes = eventAccidentWitness;
    }

});
