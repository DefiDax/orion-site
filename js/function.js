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
    toggleMobileNav();
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
    var defaultTitle = $('.product .section__title').text();
    var defaultText = $('.product__text').text();
    var title, text;

    toggl.on('mouseenter', function() {
        title = $(this).text();
        text = $(this).data('text');
        setTemplate(title, text);
    });

    toggl.on('mouseleave', function() {
    // $('.product__content').on('mouseleave', function() {
        setTemplate(defaultTitle, defaultText);
    });

    function setTemplate(title, text) {
        var template = `<h2 class="section__title">`+title+`</h2>
        <div class="product__text">`+text+`</div>`;
        // console.log(template);
        wrap.html(template);
    }
}
showProductDescription();

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
