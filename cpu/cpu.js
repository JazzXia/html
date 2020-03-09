var SUCCESS = 200;
var ERROR = 500;
$(function(){
    showCpuInfo();
    showMemoryInfo();
    setInterval(function(){
        showCpuInfo();
        showMemoryInfo();
    },60000);



});


function showMemoryInfo(){
    var url = "http://123.207.237.59:8900/memory/memoryInfo";
    var data = {};

    $.ajax({
        url : url,
        data : data,
        type : "get",
        headers: {
            'token':cookie('token')
        },
        dataType : "json",
        success : function(result) {
            if (result.code == SUCCESS) {
                var data = result.data;
                showMemory(data);
            } else {
                var msg = result.msg;
                if (result.code == ERROR) {
                    console.log(msg)
                } else {
                    alert(msg)
                }
            }
        },
        error : function(e) {
            alert("网络连接异常",e.msg)
        }
    });

}



function showMemory(data){
    var usedPercent=[];
    var createTime = [];
    //var cpuNum = [];
    for(var i = 0; i < data.length; i++){
        usedPercent.push((data[i].usedPercent).split("%")[0]);
        createTime.push(myTime(data[i].createTime));
        //cpuNum.push("CPU"+data[i].cpuNum+"号");
    }

    var colors = ['#009688', '#F8E71C', '#009688', '#FF9800', '#E91E63', '#50E3C2', '#CDDC39', '#03A9F4', '#9C27B0', '#2813FA'];
    option = {
        color: colors,
        title : {
            text: '内存信息数据监控'
        },
        animation: false,
        tooltip : {
            trigger: 'axis',
            formatter: function(params) {
                //console.log(params);
                var result = '';
                result += '<div class="tooltip-all"><span class="tooltip-date">'+params[0].name+'</span><div class="tooltip-detail">';
                params.forEach(function (item) {
                    result += '<div class="custom-tooltip"><span class="item-color" style="background-color:' + item.color + '"></span><span class="item-name">'+item.seriesName+'</span><span class="item-num">'+item.value+'</span></div>';
                });
                result += '</div></div>';
                return result;
            }
        },
        legend : {
            show: false,
            data: [
                'CPU'
            ]
        },
        grid : {
            top : 40,
            bottom: 70,
            right: 80,
            left: 34,
        },
        dataZoom : {
            show : true,
            realtime : true,
            showDetail: true,
            y: 380,
            height: 20,
            backgroundColor: 'rgba(255,255,255,0.5)',
            dataBackgroundColor: '#EEEEEE',
            fillerColor: 'rgba(252,249,215,0.5)',
            handleColor: 'rgba(240,225,28,0.8)',
            handleSize: '22',
            start : 25,
            end : 70
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : createTime,
                axisLine:{
                    lineStyle:{
                        color: '#EEEEEE',
                        width: 1,
                    }
                },
                axisLabel : {
                    textStyle: {
                        color: '#C8C6C6',
                        fontSize: 10
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value}',
                    textStyle: {
                        color: '#C8C6C6',
                        fontSize: 13
                    }
                },
                axisLine:{
                    lineStyle:{
                        color: '#EEEEEE',
                        width: 1,
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#EEEEEE']
                    }
                }

            }
        ],
        series : [
            {
                name:'CPU &nbsp;',
                smooth: true,
                type:'line',
                symbol:'none',
                data:usedPercent,
                lineStyle:{
                    normal:{
                        opacity: 1
                    }
                }
            }
        ]
    };


    //初始化echarts实例
    var myChart = echarts.init(document.getElementById('charts-memory-info'),"dark");

    $('.charts-left-list li').bind('click',function(){
        var index = $(this).index();
        if($(this).hasClass('state-selected')){
            $(this).removeClass('state-selected');
        }else{
            $(this).addClass('state-selected').attr('value',index);
        }


        for(var i=0; i<option.series.length; i++){
            option.series[i].lineStyle.normal.opacity = 0.1;
        }

        if ($('.state-selected').length==0){
            $('.charts-left-list li').each(function(){
                var all_val = $(this).index();
                option.series[all_val].lineStyle.normal.opacity = 1;
            });
        }else{
            $('.charts-left-list li.state-selected').each(function(){
                var the_val = $(this).attr('value');
                option.series[the_val].lineStyle.normal.opacity = 1;
            });
        }



        myChart.setOption(option);


    });

    //使用制定的配置项和数据显示图表
    myChart.setOption(option);

    window.onresize = function () {
        myChart.resize();
    };
}




