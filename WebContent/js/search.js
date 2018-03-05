'use strict';
var jsonarr = new Array();
$(function() {
    var option = "",
        search = "";
    option = getQueryString("option");
    search = getQueryString("search");
    console.log("option" + option);
    console.log("search" + search);



    $('.opt a').click(function() {
        // var tr = $('.hide').html();
        // $('.itembox').prepend(tr);
        $(".itembox li").remove();
        var category = $(this).parent().parent().attr("id");
        var option = $(this).text();
        var arr = {
            "category": category,
            "option": option
        }
        var i = 0;
        if ($(this).attr("class") === "selected") {
            $(this).removeClass("selected");
            $(this).parents(".opt").removeClass("divselected");
            $(this).siblings().show();
            for (i; i < jsonarr.length; i++) {
                if (jsonarr[i].category === category)
                    jsonarr.splice(i, 1); //删除此筛选条件
            }

        } else {
            $(this).parents(".opt").addClass("divselected");
            $(this).attr("class", "selected"); //app css:selecte
            $(this).siblings().hide();
            jsonarr.push(arr);
        };

        console.log(JSON.stringify(jsonarr));
        ajaxpost();

    });
    if (option === null && search === null) { //未接受参数
        ajaxpost();
    } else if (search !== null) {
        var i = 0;
        $(".result span").text("搜索:" + search);
        $(".result a").click(function() {
            for (i; i < jsonarr.length; i++) {
                if (jsonarr[i].category === "description")
                    jsonarr.splice(i, 1); //删除此筛选条件
            }
            $(".result span:last").remove();
            $(".result a").remove();
            $(".result").text("全部结果>>")

            ajaxpost();
        });
        var arr = {
            "category": "description",
            "option": search
        }
        jsonarr.push(arr);
        ajaxpost();

    } else {
        $("#productname a[name='" + option + "']").click();

    }
    // 
    $(".tool-left a").click(function() {
        var t = $(this);
        if (t.attr("class") === "order_active") {
            t.removeClass("order_active");
            ajaxpost();
        } else {
            $(".tool-left").find("a").removeClass("order_active");
            t.addClass("order_active");
            $.ajax({
                type: "POST",
                url: "/Lenovo/postinorder",
                data: {
                    "jsonstr": JSON.stringify(jsonarr)
                },
                async: true,
                success: function(data) {
                    console.log("POST的数据为：" + JSON.stringify(jsonarr));
                    console.log("返回的数据为：" + data);
                    var
                        i,
                        obj = JSON.parse(data); //解析json
                    // console.log("POST的数据为" + $form.serialize());
                    // console.log("json内容为" + data);
                    $('.amount span').text(obj.length);

                    if (parseInt(obj.length) === 0) {
                        $('.item-null').show();
                    } else {
                        $('.item-null').hide();
                    }
                    console.log(obj.length);
                    $(".itembox li").remove();
                    var tr = $('.hide').html();
                    if (t.attr("id") === "order") {
                        for (i = 0; i < obj.length; i++) {
                            $('.itembox').prepend(tr);
                            $('.itembox .item-img:first img').attr("src", obj[i].pic1);
                            $('.itembox li:first .productname').text(obj[i].productname);
                            $('.itembox li:first .productid').text(obj[i].productid);
                            $('.itembox li:first .productinfo').text(obj[i].description);
                            $('.itembox li:first .item-price span').text(obj[i].unitprice);
                            $('.itembox li:first').find("a").click(function() {
                                window.location.href = "/Lenovo/product.html?productid=" + $(this).parents("li").find(".productid").text();
                            });
                        }
                    }
                    if (t.attr("id") === "revorder") {
                        for (i = 0; i < obj.length; i++) {
                            $('.itembox').append(tr);
                            $('.itembox .item-img:last img').attr("src", obj[i].pic1);
                            $('.itembox li:last .productname').text(obj[i].productname);
                            $('.itembox li:last .productid').text(obj[i].productid);
                            $('.itembox li:last .productinfo').text(obj[i].description);
                            $('.itembox li:last .item-price span').text(obj[i].unitprice);
                            $('.itembox li:last').find("a").click(function() {
                                window.location.href = "/Lenovo/product.html?productid=" + $(this).parents("li").find(".productid").text();
                            });
                        }



                    };

                },
                error: function() {
                    console.log("与服务器连接失败！");
                    return false;
                },
            });

        }



    });

}); //准备函数结束

var ajaxpost = function() {
    $.ajax({
        type: "POST",
        url: "/Lenovo/postsearch",
        data: {
            "jsonstr": JSON.stringify(jsonarr)
        },
        async: true,
        success: function(data) {
            console.log("POST的数据为" + JSON.stringify(jsonarr));
            console.log(data);
            var
                i,
                obj = JSON.parse(data); //解析json
            // console.log("POST的数据为" + $form.serialize());
            // console.log("json内容为" + data);
            $('.amount span').text(obj.length);

            if (parseInt(obj.length) === 0) {
                $('.item-null').show();
            } else {
                $('.item-null').hide();
            }
            console.log(obj.length);
            $(".itembox li").remove();
            var tr = $('.hide').html();
            for (i = 0; i < obj.length; i++) {
                $('.itembox').prepend(tr);
                $('.itembox .item-img:first img').attr("src", obj[i].pic1);
                $('.itembox li:first .productname').text(obj[i].productname);
                $('.itembox li:first .productid').text(obj[i].productid);
                $('.itembox li:first .productinfo').text(obj[i].description);
                $('.itembox li:first .item-price span').text(obj[i].unitprice);
                $('.itembox li:first').find("a").click(function() {
                    window.location.href = "/Lenovo/product.html?productid=" + $(this).parents("li").find(".productid").text();
                });

            };

        },
        error: function() {
            console.log("与服务器连接失败！");
            return false;
        },
    });
};

function getQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
};

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};