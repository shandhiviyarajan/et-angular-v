/**
 * @project - Easy trades
 * @date - April 28 2017
 * @type - Javacrit / JQuery/ Angular
 * @file - Application Bootstrap
 * @author - Shan Dhiviyajan <prashasoft@gmail.com>
 */

/*
 Application start
 --------------------------------------------------------------------------------------------------------------- */

(function ($, window, angular) {

    'use strict';

    //Angular application and configuration
    angular.module("etApp", [
        'etConstant',
        'etRouter',
        'etAPI',
        'etControllersEmployee',
        'etControllersEmployer',
        'etDirectives'
    ]);
    //Bootstrap the angular application
    angular.bootstrap(document, ['etApp'], {
        strictDi: true
    });


})(jQuery, window, angular);

