/**
 * Created by Daniel on 19.03.14.
 */

var myMessagesApp = angular.module('reportApp', ['allReportsServices']);

myMessagesApp.controller('reportCtrl', ['$scope', 'ReportService', 'ServerLocation', '$http', function($scope, ReportService, ServerLocation, $http){

    $scope.serverLocation = ServerLocation.getLocation();

    $scope.id =  window.location.search.substring(1).split("&")[0].split("=")[1];

    $scope.publication = ReportService.getReport($scope.serverLocation, {id: $scope.id});

    $scope.comments = ReportService.getReportComments($scope.serverLocation, {id: $scope.id});

    $scope.answerComment = null;

    $scope.userComment = {};

    $scope.isCommenting = false;

    $scope.addComment = function (comment) {
        $scope.answerComment = comment;
        $scope.isCommenting = true;
    };

    $scope.sendComment = function () {

        if($scope.userComment.author == null){
            $scope.userComment.author = "";
        }

        if($scope.answerComment == null){
            $scope.userComment.id = $scope.id;

            $http({
                method: "POST",
                url: "http://" + $scope.serverLocation.address + ":" + $scope.serverLocation.port + "/RisikousRESTful/rest/publication/addComment",
                data :JSON.stringify($scope.userComment),
                headers: {
                    "Content-Type" : "application/json"
                }
            }).error(function(data) {
                alert("Fehler: " + JSON.stringify(data));
                return;
            });
        } else {
            $scope.userComment.id = $scope.answerComment.id;

            $http({
                method: "POST",
                url: "http://" + $scope.serverLocation.address + ":" + $scope.serverLocation.port + "/RisikousRESTful/rest/comment/addAnswer",
                data :JSON.stringify($scope.userComment),
                headers: {
                    "Content-Type" : "application/json"
                }
            })
                .error(function(data) {
                    alert("Fehler: " + JSON.stringify(data));
                })
                .success(function (data){
                    alert("Ihr Kommentar wurde erfolgreich gespeichert");
                    $scope.isCommenting = false;
                    $scope.answerComment = null;
                    $scope.userComment = {};
                    $scope.comments = ReportService.getReportComments($scope.serverLocation, {id: $scope.id});
                });
        }
    };
}]);