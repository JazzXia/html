SUCCESS = 200;
ERROR = 403;
$(function(){
    getvCode();
    $("#verifyimg").click(getvCode);
    $("#loginbutton").click(login);
    $("#exampleInputEmail").blur(checkName);
    $("#exampleInputPassword").blur(checkPassword)
});



function checkPassword() {
    var password = $("#exampleInputPassword").val();
    var rule = /^\w{6,20}$/;
    if (!rule.test(password)) {
        $("#exampleInputPassword").next().html("6~20个字符");
        return false
    }
    $("#exampleInputPassword").next().empty();
    return true
}
function checkName() {
    var username = $("#exampleInputEmail").val();
    var rule = /^\w{6,20}$/;
    if (!rule.test(username)) {
        $("#exampleInputEmail").next().html("6~20个字符");
        return false
    }
    $("#exampleInputEmail").next().empty();
    return true
}

function login() {
    var url = "http://192.168.0.105:8080/api-system/role/login";
    var userName = $("#exampleInputEmail").val();
    var password = $("#exampleInputPassword").val();
    var code = $("#code").val();
    var n = checkPassword() + checkName();
    if (n != 2) {
        return
    }
    var data = {
        userName : userName,
        password : password,
        code : code
    };
    $.ajax({
        url : url,
        data : data,
        type : "post",
        dataType : "json",
        beforeSend:function(XMLHttpRequest){
            loadingFlag= layer.msg('正在登录中，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:60000 });
       },
        success : function(result) {
            layer.close(loadingFlag);
            if (result.code == SUCCESS) {
                var user = result.data;
                //console.log(user.token)
                addCookie("token", user.user.token);
                addCookie("id",user.user.userId);
                addCookie("roleType", user.user.roleType);
                addCookie("name", user.user.nickName);
                addCookie("userName",user.user.username);
                layer.msg("登录成功",{icon:1});
                setInterval(function(){
                    location.href = "/index.html";
                },1000);

            } else {
                var msg = result.msg;
                if (result.code == ERROR) {
                    console.log(msg);
                    layer.msg(msg,{icon:0});
                    // $("#exampleInputPassword").next().html(msg);
                } else {
                 layer.msg(msg,{icon:2})
                }
            }
        },
        error : function(e) {
             layer.msg("网络连接异常",{icon:2})
        }
    })
};




/**
* 获取验证码
* 将验证码写到login.html页面的id = verifyimg 的地方
*/
function getvCode() {
   document.getElementById("verifyimg").src = timestamp("http://192.168.0.105:8080/api-system/role/verifyCode");
}
//为url添加时间戳
function timestamp(url) {
   var getTimestamp = new Date().getTime();
   if (url.indexOf("?") > -1) {
       url = url + "&timestamp=" + getTimestamp
   } else {
       url = url + "?timestamp=" + getTimestamp
   }
   return url;
};