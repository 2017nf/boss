/**
 * Created by Administrator on 2017/5/11 0011.
 */

// var baseUrl="https://www.sunnyflower.club/manage";
var baseUrl = "http://192.168.2.222:8090/manage";

var tool = {
    formatDate: function (timestamp) {
        if(!timestamp){
            return "";
        }
        var d = new Date(timestamp);
        var dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
            + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');
        return dformat;
    },
    formatArrayValue: function (obj) {
        if (obj instanceof Array) {
            for (var v in obj) {
                obj[v] = this.formatObjValue(obj[v]);
            }
        }
        return obj;
    },
    formatObjValue: function (obj) {
        if (typeof obj == 'object') {
            for (var v in obj) {
                obj[v] = this.formatStrValue(obj[v]);
            }
        }
        return obj;
    },
    formatStrValue: function (str) {
        if (str == null || str == "null" || str == "undefined" || str == "") {
            str = "";
        }
        return str;
    },
    formatValue: function (obj) {
        if (typeof obj == 'object' && obj instanceof Array) {

            obj = this.formatArrayValue(obj);
            return obj;
        } else if (typeof obj == 'obj' && obj instanceof Object) {
            obj = this.formatObjValue(obj);
            return obj;
        } else if (typeof obj == 'string') {
            obj = this.formatValue(obj);
            return obj;
        }
        return obj;
    },

    layer : function (title,offset,area,content,cannelpage,okpage) {
        layer.open({
            type: 1,
            title: title,//不显示标题栏
            closeBtn: false,
            area:area,
            offset: offset,
            shade: 0.8,
            id: 'LAY_layuipro', //设定一个id，防止重复弹出
            resize: false,
            btn: ['取消', '确定'],
            btnAlign: 'c',
            moveType: 1, //拖拽模式，0或者1
            content: content,
            success: function (layero) {
                var btn = layero.find('.layui-layer-btn');
                btn.find('.layui-layer-btn0').attr({
                    href: cannelpage,
                    target: '_self'
                });
                btn.find('.layui-layer-btn1').attr({
                    href: okpage,
                    target: '_self'
                });
            }
        })
    }
}
