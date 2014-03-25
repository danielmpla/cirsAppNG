/**
 * Created by Daniel on 19.03.14.
 */

var myMessagesApp = angular.module('reportApp', ['allReportsServices']);

myMessagesApp.controller('reportCtrl', ['$scope', 'ReportService', function ($scope, ReportService) {

    $scope.id = window.location.search.substring(1).split("&")[0].split("=")[1];

    $scope.publication = ReportService.getReport({id: $scope.id});

    $scope.comments = ReportService.getReportComments({id: $scope.id});

    $scope.answerComment = null;

    $scope.userComment = {};

    $scope.isCommenting = false;

    $scope.addComment = function (comment) {
        $scope.answerComment = comment;
        $scope.isCommenting = true;
    };

    $scope.sendComment = function () {

        function success() {
            alert("Ihr Kommentar wurde erfolgreich gespeichert");
            $scope.isCommenting = false;
            $scope.answerComment = null;
            $scope.userComment = {};
            $scope.comments = ReportService.getReportComments($scope.serverLocation, {id: $scope.id});
        }

        function error(data) {
            alert("Fehler: " + JSON.stringify(data));
        }

        if ($scope.userComment.author == null) {
            $scope.userComment.author = "";
        }

        if ($scope.answerComment == null) {
            $scope.userComment.id = $scope.id;

            ReportService.sendComment($scope.userComment).success(function (data) {
                success();
            }).error(function (data) {
                error(data);
            });
        } else {
            $scope.userComment.id = $scope.answerComment.id;

            ReportService.sendAnswer($scope.userComment).success(function (data) {
                success();
            }).error(function (data) {
                error(data);
            });
        }
    };
}]);