/**
 * Created by joseph on 1/13/16.
 */
angular.module('app')

  .controller('accidentController',function($scope,ionicToast,$localStorage,$cordovaCapture,$state,$ionicHistory){

    $scope.reportingForms = {};
    $scope.data = {};
    $scope.data.newAccidentVehicle = {};
    $scope.data.newAccidentWitness = {};

    //taking values form local storage if existed
    if($localStorage.accidentVehicleForm){

      $scope.accidentVehicleForm = $localStorage.accidentVehicleForm;
    }
    if($localStorage.accidentWitnessForm){

      $scope.accidentWitnesses = $localStorage.accidentWitnessForm;
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

      $state.go('app.reportAccidentForm');
    };

    //function to prepare accident vehicle form
    $scope.prepareAccidentVehicle = function(){

      var vehicles = $scope.data.numberOfVehicle;
      if(vehicles > 0){

        $localStorage.newAccidentBasicInfoOtherData = $scope.data.newAccident;
        prepareAccidentVehicleForm(vehicles);
        var witnesses = $scope.data.numberOfWitnesses;
        $localStorage.accidentWitnessForm = [];
        if(witnesses > 0){

          prepareAccidentWitnessesForm(witnesses);
        }

        $state.go('app.accidentVehicle');
      }else{

        var message = 'Please Enter Number of vehicle involved.';
        progressMessage(message);
      }
    };

    //function to move to to next vehicle or

    $scope.initSignature = function(canvasId){
      var canvas = document.getElementById(canvasId);
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

    //move to next vehicle or witness
    $scope.nextVehicle = function(vehicle){


      if($scope.data.licenceNumber){

        $scope.data.loading = true;
        $scope.data.newAccidentVehicle['Licence Number'] = $scope.data.licenceNumber;
        var driverModel =  new iroad2.data.Modal('Driver',[]);
        driverModel.get({value:$scope.data.licenceNumber},function(driverList){

          if(driverList.length > 0){

            //driver data
            var driver = driverList[0];
            $scope.data.newAccidentVehicle['Full Name'] = driver['Full Name'];
            $scope.data.newAccidentVehicle['Gender'] = driver['Gender'];
            $scope.data.newAccidentVehicle['Date of Birth'] = driver['Date of Birth'];
            $scope.data.newAccidentVehicle.Driver = driver;

            if($scope.data.vehiclePlateNumber){

              var plateNumber = $scope.data.vehiclePlateNumber.toUpperCase();
              if(plateNumber.length == 7){

                plateNumber  =  plateNumber.substr(0,4) + ' ' +plateNumber.substr(4);
              }
              var vehicleModel = new iroad2.data.Modal('Vehicle',[]);
              $scope.data.newAccidentVehicle['Vehicle Plate Number/Registration Number'] = plateNumber;
              vehicleModel.get({value:plateNumber},function(vehicleList){
                if(vehicleList.length > 0){

                  //vehicle data
                  var vehicleData = vehicleList[0];
                  $scope.data.newAccidentVehicle.Vehicle = vehicleData;
                  $scope.data.newAccidentVehicle['Vehicle Ownership Category'] = vehicleData['Vehicle Ownership Category'];
                  $scope.data.newAccidentVehicle['Vehicle Class'] = vehicleData['Vehicle Class'];
                  $scope.data.newAccidentVehicle['Make'] = vehicleData['Make'];
                  $scope.data.newAccidentVehicle['Model'] = vehicleData['Model'];
                  $scope.accidentVehicleForm[vehicle].data = $scope.data.newAccidentVehicle;
                  //saving accident data to local storage
                  $localStorage.accidentVehicleData = $scope.accidentVehicleForm;


                  var numberOfVehicles = $scope.accidentVehicleForm.length;
                  if( vehicle < numberOfVehicles -1){

                    $scope.accidentVehicleForm[vehicle].visibility = false;
                    $scope.data.newAccidentVehicle = {};
                    $scope.data.licenceNumber = '';
                    $scope.data.vehiclePlateNumber = '';
                    $scope.accidentVehicleForm[vehicle + 1].visibility = true;

                    $scope.data.loading = false;
                    $scope.$apply();
                  }else{

                    var numberOfWitness = $scope.accidentWitnesses.length;
                    if(numberOfWitness > 0){

                      $state.go('app.accidentWitness');
                    }else{

                      savingAccidentReportingData();
                    }
                  }
                }else{

                  $scope.data.loading = false;
                  $scope.$apply();
                  var message = 'Vehicle ' + (vehicle + 1) + ' has not found';
                  progressMessage(message);
                }
                $scope.$apply();
              });

            }else{

              var message = 'Please Enter Vehicle plate number';
              progressMessage(message);
            }

          }else{

            $scope.data.loading = false;
            $scope.$apply();
            var message = 'Driver on vehicle ' + (vehicle + 1) + ' has not found';
            progressMessage(message);
          }
          $scope.$apply();
        });
      }else{

        var message = 'Please Enter Driver license number';
        progressMessage(message);
      }
    }
    //move to next witness
    $scope.nextWitness = function(witness){

      //saving accident witness data to local storage
      for(var key in $scope.data.newAccidentWitness){
        if($scope.isDate(key)){
          var date = formatDate($scope.data.newAccidentWitness[key]);
          $scope.data.newAccidentWitness[key] = date;
        }
      }
      $scope.accidentWitnesses[witness].data = $scope.data.newAccidentWitness;
      $localStorage.accidentWitnessesData = $scope.accidentWitnesses;

      var numberOfWitness = $scope.accidentWitnesses.length;
      if(witness < numberOfWitness -1){

        $scope.accidentWitnesses[witness].visibility = false;
        $scope.data.newAccidentWitness = {};
        $scope.accidentWitnesses[witness + 1].visibility = true;
      }else{

        savingAccidentReportingData();
      }
    };

    function savingAccidentReportingData(){

      console.log('Accident Vehicle data : ' + JSON.stringify($localStorage.accidentVehicleData));
      console.log('accident witness data : ' + JSON.stringify($localStorage.accidentWitnessesData));
      console.log('Basic info for accident : ' + JSON.stringify($localStorage.newAccidentBasicInfoOtherData));
      // toHomePage();
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
