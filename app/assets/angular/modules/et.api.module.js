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
    AppService.$inject = ['$rootScope', '$http', '$timeout', '$cookieStore','RESOURCE_URL'];
    function AppService($rootScope, $http, $timeout, $cookieStore,RESOURCE_URL) {

        var AppService = {};

        AppService.Collections = [];
        AppService.Collections.Search = [];
        AppService.Skills = [];
        AppService.Locations = [];

        /* Get all locations & skills
         --------------------------------------------------------------------------- */
        AppService.GetSkillsLocations = function (skills, locations) {

            $http({
                url: RESOURCE_URL.BASE_URI + '/skills',
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
                url: RESOURCE_URL.BASE_URI + '/locations/cities',
                method: 'GET'
            }).then(function (response) {
                if (response.data.status) {
                    locations(response.data);

                } else {
                   // console.log("Empty Locations");
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
        AuthService.Login = function (email, password, type, callback) {

            $http({
                url: RESOURCE_URL.BASE_URI + '/login',
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: "Email=" + email + "&Password=" + password + "&Type="+type

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
                url: RESOURCE_URL.BASE_URI+'/signup',
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: "Email="+user.Email+"&Password="+user.Password+"&UserName="+user.UserName+"&Type="+user.Type
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
                url: RESOURCE_URL.BASE_URI + '/logout',
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
                url: RESOURCE_URL.BASE_URI + '/employee/my-profile',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
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
                url: RESOURCE_URL.BASE_URI + '/employee/' + username + '/profile',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
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
                url: RESOURCE_URL.BASE_URI + '/employee/' + $rootScope.globals.current_user.username + '/details',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                },
                data: {
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
                url: RESOURCE_URL.BASE_URI + '/employee/' + username + '/profile',
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
                url: RESOURCE_URL.BASE_URI + '/employee/' + $rootScope.globals.current_user.username + '/location',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                },
                data: {
                    'Locations': locations
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
                url: RESOURCE_URL.BASE_URI + '/employee/' + $rootScope.globals.current_user.username + '/experience',
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                },
                data: angular.toJson(experience)
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
                url: RESOURCE_URL.BASE_URI + '/employee/' + $rootScope.globals.current_user.username + '/skills',
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                },
                data: {"Skills": skills}
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
                method: 'GET',
                url: RESOURCE_URL.BASE_URI+'/employee/myjobs',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'JWT '+ $rootScope.globals.current_user.token,
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
                url: RESOURCE_URL.BASE_URI + '/employee/jobs?id=' + job_id,
                method: 'GET',
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
                url: RESOURCE_URL.BASE_URI + '/employee/job/' + job_id + '/true',
                method: 'GET',
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


        /* Withdraw a job - Employee
         --------------------------------------------------------------------------------- */
        ServiceEmployee.CancelJob = function (job_id, callback) {

            $http({
                url: RESOURCE_URL.BASE_URI + '/employee/job/' + job_id + '/false',
                method: 'GET',
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

        /* View all time sheets - Employee
         ------------------------------------------------------------------------------- */
        ServiceEmployee.GetTimeSheets = function (callback) {
            $http({
                url: RESOURCE_URL.BASE_URI + '/timesheets',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
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
                url: RESOURCE_URL.BASE_URI + '/employee/' + $rootScope.globals.current_user.username + '/timesheets',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
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
                url: RESOURCE_URL.BASE_URI+'/employee/'+$rootScope.globals.current_user.username+'/timesheet',
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                },
                data: angular.toJson(timesheet)
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
                url: RESOURCE_URL.BASE_URI + '/employer/my-profile',
                method: 'GET',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
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
                url: RESOURCE_URL.BASE_URI + '/employer/user/' + application_id,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': 'JWT ' + $rootScope.globals.current_user.token
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
                url: RESOURCE_URL.BASE_URI + '/employer/'+$rootScope.globals.current_user.username+'/update',
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                },
                data: angular.toJson(user)
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
                url: RESOURCE_URL.BASE_URI +'/employer/job',
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'JWT ' + $rootScope.globals.current_user.token,
                },
                data: angular.toJson(job)
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
                url: RESOURCE_URL.BASE_URI +'/employer/job',
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'JWT ' + $rootScope.globals.current_user.token,
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
                url: RESOURCE_URL.BASE_URI +'/employer/job',
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'JWT ' + $rootScope.globals.current_user.token,
                }
            });

            httpRequest.then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* View single job - Employer
         ------------------------------------------------------------------------------- */
        ServiceEmployer.ViewSingleJob = function (job_id, callback) {
            $http({
                url: RESOURCE_URL.BASE_URI +'/employer/job?id='+job_id,
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'JWT ' + $rootScope.globals.current_user.token,
                }
            }).then(function (success) {
                callback(success.data);
            }, function (error) {
                callback(error.data);
            });
        };

        /* View approve job - Employer
         ------------------------------------------------------------------------------- */
        ServiceEmployer.ApproveJob = function (user_id, status, callback) {
            $http({
                url: RESOURCE_URL.BASE_URI + '/employer/job/' + user_id + "/" + status,
                method: 'PUT',
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


        ServiceEmployer.GetTimeSheets = function (callback) {
            $http({
                url: RESOURCE_URL.BASE_URI + '/employer/timesheets',
                method: 'GET',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
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