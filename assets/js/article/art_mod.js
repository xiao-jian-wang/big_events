$(function() {
    let form = layui.form
    let layer = layui.layer

    // 获取存储的数据
    let detail = localStorage.getItem('mod')
    detail = JSON.parse(detail)


    // console.log(detail);
    form.val('form_pub', detail)
    console.log(detail.cate_id);
    initSelect()

    // let select = $('select')[0]
    // 初始化分类下拉菜单方法
    function initSelect() {
        $.ajax({
            url: '/my/cate/list',
            method: 'GET',
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('获取分类失败!')
                }
                // console.log(res);
                let htmlStr = template('put_sele', res)

                // console.log(htmlStr);
                $('[name="cate_id"]').html(htmlStr)
                form.render() //通知layui 重新渲染筛选框里面的内容
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击选择封面按钮 模拟点击选择文件 Input
    $('#pub_choose').on('click', function() {
        $('#cover').click()
    })

    // 监听选择文件 input 的 change 事件
    $('#cover').on('change', function(e) {
        // console.log(e);
        // 获取到文件的列表数组
        let file = e.target.files

        // 判断用户是否选择了文件
        if (file.length === 0) {
            return
        }
        // 根据文件 创建相应的 url 地址
        let newImgURL = URL.createObjectURL(file[0])

        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 设置默认的状态 为 已发布
    let stateStart = '已发布'

    // 为'存为草稿'按钮添加点击事件
    $('#pub_save3').on('click', function() {
        // 修改状态为  草稿
        stateStart = '草稿'
    })

    // 监听更新表单的提交事件
    $('#form_mod').on('submit', function(e) {
        // 阻止表单提交时的默认行为
        e.preventDefault()

        // 基于 form表单 创建一个 FormData 对象
        let fd = new FormData($(this)[0])

        fd.append('id', detail.id)

        // 把状态添加到 fd 中
        fd.append('state', stateStart)

        // 将封面裁剪之后的照片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到 fd 中
                fd.append('cover_img', blob)
                publishArticle(fd)
                    // fd.forEach(function(value, key) {
                    //     console.log(key, value);
                    // })
            })
    })

    // 定义一个发布文章方法
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/info',
            method: 'PUT',
            data: fd,
            // 当向服务器发送 FormData 格式的数据时
            // 必须添加下面两个配置项
            contentType: false,
            processData: false,
            success(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('修改文章失败!')
                }
                layer.msg('修改文章成功!')

                // 文章发布成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})