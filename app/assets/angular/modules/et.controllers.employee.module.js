/**
 * @project - Easy trades
 * @date - April 28 2017
 * @type - Javascript / JQuery/ Angular
 * @file - Application controllers employee
 * @author - Shan Dhiviyarajan <prashasoft@gmail.com>
 */

/*
 Employee Controllers
 ----------------------------------------------------------------------------------------------- */

(function ($, angular) {

    'use strict';
    //Angular strict DI Mode enabled


    //Employee module
    angular.module('etControllersEmployee', ['etConstant', 'etAPI', 'ngCookies']);

    /**
     * Main Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('ngMainController', ngMainController);
    ngMainController.$inject = ['$scope', '$http', '$rootScope', 'AuthService', '$cookieStore', '$state','RESOURCE_URL'];

    function ngMainController($scope, $http, $rootScope, AuthService, $cookieStore, $state,RESOURCE_URL) {
        var Main = this;
                                                                 console.log($cookieStore);
        $rootScope.$watch('isAuthenticated', function (nv, ov) {

        }, true);

        /* User Logout
         --------------------------------------------------------------------------------- */
        Main.signOut = function () {
            AuthService.ClearCredentials();
            $state.go('home');
        };

        /* User Logout
         -------------------------------------------------------------------------------- */
        Main.goToProfile = function () {
            if ($rootScope.globals.current_user.type == "employee") {
                $state.go("myBusinessHome");
            }

            if ($rootScope.globals.current_user.type == "employer") {
                $state.go("myBusinessHomeEmployer");
            }
        };

    }


    /**
     * Home Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller("HomeController", HomeController);
    HomeController.$inject = ['GetSkills', 'GetLocations', '$scope', '$rootScope', '$state', 'AuthService', 'AppService'];
    function HomeController(GetSkills, GetLocations, $scope, $rootScope, $state, AuthService, AppService) {
        $scope.search_input = "";
        $scope.search_array = [];

        $scope.skills = [];
        $scope.locations = [];

        $scope.selected_skill = null;
        $scope.selected_location = null;

        $scope.valid = true;


        $scope.$watch('selected_skill', function (nv, ov) {
            $scope.selected_skill = (nv == "" || nv == " ") ? null : nv;
            $scope.checkValid();

        });

        $scope.checkValid = function () {
            $scope.valid = !($scope.selected_skill != null);
        };


        /* Get Skills and Location
         ------------------------------------------------------------------------------------------ */

        $scope.skills = GetSkills.data.Skills;

        // console.log(GetSkills.data);
        // $scope.locations = GetLocations.data.Locations;


    }

    /**
     * My Business Home Controller
     */
    angular.module('etControllersEmployee')
        .controller('MyBusinessHomeController', MyBusinessHomeController);
    MyBusinessHomeController.$inject = ['$scope', '$rootScope', 'AuthService', '$cookieStore', '$state'];
    function MyBusinessHomeController($scope, $rootScope, AuthService, $cookieStore, $state) {

        //Redirect to profile page
        if (!AuthService.isAuthenticated()) {
            $state.go("home");
        }
        else {
            //Check and redirect to employee or employer
            AuthService.isType('employee') ? $state.go("myBusinessHome") : $state.go("myBusinessHomeEmployer");
        }

    }

    /**
     * Common controllers
     * ------------------------------------------------------------------------------------------ */

    angular.module('etControllersEmployee')
        .controller('CommonController', CommonController);
    CommonController.$inject = ['$scope', '$rootScope', 'AuthService', '$state', 'MessageService'];
    function CommonController($scope, $rootScope, AuthService, $state, MessageService) {

        /** Redirect non authenticated user to home / sign in
         ------------------------------------------------------------------------------------------------------- */
        if (AuthService.isAuthenticated()) {
            $state.go("myBusinessHome");
        }
    }

    /**
     * Employee Login Controller
     * ------------------------------------------------------------------------------------------ */

    angular.module('etControllersEmployee')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$scope', '$rootScope', 'AuthService', '$state', 'MessageService'];
    function LoginController($scope, $rootScope, AuthService, $state, MessageService) {
        // console.log("Employee login controller");
        /* User Login
         ---------------------------------------------------------------------------------------- */
        var Login = this;
        Login.email;
        Login.password;
        Login.type = 'employee';


        if (AuthService.isAuthenticated()) {
            $state.go("myBusinessHome");
        }

        /* Employee login function
         ------------------------------------------------------------------------------------------- */
        Login.login = function () {
            AuthService.Login(Login.email, Login.password, Login.type, function (response) {
                if (response.status) {
                    MessageService.Success("Login Successful !", 4000);
                    var LoggedUser = {
                        username: response.data.username,
                        token: response.data.token,
                        type: Login.type
                    };

                    //Set credentials//
                    AuthService.SetCredentials(LoggedUser);
                    //Redirect to my profile//
                    $state.go("myBusinessHome");
                } else {
                    MessageService.Error("Login failed please try again !");
                }

            });
        };

        /* Login on key press "enter"
         ------------------------------------------------------------------------------------------- */

        Login.onKeyUp = function (event) {
            alert(event);
            //if (event.keyCode == 13) {
            //    Login.login();
            //}
        }

    }


    /**
     * Register - Employee Controller
     * ------------------------------------------------------------------------------------------ */

    angular.module('etControllersEmployee')
        .controller('RegisterEmployeeController', RegisterEmployeeController);
    RegisterEmployeeController.$inject = ['$scope', '$rootScope', '$state', 'AuthService', 'MessageService'];
    function RegisterEmployeeController($scope, $rootScope, $state, AuthService, MessageService) {
        // console.log("Employee Sign Up Controller");
        var Register = this;
        Register.error_message = "";
        Register.success_message = "";
        Register.user = {};
        Register.email = "";
        Register.username = "";
        Register.password = "";
        Register.type = "employee";

        /* User register employee
         ---------------------------------------------------------------------------------------- */
        Register.register = function () {
            Register.user = {
                "Email": Register.email,
                "UserName": Register.username,
                "Password": Register.password,
                "Type": "employee"
            };


            AuthService.CreateUser(Register.user, function (response) {
                console.log(Register.user);
                if (response.status) {
                    MessageService.Success("User created !");
                    $state.go("signInEmployee");
                } else {
                    MessageService.Error(response.message);
                }
            });
        }
    }

    /**
     * My Profile Employee Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('MyProfileEmployeeController', MyProfileEmployeeController);
    MyProfileEmployeeController.$inject = ['$scope', '$rootScope', '$filter', '$state', '$stateParams', 'AuthService', 'ServiceEmployee', 'MessageService'];

    function MyProfileEmployeeController($scope, $rootScope, $filter, $state, $stateParams, AuthService, ServiceEmployee, MessageService) {
        var Profile = this;
        Profile.user = {};
        //Get the ApplicantID from the router path
        Profile.ApplicantID = $stateParams.ApplicantID;
        //Profile user Date of birth
        Profile.user.date_of_birth = null;

        /* Redirect non authenticated user to home / sign in
         --------------------------------------------------------------------------------------- */
        if (!AuthService.isAuthenticated()) {
            $state.go("home");
        }


        //Watch the profile date update
        $scope.$watch('Profile.user.date_of_birth', function (nv, ov) {
            var date_string = nv + "";
            Profile.user.DoBDate = date_string.split("/")[0];
            Profile.user.DoBMonth = date_string.split("/")[1];
            Profile.user.DoBYear = date_string.split("/")[2];
        });


        /* Get profile user - employee
         --------------------------------------------------------------------------------------- */
        Profile.getProfile = function () {
            if (AuthService.isAuthenticated()) {
                ServiceEmployee.GetProfileEmployee(function (response) {


                    if (response.status) {
                        Profile.user = response.data;
                        //Manipulate date string
                        Profile.user.date_of_birth = Profile.user.DoBDate + "/" + Profile.user.DoBMonth + "/" + Profile.user.DoBYear;
                        //Watch date change and update Profile.user DoBs

                        MessageService.Success("User information loaded !")
                    } else {

                        MessageService.Error("User not found !");
                    }
                });
            }
        };

        /* Get profile other user - employee (ApplicantID is passed on the router)
         --------------------------------------------------------------------------------------- */
        Profile.getProfileOtherUser = function () {
            if (AuthService.isAuthenticated()) {
                if (Profile.ApplicantID != null && Profile.ApplicantID != undefined) {
                    ServiceEmployee.GetProfileSingleEmployee(Profile.ApplicantID, function (result) {
                        // console.log(result);
                        //Do nothing
                    });
                }
            }
        };

        // function call
        Profile.getProfileOtherUser();

        /* Update profile - employee
         --------------------------------------------------------------------------------------- */
        Profile.update = function () {
            ServiceEmployee.UpdateProfile(Profile.user, function (response) {

                if (response.status) {
                    MessageService.Success("Profile updated successfully !");
                    Profile.user = response.data;
                    Profile.user.date_of_birth = Profile.user.DoBDate + "/" + Profile.user.DoBMonth + "/" + Profile.user.DoBYear;
                } else {

                    MessageService.Error(response.message);
                }

            });
        };
    }

    /**
     * Location controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('LocationController', LocationController);
    LocationController.$inject = ['$scope', '$http', '$state', '$stateParams', '$timeout', 'AuthService', 'ServiceEmployee', 'AppService', 'MessageService', 'GetLocations'];
    function LocationController($scope, $http, $state, $stateParams, $timeout, AuthService, ServiceEmployee, AppService, MessageService, GetLocations) {
        // console.log("Location controller");
        var Location = this;
        Location.user_locations = {};
        Location.all = {};
        Location.locations = [];
        Location.new_locations = [];


        /* Redirect non authenticated user to home / sign in
         ---------------------------------------------------------------------------------------- */
        if (!AuthService.isAuthenticated()) {
            $state.go("home");
        }


        /* Get all locations
         ---------------------------------------------------------------------------------------- */

        Location.all = GetLocations.data.Locations;
        $timeout(function () {
            $('select').material_select();
        }, 3000);


        /* Get user locations
         ---------------------------------------------------------------------------------------- */
        ServiceEmployee.GetProfileEmployee(function (response) {
            Location.user_locations = response.data.Locations;
            angular.forEach(Location.user_locations, function (v, k) {
                Location.user_locations[k].Status = true;
            });

            //Match array
            angular.forEach(Location.all, function (v, k) {
                Location.locations.push({
                    "Location": v,
                    "Status": false
                });
            });

            Location.user_locations.forEach(function (cv) {
                Location.locations.forEach(function (CV, i) {
                    if (cv.Location == CV.Location) {
                        CV.Status = true;
                    }
                });
            });
        });


        /* Add / Update Location
         ------------------------------------------------------------------------------------ */
        Location.addLocation = function () {
            Location.locations.forEach(function (cv, i) {

                if (cv.Status) {
                    delete cv.Status;
                    Location.new_locations.push(cv);
                }

            });


            ServiceEmployee.AddLocation(Location.new_locations, function (response) {
                if (response.status) {
                    MessageService.Success("Location updated successfully !");
                } else {
                    MessageService.Error("Location update error!");
                }
            });
        };


    }

    /**
     * Skill controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('SkillController', SkillController);
    SkillController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployee', 'AppService', 'MessageService'];
    function SkillController($scope, $state, $stateParams, AuthService, ServiceEmployee, AppService, MessageService) {
        var Skill = this;
        Skill.skills = [];
        Skill.selected_skills = [];
        Skill.user_skills = [];
        Skill.final_skills = [];


        /* Redirect non authenticated user to home / sign in
         ---------------------------------------------------------------------------------------- */
        if (!AuthService.isAuthenticated()) {
            $state.go("home");
        }

        /* Get all skills
         ---------------------------------------------------------------------------------------- */
        AppService.GetSkillsLocations(function (response) {

            Skill.skills = response.data.Skills;


            angular.forEach(Skill.skills, function (S, K) {
                Skill.final_skills.push({
                    "Category": S,
                    "Status": false,
                    "Skill": "",
                    "Level": "Basic"
                });
            });


            /* Get user Skills
             ---------------------------------------------------------------------------------------- */
            ServiceEmployee.GetProfileEmployee(function (response) {

                Skill.user_skills = response.data.Skills;
                angular.forEach(Skill.user_skills, function (U, K) {
                    angular.forEach(Skill.final_skills, function (F, K) {
                        if (U.Category == F.Category) {
                            F.Status = true;
                            F.Level = U.Level;
                        }
                    });
                });
            });


        }, function (r) {
        });


        /* Add new user Skills
         ---------------------------------------------------------------------------------------- */
        Skill.addSkills = function () {
            angular.forEach(Skill.final_skills, function (F, K) {
                if (F.Status) {
                    delete F.Status;
                    Skill.selected_skills.push(F);
                }
            });


            ServiceEmployee.AddSkills(Skill.selected_skills, function (response) {

                if (response.status) {
                    MessageService.Success("Skills updated successfully !");
                    Skill.user_skills = response.data.Skills
                }
                angular.forEach(Skill.user_skills, function (U, K) {
                    angular.forEach(Skill.final_skills, function (F, K) {
                        if (U.Category == F.Category) {
                            F.Status = true;
                            F.Level = U.Level;
                        }
                    });
                });
            });
        }
    }

    /**
     * Experience controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('ExperienceController', ExperienceController);
    ExperienceController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployee', 'MessageService', '$http', '$rootScope','RESOURCE_URL'];
    function ExperienceController($scope, $state, $stateParams, AuthService, ServiceEmployee, MessageService, $http, $rootScope,RESOURCE_URL) {
        var Experience = this;
        Experience.forms = [0];

        Experience.new_experience = {
            "Experience": []
        };
        Experience.work_experience = {
            "Experience": []
        };

        var f = 0;


        var httpRequest;
        /* Redirect non authenticated user to home / sign in
         -------------------------------------------------------------------------------------- */
        if (!AuthService.isAuthenticated()) {
            $state.go("home");
        }
        /* Redirect non authenticated user to home / sign in
         -------------------------------------------------------------------------------------- */
        Experience.getExperience = function () {
            httpRequest = $http({
                url: RESOURCE_URL.BASE_URI + '/employee/my-profile/experience',
                method: 'GET',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                }
            });
            httpRequest.then(function (success) {
                angular.forEach(success.data.data.Experience, function (v, k) {
                    Experience.work_experience.Experience.push(v);
                });

            }, function (error) {
            });
        };


        /* Add Experience employee
         -------------------------------------------------------------------------------------- */
        Experience.addForm = function () {
            f = f + 1;
            Experience.forms.push(f);
        };

        /* Remove Forms employee
         -------------------------------------------------------------------------------------- */
        Experience.removeForm = function (i) {
            Experience.forms.splice(i, 1);
        };

        /* Remove Work Experience
         -------------------------------------------------------------------------------------- */
        Experience.removeWorkExperience = function (i) {
            Experience.work_experience.Experience.splice(i, 1);
        };


        /* Update Experience
         --------------------------------------------------------------------------------------- */
        Experience.addExperience = function () {
            if (AuthService.isAuthenticated()) {
                angular.forEach(Experience.new_experience.Experience, function (v, k) {

                    var s = v.StartDate + "";
                    var e = v.EndDate + "";
                    var t = new Date();

                    if (s.indexOf("/") > 0) {
                        v.StartDate = s.split("/").reverse().join("-").toString() + "T" + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
                        v.EndDate = e.split("/").reverse().join("-").toString() + "T" + t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();

                        Experience.work_experience.Experience.push(v);

                    }
                });


                ServiceEmployee.AddExperience(Experience.work_experience, function (response) {

                    if (response.status) {
                        MessageService.Success("Experience updated !");

                        // clear form
                        Experience.new_experience = {
                            "Experience": []
                        };
                        Experience.forms = [0];

                    } else {
                        MessageService.Error("Update Error" + response.message);
                        MessageService.Error(response.data.message);
                    }
                });
            } else {
                state.go("signInEmployee");
                MessageService.Warning("Please sign in to continue !");
            }
        }
    }

    /**
     * Employee Jobs Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('EmployeeJobsController', EmployeeJobsController);
    EmployeeJobsController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'AuthService', 'ServiceEmployee', 'MessageService','RESOURCE_URL'];
    function EmployeeJobsController($scope, $rootScope, $state, $stateParams, $http, AuthService, ServiceEmployee, MessageService,RESOURCE_URL) {

        var Employee = this;
        Employee.jobs = [];
        Employee.unsuccessful = [];
        Employee.completed = [];
        Employee.accepted = [];
        Employee.pending = [];
        Employee.selected = [];
        Employee.declined = [];
        Employee.hired = [];
        Employee.check = [];
        Employee.c_id = "";
        Employee.new_start_time = "";
        Employee.new_end_time = "";
        Employee.time_sheet_title = "";

        /* View Jobs
         ------------------------------------------------------------------------------------------ */
        if (!AuthService.isAuthenticated()) {
            $state.go("home");
        }
        /* View jobs
         ------------------------------------------------------------------------------------------ */
        Employee.viewMyJobs = function () {
            ServiceEmployee.ViewMyJobs(function (response) {
                if (response.status) {
                    angular.forEach(response.data, function (V, K) {

                        switch (V._id) {
                            case "Pending":
                                Employee.pending.push(V);
                                break;

                            case "Accepted":
                                Employee.accepted.push(V);
                                break;

                            case "Completed":
                                Employee.completed.push(V);
                                break;

                            case "Unsuccessful":
                                Employee.unsuccessful.push(V);
                                break;

                            case "Declined":
                                Employee.declined.push(V);
                                break;

                            case "Selected":
                                Employee.selected.push(V);
                                break;

                            case "Hired":
                                Employee.hired.push(V);
                                break;
                        }

                    });

                    MessageService.Success("Jobs loaded !");
                } else {
                    MessageService.Error("User jobs not found !");
                }
            });
        };

        Employee.viewMyJobs();

        /* Accept Job Invitation
         ------------------------------------------------------------------------------------------ */
        Employee.acceptJobInvitation = function (job_id) {
            if (job_id != null) {
                $http({
                    url: RESOURCE_URL.BASE_URI + '/employee/job/' + job_id + '/true',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'JWT '+$rootScope.globals.current_user.token
                    },
                    method: 'GET'
                }).then(function (success) {

                    MessageService.Success("Job Accepted!");
                    Employee.viewMyJobs();
                }, function (error) {

                });
            } else {
                MessageService.Error("Invitation ID is not set!");
            }
        };

        /* Decline Job Invitation
         ------------------------------------------------------------------------------------------ */
        Employee.declineJobInvitation = function (job_id) {
            if (job_id != null) {
                $http({
                    url: RESOURCE_URL.BASE_URI + '/employee/job/' + job_id + '/false',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'JWT '+$rootScope.globals.current_user.token
                    },
                    method: 'GET'
                }).then(function (success) {

                    MessageService.Success("Job declined!");
                    Employee.viewMyJobs();
                }, function (error) {

                });
            } else {
                MessageService.Error("Invitations ID is not set");
            }
        }

        /* Accept Job
         ------------------------------------------------------------------------------------------ */
        Employee.acceptJob = function (job_id) {
            if (job_id != null) {
                $http({
                    url: RESOURCE_URL.BASE_URI + '/employee/offer/' + job_id + '/true',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'JWT '+$rootScope.globals.current_user.token
                    },
                    method: 'GET'
                }).then(function (success) {

                    MessageService.Success("Job Accepted!");
                    Employee.viewMyJobs();
                }, function (error) {
                    MessageService.Error(error);
                });
            } else {
                MessageService.Error("Invitation ID is not set!");
            }
        };

        /* Decline Job
         ------------------------------------------------------------------------------------------ */
        Employee.declineJob = function (job_id) {
            if (job_id != null) {
                $http({
                    url: RESOURCE_URL.BASE_URI + '/employee/offer/' + job_id + '/false',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'JWT '+$rootScope.globals.current_user.token
                    },
                    method: 'GET'
                }).then(function (success) {
                    MessageService.Success("Job declined!");
                    Employee.viewMyJobs();
                }, function (error) {

                });
            } else {
                MessageService.Error("Invitations ID is not set");
            }
        }

        /* Unsuccessful Job
         ------------------------------------------------------------------------------------------ */
        Employee.unsuccessfulJob = function (job_id) {
            if (job_id != null) {
                $http({
                    url: RESOURCE_URL.BASE_URI + '/employee/job/' + job_id + '/unsuccessful',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'JWT '+$rootScope.globals.current_user.token
                    },
                    method: 'GET'
                }).then(function (success) {
                    MessageService.Success("Jobs updated!");
                    Employee.viewMyJobs();

                }, function (error) {

                });
            } else {
                MessageService.Error("Invitations ID is not set");
            }
        }

        /* Completed Job
         ------------------------------------------------------------------------------------------ */
        Employee.completedJob = function (job_id) {
            if (job_id != null) {
                $http({
                    url: RESOURCE_URL.BASE_URI + '/employee/job/' + job_id + '/completed',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'JWT '+$rootScope.globals.current_user.token
                    },
                    method: 'GET'
                }).then(function (success) {
                    MessageService.Success("Jobs updated!");
                    Employee.viewMyJobs();

                }, function (error) {

                });
            } else {
                MessageService.Error("Invitations ID is not set");
            }
        };

        /* Check accepted Job
         ------------------------------------------------------------------------------------------ */
        Employee.checkAccepted = function (i, id) {
            if (Employee.check[i]) {
                Employee.unsuccessfulJob(id);
            } else {
                Employee.completedJob(id);
            }
        }

        /* Set contract id
         ------------------------------------------------------------------------------------------ */
        Employee.setCID = function (c_id) {
            Employee.c_id = c_id;
            console.log(c_id);
        };

        /* Add time sheet
         ------------------------------------------------------------------------------------------ */
        Employee.addTimeSheet = function () {

            var start = Employee.new_start_time;
            var end = Employee.new_end_time;
            
            var timeStart = new Date(Employee.new_date+" "+Employee.new_start_time).getTime();
            var timeEnd = new Date(Employee.new_date+" "+Employee.new_end_time).getTime();


            var diff = {};

            diff.milliseconds = timeEnd % timeStart;
            diff.seconds = diff.milliseconds / 1000;
            diff.minutes = diff.seconds / 60;
            diff.hours = diff.minutes / 60;
            console.log('timeStart '+timeStart);
            console.log('timeEnd '+timeEnd);
            if(timeStart > timeEnd){
                MessageService.Error('End time should be greater than start time.');
            }else{
                var diff_hours = parseFloat(diff.hours).toFixed(2);

                var new_date = Employee.new_date.split("/");
                Employee.new_date = new_date[2] + "-" + new_date[1] + "-" + new_date[0];


                Employee.new_time = {
                    "ContractID": Employee.c_id,
                    'TimeSheets': [
                        {
                            'Date': Employee.new_date,
                            'StartTime': Employee.new_start_time,
                            'EndTime': Employee.new_end_time,
                            'Hours': diff_hours
                        }
                    ],
                    "Title": Employee.time_sheet_title
                };


                ServiceEmployee.AddTimeSheet(Employee.new_time, function (response) {


                    if (response.status) {
                        MessageService.Success("Employee Time sheet added successfully!");
                    } else {
                        MessageService.Error(response.message);
                    }

                });   
            }
        }
    }

    /**
     * Employee Single Job Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('EmployeeViewJobsController', EmployeeViewJobsController);
    EmployeeViewJobsController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployee'];
    function EmployeeViewJobsController($scope, $state, $stateParams, AuthService, ServiceEmployee) {

        $scope.JobID = $stateParams.JobID;
        $scope.Job = {};

        /* View single job
         ------------------------------------------------------------------------------------------ */
        if ($scope.JobID) {
            ServiceEmployee.ViewSingleJob($scope.JobID, function (response) {
                $scope.Job = response.data[0];
            });
        }

    }

    /**
     * Employee Time sheets Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('EmployeeTimeSheet', EmployeeTimeSheet);
    EmployeeTimeSheet.$inject = ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'AuthService', 'ServiceEmployee', 'MessageService'];
    function EmployeeTimeSheet($scope, $rootScope, $http, $state, $stateParams, AuthService, ServiceEmployee, MessageService) {

        var Timesheet = this;

        Timesheet.Contracts = [];
        Timesheet.TimeSheets = [];
        Timesheet.new = [];

        Timesheet.timesheet_data;
        Timesheet.new_date;
        Timesheet.new_start_time;
        Timesheet.new_end_time;

        Timesheet.new_time = {
            "ContractID": null,
            "TimeSheets": [],
            "Title": "Time Sheet"
        };


        /* Approve time sheet
         ------------------------------------------------------------------------------------------ */
        Timesheet.approveTimesheet = function (time_sheet_id) {

            $http({
                url: RESOURCE_URL.BASE_URI + '/employee/timesheet/'+$stateParams.ContractID+'/'+time_sheet_id+'/true',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                }
            }).then(function (response) {

                if (response.data.status) {
                    MessageService.Success("Time sheet approved successfully !");
                } else {
                    MessageService.Error("Error on approving time sheet !");
                }

            }, function (error) {

                MessageService.Error("Error on approving time sheet !");
            });
        };


        /* Re contest time sheet
         ------------------------------------------------------------------------------------------ */
        Timesheet.recontestTimesheet = function (time_sheet_id) {
            $http({
                url: RESOURCE_URL.BASE_URI + '/employee/timesheet/'+$stateParams.ContractID+'/'+time_sheet_id+'/false',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                }
            }).then(function (response) {

                if (response.data.status) {
                    MessageService.Success("Time sheet re contested successfully !");
                } else {
                    MessageService.Error("Error on re contesting time sheet !");
                }

            }, function (error) {

                MessageService.Error("Error on re contesting time sheet !");
            });
        };

        /* Get user time sheets
         ------------------------------------------------------------------------------------------ */
        Timesheet.getUserTimeSheets = function () {

            ServiceEmployee.GetUserTimeSheets(function (response) {

                if (response.status) {
                    MessageService.Success("Timesheets loaded !");

                    angular.forEach(response.data, function (Obj, K) {
                        Timesheet.Contracts.push(Obj.Contracts[0]);
                        if ($stateParams.ContractID == Obj.Contracts[0].ContractID)
                            Timesheet.TimeSheets.push(Obj.Contracts[0]);
                    });

                } else {
                    MessageService.Error("Time sheets not found !");
                }


            });


        };


        //Call function
        Timesheet.getUserTimeSheets();


    }

    //employee billing

    angular.module('etControllersEmployee')
        .controller("EmployeeBillingController", EmployeeBillingController);
    EmployeeBillingController.$inject = ['$scope', '$rootScope', '$http', '$state', 'AuthService', 'MessageService','RESOURCE_URL','$httpParamSerializerJQLike'];

    function EmployeeBillingController($scope, $rootScope, $http, $state, AuthService, MessageService,RESOURCE_URL,$httpParamSerializerJQLike) {

        var Billing = this;
        Billing.filename = null;
        Billing.step_1 = true;
        Billing.step_2 = false;
        Billing.cards = [];
        Billing.have_card = false;

        if (!AuthService.isAuthenticated()) {

            $state.go("home");

        }

        Billing.getCards = function () {

            $http({
                url: RESOURCE_URL.BASE_URI + '/user/card',
                method: 'GET',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                }
            }).then(function (response) {

                if (response.data.status) {
                    Billing.cards = response.data.data.external_accounts.data;
                    if (Billing.cards.length == 0) {
                        Billing.have_card = false;
                    } else {
                        Billing.have_card = true;
                    }
                }

            }, function (response) {

            });
        };

        //Get all cards
        Billing.getCards();

        Billing.saveCard = function () {
            MessageService.Success("Please wait... adding your card");
            //Get stripe token
            var card_details = {
                    card : {
                        'number': Billing.card.number,
                        'exp_month': Billing.card.exp_month,
                        'exp_year': Billing.card.exp_year,
                        'cvc': Billing.card.cvc
                    }
                };
            $http({
                url: 'https://api.stripe.com/v1/tokens',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+RESOURCE_URL.STRIPE_API,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(card_details)
            }).then(function (response) {


                Billing.stripe_token = response.data.id;
                // console.log(response.data.id);

                //Send stripe token
                if (Billing.stripe_token != null) {
                    $http({
                        url: RESOURCE_URL.BASE_URI+'/user/billing/',
                        method: 'POST',
                        headers: {
                            'Content-type' : 'application/json',
                            'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                        },
                        data: angular.toJson({
                                "stripeToken": Billing.stripe_token
                            })
                    }).then(function (response) {
                        MessageService.Success("Your card added successfully !");
                        //Get all cards
                        Billing.getCards();

                    }, function (response) {


                    });
                } else {

                    MessageService.Error("Error adding your card !");

                }


            }, function (error) {

            });
        }

        Billing.addAccountStepOne = function () {
            $http({
                url: RESOURCE_URL.BASE_URI+'/user/billing/bank',
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                },
                data: angular.toJson(Billing.account)
            }).then(function (response) {

                if (response.data.status) {
                    if (response.data.data.Token) {
                        Billing.addAccountStepTwo(response.data.data.Token);
                    }
                    Billing.account = {};
                    MessageService.Success("Account information saved successfully !");
                    Billing.step_2 = true;
                    Billing.step_1 = false;
                } else {
                    MessageService.Error(response.data.message);
                }

            }, function (response) {
            });
        };

        Billing.addAccountStepTwo = function (token) {

            $http({
                url: RESOURCE_URL.BASE_URI+'/user/billing/',
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                },
                data: angular.toJson({"stripeToken": token})
            }).then(function (s) {
                MessageService.Success("Bank information updated successfully !");
            }, function () {
                MessageService.Error("Error updating Bank information !");
                $state.go("myBusinessHome");
            });

        };

        Billing.addAccountStepVerify = function () {

            $http({
                url: RESOURCE_URL.BASE_URI+'/user/billing/verify',
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                    'Authorization': 'JWT '+$rootScope.globals.current_user.token,
                },
                data: angular.toJson({
                    "file": Billing.filename
                })
            }).then(function (s) {
                MessageService.Success("File verified successfully !");
                Billing.filename = "";
            }, function () {
                MessageService.Error("Error on verify the files !");
            });


        };

    }


    //search job
    angular.module('etControllersEmployee')
        .controller("SearchJobController", SearchJobController);
    SearchJobController.$inject = ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'MessageService', 'AuthService', 'RESOURCE_URL','ServiceEmployer'];
    function SearchJobController($scope, $rootScope, $http, $state, $stateParams, MessageService, AuthService, RESOURCE_URL,ServiceEmployer) {

        var Search = this;
        Search.result_text = "Please wait...";
        Search.count = null;
        Search.show_results = true;
        Search.show_form = false;
        Search.paramLocation = null;
        Search.paramSkill = $stateParams.skill;

        Search.new = {
            'hire': 'Automatic',
            'Proffesion': $stateParams.skill
        };

        //Get skills
        $http({
            url: RESOURCE_URL.BASE_URI + '/skills',
            method: 'GET'
        }).then(function (response) {
            Search.skills = response.data.data.Skills;
        });


        //Get locations
        $http({
            url: RESOURCE_URL.BASE_URI + '/locations/cities',
            method: 'GET'
        }).then(function (response) {
            Search.locations = response.data.data.Locations;
        });


        $http({
            url: RESOURCE_URL.BASE_URI+'/employer/job/search?skill='+Search.paramSkill,
            method: 'GET',
        }).then(function (response) {

            if (response.data.status) {
                if (response.data.data.count > 0) {
                    Search.result_text = "result found !";
                    Search.count = response.data.data.count;
                    Search.show_results = true;
                    Search.show_form = true;
                } else {
                    Search.result_text = "No results found !"
                }

                if (Search.count > 1) {
                    Search.result_text = "results found !";
                }

            } else {
                Search.result_text = "No results found !"
            }


        }, function (response) {
            Search.show_results = false;
        });

        Search.postJob = function () {

            Search.prepareJob();
            Search.job();
        };

        //Edit start date and time
        Search.prepareJob = function () {
            if (Search.new.StartingDate != "" && Search.new.StartingDate != undefined && Search.new.StartingDate != null) {
                Search.new.StartingDate = Search.new.StartingDate.split("/").reverse().join("-");
            } else {
                Search.new.StartingDate = {};
            }

            if (Search.new.EndingDate != "" && Search.new.EndingDate != undefined && Search.new.EndingDate != null) {
                Search.new.EndingDate = Search.new.EndingDate.split("/").reverse().join("-");
            } else {
                Search.new.EndingDate = {};
            }
        };

        // localStorage.setItem("new_job", angular.toString(Job.new));

        Search.job = function () {
            ServiceEmployer.PostJob(Search.new, function (response) {

                if (response.status) {
                    MessageService.Success("Job posted successfully !");
                    Search.new = {};
                    $state.go("myJobsEmployer");

                } else {
                    MessageService.Error("Error on posting a new job !");
                    MessageService.Error(response.message);
                }

            });
        }


    }

    //Contact controller
    angular.module("etControllersEmployee")
        .controller("ContactController", ContactController);
    ContactController.$inject = ['$scope', '$http', 'MessageService'];
    function ContactController($scope, $http, MessageService) {
        var Contact = this;
        console.log("contact controller");

        Contact.name = "";
        Contact.email = "";
        Contact.message = "";

        Contact.sendMessage = function () {

            MessageService.Success("Your message sent successfully !");


        }
    }


})(jQuery, angular);