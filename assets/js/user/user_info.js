$(function() {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '用户昵称必须在1 ~ 6个字符之间'
            }
        }
    })


    initUserInfo()

    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            success(res) {
                if (res.code !== 0) {
                    return layer.mes('用户初始化信息失败')
                }
                // console.log(res);
                layui.form.val("formUserInfo", res.data)
            }
        })
    }

    // 点击按钮 重置数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault() //阻止表单的默认重置行为
        initUserInfo()
    })

    监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault() //阻止表单提交时的默认行为
        $.ajax({
            url: '/my/userinfo',
            method: 'PUT',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if (res.code !== 0) {
                    return layer.mes('用户更新信息失败')
                }
                layer.mes('用户更新信息成功')
            }
        })
    })
})