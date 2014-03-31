/**
 * @name optionsApp
 */
var optionsApp = angular.module('optionsApp', ['allReportsServices']);

/**
 * @name optionsCtrl
 * @description is the controller as of MVC for the settings
 */
optionsApp.controller('optionsCtrl', ['$scope', 'ServerLocation', function($scope, ServerLocation){
    $scope.serverLocation = ServerLocation.getLocation();

    /**
     * @name saveServerLocation
     * @description is the function which would be called from the view to save a new location of the server
     */
    $scope.saveServerLocation = function(){
        ServerLocation.saveLocationToDatabase($scope.serverLocation);
    }

}]);