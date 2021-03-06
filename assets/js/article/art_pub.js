$(function() {
    let layer = layui.layer
    let form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/cate/list',
            success(res) {
                if (res.code !== 0) {
                    return layer.msg('文章类别初始化失败!')
                }
                // console.log(res);

                // 调用模板引擎 渲染分类下拉菜单
                let htmlStr = template('put_sele', res)
                $('[name="cate_id"]').html(htmlStr)
                form.render() //调用 form.render 方法 重新渲染
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
    $('#pub_save2').on('click', function() {
        // 修改状态为  草稿
        stateStart = '草稿'
    })

    let id = localStorage.getItem('id')
    if (id) { //表示是通过编辑进来的
        // console.log(id)

        $.ajax({
                url: '/my/article/info',
                type: 'GET',
                data: {
                    id
                },
                success(res) {
                    console.log(res);
                    layui.form.val('form_pub', res.data)
                    $('[name=cate_name]').val(res.data.cate_name)

                    // $('[name=id]').val(res.data.id);
                    // $('[name=cate_name]').val(res.data.cate_name)
                    // $('[name=cate_alias]').val(res.data.cate_alias)
                }
            })
            // 监听表单的提交事件
        $('#form_pub').on('submit', function(e) {
            // 阻止表单提交时的默认行为
            e.preventDefault()

            // 基于 form表单 创建一个 FormData 对象
            let fd = new FormData($(this)[0])

            // 把状态添加到 fd 中
            fd.append('state', stateStart)
            fd.append('id', id)

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
                    editorArticle(fd)
                })
        })
    } else {
        // 监听表单的提交事件
        $('#form_pub').on('submit', function(e) {
            // 阻止表单提交时的默认行为
            e.preventDefault()

            // 基于 form表单 创建一个 FormData 对象
            let fd = new FormData($(this)[0])

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
                })
        })
    }


    // 定义一个发布文章方法
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            method: 'POST',
            data: fd,
            // 当向服务器发送 FormData 格式的数据时
            // 必须添加下面两个配置项
            contentType: false,
            processData: false,
            success(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('添加文章失败!')
                }
                layer.msg('添加文章成功!')

                // 文章发布成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

    // 定义编辑文章的发布方法
    function editorArticle(fd) {
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
                localStorage.removeItem('id')

                location.href = '/article/art_list.html'
            }
        })
    }


})