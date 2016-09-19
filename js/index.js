$(window).load(function(){
	// Initialize portfolio masonry
	$('.cards').masonry({
		itemSelector       : '.card',
		transitionDuration : 0
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
			scrollTop : $($(this).attr('href')).offset().top - menuHeight - 44
		}, 250);
	});
	
	
	
	// Contact form
	function validateEmail(email) { return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(email); }
	function validateField(val){ return val.length > 0; }
	function validate($field){
		var $ct = $field.parent(),
			val = $field.val();
		
		val.length ? $ct.addClass('completed') : $ct.removeClass('completed');
		
		if($field.is('[required]')){
			var isValid = $field.is('[type="email"]') ? validateEmail(val) : validateField(val);
			$ct.attr("data-isvalid", isValid);
		} else {
			val.length ? $ct.attr("data-isvalid", "true") : $ct.removeAttr("data-isvalid");
		}
	}
	
	$('input,textarea').on('blur change input', function () {
		validate($(this));
	});
	
	$('form.contact').on('submit', function(e){
		e.preventDefault();
		
		var $form = $(this),
		    $submit = $('#submitform');
		
		$('.message').removeClass('shown');
		
		$.each($('input,textarea'), function(){
			validate($(this));
		});
		
		if($('[data-isvalid="false"]').length){
			$('html,body').animate({
				scrollTop : $('[data-isvalid="false"]').first().offset().top - 150
			}, 250);
			
			return false;
		}
		
		$submit.prop('disabled', true);
		
		$.ajax({
			method : "POST",
			url    : "http://codrin.eu/utils/sendmail.php",
			data   : {
				first_name   : $('[name=first_name]').val(), 
				last_name    : $('[name=last_name]').val(),
				email        : $('[name=email]').val(),
				company_name : $('[name=company_name]').val(),
				message      : $('[name=message]').val()
			}
		})
		.done(function( msg ) {
			setTimeout(function(){
				$submit.prop('disabled', false);
				if(msg == 1){
					$form[0].reset();
					$('.field').removeClass('completed').removeAttr('data-isvalid');
					$('.message_success').addClass('shown');
				} else {
					$('.message_error').addClass('shown');
				}
			}, 2000);
		});
	});
})(jQuery);