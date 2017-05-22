tool.gologin();
var url = baseUrl + "/goods/sortlist";
var thead = "<tr>" +
    "<th class='display'>商品ID</th>" +
    "<th>分类名称</th>" +
    "<th>商品分类ICON</th>" +
    "<th>排序</th>" +
    "<th>创建时间</th>" +
    "</tr>";
var tmpl = "<tr class='odd gradeX'><td class='display'>${0}</td><td>${1}</td><td >${2}</td><td >${3}</td><td >${4}</td></tr>";
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
                tmpl.replace("${0}", item.id).replace("${1}", item.name).replace("${2}", "<img src='" + item.icon + "' style='width: 50px;height: 50px'>").replace("${3}", item.rank).replace("${4}", tool.formatDate(item.createTime))
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