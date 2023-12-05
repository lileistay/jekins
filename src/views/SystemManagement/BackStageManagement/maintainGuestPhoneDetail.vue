<template>
  <div class="container">
    <div class="dialog-box">
      <div class="title">主号码信息</div>
      <div class="content">
        <el-form :inline="true" :model="phoneDetail">
          <el-form-item label="姓名">
            <el-input v-model="phoneDetail.customerName" size="mini" placeholder="姓名" disabled />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="phoneDetail.phone" size="mini" placeholder="电话" disabled />
          </el-form-item>
          <el-form-item style="float: right">
            <el-button v-hasPermi="['confinement:customPhoneList:add']" type="primary" size="mini" plain @click="addDialog=true">添加</el-button>
            <el-button v-hasPermi="['confinement:customPhoneList:remove']" type="danger" size="mini" plain :disabled="delButtonDisable" @click="deletePhone">删除
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 添加号码弹框-->
    <sg-dialog title="添加电话" :dialog="addDialog" size="400px" @handleClose="addPhoneDialogClose">
      <div slot="out">
        <el-form ref="addPhoneForm" :model="addPhoneForm" :rules="phoneRules">
          <el-form-item label="姓名" prop="customerName">
            <el-input v-model="addPhoneForm.customerName" size="mini" placeholder="姓名" disabled />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="addPhoneForm.phone" size="mini" placeholder="电话" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" plain @click="addPhoneSubmit">添加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
    <el-table ref="phoneTable" border :data="phoneList" @row-click="rowClick" @selection-change="selectionChange">
      <!--<el-table-column prop="phoneId" label="id"/>-->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="phone" label="电话" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            v-if="scope.row.phone === phoneDetail.phone"
            type="primary"
            size="mini"
            plain
            disabled
          >设为主号码
          </el-button>
          <el-button v-else type="primary" size="mini" plain @click.stop="setCustomMainPhone(scope.row)">设为主号码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import SgDialog from '@/components/Dialog/index.vue'
import { validPhone } from '@/utils/validate'

export default {
  name: 'MaintainGuestPhoneDetail',
  components: { SgDialog },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value !== undefined) {
        const valid = validPhone(value)
        if (!valid) {
          callback(new Error('手机号码格式不正确'))
        }
        callback()
      }
    }
    return {
      guestId: null,
      // 主电话详情
      phoneDetail: {
        customerName: null,
        phone: null
      },
      addPhoneForm: {
        id: null,
        customerName: null,
        phone: null
      },
      phoneRules: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          // { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
          { validator: validatePhone, trigger: 'change' }
        ]
      },
      // 电话列表
      phoneList: [],
      // 添加号码弹窗
      addDialog: false,
      // 删除按钮是否可用,true为不可用
      delButtonDisable: true
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.getCustomerInfo(this.guestId)
      this.getPhoneList(this.guestId)
    },
    $route(val){
      if (val.path=='/maintainGuestPhoneDetail'){
        this.guestId = sessionStorage.getItem('guestId')
        this.getCustomerInfo(this.guestId)
        this.getPhoneList(this.guestId)
      }
    }
  },
  created() {
    this.guestId = sessionStorage.getItem('guestId')
    console.log(this.guestId,'this.guestIdthis.guestId')
    this.getCustomerInfo(this.guestId)
    this.getPhoneList(this.guestId)
  },
  methods: {
    getCustomerInfo(guestId) {
      this.$api.customerCmt.getInfoById(guestId).then(res => {
        this.phoneDetail = res.data
        this.addPhoneForm.id = guestId
        this.addPhoneForm.customerName = res.data.customerName
        this.addPhoneForm.customId = res.data.customId
      })
    },
    getPhoneList(guestId) {
      const data = {
        id: guestId
      }
      this.$api.customerCmt.getCustomPhoneList(data).then(res => {
        // console.log(res)
        this.phoneList = res.rows.filter(item => item.isMain === '0')
      })
    },
    addPhoneDialogClose() {
      this.addPhoneForm.phone = ''
      this.addDialog = false
    },
    addPhoneSubmit() {
      // console.log('提交')
      this.$refs.addPhoneForm.validate((valid) => {
        if (valid) {
          this.addPhoneForm.deptId = this.deptId
          this.$api.customerCmt.addCustomPhone(this.addPhoneForm).then(res => {
            // console.log(res)
            if (res.code === 200) {
              // 弹窗提示操作成功
              this.$message({ type: 'success', message: res.msg })
              // 重新获取电话列表
              this.getPhoneList(this.guestId)
            } else {
              this.$message({ type: 'error', message: res.msg })
            }
          })
          this.addPhoneDialogClose()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deletePhone() {
      const deleteIds = []
      const selectPhoneIds = this.$refs.phoneTable.selection
      // console.log()
      if (selectPhoneIds.length === 0) {
        this.$message.error('请先选择要删除的数据')
        return false
      }
      for (const selectPhoneId of selectPhoneIds) {
        deleteIds.push(selectPhoneId.phoneId)
      }
      // 弹出提示框
      this.$confirm('此操作将永久删除该号码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 请求服务端删除
        this.$api.customerCmt.deleteCustomPhones(deleteIds).then(res => {
          this.$message.success(res.msg)
          this.getPhoneList(this.guestId)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    setCustomMainPhone(row) {
      console.log(row)
      const data = new URLSearchParams()
      data.append('id', row.id)
      data.append('customPhone', row.phone)
      data.append('deptId', this.deptId)
      // const data = {
      //   id: row.id,
      //   customPhone: row.phone
      // }
      // 弹出提示框
      this.$confirm('是否切换' + row.phone + '为主号码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 请求服务端切换为主号码
        this.$api.customerCmt.setCustomMainPhone(data).then(res => {
          this.$message.success(res.msg)
          // console.log(res)
          this.getCustomerInfo(this.guestId)
          this.getPhoneList(this.guestId)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
      })
    },
    // 某一行被点击,切换选中状态
    rowClick(row, column, event) {
      this.$refs.phoneTable.toggleRowSelection(row)
    },
    // 选中项发生变化
    selectionChange(selection) {
      if (selection.length === 0) {
        this.delButtonDisable = true
      } else {
        this.delButtonDisable = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 98%;
  height: 100%;
  padding: 20px;
}

.dialog-box {
  width: 100%;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  font-size: 14px;
  .title {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 30px;
    background-color: #eeeeee;
    padding: 0 10px;
    line-height: 30px;
    box-sizing: border-box;

    span {
      color: #7ec5b7;
    }
  }
  .content {
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>

