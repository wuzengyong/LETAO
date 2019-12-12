
$(function() {

  //  进入页面发送 ajax 请求, 获取一级分类数据, 进行渲染
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function( info ) {
      console.log( info );
      var htmlStr = template("leftTpl", info);
      $('.lt_category_left ul').html( htmlStr );

      // 进入页面, 渲染第一个一级分类所对应的二级分类
      renderSecondById( info.rows[0].id );
    }
  });



  // 2. 点击一级分类, 渲染二级分类
  $('.lt_category_left').on("click", "a", function() {
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
    var id = $(this).data("id");
    renderSecondById( id );
  });



  // 方法: 用于根据一级分类 id 去渲染 二级分类
  function renderSecondById( id ) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        var htmlStr = template("rightTpl", info);
        $('.lt_category_right ul').html( htmlStr );
      }
    })

  }

});
