$(function() {
    // 点击'去注册账号'事件
    $("#link_reg").on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击'去登陆'事件
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layui 中获取 form
    let form = layui.form

    // 从 layui 中获取 layer
    let layer = layui.layer

    //通过 form.verify() 函数自定义检验规则
    form.verify({
        // 自定义了一个叫做 pwd 的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        // 检验两次密码是否一致
        repwd: function(value) {
            // 获取密码框的内容
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次输入的密码不一致！'
            }
        }
    })

    // 监听注册表单提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault() //阻止表单提交时的默认跳转行为

        let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val(), repassword: $('#form_reg [name=repassword]').val() }

        // 发起 ajax 的 post 请求  3008 api/reg
        $.post('/api/reg', data, function(res) {
            if (res.code !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功!')

            // 模拟人的点击行为
            $('#link_login').click()
        })
    })

    // 监听登录表单提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault() //阻止默认跳转行为
        $.ajax({
            url: '/api/login',
            method: 'POST',

            // 快速获取表单数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('登录失败!')
                }
                layer.msg('登录成功!')

                // console.log(res.token);
                // 登录成功后，把得到的 token 字符串保存到 localStorage 中
                localStorage.setItem('token', res.token)

                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})