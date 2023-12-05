<template>
  <div id="wangeditor">
    <div ref="editorElem">

    </div>
  </div>
</template>
<script>
import E from 'wangeditor'
import { Loading, Message } from 'element-ui'
const serverPath = process.env.VUE_APP_BASE_API+"/file"
export default {
  name: 'editorElem',
  data() {
    return {
      editor: null,
      editorContent: '',
      count: 0,//记录是删除图片还是新增图片
      removelist: [],//记录图片删除的地址
      countFlag: false,
      countFlags: false,
      contentHTML:"",
    }
  },
  // 监听富文本内容变化
  watch: {
    content(val) {
      this.removelist=[];
      console.log(val,'dsadasd')
      if(val=='<p><br/></p>'){
        let vals=document.querySelector('.w-e-text').children
        for(let i=0;i<vals.length;i++){
          vals[i].remove();
        }
      }
      //重复去更改会出现光标乱跳，加入此判断即可解决
      if (val !== this.editor.txt.html()) {
        
            if(val==''){
              this.editor.txt.html('')    
            }else{
              this.editor.txt.html(val)
            }
          
      }
    }
  },
  props: {
    content:{
      type:String,
      default:()=>{
        return ''
      }
    },
    catchData:{
      type:Function ,
    },
    menu: {
      type: Array,
      default: () => {
        return [          // 菜单配置
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
          'video', 
          'undo',  // 撤销
          'redo'  // 重复
        ]
      }
    },
    content:{
      type:String,
      default:()=>{
        return ''
      }
    }
  },
  created(){
      
  },
  mounted() {
    let that = this;
    this.editor = new E(this.$refs.editorElem)
    if(this.$route.fullPath=='/ChatInterface'){
       localStorage.setItem('isPhoto',true)
    }else{
      localStorage.setItem('isPhoto',false)
    }
    
    this.editor.isFocus=false;
    setTimeout(()=>{
      this.editor.isFocus=true;
    },300)
    this.editor.isFocus=true;
    this.editor.config.uploadImgShowBase64 = true // base 64 存储图片
    this.editor.config.colors=['#999999','black','#fff','red','yellow','blue','rgb(70, 172, 200)','rgb(194, 79, 74)','rgb(249, 150, 59)']
    this.editor.config.uploadImgServer = this.UploadVidio// 配置服务器端地址
    this.editor.config.uploadImgHeaders = {}// 自定义 header
    this.editor.config.uploadFileName = 'file' // 后端接受上传文件的参数名
    this.editor.config.uploadImgMaxSize = 5 * 1024 * 1024 // 将图片大小限制为 2M
    this.editor.config.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
    this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间
    // this.editor.config.onchange = (html) => {
    //   this.editorContent = html
    //   this.catchData(this.editorContent)  // 把这个html通过catchData的方法传入父组件
    // }
    //去掉插入网络图片
    this.editor.config.showLinkImg = false
    //粘贴来的内容过滤图片
    this.editor.config.pasteIgnoreImg = true
    this.editor.config.menus = this.menu;
    // 下面是最重要的的方法
    // this.editor.config.withCredentials = true
    // 将图片大小限制为 5M
    this.editor.config.uploadImgMaxSize = 5 * 1024 * 1024
    //限制一次最多上传 1 张图片
    this.editor.config.uploadImgMaxLength = 1
    this.editor.config.customUploadImg = function (files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      // 因为file是个FormData格式的对象所以可以直接通过接口开始上传，不需要做多余操作
      //虽然文档说是FormData格式，但是我实际使用需要以下操作
      let formData = new FormData();
      formData.append('file', files[0]);
      let config = {
        //添加请求头
        headers: { "Content-Type": "multipart/form-data" },
      };
      that.$api.confinementRoom.unload(
        formData).then(res => {
        if (res.code == 200) {
          that.$message.success('上传成功')
          insert(serverPath + res.data.url)
        }

      })
    }
    //自定义错误提示
    this.editor.config.customAlert = function (info) {
      // info 是需要提示的内容，我使用的是elementUI的提示，不多介绍
      Message.warning({
        message: info,
      })
    }
    this.editor.config.onchange = (html) => {
      //利用正则去匹配上传的图片
      let matchReg = /<img.*?(?:>|\/>)/gi;
      let img = html.match(matchReg);
      let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i
      let data = [];
      if (img != null) {
        for (let i = 0; i < img.length; i++) {
          let src = img[i].match(srcReg);
          data.push(src[1]);
        }
      }
      that.count = data.length;
      //这一部分主要记录的是第一次的上传
      if (!that.countFlag) {
        if (data.length == 1 || that.count == 1) {
          that.countFlag = true
        }
      }
      //这一部分主要记录的是上传图片的数量大于1且需要删除图片的时候
      if (!that.countFlags) {
        if (data.length > 1) {
          that.countFlags = true
        }
      }
      //记录是上传还是删除
      //上传的话啥事没有
      if (that.removelist.length < data.length) {

      }
      //既不是上传也不是删除啥事没有
      else if (that.removelist.length == data.length) {

      }
      //主要是删除
      else {
        if(localStorage.getItem('isPhoto')=='true'){

        }else{
          if (data.length == 0) {
          that.$api.confinementRoom.deleteLocalFile({
            path: that.removelist[0].split("/file")[1]
          }).then(res => {
            if (res.code == 200) {
                this.$message.success('删除成功')
            }
          })
        } else {
          that.removelist.forEach(value => {
            if (data.indexOf(value) == -1) {
              that.$api.confinementRoom.deleteLocalFile({
                path: value.split("/file")[1]
              }).then(res => {
                if (res.code == 200) {
                  alert('123')
                  this.$message.success('删除成功')
                }
              })

            }
          })

        }
        }
       
      }
      that.removelist = data;
      // this.editor.txt.html(this.content)
      // this.contentHTML=html
      // this.$emit('change', html) // 将内容同步到父组件中,绑定当前逐渐地值
      this.editorContent = html // 绑定当前逐渐地值
      this.$emit('catchData', html)
    }
    this.editor.create()
    if (!this.content) {
      this.editor.txt.html('')
    }else {
      this.editor.txt.html(this.content)

    }// 创建富文本实例
    document.querySelectorAll(".w-e-menu")[document.querySelectorAll(".w-e-menu").length-1].style.display = 'none'
    
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
::v-deep .w-e-droplist{
  position: absolute !important;
}
#wangeditor {
  position: sticky;

  /*设置富文本框高度*/
  .w-e-text-container {
    height: 260px !important;
  }
}
</style>

