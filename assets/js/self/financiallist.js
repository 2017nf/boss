tool.gologin();
var url = baseUrl +"/finance/list";
var thead="<tr>"+
    "<th class='display'>ID</th>"+
    "<th>订单号</th>"+
    "<th>流水类型</th>"+
    "<th>用户ID</th>"+
    "<th>金额</th>"+
    "<th>备注</th>"+
    "<th>创建时间</th>"+
    "</tr>";
var tmpl = "<tr class='odd gradeX'><td class='display'>${0}</td><td>${1}</td><td >${2}</td><td >${3}</td><td >${4}</td><td>${5}</td><td>${6}</td></tr>";
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
        data=tool.formatValue(data);
        var arr = [];
        console.log("render : " + data);
//                var thisData = data.concat().splice(curr*nums-nums, nums);
        layui.each(data, function (index, item) {
            arr.push(
                tmpl.replace("${0}",  item.id ).replace("${1}", item.orderNo).replace("${2}", item.type).
                replace("${3}", item.userId).replace("${4}", item.price).replace("${5}", item.remark).replace("${6}", tool.formatDate(item.createTime))
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
                            $("#thead_financiallist").html(thead);
                            $("#tbody_financiallist").html(render(data, tmpl));
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
    load(url, option);
});