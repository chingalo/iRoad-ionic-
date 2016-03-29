/**
 *
 * 	@author Vincent P. Minde
 *
 *	This is Library to ease the use of iroad2
 *
 */

/**
 * JavaScript helper for String type
 */
if (typeof String.prototype.startsWith != 'function') {
	/**
	 * Checks if a string starts with a given string
	 *
	 * @param string
	 *
	 * @return boolean
	 *
	 */
	  String.prototype.startsWith = function (str){
	    return this.indexOf(str) === 0;
	  };
}
if (typeof String.prototype.endsWith != 'function') {
	/**
	 * Checks if a string ends with a given string
	 *
	 * @param string
	 *
	 * @return boolean
	 *
	 */
	  String.prototype.endsWith = function (str){
	    return this.slice(-str.length) == str;
	};
}
/**
 *
 * This is the iroad2 main object
 *
 */
iroad2 = {
		//Holds specific dhis data and objects related to data
		data : {

		}

}
/**
 *	Function to be envoked when initializing iroad2 data
 *	@constructor
 *	@param config {array} eg. config{ baseUrl,refferencePrefix,onLoad(function)}
 *
 */
iroad2.Init = function(config){
	iroad2.config = config;
	//Fetch dataElements from the dhis server
	http.get(iroad2.config.baseUrl + "api/dataElements.json?paging=false&fields=id,name,description,type,code,attributeValues,optionSet[id,name,code,options[id,name]]", function(results) {
		//Set the dhis data elements
		iroad2.data.dataElements = results.dataElements;
		//Fetch programs from the dhis server
		//http.get(iroad2.config.baseUrl + "api/programs?filters=type:eq:3&paging=false&fields=id,name,version,programStages[id,version,programStageSections[id],programStageDataElements[sortOrder,dataElement[id,name,code,type,optionSet[id,name,options[id,name],version]]]]", function(results2) {
		http.get(iroad2.config.baseUrl + "api/programs.json?filters=type:eq:3&paging=false&fields=id,name,version,programStages[id,version,programStageSections[id],programStageDataElements[compulsory,sortOrder,dataElement[id,name,description,code,type,optionSet[id,name,options[id,name],version]]]]", function(results2) {
			//Set the dhis programs
			iroad2.data.programs = results2.programs;
			//Load the scripts to use from user
			iroad2.config.onLoad();
			http.get(iroad2.config.baseUrl + "api/me", function(results3) {
				iroad2.data.user = results3;
			});
		});
	});
}
/**
 *
 *	This is the relationship with a program in the database for a many to many relationship
 *	@constructor
 *
 *	@param modalName {string} Name of the Program in iroad2 to form a relationship
 *
 *	@param [pivotModalName] {string} Name of the Program in iroad2 as the pivot table
 *
 *	@example <caption>Example usage of initializing a relationship of one to many.</caption>
 *	var driverRelation = new iroad2.data.Relation("Driver");
 *
 *	@example <caption>Example usage of initializing a relationship of many to many.</caption>
 *	var offenceRelation = new iroad2.data.Relation("Offence Event","Offence");
 *
 */
iroad2.data.Relation = function () {
	var selfRelation = this;
	this.name = arguments[0];
	if(arguments.length == 1){
		this.type = "ONE_MANY";
	}else if(arguments.length == 2){
		this.type = "MANY_MANY";
		this.pivot = arguments[1];
	}
	this.isOneToMany = function(){
		return (selfRelation.type == "ONE_MANY");
	}
	this.isManyToMany = function(){
		return (selfRelation.type == "MANY_MANY");
	}
}

/**
 *
 *	This is the Search criteria used to search for events in a program
 *
 *	@constructor
 *
 *	@param dataElementName {string} Name of the data element in iroad2 to be searched
 *
 *	@param operator {string} Operator to be used to search
 *
 *	@param value {string} Value that is being searched
 *
 *	@example <caption>Example usage of initializing a search criteria.</caption>
 *	var driverLicenceSearch = new iroad2.data.SearchCriteria("Driver License Number","=","4002566389");
 *
 */
