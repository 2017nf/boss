tool.gologin();
var url = baseUrl +"/user/list";
var thead="<tr>"+
    "<th>头像</th>"+
    "<th>用户ID</th>"+
    "<th>微信号</th>"+
    "<th>昵称</th>"+
    "<th>手机号</th>"+
    "<th>用户地址</th>"+
    "<th>注册时间</th>"+
    "</tr>";
var tmpl = "<tr class='odd gradeX'><td>${0}</td><td>${1}</td><td >${2}</td><td >${3}</td><td >${4}</td><td>${5}</td><td>${6}</td></tr>";
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
                tmpl.replace("${0}", "<img src='"+item.headImgUrl+"' style='width: 50px;height: 50px'>").replace("${1}", item.uid).replace("${2}", item.openId).
                replace("${3}", item.nickName).replace("${4}", item.phone).replace("${5}", item.addr).replace("${6}", tool.formatDate(item.createTime))
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
                            $("#thead_userlist").html(thead);
                            $("#tbody_userlist").html(render(data, tmpl));
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