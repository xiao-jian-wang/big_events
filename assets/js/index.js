$(function() {
    // 获取用户基本信息
    grtUsersInfo()

    // 点击按钮 退出页面
    $("#btnLogout").on('click', function() {

        // 提示用户是否退出
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function(index) {
            // 清除本地的token
            localStorage.removeItem('token')

            // 重新跳转到登录页面
            location.href = '/login.html'

            // 关闭提示框
            layer.close(index);
        });
    })

})

// 获取用户基本信息函数
function grtUsersInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',

        // headers 就是请求头配置对象
        // headers: { Authorization: localStorage.getItem('token') },
        success(res) {
            console.log(res)
            if (res.code !== 0) {
                return layui.layer.mes('用户获取失败')
            }
            // 渲染用户头像
            renderAvatar(res.data)
        },

        // 无论成功还是失败都会调用的函数
        // complete(res) {
        //     console.log(res);
        //     if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
        //         console.log(11);
        //         // 强制清除本地的token
        //         localStorage.removeItem('token')

        //         // 跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户头像函数
function renderAvatar(user) {
    // 获取用户的名称
    let name = user.nickname || user.username

    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name)

    // 渲染头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.avatar-text').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.avatar-text').html(first).show()
    }
}