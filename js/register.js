SUCCESS = 200;
ERROR = 403;
$(function(){
    $("#registButton").click(registAction);
    $("#exampleInputUserName").blur(checkName);
    $("#exampleInputPassword").blur(checkPassword);
    $("#exampleInputEmail").blur(checkMailaddress);
    $("#exampleRepeatPassword").blur(checkRepeatPwd);
});

function checkRepeatPwd(){
    var password = $("#exampleInputPassword").val();
    var repeat = $("#exampleRepeatPassword").val();
    if(password != repeat){
        $("#exampleRepeatPassword").next().html("两次输入的密码不相同");
        return false;
    }
    $("#exampleRepeatPassword").next().empty();
    return true
}

function checkMailaddress() {
	var emailaddress = $("#exampleInputEmail").val();
	var rule = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (!rule.test(emailaddress)) {
		layer.msg("不符合邮箱格式!",{icon: 0});
		return false
    }else{
        // 发送验证码倒计时60s
        $(function() {
            sendEmail();
            var btn = $("#tel_btn");
            $(function() {
                btn.click(settime);
            })
            var countdown = 60;//倒计时总时间，为了演示效果，设为5秒，一般都是60s
            function settime() {
                if (countdown == 0) {
                    btn.attr("disabled", false);
                    btn.html("获取验证码");
                    btn.removeClass("disabled");
                    countdown = 60;
                    return;
                } else {
                    btn.addClass("disabled");
                    btn.attr("disabled", true);
                    btn.html("重新发送(" + countdown + ")");
                    countdown--;
                }
                setTimeout(settime, 1000);
            }
        });
        return true
    }

}


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
    var username = $("#exampleInputUserName").val();
    var rule = /^\w{6,20}$/;
    if (!rule.test(username)) {
        $("#exampleInputUserName").next().html("6~20个字符");
        return false
    }
    $("#exampleInputUserName").next().empty();
    return true
}



//sendEmail
function sendEmail(){
    var url = "http://127.0.0.1:8080/api-system/role/sendEmail";
    var userName = $("#exampleInputUserName").val();
    var emailaddress = $("#exampleInputEmail").val();
    var data = {
        username : userName,
        userEmail : emailaddress
    };
    $.ajax({
        url : url,
        data :JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        type : "post",
        dataType : "json",
        success : function(result) {
            layer.msg("发送成功!",{icon:0})
        }
    })
}

function registAction() {
    var url = "http://127.0.0.1:8080/api-system/role/regist";
    var userName = $("#exampleInputUserName").val();
    console.log(userName);
    var password = $("#exampleInputPassword").val();
    var emailaddress = $("#exampleInputEmail").val();
    var code = $("#exampleCode").val();
    var nickName = $("#exampleFirstName").val()+$("#exampleLastName").val();
    var n = checkPassword() + checkName()+checkMailaddress()+checkRepeatPwd();
    if (n != 4) {
        return
    }
    var data = {
        username : userName,
        password : password,
        nickName : nickName,
        userEmail : emailaddress,
        token : code
    };
    $.ajax({
        url : url,
        data : data,
        type : "post",
        dataType : "json",
        beforeSend:function(XMLHttpRequest){
            loadingFlag= layer.msg('正在注册中，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:60000 });
       },
        success : function(result) {
            layer.close(loadingFlag);
            if (result.code == SUCCESS) {
                layer.msg("注册成功",{icon:1});
                setInterval(function(){
                    location.href = "/login.html";
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
        }
    })
};

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