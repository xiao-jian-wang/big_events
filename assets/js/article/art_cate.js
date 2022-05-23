$(function() {
    let layer = layui.layer
    let form = layui.form

    initArtCateList()

    // 获取文章列表函数
    function initArtCateList() {
        $.ajax({
            url: '/my/cate/list',
            method: 'GET',
            success(res) {
                if (res.code !== 0) {
                    return layui.layer.msg('文章列表获取失败!')
                }
                // console.log(res);
                let htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    let flag = 0
        // 给添加类别按钮添加一个点击事件
    let indexAdd = null
    $('#btn_addCate').on('click', function() {
        flag = 0
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        })
    })

    // 给编辑按钮添加点击事件
    let id = 0
    let indexEdit = null
    $('tbody').on('click', '.btn_edit', function(e) {
        flag = 1
        id = $(this).attr('data-Id')
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_add').html()
        })
        $('#sure').html('确认编辑')
        console.log(id);
        showForm()
    })

    // 通过事件委托 监听弹出框的提交事件
    $('body').on('submit', '#form_add', function(e) {
        // 阻止表单提交时的默认行为
        e.preventDefault()
        if (flag === 0) {
            $.ajax({
                method: 'POST',
                url: '/my/cate/add',
                data: $(this).serialize(),
                success(res) {
                    if (res.code !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    layer.msg(res.message);
                    layer.close(indexAdd)
                    initArtCateList()
                }
            })
        } else if (flag === 1) {
            // showForm()
            $.ajax({
                method: 'PUT',
                url: '/my/cate/info',
                data: $(this).serialize(),
                success(res) {
                    // console.log(res);
                    if (res.code !== 0) {
                        return layer.msg('更新分类信息失败!')
                    }
                    initArtCateList()
                    layer.msg('更新分类信息成功!')
                    layer.close(indexEdit)

                }
            })
        }
    })

    // 给编辑修改数据的弹出框提交按钮添加点击事件
    // let indexEdit = null
    // $('tbody').on('click', '.btn_edit', function(e) {
    //     indexEdit = layer.open({
    //         type: 1,
    //         area: ['500px', '250px'],
    //         title: '修改文章分类',
    //         content: $('#dialog_edit').html()
    //     })

    // let id = $(this).attr('data-Id')
    // console.log(id);

    function showForm() {
        $.ajax({
            url: '/my/cate/info',
            method: 'GET',
            data: {
                id
            },
            success(res) {
                console.log(res)
                    // form.val('form_edit', res.data)
                $('[name=id]').val(res.data.id);
                $('[name=cate_name]').val(res.data.cate_name)
                $('[name=cate_alias]').val(res.data.cate_alias)
            }
        })
    }

    // })

    // 通过事件委托 监听修改类别的弹出框的提交事件
    // $('body').on('submit', '#form_edit', function(e) {


    // })

    // 通过事件委托 给删除按钮添加一个点击事件
    $('tbody').on('click', '.btn_delete', function() {
        let id = $(this).attr('data-Id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/cate/del' + '?id=' + id,
                type: 'DELETE',
                success(res) {
                    if (res.code !== 0) {
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功!')
                    initArtCateList()
                    layer.close(index);
                }
            })
        });

    })

})