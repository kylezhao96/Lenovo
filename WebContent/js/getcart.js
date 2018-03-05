'use strict';
$(function() {
    var
        i,
        html = $('.hide tbody').html();
    $(".cart-null a").click(function() {
        window.location.href = "/Lenovo/search.html";
    });
    $.ajax({
        type: "POST",
        url: "/Lenovo/cart",
        data: {
            "jsonstr": JSON.stringify({
                "Username": $(".header-un").text()
            })
        },
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        //dataType: "json",
        success: function(data) {
            console.log("POST的数据为" + JSON.stringify({
                "Username": $(".header-un").text()
            }));
            console.log("收到的JSON为" + data); //调试项，在控制板中打印data

            if (data.length === 0) {
                console.log("购物车为空");
                judgeNull();
            } else {
                var obj = JSON.parse(data); //解析json
                // console.log("length" + data.length); //调试项，在控制板中打印data
                // console.log("objlength" + obj.length); //调试项，在控制板中打印data
                for (i = 0; i < obj.length; i++) {
                    $('.cart-list tbody').append(html);
                    // $('.cart-list tr:last .name').text(obj[i].productname);
                    // $('.cart-list tr:last .Id').text(obj[i].productid);
                    $('.cart-list tr:last .description').text(obj[i].description);
                    $('.cart-list tr:last .price').text(obj[i].unitprice);
                    $('.cart-list tr:last .pronum input').val(obj[i].amount);
                    $('.cart-list tr:last .id').text(obj[i].id);
                    $('.cart-list tr:last .name').text(obj[i].name);
                    $('.cart-list tr:last .email').text(obj[i].email);
                    $('.cart-list tr:last .address').text(obj[i].address);
                    $('.cart-list tr:last .sumprice').text(obj[i].unitprice * obj[i].amount);
                };
                judgeNull();

                $('.delete a').click(function() {
                    var n = $(this).parents("tr").index();
                    var t = $(this);
                    console.log("点删除POST的数据为" + JSON.stringify({
                        "Username": $(".header-un").text(),
                        "id": $(".cart-list tr").eq(n).find(".id").text()
                    }));
                    $.ajax({
                        type: "POST",
                        url: "/Lenovo/deletecart",
                        data: {
                            "jsonstr": JSON.stringify({
                                "Username": $(".header-un").text(),
                                "id": $(".cart-list tr").eq(n).find(".id").text()
                            })
                        },
                        async: false,
                        contentType: "application/x-www-form-urlencoded;charset=utf-8",
                        //dataType: "json",
                        success: function(data) {
                            console.log("点删除POST的数据为" + JSON.stringify({
                                "Username": $(".header-un").text(),

                            }));
                            console.log("删除商品成功！");
                            $(".cart-list tr").eq(n).remove();
                            judgeNull();
                            calculateSum();
                        },
                        error: function() {
                            alert("连接失败，请稍后重试");
                        },
                    });

                }); //点击删除，删除物品

                $('.select').click(function() {
                    console.log("点击了选中框");
                    $(this).prop('checked') ? $(this).prop('checked', true) : $(this).prop('checked', false);

                    if ($(".cart-list input[class='select']:checked").length === ($('.cart-list tr:last').index() + 1)) {
                        $(".selectAll").prop('checked', true);
                    } else {
                        $(".selectAll").prop('checked', false);
                    }
                    calculateSum();

                }); //全选时，全选按钮自动选中

                $('.option').click(function() {
                    window.location.href = "/Lenovo/product.html?productid=" + $(this).find(".Id").text();
                }); //点击跳转到详情页




                $('.pronum input').change(function() {
                    var
                        a = $(this).parents("tr"),
                        price = parseInt(a.find(".price").text()),
                        n = $(this).parents("tr").index(),
                        amount = parseInt(a.find("input[type='number']").val());
                    a.find(".sumprice").text(price * amount);
                    calculateSum();
                    console.log(JSON.stringify({
                        "Username": $(".header-un").text(),
                        "id": $(".cart-list tr").eq(n).find(".id").text(),
                        "amount": $(".cart-list tr").eq(n).find(".pronum").children().val()
                    })); //验证数据
                    $.ajax({
                        type: "POST",
                        url: "/Lenovo/updatecart",
                        data: {
                            "jsonstr": JSON.stringify({
                                "Username": $(".header-un").text(),
                                "id": $(".cart-list tr").eq(n).find(".id").text(),
                                "amount": $(".cart-list tr").eq(n).find(".pronum").children().val()
                            })
                        },
                        async: true,
                        contentType: "application/x-www-form-urlencoded;charset=utf-8",
                        //dataType: "json",
                        success: function(data) {
                            console.log("更改数量成功！");
                        },
                        error: function() {
                            alert("连接服务器失败！请重试")
                        },
                    });
                });
            }; //else结束

        },
        error: function() {
            console.log("网络连接出错！");
        },
    }); //发送POST,得到购物车中数据




    $('.selectAll').click(function() {
        if ($(this).is(':checked') === true) {
            $("input[type='checkbox']").prop('checked', true);
        } else {
            $("input[type='checkbox']").prop('checked', false);;
        }
        calculateSum();
    }); //若点击全选按钮，全选


});

var calculateSum = function() {
    var sum = 0;
    $('.cart-list').find("input[class='select']").each(function() {
        if ($(this).prop('checked')) {
            var a = $(this).parents("tr").find(".sumprice").text();
            sum = sum + parseInt(a);
        }
    });

    $('.pricesum').text(sum);
};

var judgeNull = function() {
    if ($('.cart-list tr:last').index() >= 0) {
        $('.cart-null').hide()
        $('.cart-cost').show();
        $('.settle').show();
    } else {
        $('.cart-null').show();
        $('.cart-cost').hide();
        $('.settle').hide();
    }
};