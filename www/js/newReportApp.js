/**
 * Created by Daniel on 19.03.2014.
 */
var newReportApp = angular.module('newReportApp', ['allReportsServices']);

var newReportCtrl = newReportApp.controller('newReportCtrl', ['$scope', 'NewReportService',
    function($scope, NewReportService){
    $scope.questionaire = NewReportService.getNewReport();
    $scope.reportingAreas = NewReportService.getReportingAreas();
    $scope.timestamp = null;

    $scope.capturePhoto = function (){

        NewReportService.capturePhoto().done(function (imageData) {
            $scope.questionaire.files.file[0].data = imageData;
            $scope.questionaire.files.file[0].name = "Image.jpeg";

            document.getElementById("image").src = "data:image/jpeg;base64," + imageData;
        });
    };

    $scope.submitForm = function () {
        if($scope.timestamp != null){

            var dateTime = NewReportService.timestampToStringObject($scope.timestamp);

            $scope.questionaire.pointOfTime.date.date = dateTime.date;
            $scope.questionaire.pointOfTime.time.time = dateTime.time;
        }

        NewReportService.sendReport($scope.questionaire).done(function (success){
            if(success){
                alert("Ihre Daten wurden erfolgreich gespeichert!\nIhre Reportnummer lautet: " + data.number);
                window.location.href = "../index.html";
            } else {
                alert("Error: " + JSON.stringify(data));
            }
        });
    }
}]);