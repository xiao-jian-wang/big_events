// 在每次调用get post ajax 请求之前都会调用这个函数
$.ajaxPrefilter(function(options) {
    // 在发送请求之前 统一先拼接路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

})