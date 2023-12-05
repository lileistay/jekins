<template>
  <div class="LogManger">
    <sg-table
    
      size="mini"
      index="序号"
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      highlight-current-row
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <div slot="searchBar">
        <el-form ref="searchForm" :model="searchBar" :inline="true" size="mini" :show-message="false">
          <el-form-item label="登录地址" prop="menuName">
            <el-input v-model="searchBar.ipaddr" placeholder="请输入登录地址" />
          </el-form-item>
          <el-form-item label="用户名称" prop="status">
            <el-input v-model="searchBar.userName" placeholder="请输入用户名称" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @keydown.enter.native="getData(true)" @click.stop="getData(true)">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" plain icon="el-icon-upload2" type="info" @click="handleUpload">上传图片</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--      <template #custom="data">-->
      <!--        <div v-if="data.props === 'status'">-->
      <!--          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status"/>-->
      <!--        </div>-->
      <!--      </template>-->
    </sg-table>
    <upload
      ref="import"
      :upload="upload"
      @handleFileClose="handleFileClose"
      @handleFileUploadProgress="handleFileUploadProgress"
      @handleFileSuccess="handleFileSuccess"
      @handleFileError="handleFileError"
      @submitFileForm="submitFileForm"
    />
  </div>
</template>

<script>
import sgTable from '@/components/Table'
import upload from '@/components/Upload'
export default {
  name: 'LogManger',
  components: {
    sgTable,
    upload
  },
  data() {
    return {
      // 上传图片参数
      upload: {
        // 是否显示弹出层（上传图片）
        open: false,
        // 弹出层标题（上传图片）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 上传的地址
        url: '/api/file/upload'
      },
      loadingData: false,
      // 搜索栏
      searchBar: {
        ipaddr: '',
        userName: ''
      },
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      // 表格数据展示列
      columns: [
        {
          lab: '用户名称',
          val: 'userName'
        },
        {
          lab: '登录IP',
          val: 'ipaddr'
        },
        {
          lab: '登录信息',
          val: 'msg'
        },
        {
          lab: '登录时间',
          val: 'accessTime'
        }
      ],
      // 表格数据
      tableData: []
    }
  },
  created() {
    this.getData()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/9/2
     * @Description: 图片上传
    */
    handleUpload() {
      this.upload.title = '图片上传'
      this.upload.open = true
    },
    /**
     * @author Nevin
     * @date 2022/9/2
     * @Description: 提交上传文件
     */
    submitFileForm() {
      // this.$refs.Upload.submit()
    },
    /**
     * @author Nevin
     * @date 2022/9/2
     * @Description: 文件上传中处理
     */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    /**
     * @author Nevin
     * @date 2022/9/2
     * @Description: 文件上传成功处理
     */
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
    },
    /**
     * @author Nevin
     * @date 2022/9/2
     * @Description: 上传失败处理
     */
    handleFileError() {
      this.upload.open = false
      this.upload.isUploading = false
    },
    /**
     * @author Nevin
     * @date 2022/9/2
     * @Description: 关闭弹窗
     */
    handleFileClose() {
      this.upload.open = false
    },
    /** 获取数据*/
    getData(isSearch) {
      let data = {
        'ipaddr': this.searchBar.ipaddr,
        'userName': this.searchBar.userName
      }
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = Object.assign(data, this.pagination)
      this.loadingData = true
      this.$api.log.getLoginInfo(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    resetForm() {
      this.searchBar.ipaddr = ''
      this.searchBar.userName = ''
      this.getData(true)
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
