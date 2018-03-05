'use strict';
var time; //设置cookie保存事件
var InterValObj; //timer变量，控制时间  
var count = 60; //间隔函数，1秒执行  
var curCount; //当前剩余秒数  
$(function() {
    var username = getCookieValue("cookUser");
    var password = getCookieValue("cookPass");

    if (username != '' && password != '') {
        $("#username").val(username);
        $("#input-password").val(password);
        postform();
    };

    $('input[type="checkbox"]').click(function() {
        $(this).prop('checked') ? $(this).prop('checked', true) : $(this).prop('checked', false);
        if ($(this).prop('checked') === true) {
            time = 60 * 60 * 60; //自动登录
        } else {
            time = ""; //仅自动登录到浏览器关闭
        };
        console.log(time);
    });


    $('.header_top_right>a.submit').click(function() {
        $('.login-box').css('display', 'inline');
        $('#login-form').css('display', 'inline');
        initSubmit();

    }); //点登陆，弹出登陆窗口

    $('.header_top_right>a.register').click(function() {
        $('.login-box').css('display', 'inline');
        $('#login-form').css('display', 'inline');
        initRegister();

    }); //点击注册按钮

    $('#input-password').css('display', 'none');

    var un = $('#username');
    un.change(function() {
        un.off('focus', unFlush);
    });

    un.blur(function() {
        if (un.val() === "") {
            un.val(' 请输入手机号');
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

    $('#captcha').focus(function() {
        $(this).val('');
    });
    $('#captcha').blur(function() {
        if ($(this).val() === "") {
            $(this).val(" 请输入验证码");
        }
    }); //判断密码框

    $('.login-box').click(function() {
        $('.login-box').css('display', 'none');
        $('#login-form').css('display', 'none');
    }); //点击非登录框以外区域，关闭登录框

    $('.logout').click(function() {
        setCookie('cookUser', $("#username").val(), 0, '/'); //set 获取用户名和密码 传给cookie  
        setCookie('cookPass', $("#input-password").val(), 0, '/');
        $('.submit').show(); //隐藏登录按钮
        $('.register').show(); //隐藏注册按钮 
        $('.header-un').hide(); //显示用户名
        $('.header-un').text("undefined"); //将用户名改为传来的json中的username属性的值
        $('.cart').hide(); //显示购物车按钮
        $('.num').hide(); //显示购物车商品数
        $('.num').text("0"); //将商品数改为json中的num属性的值
        $('.logout').hide();
    });

    $('.captcha-input button').click(function() {　　 //向后台发送处理数据  
        console.log(JSON.stringify({
            "Username": $("#username").val()
        }));
        $.ajax({　　
            type: "POST", //用POST方式传输  
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            url: "/Lenovo/sms", //目标地址  
            data: {
                "jsonstr": JSON.stringify({
                    "Username": $("#username").val()
                })
            },
            success: function(data) {
                curCount = count;　　 //设置button效果，开始计时  
                $("#btnSendCode").attr("disabled", "true");
                $("#btnSendCode").val("请在" + curCount + "秒内输入验证码");
                InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次  
            },
            error: function() {
                alert("验证码发送失败，请稍后再试！");
            },
        });
    });

}); //准备函数结束


var unFlush = function() {
    $('#username').val('');
    $('#un-error').text('');
    // console.log('flush成功！');
}; //用户名登录框清空


var initSubmit = function() {
    $('.captcha-input').css('display', 'none');
    // $('.login').css('border-bottom-color', '#EF1C22');
    // $('.signin').css('border-bottom-color', '#000000');

    $('.signin').removeClass("selectedlogin");
    $('.signin').addClass("unselectedlogin");

    $('.login').removeClass("unselectedlogin");
    $('.login').addClass("selectedlogin");
    $('#username').val(' 请输入手机号');
    $('#show-password').show();
    $('#input-password').hide();
    $('#un-error').text('');
    $('#pwd-error').text('');
    $('.autosubmit').show();
    $('#username').on('focus', unFlush);
    $('.login').off('click', initSubmit);
    $('.signin').on('click', initRegister);
}; //初始化登陆菜单

var initRegister = function() {
    $('.captcha-input').css('display', 'inline');
    // $('.login').css('border-bottom-color', '#000000');
    // $('.signin').css('border-bottom-color', '#EF1C22');

    $('.signin').removeClass("unselectedlogin");
    $('.signin').addClass("selectedlogin");

    $('.login').removeClass("selectedlogin");
    $('.login').addClass("unselectedlogin");
    $('#username').val(' 请输入要注册的手机号');
    $('#captcha').val(' 请输入验证码');
    $('#show-password').show();
    $('#input-password').hide();
    $('.autosubmit').hide();
    $('#input-password').val('');
    $('#un-error').text('');
    $('#pwd-error').text('');
    $('#username').on('focus', unFlush);
    $('.signin').off('click', initRegister);
    $('.login').on('click', initSubmit);
}; //初始化注册菜单

var checkForm = function() {
    var u = $("#username").val(),
        p = $("#input-password").val(),
        err = 0;
    $("#un-error").text("");
    $("#pwd-error").text("");
    if (!/^1[34578]\d{9}$/.test(u)) {
        $("#un-error").text("输入的手机号不合法");
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
    if ($('.selectedlogin').text() === "登录") {
        postform();
    }
    if ($('.selectedlogin').text() === "注册") {
        postregsiter();
    }

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
        url: "/Lenovo/login",
        data: $form.serialize(),
        async: false,
        success: function(data) {
            var obj = JSON.parse(data); //解析json
            console.log("POST的数据为" + $form.serialize());
            console.log("json内容为" + data);
            if (obj.success === "1") {
                setCookie('cookUser', $("#username").val(), time, '/'); //set 获取用户名和密码 传给cookie  
                setCookie('cookPass', $("#input-password").val(), time, '/');
                $('.login-box').hide();
                $('#login-form').hide();
                $('.submit').hide(); //隐藏登录按钮
                $('.register').hide(); //隐藏注册按钮 
                $('.header-un').show(); //显示用户名
                $('.header-un').text(obj.username); //将用户名改为传来的json中的username属性的值
                $('.cart').show(); //显示购物车按钮
                // $('.num').show(); //显示购物车商品数
                // $('.num').text(obj.num); //将商品数改为json中的num属性的值
                // console.log(data); //调试项，在控制板中打印data
                return true;
            } else if (obj.success === "2") {
                $("#pwd-error").text("密码错误");
                console.log("密码错误");
                return false;
            } else {
                $("#un-error").text("手机号未注册");
                console.log("账号未注册");
                return false;
            };
        },
        error: function() {
            alert("与服务器连接失败！");
            return false;
        },
    });
};

var postregsiter = function() {
    var username = $('#username').val();
    var input_pwd = $('#input-password');
    var md5_pwd = $('#md5-password');
    md5_pwd.val(input_pwd.val());
    // 通过 form 的 id 取得 form
    var $form = $('#login-form'); // 很关键
    // 以 post 方式提交, 回调函数function 返回 data
    $.ajax({
        type: "POST",
        url: "/Lenovo/register",
        data: $form.serialize(),
        async: false,
        success: function(data) {
            var obj = JSON.parse(data); //解析json
            console.log("POST的数据为" + $form.serialize());
            console.log("json内容为" + data);
            if (obj.success === "0") {
                $('#un-error').text("用户已注册,请直接登录!");
                return false;
            }
            if (obj.success === "1") {
                setCookie('cookUser', $("#username").val(), "", '/'); //set 获取用户名和密码 传给cookie  
                setCookie('cookPass', $("#input-password").val(), "", '/');
                $('.login-box').hide();
                $('#login-form').hide();
                $('.submit').hide(); //隐藏登录按钮
                $('.register').hide(); //隐藏注册按钮 
                $('.header-un').show(); //显示用户名
                $('.header-un').text(username); //将用户名改为传来的json中的username属性的值
                $('.cart').show(); //显示购物车按钮
                // $('.num').show(); //显示购物车商品数
                // $('.num').text("0"); //将商品数改为json中的num属性的值
                // console.log(data); //调试项，在控制板中打印data
                return true;
            }
            if (obj.success === "2") {
                $('#cap-error').text("验证码错误!");
                return false;
            }
        },
        error: function() {
            console.log("与服务器连接失败！");
            return false;
        },
    });
};



//hours为空字符串时,cookie的生存期至浏览器会话结束。hours为数字0时,建立的是一个失效的cookie,这个cookie会覆盖已经建立过的同名、同path的cookie（如果这个cookie存在）。   
function setCookie(name, value, hours, path) {
    var name = escape(name);
    var value = escape(value);
    var expires = new Date();
    expires.setTime(expires.getTime() + hours * 3600000);
    path = path == "" ? "" : ";path=" + path;
    var _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = name + "=" + value + _expires + path;
}
//获取cookie值    方法  
function getCookieValue(name) {
    var name = escape(name);
    //读cookie属性，这将返回文档的所有cookie   
    var allcookies = document.cookie;
    //查找名为name的cookie的开始位置   
    name += "=";
    var pos = allcookies.indexOf(name);
    //如果找到了具有该名字的cookie，那么提取并使用它的值   
    if (pos != -1) { //如果pos值为-1则说明搜索"version="失败   
        var start = pos + name.length; //cookie值开始的位置   
        var end = allcookies.indexOf(";", start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置   
        if (end == -1) end = allcookies.length; //如果end值为-1说明cookie列表里只有一个cookie   
        var value = allcookies.substring(start, end); //提取cookie的值   
        return unescape(value); //对它解码         
    } else return ""; //搜索失败，返回空字符串   
};

//timer处理函数  
function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj); //停止计时器  
        $(".captcha-input button").removeAttr("disabled"); //启用按钮  
        $(".captcha-input button").text("重新发送验证码");
    } else {
        curCount--;
        $(".captcha-input button").text("请在" + curCount + "秒内输入验证码");
    }
};