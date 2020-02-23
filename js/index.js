/**
 * Created by Administrator on 2016/7/19.
 */
$(function(){
    var i=$(".cont").text();
    var j=$(".use").text();
    $(".left-menu-four-small-new").css({
        width:$(".left-menu-four-small").width()*((i-j)/i)
    })

 $('.right-content').css({
           height:$(window).height()

       })
      
});