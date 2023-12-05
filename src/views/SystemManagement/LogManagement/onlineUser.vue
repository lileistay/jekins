<template>
  <div class="LogManger">
    <sg-table
     
      size="mini"
      index="序号"
      :table-data="tableData"
      :columns="columns"
      :operate="operate"
      :pagination="pagination"
      highlight-current-row
      @operateClick="operateClick"
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
            <el-button icon="el-icon-search" type="primary" @click.stop="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-refresh" @click="resetForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--      <template #custom="data">-->
      <!--        <div v-if="data.props === 'status'">-->
      <!--          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status"/>-->
      <!--        </div>-->
      <!--      </template>-->
    </sg-table>
  </div>
</template>

<script>
import sgTable from '@/components/Table'
import { timeFmt } from '@/utils/time'

export default {
  name: 'LogManger',
  components: {
    sgTable
  },
  data() {
    return {
      loadingData: false,
      // 搜索栏
      searchBar: {
        ipaddr: '',
        userName: ''
      },
      // 操作配置项
      operate: {
        name: '操作',
        cell: [
          {
            lab: '强退',
            type: 'danger',
            permi: ['system:online:StrongRetreat']
          }
        ]
      },
      // 表格数据展示列
      columns: [
        {
          lab: '会话编号',
          val: 'tokenId'
        },
        {
          lab: '用户名称',
          val: 'userName'
        },
        {
          lab: '登录IP',
          val: 'ipaddr'
        },
        // {
        //   lab: '登录地址',
        //   val: 'loginLocation'
        // },
        // {
        //   lab: '浏览器',
        //   val: 'browser'
        // },
        // {
        //   lab: '系统',
        //   val: 'os'
        // },
        {
          lab: '登录时间',
          val: 'loginTime'
        }
      ],
      // 表格数据
      tableData: [],
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
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
    /** 获取数据*/
    getData(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.pageSize = 20
      }
      this.loadingData = true
      this.$api.log.getOnlineInfo({
        'ipaddr': this.searchBar.ipaddr,
        'userName': this.searchBar.userName,
        ...this.pagination
      }).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.tableData.forEach(item => {
            item.loginTime = timeFmt('YYYY-mm-dd HH:MM:SS', item.loginTime)
          })
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /** 清空表单*/
    resetForm() {
      this.searchBar.ipaddr = ''
      this.searchBar.userName = ''
    },
    /** 操作*/
    operateClick(e) {
      switch (e[0].lab) {
        case '强退':
          this.handleDelete(e[1])
      }
    },
    /** 强退操作*/
    handleDelete(row) {
      this.$confirm('是否强制退出此用户?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.log.getOutOnline(row.tokenId).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      // this.pagination.pageSize = e[1]
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
