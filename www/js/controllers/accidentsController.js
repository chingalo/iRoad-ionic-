/**
 * Created by joseph on 1/13/16.
 */
angular.module('app')

.controller('accidentController',function($scope,ionicToast,$localStorage,$cordovaCapture){

    $scope.reportingForms = {};

    function progressMessage(message){
      ionicToast.show(message, 'bottom', false, 2000);
    }

    function uploadFile(mediaFile,dataElement) {

      var ft = new FileTransfer(),path = mediaFile.localURL;
      var options = {};
      ft.upload(path, encodeURI($localStorage.baseUrl + "/api/fileResources"), function(result) {

          var data = JSON.parse(result.response);
          //$scope.newAccidentBasicInfo[dataElement] = data.response.fileResource.id;
          //$scope.$apply();
        },
        function() {

          var message = 'Fail to upload ' + dataElement;
          progressMessage(message);
        }, options);
    }

    //take video form camera
    $scope.takeVideo = function(){

      var options = { limit: 1, duration: 20 };
      $cordovaCapture.captureVideo(options).then(function(videoData) {

        uploadFile(videoData[0],'Accident Video');
        var message = 'Video has been taken Successfully';
        progressMessage(message);
      }, function() {

        var message = 'Fail to take video, please try again';
        progressMessage(message);
      });

    };

    //take photo from camera
    $scope.takePhoto = function(){

      var options = { limit: 1 };
      $cordovaCapture.captureImage(options).then(function(imageData) {

        uploadFile(imageData[0],'Accident Image');
        var message = 'Photo Taken Successfully';
        progressMessage(message);
      }, function() {

        var message = 'Fail to take photo, please try again';
        progressMessage(message);
      });
    };
    //take photo from gallery
    $scope.selectImage = function(){

      console.log('selectImage');
    };

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