iroad2.data.SearchCriteria = function (dataElementName,operator,value) {
	this.dataElementName = dataElementName;
	this.operator = operator;
	this.value = value;
}

iroad2.data.DataResult = function (pager,data) {
	this.pager = pager;
	this.data = data;
}



/**
 *
 *	This is the modal that reflects a program in the database
 *	@param modalName {string} Name of the Program in iroad2 to be mirrored
 *
 *	@param relations {iroad2.data.Relation[]}  Array of relationships of the program.
 *
 *	@example <caption>Example usage of initializing a modal.</caption>
 *	var driver = new iroad2.data.Modal("Driver",[]);
 *	@example <caption>Example usage of initializing a modal wih one to many relationship.</caption>
 *	var driver = new iroad2.data.Modal("Driver",[{name:"Offence Event",type:"ONE_MANY"}]);<br />
 *	@example <caption>Example usage of initializing a modal wih many to many relationship.</caption>
 *	var driver = new iroad2.data.Modal("Driver",[{name:"Offence Event",type:"MANY_MANY",pivot:"Offence"}]);
 */
iroad2.data.Modal = function (modalName,relations) {

	//Set self to get refference of this object
	self = this;
	//Set the modal name
	this.modalName = modalName;
	//Set relations
	this.relations = relations;
	/**
	 * Get the Modal name
	 *
	 * @return string modal name
	 */
	this.getModalName = function(){
		return modalName;
	}
	/**
	 * Get the Modal Relationships
	 *
	 * @return {iroad2.data.Relation[]} modal name
	 */
	this.getRelationships = function(){
		return self.relations;
	}
	/**
	 * Get a program from the list of iroad2 programs by its name
	 *
	 * @param string name
	 *
	 * @return Program
	 */
	this.getProgramByName = function(name){
		name = name.replace("_"," ");
		for(var i = 0;i < iroad2.data.programs.length;i++){
			if(iroad2.data.programs[i].name == name){
				return iroad2.data.programs[i];
			}
		}
	}
	/**
	 * Get a data element from the list of iroad2 dataElements by its id
	 *
	 * @param id {string} This is the dataElement id
	 *
	 * @return {object} The data element as a jsonObject
	 */
	this.getDataElement = function(id) {
		for(var i = 0; i < iroad2.data.dataElements.length; i++) {
			if (iroad2.data.dataElements[i].id == id) {
				return iroad2.data.dataElements[i];
			}
		}
	}
	/**
	 * Get a data element from the list of iroad2 dataElements by its name
	 *
	 * @param dataElementName {string} This is the name of the data element
	 *
	 * @return {object} The data element as a jsonObject
	 */
	this.getDataElementByName = function(name) {
		for(var i = 0; i < iroad2.data.dataElements.length; i++) {
			if (iroad2.data.dataElements[i].name == name) {
				return iroad2.data.dataElements[i];
			}
		}
	}
	/**
	 * Gets all rows of a program
	 *
	 * @param onResult {function}  Callback function after the result is returned
	 *
	 */
	this.getAll = function(){//}(onResult,pageSize,page){
		var onResult = arguments[0];
		//Get program by name
		var program = self.getProgramByName(self.modalName);

		var url = "api/events.json?totalPages=true&program="+program.id;

		if(arguments.length > 1){

			url = "api/events.json?totalPages=true&programStage="+program.programStages[0].id+"&pageSize="+arguments[1]+"&page=" + arguments[2];
		}
		// Stores the rows of an entity
		this.events = [];
		var selfGetAll = this;
		if(arguments.length == 4){
			selfGetAll.dataResults = new iroad2.data.DataResult();
		}
		//Checks that all requests are made
		this.resCount = [];
		this.resultsFetched = function(){
			if (selfGetAll.resCount.length == 0) {
				if(selfGetAll.dataResults != undefined){
					selfGetAll.dataResults.data = selfGetAll.events;
					onResult(selfGetAll.dataResults);
				}else{
					onResult(selfGetAll.events);
				}
			}
		}
		//Get events of the program from the server
		http.get(iroad2.config.baseUrl + url,function(result){
			if(selfGetAll.dataResults != undefined){
				selfGetAll.dataResults.pager = result.pager;
			}
			for(var j = 0; j < result.events.length; j++) {//For each event render to entity column json
				var event = result.events[j];
				selfGetAll.resCount.push(1);

				//Render events to appropriate Modal
				self.renderToJSON(event, function(object) {
					//Push object to events

					//document.getElementById("result").innerHTML += JSON.stringify(selfGet.events) +"<br /><br />";
					selfGetAll.events.push(object);

					//Pop count to signify
					selfGetAll.resCount.pop();

					//Check if all results from the server are fetched
					selfGetAll.resultsFetched();
				});
			}
			//Check if all results from the server are fetched
			selfGetAll.resultsFetched();
		});
		return;
	};
	/**
	 * Search events of a program
	 *
	 * @param criteria {iroad2.data.SearchCriteria} Array of search criterias where each element in the array is an object in the form {name,operator,value}
	 *
	 * @param onResult {function} Callback after the result is returned
	 *
	 */
	this.get = function(criteria,onResult){

		//Get program by name
		var program = self.getProgramByName(self.modalName);
		// Stores the rows of an entity
		this.events = [];
		var selfGet = this;
		//Checks that all requests are made
		this.getCount = [];
		this.resultsFetched = function(){
			if (selfGet.getCount.length == 0) {
				onResult(selfGet.events);
			}
		}

		//Get events of the program from the server
		http.get(iroad2.config.baseUrl + "api/events.json?program="+program.id,function(result2){

			if(result2.events != undefined)
			for(var j = 0; j < result2.events.length; j++) {//For each event render to entity column json
				var event = result2.events[j];
				if(event.dataValues != undefined)
				for(var k = 0; k < event.dataValues.length; k++) {
					if(event.dataValues[k].value == criteria.value){//Checks the conditions provided
						selfGet.getCount.push(1);
						//Render events to appropriate Modal
						self.renderToJSON(event, function(object) {
							//Push object to events
							selfGet.events.push(object);
							//Pop count to signify
							selfGet.getCount.pop();
							//Check if all results from the server are fetched
							selfGet.resultsFetched();
						});
						break;
					}

				}
			}
			//Check if all results from the server are fetched
			selfGet.resultsFetched();
		});
		return;
	}
	/**
	 * Find events of a program by id
	 *
	 * @param id {string} Identifier of an event
	 *
	 * @param onResult {function} Callback function after the result is returned.
	 *
	 */
	this.find = function(uid, onResult) {
		//Get program by name
		var program = self.getProgramByName(modalName);
		//Get events of the program from the server
		http.get(iroad2.config.baseUrl + "api/events/" + uid + ".json",
				function(result) {
			//Render to entity column json
			self.renderToJSON(result, function(object) {
				onResult(object);
			});
		},function(error){
			onResult({});
		});
	}

	this.renderToJSON = function(event, onSuccess) {
		//Object that holds the row data
		this.object = {};
		this.count = [];
		var selfrenderToJSON = this;
		//Checks that all requests are made
		this.count = [];
		this.checkAllResultsFetched = function(){
			if(selfrenderToJSON.count.length > 0)
			{
				selfrenderToJSON.count.pop().fetch();
			}else{
				onSuccess(selfrenderToJSON.object);
			}

		}
		/**
		 * Helper to fetch refference program
		 *
		 * @constructor
		 *
		 * @param programModal {iroad2.data.Modal} Program to fetch from
		 *
		 * @param id {string} Identifier of the event to be fetched from the program
		 */
		var RefferenceProgram = function(programModal, id) {
			this.program = programModal;
			this.value = id;
			this.fetch = function() {

				var selfProgram = this;
					//Find the event from the modal being refferenced
					this.program.find(this.value, function(result) {
						//Set the field in the json
						selfrenderToJSON.object[selfProgram.program.getModalName()] = result;

						//Check if all results from the server are fetched
						selfrenderToJSON.checkAllResultsFetched();
					});
			}
		}
		this.object["id"] = event.event;
		for(var k = 0; k < event.dataValues.length; k++) {

			var dataValue = event.dataValues[k];
			var dataElement = self.getDataElement(dataValue.dataElement);
			if (!dataElement.name.startsWith(iroad2.config.refferencePrefix)) {//If dataElement is not a foregin key
				//Set the value in the object
				selfrenderToJSON.object[dataElement.name] = dataValue.value;
			} else {//If dataElement is a foregin key fetch the refferencing program

				//Remove the refferencePrefix prefix to get the program for reffencing
				var program = dataElement.name.substring(iroad2.config.refferencePrefix.length);
				//Initialize the Modal from the program name
				var programModal = new iroad2.data.Modal(program, []);
				//Push the RefferenceProgram to hel the fetch
				selfrenderToJSON.count.push(new RefferenceProgram(programModal,dataValue.value));
			}
		}
		//Add relations to the object as specified by the relations
		//

		for(var k = 0; k < relations.length; k++) {//For each relation
			var relation = relations[k];
			var programModal = null;

			if(relation.type == "ONE_MANY"){//If relationship is one to many
				programModal = new iroad2.data.Modal(relation.name, []);
			}else if(relation.type == "MANY_MANY"){//If relationship is many to many
				programModal = new iroad2.data.Modal(relation.pivot, [new iroad2.data.Relation(relation.name)]);
				//Create modal with one to many relation with the pivot entity
				/*programModal = new iroad2.data.Modal(relation.pivot, [{
					"name" : relation.name,
					"type" : "ONE_MANY"
				}]);*/
			}
			//Initialize the RefferenceProgram from the program name
			var refProgram = new RefferenceProgram(programModal,dataValue.value);
			//Override the fetch function to implement a get instead of a find
			refProgram.fetch = function() {
				var selfProgram = this;
				this.program.get({program:self.getModalName(),value:selfrenderToJSON.object.id}, function(result) {
					selfrenderToJSON.object[selfProgram.program.getModalName()] = result;

					//Check if all results from the server are fetched
					selfrenderToJSON.checkAllResultsFetched();
				});
			}
			//Push the RefferenceProgram to hel the fetch
			selfrenderToJSON.count.push(refProgram);
		}
		selfrenderToJSON.checkAllResultsFetched();
	}
	/**
	 * Converts a json object to an event representation in dhis
	 *
	 * @param object {object} Json object to convert
	 *
	 * @param otherData {object} Additional data to be added to the event like program,eventDate,orgUnit etc
	 */
	this.convertToEvent = function(modalName,object,otherData){
		program = self.getProgramByName(modalName);
		var selfConvertToEvent = this;
		var date = new Date();
		var event = {
				program:program.id,
				dataValues:[]
		};
		for(var key in otherData){
			event[key] = otherData[key];
		}
		for(var key in object){
			var element ={};
			if(key == "id"){
				event.event = object[key];
			}else if(typeof object[key] == "object"){
            	var dataElement = self.getDataElementByName(iroad2.config.refferencePrefix + key.replace(" ","_"));
            	if(dataElement != undefined)
            	{
            		element.dataElement = dataElement.id;
                	element.value = object[key].id;
            	}else{
            		dataElement = self.getDataElementByName(key);
            		if(dataElement != undefined)
                	{
            			element.dataElement = dataElement.id;
            			element.value = object[key];
                	}
            	}
            }else if(key.indexOf("_") > -1){
            	var dataElement = self.getDataElementByName(iroad2.config.refferencePrefix + key.replace(" ","_"));
            	element.dataElement = dataElement.id;
    			element.value = object[key];
            }
            else{
            	try{
            		var dataElement = self.getDataElementByName(key);
                	element.dataElement = dataElement.id;
                	element.value = object[key];
            	}catch(e){
            		console.error("Invalid key '" + key +"' bypassed.");
            	}
            }
            event.dataValues.push(element);
        }
		return event;
	}
	/**
	 * Save an event from a json object
	 *
	 * @param data {object | array} Json object to be saved
	 *
	 * @param onSuccess {function} Callback function after the result is returned successfully.
	 *
	 * @param (Optional) onError {function} Callback function an error has occured.
	 */
	this.save = function(data,otherData,onSuccess,onError,modalName){
		var savingModal = modalName;
		if(savingModal == undefined){
			savingModal = self.getModalName();
		}
		var sendData = {};
		var saveUrl = iroad2.config.baseUrl + "api/events";
		if(Array.isArray(data)){
			var events = [];

			for(var count = 0; count < data.length;count++){
				events.push(self.convertToEvent(savingModal,data[count],otherData));
			}
			sendData.events = events;
		}else{
			sendData = self.convertToEvent(savingModal,data,otherData);
		}
		//var event = self.convertToEvent(data);
		if(sendData.event){
			console.log("Updating Data "+savingModal+":" + JSON.stringify(sendData));
			saveUrl += "/" +sendData.event;
			http.put(saveUrl,JSON.stringify(sendData),function(results){
				onSuccess(results);
			},function(results){
				onError(results);
			});
			//delete sendData.event;
		}else{
			console.log("Saving Data "+savingModal+":" + JSON.stringify(sendData));
			http.post(saveUrl,JSON.stringify(sendData),function(results){
				onSuccess(results);
			},function(results){
				onError(results);
			});
		}
	}
};
/**
 *
 *	Makes http requests
 *
 *	@constructor
 *
 */
