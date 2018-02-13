$(window).load(function () {
    // Initialize portfolio masonry
    $('.cards').masonry({
        itemSelector: '.card',
        transitionDuration: 0
    });
});

(function ($) {
    'use strict';

    var $body = $('body'),
        $header = $('header'),
        $hero = $('.hero'),
        $menuTrigger = $('.menu'),
        menuHeight = $('.top-bar').height(),
        $triggers = $('nav [href^="#"]'),
        $scrollItems = $triggers.map(function () {
            return $($(this).attr('href'));
        }),
        lastId;


    $(window)
        .scroll(function () {
            // Handle active menu links
            var pageTop = $(this).scrollTop(),
                fromTop = pageTop + menuHeight + 50,
                mql = window.matchMedia("(max-width:900px)"),
                currentElement = $scrollItems.map(function () {
                    if ($(this).offset().top < fromTop) {
                        return this;
                    }
                }),
                id;

            currentElement = currentElement[currentElement.length - 1];
            id = currentElement && currentElement.length ? '#' + currentElement[0].id : $triggers.first().attr('href');

            if (lastId !== id) {
                lastId = id;

                $triggers.removeClass('active');
                $('[href=' + id + ']').addClass('active');
            }


            if (mql.matches) {
                $header.removeClass('menuHidden');
                $body.toggleClass('collapsed', pageTop >= 0);
                $hero.toggleClass('sticky', pageTop > 133);
            } else {
                $header.toggleClass('menuHidden', pageTop < menuHeight);
                $body.toggleClass('collapsed', pageTop > menuHeight);
                $hero.toggleClass('sticky', pageTop > 333);
            }
        })
        .resize(function () {
            $(this).trigger('scroll');
        })
        .trigger('scroll');

    // Manually trigger menu visibility
    $menuTrigger.on('click', function () {
        $body.toggleClass('collapsed');
    });

    // Navigation
    $('[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: $($(this).attr('href')).offset().top - menuHeight - 44
        }, 250);
    });

})(jQuery);