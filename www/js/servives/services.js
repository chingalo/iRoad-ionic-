/**
 * Created by joseph on 1/13/16.
 */
angular.module('app')
  .service('appServices',function(){

    this.getDriver = function(driverLicense){

      var driverModel =  new iroad2.data.Modal('Driver',[]);
      driverModel.get({value:driverLicense},function(driverList){

        return driverList[0];
      });
    };
    this.getVehicle = function(plateNumber){

      var vehicleModel = new iroad2.data.Modal('Vehicle',[]);
      vehicleModel.get({value:plateNumber},function(vehicleList){

        return vehicleList[0];
      });
    };

  })
;

