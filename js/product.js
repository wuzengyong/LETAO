

$(function() {

  // 功能: 获取地址栏的productId, 发送ajax请求, 进行商品渲染
  var productId = getSearch("productId");

  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId
    },
    dataType: "json",
    success: function( info ) {
      console.log( info );
      var htmlStr = template("productTpl", info);
      $('.lt_main .mui-scroll').html( htmlStr );

      // 手动进行轮播初始化
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 5000 
      });


      // 手动初始化 数字框
      mui(".mui-numbox").numbox()
    }
  })


  // 功能: 让尺码可以选中 
  $('.lt_main').on("click", ".lt_size span", function() {
    $(this).addClass("current").siblings().removeClass("current");
  });


  // 功能: 加入购物车功能
  $('#addCart').click(function() {
    // 获取尺码
    var size = $('.lt_size span.current').text();
    // 获取数量
    var num = $('.mui-numbox-input').val();

    if ( !size ) {
      mui.toast("请选择尺码");
      return;
    }

    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: productId,
        num: num,
        size: size
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        // 加入购物车操作登陆

        // (1) 未登录
        if ( info.error === 400 ) {        
          location.href = "login.html?retUrl=" + location.href;
        }

        // (2) 已登陆, 加入成功, 提示用户
        if ( info.success ) {
          mui.confirm( "添加成功", "温馨提示", ["去购物车", "继续浏览" ], function( e ) {

            if ( e.index === 0 ) {
              // 去购物车
              location.href = "cart.html";
            }

          })
        }
      }
    })

  })
});