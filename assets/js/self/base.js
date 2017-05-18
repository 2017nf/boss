/**
 * Created by Administrator on 2017/5/11 0011.
 */

// var baseUrl="https://www.sunnyflower.club/manage";
var baseUrl="http://192.168.2.222:8090/manage";

var tool={
    formatDate : function(timestamp) {
        var d = new Date(timestamp);
        var dformat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-')
            + ' ' + [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':');
        return dformat;
    },
    formatArrayValue : function (obj) {
        if (obj instanceof Array){
            for (var v in obj){
                obj[v]=this.formatValue(obj[v]);
            }
        }
        return obj;
    },
    formatValue : function (obj) {
        for (var v in obj){
            if(obj[v]==null || obj[v]=='null' || obj[v]== undefined){
                obj[v]="";
            }
        }
        return obj;
    }
}
