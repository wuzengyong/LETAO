

$(function() {




  // 功能: 列表渲染功能
  render();


  // 从本地存储中读取历史记录, 以数组的形式返回
  function getHistory() {
    // 如果没有读取到数据, 默认初始化成一个空数组
    var history = localStorage.getItem("search_list") || '[]';  // jsonStr
    var arr = JSON.parse( history );
    return arr;
  }
  
  // 读取数组, 进行页面渲染
  function render() {
    var arr = getHistory();
    var htmlStr = template( "historyTpl", { arr: arr } );
    $('.lt_history').html( htmlStr );
  }



  // 功能: 清空历史记录功能
  $('.lt_history').on("click", ".btn_empty", function() {
    mui.confirm("你确认要清空历史记录嘛?", "温馨提示", ["取消", "确认"], function( e ) {
      // e.index 可以获取所点击的按钮的索引
      if ( e.index === 1 ) {
        // 清空记录
        localStorage.removeItem( "search_list" );
        // 重新渲染
        render();
      }
    })

  });



  // 功能: 删除单条历史记录
  $('.lt_history').on("click", ".btn_del", function() {
    var that = this;

    mui.confirm("你确定要删除该条记录嘛?", "温馨提示", ["取消", "确认"], function( e ) {
      if ( e.index === 1 ) {
        // 获取下标
        var index = $(that).data("index");
        // 获取数组
        var arr = getHistory();
        arr.splice( index, 1 );
        // 转成 jsonStr, 存到本地存储
        localStorage.setItem("search_list", JSON.stringify( arr ) );
        // 页面重新渲染
        render();

      }
    })
  });




  // 功能: 添加历史记录功能
  $('.search_btn').click(function() {

    // 获取搜索关键字
    var key = $('.search_input').val().trim();
    if ( key === "" ) {
      mui.toast("请输入搜索关键字", {
        duration: 2000
      })
      return;
    }

    // 获取数组
    var arr = getHistory();
    var index = arr.indexOf( key );
    if ( index != -1 ) {
      // 说明在数组中可以找到重复的项, 且索引为 index
      arr.splice( index, 1 );
    }
    if ( arr.length >= 10 ) {
      // 删除最后一项
      arr.pop();
    }

    // 往数组最前面追加
    arr.unshift( key );
    // 转成json, 存到本地存储中
    localStorage.setItem( "search_list", JSON.stringify( arr ) );
    render();
    $('.search_input').val("");
    // 添加跳转, 跳转到产品列表页
    location.href = "searchList.html?key=" + key;
  })



});
