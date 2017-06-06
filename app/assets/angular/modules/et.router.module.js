/**
 * @project - Easy trades
 * @date - April 28 2017
 * @type - Javascript / JQuery/ Angular
 * @file - Application Router
 * @author - Shan Dhiviyajan <prashasoft@gmail.com>
 */

(function ($, angular) {
    'use strict';
    //Angular strict DI Mode enabled

    //Angular router module
    angular.module('etRouter', ['etAPI', 'ui.router', 'ngCookies'])
        .config(config);
    config.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];

    /**
     * Angular router configurations
     * --------------------------------------------------------------------------------------------------------*/
    function config($urlRouterProvider, $stateProvider, $locationProvider) {

        $urlRouterProvider.otherwise("/");
        var base = "";

        /* Common Routs
         -------------------------------------------------------------------------------------*/

        var home = {
            name: 'home',
            url: '/',
            templateUrl: base + '/templates/home',
            controller:'HomeController',
            resolve: {
                GetSkills: ['$http',function ($http) {
                    return $http({
                        url: 'https://easytrades.herokuapp.com/skills',
                        method: 'GET'
                    }).then(function (response) {
                        return response.data;
                    });
                }],
                GetLocations: ['$http',function ($http) {
                    //Get locations
                    return $http({
                        url: 'https://easytrades.herokuapp.com/locations/cities',
                        method: 'GET'
                    }).then(function (response) {
                        return response.data;
                    });
                }]
            }
        };

        $stateProvider.state(home);

        var searchJobs = {
            name: 'searchJobs',
            url: '/search?skill&location',
            templateUrl: base + '/templates/search'
        };
        $stateProvider.state(searchJobs);

        var signIn = {
            name: 'signIn',
            url: '/sign-in',
            templateUrl: base + '/templates/sign-in'
        };
        $stateProvider.state(signIn);

        var signUp = {
            name: 'signUp',
            url: '/sign-up',
            templateUrl: 'templates/sign-up'
        };
        $stateProvider.state(signUp);

        var findStaff = {
            name: 'findStaff',
            url: '/find-staff',
            controller:'HomeController',
            templateUrl: base + '/templates/find-staff',
            resolve: {
                GetSkills: ['$http',function ($http) {
                    return $http({
                        url: 'https://easytrades.herokuapp.com/skills',
                        method: 'GET'
                    }).then(function (response) {
                        return response.data;
                    });
                }],
                GetLocations: ['$http',function ($http) {
                    //Get locations
                    return $http({
                        url: 'https://easytrades.herokuapp.com/locations/cities',
                        method: 'GET'
                    }).then(function (response) {
                        return response.data;
                    });
                }]
            }
        };
        $stateProvider.state(findStaff);

        var staff = {
            name: 'staff',
            url: '/staff',
            templateUrl: base + '/templates/staff'
        };
        $stateProvider.state(staff);
        var seekJobs = {
            name: 'seekJobs',
            url: '/seek_jobs',
            templateUrl: base + '/templates/seek-jobs'
        };
        $stateProvider.state(seekJobs);

        var about = {
            name: 'about',
            url: '/about',
            templateUrl: base + '/templates/about'
        };
        $stateProvider.state(about);

        var faq = {
            name: 'faq',
            url: '/faq',
            templateUrl: base + '/templates/faq'
        };
        $stateProvider.state(faq);

        var terms = {
            name: 'terms',
            url: '/terms',
            templateUrl: base + '/templates/terms'
        };
        $stateProvider.state(terms);

        var contact = {
            name: 'contact',
            url: '/contact',
            templateUrl: base + '/templates/contact'
        };
        $stateProvider.state(contact);

        var all = {
            name: 'all',
            url: '/all',
            templateUrl: base + '/templates/all'
        };
        $stateProvider.state(all);


        /* Employee Routs
         -----------------------------------------------------------------------------------------------------*/

        var signInEmployee = {
            name: 'signInEmployee',
            url: '/employee/sign-in',
            templateUrl: base + '/templates/sign-in-contractor'
        };
        $stateProvider.state(signInEmployee);

        var signUpEmployee = {
            name: 'signUpEmployee',
            url: '/employee/sign-up/',
            templateUrl: base + '/templates/sign-up-contractor'
        };
        $stateProvider.state(signUpEmployee);

        var myProfile = {
            cache: false,
            name: 'myProfile',
            url: '/employee/profile',
            templateUrl: base + '/templates/my-profile/'
        };
        $stateProvider.state(myProfile);

        var ProfileOthers = {
            cache: false,
            name: 'ProfileOthers',
            url: '/employee/profile/:ApplicantID',
            templateUrl: base + '/templates/my-profile/'
        };
        $stateProvider.state(ProfileOthers);

        var myJobs = {
            name: 'myJobs',
            url: '/employee/jobs',
            templateUrl: base + '/templates/my-jobs'
        };
        $stateProvider.state(myJobs);

        var viewJob = {
            name: 'viewJob',
            url: '/employee/job/:JobID',
            templateUrl: base + '/templates/view-jobs',
            controller: 'EmployeeViewJobsController'
        };
        $stateProvider.state(viewJob);

        var myBusinessHome = {
            name: 'myBusinessHome',
            url: '/employee',
            templateUrl: base + '/templates/my-business-home'
        };
        $stateProvider.state(myBusinessHome);

        var timeSheetEmployee = {
            name: 'timeSheetEmployee',
            url: '/employee/contracts/timesheets/:ContractID/',
            params: {
                ArrayID: ""
            },
            templateUrl: base + '/templates/time-sheet-employee'
        };
        $stateProvider.state(timeSheetEmployee);

        var contractEmployee = {
            name: 'contractEmployee',
            url: '/employee/contracts',
            templateUrl: base + '/templates/contract-employee'
        };
        $stateProvider.state(contractEmployee);

        var addLocation = {
            cache: false,
            name: 'addLocation',
            url: '/employee/add-location',
            templateUrl: base + '/templates/add-location'
        };
        $stateProvider.state(addLocation);

        var addExperience = {
            cache: false,
            name: 'addExperience',
            url: '/employee/add-experience',
            templateUrl: base + '/templates/add-experience'
        };
        $stateProvider.state(addExperience);

        var addSkills = {
            cache: false,
            name: 'addSkills',
            url: '/employee/add-skills',
            templateUrl: base + '/templates/add-skills'
        };
        $stateProvider.state(addSkills);

        var myBilling = {
            cache: false,
            name: 'myBilling',
            url: '/employee/billing',
            templateUrl: base + '/templates/my-billing-employee'
        };
        $stateProvider.state(myBilling);


        /* Employer Routs
         -----------------------------------------------------------------------------------------------------*/
        var signInEmployer = {
            name: 'signInEmployer',
            url: '/employer/sign-in',
            templateUrl: base + '/templates/sign-in-employer'
        };
        $stateProvider.state(signInEmployer);

        var signUpEmployer = {
            name: 'signUpEmployer',
            url: '/employer/sign-up/',
            templateUrl: base + '/templates/sign-up-employer'

        };
        $stateProvider.state(signUpEmployer);

        var myProfileEmployer = {
            cache: false,
            name: 'myProfileEmployer',
            url: '/employer/profile',
            templateUrl: base + '/templates/my-profile-employer/'
        };
        $stateProvider.state(myProfileEmployer);

        var ProfileOthersEmployer = {
            name: 'ProfileOthersEmployer',
            url: '/applicant/profile/:ApplicantID',
            templateUrl: base + '/templates/applicant-profile/'
        };
        $stateProvider.state(ProfileOthersEmployer);

        var postJob = {
            name: 'postJob',
            url: '/post-a-job',
            controller: 'PostJobController',
            controllerAs: 'Job',
            templateUrl: base + '/templates/post-a-job',
            resolve: {
                GetSkills: ['$http',function ($http) {
                    return $http({
                        url: 'https://easytrades.herokuapp.com/skills',
                        method: 'GET'
                    }).then(function (response) {
                        return response.data;
                    });
                }],
                GetLocations: ['$http',function ($http) {
                    //Get locations
                    return $http({
                        url: 'https://easytrades.herokuapp.com/locations/cities',
                        method: 'GET'
                    }).then(function (response) {
                        return response.data;
                    });
                }]
            }
        };
        $stateProvider.state(postJob);

        var getJob = {
            name: 'getJob',
            url: '/job/:JobID',
            templateUrl: base + '/templates/post-a-job'
        };
        $stateProvider.state(getJob);

        var editJob = {
            name: 'editJob',
            url: '/employer/job/edit/:JobID',
            templateUrl: base + '/templates/edit-job'
        };
        $stateProvider.state(editJob);

        var myJobsEmployer = {
            name: 'myJobsEmployer',
            url: '/employer/jobs',
            templateUrl: base + '/templates/my-jobs-employer'
        };
        $stateProvider.state(myJobsEmployer);

        var viewJobEmployer = {
            name: 'viewJobEmployer',
            url: '/employer/job/:JobID',
            templateUrl: base + '/templates/view-jobs-employer'
        };
        $stateProvider.state(viewJobEmployer);

        var myBusiness = {
            name: 'myBusiness',
            url: '/employer/my-business',
            templateUrl: base + '/templates/my-business'
        };
        $stateProvider.state(myBusiness);

        var myBusinessHomeEmployer = {
            name: 'myBusinessHomeEmployer',
            url: '/employer',
            templateUrl: base + '/templates/my-business-home-employer'
        };
        $stateProvider.state(myBusinessHomeEmployer);

        var timeSheetEmployer = {
            name: 'timeSheetEmployer',
            url: '/employer/timesheets',
            templateUrl: base + '/templates/time-sheet-employer'
        };
        $stateProvider.state(timeSheetEmployer);

        var timeSheetFiltered = {
            name: 'timeSheetFiltered',
            url: '/employer/timesheets/:CreatedBy',
            templateUrl: base + '/templates/time-sheet-filtered-employer'
        };
        $stateProvider.state(timeSheetFiltered);

        var weekTimeSheet = {
            name: 'weekTimeSheet',
            url: '/employer/timesheets/:JobID/:ContractID',
            templateUrl: base + '/templates/week-time-sheet-employer'
        };
        $stateProvider.state(weekTimeSheet);

        var myBillingEmployer = {
            name: 'myBillingEmployer',
            url: '/employer/billing/',
            templateUrl: base + '/templates/my-billing-employer'
        };
        $stateProvider.state(myBillingEmployer);
    }

    /**
     * Angular init application router
     * --------------------------------------------------------------------------------------------------------*/
    angular.module('etRouter')
        .run(run);
    run.$inject = ['$rootScope', '$cookieStore', 'AuthService'];
    function run($rootScope, $cookieStore, AuthService) {

        //Create a empty user object in root scope//
        $rootScope.globals = {
            current_user: {
                username: null,
                token: null,
                type: null
            }
        };
        //Get logged in user on refresh//
        var global = $cookieStore.get('globals');

        //Set the logged in user session token & username from the cookie
        if (global) {
            $rootScope.globals = {
                current_user: {
                    username: global.current_user.username,
                    token: global.current_user.token,
                    type: global.current_user.type
                }
            };
        }

        //Set Local storage
        localStorage.setItem('globals', $rootScope.globals);

        //Check authentication
        $rootScope.isAuthenticated = AuthService.isAuthenticated();
    }

})(jQuery, angular);