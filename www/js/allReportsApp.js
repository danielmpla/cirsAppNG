/**
 * Created by Daniel on 19.03.14.
 */
var allReportsApp = angular.module('allReportsApp', ['ngRoute', 'allReportsServices']);

allReportsApp.controller('allReportsCtrl', ['$scope', 'AllReports',
    function($scope, AllReports){
        $scope.publications = AllReports.get();
    }
]);

