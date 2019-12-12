

$(function() {

  function render() {
    //  一进入页面, 发送 ajax 请求, 获取购物车数据  
    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/cart/queryCart",
        dataType: "json",
        success: function( info ) {
          console.log( info )
          if ( info.error === 400 ) {
            // 未登录
            location.href = "login.html";
            return;
          }

          // 已登录, 可以拿到数据, 通过模板渲染
          var htmlStr = template("cartTpl", { arr: info } );
          $('.lt_main .mui-table-view').html( htmlStr );

          // 渲染完成, 关闭下拉刷新
          mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
        }
      });
    }, 500);
  }


  //  配置下拉刷新功能
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper", 
      down : {
        auto: true, 
        callback: function() {
          console.log( "下拉刷新了" );
          // 发送 ajax 请求, 获取数据, 进行渲染
          render();
        }
      }
    }
  });



  //  删除功能
  $('.lt_main').on("tap", ".btn_del", function() {
    var id = $(this).data("id");
    // 发送请求
    $.ajax({
      type: "get",
      url: "/cart/deleteCart",
      data: {
        id: [ id ]
      },
      dataType:"json",
      success: function( info ) {
        console.log( info );
        if ( info.success ) {
          // 删除成功
          // 调用一次下拉刷新
          mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
        }
      }
    })
  });



  // 4. 编辑功能
  $('.lt_main').on("tap", ".btn_edit", function() {
    var obj = this.dataset;
    var id = obj.id;

    var htmlStr = template( "editTpl", obj );

    // mui 将模板中的 \n 换行标记, 解析成 <br> 标签, 就换行了
    // 需要将模板中所有的 \n 去掉
    htmlStr = htmlStr.replace( /\n/g, "" );

    // 弹出确认框
    mui.confirm( htmlStr , "编辑商品", [ "确认", "取消" ], function( e ) {

      if ( e.index === 0 ) {
        // 点击是的确认按钮,
        var size = $('.lt_size span.current').text();  // 尺码
        var num = $('.mui-numbox-input').val(); // 数量

        $.ajax({
          type: "post",
          url: "/cart/updateCart",
          data: {
            id: id,
            size: size,
            num: num
          },
          dataType: "json",
          success: function( info ) {
            console.log( info );
            if ( info.success ) {
              // 下拉刷新一次即可
              mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
            }
          }
        })
      }

    });

    // 进行数字框初始化
    mui(".mui-numbox").numbox();

  });


  // 5. 让尺码可以被选
  $('body').on("click", ".lt_size span", function() {
    $(this).addClass("current").siblings().removeClass("current");
  })
})