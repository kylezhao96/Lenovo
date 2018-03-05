'use strict';
$(function() {
    $('.header-un').click(function() {
        $('.logout').toggle();
        console.log("弹出退出登录");
    });
    $(".searchbutton").click(function() {
        var search = $(".searchbox").val();
        if ($(".searchbox").val == '') {
            return false;
        }
        window.location.href = "/Lenovo/search.html?search=" + search;
    });
    $(".searchbox").focus(function() {
        $(document).keydown(function(e) {
            if (e.keyCode == 13) {
                $(".searchbutton").click();
            }
        });
    });

});