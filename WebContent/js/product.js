'use strict'
$(function() {
    var productid = GetQueryString("productid"),
        conf = $('.hide').html();
    console.log(productid);
    var na = $('#name'),
        em = $('#email'),
        po = $('#postcode'),
        ad = $('#address');

    po.change(function() {
        po.off('focus', postcodeFlush);
    });
    po.blur(function() {
        if (po.val() === "") {
            po.val(' 请在这里输入邮编');
            po.on('focus', postcodeFlush);
            // console.log('重新绑定！');
        } else {
            po.off('focus', postcodeFlush);
            // console.log('解绑成功！');
        }

    }); //判断输入框是否输入文字，如果输入，则不出现默认文字，否则出现

    na.change(function() {
        na.off('focus', nameFlush);
    });
    na.blur(function() {
        if (na.val() === "") {
            na.val(' 请在这里输入姓名');
            na.on('focus', nameFlush);
            // console.log('重新绑定！');
        } else {
            na.off('focus', nameFlush);
            // console.log('解绑成功！');
        }

    }); //判断输入框是否输入文字，如果输入，则不出现默认文字，否则出现

    em.change(function() {
        em.off('focus', emailFlush);
    });

    em.blur(function() {
        if (em.val() === "") {
            em.val(' 请在这里输入邮箱');
            em.on('focus', emailFlush);
            // console.log('重新绑定！');
        } else {
            em.off('focus', emailFlush);
            // console.log('解绑成功！');
        }

    }); //判断输入框是否输入文字，如果输入，则不出现默认文字，否则出现

    ad.change(function() {
        ad.off('focus', addressFlush);
    });

    ad.blur(function() {
        if (ad.val() === "") {
            ad.val(' 请在这里输入地址');
            ad.on('focus', addressFlush);
            // console.log('重新绑定！');
        } else {
            ad.off('focus', addressFlush);
            // console.log('解绑成功！');
        }

    }); //判断输入框是否输入文字，如果输入，则不出现默认文字，否则出现

    $('.proid').text(productid);
    $.ajax({
        type: "POST",
        url: "/Lenovo/getspecific",
        data: {
            "jsonstr": JSON.stringify({
                "productid": productid
            })
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        //dataType: "json",
        success: function(data) {
            var i = 0;
            console.log("POST的数据为" + JSON.stringify({
                "productid": productid
            }));
            console.log("收到的JSON为" + data); //调试项，在控制板中打印data
            var obj = JSON.parse(data); //解析json
            $('.proname').text(obj[0].productname);
            $('.prodescription').text(obj[0].description);
            $('.price b').text(obj[0].unitprice);
            for (i; i < obj.length; i++) {
                $('.conf').append(conf);
                $('.conf a:last .cpu').text(obj[i].cpu);
                $('.conf a:last .os').text(obj[i].os);
                $('.conf a:last .memory').text(obj[i].memory);
                $('.conf a:last .harddisk').text(obj[i].harddisk);
                $('.conf a:last .dpi').text(obj[i].dpi);
                $('.conf a:last .size').text(obj[i].size);
                $('.conf a:last .color').text(obj[i].color);
                $('.conf a:last .id').text(obj[i].id);
            } //加载配置选项框
            $('.conf a:first').attr("class", "selectConf_active"); //选框变红
            $('.img img').attr("src", obj[0].pic1);
            $('#im0 img').attr("src", obj[0].pic1);
            $('#im1 img').attr("src", obj[0].pic2);
            $('#im2 img').attr("src", obj[0].pic3);
            $('#im3 img').attr("src", obj[0].pic4);
            $('#im4 img').attr("src", obj[0].pic5);
            $('.conf a:first').attr("class", "selectConf_active");


            $('[id = selectConf]').click(function() {
                var t = $(this);
                if ($(this).attr("class") === "selectConf") {
                    $.ajax({
                        type: "POST",
                        url: "/Lenovo/changespecific",
                        data: {
                            "jsonstr": JSON.stringify({
                                "productid": productid,
                                "id": $(this).find(".id").text()
                            })
                        },
                        contentType: "application/x-www-form-urlencoded;charset=utf-8",
                        //dataType: "json",
                        success: function(data) {
                            console.log("change,post:" + JSON.stringify({
                                "productid": productid,
                                "id": t.find(".id").text()
                            }));
                            console.log(data);
                            var sobj = JSON.parse(data); //解析json
                            $('.price b').text(sobj[0].unitprice);
                            $('.prodescription').text(sobj[0].description);
                            $('.img img').attr("src", sobj[0].pic1);
                            $('#im0 img').attr("src", sobj[0].pic1);
                            $('#im1 img').attr("src", sobj[0].pic2);
                            $('#im2 img').attr("src", sobj[0].pic3);
                            $('#im3 img').attr("src", sobj[0].pic4);
                            $('#im4 img').attr("src", sobj[0].pic5);
                            $(".selectConf_active").attr("class", "selectConf");
                            t.attr("class", "selectConf_active"); //选框变红
                        },
                        error: function(data) {}
                    }); //获取数据
                } else {
                    // $(this).attr("class", "selectConf");
                }
            }); //ajax更改价格
        },
        error: function() {
            console.log("连接服务器失败！请刷新页面");
        }
    });


    $('#turnleft').click(function() {
        switch ($("[style='opacity: 1;']").attr("id")) {
            case "im0":
                $('#im0').css("opacity", "0.5");
                $('#im4').css("opacity", "1");
                $('.img img').attr("src", $('#im4 img').attr("src"));
                break;
            case "im1":
                $('#im1').css("opacity", "0.5");
                $('#im0').css("opacity", "1");
                $('.img img').attr("src", $('#im0 img').attr("src"));
                break;
            case "im2":
                $('#im2').css("opacity", "0.5");
                $('#im1').css("opacity", "1");
                $('.img img').attr("src", $('#im1 img').attr("src"));
                break;
            case "im3":
                $('#im3').css("opacity", "0.5");
                $('#im2').css("opacity", "1");
                $('.img img').attr("src", $('#im2 img').attr("src"));
                break;
            case "im4":
                $('#im4').css("opacity", "0.5");
                $('#im3').css("opacity", "1");
                $('.img img').attr("src", $('#im3 img').attr("src"));
                break;
        }

    });

    $('#turnright').click(function() {
        switch ($("[style='opacity: 1;']").attr("id")) {
            case "im0":
                $('#im0').css("opacity", "0.5");
                $('#im1').css("opacity", "1");
                $('.img img').attr("src", $('#im1 img').attr("src"));
                break;
            case "im1":
                $('#im1').css("opacity", "0.5");
                $('#im2').css("opacity", "1");
                $('.img img').attr("src", $('#im2 img').attr("src"));
                break;
            case "im2":
                $('#im2').css("opacity", "0.5");
                $('#im3').css("opacity", "1");
                $('.img img').attr("src", $('#im3 img').attr("src"));
                break;
            case "im3":
                $('#im3').css("opacity", "0.5");
                $('#im4').css("opacity", "1");
                $('.img img').attr("src", $('#im4 img').attr("src"));
                break;
            case "im4":
                $('#im4').css("opacity", "0.5");
                $('#im0').css("opacity", "1");
                $('.img img').attr("src", $('#im0 img').attr("src"));
                break;
        }

    });
    $('.proul a').click(function() {
        $("[style='opacity: 1;']").css("opacity", "0.5");
        $(this).parent("li").css("opacity", "1");
        $('.img img').attr("src", $(this).find('img').attr("src"));
    });

    $('.cartbutton a').click(function() {
        if ($('.header-un').text() === "undefined") {
            $('.login-box').css('display', 'inline');
            $('#login-form').css('display', 'inline');
            initSubmit();
            console.log("未登录，弹出登录窗口");
        } else if ($('.cartbutton a').attr("href") == undefined) {

        } else {
            console.log("已登录，发送信息");
            $('.login-box').click(function() {
                $('.login-box').css('display', 'none');
                $('#order-form').css('display', 'none');
            }); //点击非登录框以外区域，关闭登录框
            $('.login-box').show();
            $('#order-form').show();
            $('#name').val(' 请在这里输入姓名');
            $('#email').val(' 请在这里输入邮箱');
            $('#postcode').val(' 请在这里输入邮编');
            $('#address').val(' 请在这里输入地址');
            // $('#name-error').text('');
            // $('#email-error').text('');
            // $('#address-error').text('');
            $('#name').on('focus', nameFlush);
            $('#email').on('focus', emailFlush);
            $('#postcode').on('focus', postcodeFlush);
            $('#address').on('focus', addressFlush);



        }

    });
});

function GetQueryString(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
};

var nameFlush = function() {
    $('#name').val('');
    $('#name-error').text('');
    // console.log('flush成功！');
}; //用户名登录框清空

var emailFlush = function() {
    $('#email').val('');
    $('#email-error').text('');
    // console.log('flush成功！');
}; //用户名登录框清空
var addressFlush = function() {
    $('#address').val('');
    $('#address-error').text('');
    // console.log('flush成功！');
}; //用户名登录框清空、

var postcodeFlush = function() {
    $('#postcode').val('');
    $('#postcode-error').text('');
    // console.log('flush成功！');
}; //用户名登录框清空

var checkorderForm = function() {
    var em = $("#email").val(),
        err = 0;
    $("#name-error").text("");
    $("#address-error").text("");
    $("#postcode-error").text("");
    $("#email-error").text("");
    if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(em)) {
        $("#email-error").text("邮箱格式不合法");
        $("#email").click(emailFlush);
        err = 1;
    }
    // if () {
    //     $("#postcode-error").text("邮编格式不合法");
    //     err = 1;
    // }
    if ($("#name").val() == " 请在这里输入姓名") {
        $("#name-error").text("姓名不可以为空");
        err = 1;
    }
    if ($("#email").val() == " 请在这里输入邮箱") {
        $("#email-error").text("邮箱不可以为空");
        err = 1;
    }
    if ($("#address").val() == " 请在这里输入地址") {
        $("#address-error").text("地址不可以为空");
        err = 1;
    }
    if ($("#postcode").val() == " 请在这里输入邮编") {
        $("#postcode-error").text("邮编不可以为空");
        err = 1;
    }
    if (err != 0) {
        return false;
    }


    console.log(
        JSON.stringify({
            "Username": $(".header-un").text(),
            "productid": $('.proid').text(),
            "id": $('.selectConf_active .id').text(),
            "num": $('.pro_num').val(),
            "name": $('#name').val(),
            "email": $('#email').val(),
            "postcode": $('#postcode').val(),
            "address": $('#address').val()

        })
    );
    $.ajax({
        type: "POST",
        url: "/Lenovo/addcart",
        async: false,
        data: {
            "jsonstr": JSON.stringify({
                "Username": $(".header-un").text(),
                "productid": $('.proid').text(),
                "id": $('.selectConf_active .id').text(),
                "num": $('.pro_num').val(),
                "name": $('#name').val(),
                "email": $('#email').val(),
                "postcode": $('#postcode').val(),
                "address": $('#address').val()
            })
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        success: function(data) {

            console.log(data); //调试项，在控制板中打印data
            if (data == null || data.trim() == "") {
                alert("加入预约购买页成功！");
                // $('.cartbutton a').removeAttr("href");
                // $('.cartbutton a').css({ "border-color": "#6f6f6f", "color": "#6f6f6f" });
                $('.cartbutton a').text("已提交");
                // $('.num').text(parseInt($('.num').text()) + 1);
                $('.login-box').css('display', 'none');
                $('#order-form').css('display', 'none');

            } else {
                var obj = JSON.parse(data); //解析json
                if (obj.success === "1") {
                    alert("已加入过预约购买");
                    $('.cartbutton a').text("已提交");
                    $('.login-box').css('display', 'none');
                    $('#order-form').css('display', 'none');
                } else {
                    alert("出现未知错误，请重试")
                }
            }


        },
        error: function() {
            console.log("提交到购物车失败！请重试");
        },
    }); //发送购物车中数据


    // 未加MD5加密
    return true;
};