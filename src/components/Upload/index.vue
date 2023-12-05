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
          accept=".jpg, .png"
          :headers="headers"
          :file-list="fileList"
          :action="upload.url"
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
            <span>仅允许上传jpg、png格式图片。</span>
            <div style="margin-top: 10px">{{ filename }}</div>
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

export default {
  name: 'Upload',
  components: { SgDialog },
  props: {
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
          // 上传的地址
          url: ''
        }
      }
    }
  },
  data() {
    return {
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
      this.$emit('handleFileSuccess')
      if (response) {
        // 关闭遮罩，进度条归零
        clearInterval(this.timer)
        this.timer = null
        this.progressLoading = false
        this.progressPercent = 0
        this.$refs.upload.clearFiles()
        this.$alert('上传成功', { dangerouslyUseHTMLString: true })
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
