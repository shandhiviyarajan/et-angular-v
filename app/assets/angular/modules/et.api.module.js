/**
 * @project - Easy trades
 * @date - April 28 2017
 * @type - Javascript / JQuery/ Angular
 * @file - Application API calls
 * @author - Shan Dhiviyajan <prashasoft@gmail.com>
 */

/*
 API Service & Factory
 ----------------------------------------------------------------------------------------------------------------- */

(function ($, angular) {
    "use strict";

    //Angular strict DI Mode enabled

    //Start etAPI module
    angular.module("etAPI", [
        'angular-loading-bar',
        'etConstant',
        'ngResource',
        'ngCookies'
    ]);

    angular.module("etAPI")
        .config(config);
    config.$inject = ['$httpProvider'];
    function config($httpProvider) {
        //Set fucking default headers//
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

    }


    /* Common Variables
     --------------------------------------------------------------------------- */
    angular.module("etAPI")
        .factory("AppService", AppService);
    AppService.$inject = ['$rootScope', '$http', '$timeout'];
    function AppService($rootScope, $http, $timeout) {

        var AppService = {};

        AppService.Collections = [];
        AppService.Collections.Search = [];
        AppService.Skills = [];
        AppService.Locations = [];

        /* Get all locations & skills
         --------------------------------------------------------------------------- */
        AppService.GetSkillsLocations = function (skills, locations) {
            $http({
                url: 'https://easytrades.herokuapp.com/skills',
                method: 'GET'
            }).then(function (response) {
                if (response.data.status) {

                    skills(response.data);

                } else {
                    console.log("Empty Skills");
                }
            }, function (error) {

            });


            //Get locations
            $http({
                url: 'https://easytrades.herokuapp.com/locations/cities',
                method: 'GET'
            }).then(function (response) {
                if (response.data.status) {

                    locations(response.data);

                } else {
                    console.log("Empty Locations");
                }
            }, function (error) {

            });
        };



        return AppService;
    }

    /* Authentication factory
     --------------------------------------------------------------------------- */
    angular.module("etAPI")
        .factory("AuthService", AuthService);
    AuthService.$inject = ['$http', '$cookieStore', '$rootScope', 'RESOURCE_URL'];

    function AuthService($http, $cookieStore, $rootScope, RESOURCE_URL) {

        var AuthService = {};


        /* Authentication Login / Sign In
         --------------------------------------------------------------------------- */
        AuthService.Login = function (email, password, callback) {
            $http({
                url: RESOURCE_URL.LOGIN,
                method: 'POST',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                data: "Email=" + email + "&Password=" + password

            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Authentication set token and username and cookie object
         ---------------------------------------------------------------------------- */
        AuthService.SetCredentials = function (user) {
            //Set user data to $rootScope
            $rootScope.globals = {
                current_user: {
                    username: user.username,
                    token: user.token,
                    type: user.type
                }
            };
            console.log($rootScope);

            //Set cookie
            $cookieStore.put('globals', $rootScope.globals);
        };

        /* is Authenticated
         --------------------------------------------------------------------------- */
        AuthService.isAuthenticated = function () {

            if ($rootScope.globals.current_user.token == "" || $rootScope.globals.current_user.token == undefined || $rootScope.globals.current_user.token == null || $cookieStore.get('globals').current_user.token == "" || $cookieStore.get('globals').current_user.token == undefined || $cookieStore.get('globals').current_user.token == null) {
                $rootScope.isAuthenticated = false;
                return false;
            }

            if ($rootScope.globals.current_user.token != "" || $rootScope.globals.current_user.token != undefined || $rootScope.globals.current_user.token != null || $cookieStore.get('globals').current_user.token != "" || $cookieStore.get('globals').current_user.token != undefined || $cookieStore.get('globals').current_user.token != null) {
                $rootScope.isAuthenticated = true;
                return true;
            }

        };

        /* is Employer or Employee
         --------------------------------------------------------------------------- */
        AuthService.isType = function (type) {
            return ($rootScope.globals.current_user.type == type);
        };

        /* Create new user
         ---------------------------------------------------------------------------- */
        AuthService.CreateUser = function (user, callback) {

            $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': RESOURCE_URL.SIGN_UP,
                    'JWT_TOKEN': null,
                    'request_method': 'POST',
                    'query_data': false,
                    'post_data': {
                        "Email": user.email,
                        "Password": user.password,
                        "UserName": user.username,
                        "Type": user.type
                    }
                },
                headers: {
                    "Content-type": "application/json"
                }

            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });

        };

        /* Clear credentials
         ---------------------------------------------------------------------------- */
        AuthService.ClearCredentials = function () {

            $http({
                url: RESOURCE_URL.SIGN_OUT,
                method: 'GET',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            }).then(function (success) {
                $rootScope.globals = {
                    current_user: {
                        username: null,
                        token: null,
                        type: null
                    }
                };
                $cookieStore.remove('globals');
                AuthService.isAuthenticated();

            }, function (error) {
                Materialize.toast("Sign out error !", 4000);
            });
        };

        return AuthService;
    }

    /* Employee factory
     ------------------------------------------------------------------------------- */
    angular.module('etAPI')
        .factory('ServiceEmployee', ServiceEmployee);
    ServiceEmployee.$inject = ['$http', '$cookieStore', '$rootScope', 'RESOURCE_URL'];
    function ServiceEmployee($http, $cookieStore, $rootScope, RESOURCE_URL) {
        var ServiceEmployee = {};

        /* Get profile user - Employee
         --------------------------------------------------------------------------- */
        ServiceEmployee.GetProfileEmployee = function (callback) {
            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.MY_PROFILE,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Get profile by other users - Employee
         --------------------------------------------------------------------------- */
        ServiceEmployee.GetProfileSingleEmployee = function (username, callback) {

            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': 'http://easytrades.herokuapp.com/employee/' + username + '/profile',
                    'JWT_TOKEN': null,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Update profile user - Employee
         --------------------------------------------------------------------------- */
        ServiceEmployee.UpdateProfile = function (userObj, callback) {
            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.UPDATE_PROFILE + $rootScope.globals.current_user.username + '/details',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'query_data': false,
                    'post_data': {
                        "FirstName": userObj.FirstName,
                        "LastName": userObj.LastName,
                        "IRDNumber": userObj.IRDNumber,
                        "GSTNumber": userObj.GSTNumber,
                        "Address": {
                            "Street": userObj.Address.Street,
                            "City": userObj.Address.City,
                            "Subreb": "sample",
                            "PostalCode": userObj.Address.PostalCode
                        },
                        "DoBDate": userObj.DoBDate,
                        "DoBMonth": userObj.DoBMonth,
                        "DoBYear": userObj.DoBYear
                    }
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Get profile other user - Employee
         --------------------------------------------------------------------------- */
        ServiceEmployee.GetProfileOthersEmployee = function (username, type, callback) {

            $http({
                url: RESOURCE_URL.EMPLOYEE.MY_PROFILE_OTHERS,
                method: "GET"
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Add location - Employee
         --------------------------------------------------------------------------- */
        ServiceEmployee.AddLocation = function (locations, callback) {

            $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.ADD_LOCATION + $rootScope.globals.current_user.username + '/location',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'query_data': false,
                    'post_data': {
                        'Locations': locations
                    }

                },
                headers: {
                    'Content-Type': "application/json",
                    'Authentication': 'JWT ' + $rootScope.globals.current_user.token
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };


        /* Add location - Employee
         --------------------------------------------------------------------------- */
        ServiceEmployee.AddExperience = function (experience, callback) {

            $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.ADD_EXPERIENCE + $rootScope.globals.current_user.username + '/experience',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'query_data': false,
                    'post_data': experience

                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Add skills - Employee
         ------------------------------------------------------------------------------- */
        ServiceEmployee.AddSkills = function (skills, callback) {

            $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': 'https://easytrades.herokuapp.com/employee/' + $rootScope.globals.current_user.username + '/skills',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'query_data': false,
                    'post_data': {'Skills': skills}
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data)
            });

        };

        /* View jobs - Employee
         ------------------------------------------------------------------------------- */
        ServiceEmployee.ViewMyJobs = function (callback) {

            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.VIEW_MY_JOBS,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                },
                headers: {
                    'Content-Type': "text/json",
                    'Authentication': 'JWT ' + $rootScope.globals.current_user.token
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* View single jobs - Employee
         ------------------------------------------------------------------------------- */

        ServiceEmployee.ViewSingleJob = function (job_id, callback) {
            $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.VIEW_JOB_BY_ID + job_id,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                },
                headers: {
                    'Content-Type': "application/json",
                    'Authentication': 'JWT ' + $rootScope.globals.current_user.token
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Apply for a job - Employee
         --------------------------------------------------------------------------------- */
        ServiceEmployee.ApplyJob = function (job_id, callback) {

            $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': 'employee/job/5926b5b176704030348cde1e/true',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };


        /* Withdraw a job - Employee
         --------------------------------------------------------------------------------- */
        ServiceEmployee.CancelJob = function (job_id, callback) {

            $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.APPLY_JOB + job_id + '/false',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* View all time sheets - Employee
         ------------------------------------------------------------------------------- */
        ServiceEmployee.GetTimeSheets = function (callback) {
            $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.GET_TIME_SHEETS_BY_FILTER,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                },
                headers: {
                    'Content-Type': "application/json"
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* View time sheet - Employee
         ------------------------------------------------------------------------------- */
        ServiceEmployee.GetUserTimeSheets = function (callback) {
            $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.GET_TIME_SHEETS + $rootScope.globals.current_user.username + '/timesheets',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null

                },
                headers: {
                    'Content-Type': "application/json",
                    'Authentication': 'JWT ' + $rootScope.globals.current_user.token
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });

        };

        /* Add time sheet - Employee
         ------------------------------------------------------------------------------- */
        ServiceEmployee.AddTimeSheet = function (timesheet, callback) {

            $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': 'https://easytrades.herokuapp.com/employee/' + $rootScope.globals.current_user.username + '/timesheet',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'query_data': false,
                    'post_data': timesheet
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        return ServiceEmployee;
    }

    /* Employer factory
     ------------------------------------------------------------------------------- */
    angular.module('etAPI')
        .factory('ServiceEmployer', ServiceEmployer);
    ServiceEmployer.$inject = ['$http', '$cookieStore', '$rootScope', 'RESOURCE_URL'];
    function ServiceEmployer($http, $cookieStore, $rootScope, RESOURCE_URL) {

        var ServiceEmployer = {};

        /* Get profile user - Employer
         --------------------------------------------------------------------------- */
        ServiceEmployer.GetProfileEmployer = function (callback) {
            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': RESOURCE_URL.EMPLOYER.MY_PROFILE,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Get applicants profile - Employer
         --------------------------------------------------------------------------- */
        ServiceEmployer.GetApplicantProfile = function (application_id, callback) {

            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': 'https://easytrades.herokuapp.com/employer/user/' + application_id,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });

        };

        /* Update profile  - Employer
         ------------------------------------------------------------------------------- */
        ServiceEmployer.UpdateProfileEmployer = function (user, callback) {
            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': RESOURCE_URL.EMPLOYER.UPDATE_PROFILE + $rootScope.globals.current_user.username + "/update",
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'query_data': false,
                    'post_data': user
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Post a job - Employer
         ------------------------------------------------------------------------------- */
        ServiceEmployer.PostJob = function (job, callback) {
            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': RESOURCE_URL.EMPLOYER.ADD_JOB,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'query_data': false,
                    'post_data': job
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* View jobs  - Employer
         ------------------------------------------------------------------------------- */
        ServiceEmployer.ViewJobs = function (callback) {
            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': RESOURCE_URL.EMPLOYER.VIEW_JOBS,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });

        };

        /* View jobs by state  - Employer
         ------------------------------------------------------------------------------- */
        ServiceEmployer.ViewJobsByState = function (callback) {
            var httpRequest = $http({
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': RESOURCE_URL.EMPLOYER.VIEW_JOBS_HIRING,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
            //http://easytrades.herokuapp.com/employer/job
        };

        /* View single job - Employer
         ------------------------------------------------------------------------------- */
        ServiceEmployer.ViewSingleJob = function (job_id, callback) {
            $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': 'https://easytrades.herokuapp.com/employer/job?id=' + job_id,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* View single job - Employer
         ------------------------------------------------------------------------------- */
        ServiceEmployer.ApproveJob = function (user_id, status, callback) {
            $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': RESOURCE_URL.EMPLOYER.APPROVE_JOB + user_id + "/" + status,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'PUT',
                    'query_data': true,
                    'post_data': null
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        ServiceEmployer.GetTimeSheets = function (callback) {
            $http({
                url: '/curl/index_r.php',
                method: "POST",
                data: {
                    'request_url': RESOURCE_URL.EMPLOYER.GET_TIME_SHEETS,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        return ServiceEmployer;
    }


    /* Search factory
     ------------------------------------------------------------------------------- */
    angular.module('etAPI')
        .factory('Search', Search);
    Search.$inject = ['$http', '$cookieStore', '$rootScope', 'RESOURCE_URL'];
    function Search($http, $cookieStore, $rootScope, RESOURCE_URL) {

        var Search = {};
        var Results = null;

        Search.Search = function (callback) {
            if (Results == null || Results == undefined) {
                var searchRequest = $http({
                    url: '/assets/api/jobs.json',
                    method: 'GET'
                    //data: {
                    //    //'request_url': RESOURCE_URL.EMPLOYEE.VIEW_JOBS,
                    //    'request_url': '/assets/api/jobs.json',
                    //    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    //    'request_method': 'GET',
                    //    'query_data': true,
                    //    'post_data': null
                    //}
                });
                searchRequest.then(function (success) {
                    callback(success.data);
                    Results = success.data;
                }, function (error) {
                    callback(error.data);
                    Results = null;
                });
            } else {
                callback(Results);
            }
        };
        return Search;
    }

    /* Messages factory
     ------------------------------------------------------------------------------- */
    angular.module('etAPI')
        .factory('MessageService', MessageService);
    function MessageService() {

        var MessageService = {};

        MessageService.Error = function (message, callback) {
            Materialize.toast(message, 4000, 'error', callback);
        };

        MessageService.Success = function (message, callback) {
            Materialize.toast(message, 4000, 'success', callback);
        };

        MessageService.Info = function (message, callback) {
            Materialize.toast(message, 4000, 'info', callback);
        };

        MessageService.Warning = function (message, callback) {
            Materialize.toast(message, 4000, 'warning', callback);
        };


        return MessageService;
    }

})(jQuery, angular);