'use strict';
$(function() {
    var tr = $('.hide tbody').html();
    $('.selectbar').hide();
    $('.mainpart').hide();
    $('#login-form').show();
    var height = $(window).height();
    $('.selectbar').css("height", height);
    window.onresize = function() {
        $('.selectbar').css("height", $(window).height());

    }

    //登录框相关操作
    $('#username').val(' 请输入管理员账号');
    $('#show-password').show();
    $('#input-password').hide();
    $('#un-error').text('');
    $('#pwd-error').text('');
    $('#username').on('focus', unFlush);
    var un = $('#username');


    un.change(function() {
        un.off('focus', unFlush);
    });

    un.blur(function() {
        if (un.val() === "") {
            un.val(' 请输入管理员账号');
            un.on('focus', unFlush);
            // console.log('重新绑定！');
        } else {
            un.off('focus', unFlush);
            // console.log('解绑成功！');
        }

    }); //判断输入框是否输入文字，如果输入，则不出现默认文字，否则出现

    var spwd = $('#show-password');
    var ipwd = $('#input-password');
    spwd.focus(function() {
        spwd.hide();
        ipwd.val('');
        ipwd.show().focus();
        $('#un-error').text('');
        $('#pwd-error').text('');

    }); //点击密码框时切换为密码格式
    ipwd.focus(function() {
        ipwd.val('');
        $('#un-error').text('');
        $('#pwd-error').text('');
    }); //密码框每次被点击都会清空密码
    ipwd.blur(function() {
        if (ipwd.val() === "") {
            ipwd.hide();
            spwd.show();
        }
    }); //判断密码框

    $('.last button').on('click', pushadd);

    $('.tool-1 a').click(function() {
        $.ajax({
            type: "POST",
            url: "/Lenovo/getproduct",
            data: {
                "jsonstr": JSON.stringify({
                    "pwd": $('.pwd').text()
                })
            },
            async: true,
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            success: function(data) {
                console.log("json:" + JSON.stringify({
                    "pwd": $('.pwd').text()
                }));
                console.log("json:" + data);
                var obj = JSON.parse(data); //解析json
                if (obj.error === "1") {
                    alert("非法操作！！！");
                } else {
                    var i;
                    // console.log("data" + data.length);
                    // console.log("obj" + obj.length);
                    $('.mainpart .add').remove();
                    $('.selectbar').mouseenter(function() {
                        $('.selectbar').animate({ "left": "0px" }, 500);
                    });
                    $('.selectbar').mouseleave(function() {
                        $('.selectbar').animate({ "left": "-95px" }, 500);
                    });
                    for (i = 0; i < obj.length; i++) {
                        $('.mainpart tbody').append(tr);
                        var m = $('.mainpart tbody tr').eq(i + 1)
                        m.find('.id').text(obj[i].id);
                        m.find('.productname input ').val(obj[i].productname);
                        m.find('.productid input ').val(obj[i].productid);
                        m.find('.color input ').val(obj[i].color);
                        m.find('.cpu input ').val(obj[i].cpu);
                        m.find('.memory input ').val(obj[i].memory);
                        m.find('.harddisk input ').val(obj[i].harddisk);
                        m.find('.type input ').val(obj[i].type);
                        m.find('.size input ').val(obj[i].size);
                        m.find('.dpi input ').val(obj[i].dpi);
                        m.find('.unitprice input ').val(obj[i].unitprice);
                        m.find('.pic1 input ').val(obj[i].pic1);
                        m.find('.pic2 input ').val(obj[i].pic2);
                        m.find('.pic3 input ').val(obj[i].pic3);
                        m.find('.pic4 input ').val(obj[i].pic4);
                        m.find('.pic5 input ').val(obj[i].pic5);
                        m.find('.description input ').val(obj[i].description);
                    }


                    $('.selectbar').animate({ "left": "-95px" }, 500);
                    $('.mainpart').show();



                    $('.delete button').click(function() {
                        var t = $(this).parents("tr");
                        $.ajax({
                            type: "POST",
                            url: "/Lenovo/deleteproduct",
                            async: true,
                            data: {
                                "jsonstr": JSON.stringify({
                                    "id": t.find(".id").text(),

                                })
                            },
                            contentType: "application/x-www-form-urlencoded;charset=utf-8",
                            success: function(data) {
                                console.log("POST数据为：" + JSON.stringify({
                                    "id": t.find(".id").text(),

                                }));
                                t.remove();
                                alert("删除成功！");
                            },
                            error: function() {
                                console.log("删除失败！请重试");
                            },
                        });
                    }); //单击删除

                    $('.add input').change(function() {
                        var th = $(this);
                        var t = $(this).parents("tr");
                        $.ajax({
                            type: "POST",
                            url: "/Lenovo/updateproduct",
                            async: false,
                            data: {
                                "jsonstr": JSON.stringify({
                                    "id": t.find(".id").text(),
                                    "attr": th.parent().attr("class"),
                                    "cont": th.val()
                                })
                            },
                            contentType: "application/x-www-form-urlencoded;charset=utf-8",
                            success: function(data) {
                                console.log("POST的数据为：" + JSON.stringify({
                                    "id": t.find(".id").text(),
                                    "attr": th.parent().attr("class"),
                                    "cont": th.val()
                                }));
                                th.css("background", "#BBBBBB");
                            },
                            error: function() {
                                console.log("更改失败！请重试");
                            },
                        }); //发送购物车中数据
                    });


                } //success

            },
        });

    }); //准备函数

});


