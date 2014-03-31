/**
 * @name allReportsApp
 */
var allReportsApp = angular.module('allReportsApp', ['ngRoute', 'allReportsServices']);

/**
 * @name allReportsCtrl
 * @description is the controller as of MVC for all reports
 */
allReportsApp.controller('allReportsCtrl', ['$scope', 'AllReportsService',
    function($scope, AllReportsService){
        $scope.publications = AllReportsService.getAllReports();
    }
]);

