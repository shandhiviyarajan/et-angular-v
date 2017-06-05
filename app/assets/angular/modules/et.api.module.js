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

    //Angular strict DI Mode enabled 'angular-loading-bar',

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
        //Set fucking angular default headers//
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
    AppService.$inject = ['$rootScope', '$http', '$timeout', '$cookieStore'];
    function AppService($rootScope, $http, $timeout, $cookieStore) {

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
                    'Content-type': 'application/x-www-form-urlencoded'
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
                url: '/curl/api.php?function=sign_up',
                method: 'POST',
                headers: {
                    'data': angular.toJson({
                        "Email": user.Email,
                        "Password": user.Password,
                        "UserName": user.UserName,
                        "Type": user.Type
                    })

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
                    "Content-type": 'application/x-www-form-urlencoded'
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
                url: '/curl/api.php?function=getProfile',
                method: 'POST',
                headers: {
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'username': $rootScope.globals.current_user.username
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });

        };

        /* Get profile by other users - Employee
         --------------------------------------------------------------------------- */
        ServiceEmployee.GetProfileSingleEmployee = function (username, callback) {

            var httpRequest = $http({
                url: '/curl/api.php?function=api_call_employee',
                method: 'POST',
                headers: {
                    'request_url': 'http://easytrades.herokuapp.com/employee/' + username + '/profile',
                    'request_method': 'GET',
                    'JWT_TOKEN': null,
                    'data': null
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
                url: '/curl/api.php?function=updateProfile',
                method: 'POST',
                headers: {
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'username': $rootScope.globals.current_user.username,
                    'request_url': 'https://easytrades.herokuapp.com/employee/' + $rootScope.globals.current_user.username,
                    'request_method': 'POST',

                    'data': angular.toJson({
                        'FirstName': userObj.FirstName,
                        'LastName': userObj.LastName,
                        'IRDNumber': userObj.IRDNumber,
                        'GSTNumber': userObj.GSTNumber,
                        'Address': {
                            'Street': userObj.Address.Street,
                            'City': userObj.Address.City,
                            'PostalCode': userObj.Address.PostalCode
                        },
                        'DoBDate': userObj.DoBDate,
                        'DoBMonth': userObj.DoBMonth,
                        'DoBYear': userObj.DoBYear
                    })
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
                method: 'GET'
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Add location - Employee
         --------------------------------------------------------------------------- */
        ServiceEmployee.AddLocation = function (locations, callback) {

            var httpRequest = $http({
                url: '/curl/api.php?function=updateLocations',
                method: 'POST',
                headers: {
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_url': 'https://easytrades.herokuapp.com/employee/' + $rootScope.globals.current_user.username + '/location',
                    'request_method': 'POST',
                    'data': angular.toJson({
                        'Locations': locations
                    })
                }
            });
            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });

        };


        /* Add location - Employee
         --------------------------------------------------------------------------- */
        ServiceEmployee.AddExperience = function (experience, callback) {

            $http({
                url: '/curl/api.php?function=updateExperience',
                method: 'POST',
                headers: {
                    'request_url': 'https://easytrades.herokuapp.com/employee/' + $rootScope.globals.current_user.username + '/experience',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'query_data': false,
                    'data': angular.toJson(experience)

                }
            }).then(function (success) {
                console.log(success);
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* Add skills - Employee
         ------------------------------------------------------------------------------- */
        ServiceEmployee.AddSkills = function (skills, callback) {

            $http({
                url: '/curl/api.php?function=updateSkills',
                method: 'POST',
                headers: {
                    'request_url': 'https://easytrades.herokuapp.com/employee/' + $rootScope.globals.current_user.username + '/skills',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'query_data': false,
                    'data': angular.toJson({"Skills": skills})
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
                method: 'POST',
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
                method: 'POST',
                data: {
                    'request_url': RESOURCE_URL.EMPLOYEE.VIEW_JOB_BY_ID + job_id,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                },
                headers: {
                    'Content-Type': 'application/json',
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
                    'request_url': 'https://easytrades.herokuapp.com/employee/job/' + job_id + '/true',
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
                    'request_url': 'https://easytrades.herokuapp.com/employee/job/' + job_id + '/false',
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
                method: 'POST',
                data: {
                    'request_url': 'https://easytrades.herokuapp.com/employee/timesheets',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                },
                headers: {
                    'Content-Type': 'application/json'
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
                method: 'POST',
                data: {
                    'request_url': 'https://easytrades.herokuapp.com/employee/' + $rootScope.globals.current_user.username + '/timesheets',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null

                },
                headers: {
                    'Content-Type': 'application/json'
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
                url: '/curl/api.php?function=add_time_sheet',
                method: 'POST',
                headers: {
                    'username': $rootScope.globals.current_user.username,
                    'request_url': 'https://easytrades.herokuapp.com/employee/' + $rootScope.globals.current_user.username + '/timesheet',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'POST',
                    'data': angular.toJson(timesheet)
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
                url: '/curl/api.php?function=update_profile_employer',
                method: 'POST',
                headers: {
                    'username': $rootScope.globals.current_user.username,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'post_data': angular.toJson(user)
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
                url: '/curl/api.php?function=post_job_employer',
                method: 'POST',
                headers: {
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'data': angular.toJson(job)
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
                url: '/curl/api.php?function=view_all_jobs_employer',
                method: 'POST',
                headers: {
                    'request_url': 'https://easytrades.herokuapp.com/employer/jobs',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET'
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
                url: '/curl/api.php?function=view_all_jobs_employer',
                method: 'POST',
                headers: {
                    'request_url': 'https://easytrades.herokuapp.com/employer/jobs',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET'
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
                url: '/curl/api.php?function=view_single_job',
                method: 'POST',
                headers: {
                    'request_url': 'https://easytrades.herokuapp.com/employer/job?id=' + job_id,
                    'job_id': job_id,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET'
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
                method: 'POST',
                data: {
                    'request_url': 'https://easytrades.herokuapp.com/employer/job/' + user_id + "/" + status,
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
                method: 'POST',
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