var unFlush = function() {
    $('#username').val('');
    $('#un-error').text('');
    // console.log('flush成功！');
}; //用户名登录框清空


var checkForm = function() {
    var u = $("#username").val(),
        p = $("#input-password").val(),
        err = 0;
    $("#un-error").text("");
    $("#pwd-error").text("");
    if (!/^\w{3,10}$/.test(u)) {
        $("#un-error").text("管理员账号必须是3-10位英文字母或数字");
        $("#username").click(unFlush);
        err = 1;
    }
    if (p.length < 6 || p.length > 20) {
        $("#pwd-error").text("口令长度必须在6-20位之间");
        err = 1;
    }
    if (err != 0) {
        return false;
    }
    postform();

    // 未加MD5加密
    return true;
}; //表单提交

var postform = function() {
    var input_pwd = $('#input-password');
    var md5_pwd = $('#md5-password');
    md5_pwd.val(input_pwd.val());
    // 通过 form 的 id 取得 form
    var $form = $('#login-form'); // 很关键
    // 以 post 方式提交, 回调函数function 返回 data
    $.ajax({
        type: "POST",
        url: "/Lenovo/mlogin",
        data: $form.serialize(),
        async: false,
        success: function(data) {
            var obj = JSON.parse(data); //解析json
            console.log("POST的数据为" + $form.serialize());
            console.log("json内容为" + data);
            if (obj.success === "1") {
                $('#login-form').hide();
                $('.selectbar').show(); //显示用户名
                $('.title span').text(obj.username); //将用户名改为传来的json中的username属性的值
                $('.pwd').text(obj.pwd); //将用户名改为传来的json中的username属性的值
                console.log('pwd' + $('.pwd').text());
                return true;
            } else if (obj.success === "2") {
                $("#pwd-error").text("密码错误");
                console.log("密码错误");
                return false;
            } else {
                $("#un-error").text("账号错误");

                return false;
            };
        },
        error: function() {
            alert("与服务器连接失败！");
            return false;
        },
    });
};

