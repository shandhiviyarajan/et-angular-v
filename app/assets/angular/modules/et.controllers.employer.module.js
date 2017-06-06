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
    RegisterEmployerController.$inject = ['$scope', '$state', 'AuthService', 'MessageService'];
    function RegisterEmployerController($scope, $state, AuthService, MessageService) {

        var Register = this;

        /* User register employer
         ---------------------------------------------------------------------------------------- */
        Register.register = function () {
            Register.user = {
                "Email": Register.email,
                "UserName": Register.username,
                "Password": Register.password,
                "Type": "employer"
            };
            AuthService.CreateUser(Register.user, function (response) {
                console.log(response);
                if (response.status) {
                    MessageService.Success("Employer user created successfully!");
                    $state.go("signInEmployer");
                } else {
                    MessageService.Error("Error creating employer user!");
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

        console.log($state);

        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams, options) {

                console.log(fromState);

            });


        if (AuthService.isAuthenticated()) {
            $state.go("myBusinessHomeEmployer");
        }

        /* User login employer
         ---------------------------------------------------------------------------------------- */
        Login.login = function () {
            AuthService.Login(Login.email, Login.password, function (response) {
                console.log(response);

                if (response.status) {


                    MessageService.Success("User logged in successful!. Please wait redirecting...");


                    var LoggedUser = {
                        username: response.data.username,
                        token: response.data.token,
                        type: Login.type
                    };
                    //Set credentials//
                    AuthService.SetCredentials(LoggedUser);
                    AuthService.isAuthenticated();
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
    PostJobController.$inject = ['$scope', '$rootScope', '$state', 'GetSkills', 'GetLocations', '$http', '$timeout', '$stateParams', 'AuthService', 'ServiceEmployer', 'MessageService', 'AppService'];
    function PostJobController($scope, $rootScope, $state, GetSkills, GetLocations, $http, $timeout, $stateParams, AuthService, ServiceEmployer, MessageService, AppService) {

        console.log("Post job controller");


        var Job = this;
        Job.new = {
            'hire':'Automatic'
        };

        Job.skills = [];
        Job.locations = [];

        Job.skills = GetSkills.data.skills;
        Job.locations = GetLocations.data.Locations;



        /* Post Job - employer
         ---------------------------------------------------------------------------------------- */

        Job.postJob = function () {
            if ($state.$current.name == 'searchJobs') {

                if (AuthService.isAuthenticated()) {
                    if ($rootScope.globals.current_user.type == 'employer') {
                        Job.prepareJob();
                        Job.job();

                    } else {
                        MessageService.Error('Please sign in as a employer !');
                        $state.go('signInEmployer');
                    }
                } else {
                    MessageService.Error('Please sign in as a employer !');
                    $state.go('signInEmployer');
                }
            } else {
                Job.prepareJob();
                Job.job();
            }
        };


        Job.prepareJob = function () {
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
        };

        localStorage.setItem("new_job", angular.toString(Job.new));
        console.log(Job.new);
        Job.job = function () {
            ServiceEmployer.PostJob(Job.new, function (response) {
                console.log(response);

                if (response.status) {
                    MessageService.Success("Job posted successfully !");
                    Job.new = {};
                    $state.go("myJobsEmployer");

                } else {
                    MessageService.Error("Error on posting !");
                    MessageService.Error(response.message);
                }

            });
        }
    }

    /**
     * Jobs Employer Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module("etControllersEmployer")
        .controller('EmployerJobsController', EmployerJobsController);
    EmployerJobsController.$inject = ['$scope', '$rootScope', '$state', '$http', '$stateParams', 'AuthService', 'ServiceEmployer', 'MessageService'];
    function EmployerJobsController($scope, $rootScope, $state, $http, $stateParams, AuthService, ServiceEmployer, MessageService) {
        console.log("Employer Jobs Controller");
        var Employer = this;
        Employer.jobs = null;

        /* View jobs
         ---------------------------------------------------------------------------------------- */
        if (AuthService.isAuthenticated()) {
            ServiceEmployer.ViewJobsByState(function (response) {
                if (response.status) {
                    MessageService.Success("Jobs information loaded !");
                    Employer.jobs = response.data;
                    console.log(response);
                } else {
                    MessageService.Error(response.message);
                    $state.go("myBusinessHomeEmployer");
                }
            });
        }


        // SendInvitations
    }


    /**
     * Employer Single Job Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployer')
        .controller('EmployerViewJobsController', EmployerViewJobsController);
    EmployerViewJobsController.$inject = ['$scope', '$rootScope', '$state', '$http', '$stateParams', 'AuthService', 'ServiceEmployer', 'MessageService'];
    function EmployerViewJobsController($scope, $rootScope, $state, $http, $stateParams, AuthService, ServiceEmployer, MessageService) {

        $scope.JobID = $stateParams.JobID;
        $scope.Job = {};
        $scope.selected_employees = [];


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

        /* send invitations
         --------------------------------------------------------------------------------------- */

        $scope.sendInvitations = function (user_id) {


            $http({
                url: '/curl/api.php?function=send_invitations',
                method: 'POST',
                headers: {
                    'job_id': $scope.JobID,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'data': angular.toJson({
                        "Employees": [user_id]
                    })
                }
            }).then(function (response) {
                console.log(response);
                if (response.data.status) {
                    MessageService.Success('Job invitations sent successfully !');
                } else {
                    MessageService.Error('Invitations failed !');
                    MessageService.Error(response.data.message);
                }
            }, function (response) {
                console.log(response);
            });


        };
    }


    /**
     * Employer Edit job
     */

    angular.module('etControllersEmployer')
        .controller('EmployerEditJobsController', EmployerEditJobsController);
    EmployerEditJobsController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployee', 'AppService', 'MessageService'];
    function EmployerEditJobsController($scope, $state, $stateParams, AuthService, ServiceEmployer, AppService, MessageService) {

        var Edit = this;
        Edit.Job = {};
        Edit.skills = [];
        Edit.locations = [];

        AppService.GetSkillsLocations(function (skills) {
            Edit.skills = skills.data.Skills;
        }, function (locations) {
            Edit.locations = locations.data.Locations;
        });

        ServiceEmployer.ViewSingleJob($stateParams.JobID, function (response) {
            Edit.Job = response.data[0];
            console.log(response);
        });

        Edit.edit = function () {

            MessageService.Error("API URL not specified");

        }
    }

    /**
     * Employer Edit job
     */

    angular.module('etControllersEmployer')
        .controller('EmployerTimeSheetController', EmployerTimeSheetController);
    EmployerTimeSheetController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'AuthService', 'ServiceEmployer', 'MessageService'];
    function EmployerTimeSheetController($scope, $rootScope, $state, $stateParams, $http, AuthService, ServiceEmployer, MessageService) {

        var Timesheet = this;
        Timesheet.weekly_timesheets = [];
        Timesheet.user_timesheets = [];
        Timesheet.created_by = $stateParams.CreatedBy;
        Timesheet.contract_id = $stateParams.ContractID;
        Timesheet.timesheet_id = "";
        Timesheet.single_timesheet = [];
        Timesheet.work_hours = 0;
        Timesheet.contested_hours = 0;
        Timesheet.approved_hours;
        Timesheet.reason = "";

        Timesheet.addContest = function (wh, timesheet_id) {
            Timesheet.timesheet_id = timesheet_id;
            Timesheet.work_hours = wh;

        };
        Timesheet.contestHours = function () {
            $http({
                url: '/curl/api.php?function=contest_time_sheet',
                method: 'POST',
                headers: {
                    'contract_id': $stateParams.ContractID,
                    'time_sheet_id': Timesheet.timesheet_id,
                    'request_url': 'https://easytrades.herokuapp.com/employer/timesheet/' + $stateParams.ContractID + '/' + Timesheet.timesheet_id,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'data': angular.toJson({
                        "ContestHours": Timesheet.contested_hours,
                        "Reason": Timesheet.reason
                    })
                }
            }).then(function (response) {
                MessageService.Success("Contested successfully !");
                Timesheet.single_timesheet.TimeSheets = response.data.data.TimeSheets;
            }, function (response) {
                console.log(response);
            });

        };
        Timesheet.approveTimesheet = function (timesheet_id) {
            Timesheet.timesheet_id = timesheet_id;
            console.log(timesheet_id);

            $http({
                url: '/curl/api.php?function=approve_time_sheet',
                method: 'POST',

                headers: {
                    'contract_id': $stateParams.ContractID,
                    'time_sheet_id': Timesheet.timesheet_id,
                    'request_url': 'https://easytrades.herokuapp.com/employer/timesheet/' + $stateParams.ContractID + '/' + Timesheet.timesheet_id,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token
                }
            }).then(function (response) {
                MessageService.Success("Approved successfully !");
                Timesheet.single_timesheet.TimeSheets = response.data.data.TimeSheets;
            }, function (response) {
                console.log(response);
            });
        };


        if ($stateParams.CreatedBy != null) {
            var httpRequest = $http({
                url: '/curl/api.php?function=created_by',
                method: 'POST',
                data: {
                    'created_by': $stateParams.CreatedBy,
                    'request_url': 'https://easytrades.herokuapp.com/employer/timesheets?CreatedBy=' + $stateParams.CreatedBy,
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token
                }
            });
            httpRequest.then(function (success) {
                console.log(success);
            }, function (error) {
                console.log(error);
            });

        } else {
            ServiceEmployer.GetTimeSheets(function (response) {
                if (response.status) {
                    MessageService.Success("Time sheets Loaded!");
                    Timesheet.timesheets = response.data;

                    angular.forEach(Timesheet.timesheets, function (V, K) {
                        Timesheet.weekly_timesheets.push(V);
                    });


                    if ($stateParams.ContractID != null) {
                        angular.forEach(Timesheet.weekly_timesheets, function (W, k) {
                            W.Applicants.forEach(function (A, K) {
                                A.WeeklyTimesheets.forEach(function (T, K) {
                                    if (T.ContractID == $stateParams.ContractID) {
                                        Timesheet.single_timesheet = T;

                                    }
                                });
                            });
                        });
                    }


                } else {
                    MessageService.Error("No time sheets found !");
                    $state.go("myBusinessHomeEmployer");
                    console.log(response);
                }
            });
        }
    }

    //employer/timesheets


    //Employer Billing

    angular.module("etControllersEmployer")
        .controller("EmployerBillingController", EmployerBillingController);
    EmployerBillingController.$inject = ['$scope', '$http', 'MessageService'];
    function EmployerBillingController($scope, $http, MessageService) {

        var Billing = this;
        Billing.stripe_token = null;
        Billing.card = {
            'number': 4242424242424242,
            'exp_month': 12,
            'exp_year': 2018,
            'cvc': 123
        };
        Billing.saveCard = function () {
            MessageService.Success("Please wait... adding your card");
            //Get stripe token
            $http({
                url: '/curl/api.php?function=stripe_token',
                method: 'POST',
                headers: {
                    'number': Billing.card.number,
                    'exp_month': Billing.card.exp_month,
                    'exp_year': Billing.card.exp_year,
                    'cvc': Billing.card.cvc
                }
            }).then(function (response) {


                Billing.stripe_token = response.data.id;
                console.log(response.data.id);

                //Send stripe token
                if (Billing.stripe_token != null) {
                    $http({
                        url: '/curl/api.php?add_card',
                        method: 'POST',
                        headers: {
                            'data': angular.toJson({
                                "stripeToken": Billing.stripe_token
                            })
                        }
                    }).then(function (response) {
                        MessageService.Success("Your card added successfully !");
                        console.log(response);
                    }, function (response) {
                        console.log(response);

                    });
                } else {

                    MessageService.Error("Error adding your card !");

                }


            }, function (error) {
                console.log(e);
            });
        }
    }


})(jQuery, angular);
