$( document ).ready(function(){

	$(".button-collapse").sideNav();
    $('.carousel.carousel-slider').carousel({fullWidth: true,indicators:false});
    $('select').material_select();
    var $animation_elements = $('.animated');
    var $window = $(window);

    function check_if_in_view() {
        var window_height = $window.height();
        var window_top_position = $window.scrollTop();
        var window_bottom_position = (window_top_position + window_height);

        $.each($animation_elements, function() {
            var $element = $(this);
            var element_height = $element.outerHeight();
            var element_top_position = $element.offset().top;
            var element_bottom_position = (element_top_position + element_height);

            //check to see if this current container is within viewport
            if ((element_bottom_position >= window_top_position) &&
                (element_top_position <= window_bottom_position)) {
                $element.addClass('in-view');
            } else {
                $element.removeClass('in-view');
            }
        });
    }

    $window.on('scroll resize', check_if_in_view);
    $window.trigger('scroll');
    if ($(".testimonial-slider").length ) {
        $('.testimonial-slider').bxSlider({
            mode: 'horizontal',
            controls: false,
            auto: true,
            pagerCustom: '#pager'
        });
    }
    $('input.autocomplete').autocomplete({
        data: {
            "Apple": null,
            "Microsoft": null,
            "Google": 'http://placehold.it/250x250'
        },
        limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
    });
    if ($(".repeater").length ) {
        $('.repeater').repeater({

            show: function () {
                $(this).slideDown();
            },
            hide: function (deleteElement) {
                $(this).slideUp(deleteElement);
            },
            ready: function (setIndexes) {

            }
        });
    }
});
