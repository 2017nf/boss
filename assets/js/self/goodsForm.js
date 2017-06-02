tool.gologin();
var action = "ADD";
var token = sessionStorage.getItem("token");
function save() {
    if ($("input[name='name']").val() == "") {
        // alert("商品名不能为空!!!");
        $("#spaName").show();
        $("input[name='name']").focus();
        return;
    }
    if ($("select option:selected").val() == "") {
        // alert("商品分类不能为空!!!");
        $("#spaSortId").show();
        $("#disabledSelect").focus();
        return;
    }
    var $originalPrice = $("input[name='originalPrice']").val();
    if ($originalPrice == "") {
        // alert("商品原价不能为空!!!");
        $("#spaOriginalPrice").show();
        $("input[name='originalPrice']").focus();
        return;
    }
    if (parseInt($originalPrice) < 0) {
        // alert("商品原价不能小于0!!!");
        $("#spaOriginalPrice").show();
        $("input[name='originalPrice']").focus();
        return;
    }
    if ($("input[name='price']").val() == "") {
        // alert("商品实价不能为空!!!");
        $("#spaPrice").show();
        $("input[name='price']").focus();
        return;
    }
    if ($("input[name='stock']").val() == "") {
        // alert("商品数量不能为空!!!");
        $("#spaStock").show();
        $("input[name='stock']").focus();
        return;
    }
    if (action == "ADD") {
        var imgUrl = window.frames["image_upload_iframe"].setUploadImgUrl();
        $("#icon").val(imgUrl);
        if ($("input[name='icon']").val() == "") {
            // alert("请上传图片!!!");
            $("#spaIcon").show();
            return;
        }
    }
    if (action == "ADD") {
        add();
    } else if (action == "UPD") {
        update();
    }
}
//新增
add = function () {
    //设置token
    $("#token").val(token);
    $.ajax({
        cache: true,
        type: "POST",
        url: baseUrl + "/goods/add",
        data: $('#popupForm').serialize(),// 你的formid
        async: false,
        error: function (request) {
            alert("Connection error");
        },
        success: function (data) {
            if (data.code == 200) {
                alert("新增商品成功!");
                window.location.href = "goodslist.html";
            } else {
                alert(data.msg);
                return;
            }
        }
    });
}
//修改
update = function () {
    $("#token").val(token);
    $.ajax({
        cache: true,
        type: "POST",
        url: baseUrl + "/goods/edit",
        data: $('#popupForm').serialize(),// 你的formid
        async: false,
        error: function (request) {
            alert("Connection error");
        },
        success: function (data) {
            if (data.code == 200) {
                alert("修改商品成功!");
                window.location.href = "goodslist.html";
            } else {
                alert(data.msg);
                return;
            }
        }
    });
}
//返回商品列表
function cancel() {
    window.location.href = "goodslist.html";
}
//扩展方法获取url参数
$.getUrlParam = function (name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象

    var r = window.location.search.substr(1).match(reg);  //匹配目标参数

    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
//初始化方法
init = function () {
    getSort();
    var paramGoodsId = $.getUrlParam("goodsId");
    // alert("商品id为："+paramGoodsId);
    if (paramGoodsId == null || paramGoodsId == undefined) {
        return;
    }
    action = "UPD";
    $.ajax({
        cache: true,
        type: "GET",
        url: baseUrl + "/goods/detail",
        data: {"goodsId": paramGoodsId,"token":token},// 你的formid
        async: false,
        error: function (request) {
            alert("Connection error");
        },
        success: function (data) {
            // console.log(data);
            if (data.code == 200) {
                // alert("返回成功:"+data.result.name);
                reform(data.result);
            } else {
                // alert("返回失败");
                alert(data.msg);
                return;
            }
        }
    });
}
//获取所有商品分类
getSort = function () {
    $.ajax({
        cache: true,
        type: "GET",
        url: baseUrl + "/goods/sortlist",
        async: false,
        error: function (request) {
            alert("Connection error");
        },
        success: function (data) {
            if (data.code == 200) {
                console.info(JSON.stringify(data.result));
                renderSort(data.result.rows);
            } else {
                alert(data.msg);
                return;
            }
        }
    });
}
//加载商品分类下拉
renderSort = function (data) {
    var $sel = $("#disabledSelect");
    var html = "";
    $.each(data, function (index, item) {
        console.info(item.id + ">>>>>>>>>>>>>>>" + item.name);
        html = html + "<option value='" + item.id + "'>" + item.name + "</option>";
    });
    html = "<option value='' selected='selected'>  </option>" + html;
    $sel.html(html);
}
//修改模式时填充表单
reform = function (data) {
    $("input[name='name']").val(data.name);
    $("input[name='originalPrice']").val(data.originalPrice);
    $("input[name='price']").val(data.price);
    $("input[name='stock']").val(data.stock);
    $("input[name='detail']").val(data.detail);
    $("input[name='id']").val(data.id);
    $("select[name='sortId']").val(data.sortId);
    $("select[name='status']").val(data.status);
    $("h1.page-header small").html("修改");
    $("#image_upload").hide();
}
$("#btnSubmit").click(function () {
    save();
});
$("#btnReset").click(function () {
    cancel();
})
$(document).ready(function () {
    init();
    $(".form-control").click(function () {
        $(this).next("span").hide();
    });
    $(".form-control").keydown(function () {
        $(this).next("span").hide();
    });
});