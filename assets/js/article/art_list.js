$(function() {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义一个查询参数
    let q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: '', //文章的发布状态
    }

    initTable() // 调用获取列表数据方法
    initSelect() // 调用初始化分类下拉菜单方法

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const newDate = new Date(date)

        let y = newDate.getFullYear()
        let m = newDate.getMonth() + 1
        let d = newDate.getDate()

        let hh = newDate.getHours()
        let mm = newDate.getMinutes()
        let ss = newDate.getSeconds()

        return y + '-' + addZero(m) + '-' + addZero(d) + ' ' + addZero(hh) + ':' + addZero(mm) + ':' + addZero(ss)
    }

    // 定义补零函数
    function addZero(n) {
        // if (n > 9) {
        //     return n
        // } else {
        //     return '0' + n
        // }

        return n > 9 ? n : '0' + n
    }

    // 获取列表数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取列表数据失败!')
                }
                let htmlStr = template('table_list', res)
                $('tbody').html(htmlStr)

                renderPage(res.total)

            }
        })
    }

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
                let htmlStr = template('select', res)

                // console.log(htmlStr);
                $('[name="cate_id"]').html(htmlStr)
                form.render() //通知layui 重新渲染筛选框里面的内容
            }
        })
    }

    // 监听筛选区域的表单提交事件
    $("#form_search").on('submit', function(e) {
        // 阻止表单提交时的默认行为
        e.preventDefault()

        // 获取表单提交时的分类 id 和状态
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 给 q 重新赋值
        q.cate_id = cate_id
        q.state = state

        // 重新渲染表格数据
        initTable()
    })

    // 定义分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'formPage', //分页容器的id 不需要加#
            count: total, //数据总数
            limit: q.pagesize, //每页显示的数据条数
            curr: q.pagenum, //默认被选中的页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7, 10],

            // 分页发生切换时 触发 jump 回调
            jump: function(obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                // console.log(obj.curr);
                q.pagenum = obj.curr //把新的页码值 赋值到 q
                q.pagesize = obj.limit
                    // debugger

                // console.log(q);
                // initTable()

                // 通过判断 first 的值 来判断 junp 的调用原因
                // 1.first 的值为 true,表示是通过 laypage.render 调用
                // 2.first 的值为 undefind,表示是通过切换页码调用
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过事件委托 给删除按钮添加点击事件
    $('tbody').on('click', '.btn_dtl', function() {
        let len = $('.btn_dtl').length

        let id = $(this).attr('data-id') //获得文章的 id

        // 询问用户是否确认删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/info?id=' + id,
                method: 'DELETE',
                success(res) {
                    // console.log(res);
                    if (res.code !== 0) {
                        return layer.msg('删除文章失败!')
                    }
                    layer.msg('删除文章成功!')

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index)
                }
            })
        })
    })

    // 添加点击编辑按钮事件
    $('tbody').on('click', '.btn_mod', function() {
        let id = $(this).attr('data-id')
        $.ajax({
            url: '/my/article/info',
            type: 'GET',
            data: {
                id
            },
            success(res) {
                let data = JSON.stringify(res.data)

                // console.log(data);
                localStorage.setItem('mod', data)
                location.href = '/article/art_mod.html'
            }
        })

    })
})