/**
 * Created by Daniel on 19.03.14.
 */
var allReportsApp = angular.module('allReportsApp', ['ngRoute', 'allReportsServices']);

allReportsApp.controller('allReportsCtrl', ['$scope', 'AllReports', 'ServerLocation',
    function($scope, AllReports, ServerLocation){
        $scope.serverLocation = ServerLocation.getLocation($scope);
        $scope.publications = AllReports.getAllReports($scope.serverLocation);
    }
]);

