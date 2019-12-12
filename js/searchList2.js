$(function() {
  var currentPage = 1;  // 当前页
  var pageSize = 2;    // 每页多少条

 
  function render( callback ) {


    var params = {};
    // 1. 必传的 3 个参数
    params.proName = $('.search_input').val();
    params.page = currentPage;
    params.pageSize = pageSize;

    // 2. 两个可传可不传的参数
    //    (1) 通过判断有没有高亮元素, 决定是否需要排序
    //    (2) 通过箭头方向判断, 升序还是降序  1升序，2降序
    var $current = $('.lt_sort a.current');
    if ( $current.length > 0 ) {
      // 有高亮的, 需要进行排序
      var sortName = $current.data("type");
      var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
      params[ sortName ] = sortValue;
    }

    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function( info ) {
          console.log( info );
          callback && callback( info );
        }
      })
    }, 500 );

  }



  // 功能: 获取地址栏参数赋值给 input
  var key = getSearch("key");
  $('.search_input').val( key );
  // render();

  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper", 
      // 配置下拉刷新
      down : {
        // 配置进入页面, 自动下拉刷新一次
        auto: true,
        callback : function(){
          console.log( "发送 ajax 请求, 进行页面渲染" );

          // 加载第一页的数据
          currentPage = 1;

          // 拿到数据后, 需要执行的方法是不一样的, 所以通过回调函数的方式, 传进去执行
          render(function( info ) {
            var htmlStr = template("productTpl", info );
            $('.lt_product').html( htmlStr );

            // ajax 回来之后, 需要结束下拉刷新, 让内容回滚顶部
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();


            // 第一页数据被重新加载之后, 又有数据可以进行上拉加载了, 需要启用上拉加载
            mui(".mui-scroll-wrapper").pullRefresh().enablePullupToRefresh();
          });
        }
      },

      // 配置上拉加载
      up : {
        callback: function() {
          console.log( "执行了上拉加载" );
          // 需要加载下一页的数据, 更新当前页
          currentPage++;
          render(function( info ) {
            var htmlStr = template("productTpl", info );
            $('.lt_product').append( htmlStr );

            // 当数据回来之后, 需要结束上拉加载
            if ( info.data.length === 0 ) {
              // 没有更多数据了, 显示提示语句
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( true );
            }
            else {
              // 还有数据, 正常结束上拉加载
              mui(".mui-scroll-wrapper").pullRefresh().endPullupToRefresh( false );
            }

          });
        }
      }
    }
  });




  // 功能2: 点击搜索按钮, 实现搜索功能
  $('.search_btn').click(function() {
    var key = $('.search_input').val(); // 获取搜索关键字
    if ( key.trim() === "" ) {
      mui.toast("请输入搜索关键字");
      return;
    }

    // 调用 pulldownLoading 执行下拉刷新
    mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading()

    var history = localStorage.getItem("search_list") || '[]'; 
    var arr = JSON.parse( history ); 

 
    var index = arr.indexOf( key );
    if ( index != -1 ) {
      arr.splice( index, 1 );
    }
    if ( arr.length >= 10 ) {
      arr.pop();
    }
    arr.unshift( key );
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
  })



  // 功能: 添加排序功能

  $('.lt_sort a[data-type]').on("tap", function() {
    if ( $(this).hasClass("current") ) {
      // 切换箭头方向
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    }
    else {
      $(this).addClass("current").siblings().removeClass("current");
    }
    // 执行一次下拉刷新
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  });



  // 功能: 点击每个商品实现页面跳转
  $('.lt_product').on("tap", "a", function() {
    var id = $(this).data("id");
    location.href = "product.html?productId=" + id;
  });



});