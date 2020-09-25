export  function  time(data ,format) {

    var date = {
        "M+": data.getMonth() + 1,
        "d+": data.getDate(),
        "h+": data.getHours(),
        "m+": data.getMinutes(),
        "s+": data.getSeconds(),
        "q+": Math.floor((data.getMonth() + 3) / 3),
        "S+": data.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (data.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

var getFormatTime = {
    // 获取当天开始时间戳
    getTodayStart:function(){
        var myDate = new Date();
        // 开始月份下标为0
        var nowMonth = parseInt(myDate.getMonth()) + parseInt(1);
        return Date.parse(myDate.getFullYear() + '/' + nowMonth + '/' + myDate.getDate()) / 1000;
    },
    // 获取时分
    getLocalTime: function (nS) {
        var newDate = new Date();
        newDate.setTime(nS * 1000);
        return newDate.format('hh:mm');
    },
    // 获取完整时间
    getCompleteTime: function (nS, spacer) {
        var newDate = new Date();
        newDate.setTime(nS * 1000);
        return newDate.format('yyyy/MM/dd hh:mm');
    },
    // 格式化时间
    format: function (timestampToday, spacer) {
        // 判断当天日期 规则2：当天信息不显示日期。如今天的信息显示时间：  14：25
        if (timestampToday > this.getTodayStart())
            return this.getLocalTime(timestampToday);
        // 判断昨天日期 规则3：昨天的信息需要标记。如：昨天 14：25
        else if (parseInt(timestampToday) + parseInt(86400) > this.getTodayStart())
            return '昨天 ' + this.getLocalTime(timestampToday);
        // 判断昨天以前 规则4：昨天以前的信息需要显示日期，如：2017年4月18日 14：25
        else
            return this.getCompleteTime(timestampToday, spacer);

    }
}