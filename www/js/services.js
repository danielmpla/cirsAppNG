/**
 * @ngdoc service
 * @name allReportsServices
 * @description this service holds the the REST-Services, a parse service for transforming the date for the server and the a service for taking pictures with the help of the PhoneGap Plugin
 */
var allReportsServices = angular.module('allReportsServices', ['ngResource', 'ngCookies']);

/**
 * @name AllReportsService
 * @description this is the service container for the allReports app and has a service for REST-communication
 */
allReportsServices.factory('AllReportsService', ['$resource', 'ServerLocation',
    function($resource, ServerLocation){
        var restURL = '/RisikousRESTful/rest/publications';
        var serverLocation = ServerLocation.getLocation();

        var allReportsService = {
            /**
             * @property getAllReports
             * @description this method grabs the all reports JSON-Object from the server
             * @returns {Object} The JSON-Object of the server
             */
            getAllReports: function(){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL, {'get': {method:'GET'}}).get();
            }
        };

        return allReportsService;
    }
]);

/**
 * @name ReportService
 * @description this is the service container for the report app and has services for REST-communication
 */
allReportsServices.factory('ReportService', ['$resource', 'ServerLocation', '$http',
    function($resource, ServerLocation, $http){
        var restURL = '/RisikousRESTful/rest/';
        var serverLocation = ServerLocation.getLocation();

        var reportServices = {
            /**
             * @property getReport
             * @param {String} param the id of the publication which should be grabbed
             * @returns {Object} the wanted publication from the server
             */
            getReport: function(param){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'publication/id/:id', {'get': {method:'GET', id:'@id', isArray: false}}).get(param);
            },
            /**
             * @property getReportComments
             * @param {String} param the id of the publication which comments should be grabbed
             * @returns {Object} the wanted comments for the publications from the server
             */
            getReportComments: function(param){
               return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'comments/id/:id', {'get': {method: 'GET', id:'@id', isArray: false}}).get(param);
            },
            /**
             * @property sendComment
             * @param {Object} comment the comment which should be sent including the id of the publication
             */
            sendComment: function(comment){
                return $http({
                    method: "POST",
                    url: "http://" + serverLocation.address + ":" + serverLocation.port + "/RisikousRESTful/rest/publication/addComment",
                    data :JSON.stringify(comment),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                });
            },
            /**
             * @property sendAnswer
             * @param {Object} answer the answer of a comment which should be sent including the id of the comment
             */
            sendAnswer: function(answer){
                return $http({
                    method: "POST",
                    url: "http://" + serverLocation.address + ":" + serverLocation.port + "/RisikousRESTful/rest/comment/addAnswer",
                    data :JSON.stringify(answer),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                });
            }
        };

        return reportServices;
    }
]);

/**
 * @name NewReportsService
 * @description this is the service container for the report app and has services for REST-communication, parsing and taking pictures
 */
allReportsServices.factory('NewReportService', ['$resource', 'ServerLocation', '$http', 'ParserService', 'PictureService',
    function($resource, ServerLocation, $http, ParserService, PictureService){
        var restURL = '/RisikousRESTful/rest/';
        var serverLocation = ServerLocation.getLocation();

        var newReportService = {
            /**
             * @property getNewReport
             * @description grabs the questionnaire skeleton from the server
             * @returns {Object} the questionnaire skeleton
             */
            getNewReport: function(){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'questionnaire', {'get': {method: 'GET'}}).get();
            },
            /**
             * @property getReportingAreas
             * @returns {Object} all reporting areas
             */
            getReportingAreas: function(){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'reportingareas', {'get': {method: 'GET'}}).get();
            },
            /**
             * @property sendReport
             * @param {Object} report the report which should be sent to the server
             */
            sendReport: function(report){
                return $http({
                    method: "POST",
                    url: "http://" + serverLocation.address + ":" + serverLocation.port + "/RisikousRESTful/rest/questionnaire/addQuestionnaire",
                    data :JSON.stringify(report),
                    headers: {
                        "Content-Type" : "application/json"
                    }
                });
            },
            /**
             * @property timestampToString
             * @param {String} timestamp any String which can be parsed from Date.parse()
             * @returns {Object} containing the both Strings for point of time requested by the RisikousRESTful Server
             */
            timestampToStringObject: function(timestamp){
                return ParserService.timestampToDateTimeStringObject(timestamp);
            },
            capturePicture: function(){
                PictureService.capturePicture();
            }
        };

        return newReportService;
    }
]);

/**
 * @name ParseService
 * @description holds the services for parsing Strings to Objects
 */
allReportsServices.factory('ParserService', function () {
   var parserService = {
       /**
        * @property timestampToDateTimeStringObject
        * @param {String} timestamp the timestamp which should be converted
        * @returns {{date: string, time: string}}
        */
       timestampToDateTimeStringObject: function (timestamp) {
           var date = new Date(Date.parse(timestamp));

           var year = date.getFullYear();
           var month = parseInt(date.getMonth() + 1).toString();
           var day = date.getDate();
           var hours = date.getHours();
           var minutes = date.getMinutes();

           if (parseInt(hours) + (date.getTimezoneOffset() / 60) >= 0) {
               hours = parseInt(hours + (date.getTimezoneOffset() / 60)).toString();
           }

           if (parseInt(month) < 10) {
               month = "0" + month;
           }

           if (parseInt(day) < 10) {
               day = "0" + day;
           }


           if (parseInt(hours) < 10) {
               hours = "0" + hours;
           }

           if (parseInt(minutes) < 10) {
               minutes = "0" + minutes;
           }


           return {"date": day + "." + month + "." + year,
               "time": hours + ":" + minutes};
       }
   };

   return parserService;
});

/**
 * @name PictureService
 * @description is a service container which holds all services for taking pictures using the PhoneGap Plugin
 */
allReportsServices.factory('PictureService', function(){
    var pictureService = {
        /**
         * @property capturePicture
         * @description captures a picture
         */
        capturePicture: function(){
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: destinationType });
        }
    };

    function onPhotoDataSuccess(imageData) {
        angular.element("body").scope().$apply(angular.element("body").scope().questionaire.files.file[0].data = imageData.toString());
        angular.element("body").scope().questionaire.files.file[0].name = "Image.jpeg";

        document.getElementById("image").src = "data:image/jpeg;base64," + imageData;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }

    return pictureService;
});

/**
 * @name ServerLocation
 * @description is a service container for saving the location of the RisikousRESTful Server
 */
allReportsServices.factory('ServerLocation', ['$cookieStore', function ($cookieStore){

    var dbConnection = {
        /**
         * @property saveLocationToDatabase
         * @param {Object} locationObject containing the location of the server
         */
        saveLocationToDatabase: function (locationObject){
            $cookieStore.put("address", locationObject.address);
            $cookieStore.put("port", locationObject.port);
            alert("Ihre Einstellungen wurden erfolgreich gespeichert!");
            },

        /**
         * @property getLocation
         * @returns {{address: string, port: string}} the location of the server or if not found a standard location
         */
        getLocation: function (){
                var address = $cookieStore.get("address");
                var port = $cookieStore.get("port");

                if(address == null){
                    $cookieStore.put("address", "141.46.136.3");
                    $cookieStore.put("port", "8080");
                    address = $cookieStore.get("address");
                    port = $cookieStore.get("port");
                }

                return {"address": address, "port": port};
            }
    };

    return dbConnection;
}]);