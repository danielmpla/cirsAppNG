/**
 * Created by Daniel on 19.03.14.
 */
var allReportsServices = angular.module('allReportsServices', ['ngResource', 'ngCookies']);

allReportsServices.factory('AllReportsService', ['$resource', 'ServerLocation',
    function($resource, ServerLocation){
        var restURL = '/RisikousRESTful/rest/publications';
        var serverLocation = ServerLocation.getLocation();

        var allReportsService = {
            getAllReports: function(){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL, {'get': {method:'GET'}}).get();
            }
        };

        return allReportsService;
    }
]);

allReportsServices.factory('ReportService', ['$resource', 'ServerLocation', '$http',
    function($resource, ServerLocation, $http){
        var restURL = '/RisikousRESTful/rest/';
        var serverLocation = ServerLocation.getLocation();

        var reportServices = {
            getReport: function(param){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'publication/id/:id', {'get': {method:'GET', id:'@id', isArray: false}}).get(param);
            },
            getReportComments: function(param){
               return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'comments/id/:id', {'get': {method: 'GET', id:'@id', isArray: false}}).get(param);
            },
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

allReportsServices.factory('NewReportService', ['$resource', 'ServerLocation', '$http', 'ParserService', 'PictureService',
    function($resource, ServerLocation, $http, ParserService, PictureService){
        var restURL = '/RisikousRESTful/rest/';
        var serverLocation = ServerLocation.getLocation();

        var newReportService = {
            getNewReport: function(){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'questionnaire', {'get': {method: 'GET'}}).get();
            },
            getReportingAreas: function(){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'reportingareas', {'get': {method: 'GET'}}).get();
            },
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

allReportsServices.factory('ParserService', function () {
   var parserService = {
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
           ;
           if (parseInt(day) < 10) {
               day = "0" + day;
           }
           ;

           if (parseInt(hours) < 10) {
               hours = "0" + hours;
           }
           ;
           if (parseInt(minutes) < 10) {
               minutes = "0" + minutes;
           }
           ;

           return {"date": day + "." + month + "." + year,
               "time": hours + ":" + minutes};
       }
   };

   return parserService;
});

allReportsServices.factory('PictureService', function(){
    var pictureService = {
        capturePicture: function(){
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: destinationType });
        }
    };

    // Wird aufgerufen, wenn ein Bild erfolgreich geladen wurde
    function onPhotoDataSuccess(imageData) {
        angular.element("body").scope().$apply(angular.element("body").scope().questionaire.files.file[0].data = imageData.toString());
        angular.element("body").scope().questionaire.files.file[0].name = "Image.jpeg";

        document.getElementById("image").src = "data:image/jpeg;base64," + imageData;
    }

    // Wird aufgerufen wenn ein Fehler bei der Kamera passiert
    function onFail(message) {
        alert('Failed because: ' + message);
    }

    return pictureService;
});

allReportsServices.factory('ServerLocation', ['$cookieStore', function ($cookieStore){

    var dbConnection = {
        saveLocationToDatabase: function (locationObject){
            $cookieStore.put("address", locationObject.address);
            $cookieStore.put("port", locationObject.port);
            alert("Ihre Einstellungen wurden erfolgreich gespeichert!");
            },

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