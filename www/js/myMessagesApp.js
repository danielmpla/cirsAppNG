/**
 * Created by Daniel on 19.03.14.
 */

var myMessagesApp = angular.module('reportApp', ['allReportsServices']);

myMessagesApp.controller('reportCtrl', ['$scope', 'Report', 'ReportComments', function($scope, Report, ReportComments){

    $scope.id =  window.location.search.substring(1).split("&")[0].split("=")[1];

    $scope.publication = Report.get({id: $scope.id});

    $scope.comments = ReportComments.get({id: $scope.id});

    $scope.answerComment = null;

    $scope.userComment = {};

    $scope.isCommenting = false;

    $scope.addComment = function () {
        $scope.$apply($scope.isCommenting = true);
    };

    $scope.sendComment = function () {
        //TODO send comment
        alert("Ihr Kommentar wurde erfolgreich gespeichert");
        $scope.$apply($scope.isCommenting = false);
        $scope.$apply($scope.answerComment = null);
        $scope.$apply($scope.userComment = {});
    };
}]);