http = {
	/**
	 * Makes a http request
	 *
	 * @param url {string} Url for the request
	 *
	 * @param method {string} Method to be used.
	 *
	 * @param data {object} Data to be sent to the server.
	 *
	 * @param onSuccess {function} Callback function after the result is returned successfully.
	 *
	 * @param (Optional) onError {function} Callback function an error has occured.
	 */
	request : function(url, method, data, onSuccess, onError) {
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if(xmlhttp.status == 200){
					try {
						onSuccess(JSON.parse(xmlhttp.responseText));
					} catch (e) {
						if (xmlhttp.responseText.startsWith("Event updated: ")) {
							onSuccess({
								"status" : "SUCCESS",
								"updatedEvent" : xmlhttp.responseText.replace(
										"Event updated: ", "").replace("\r\n", "")
							})
						} else {
							console.error("Returned:" + xmlhttp.responseText);
							if (onError == undefined) {
								console.error(e);
							} else {
								onError(e);
							}
						}
					}
				}else if(xmlhttp.status == 404){
					onError({});
				}


			}
		}
		xmlhttp.open(method, url, true);
		xmlhttp.setRequestHeader("Content-Type", "application/json");
		try{
			xmlhttp.send(data);
		}catch(e){
			onError(e);
		}

	},
	/**
	 * Makes a http get request
	 *
	 * @param url {string} Url for the request
	 *
	 * @param onSuccess {function} Callback function after the result is returned successfully.
	 *
	 * @param (Optional) onError {function} Callback function an error has occured.
	 */
	get : function(url, onSuccess,onError) {
		this.request(url,"GET",null,onSuccess,onError);
	},
	/**
	 * Makes a http post request
	 *
	 * @param url {string} Url for the request
	 *
	 * @param onSuccess {function} Callback function after the result is returned successfully.
	 *
	 * @param (Optional)onError {function} Callback function an error has occured.
	 */
	post : function(url, data,onSuccess,onError) {
		this.request(url,"POST",data,onSuccess,onError);
	},
	/**
	 * Makes a http put request
	 *
	 * @param url {string} Url for the request
	 *
	 * @param onSuccess {function} Callback function after the result is returned successfully.
	 *
	 * @param (Optional)onError {function} Callback function an error has occured.
	 */
	put : function(url, data,onSuccess,onError) {
		this.request(url,"PUT",data,onSuccess,onError);
	}
}
