/**
 * Created by Daniel on 22.03.2014.
 */
var optionsApp = angular.module('optionsApp', ['allReportsServices']);

optionsApp.controller('optionsCtrl', ['$scope', 'ServerLocation', function($scope, ServerLocation){
    $scope.serverLocation = ServerLocation.getLocation();

    $scope.saveServerLocation = function(){
        ServerLocation.saveLocationToDatabase($scope.serverLocation);
    }

}]);