var SUCCESS = 200;
var ERROR = 400;
$(function () {
    showSystemInfo();
    showOperationInfo();
});

function showOperationInfo(){
    var data = {};
    $.ajax({
        url : "http://123.207.237.59:8900/cpu/basicsInfo",
        data : data,
        headers: {
            'token':cookie('token')
        },
        type : "GET",
        dataType : "json",
        beforeSend:function(XMLHttpRequest){
            loadingFlag = layer.msg('正在加载中，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:60000 });
       },
        success : function(result) {
            layer.close(loadingFlag);
            if (result.code == SUCCESS) {
                $("#OSName").html("当前服务器系统为:&nbsp;&nbsp;&nbsp;"+result.data.operationName);
                $("#OsVersion").html("当前服务器内核版本:&nbsp;&nbsp;&nbsp;"+ result.data.operationVersion);
                $("#OSCore").html("当前服务器的归属于:&nbsp;&nbsp;&nbsp;红帽的centos7");
                $("#OSOperation").html("当前服务器的供应商:&nbsp;&nbsp;&nbsp;腾讯云");
            } else {
                    layer.msg(result.msg)
            }
        },
        error : function(e) {
            if(cookie('token') == ""){
                    layer.msg("登陆已过期!",{icon:2});
                setInterval(function(){
                    location.href = "login.html";
                },2000);
            }else{
                layer.msg("当前服务器异常,请稍后重试",{icon:2});
            }
        }
    })
}


function showSystemInfo() {
    var data = {};
    $.ajax({
        url : "http://123.207.237.59:8900/cpu/basicsInfo",
        data : data,
        headers: {
            'token':cookie('token')
        },
        type : "GET",
        dataType : "json",
        beforeSend:function(XMLHttpRequest){
            loadingFlag = layer.msg('正在加载中，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:60000 });
       },
        success : function(result) {
            layer.close(loadingFlag);
            if (result.code == SUCCESS) {
                $("#jdkversion").html("当前服务器JDK版本:"+result.data.javaVersion);
                $("#supplier").html("当前JDK的供应商:"+ result.data.supplierName);
                $("#jvmMemory").html("当前JVM虚拟机内存:"+result.data.jvmMemory);
                $("#jvmFreeMemory").html("当前JVM虚拟机空闲内存:"+result.data.jvmFreeMemory);
            } else {
                    layer.msg(result.msg)
            }
        },
        error : function(e) {
            if(cookie('token') == ""){
                    layer.msg("登陆已过期!",{icon:2});
                setInterval(function(){
                    location.href = "login.html";
                },2000);
            }else{
                layer.msg("当前服务器异常,请稍后重试",{icon:2});
            }
        }
    })
}




function timetrans(date) {
    var date = new Date(date * 1000);
    var Y = date.getFullYear() + "-";
    var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date
            .getMonth() + 1)
        + "-";
    var D = (date.getDate() < 10 ? "0" + (date.getDate()) : date.getDate())
        + " ";
    var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours())
        + ":";
    var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
            .getMinutes())
        + ":";
    var s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
        .getSeconds());
    return Y + M + D + h + m + s
};