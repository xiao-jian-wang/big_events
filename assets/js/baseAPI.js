// 在每次调用get post ajax 请求之前都会调用这个函数
$.ajaxPrefilter(function(options) {
    // 在发送请求之前 统一先拼接路径
    options.url = 'http://www.liulongbin.top:3008' + options.url

    // 统一为有权限的请求 设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }

    // 全局同意挂载 complete 回调函数
    options.complete = function(res) {
        if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
            console.log(11);
            // 强制清除本地的token
            localStorage.removeItem('token')

            // 跳转到登录页面
            location.href = '/login.html'
        }
    }
})