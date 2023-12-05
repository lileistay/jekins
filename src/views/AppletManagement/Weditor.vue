<template>
    <div>
        <Editor @change="change" :menu="menu"></Editor>
    </div>
</template>
<script>
import Editor from '@/components/wangeditor/index'
export default {
    components: {
        Editor
    },
    data() {
        return {
            content: "",
            //配置菜单要哪个就显示哪个
            menu: [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                // 'emoticon',  // 表情
                'image',  // 插入图片
                // 'table',  // 表格
                // 'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ]
        }
    },
    methods: {
        change(val) {
            //将富文本传过来的值进行保存以便提交
            this.content = val;
        }
    }
}
</script>
<style scoped></style>