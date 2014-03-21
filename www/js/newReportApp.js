/**
 * Created by Daniel on 19.03.2014.
 */
var newReportApp = angular.module('newReportApp', ['allReportsServices']);

var newReportCtrl = newReportApp.controller('newReportCtrl', ['$scope', 'NewReport', '$http', 'ReportingAreas', function($scope, NewReport, $http, ReportingAreas){
    $scope.questionaire = NewReport.get();
    $scope.reportingAreas = ReportingAreas.get();
    $scope.timestamp = null;

    $scope.capturePhoto = function (){
        // Wird aufgerufen, wenn ein Bild erfolgreich geladen wurde
        function onPhotoDataSuccess(imageData) {
            $scope.questionaire.files.file[0].data = imageData;
            $scope.questionaire.files.file[0].name = "Image.jpeg";

            console.log(JSON.stringify(jsonObject));

            // Zeigt das aufgenommene Bild an
            document.getElementById("image").src = "data:image/jpeg;base64," + imageData;
        }

        // Nimmt ein Bild mit der Kamera des Geräts auf und gibt einen base64-encoded String zurück
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, destinationType: navigator.camera.DestinationType });

        // Wird aufgerufen wenn ein Fehler bei der Kamera passiert
        function onFail(message) {
            alert('Failed because: ' + message);
        }
    };

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