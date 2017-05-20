tool.gologin();
var url = baseUrl +"/order/list";
var thead="<tr>"+
    "<th>商品</th>"+
    "<th class='display'>订单ID</th>"+
    "<th>订单号</th>"+
    "<th>手机号</th>"+
    "<th>收件人</th>"+
    "<th>商品名称</th>"+
    "<th>商品价格</th>"+
    "<th>订单状态</th>"+
    "<th>支付类型</th>"+
    "<th>快递单号</th>"+
    "<th>收货地址</th>"+
    "<th>下单时间</th>"+
    "<th>发货时间</th>"+
    "</tr>";
var tmpl = "<tr class='odd gradeX'><td>${0}</td><td class='display'>${1}</td><td >${2}</td><td >${3}</td><td >${4}</td><td class='text-overflow'>${5}</td><td>${6}</td><td >${7}</td><td>${8}</td><td>${9}</td><td >${10}</td><td>${11}</td><td>${12}</td></tr>";
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
                tmpl.replace("${0}", "<img src='"+item.icon+"' style='width: 50px;height: 50px'>").replace("${1}", item.id).replace("${2}", item.orderNo).
                replace("${3}", item.phone).replace("${4}", item.userName).replace("${5}", item.goodsName).replace("${6}", item.price).
                replace("${7}", item.status).replace("${8}", item.payWay).replace("${9}", item.expressNo).replace("${10}", item.addr).
                replace("${11}",tool.formatDate(item.createTime)).replace("${12}",tool.formatDate(item.updateTime))
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
                            $("#thead_orderlist").html(thead);
                            $("#tbody_orderlist").html(render(data, tmpl));
                            if (!first) {
                                load(url, option);
                            }
                        }
                    });
                } else {
                }
            },
            error: function () {
                window.location.href=window.location.href;
            }
        });
    }
    load(url, option);
});