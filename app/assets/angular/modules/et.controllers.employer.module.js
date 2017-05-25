/**
 * @project - Easy trades
 * @date - April 28 2017
 * @type - Javascript / JQuery/ Angular
 * @file - Application controllers employer
 * @author - Shan Dhiviyajan <prashasoft@gmail.com>
 */


/*
 Employer Controllers
 ----------------------------------------------------------------------------------------------- */

(function ($, angular) {
    'use strict';

    //Angular strict DI Mode enabled


    //Employer module
    angular.module('etControllersEmployer', ['etAPI', 'ngCookies']);

    angular.module('etControllersEmployer')
        .controller('RegisterEmployerController', RegisterEmployerController);
    RegisterEmployerController.$inject = ['$scope', '$state', 'AuthService'];
    function RegisterEmployerController($scope, $state, AuthService) {

        var Register = this;

        /* User register employer
         ---------------------------------------------------------------------------------------- */
        Register.register = function () {
            Register.user = {
                username: Register.username,
                email: Register.email,
                type: "employer",
                password: Register.password
            };
            AuthService.CreateUser(Register.user, function (response) {
                console.log(response);
                if (response.data.error) {
                    Materialize.toast(response.data.error.message, 4000);
                } else {
                    Materialize.toast("Employer user created successfully!", 4000);
                }
            });
        }
    }

    /**
     * Employee Login Controller
     * ------------------------------------------------------------------------------------------ */

    angular.module('etControllersEmployer')
        .controller('EmployerLoginController', EmployerLoginController);
    EmployerLoginController.$inject = ['$scope', '$rootScope', '$transitions', '$state', 'AuthService', 'MessageService'];
    function EmployerLoginController($scope, $rootScope, $transitions, $state, AuthService, MessageService) {
        console.log("Employer login controller");
        /* User login
         ---------------------------------------------------------------------------------------- */
        var Login = this;
        Login.email = 'nuo.samee@gmail.com';
        Login.password = 'test123';
        Login.type = 'employer';


        /* User login employer
         ---------------------------------------------------------------------------------------- */
        Login.login = function () {
            AuthService.Login(Login.email, Login.password, function (response) {
                console.log(response);

                if (response.message == "ok") {

                    //Display message
                    MessageService.Success("User logged in successful!. Please wait redirecting...");

                    //Create logged user information
                    var LoggedUser = {
                        username: response.username,
                        token: response.token,
                        type: Login.type
                    };
                    //Set credentials//
                    AuthService.SetCredentials(LoggedUser);
                    $state.go("myBusinessHomeEmployer");

                } else {
                    MessageService.Error("User not found!");
                    $state.go("signInEmployer");
                }


            });
        }
    }


    /**
     * My Profile Employer Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployer')
        .controller('MyProfileEmployerController', MyProfileEmployerController);
    MyProfileEmployerController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployer', 'MessageService'];

    function MyProfileEmployerController($scope, $state, $stateParams, AuthService, ServiceEmployer, MessageService) {
        console.log("My profile employer controller");
        var Profile = this;
        Profile.user = {};
        Profile.ApplicantID = $stateParams.ApplicantID;

        //Redirect non authenticated user to home / sign in
        if (!AuthService.isAuthenticated()) {
            $state.go("home");
        }

        /* Get profile user - employer
         ---------------------------------------------------------------------------------------- */
        Profile.getProfile = function () {

                if (Profile.ApplicantID == null) {
                    ServiceEmployer.GetProfileEmployer(function (user) {

                        if (user.status) {
                            MessageService.Success("User information loaded !");
                            Profile.user = user.data;
                            console.log(user);
                        } else {

                            MessageService.Error("User not found!");
                            $state.go("signInEmployer");
                        }
                    });
                } else {
                    ServiceEmployer.GetApplicantProfile(Profile.ApplicantID, function (response) {
                        if (response.status && response.data.length > 0) {
                            MessageService.Success("User information loaded !");
                            Profile.user = response.data[0];
                            console.log(response);
                        } else {
                            MessageService.Error("User not found!");
                        }
                    });
                }

        };

        /* Update profile user - employer
         ---------------------------------------------------------------------------------------- */
        Profile.update = function () {
            //delete _id / id / __v;
            delete Profile.user._id;
            delete Profile.user.id;
            delete Profile.user.__v;

            console.log(Profile.user);

            ServiceEmployer.UpdateProfileEmployer(Profile.user, function (response) {

                if (response.status) {
                    Profile.user = response.data;
                    MessageService.Success(Profile.user.FirstName + "'s profile updated !", 4000);
                    console.log(response);
                } else {
                    MessageService.Error(response.message);
                    console.log(response);
                }
            });
        }
    }

    /**
     * Post job Employer Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module("etControllersEmployer")
        .controller('PostJobController', PostJobController);
    PostJobController.$inject = ['$scope', '$rootScope', '$state', '$http', '$timeout', '$stateParams', 'AuthService', 'ServiceEmployer', 'MessageService'];
    function PostJobController($scope, $rootScope, $state, $http, $timeout, $stateParams, AuthService, ServiceEmployer, MessageService) {

        console.log("Post job controller");

        var Job = this;
        Job.new = {}

        Job.skills = [];
        Job.locations = [];


        /* Get Profession
         ---------------------------------------------------------------------------------------- */
        Job.getProfessions = function () {

//Get skills
            $http({
                url: 'https://easytrades.herokuapp.com/skills',
                method: 'GET'
            }).then(function (response) {
                if (response.data.status) {
                    Job.skills = response.data.data.Skills;

                    $timeout(function () {
                        $('select').material_select();
                    }, 500);
                } else {
                    Job.skills = [];
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
                    Job.locations = response.data.data.Locations;

                } else {
                    Job.skills = [];
                    console.log("Empty Skills");
                }
            }, function (error) {

            });


        };

        Job.getProfessions();




        /* Post Job - employer
         ---------------------------------------------------------------------------------------- */
        Job.postJob = function () {
            if (Job.new.StartingDate != "" && Job.new.StartingDate != undefined && Job.new.StartingDate != null) {
                Job.new.StartingDate = Job.new.StartingDate.split("/").reverse().join("-");
            } else {
                Job.new.StartingDate = {};
            }

            if (Job.new.EndingDate != "" && Job.new.EndingDate != undefined && Job.new.EndingDate != null) {
                Job.new.EndingDate = Job.new.EndingDate.split("/").reverse().join("-");
            } else {
                Job.new.EndingDate = {};
            }

            ServiceEmployer.PostJob(Job.new, function (response) {

                if (response.status) {
                    MessageService.Success("Job posted successfully !");
                    Job.new = {};
                } else {
                    MessageService.Error("Error on posting !");
                }

            });
        }
    }

    /**
     * Jobs Employer Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module("etControllersEmployer")
        .controller('EmployerJobsController', EmployerJobsController);
    EmployerJobsController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployer', 'MessageService'];
    function EmployerJobsController($scope, $state, $stateParams, AuthService, ServiceEmployer, MessageService) {
        console.log("Employer Jobs Controller");
        var Employee = this;
        Employee.jobs = null;

        /* View jobs
         ---------------------------------------------------------------------------------------- */
        if (AuthService.isAuthenticated()) {
            ServiceEmployer.ViewJobsByState(function (response) {
                if (response.status) {
                    MessageService.Success("Jobs information loaded !");
                    Employee.jobs = response.data;
                    console.log(response);
                } else {
                    MessageService.Error(response.message);
                    $state.go("myBusinessHomeEmployer");
                }
            });
        }
    }


    /**
     * Employer Single Job Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployer')
        .controller('EmployerViewJobsController', EmployerViewJobsController);
    EmployerViewJobsController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployer', 'MessageService'];
    function EmployerViewJobsController($scope, $state, $stateParams, AuthService, ServiceEmployer, MessageService) {

        $scope.JobID = $stateParams.JobID;
        $scope.Job = {};

        /* View single job
         --------------------------------------------------------------------------------------- */
        if ($scope.JobID) {
            ServiceEmployer.ViewSingleJob($scope.JobID, function (response) {

                console.log(response);

                if (response.status) {
                    MessageService.Success("Job information loaded!");
                    $scope.Job = response.data[0];
                    console.log(response);
                } else {
                    MessageService.Error(response.message);
                    console.log(response);
                }
            });
        }

        /* Approve a job applicant
         --------------------------------------------------------------------------------------- */
        $scope.approve = function (user_id, status) {
            ServiceEmployer.ApproveJob(user_id, status, function (response) {
                alert(user_id);
            });
        }
    }


    /**
     * Employer Edit job
     */

    angular.module('etControllersEmployer')
        .controller('EmployerEditJobsController', EmployerEditJobsController);
    EmployerEditJobsController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployee'];
    function EmployerEditJobsController($scope, $state, $stateParams, AuthService, ServiceEmployer) {
        $scope.JobID = $stateParams.JobID;
        $scope.edit_job = {};




        if ($scope.JobID) {
            ServiceEmployer.ViewSingleJob($scope.JobID, function (response) {
                $scope.edit_job = response.data[0];
                console.log(response);
            });
        }

        $scope.editJob = function () {

        }
    }

    /**
     * Employer Edit job
     */

    angular.module('etControllersEmployer')
        .controller('EmployerTimeSheetController', EmployerTimeSheetController);
    EmployerTimeSheetController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployer', 'MessageService'];
    function EmployerTimeSheetController($scope, $state, $stateParams, AuthService, ServiceEmployer, MessageService) {

        var Timesheet = this;
        Timesheet.weekly_timesheets = [];

        ServiceEmployer.GetTimeSheets(function (response) {
            if (response.status) {
                MessageService.Success("Timesheets Loaded!");
                Timesheet.timesheets = response.data;


                angular.forEach(Timesheet.timesheets, function (V, K) {
                    Timesheet.weekly_timesheets.push(V.Applicants[0].WeeklyTimesheets[0]);
                });

                console.log(Timesheet.weekly_timesheets[0]);

            } else {
                MessageService.Error("No time sheets found !");
                $state.go("myBusinessHomeEmployer");
                console.log(response);
            }
        });
    }

    //employer/timesheets


})(jQuery, angular);
