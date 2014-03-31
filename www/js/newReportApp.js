/**
 * @name newReportApp
 */
var newReportApp = angular.module('newReportApp', ['allReportsServices']);

/**
 * @name newReportCtrl
 * @description is the controller as of MVC for new reports
 */
var newReportCtrl = newReportApp.controller('newReportCtrl', ['$scope', 'NewReportService',
    function ($scope, NewReportService) {
        $scope.questionaire = NewReportService.getNewReport();
        $scope.reportingAreas = NewReportService.getReportingAreas();
        $scope.timestamp = null;

		/**
		 * @name capturePhoto
		 * @description is the function which would be called from the view to take a picture
		 */
		$scope.capturePhoto = function (){
            NewReportService.capturePicture();
        };

        $scope.submitForm = function () {
            if ($scope.timestamp != null) {
                var dateTime = NewReportService.timestampToStringObject($scope.timestamp);
		/**
		 * @name submitFrom
		 * @description is the function which would be called from the view to send a new report
		 */
		$scope.submitForm = function () {
			if($scope.timestamp != null){
                $scope.questionaire.pointOfTime.date.date = dateTime.date;
                $scope.questionaire.pointOfTime.time.time = dateTime.time;
            }

            NewReportService.sendReport($scope.questionaire).success(function (data) {
                alert("Ihre Daten wurden erfolgreich gespeichert!\nIhre Reportnummer lautet: " + data.number);
                window.location.href = "../index.html";
            }).error(function (data) {
                alert("Error: " + JSON.stringify(data));
            });
        }
    }]);
