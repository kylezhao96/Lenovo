'use strict';
// 初始化
$(function() {
    $(window).scroll(function() {
        var this_scrollTop = $(this).scrollTop();
        if (this_scrollTop > ($('.floor_1').offset().top - 1)) {
            $(".up").show();
        }
        if (this_scrollTop == 0) {
            $(".up").hide();
        }
    });

    $(".floor_1-title a").click(function() {
        window.location.href = "/Lenovo/search.html?option=Lenovo";
    });
    $(".floor_2-title a").click(function() {
        window.location.href = "/Lenovo/search.html?option=ThinkPad";
    });
    $(".floor_3-title a").click(function() {
        window.location.href = "/Lenovo/search.html?option=Yoga";
    });
    $(".floor_4-title a").click(function() {
        window.location.href = "/Lenovo/search.html?option=MIIX";
    });




    $('.selectbox_left a').click(function() {
        if ($(this).parent().attr("id") === "le") {
            $("html,body").animate({ scrollTop: $('.floor_1').offset().top }, 1000);
        }
        if ($(this).parent().attr("id") === "th") {
            $("html,body").animate({ scrollTop: $('.floor_2').offset().top }, 1000);
        }
        if ($(this).parent().attr("id") === "yo") {
            $("html,body").animate({ scrollTop: $('.floor_3').offset().top }, 1000);
        }
        if ($(this).parent().attr("id") === "mi") {
            $("html,body").animate({ scrollTop: $('.floor_4').offset().top }, 1000);
        }
    });

    $(".up").click(function() {
        $("html,body").animate({ scrollTop: 0 }, 1000);
    });
    $('.button_close').click(function() {
        $('.banner').fadeToggle();
        $('.header').animate({ height: '27px' });
    })

    $('.menu_list dd a').click(function() {
        window.location.href = "/Lenovo/search.html?option=" + $(this).text();
    });

    $('.item a').click(function() {
        window.location.href = "/Lenovo/product.html?productid=" + $(this).find(".item-id").text();
    });
    $(".floor_1-ad a").click(function() {
        window.location.href = "/Lenovo/product.html?productid=潮7000";
    });
    $(".floor_2-ad a").click(function() {
        window.location.href = "/Lenovo/product.html?productid=New S2";
    });
    $(".floor_3-ad a").click(function() {
        window.location.href = "/Lenovo/product.html?productid=5 Pro";
    });
    $(".selectbox_mid").click(function() {
        window.location.href = "/Lenovo/product.html?productid=5 Pro";
    });


});