function showCpuInfo(){
    var url = null;
    url = "http://123.207.237.59:8900/cpu/cpuInfo/1";

    var data = {};
    $.ajax({
        url : url,
        data : data,
        headers: {
            'token':cookie('token')
        },
        type : "get",
        dataType : "json",
        success : function(result) {
            if (result.code == SUCCESS) {
                var data = result.data;
                showinfo(data);
            } else {
                var msg = result.msg;
                if (result.code == ERROR) {
                    console.log(msg)
                } else {
                    alert(msg)
                }
            }
        },
        error : function(e) {
            alert("网络连接异常",e.msg)
        }
    });
}


function showinfo(data){
    var usedPercent=[];
    var createTime = [];
    //var cpuNum = [];
    for(var i = 0; i < data.length; i++){
        usedPercent.push((data[i].usedPercent).split("%")[0]);
        createTime.push(myTime(data[i].createTime));
        //cpuNum.push("CPU"+data[i].cpuNum+"号");
    }
   // console.log(cpuNum);

    //ECharts
    var colors = ['#7ED321', '#F8E71C', '#009688', '#FF9800', '#E91E63', '#50E3C2', '#CDDC39', '#03A9F4', '#9C27B0', '#2813FA'];
    option = {
        color: colors,
        title : {
            text: 'CPU信息数据监控'
        },
        animation: false,
        tooltip : {
            trigger: 'axis',
            formatter: function(params) {
                //console.log(params);
                var result = '';
                result += '<div class="tooltip-all"><span class="tooltip-date">'+params[0].name+'</span><div class="tooltip-detail">';
                params.forEach(function (item) {
                    result += '<div class="custom-tooltip"><span class="item-color" style="background-color:' + item.color + '"></span><span class="item-name">'+item.seriesName+'</span><span class="item-num">'+item.value+'</span></div>';
                });
                result += '</div></div>';
                return result;
            }
        },
        legend : {
            show: false,
            data: [
                'CPU'
            ]
        },
        grid : {
            top : 40,
            bottom: 70,
            right: 80,
            left: 34,
        },
        dataZoom : {
            show : true,
            realtime : true,
            showDetail: true,
            y: 380,
            height: 20,
            backgroundColor: 'rgba(255,255,255,0.5)',
            dataBackgroundColor: '#EEEEEE',
            fillerColor: 'rgba(252,249,215,0.5)',
            handleColor: 'rgba(240,225,28,0.8)',
            handleSize: '22',
            start : 25,
            end : 70
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : createTime,
                axisLine:{
                    lineStyle:{
                        color: '#EEEEEE',
                        width: 1,
                    }
                },
                axisLabel : {
                    textStyle: {
                        color: '#C8C6C6',
                        fontSize: 10
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value}',
                    textStyle: {
                        color: '#C8C6C6',
                        fontSize: 13
                    }
                },
                axisLine:{
                    lineStyle:{
                        color: '#EEEEEE',
                        width: 1,
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#EEEEEE']
                    }
                }

            }
        ],
        series : [
            {
                name:'CPU &nbsp;',
                smooth: true,
                type:'line',
                symbol:'none',
                data:usedPercent,
                lineStyle:{
                    normal:{
                        opacity: 1
                    }
                }
            }
        ]
    };


    //初始化echarts实例
    var myChart = echarts.init(document.getElementById('chartmain'),"dark");

    $('.charts-left-list li').bind('click',function(){
        var index = $(this).index();
        if($(this).hasClass('state-selected')){
            $(this).removeClass('state-selected');
        }else{
            $(this).addClass('state-selected').attr('value',index);
        }


        for(var i=0; i<option.series.length; i++){
            option.series[i].lineStyle.normal.opacity = 0.1;
        }

        if ($('.state-selected').length==0){
            $('.charts-left-list li').each(function(){
                var all_val = $(this).index();
                option.series[all_val].lineStyle.normal.opacity = 1;
            });
        }else{
            $('.charts-left-list li.state-selected').each(function(){
                var the_val = $(this).attr('value');
                option.series[the_val].lineStyle.normal.opacity = 1;
            });
        }



        myChart.setOption(option);


    });

    //使用制定的配置项和数据显示图表
    myChart.setOption(option);

    window.onresize = function () {
        myChart.resize();
    };
}


//带有时区的转化二
function myTime(date) {

    var dateee = new Date(date).toJSON();

//        var dateee = new Date("2017-07-09T09:46:49.667").toJSON();

    var dd = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    return dd;
}