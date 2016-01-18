/**
 * Created by joseph on 1/13/16.
 */
angular.module('app')

.controller('accidentController',function($scope,ionicToast,$localStorage,$cordovaCapture,$state){

    $scope.reportingForms = {};
    $scope.data = {};

    //taking values form local storage if existed
    if($localStorage.accidentVehicleForm){

      $scope.accidentVehicleForm = $localStorage.accidentVehicleForm;
    }

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

      var message = 'coming soon';
      progressMessage(message);
    };

    //report form
    $scope.reportAccidentForm = function(){

      console.log('Data : ' + JSON.stringify($scope.data));
      $state.go('app.reportAccidentForm');
    };

    //function to prepare accident vehicle form
    $scope.prepareAccidentVehicle = function(){
      var vehicles = $scope.data.numberOfVehicle;
      if(vehicles){

        $localStorage.newAccidentBasicInfoOtherData = $scope.data.newAccident;
        prepareAccidentVehicleForm(vehicles);
        var witnesses = $scope.data.numberOfWitnesses;
        if(witnesses){

          prepareAccidentWitnessesForm(witnesses);
        }

        $state.go('app.accidentVehicle');
      }else{

        var message = 'Please Enter Number of vehicle involved.';
        progressMessage(message);
      }
    };

    //function to move to to next vehicle or

    $scope.initSignature = function(){
      var canvas = document.getElementById('signatureCanvas');
      $scope.signaturePad = new SignaturePad(canvas);
    };
    //functions for handle driver signatures
    $scope.clearCanvas = function() {
      $scope.signaturePad.clear();
    };

    function prepareAccidentWitnessesForm(witnesses){
      var form =[];
      for(var i = 0; i < witnesses; i ++){

        if(i === 0){
          form.push({
            visibility : true,
            dataElement : $scope.reportingForms.accidentWitnes,
            data :{}
          });
        }else{
          form.push({
            visibility : false,
            dataElement : $scope.reportingForms.accidentWitnes,
            data :{}
          });
        }
      }
      $localStorage.accidentWitnessForm = form;
    }

    function prepareAccidentVehicleForm(vehicles){
      var form = [];
      for(var i =0; i < vehicles; i ++){

        if(i === 0){
          form.push({
            visibility : true,
            dataElement : $scope.reportingForms.accidentVehicle,
            data :{},
            passengers : []
          });
        }else{
          form.push({
            visibility : false,
            dataElement : $scope.reportingForms.accidentVehicle,
            data :{},
            passengers : []
          });
        }
      }
      $localStorage.accidentVehicleForm = form;
    }

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
