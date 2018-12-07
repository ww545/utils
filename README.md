工具文件
1、封装请求
2、图片转码
3、react常用函数
4、本地缓存封装
5、其他插件工具类


```javasript
  var i = 0;
  function recursiveFn () {
    i++;
    recursiveFn()
  }
  try{
    recursiveFn()
  }catch(err){
    alert(`i=${i}error:${err})
  }
