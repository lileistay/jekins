<template>
  <div>
    <sg-dialog
      ref="sg-dialog"
      :title="upload.title"
      size="400px"
      :dialog="upload.open"
      @handleClose="handleFileClose"
    >
      <div slot="out">
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="headers"
          :file-list="fileList"
          :action="upload.url + '?updateSupport=' + upload.updateSupport+ '&deptId=' + deptId"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :on-error="handleFileError"
          :on-change="handleFileChange"
          :auto-upload="false"
          :show-file-list="false"
          drag
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip text-center">
            <div slot="tip" class="el-upload__tip">
              <el-checkbox v-model="updateSupport" /> 是否更新已经存在的数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="downloadTemplate">下载模板</el-link>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;margin-left: 20px" @click="downloadErrorTemplate" v-if="IfShow">下载错误数据</el-link>
            <div style="margin-top: 10px">
            <span v-if="ShowError" style="color: red;">
               {{ShowErrortip}}
            </span>
            </div>
            <div style="margin-top: 10px" >{{ filename }}</div>
            <el-progress
              v-if="progressLoading"
              :percentage="progressPercent"
            />
          </div>
        </el-upload>
        <div class="importFormBar">
          <el-button size="mini" type="primary" @click="submitFileForm">确 定</el-button>
          <el-button size="mini" @click="handleFileClose">取 消</el-button>
        </div>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import SgDialog from '@/components/Dialog'
import store from '@/store'
import {LOG2E} from "mathjs";

export default {
  name: 'Import',
  components: { SgDialog },
  props: {
    IfShow:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    xflag:{
      type:Number||String,
      default:()=>{
        return 1
      }
    },
    upload: {
      type: Object,
      default: function() {
        return {
          // 是否显示弹出层
          open: false,
          // 弹出层标题
          title: '',
          // 是否禁用上传loading
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 上传的地址
          url: ''
        }
      }
    }
  },
    computed: {
        // eslint-disable-next-line vue/no-dupe-keys
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId
            }
        }
    },
    watch: {
        deptId(val) {
            this.deptId = val
        },
        deptName(val) {
            this.$refs.tree.filter(val)
        },
      'upload.open'(newV){
        this.ShowError=false;
      }
    },
  data() {
    return {
      ShowError:false,
      ShowErrortip:"",
      updateSupport: this.upload.updateSupport,
      headers: { Authorization: 'Bearer ' + store.getters.userInfo.token },
      finishTimer: undefined,
      timer: undefined,
      progressLoading: false,
      progressPercent: 0,
      fileList: [],
      filename: ''
    }
  },
  methods: {
    downloadErrorTemplate(){
      if (this.xflag==1){
        this.$api.imports.importDepartmentInfoTemplate({deptId: this.deptId,downloadType:'1'})
      }else if (this.xflag==2){
        this.$api.imports.importProjectInfoTemplate({deptId: this.deptId,downloadType:'1'})
      }else if (this.xflag==3){
        this.$api.imports.importCustomerCmtTemplate({deptId: this.deptId,downloadType:'1'})
      }else if (this.xflag==4){
        this.$api.imports.importReceptionInformationTemplate({deptId: this.deptId,downloadType:'1'})
      }else if (this.xflag==5){
        this.$api.imports.importOrderDetailsTemplate({deptId: this.deptId,downloadType:'1'})
      }else if (this.xflag==6){
        this.$api.imports.importDeductionRecordTemplate({deptId: this.deptId,downloadType:'1'})
      }else if (this.xflag==7){
        this.$api.imports.importCustomCardSumTemplate({deptId: this.deptId,downloadType:'1'})
      }else if (this.xflag==8){
        this.$api.imports.importMaterialInfoTemplate({deptId: this.deptId,downloadType:'1'})
      }
      else if (this.xflag==9){
        this.$api.imports.importMaterialInfoTemplateinfo({deptId: this.deptId,downloadType:'1'})
      }
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 关闭弹窗
    */
    handleFileClose() {
      this.$emit('handleFileClose')
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 文件上传中处理
    */
    handleFileUploadProgress(event, file, fileList) {
      this.$emit('handleFileUploadProgress')
      this.progressLoading = true
      // 使用定时器来制作进度条
      this.timer = setInterval(() => {
        // progressPercent 进度条数字
        this.progressPercent++
        if (this.progressPercent === 100) {
          clearInterval(this.timer)
          // 这里必须使用this.timer = null，否则清除定时器无效
          this.timer = null
        }
      }, 100)
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 文件上传成功处理
    */
    handleFileSuccess(response, file, fileList) {
      if(response.code==500){
        this.ShowErrortip=response.msg;
        this.ShowError=true;
        this.$message.error(response.msg)
      }else{
        this.$message.success('导入成功')
      }
      this.$emit('handleFileSuccess')
      if (response) {
        // 关闭遮罩，进度条归零
        clearInterval(this.timer)
        this.timer = null
        this.progressLoading = false
        this.progressPercent = 0
        this.$refs.upload.clearFiles()

        // this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
      }
    },
    /**
     * @author Nevin
     * @date 2022/8/13
     * @Description: 文件上传失败
    */
    handleFileError() {
      this.$emit('handleFileSuccess')
      clearInterval(this.timer)
      this.timer = null
      this.progressLoading = false
      this.progressPercent = 0
      this.$message.error('上传失败，请重试！')
    },
    /**
     * @author Nevin
     * @date 2022/8/13
     * @Description: 选择文件后处理
    */
    handleFileChange(file, fileList) {
      this.filename = file.name
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 下载模板
    */
    downloadTemplate() {
      this.$emit('downloadTemplate')
    },
    /**
     * @author Nevin
     * @date 2022/8/12
     * @Description: 提交表单
    */
    submitFileForm() {
      this.$emit('submitFileForm')
      this.$refs.upload.submit()
    }
  }
}
</script>

<style scoped lang="scss">
.importFormBar{
  margin-top: 20px;
}
</style>
