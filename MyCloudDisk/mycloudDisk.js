var SUCCESS = 200;
var ERROR = 404;
var FAILURE = 500;
$(function () {
    $("input[type='file']").change(function(){
        console.log(getPath($("#uploadInfo").val()));
    });
    $("#checkboxinfo").click(judgeIsChecked);
    if(!cookie('checked')){
        $("#tipsinfo").modal("show");
    }
    showDiskInfo();
    setInterval(function(){
        showDiskInfo();
    },60000);
    $("#homeFile").click(showDiskInfo);
     $("#downloadButton").click(downloadOption);
     $("#deleteButton").click(deleteOption);
     $("#createDirInfo").click(createNewDir);
});


function getPath(obj) {
    if (obj) {
        if(window.navigator.userAgent.indexOf("MSIE") >= 1){
            obj.select();
            return document.selection.createRange().text;
    } else if(window.navigator.userAgent.indexOf("Firefox") >= 1){
        if (obj.files) {
            return obj.files.item(0).getAsDataURL();
        }
        return obj.value;
    }
    return obj.value;
}}

function showPath(){
    console.log($("#uploadInfo").val());
}


function judgeIsChecked(){
    if($('#checkboxinfo').is(':checked')){
        addCookie("checked", "true");
        setInterval(function(){
            location.href = "MyCloudDisk.html";
        },1000);
    }
}

