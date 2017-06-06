/**
 * @project - Easy trades
 * @date - April 28 2017
 * @type - Javacrit / JQuery/ Angular
 * @author - Shan Dhiviyajan <prashasoft@gmail.com>
 */

/*
 Angular Constant - Resource URLs
 ----------------------------------------------------------------------------------------------------------------- */



(function ($, angular) {
    'use strict';
    //Angular strict DI Mode enabled
    angular.module('etConstant', []);
    angular.module('etConstant')
        .constant('RESOURCE_URL', {
            BASE_URI:'https://easytrades.herokuapp.com',
            LOGIN: 'https://easytrades.herokuapp.com/login',
            SIGN_UP: 'https://easytrades.herokuapp.com/signup/',
            PROFILE_OTHER_USER: '',
            SIGN_OUT:'https://easytrades.herokuapp.com/logout',
            LOCATIONS:'https://easytrades.herokuapp.com/locations/cities',

            'EMPLOYEE': {
                MY_PROFILE: 'https://easytrades.herokuapp.com/employee/my-profile',
                MY_PROFILE_OTHERS: 'https://easytrades.herokuapp.com/employee/nuwans/profile',
                UPDATE_PROFILE:'https://easytrades.herokuapp.com/employee/',
                VIEW_JOBS: 'https://easytrades.herokuapp.com/employee/jobs',
                VIEW_JOB_BY_ID: 'https://easytrades.herokuapp.com/employee/jobs?id=',
                VIEW_ALL_JOBS:'https://easytrades.herokuapp.com/employee/jobs',
                VIEW_MY_JOBS:'https://easytrades.herokuapp.com/employee/myjobs',
                ADD_LOCATION:'https://easytrades.herokuapp.com/employee/',
                ADD_EXPERIENCE:'https://easytrades.herokuapp.com/employee/', //nuwans/experience
                EDIT_LOCATION:'https://easytrades.herokuapp.com/employee/',
                GET_TIME_SHEETS:'https://easytrades.herokuapp.com/employee/',
                GET_TIME_SHEETS_BY_FILTER:'https://easytrades.herokuapp.com/employee/timesheets',
                VIEW_TIME_SHEETS:'https://easytrades.herokuapp.com/employee/',
                ADD_TIME_SHEET:'https://easytrades.herokuapp.com/employee/',
                APPLY_JOB:'https://easytrades.herokuapp.com/employee/apply/',
                WITHDRAW_APPLICATION:'https://easytrades.herokuapp.com/employee/apply/jobid/false',
                ADD_BANK_ACCOUNT_STEP_1:'https://easytrades.herokuapp.com/user/billing/bank',
                ADD_BANK_ACCOUNT_STEP_2:'https://easytrades.herokuapp.com/user/billing/'

            },
            'EMPLOYER': {
                PROFILE:'https://easytrades.herokuapp.com/employer/nu1/profile',
                MY_PROFILE: 'https://easytrades.herokuapp.com/employer/my-profile',
                MY_PROFILE_OTHERS: 'https://easytrades.herokuapp.com/employer/nuwans/profile',
                APPLICANT_PROFILE:'http://easytrades.herokuapp.com/employer/user/',//nuwans
                UPDATE_PROFILE:'https://easytrades.herokuapp.com/employer/',
                VIEW_JOBS: 'https://easytrades.herokuapp.com/employer/jobs',
                VIEW_JOBS_HIRING:'https://easytrades.herokuapp.com/employer/myjobs/hiring',
                VIEW_JOB_BY_ID: 'https://easytrades.herokuapp.com/employer/job?id=',
                ADD_LOCATION:'https://easytrades.herokuapp.com/employer/nuwans/location',
                EDIT_LOCATION:'https://easytrades.herokuapp.com/employer/nuwans/location',
                GET_TIME_SHEETS_BY_FILTER:'https://easytrades.herokuapp.com/employer/nuwans/timesheets',
                GET_TIME_SHEETS:'https://easytrades.herokuapp.com/employer/timesheets',
                VIEW_TIME_SHEETS:'https://easytrades.herokuapp.com/employer/nuwans/timesheets',
                ADD_TIME_SHEET:'https://easytrades.herokuapp.com/employer/n1/timesheet',
                ADD_JOB:'https://easytrades.herokuapp.com/employer/job',
                APPROVE_JOB:'https://easytrades.herokuapp.com/employer/job/',//1055/hired
                WITHDRAW_APPLICATION:'https://easytrades.herokuapp.com/employer/apply/jobid/false',
                ADD_BANK_ACCOUNT_STEP_1:'https://easytrades.herokuapp.com/user/billing/bank',
                ADD_BANK_ACCOUNT_STEP_2:'https://easytrades.herokuapp.com/user/billing/'
            }
        });

})(jQuery, angular);


