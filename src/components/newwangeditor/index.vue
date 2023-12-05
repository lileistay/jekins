<template>
    <div>
        <div id="editor" v-if="flag">

        </div>
    </div>
</template>
<script>
import E from '@/utils/wangeditor'
const serverPath = process.env.VUE_APP_BASE_API + "/file"
export default {
    props: {
        flag: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        content: {
            type: String,
            default: () => {
                return ''
            }
        }
    },
    watch: {
      flag: {
        handler(newV) {
          this.removelist=[];
        },
        deep:true,
      },
        flag: {
            handler(newV) {
                let that = this;
                if (newV) {
                    this.$nextTick(function () {
                        this.initData();
                    })

                }

            },
            deep: true
        }
    },
    data() {
        return {
            editor: "",
            UploadVidio: "/upload",
            count: 0,//记录是删除图片还是新增图片
            removelist: [],//记录图片删除的地址
            countFlag: false,
            countFlags: false,
        }
    },
    destroyed() {
        this.editor = null;
    },
    methods:{
        initData(){
            let that = this;
        this.editor = new E('#editor')
        this.editor.customConfig.onchangeTimeout = 1
        this.editor.customConfig.onchange = function (html) {
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
                if (localStorage.getItem('isPhoto') == 'true') {

                } else {
                    if (data.length == 0) {
                        that.$api.confinementRoom.deleteLocalFile({
                            path: that.removelist[0].split("/file")[1]
                        }).then(res => {
                            if (res.code == 200) {
                                that.$message.success('删除成功')
                            }
                        })
                    } else {
                        that.removelist.forEach(value => {
                            if (data.indexOf(value) == -1) {
                                that.$api.confinementRoom.deleteLocalFile({
                                    path: value.split("/file")[1]
                                }).then(res => {
                                    if (res.code == 200) {
                                        that.$message.success('删除成功')
                                    }
                                })

                            }
                        })

                    }
                }

            }
            that.removelist = data;
            that.$emit('catchData', html)
        }
        this.editor.customConfig.customUploadImg = function (files, insert) {
            let formData = new FormData();
            formData.append('file', files[0]);
            that.$api.confinementRoom.unload(
                formData).then(res => {
                    if (res.code == 200) {
                        that.$message.success('上传成功')
                        insert(serverPath + res.data.url)
                    }

                })
        }
          this.editor.customConfig.uploadVideoServer = '/api/file/upload';
          this.editor.customConfig.uploadVideoHooks = {
            customInsert: function (insert, result, editor) {
              console.log(insert, result, editor,'jkhasjkhdsjkad')
            }
          };
        this.editor.create()
        this.editor.txt.html(this.content)

        }
    },
    mounted() {
       this.initData();
    },
}
</script>
<style></style>