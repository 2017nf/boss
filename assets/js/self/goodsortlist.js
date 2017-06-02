tool.gologin();
var url = baseUrl + "/goods/sortlist";
var thead = "<tr>" +
    "<th class='display'>商品ID</th>" +
    "<th>分类名称</th>" +
    "<th>商品分类ICON</th>" +
    "<th>排序</th>" +
    "<th>创建时间</th>" +
    "<th>操作</th>" +
    "</tr>";
var tmpl = "<tr class='odd gradeX'><td name='goodsSortId' class='display'>${0}</td><td>${1}</td><td >${2}</td><td >${3}</td><td >${4}</td><td>${5}</td></tr>";
var data = [];
var option = {
    pageSize: 10,
    pageNo: 1
};
var setting = {
    cont: 'pagenation',
    skin: '#1E9FFF',
    curr: option.pageNo || 1, //当前页
    groups: 5, //连续显示分页数
    skip: true //是否开启跳页
};
layui.use(['laypage', 'layer'], function () {
    var laypage = layui.laypage;
    laypage(setting);
    //模拟渲染
    var render = function (data, tmpl) {
        console.log(data);
        data = tool.formatValue(data);
        var arr = [];
        console.log("render : " + data);
//                var thisData = data.concat().splice(curr*nums-nums, nums);
        layui.each(data, function (index, item) {
            console.log("item : " + item);
            arr.push(
                tmpl.replace("${0}", item.id).replace("${1}", item.name).replace("${2}", "<img src='" + item.icon + "' style='width: 50px;height: 50px'>").replace("${3}", item.rank).replace("${4}", tool.formatDate(item.createTime)).replace("${5}",'<button id="btn" class="btn btn-info" onclick="delsort(this)">删除</button>')
            );
        });
        return arr.join('');
    };

    function load(url, option) {
        $.ajax({
            url: url,
            data: option,
            type: 'get',
            cache: false,
            dataType: 'json',
            success: function (datas) {
                if (datas.code == 200) {
                    data = datas.result.rows;
                    totalSize = datas.result.totalSize;
                    //调用分页
                    laypage({
                        cont: 'pagenation',
                        pages: Math.ceil(totalSize / option.pageSize), //得到总页数
                        curr: option.pageNo || 1, //当前页
                        jump: function (obj, first) {
                            option.pageNo = obj.curr;
                            setting.curr = obj.curr;
                            $("#thead_goodsortlist").html(thead);
                            $("#tbody_goodsortlist").html(render(data, tmpl));
                            if (!first) {
                                load(url, option);
                            }
                        }
                    });
                } else {
                }
            },
            error: function () {
                window.location.href = window.location.href;
            }
        });
    }

    load(url, option);
});


var folderName = "mall-test01";
/*Logo上传*/
window.onload = function () {
    $("#image_upload").css("display", "block");
    window.frames["image_upload_iframe"].getToken(folderName);
    image_upload_iframe.window.document.getElementById("controlId").value = "editLogo";
};



function save() {
    var img = window.frames["image_upload_iframe"].setUploadImgUrl();
    $("input[name='icon']").val(img);
    var icon=$("input[name='icon']").val();
    var rank = $("input[name='rank']").val();
    var name = $("input[name='name']").val();

    if(!name){
        alert("商品分类名不能为空!!!");
        return;
    }

    if(!rank){
        alert("分类排名不能为空");
        return;
    }
    if(!icon){
        alert("商品分类ICON不能为空");
        return;
    }
    $.ajax({
        // cache: true,
        type: "POST",
        url:baseUrl+"/goods/addsort",
        // dataType:'jsonp',
        data:$('#popupForm').serialize(),// 你的formid
        // async: false,
        beforeSend: function(request) {
            request.setRequestHeader("token", sessionStorage.getItem("token"));
        },
        error: function(request) {
            alert("Connection error");
        },
        success: function(data) {
            if(data.code == 200){
                alert("新增商品分类成功!");
                parent.layer.close(index);
            }else {
                alert(data.msg);
                return;
            }
        }
    });
}


function delsort(obj) {

    console.log($(obj).parent("tr").first().find("td"));
    var goodsSortId=$(obj).parent().parent().find("td").first().text();
    alert(goodsSortId);
    if(!goodsSortId){
        alert("获取商品分类id失败，删除异常");
        return;
    }


    $.ajax({
        type: "POST",
        url:baseUrl+"/goods/delsort",
        data:{id:goodsSortId},// 你的formid
        beforeSend: function(request) {
            request.setRequestHeader("token", sessionStorage.getItem("token"));
        },
        error: function(request) {
            alert("Connection error");
        },
        success: function(data) {
            if(data.code == 200){
                alert("删除商品分类成功!");
                parent.layer.close(index);
            }else {
                alert(data.msg);
                return;
            }
        }
    });
}