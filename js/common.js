


// 对页面中所有的区域滚动进行初始化
mui('.mui-scroll-wrapper').scroll({
  indicators: false, 
  deceleration: 0.0005 
});


// 配置轮播图自动轮播
var gallery = mui('.mui-slider');
gallery.slider({
  interval: 5000 
});


// 作用: 专门用于解析地址栏参数
function getSearch( k ) {
  var search = location.search;  

  search = decodeURI( search ); 

  search = search.splice( 1 ); 

  var arr = search.split( "&" ); 

  var obj = {};
  arr.forEach(function( v, i ) {  
    var key = v.split("=")[0]; 
    var value = v.split("=")[1]; 
    obj[ key ] = value;
  })

  return obj[ k ];
}
