<template>
    <div class="upload">
        <el-upload :action="upload.url" list-type="picture-card" :on-success="handleSuccess" :headers="headers"
            :accept="accept" :on-progress="handleFileUploadProgress" :show-file-list="true" :on-preview="preview"
            :on-remove="remove" :limit="limit" :before-upload="beforeUpload" :on-change="onChange" :title="title"
            :on-exceed="onExceed" :file-list="newfileList" :drag="drag" :fileSize="fileSize"
            @click.native="clickFile($event)" :class="{ hide: hideUpload }">
            <div v-if="!drag">
                <i class="el-icon-plus" style="font-size: 18px">
                    <span style="font-size: 14px;    margin-left: 2px;">{{ title }}</span>
                </i>
            </div>
            <div v-else>
                <i class="el-icon-upload"></i>
            </div>
        </el-upload>
        <SgDialog title="图片显示" size="600px" :dialog="listDialog" @handleClose="listDialog = false">
            <div slot="out">
                <div class="imgsize">
                    <img :src="imgUrl" class="imgsize" />
                </div>
            </div>
        </SgDialog>
    </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import SgDialog from '@/components/Dialog'
export default {
    components: {
        SgDialog,
    },
    watch: {
        //通过上传最大限制控制是否可以继续上传
        newfileList:{
            handler(){
                if (this.newfileList.length == this.limit) {
                this.hideUpload = true;
            }
            },
            deep:true,
         
        }
    },
    mounted() {
        //获取上传文件并回显编辑文件列表
        let that = this;
        // setTimeout(()=>{
            that.newfileList = that.fileList
        // },500)
       
        //自定义设置上传按钮的宽和高
        // document.querySelector('.el-upload').style.width=this.width;
        // document.querySelector('.el-upload').style.height=this.height;
        // document.querySelector('.el-icon-plus').style.marginTop=(parseInt(this.height)-18)/2+'px'
    },
    props: {
        successIndex:{
            type:Number||String,
            default:()=>{
                return 0
            }
        },
        // 名称
        title: {
            type: String,
            default: () => {
                return ''
            }
        },
        //上传的参数获取及设置
        upload: {
            type: Object,
            default: () => {
                return {
                    //上传地址
                    url: '/api/file/upload',

                }
            }
        },
        //限制上传次数
        limit: {
            type: Number,
            default: () => {
                return 1
            }
        },
        //接收上传格式
        accept: {
            type: String,
            default: () => {
                return '.jpg, .png'
            }
        },
        //文件大小限制
        fileSize: {
            type: Number,
            default: () => {
                return 5
            }
        },
        //用于是否可以拖拽上传
        drag: {
            type: Boolean,
            default: () => {
                return false
            }
        },
        //用于回显数据的传参
        fileList: {
            type: Array,
            default: () => {
                return []
            }
        },
        //上传按钮宽度设置
        width: {
            type: String,
            default: () => {
                return '146px'
            }
        },
        //上传按钮高度设置
        height: {
            type: String,
            default: () => {
                return '146px'
            }
        }
    },
    methods: {
        //控制文件是否显示上传按钮
        clickFile(e) {
            this.count++;
            if (this.count == 2) {
                this.filemounth.forEach((value, index) => {
                    if (value == e.target.parentNode) {
                        this.Index = index
                    }
                })
                this.count = 0
            } else {

            }

        },
        //文件上传超过限制的回调
        onExceed(files, fileList) {
            this.$message.error(`最多上传${this.limit}张图片`)
        },
        //文件上传改变
        onChange(file, fileList) {

        },
        //限制文件上大小
        beforeUpload(file) {
            const isLt = file.size / 1024 / 1024 < this.fileSize;
            if (!isLt) {
                this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`)
                return false
            }
        },
        //删除上传文件
        remove(file, fileList) {
            this.newfileList = fileList;
            let path = ''
            if (this.newfileList.length < this.limit) {
                this.hideUpload = false;
            }
    
            if (file.response == undefined) {
                path = file.url.split('/file/')[1]
            } else {
                path = file.response.data.url
            }
            this.$api.confinementRoom.deleteLocalFile({
                path: path
            }).then(res => {
                if (res.code == 200) {
                    this.$message.success('删除成功')
                }
            })
            this.$emit('remove', file,this.successIndex)
        },
        //预览上传文档
        preview(file) {
            this.listDialog = true;
            this.imgUrl = process.env.VUE_APP_BASE_API+'/file' + file.response.data.url;
        },
        //文件上传前的回调
        handleFileUploadProgress(response, file, fileLis) {

        },
        //文件上传成功的回调
        handleSuccess(response, file, fileList) {
            if (response.code == 200) {
                this.$message.success('上传成功')
                this.newfileList = fileList;
                if (this.newfileList.length == this.limit) {
                    this.hideUpload = true
                }
                //触发方法进行其他操作
                this.$emit('successFile', response.data,this.successIndex)
                //控制上传之后图片内容大小和配置一样
                // let html=document.querySelectorAll('.el-upload-list__item');
                // for(let len=0;len<html.length;len++){
                //     html[len].style.height=this.height;
                //     html[len].style.width=this.width;
                // }
            } else {
                this.$message.success('上传失败')
            }
        },
    },
    data() {
        return {
            headers: { Authorization: 'Bearer ' + getToken() },
            listDialog: false,
            imgUrl: "",
            count: 0,
            filemounth: [],
            Index: 0,
            newfileList: [],
            hideUpload: false,
        }
    }
}
</script>
<style scoped>
::v-deep .hide .el-upload--picture-card {
    display: none !important;
}

.imgsize {
    width: 100%;
    height: 500px;
    object-fit: contain;
}

.upload_children {
    width: 148px;
    height: 148px
}

.upload {
    width: 100%;
    height: 148px;
    display: flex;
    flex-wrap: wrap;
}

.uploadImg {
    width: 148px;
    height: 148px
}
</style>