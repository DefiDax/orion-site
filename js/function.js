/*!
 *
 * Evgeniy Ivanov - 2018
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var TempApp = {
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= TempApp.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= TempApp.mdWidth && $(window).width() < TempApp.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= TempApp.smWidth && $(window).width() < TempApp.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < TempApp.smWidth; } // < 768
function isIOS() { return TempApp.iOS(); } // for iPhone iPad iPod
function isTouch() { return TempApp.touchDevice(); } // for touch device


$(document).ready(function() {
    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	// Запрет "отскока" страницы при клике по пустой ссылке с href="#"
	$('[href="#"]').click(function(event) {
		event.preventDefault();
	});

    // Inputmask.js
    // $('[name=tel]').inputmask("+9(999)999 99 99",{ showMaskOnHover: false });
    // formSubmit();

    checkOnResize();

    $('.team__more').on('click', function() {
        var wrap = $(this).closest('.team__item');
        wrap.toggleClass('more');

        if (wrap.hasClass('more')) {
            $(this).text($(this).data('less'));
        } else {
            $(this).text($(this).data('more'));
        }
    });

    toggleMobileNav();

    $('select').select2();


});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (TempApp.resized == windowWidth) { return; }
    TempApp.resized = windowWidth;

	checkOnResize();
});

function checkOnResize() {
    // fontResize();
}

function toggleMobileNav() {
    var toggle = $('.navbar__toggle');
    var wrapp = $('.header__group');

    if (isXsWidth) {
        toggle.on('click', function() {
            $(this).toggleClass('active');
            wrapp.toggleClass('open');
        });

        $('.navbar__link').on('click', function() {
            wrapp.removeClass('open');
            toggle.removeClass('active');
        });
    }
}

function showProductDescription() {
    var toggl = $('.product__name');
    var wrap = $('.product__change');
    var action = $('.product__action');
    var defaultTitle = $('.product .section__title').text();
    var defaultText = $('.product__text').text();
    var defaultAction = action.find('a').data('target');
    var title, text, url;

    toggl.click(function() {
        toggl.not(this).removeClass("highlight");
        $(this).toggleClass("highlight");
        if ($(this).is(".highlight")) {
            title = $(this).text();
            text = $(this).data('text');
            url = $(this).data('url');
            setTemplate(title, text, url);
        } else {
            setTemplate(defaultTitle, defaultText, null);
        }
    });
    /*toggl.on('mouseenter', function() {
        title = $(this).text();
        text = $(this).data('text');
        setTemplate(title, text);
    })

    toggl.on('mouseleave', function() {
    // $('.product__content').on('mouseleave', function() {
        setTemplate(defaultTitle, defaultText);
    });*/

    function setTemplate(title, text, url) {
        var template = `<h2 class="section__title">`+title+`</h2>
        <div class="product__text">`+text+`</div>`;
        // console.log(template);
        wrap.html(template);

        var actionBtn;
        if (!url) {
            actionBtn = `<a class="btn" href="#" data-toggle="modal" data-target="#forInvestors" target="_blank">Learn More</a>`;
        } else if (url.startsWith("#")) {
            actionBtn = '';
        } else {
            actionBtn = `<a class="btn" href="${url}" target="_blank">Learn More</a>`;
        }
        action.html(actionBtn);
    }
}
// showProductDescription();

// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
function srollToId() {
    $('[data-scroll-to]').click( function(){
        var scroll_el = $(this).attr('href');
        if ($(scroll_el).length != 0) {
            $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
        }
        return false;
    });
}

function startSlider() {
    var product = $('#defi').offset().top - 150;
    var pScroll = $(window).scrollTop();
    var slider = $('.product__slider');

    if (!slider.hasClass('slick-initialized')) {
        slider.slick({
            arrows: false,
            pauseOnFocus: false,
            pauseOnHover: false,
            // adaptiveHeight: true,
            dots: true,
            autoplay: false,
            autoplaySpeed: 6000,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        // adaptiveHeight: true,
                        // arrows: true,
                        // dots: true,
                    }
                }
            ]
        });
    }
    if (pScroll > product) {
        if (!slider.hasClass('started')) {
            // console.log('start');
            slider
                .slick('setPosition', 0)
                .addClass('started');
                if (!isXsWidth()) {
                    slider
                        .slick('slickSetOption', {'autoplay': true}, true);
                }
        }
    }
}

startSlider();
$(window).scroll(function() {
    startSlider();
});


// Простая проверка форм на заполненность и отправка аяксом
function formSubmit() {
    $("[type=submit]").on('click keypress', function (e){
        e.preventDefault();
        var btn = $(this);
        var form = $(this).closest('.form');
        var antispam = form.find('.ja_antispam');
        var url = form.attr('action');
        var form_data = form.serialize();
        var rezult = $(this).closest('.modal').find('.form__rezult');
        var field = form.find('[required]');
        var checkEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        // console.log(form_data);

        antispam.val('No bot');

        empty = 0;

        field.each(function() {
            if ($(this).val() == "") {
                $(this).addClass('invalid');
                $(this).removeClass('valid');
                // return false;
                empty++;
            } else {
                // console.log($(this).attr('type'));
                if ($(this).attr('type') === 'email') {
                    // console.log($(this).val());
                    if (checkEmail.test($(this).val())) {
                        $(this).removeClass('invalid');
                        $(this).addClass('valid');
                    } else {
                        $(this).addClass('invalid');
                        $(this).removeClass('valid');
                        empty++;
                    }
                } else {
                    $(this).removeClass('invalid');
                    $(this).addClass('valid');
                }
            }
        });

        // console.log(empty);

        if (empty > 0) {
            return false;
        } else {
            if (antispam.val()) {
                $.ajax({
                    url: url,
                    type: "POST",
                    dataType: "xml",
                    data: form_data,
                }).always(function() {
                    // alert( "complete" );
                    // console.log($(this));
                    btn.attr('disabled', 'disabled');
                    rezult.html('Your message has been sent!');
                });
            } else {
                console.log('spam');
            }
        }

    });

    $('[required]').on('blur change', function() {
        if ($(this).val() != '') {
            $(this).removeClass('invalid');
        }
    });

    $('.form__privacy input').on('change', function(event) {
        event.preventDefault();
        var btn = $(this).closest('.form').find('.btn');
        if ($(this).prop('checked')) {
            btn.removeAttr('disabled');
            // console.log('checked');
        } else {
            btn.attr('disabled', true);
        }
    });

    $('.js_other_trigger').on('change', function() {
        var field = $('.js_other');
        if ($(this).prop('checked')) {
            field.attr('type', 'text');
        } else {
            field.attr('type', 'hidden').val('');
        }
    })
}

formSubmit();
