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
            BASE_URI: 'https://easytrades.herokuapp.com'
        });

})(jQuery, angular);


