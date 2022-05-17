$(function() {
    let form = layui.form

    // 自定义表单验证
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name = old_pwd]').val()) {
                return '新密码不能和原密码一样'
            }
        },
        differentPwd: function(value) {
            if (value !== $('[name = new_pwd]').val()) {
                return '确认密码和新密码不一样'
            }
        }
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单提交时的默认行为
        e.preventDefault()
        $.ajax({
            method: "PATCH",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success(res) {
                console.log(res);
                if (res.code !== 0) {
                    return layui.layer.msg('密码更改失败!')
                }
                layui.layer.msg('密码更改成功!')
            }
        })
    })
})