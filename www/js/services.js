/**
 * Created by Daniel on 19.03.14.
 */
var allReportsServices = angular.module('allReportsServices', ['ngResource', 'ngCookies']);

allReportsServices.factory('AllReports', ['$resource',
    function($resource){
        var restURL = '/RisikousRESTful/rest/publications';

        var allReportsService = {
            getAllReports: function(serverLocation){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL, {'get': {method:'GET'}}).get();
            }
        };

        return allReportsService;
    }
]);

allReportsServices.factory('ReportService', ['$resource',
    function($resource){
        var restURL = '/RisikousRESTful/rest/';

        var reportServices = {
            getReport: function(serverLocation, param){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'publication/id/:id', {'get': {method:'GET', id:'@id', isArray: false}}).get(param);
            },
            getReportComments: function(serverLocation, param){
               return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'comments/id/:id', {'get': {method: 'GET', id:'@id', isArray: false}}).get(param);
            }
        };

        return reportServices;
    }
]);

allReportsServices.factory('NewReportService', ['$resource',
    function($resource){
        var restURL = '/RisikousRESTful/rest/';

        var newReportService = {
            getNewReport: function(serverLocation){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'questionnaire', {'get': {method: 'GET'}}).get();
            },
            getReportingAreas: function(serverLocation){
                return $resource('http://' + serverLocation.address + ':' + serverLocation.port + restURL + 'reportingareas', {'get': {method: 'GET'}}).get();
            }
        };

        return newReportService;
    }
]);

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