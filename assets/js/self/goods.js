/**
 * Created by Administrator on 2017/5/16 0016.
 */
var url = baseUrl +"/goods/list";
var thead="<tr>"+
    "<th><input type='checkbox' value='all' id='chkAll'></th>"+
    "<th>商品名</th>"+
    "<th>商家原价</th>"+
    "<th>商品价格</th>"+
    "<th>图片</th>"+
    "<th>商品详情</th>"+
    "<th>库存</th>"+
    "<th>状态</th>"+
    "<th>创建时间</th>"+
    "</tr>";
var tmpl = "<tr class='odd gradeX'><td>${0}</td><td>${1}</td><td >${2}</td><td >${3}</td><td >${4}</td><td>${5}</td><td>${6}</td><td>${7}</td><td>${8}</td></tr>";
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

var laypage = layui.laypage;
laypage(setting);
//模拟渲染
var render = function (data, tmpl) {
    data = tool.formatValue(data);
    var arr = [];
    console.log("render : " + data);
//                var thisData = data.concat().splice(curr*nums-nums, nums);
    layui.each(data, function (index, item) {
        arr.push(
            tmpl.replace("${0}","<input type='checkbox' name='subChk' value='"+item.id+"'/>").replace("${1}", item.name).replace("${2}", item.originalPrice+"元").replace("${3}", item.price+"元").
            replace("${4}", "<img src='"+item.icon+"' style='width: 50px;height: 50px'>").replace("${5}", "暂无").replace("${6}", item.stock).replace("${7}", item.statusName).replace("${8}", tool.formatDate(item.createTime))
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
                        $("#thead_goodslist").html(thead);
                        $("#biuuu_city_list").html(render(data, tmpl));
                        if (!first) {
                            load(url, option);
                        }
                    }
                });
            } else {
            }
        },
        error: function () {
            alert("异常！");
        }
    });

}
layui.use(['laypage', 'layer'], function () {
    load(url, option);
});

$(document).on('click.bs.carousel.data-api','#chkAll',function (e){
    $(":checkbox").attr("checked",$(this)[0].checked);
});

$(document).on('click.bs.carousel.data-api','#btnDel',function (e){
    // 判断是否至少选择一项
    var checkedNum = $("input[name='subChk']:checked").length;
    if(checkedNum == 0) {
        layer.confirm('请选择至少一项！',
            function(index){
                layer.close(index);
            });
        return;
    }
    // 批量选择
    layer.confirm('确定要删除所选项目?',
        function (index) {
            var checkedList = new Array();
            $("input[name='subChk']:checked").each(function () {
                console.info($(this).val());
                checkedList.push($(this).val());
            });
            console.info(checkedList.join(","));
            $.ajax({
                type: "POST",
                url: baseUrl + "/goods/batchDel",
                data: {'ids': [checkedList.join(",")]},
                success: function (result) {
                    $("[name ='subChk']:checkbox").attr("checked", false);
                    load(url, option);
                }
            });
            layer.close(index);
        });
});

$(document).on('click.bs.carousel.data-api','#btnAdd',function (e){
    // tool.layer("test",[100,100],"http://localhost:63342/boss/user/userlist.html","http://localhost:63342/boss/user/userlist.html","http://localhost:63342/boss/user/userlist.html");
});