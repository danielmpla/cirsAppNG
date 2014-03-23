/**
 * Created by Daniel on 19.03.14.
 */
var allReportsApp = angular.module('allReportsApp', ['ngRoute', 'allReportsServices']);

allReportsApp.controller('allReportsCtrl', ['$scope', 'AllReportsService',
    function($scope, AllReportsService){
        $scope.publications = AllReportsService.getAllReports();
    }
]);

