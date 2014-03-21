/**
 * Created by Daniel on 19.03.14.
 */
var allReportsServices = angular.module('allReportsServices', ['ngResource']);

allReportsServices.factory('AllReports', ['$resource',
    function($resource){
        var restURL = 'http://141.46.136.3:8080/RisikousRESTful/rest/publications';

        return $resource(restURL, {'get': {method:'GET', transformResponse: function (data) {
            return data.publication;
        }
        }});
    }
]);

allReportsServices.factory('Report', ['$resource',
    function($resource){
        var restURL = 'http://141.46.136.3:8080/RisikousRESTful/rest/publication/id/:id';

        return $resource(restURL, {'get': {method:'GET', id:'@id', isArray: false
        }});
    }
]);

allReportsServices.factory('ReportComments', ['$resource',
    function($resource){
        var restURL = 'http://141.46.136.3:8080/RisikousRESTful/rest/comments/id/:id';

        return $resource(restURL,
            {'get': {method: 'GET', id:'@id', isArray: false}}
        );
    }
]);

allReportsServices.factory('ReportAddComment', ['$resource',//TODO
    function($resource){
        var restURL = 'http://141.46.136.3:8080/RisikousRESTful/rest/comments/id/:id';

        return $resource(restURL,
            {'get': {method: 'GET', id:'@id', isArray: false}}
        );
    }
]);

allReportsServices.factory('ReportAddAnswer', ['$resource',//TODO
    function($resource){
        var restURL = 'http://141.46.136.3:8080/RisikousRESTful/rest/comments/id/:id';

        return $resource(restURL,
            {'get': {method: 'GET', id:'@id', isArray: false}}
        );
    }
]);

allReportsServices.factory('NewReport', ['$resource',
    function($resource){
        var restURL = 'http://141.46.136.3:8080/RisikousRESTful/rest/questionnaire';

        return $resource(restURL,
            {'get': {method: 'GET'}}
        );
    }
]);

allReportsServices.factory('ReportingAreas', ['$resource',
    function($resource){
        var restURL = 'http://141.46.136.3:8080/RisikousRESTful/rest/reportingareas';

        return $resource(restURL,
            {'get': {method: 'GET'}}
        );
    }
]);