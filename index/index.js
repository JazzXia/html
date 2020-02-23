var SUCCESS = 200;
var ERROR = 400;
$(function () {
    //controllerToken();
    showUserInfo();
    $('#logoutButton').click(logout);
});
// function controllerToken(){
//     if(null == cookie("token")){
//         layer.msg("登陆已过期,请重新登录",{icon:2});
        // setInterval(function(){
        //     location.href = "login.html";
        // },2000);
//     };
// }

function logout() {
    var data = {};
    $.ajax({
        url : "http://127.0.0.1:8080/api-system/role/logout",
        headers: {
            'token':cookie('token')
        },
        data : data,
        type : "GET",
        dataType : "json",
        beforeSend:function(XMLHttpRequest){
            loadingFlag= layer.msg('正在退出中，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:60000 });
       },
        success : function(result) {
            layer.close(loadingFlag);
            if (result.code == SUCCESS) {
                delCookie("token");
                delCookie("id");
                delCookie("roleType");
                layer.msg("已退出",{icon:1});
                setInterval(function(){
                    location.href = "login.html";
                },2000);
            } else {
                if (result.code == ERROR)
                {
                    layer.msg(result.msg,{icon:0})
                }
            }
        },
        error : function(e) {
            layer.msg("当前服务器异常,请稍后重试",{icon:2});
        }
    })
}


function showUserInfo() {
    var id = cookie("id");
    var data = {userId:id};
    $.ajax({
        url : "http://127.0.0.1:8080/api-system/role/detail",
        headers: {
            'token':cookie('token')
        },
        data : data,
        type : "GET",
        dataType : "json",
        beforeSend:function(XMLHttpRequest){
            loadingFlag = layer.msg('正在加载中，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:60000 });
       },
        success : function(result) {
            layer.close(loadingFlag);
            if (result.code == SUCCESS) {
                var info = result.data;
                $("#name").html(info.nickName);
                //$("#image").attr("src", "head_image/" + info.imageName);
            } else {
                if (result.code == ERROR) {
                    layer.msg(result.msg)
                }
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
                setInterval(function(){
                    location.href = "login.html";
                },2000);
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