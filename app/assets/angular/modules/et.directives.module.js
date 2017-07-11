/**
 * @project - Easy trades
 * @date - April 28 2017
 * @type - Javascript / JQuery/ Angular
 * @file - Application directives
 * @author - Shan Dhiviyajan <prashasoft@gmail.com>
 */

/*
 * Directives
 /* --------------------------------------------------------------------------------------------------------------- */

(function ($, angular) {
    'use strict';

    //Angular strict DI Mode enabled

    //Directives module
    angular.module("etDirectives", ['etAPI']);

    /* Main navigation directive
     --------------------------------------------------------------------------------------------------------- */
    angular.module('etDirectives')
        .directive('etNav', etNav);

    etNav.$inject = ['$state'];
    function etNav($state) {
        return {
            restrict: "E",
            templateUrl: '/templates/nav',
            link: function (scope, element, attrs) {
                setTimeout(function () {
                    $(element).find("li a").removeClass("active");
                    $(element).find("li").each(function () {

                        if ($(this).find("a").attr("ui-sref") == $state.$current.self.name) {
                            $(this).find("a").addClass("active");
                        }

                    });
                }, 700);


            }
        }

    }


    angular.module("etDirectives")
        .directive('etTriggerModal', etTriggerModal);
    function etTriggerModal() {

        var directive = {

            restrict: "A",
            link: link

        };

        function link(scope, element, attrs) {
            $("body").delegate(element, 'click', function () {
                $('.modal').modal();
            });
        }

        return directive;
    }

    /* Testimonial slider directive
     --------------------------------------------------------------------------------------------------------- */
    angular.module('etDirectives')
        .directive('etTestimonialSlider', etTestimonialSlider);
    function etTestimonialSlider() {
        var directive = {
            restrict: "A",
            link: link
        };

        function link(scope, element, attrs) {
            $(element).bxSlider({
                mode: 'horizontal',
                controls: false,
                auto: true,
                pagerCustom: '#pager'
            });
        }

        return directive;
    }

    /* Select box directive
     --------------------------------------------------------------------------------------------------------- */
    angular.module('etDirectives')
        .directive('etSelectBox', etSelectBox);

    etSelectBox.$inject = ['$timeout'];


    function etSelectBox() {

        var directive = {
            restrict: "A",
            link: link
        };

        function link(scope, element, attr) {


            setTimeout(function () {
                //$(element).material_select('destroy');
                $(element).material_select();
            }, 1500);

        }

        return directive;
    }


    angular.module('etDirectives')
        .directive('etCollapsible', etCollapsible);
    function etCollapsible() {


        var directive = {


            restrict: "A",
            link: link


        };

        function link(scope, element, attrs) {
            $(element).collapsible();
        }

        return directive;


    }

    /* UI tabs directive
     --------------------------------------------------------------------------------------------------------- */
    angular.module('etDirectives')
        .directive('etTabs', etTabs);
    function etTabs() {
        var directive = {
            restrict: "A",
            link: link
        };

        function link(scope, element, attrs) {
            $(element).tabs();
        }

        return directive;
    }

    /* Drop down menus
     --------------------------------------------------------------------------------------------------------- */
    angular.module('etDirectives')
        .directive('etDropdown', etDropdown);
    function etDropdown() {

        return {
            restrict: "A",
            scope: {
                submit: "&serialize"
            },
            link: function (scope, element, attrs) {
                $(element).dropdown({
                        inDuration: 300,
                        outDuration: 225,
                        constrainWidth: false,
                        hover: true,
                        gutter: 0,
                        belowOrigin: false,
                        alignment: 'left',
                        stopPropagation: false
                    }
                );
            }
        }

    }

    /* Date picker
     --------------------------------------------------------------------------------------------------------- */
    angular.module('etDirectives')
        .directive('etDatepicker', etDatepicker);
    function etDatepicker() {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                $(element).pickadate({
                    selectMonths: true,
                    selectYears: 117,
                    format: 'dd/mm/yyyy'
                });
            }
        }
    }

    /* Time picker
     --------------------------------------------------------------------------------------------------------- */
    angular.module('etDirectives')
        .directive('etTimePicker', etTimePicker);
    function etTimePicker() {

        var directive = {
            return: "A",
            link: link
        };

        function link(scope, element, atr) {
            $(element).timepicker();
        }

        return directive;

    }


    /**
     * Autocomplete dirctive
     */

    angular.module('etDirectives')
        .directive('etAutocomplete', etAutocomplete);
    function etAutocomplete() {

        var directive = {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            var skills_data = [];
            scope.skills.forEach(function (cv, i) {
                skills_data[cv] = null;
            });


            $(element).autocomplete({
                data: skills_data,
                minLength: 1
            });


        }

        return directive;
    }


    angular.module('etDirectives')
        .directive('etKeyEvents', etKeyEvents);

    etKeyEvents.$inject = ['$document'];
    function etKeyEvents($document) {

        var directive = {
            restrict: 'A',
            link: link
        };

        function link(scope) {

            $document.bind('keyup', function (e) {
                //Apply Login on press enter key
                // console.log(scope);
                if (e.keyCode == 13) {

                    if (scope.Login) {
                        scope.Login.login();
                    }

                    if (scope.Register) {
                        scope.Register.register();
                    }

                }
            });
        }

        return directive;
    }


})(jQuery, angular);