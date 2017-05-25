/**
 * @project - Easy trades
 * @date - April 28 2017
 * @type - Javascript / JQuery/ Angular
 * @file - Application controllers employee
 * @author - Shan Dhiviyajan <prashasoft@gmail.com>
 */

/*
 Employee Controllers
 ----------------------------------------------------------------------------------------------- */

(function ($, angular) {

    'use strict';
    //Angular strict DI Mode enabled


    //Employee module
    angular.module('etControllersEmployee', ['etAPI', 'ngCookies']);

    /**
     * Main Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('ngMainController', ngMainController);
    ngMainController.$inject = ['$scope', '$rootScope', 'AuthService', '$cookieStore', '$state'];

    function ngMainController($scope, $rootScope, AuthService, $cookieStore, $state) {
        var Main = this;
        console.log("Main Controller");
        $rootScope.$watch('isAuthenticated', function (nv, ov) {
            console.log("Authenticated - " + nv);
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
    HomeController.$inject = ['$scope', 'Search', 'AuthService', 'AppService'];
    function HomeController($scope, Search, AuthService, AppService) {
        $scope.search_input = "";
        $scope.search_array = [];


        Search.Search(function (result) {
            $scope.search_array = result.data;
            //Set application global collections
            AppService.Collections.Search = result.data;
        });
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
        console.log("Employee login controller");
        /* User Login
         ---------------------------------------------------------------------------------------- */
        var Login = this;
        Login.email = 'nuwansameerait@gmail.com';
        Login.password = 'test123';
        Login.type = 'employee';


        if (AuthService.isAuthenticated()) {
            $state.go("myBusinessHome");
        }

        Login.login = function () {
            AuthService.Login(Login.email, Login.password, function (response) {
                console.log(response);
                if (response.message = "ok") {
                    MessageService.Success("Login Successful !", 4000);
                    var LoggedUser = {
                        username: response.username,
                        token: response.token,
                        type: Login.type
                    };

                    //Set credentials//
                    AuthService.SetCredentials(LoggedUser);
                    //Redirect to my profile//
                    $state.go("myBusinessHome");

                } else {
                    MessageService.Success("Login failed, please try again!", 4000);
                }
            });
        }
    }


    /**
     * Register - Employee Controller
     * ------------------------------------------------------------------------------------------ */

    angular.module('etControllersEmployee')
        .controller('RegisterEmployeeController', RegisterEmployeeController);
    RegisterEmployeeController.$inject = ['$scope', '$rootScope', '$state', 'AuthService'];
    function RegisterEmployeeController($scope, $rootScope, $state, AuthService) {
        console.log("Employee Sign Up Controller");
        var Register = this;
        Register.error_message = "";
        Register.success_message = "";

        /* User register employee
         ---------------------------------------------------------------------------------------- */
        Register.register = function () {
            Register.user = {
                terms: Register.terms,
                username: Register.username,
                email: Register.email,
                type: "employee",
                password: Register.password
            };

            AuthService.CreateUser(Register.user, function (response) {
                console.log(response);
                if (response.data.error) {
                    Materialize.toast(response.data.error.message, 4000);
                } else {
                    $state.go("addLocation");
                    Materialize.toast('New user account created', 4000);
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
        console.log("My profile controller");
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

                    console.log(response);
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
                        console.log(result);
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
                console.log(response);
                if (response.status) {
                    MessageService.Success("Profile updated successfully !");
                    Profile.user = response.data;
                    Profile.user.date_of_birth = Profile.user.DoBDate + "/" + Profile.user.DoBMonth + "/" + Profile.user.DoBYear;
                } else {
                    console.log(response);
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
    LocationController.$inject = ['$scope', '$http', '$state', '$stateParams', '$timeout', 'AuthService', 'ServiceEmployee', 'AppService', 'MessageService'];
    function LocationController($scope, $http, $state, $stateParams, $timeout, AuthService, ServiceEmployee, AppService, MessageService) {
        console.log("Location controller");
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
        Location.getLocations = function () {
            var httpRequest = $http({
                url: 'https://easytrades.herokuapp.com/locations/cities',
                method: 'GET'
            });
            httpRequest.then(function (response) {
                if (response.data.status) {
                    Location.all = response.data.data.Locations;
                } else {
                    MessageService.Error("Error loading locations !");
                }
            }, function (error) {
                callback(error.data);
            });
            $timeout(function () {
                $('select').material_select();
            }, 3000);
        };


        Location.getLocations();


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
                //console.log(c.Location);
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
                    Location.new_locations.push(cv);
                }

            });

            console.log(Location.new_locations);

            ServiceEmployee.AddLocation(Location.new_locations, function (response) {
                if (response.status) {
                    MessageService.Success("Location updated successfully !");
                } else {
                    MessageService.Error("Location update error!");
                }
            });

        };


        /* Get new locations - employee
         ----------------------------------------------------------------------------------------- */
        //Location.getNewLocations = function (area, location) {
        //    angular.forEach(Location.check, function (v, k) {
        //        if (v) {
        //            if (k == area) {
        //                Location.newLocations.push({
        //                    'Area': area,
        //                    'Location': location
        //                });
        //            }
        //        } else {
        //            var index = Location.newLocations.map(function (f) {
        //                console.log(f.Area);
        //                return f.Area;
        //            }).indexOf(area);
        //            if (index > -1) {
        //                Location.newLocations.splice(index, 1);
        //            }
        //        }
        //    });
        //};




    }

    /**
     * Skill controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('SkillController', SkillController);
    SkillController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployee'];
    function SkillController($scope, $state, $stateParams, AuthService, ServiceEmployee) {
        var Skill = this;
        Skill.skills = [
            {
                "id": 1,
                "name": "Mechanic",
                "skills": ["Decoration",
                    "Exterior painting",
                    "Interior painting"],
                "level": "Basic"
            },
            {
                "id": 2,
                "name": "Truck Driver",
                "skills": ["Automotive",
                    "Exterior painting",
                    "Interior painting"],
                "level": "Basic"
            },
            {
                "id": 3,
                "name": "Carpenter",
                "skills": ["Driving",
                    "A/C Repair",
                    "Engine Check"],
                "level": "Basic"
            },
            {
                "id": 3,
                "name": "Painter",
                "skills": ["Driving",
                    "A/C Repair",
                    "Engine Check"],
                "level": "Basic"
            }
        ];

        Skill.selected_skills = [];


        /* Redirect non authenticated user to home / sign in
         ---------------------------------------------------------------------------------------- */
        if (!AuthService.isAuthenticated()) {
            $state.go("home");
        }


        /* Get user Skills
         ---------------------------------------------------------------------------------------- */

        ServiceEmployee.GetProfileEmployee(function (response) {
            Skill.user_skills = response.data.Skills;
            angular.forEach(Skill.user_skills, function (v, k) {
                Skill.user_skills[k].Status = true;
            });

            console.log(Skill.user_skills);
        });


        Skill.addSkills = function () {

        }
    }

    /**
     * Experience controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('ExperienceController', ExperienceController);
    ExperienceController.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployee', 'MessageService', '$http', '$rootScope'];
    function ExperienceController($scope, $state, $stateParams, AuthService, ServiceEmployee, MessageService, $http, $rootScope) {
        console.log("Experience controller");
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
                url: '/curl/index_r.php',
                method: 'POST',
                data: {
                    'request_url': 'https://easytrades.herokuapp.com/employee/my-profile/experience',
                    'JWT_TOKEN': 'JWT ' + $rootScope.globals.current_user.token,
                    'request_method': 'GET',
                    'query_data': true,
                    'post_data': null
                }
            });
            httpRequest.then(function (success) {
                console.log(success.data);
                angular.forEach(success.data.data.Experience, function (v, k) {
                    Experience.work_experience.Experience.push(v);
                });

            }, function (error) {
                console.log(error);
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
    EmployeeJobsController.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'AuthService', 'ServiceEmployee', 'MessageService'];
    function EmployeeJobsController($scope, $rootScope, $state, $stateParams, AuthService, ServiceEmployee, MessageService) {

        var Employee = this;
        Employee.jobs = [];
        Employee.underway = [];
        Employee.completed = [];
        Employee.accepted = [];

        /* View Jobs
         ------------------------------------------------------------------------------------------ */
        if (AuthService.isAuthenticated()) {

            ServiceEmployee.ViewMyJobs(function (response) {
                console.log(response);
                if (response.status) {

                    //angular.forEach(response.data, function (v, k) {
                    //    console.log(v);
                    //
                    //    if (v.contractors.length > 0) {
                    //        angular.forEach(v.contractors, function (v2, k2) {
                    //            if (v2.ApplicantID == $rootScope.globals.current_user.username) {
                    //
                    //                if (v2.Status == "hired") {
                    //                    Employee.completed.push(v);
                    //                } else {
                    //                    Employee.underway.push(v);
                    //                }
                    //            }
                    //        });
                    //    }
                    //
                    //    Employee.jobs = response.data;
                    //
                    //});

                    angular.forEach(response.data, function (V, K) {

                        if (V._id = "Accepted") {
                            Employee.accepted.push(V);
                        }
                    });

                    console.log(Employee.accepted);




                    MessageService.Success("Jobs loaded !");
                } else {
                    MessageService.Error("User jobs not found !");
                }
            });
        }

        /* Apply Job
         ------------------------------------------------------------------------------------------ */
        Employee.applyJob = function (job_id) {


            ServiceEmployee.ApplyJob(job_id, function (response) {
                console.log(response);

                if (response.error) {
                    MessageService.Error(response.error.message);
                }
            });
        };

        /* Cancel Job
         ------------------------------------------------------------------------------------------ */
        Employee.cancelJob = function (job_id) {
            ServiceEmployee.CancelJob(job_id, function (response) {

                console.log(response);

            });
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
                console.log(response);
            });
        }

    }

    /**
     * Employee Time sheets Controller
     * ------------------------------------------------------------------------------------------ */
    angular.module('etControllersEmployee')
        .controller('EmployeeTimeSheet', EmployeeTimeSheet);
    EmployeeTimeSheet.$inject = ['$scope', '$state', '$stateParams', 'AuthService', 'ServiceEmployee', 'MessageService'];
    function EmployeeTimeSheet($scope, $state, $stateParams, AuthService, ServiceEmployee, MessageService) {

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

        /* Get user time sheets
         ------------------------------------------------------------------------------------------ */
        Timesheet.getUserTimeSheets = function () {
            if (AuthService.isAuthenticated) {
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
            }
        };


        //Call function
        Timesheet.getUserTimeSheets();

        /* Add timesheet
         ------------------------------------------------------------------------------------------ */
        Timesheet.addTimeSheet = function () {

            var start = Timesheet.new_start_time;
            var end = Timesheet.new_end_time;

            var start_h = 0;
            var start_m = 0;

            var end_h = 0; //7
            var end_m = 0; //00

            if (start.indexOf("am") > 0) {
                start = start.substr(0, start.indexOf("am")).split(":");

                start_h = parseInt(start[0]); // 10
                start_m = parseInt(start[1]); //30
            }
            if (start.indexOf("pm") > 0) {
                start = start.substr(0, start.indexOf("pm")).split(":");

                start_h = parseInt(start[0]) + 12; // 10
                start_m = parseInt(start[1]); //30
            }

            if (end.indexOf("am") > 0) {
                end = end.substr(0, end.indexOf("am")).split(":");
                end_h = parseInt(end[0]); //7
                end_m = parseInt(end[1]); //00
            }

            if (end.indexOf("pm") > 0) {
                end = end.substr(0, end.indexOf("pm")).split(":");
                end_h = parseInt(end[0]) + 12; //7
                end_m = parseInt(end[1]); //00
            }


            var dh = end_h - start_h;
            var dm = end_m - start_m;

            if (dh < 0) {
                dh = dh + 12;
            }

            if (dm < 0) {
                dh = dh - 1;
                dm = dm + 60;
            }


            //format date//


            var new_date = Timesheet.new_date.split("/");
            Timesheet.new_date = new_date[2] + "-" + new_date[1] + "-" + new_date[0];


            Timesheet.new_time = {
                "ContractID": $stateParams.ContractID,
                'TimeSheets': [
                    {
                        'Date': Timesheet.new_date,
                        'StartTime': Timesheet.new_start_time,
                        'EndTime': Timesheet.new_end_time,
                        'Hours': dh + "." + dm
                    }
                ],
                "Title": "Time sheet"
            };


            ServiceEmployee.AddTimeSheet(Timesheet.new_time, function (response) {

                if (response.status) {
                    MessageService.Success("Timesheet added successfully!");

                    Timesheet.TimeSheets[0].TimeSheets = response.data.TimeSheets;


                } else {
                    MessageService.Error(response.message);
                }

            });
        }
    }


})(jQuery, angular);