var pushadd = function() {
    $('.mainpart tbody').append($('.hide tbody').html());
    $(".mainpart tr:last .delete button").text("完成");
    $(".mainpart tr:last .id").text(parseInt($(".mainpart tr .id").eq($(".mainpart tr").length - 2).text()) + 1);
    $('.addp').hide();
    $('.cancel').show();
    $('.cancel').click(function() {
        $('.tool-1 a').click();
        $('.cancel').hide();
        $('.addp').show();

    });
    $(".mainpart tr:last .delete button").click(function() {
        $.ajax({
            type: "POST",
            url: "/Lenovo/addproduct",
            async: true,
            data: {
                "jsonstr": JSON.stringify({
                    "id": $(".mainpart tr:last .id").text(),
                    "productname": $(".mainpart tr:last .productname input").val(),
                    "productid": $(".mainpart tr:last .productid input").val(),
                    "color": $(".mainpart tr:last .color input").val(),
                    "cpu": $(".mainpart tr:last .cpu input").val(),
                    "memory": $(".mainpart tr:last .memory input").val(),
                    "harddisk": $(".mainpart tr:last .harddisk input").val(),
                    "type": $(".mainpart tr:last .type input").val(),
                    "size": $(".mainpart tr:last .size input").val(),
                    "dpi": $(".mainpart tr:last .dpi input").val(),
                    "unitprice": $(".mainpart tr:last .unitprice input").val(),
                    "pic1": $(".mainpart tr:last .pic1 input").val(),
                    "pic2": $(".mainpart tr:last .pic2 input").val(),
                    "pic3": $(".mainpart tr:last .pic3 input").val(),
                    "pic4": $(".mainpart tr:last .pic4 input").val(),
                    "pic5": $(".mainpart tr:last .pic5 input").val(),
                    "description": $(".mainpart tr:last .description input").val()
                })

            },
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            success: function(data) {
                console.log(JSON.stringify({
                    "id": $(".mainpart tr:last .id").text(),
                    "productname": $(".mainpart tr:last .productname input").val(),
                    "productid": $(".mainpart tr:last .productid input").val(),
                    "color": $(".mainpart tr:last .color input").val(),
                    "cpu": $(".mainpart tr:last .cpu input").val(),
                    "memory": $(".mainpart tr:last .memory input").val(),
                    "harddisk": $(".mainpart tr:last .harddisk input").val(),
                    "type": $(".mainpart tr:last .type input").val(),
                    "size": $(".mainpart tr:last .size input").val(),
                    "dpi": $(".mainpart tr:last .dpi input").val(),
                    "unitprice": $(".mainpart tr:last .unitprice input").val(),
                    "pic1": $(".mainpart tr:last .pic1 input").val(),
                    "pic2": $(".mainpart tr:last .pic2 input").val(),
                    "pic3": $(".mainpart tr:last .pic3 input").val(),
                    "pic4": $(".mainpart tr:last .pic4 input").val(),
                    "pic5": $(".mainpart tr:last .pic5 input").val(),
                    "description": $(".mainpart tr:last .description input").val()
                }));
                $('.addp').show();
                $('.cancel').hide();
                alert("添加成功！");
                $(".mainpart tr:last .delete button").text("删除");
                $('.delete button').click(function() {
                    var t = $(this).parents("tr");
                    $.ajax({
                        type: "POST",
                        url: "/Lenovo/deleteproduct",
                        async: true,
                        data: {
                            "jsonstr": JSON.stringify({
                                "id": t.find(".id").text(),

                            })
                        },
                        contentType: "application/x-www-form-urlencoded;charset=utf-8",
                        success: function(data) {
                            console.log("POST数据为：" + JSON.stringify({
                                "id": t.find(".id").text(),

                            }));
                            t.remove();
                            alert("删除成功！");
                        },
                        error: function() {
                            console.log("删除失败！请重试");
                        },
                    });
                }); //单击删除
                $('.add input').change(function() {
                    var th = $(this);
                    var t = $(this).parents("tr");
                    $.ajax({
                        type: "POST",
                        url: "/Lenovo/updateproduct",
                        async: false,
                        data: {
                            "jsonstr": JSON.stringify({
                                "id": t.find(".id").text(),
                                "attr": th.parent().attr("class"),
                                "cont": th.val()
                            })
                        },
                        contentType: "application/x-www-form-urlencoded;charset=utf-8",
                        success: function(data) {
                            console.log("POST的数据为：" + JSON.stringify({
                                "id": t.find(".id").text(),
                                "attr": th.parent().attr("class"),
                                "cont": th.val()
                            }));
                            th.css("background", "#BBBBBB");
                        },
                        error: function() {
                            console.log("更改失败！请重试");
                        },
                    }); //发送购物车中数据
                });



            },
            error: function() {
                console.log("添加失败！请重试");
            },
        });


    });

};