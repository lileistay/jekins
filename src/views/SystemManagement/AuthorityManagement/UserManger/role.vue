<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <div class="backUp">
      <el-tooltip effect="dark" content="返回" placement="top">
        <el-button size="mini" plain circle icon="el-icon-back" @click="backUp" />
      </el-tooltip>
    </div>
    <el-form ref="form" size="mini" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="form.userName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">角色信息</h4>
    <el-table
      ref="table"
      v-loading="loading"
      size="mini"
      :row-key="getRowKey"
      :data="tableData"
      @row-click="clickRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column type="selection" :reserve-selection="true" width="55" />
      <el-table-column label="角色编号" align="center" prop="roleId" />
      <el-table-column label="角色名称" align="center" prop="roleName" />
      <el-table-column label="权限字符" align="center" prop="roleKey" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-show="total>0" :total="total" :page.sync="pageNum" :limit.sync="pageSize" @current-change="changePage" />

    <el-form label-width="100px">
      <el-form-item size="mini" style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'AuthRole',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 分页信息
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 选中角色编号
      roleIds: [],
      // 角色信息
      roles: [],
      // 用户信息
      form: {},
      tableData: []
    }
  },
  created() {
    const userId = sessionStorage.getItem('Roleitem')
    this.getData(userId)
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/6/23
     * @Description: 获取数据
    */
    getData(userId) {
      if (userId) {
        this.loading = true
        this.$api.user.getAuthRole(userId).then(res => {
          if (res) {
            this.form = res.user
            this.roles = res.roles
            this.total = this.roles.length
            this.tableData = this.roles.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
            this.$nextTick(() => {
              this.roles.forEach((row) => {
                if (row.flag) {
                  this.$refs.table.toggleRowSelection(row)
                }
              })
            })
            this.loading = false
          }
        })
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/23
     * @Description: 分页页码变化
    */
    changePage(pageNum) {
      this.tableData = this.roles.slice((pageNum - 1) * this.pageSize, pageNum * this.pageSize)
    },
    /** 单击选中行数据 */
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.roleIds = selection.map((item) => item.roleId)

    },
    backUp() {
      window.history.back()
    },
    // 保存选中的数据编号
    getRowKey(row) {
      return row.roleId
    },
    /** 提交按钮 */
    submitForm() {
      const userId = this.form.userId
      const roleIds = this.roleIds
      this.$api.user.updateAuthRole({ userId: userId, roleIds: roleIds }).then(res => {
        if (res) {
          this.$message.success('授权成功')
          this.close()
        }
      })
    },
    /** 关闭按钮 */
    close() {
      // const obj = { path: '/system/user' }
      // this.$tab.closeOpenPage(obj)
      // this.$router.push('/user-manger')
      window.history.back()
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container{
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  .backUp{
    position: absolute;
    right: 20px;
    top: 15px;
  }
  .form-header{
    font-size: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 5px;
    margin: 8px 10px 25px 10px;
  }
}
</style>
