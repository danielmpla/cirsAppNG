/**
 * Created by Daniel on 19.03.2014.
 */
var newReportApp = angular.module('newReportApp', ['allReportsServices']);

var newReportCtrl = newReportApp.controller('newReportCtrl', ['$scope', 'NewReport', '$http', 'ReportingAreas', function($scope, NewReport, $http, ReportingAreas){
    $scope.questionaire = NewReport.get();
    $scope.reportingAreas = ReportingAreas.get();
    $scope.timestamp = null;
    $scope.submitForm = function () {
        if($scope.timestamp != null){
            var date = new Date(Date.parse($scope.timestamp));

            var year = date.getFullYear();
            var month = parseInt(date.getMonth() + 1).toString();
            var day = date.getDate();
            var hours = date.getHours();
            var minutes = date.getMinutes();

            if(parseInt(hours) + (date.getTimezoneOffset() / 60) >= 0){
                hours =  parseInt(hours + (date.getTimezoneOffset() / 60)).toString();
            }

            if (parseInt(month) < 10) {
                month = "0" + month;
            };
            if (parseInt(day) < 10) {
                day = "0" + day;
            };

            if (parseInt(hours) < 10) {
                hours = "0" + hours;
            };
            if (parseInt(minutes) < 10) {
                minutes = "0" + minutes;
            };

            $scope.questionaire.pointOfTime.date.date = day + "." + month + "." + year;
            $scope.questionaire.pointOfTime.time.time = hours + ":" + minutes;
        }
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
                window.location.href = "../index.html";
            })
            .error(function(data, status, headers, config){

            });
    }
}]);