/**
 * Created by joseph on 1/13/16.
 */
angular.module('app')

.controller('offenseController',function($scope,$ionicModal,ionicToast,$localStorage,$state){


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


});
