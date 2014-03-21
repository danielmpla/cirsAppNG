/**
 * Created by Daniel on 19.03.2014.
 */
var newReportApp = angular.module('newReportApp', ['allReportsServices']);

var newReportCtrl = newReportApp.controller('newReportCtrl', ['$scope', 'NewReport', '$http', 'ReportingAreas', function($scope, NewReport, $http, ReportingAreas){
    $scope.questionaire = NewReport.get();
    $scope.reportingAreas = ReportingAreas.get();
    $scope.submitForm = function () {
        $http({
            method: "POST",
            url: "http://141.46.136.3:8080/RisikousRESTful/rest/questionnaire/addQuestionnaire",
            data :JSON.stringify($scope.questionaire),
            headers: {
                "Content-Type" : "application/json"
            }
        })
            .success(function(data, status, headers, config){
                alert("Ihre Daten wurden erfolgreich gespeichert!\nIhre Reportnummer lautet: " + data.number);
                window.location.href = "127.0.0.1";
            })
            .error(function(data, status, headers, config){

            });
    }
}]);