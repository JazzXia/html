var SUCCESS = 200;
var ERROR = 500;
$(function () {
    listOptLogInfo();
});







function listOptLogInfo() {
    var url="http://192.168.0.105:8080/api-system//optLog/info";
    var accountId = cookie("id");
    // var optResult = $("#keySearch").val();
    var data = {accountId:accountId};

    $('#mytab').bootstrapTable({
        ajax : function (request) {
            $.ajax({
                type : "GET",
                url : url,
                // contentType: "application/json;charset=utf-8",
                // dataType:"json",
                data : data,
                async: true,
                headers: {
                    'token':cookie('token')
                },
                dataType : "json",
                success : function (result) {
                    request.success({
                        row : result.data
                    });
                    // console.log(result.data);
                    $('#mytab').bootstrapTable('load', result.data);
                },
                error:function(){
                    layer.msg("服务器异常",{icon:0});
                }
            });
        },
        striped: true, //是否显示行间隔色
        pageNumber: 1, //初始化加载第一页
        pagination: true,//是否分页
        sidePagination: 'client',//server:服务器端分页|client：前端分页
        pageSize: 10,//单页记录数
        pageList: [5, 10, 20, 30],//可选择单页记录数
        showRefresh: true,//刷新按钮
        columns: [ {
            title: '操作模块',
            field: 'moduleName',
            sortable: true
        }, {
            title: '操作ip',
            field: 'ip',
        }, {
            title: '操作信息',
            field: 'remark',
        }, {
            title: '操作结果',
            field: 'optResult',
        }, {
            title: '操作时间',
            field: 'operTime',
            sortable: true
        }]
    });

}