function createNewDir(){
    var current = $("#currentFile").html();
    var inputName = $("#newFileName").val();
    if(current != " "){
        pathStr = "/"+cookie("userName")+"/"+current+"/"+inputName;
   }else{
        pathStr = "/"+cookie("userName")+"/"+inputName;
   }
    var data = {remoteDir:pathStr};
    $.ajax({
        url : "http://192.168.0.105:8080/api-diskinfo/disk/createDir",
        headers: {
            'token':cookie('token')
        },
        data : data,
        type : "POST",
        dataType : "json",
        async: true,
        beforeSend:function(XMLHttpRequest){
            loadingFlag= layer.msg('正在新建远程文件夹，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:600000 });
       },
        success : function(result) {
            layer.close(loadingFlag);
            if (result.code == SUCCESS) {
                var info = result.data;
                layer.msg("新增成功！",{icon:1});
                setInterval(function(){
                    location.href = "MyCloudDisk.html";
                },2000);
            } else {
                if (result.code == FAILURE)
                {
                    layer.msg(result.msg,{icon:0})
                }
            }
        },
        complete: function () { //完成加载后执行
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


function deleteOption(){
    for(var i = 0 ; i < $(".select").length ; i++){
        if($('.selected'+i).attr("data-show")=="yes"){
            var currentFile = $('.selected'+i).attr("value");
            var current = $("#currentFile").html();
            var detail = currentFile.split(".");
            var pathStr = null;
            if(detail[1]==null){
                layer.msg("未选择要删除的文件!",{icon:2});
            }else{
                if(current != " "){
                     pathStr = "/"+cookie("userName")+"/"+current+"/"+currentFile;
                }else{
                     pathStr = "/"+cookie("userName")+"/"+currentFile;
                }
                var data = {pathstr:pathStr};
                $.ajax({
                    url : "http://192.168.0.105:8080/api-diskinfo/disk/deleteFile",
                    headers: {
                        'token':cookie('token')
                    },
                    data : data,
                    type : "GET",
                    dataType : "json",
                    async: true,
                    beforeSend:function(XMLHttpRequest){
                        loadingFlag= layer.msg('正在删除远程文件，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:600000 });
                   },
                    success : function(result) {
                        layer.close(loadingFlag);
                        if (result.code == SUCCESS) {
                            var info = result.data;
                            layer.msg("删除成功！",{icon:1});
                            setInterval(function(){
                                location.href = "MyCloudDisk.html";
                            },2000);
                        } else {
                            if (result.code == ERROR)
                            {
                                layer.msg(result.msg,{icon:0})
                            }
                        }
                    },
                    complete: function () { //完成加载后执行
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
        }else{
            layer.msg("未选择要删除的文件!",{icon:2});
        }
    }
}



function downloadOption(){
    for(var i = 0 ; i < $(".select").length ; i++){
        if($('.selected'+i).attr("data-show")=="yes"){
            var currentFile = $('.selected'+i).attr("value");
            var current = $("#currentFile").html();
            var detail = currentFile.split(".");
            if(detail[1]==null){
                layer.msg("文件夹不允许下载!",{icon:2});
            }else{
                if(current != " "){
                    var pathStr = "/"+cookie("userName")+"/"+current+"/"+currentFile;
                }else{
                    var pathStr = "/"+cookie("userName")+"/"+currentFile;
                }
                var direct = "d:/"+currentFile;
                var data = {pathstr:pathStr,direct:direct};
                $.ajax({
                    url : "http://192.168.0.105:8080/api-diskinfo/disk/download",
                    headers: {
                        'token':cookie('token')
                    },
                    data : data,
                    type : "GET",
                    dataType : "json",
                    beforeSend:function(XMLHttpRequest){
                        loadingFlag= layer.msg('正在下载数据【D盘】，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:600000 });
                   },
                    success : function(result) {
                        layer.close(loadingFlag);
                        if (result.code == SUCCESS) {
                            var info = result.data;
                            layer.msg(info);
                        } else {
                            if (result.code == ERROR)
                            {
                                layer.msg(result.msg,{icon:0})
                            }
                        }
                    },
                    complete: function () { //完成加载后执行
                        layer.msg("下载完成!",{icon:1}); //完成加载后关闭loading
                    },
                    error : function(e) {
                        layer.msg("当前服务器异常,请稍后重试",{icon:2});
                    }
                })
            }
        }
    }
}




function showDiskInfo() {
    $(".diskinfo").empty();
    $("#currentFile").html(" ");
    var data = {pathstr:"/"+cookie("userName")};
    $.ajax({
        url : "http://192.168.0.105:8080/api-diskinfo/disk/list",
        headers: {
            'token':cookie('token')
        },
        data : data,
        type : "GET",
        dataType : "json",
        beforeSend:function(XMLHttpRequest){
            loadingFlag= layer.msg('正在读取数据，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:60000 });
       },
        success : function(result) {
            layer.close(loadingFlag);
            if (result.code == SUCCESS) {
                var info = result.data;
                showAllDiskInfo(info);
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


function doubleclick(detailInfo){
    $(".diskinfo").empty();
    var data = {pathstr:"/"+cookie("userName")+"/"+detailInfo};
    $.ajax({
        url : "http://192.168.0.105:8080/api-diskinfo/disk/list",
        headers: {
            'token':cookie('token')
        },
        data : data,
        type : "GET",
        dataType : "json",
        beforeSend:function(XMLHttpRequest){
            loadingFlag= layer.msg('正在读取数据，请稍候……', { icon: 16, shade: 0.01,shadeClose:false,time:60000 });
       },
        success : function(result) {
            layer.close(loadingFlag);
            if (result.code == SUCCESS) {
                var info = result.data;
                $("#currentFile").html(detailInfo);
                showAllDiskInfo(info);
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
/**
 * 
 * window.open();
 * @param {*} detailInfo 
 */
function preview(detailInfo){
    $("#previewInfo").modal("show");
    var url = "ftp://123.207.237.59"+"/"+cookie("userName")+"/"+detailInfo;
    var html = 'http://123.207.237.59:8012/onlinePreview?url='+encodeURIComponent(url);
    $("#previewInfoIframe").attr("src",html)
}




function showAllDiskInfo(info){
    if(info.length >=0 ){
    for(var i=0 ;i < info.length; i++ ){
        var detail = info[i].fileName.split(".");
        if(info[i].fileType=="1"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/wenjian.png' class='icon' title='创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='doubleclick("+JSON.stringify(info[i].fileName)+")' >"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="jpg"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/jpg.gif' class='icon' alt='' class='icon' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="txt"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/txt.jpg' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="png"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/png.png' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="gif"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/gif.png' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="avi"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/avi.png' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="css"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/css.png' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="pdf"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/pdf.png' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="zip"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/zip.png' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="rar"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/rar.png' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="xlsx"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/icon1.png' class='icon' alt='asdsad' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else if(detail[1]=="pptx"){
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/icon2.png' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }else{
            $(".diskinfo").append(
                " <div class='box template selected"+i+"' data-show='no' value='"+info[i].fileName+"'>"
               +"<img src='images/ini.png' class='icon' alt='' title='大小:"+((info[i].fileSize)/1024).toFixed(3)+"KB;创建时间:"+myTime(info[i].timeStamp)+"' ondblclick='preview("+JSON.stringify(info[i].fileName)+")'>"
               +"<div><p title='"+info[i].fileName+"'>"+info[i].fileName+"</p><input type='text' class='none'></div>"
               +"<img src='images/select.png' class='select' alt=''></div>");
        }
    }

    $(".sousouInput").blur(function(){
        $(".sousuo").css({
            border:"1px solid #ccc"
        });
        $(".ss1").removeClass("focusState");
    });
    $(".sousouInput").focus(function(){
        $(".sousuo").css({
            border:"1px solid #9cf"
        });
        $(".ss1").addClass("focusState");
    });
    $(".zuijinTitle").css({
        width:$(window).width()-237
    });
    $(".content").css({
       width:$(window).width()-237
    });

    $("#page_content").css({
        width:$(window).width()-237
    });

    $(".allIcon").click(function(){
        if($(this).attr("data-all")=="yes"){
            $(this).attr("src","images/select.png");
            $(".select").attr("src","images/select.png");
            $(this).attr("data-all","no");
            $(".template").attr("data-show","no");
            $(".template").removeClass("box2H");
        }else{
            $(this).attr("src","images/selectC.png");
            $(".template").attr("data-show","yes");
            $(this).attr("data-all","yes");
            $(".template").addClass("box2H");
            $(".select").attr("src","images/selectC.png");
        }
    });

    bindMyClick();

    function  bindMyClick(){
        $(".content .template").each(function(){
           $(this).click(function(){
               if($(this).attr("data-show")=="yes"){
                   $(this).removeClass(".box2C");
                   $(this).removeClass(".box2H");
                   $(this).find(".select").attr("src","images/select.png");
                   $(this).attr("data-show","no");

               }else {
                   $(this).addClass(".box2C");
                   $(this).addClass(".box2H");
                   $(this).find(".select").attr("src","images/selectC.png");
                   $(this).attr("data-show","yes");
                   $(this).find(".select").show();
               }
           });
        });
    }


    $(".contentMain .templateUrl").each(function(e){
        $(".contentMain .templateUrl").eq(e).click(function(){
            $(".contentMain p").removeClass("templateUrlClickP");
            $(".contentMain p").eq(e).addClass("templateUrlClickP");
       });
    });

    $(".yidong").click(function(){
        $(".moveBox").show();
    });
        $(".closeMove,.ok,.quxiao").click(function(){
           $(".moveBox").hide();
        });
    }else{
        $(".diskinfo").append("<p>当前文件夹下无内容</p>");
    }
}


function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1])
		}
	}
	return theRequest
}

//带有时区的转化二
function myTime(date) {

    var dateee = new Date(date).toJSON();

//        var dateee = new Date("2017-07-09T09:46:49.667").toJSON();

    var dd = new Date(+new Date(dateee) + 16 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    return dd;
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