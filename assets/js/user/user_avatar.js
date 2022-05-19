$(function() {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 为上传按钮添加点击事件
    $('#btnChoosrUp').on('click', function() {
        $('#file').click()
    })

    // 为 file 文件选择框添加一个改变事件
    $('#file').on('change', function(e) {
        // console.log(e);

        let fileList = e.target.files
        if (fileList.length === 0) {
            return layui.layer.msg('请选择照片!')
        }
        // 1.拿到用户选择的文件
        let file = e.target.files[0]

        // 2.将文件转换成路径
        let imgURL = URL.createObjectURL(file)

        // 3.重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 为确定按钮 绑定点击事件
    $('#btnSure').on('click', function() {
        // 1.拿到用户裁剪之后的头像
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2.调用接口 把头像传到服务器
        $.ajax({
            type: 'PATCH',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg('头像上传失败!')
                }
                layui.layer.msg('头像上传成功!')
                window.parent.grtUsersInfo()
            }
        })
    })
})