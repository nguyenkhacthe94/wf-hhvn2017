/**********Script tự định nghĩa*******/
var create_js = (function(){
    return {

    };
})();
/******************Các hàm tiện ích****************/
var js_fw = (function() {
    'use strict';
    return {
        go_element: go_element,                   // Tự động cuộn tới đối tượng chỉ định
        go_top: go_top,                           // Tự động cuộn lên trên
        open_popup: open_popup,                   // Xử lý tất cả popup
        setImage: setImage
    };

    function go_element(element, delay, verticalOffset) {
        var offset = $(element).offset(),
        offsetTop = offset.top + verticalOffset;

        delay = typeof(delay) !== 'undefined' ? delay : 1000;
        verticalOffset = typeof(verticalOffset) !== 'undefined' ? verticalOffset : 0;
        
        $('html,body').animate({ scrollTop: offsetTop }, delay);
    }

    function go_top(delay) {
        delay = typeof(delay) !== 'undefined' ? delay : 1000;
        $('html,body').animate({ scrollTop: 0 }, delay);
    }

    function open_popup(params) {
        if (typeof($.magnificPopup) === 'undefined') {
            alert('popup: magnificPopup not found!');
            return false;
        } else {
            var o = $.extend({
                rel: '',
                type: 'inline',
                width: 800,
                removeDelay: 300,
                closeOnBg: true,
                enableEscapeKey: true,
                alignTop: false,
                showCloseBtn: true,
                closeBtnInside: true,
                effect: 'fromTop',
                overflowY: 'auto',
                fixedBgPos: 'fixed',
                index: null,
                beforeOpen: function() {
                    this.st.mainClass = o.effect;
                },
                open: function() {},
                beforeClose: function() {},
                close: function() {},
                afterClose: function() {}
            }, params);
            var $element = $(o.rel);
            if ($element.length > 0) {
                $element.css({
                    maxWidth: o.width
                });
                $.magnificPopup.open({
                    removalDelay: o.removeDelay,
                    enableEscapeKey: o.enableEscapeKey,
                    alignTop: o.alignTop,
                    overflowY: o.overflowY,
                    fixedBgPos: o.fixedBgPos,
                    showCloseBtn: o.showCloseBtn,
                    closeBtnInside: o.closeBtnInside,
                    closeOnBgClick: o.closeOnBg,
                    index: o.index,
                    callbacks: {
                        beforeOpen: o.beforeOpen,
                        open: o.open,
                        beforeClose: o.beforeClose,
                        close: o.close,
                        afterClose: o.afterClose
                    },
                    items: {
                        src: o.rel,
                        type: 'inline'
                    }
                });
            } else {
                alert('popup: rel not found!');
                return false;
            }
        }
    }

    function setImage(elementData,elementImage){
        elementData.each(function(){
            var dataImg = $(this).attr('data-img');

            $(this).find(elementImage).attr('style','background-image:url(\''+dataImg+'\')');
        });
    }
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-banner-slide');

	$(document).ready(function(){
		slideShow();
		setImage();
		setHeight();
	});

	$(window).resize(function(){
		setHeight();
	});

	function setHeight() {
		var heightTop = $('#mdl-top-head').outerHeight();
		var mdlHeight = window.innerHeight - heightTop;
		if (window.innerHeight / window.innerWidth > 600 / 650 && window.innerWidth < 700) {
		    $('body').addClass('height-window');
		    mdlHeight = mdlHeight * 150 / 100;
		}
		else
		    $('body').removeClass('height-window');

		var maxMdlHeight;
		var minMdlHeight;
		if (window.innerWidth >= 700)
		    maxMdlHeight = window.innerWidth * (890 / 1280);
		else {
		    //maxMdlHeight = window.innerWidth * (820 / 360);
		    maxMdlHeight = window.innerHeight - heightTop;
		    minMdlHeight = window.innerWidth * (489 / 320);
		}

		if (mdlHeight > maxMdlHeight)
		    mdlHeight = maxMdlHeight;

		//if (mdlHeight < minMdlHeight)
		//    mdlHeight = minMdlHeight;
		mdl.height(mdlHeight);
	}

	function setImage(){
		var dataImg = mdl.find('.item');
		var img = dataImg.find('.img');

		js_fw.setImage(dataImg,img);
	}

	function slideShow(){
		mdl.slick({
			speed: 2000,
			autoplay: true,
			fade: true,
			dots:false
		});
		$('.slick-arrow,.slick-dots button').empty();
	}
	
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-top-head');

	$(document).ready(function(){
		toggleSearch();
	});

	function toggleSearch(){
		var btnShowInput = mdl.find('.wrap-search .show-input'),
		wrapinput = mdl.find('.wrap-search .wrap-input'),
		input = wrapinput.find('.gsc-search-box-tools .gsc-search-box input.gsc-input'),
		searchLocation = mdl.find('.wrap-search .location'),
		searchResults = wrapinput.find('.gsc-results-wrapper-overlay');

		var subUser = $('.wrap-user .wrap-sub-user');

		btnShowInput.on('click',function(e){
			e.preventDefault();
			$(this).hide();
			searchLocation.css({display:'block'});
			searchLocation.addClass('is-open');
			wrapinput.css({display:'block'});
		});

		$(window).on('click', function (evented) {
		    if (input.length === 0)
		        input = wrapinput.find('.gsc-search-box-tools .gsc-search-box input.gsc-input');
		    if (searchResults.length === 0)
		        searchResults = wrapinput.find('.gsc-results-wrapper-overlay');
		    if (!searchLocation.is(evented.target) && !btnShowInput.is(evented.target) && !wrapinput.is(evented.target) && !input.is(evented.target) && !searchResults.has(evented.target).length && !searchResults.is(evented.target)) {
				if(searchLocation.hasClass('is-open')){
					searchLocation.removeClass('is-open');
					searchLocation.hide();
					btnShowInput.css({display:'block'});
					wrapinput.css({display:'none'});
				}
			}
		});
	}
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-menu');
	var menuHome = $('#home-page #mdl-menu');
	var menuInsidePage = $('#inside-page #mdl-menu');
	var limit;

	$(document).ready(function(){
		setImageUser();
		toggleSub();
		scrollMenuHome();
		scrollMenuPageInside();
		toggleMenuMb();
		setWidth();
		getScrollTopHeight();
	});

	$(window).resize(function(){
	    setWidth();
	    getScrollTopHeight();
	});

	function getScrollTopHeight() {
	    if (mdl.length > 0)
	        limit = mdl.offset().top;
	    else if (menuHome.length > 0)
	        limit = menuHome.offset().top;
	    else if (menuInsidePage.length > 0)
	        limit = menuInsidePage.offset().top;
	    else
	        limit = 0;
	};

	function setImageUser(){
		var wrapUser = $('.logined');

		wrapUser.each(function(){
			var dataImg = $(this).attr('data-img');

			$(this).find('.user').attr('style',"background-image:url('"+dataImg+"')");
		});
	}

	function toggleSub(){
		var imageUser = $('.logined .user'),
		subUser = $('.logined .wrap-sub-user');

		imageUser.on('click',function(e){
			e.preventDefault();
			if($(this).hasClass('is-open')){
				$(this).removeClass('is-open');
				$(this).addClass('is-close');
				subUser.css({
					visibility:'hidden',
					opacity:0
				});
			}
			else{
				$(this).addClass('is-open');
				$(this).removeClass('is-close');
				subUser.css({
					visibility:'visible',
					opacity:1
				});
			}
		});

		subUser.on('mouseleave',function(){
			imageUser.addClass('is-close');
			imageUser.removeClass('is-open');
			$(this).css({
				visibility:'hidden',
				opacity:0
			});
		});
	}

	function scrollMenuHome(){
		//var heightBanner = $('#mdl-banner-slide').outerHeight();
	    //var limit = heightBanner /100*85;

		$(window).scroll(function () {
			if ($(this).scrollTop() > limit) {
				menuHome.addClass('fixed');
				$('#mdl-home').css({
					'margin-top':'-17%'
				});
			} else {
				menuHome.removeClass('fixed');
				$('#mdl-home').css({
					'margin-top':0
				});
			}
		});

		$(window).each(function () {
			if ($(this).scrollTop() > limit) {
				menuHome.addClass('fixed');
				$('#mdl-home').css({
					'margin-top':'-17%'
				});
			} else {
				menuHome.removeClass('fixed');
				$('#mdl-home').css({
					'margin-top':0
				});
			}
		});
	}

	function scrollMenuPageInside(){
		//var heightTop = $('#mdl-top-head').outerHeight();

		$(window).scroll(function () {
		    if ($(this).scrollTop() > limit) {
				menuInsidePage.addClass('fixed');
			} else {
				menuInsidePage.removeClass('fixed');
			}
		});

		$(window).each(function () {
		    if ($(this).scrollTop() > limit) {
				menuInsidePage.addClass('fixed');
			} else {
				menuInsidePage.removeClass('fixed');
			}
		});
	}

	function toggleMenuMb(){
		var iconMenu = $('#mdl-menu #nav-icon');

		iconMenu.on('click',function(){
			if($(this).hasClass('is-open')){
				$(this).removeClass('is-open');
				$(this).parent('.wrap-nav-icon').next('.menu').slideUp();
			}else{
				$(this).addClass('is-open');
				$(this).parent('.wrap-nav-icon').next('.menu').slideDown();
			}
		});
	}

	function setWidth(){
		var widthCurrent = mdl.find('.wrap-nav-icon').outerWidth();

		if($(window).width() < 768){
		    mdl.find('.menu').outerWidth(widthCurrent);
		}else{
			mdl.find('.menu').width('');
		}
	}
	
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-home');

	$(document).ready(function(){
		setImage();
		toggleClip();
		slide();
		setHeightBoxTextAbout();
		slideAbout();
		$('.slick-dots button').empty();
		$('button.slick-arrow').empty();
	});

	$(window).resize(function(){
		setHeightBoxTextAbout();
		$('.slick-dots button').empty();
		$('button.slick-arrow').empty();
	});

	function setImage(){
		var dataImg = mdl.find('.col');
		var img = dataImg.find('.img');

		js_fw.setImage(dataImg,img);
	}

	function toggleClip(){
		var btnArr = mdl.find('.box-video .btn-arr'),
		lineVideoBot = mdl.find('.box-video .line-bot');

		btnArr.on('click',function(){
			if($(this).hasClass('is-open')){
				$(this).removeClass('is-open');
				$(this).removeClass('arr-hide-video');
				$(this).addClass('arr-show-video');
				lineVideoBot.slideUp();
				lineVideoBot.slick('unslick');
			}else{
				$(this).addClass('is-open');
				$(this).addClass('arr-hide-video');
				$(this).removeClass('arr-show-video');
				lineVideoBot.slideDown();
				lineVideoBot.slick({
					slidesToShow:3,
					slideScroll:1,
					speed: 1000,
					autoplay: true,
					dots:false,
					arrows: true,
					responsive: [
					{
						breakpoint: 600,
						settings: {
							slidesToShow:2
						}
					},
					{
						breakpoint: 400,
						settings: {
							slidesToShow:1
						}
					}
					]
				});
			}
		});
	}

	function slide(){
		var slideMain = mdl.find('.finalists .slide-finalists');
		var slideRes = mdl.find('.clips .line-show');
		var slideHots = mdl.find('#box-info-and-news .hots .box');
		var slideJudges = mdl.find('#box-info-and-news .judges .box');
		var slideTreeElement = mdl.find('#box-info-and-news .performance .box');
		var slideNews = mdl.find('#box-info-and-news .latest-updates .box,#box-info-and-news .news .box');
		var slideCandidate = mdl.find('#box-info-and-news .contestants .box');

		slideMain.slick({
			slidesToShow:3,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:true,
			arrows: true,
			responsive: [
			{
				breakpoint: 600,
				settings: {
					slidesToShow:2
				}
			},
			{
				breakpoint: 400,
				settings: {
					slidesToShow:1
				}
			}
			]
		});

		slideRes.slick({
			slidesToShow:3,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:false,
			arrows: true,
			responsive: [
			{
				breakpoint: 600,
				settings: {
					slidesToShow:2
				}
			},
			{
				breakpoint: 400,
				settings: {
					slidesToShow:1
				}
			}
			]
		});

		slideHots.slick({
			slidesToShow:3,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:false,
			arrows: true,
			responsive: [
			{
				breakpoint: 768,
				settings: {
					slidesToShow:2
				}
			},
			{
				breakpoint: 560,
				settings: {
					slidesToShow:1
				}
			}
			]
		});

		slideJudges.slick({
			slidesToShow:4,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:false,
			arrows: true,
			responsive: [
			{
			    breakpoint: 768,
			    settings: {
			        slidesToShow: 2
			    }
			},
			{
			    breakpoint: 560,
			    settings: {
			        slidesToShow: 1
			    }
			}
			]
		});

		slideTreeElement.slick({
			slidesToShow:3,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:false,
			arrows: true,
			responsive: [
			{
			    breakpoint: 768,
			    settings: {
			        slidesToShow: 2
			    }
			},
			{
			    breakpoint: 560,
			    settings: {
			        slidesToShow: 1
			    }
			}
			]
		});

		slideCandidate.slick({
		    slidesToShow: 4,
		    slidesToScroll: 4,
		    speed: 1000,
		    autoplay: true,
		    dots: false,
		    arrows: true,
		    responsive: [
			{
			    breakpoint: 768,
			    settings: {
			        slidesToShow: 3,
			        slidesToScroll: 3
			    }
			},
			{
			    breakpoint: 560,
			    settings: {
			        slidesToShow: 2,
			        slidesToScroll: 2
			    }
			},
			{
			    breakpoint: 420,
			    settings: {
			        slidesToShow: 1,
			        slidesToScroll: 1
			    }
			}
		    ]
		});

		slideNews.slick({
			slidesToShow:3,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:false,
			arrows: true,
			responsive: [
			{
			    breakpoint: 768,
			    settings: {
			        slidesToShow: 2
			    }
			},
			{
			    breakpoint: 560,
			    settings: {
			        slidesToShow: 1
			    }
			}
			]
		});
	}

	function setHeightBoxTextAbout(){
		var heightCurrent = mdl.find('.introduce .left').outerHeight();

		if($(window).width() > 767){
			mdl.find('.introduce .right').height(heightCurrent);
		}else{
			mdl.find('.introduce .right').height('');
		}
	}

	function slideAbout(){
		mdl.find('.introduce .slide-about').slick({
			slidesToShow:1,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:true,
			arrows: true
		});
	}
	
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-sponsors');

	$(document).ready(function(){
		slideSponsors();
	});

	function slideSponsors() {
		mdl.find('.list-sponsors').slick({
			slidesToShow:6,
			slideScroll:1,
			autoplay: true,
			dots:false,
			arrows:true,
			responsive: [
			{
				breakpoint: 600,
				settings: {
					slidesToShow:5
				}
			},
			{
				breakpoint: 500,
				settings: {
					slidesToShow:4
				}
			},
			{
				breakpoint: 400,
				settings: {
					slidesToShow:3
				}
			},
			{
				breakpoint: 320,
				settings: {
					slidesToShow:2
				}
			}
			]
		});
		$('button.slick-arrow').empty();
	}
	
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-contestants');

	$(document).ready(function(){
		setImage();
		slide();
	});

	function setImage(){
		var dataImg = mdl.find('.slide a');
		var img = dataImg.find('.img');

		js_fw.setImage(dataImg,img);
	}

	function slide(){
		var slide = mdl.find('.wrap-slide .slide');
		var eliminated = mdl.find('.wrap-slide.eliminated .slide');

		slide.slick({
			slidesToShow:1,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:false,
			arrows:true
		});
		eliminated.slick("unslick");
		$('.slick-arrow').empty();
	}
	
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-contestant-detail');
	
	$(document).ready(function(){
		setImageSlide();
		setImageVideo();
		slide();
	});

	function setImageSlide(){
		var dataImg = mdl.find('.slide a');
		var img = dataImg.find('.img');

		js_fw.setImage(dataImg,img);
	}

	function setImageVideo(){
		var dataImg = mdl.find('.col');
		var img = dataImg.find('.img');

		js_fw.setImage(dataImg,img);
	}

	function slide(){
		var slide = mdl.find('.wrap-slide .slide');
		var eliminated = mdl.find('.wrap-slide.eliminated .slide');
		var boxVideo = mdl.find('.videos .left');

		slide.slick({
			slidesToShow:1,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:false,
			arrows:true
		});
		eliminated.slick("unslick");

		boxVideo.slick({
			slidesToShow:2,
			slideScroll:1,
			speed: 1000,
			autoplay: true,
			dots:false,
			arrows:true,
			responsive: [
			{
				breakpoint: 400,
				settings: {
					slidesToShow:1
				}
			}
			]
		});

		$('.slick-arrow').empty();
	}

})();
;(function(){

	'use strict';
	var mdl = $('#mdl-news');

	$(document).ready(function(){
		slideShow();
		setImage();
	});

	function setImage(){
		var dataImg = mdl.find('.item-slide');
		var img = dataImg.find('.img');

		js_fw.setImage(dataImg,img);
	}

	function slideShow(){
		mdl.find('.slide-news').slick({
			autoplay: true,
			dots:false,
			arrows:true
		});
		$('.slick-arrow,.slick-dots button').empty();
	}
	
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-photo-detail');

	$(document).ready(function(){
		galleryImg();
		hoverImg();
		galleryPop();
		slideAlbumFellow();
	});

	function galleryImg(){
		mdl.find('.gallery').pinto();
	}

	function hoverImg(){
		var gallery = mdl.find('.gallery'),
		pinto = mdl.find('.pinto');

		pinto.on('mouseover',function(){
			pinto.find('.bg').css({opacity:1,visibility:'visible'});
			pinto.addClass('is-open');
			$(this).find('.bg').css({opacity:0,visibility:'hidden'});
		});

		$(window).on('mouseover',function(evented){
			if(!gallery.is(evented.target) && !gallery.has(evented.target).length){
				if(pinto.hasClass('is-open')){
					pinto.removeClass('is-open');
					pinto.find('.bg').css({opacity:0,visibility:'hidden'});
				}
			}
		});
	}

	function galleryPop(){
		mdl.find('.gallery').magnificPopup({
			delegate: 'a',
			mainClass: 'mfp-with-zoom',
			type: 'image',
			gallery:{
				enabled:true
			},
			zoom: {
				enabled: true,
				duration: 300,
				opener: function(element) {
					return element.find('div');
				}
			}
		});
	}

	function slideAlbumFellow(){
		mdl.find('.group-fellow').slick({
			slidesToShow: 5,
			slidesToScroll: 1,
			arrows: true,
			autoplay:true,
			responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
			]
		})
		$('.slick-arrow').empty();
	}
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-video');

	$(document).ready(function(){
		setImage();
	});

	function setImage(){
		var dataImg = mdl.find('.box .col');
		var img = dataImg.find('.img');

		js_fw.setImage(dataImg,img);
	}
	
})();
;(function(){

	'use strict';
	var mdl = $('#mdl-video-detail');

	$(document).ready(function(){
		slideVideoFellow();
		setImageVideo();
	});

	function slideVideoFellow(){
		mdl.find('.group-fellow').slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			arrows: true,
			autoplay:true,
			responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
			]
		})
		$('.slick-arrow').empty();
	}

	function setImageVideo(){
		var dataImg = mdl.find('.group-fellow .col');
		var img = dataImg.find('.img');

		js_fw.setImage(dataImg,img);
	}
})();
;(function(){

	'use strict';
	var mdl = $('#pop-user');

	$(document).ready(function(){
		nextPopRegis();
		nextPopLogin();
		complete();
	});

	function nextPopRegis(){
		mdl.find('#pop-login .text-bot a').on('click',function(e){
			e.preventDefault();
			$(this).closest('#pop-login').css({
				display:'none'
			});
			mdl.find('#pop-register').css({
				display:'block'
			});
		});
	}

	function nextPopLogin(){
		mdl.find('#pop-register .text-bot a').on('click',function(e){
			e.preventDefault();
			$(this).closest('#pop-register').css({
				display:'none'
			});
			mdl.find('#pop-login').css({
				display:'block'
			});
		});
	}

	function complete(){
		mdl.find('#pop-register .btn-regis').on('click',function(e){
			e.preventDefault();
			$(this).closest('.wrap-enter').css({
				display:'none'
			});

			mdl.find('.wrap-complete').css({
				display:'block'
			});
			mdl.find('.wrap-complete .btn-ok').addClass('mfp-close');
			mdl.find('button.mfp-close').css({display:'none'});
		});
	}

})();
;(function(){

	'use strict';
	var mdl = $('#mdl-footer');

	$(document).ready(function(){
		setHeightEFooter();
	});

	$(window).resize(function(){
		setHeightEFooter();
	});

	function setHeightEFooter(){
		var heigthCurrent = mdl.find('.left').outerHeight();

		if($(window).width() > 768){
			mdl.find('.between,.right').height(heigthCurrent);
		}else{
			mdl.find('.between,.right').height('');
		}
	}
	
})();