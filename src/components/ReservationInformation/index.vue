<template>
  <!-- 添加预约 -->
  <!-- 修改预约单 -->
  <div>
    <div class="progressBar" style="display:flex;justify-content: space-between">
      <div>

      </div>
      <div style="display: flex;">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-s-claim"
            :loading="submitLoading"
            @click.stop.native="submitForm"
          >保存</el-button>
          <el-button
            size="mini"
            icon="el-icon-close"
            :loading="submitLoading"
            @click.stop.native="goBack"
          >关闭</el-button>

      </div>
    </div>
    <el-scrollbar :style="styleObjectFun()">
      <div  class="formBox">
        <div class="formBody">
          <div class="title">预约信息</div>
          <el-form
            ref="form"
            size="mini"
            :disabled="submitLoading"
            label-width="100px"
            :rules="rules"
            :model="form"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="预约编号：" prop="customCardNumber">
                  <el-input
                    v-model="form.customCardNumber"
                    disabled
                    placeholder="请输入联系电话"
                    style="width: 260px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电话：" prop="customPhone">
                  <el-input
                    v-model="form.customPhone"
                    disabled
                    placeholder="请输入联系电话"
                    style="width: 260px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="顾客姓名：" prop="customName">
                  <el-input
                    v-model="form.customName"
                    disabled
                    placeholder="请输入顾客姓名"
                    style="width: 260px;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="意向度：" prop="degreeIntention">
                  <el-select v-model="form.degreeIntention" style="width: 260px;" placeholder="请选择意向度">
                    <el-option
                      v-for="dict in dict.type.degree_intention_list"
                      :key="dict.value +'think'"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="下单人：">
                  <el-select
                    v-model="form.dsingleUserName"
                    disabled
                    style="width: 260px;"
                    placeholder="请选择下单人"
                  >
                    <el-option
                      v-for="(userItem,userIndex) in userList"
                      :key="userIndex+'user'"
                      :label="userItem.nickName"
                      :value="userItem.userId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="下单时间：" prop="dsingleTime">
                  <el-date-picker
                    v-model="form.dsingleTime"
                    disabled
                    style="width: 260px;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择下单时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预约时间：" prop="appointmentTime">
                  <el-date-picker
                    v-model="form.appointmentTime"
                    style="width: 260px;"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择预约时间"
                  />
                </el-form-item>
              </el-col>
              <!--              <el-col :span="8">-->
              <!--                <el-form-item label="预约专家：">-->
              <!--                  <el-select v-model="form.AppointmentExpert" placeholder="请选择活动区域">-->
              <!--                    <el-option label="暂无此数据" value="shanghai"></el-option>-->
              <!--                  </el-select>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :span="24">
                <el-form-item label="关注问题：" prop="concernsIds">
                  <el-checkbox-group v-model="form.concernsIds" @change="checkboxChange">
                    <el-checkbox
                      v-for="dict in dict.type.concernsList"
                      :key="dict.value +'question'"
                      :label="dict.value"
                    >{{ dict.label }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="formBody book-select-box">
          <div class="title">添加预约信息</div>
          <div class="form-left">
            <div class="title">可预约列表</div>
            <el-tree :data="bookProjectList" :props="defaultProps" :highlight-current="true" @node-click="treeNodeClick">
              <span slot-scope="{ node,data }" style="width: 100%" class="custom-tree-node" @dblclick.stop="dbClicks(node,data)">
                <span style="width: 100%">
                  <b v-if="!data.departmentInfoVos" class="el-icon-document" />
                  <b v-else-if="node.expanded" class="el-icon-folder-opened" />
                  <b v-else class="el-icon-folder" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
          <div class="form-right">
            <div class="title">已选择信息</div>
            <div class="form-right-header">
              <el-button
                v-has-permi="['confinement:customerReservationForm:add']"
                plain
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click.stop="addDataToTable"
              >添加</el-button>
              <el-button
                v-has-permi="['confinement:customerReservationForm:edit']"
                plain
                type="danger"
                size="mini"
                icon="el-icon-close"
                @click.stop="handleDelete"
              >删除</el-button>
              <span>请选择预约项目，在左侧选择第三级类型，双击选中</span>
            </div>
            <el-table
              :data="tableData"
              size="mini"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="bookingPeojectName" label="项目类型" align="center" />
              <el-table-column label="备注" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remarks" size="mini" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import vm from '@/utils/util'

export default {
  name: 'EditBookForm',
  dicts: ['concernsList', 'degree_intention_list'],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevPath = from.path
    })
  },
  data() {
    return {
      // 加载蒙版
      showDataDialog: false,
      prevPath: undefined,
      // 提交加载
      submitLoading: false,
      // 下单人
      userList: [],
      bookProjectList: [],
      defaultProps: {
        children: 'departmentInfoVos',
        label: 'departmentName'
      },
      // 表格多选
      selectionData: [],
      // 表单数据
      form: {
        id: '',
        AppointmentExpert: '', // 预约专家
        concernsIds: [],
        customerId: '',
        customName: '',
        customPhone: '',
        dsingleTime: '',
        deptId: '',
        appointmentTime: ''
      },
      // 表单校验规则
      rules: {
        customPhone: [
          { required: true, message: '顾客电话不能为空', trigger: 'blur' }
        ],
        customName: [
          { required: true, message: '顾客姓名不能为空', trigger: 'blur' }
        ],
        degreeIntention: [
          { required: true, message: '请选择顾客意向度', trigger: 'change' }
        ],
        dsingleTime: [
          { required: true, message: '请选择下单时间', trigger: 'blur' }
        ],
        appointmentTime: [
          { required: true, message: '请选择预约时间', trigger: 'blur' }
        ],
        concernsIds: [
          { required: true, message: '请勾选顾客关注问题', trigger: 'change' }
        ]
      },
      selectTreeNode: undefined,
      tableData: [],
      ids: []
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId
      }
    }
  },
  // 监听部门ID deptId
  watch: {
    deptId(val) {
      this.deptId = val
      this.getBookProjectList(val)
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getBookProjectList(this.deptId)
    this.getUserList()
    this.form.id = this.$route.query.id
    this.getUserInfoById(this.$route.query.id)
    this.getUserBookProjectInfo({ id: this.$route.query.id })
  },
  methods: {
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    checkboxChange(e) {
      const arr = []
      const concernsList = this.dict.type.concernsList
      for (const item of e) {
        const index = concernsList.findIndex(c => c.value === item)
        if (index > -1) {
          arr.push(concernsList[index].label)
        }
      }
      this.form.concerns = arr.join(',')
    },
    // 保存信息
    submitForm() {
      if (this.tableData.length <= 0) {
        this.$message.error('请先添加预约信息')
        return false
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          const data = this.tableData.filter(filter => {
            return !filter.isAdd && filter.reservationFormId !== undefined
          }).map(map => {
            return map.reservationFormId
          })
          const delData = this.ids.filter(filter => {
            return data.indexOf(filter) === -1
          })
          this.tableData.forEach(item => {
            item.remark = item.remarks
            this.$set(item, 'deptId', this.deptId)
          })
          const custForm = Object.assign({}, this.form)
          custForm.concernsIds = custForm.concernsIds.toString()
          const parmas = {
            customerCmt: custForm,
            customerFormList: this.tableData,
            reservationFormIds: delData
          }
          this.$api.modules.netPower.editCustomerBook(parmas).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.submitLoading = false
              this.closeTag()
            }
          })
        }
      })
    },
    // 获取客户信息
    getUserInfoById(id) {
      if (!id) {
        this.$message.warning('参数值错误')
        return false
      }
      this.showDataDialog = true
      this.$api.user.getUserInfoByPhone({ id: this.form.id || id }).then(res => {
        if (res.data) {
          res.data.customerId = res.data.customId
          res.data.customName = res.data.customerName
          res.data.economicCapacity = res.data.economicCapacity + ''
          res.data.id = this.form.id
          res.data.concernsIds = res.data.concernsIds.split(',')
          this.form = res.data
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 获取用户的预约项目信息
    getUserBookProjectInfo(data) {
      this.$api.modules.netPower.getUserBookProjectInfo(data).then(res => {
        const arr = []
        const ids = []
        const that = this
        res.rows.forEach(item => {
          const obj = {
            projectTypeName: item.projectTypeName,
            departmentId: item.departmentId,
            projectTypeId: item.projectTypeId,
            departmentName: item.departmentName,
            bookingPeojectId: item.bookingPeojectId,
            bookingPeojectName: item.bookingPeojectName,
            reservationFormId: item.reservationFormId,
            id: that.form.id,
            remarks: item.remark
          }
          ids.push(item.reservationFormId)
          arr.push(obj)
        })
        this.ids = ids
        this.tableData = arr
      })
    },
    // 获取系统用户列表
    getUserList() {
      //  添加状态
      this.$api.user.getUserList({
        deptId: this.deptId,
        status: '0'
      }).then(res => {
        if (res) {
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    getProjectList(categoryId) {
      this.$api.modules.netPower.getProjectListItemId({ categoryId: categoryId }).then(res => {
      })
    },
    styleObjectFun() {
      return {
        '--height': document.body.clientHeight - 160 + 'px'
      }
    },
    // 预约项目列表
    getBookProjectList(deptId) {
      this.$api.modules.netPower.projectTreeselect({ deptId: deptId }).then(res => {
        this.bookProjectList = res.data
      })
    },
    // 表格多选
    handleSelectionChange(e) {
      const arr = []
      e.forEach(item => {
        arr.push(item.bookingPeojectId)
      })
      this.selectionData = arr
    },
    handleDelete() {
      const copyData = this.tableData.filter(filter => {
        return this.selectionData.indexOf(filter.bookingPeojectId) === -1
      })
      this.tableData = JSON.parse(JSON.stringify(copyData))
    },
    goBack() {
      this.closeTag()
      // this.$router.go(-1)
      // this.$router.replace(this.prevPath)
    },
    treeNodeClick(e) {
      this.selectTreeNode = e
    },
    // 添加至表格中
    addDataToTable() {
      if (this.selectTreeNode.returnDeptPeojectVos !== undefined) {
        this.$message.warning('请选择最后一级')
        return false
      }
      let flag = false
      this.tableData.forEach(item => {
        if (item.bookingPeojectId === this.selectTreeNode.departmentId) {
          this.$message.warning('不可重复添加')
          flag = true
          return
        }
      })
      if (!flag) {
        const obj = {
          projectTypeName: this.selectTreeNode.projectTypeName,
          projectTypeId: this.selectTreeNode.projectTypeId,
          departmentId: this.selectTreeNode.categoryId,
          departmentName: this.selectTreeNode.categoryName,
          bookingPeojectId: this.selectTreeNode.departmentId,
          bookingPeojectName: this.selectTreeNode.departmentName,
          id: this.form.id,
          isAdd: 1,
          remarks: ''
        }
        this.tableData.push(obj)
      }
    },
    // 双击添加到表格中
    dbClicks(node, data) {
      console.log(data, 'sdadhashdasd')
      if (data.returnDeptPeojectVos !== undefined) {
        return false
      }
      let flag = false
      this.tableData.forEach(item => {
        if (item.bookingPeojectId === data.departmentId) {
          flag = true
          return
        }
      })
      if (!flag) {
        const obj = {
          projectTypeName: data.projectTypeName,
          projectTypeId: data.projectTypeId,
          departmentId: data.categoryId,
          departmentName: data.categoryName,

          bookingPeojectName: data.departmentName,
          id: this.form.id,
          isAdd: 1,
          remarks: ''
        }
        this.tableData.push(obj)
      } else {
        this.$message.warning('不可重复添加')
      }
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .vue-treeselect__control{
  height: 31px;
}
.progressBar {
  width: 100%;
  height: 50px;
  background-color: #f2f2f2;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  ul {
    list-style: none;
    width: 100%;
    line-height: 30px;
    display: flex;
    .active {
      color: #48c9b0;
    }
    li {
      margin: 0 20px;
      font-size: 14px;
      color: #454545;
    }
  }
}
.formBox {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  .book-select-box {
    display: flex;
    justify-content: space-between;
  }
  .formBody {
    width: 100%;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    padding: 40px 20px 20px 20px;
    box-sizing: border-box;
    position: relative;
    margin: 20px 0;
    .title {
      position: absolute;
      top: -12px;
      left: 40px;
      padding: 0 10px;
      background-color: #f2f2f2;
      color: #666666;
      label {
        color: #48c9b0;
        font-size: 12px;
        margin-left: 10px;
      }
    }
    .form-left {
      width: 250px;
      min-height: 500px;
      border: 1px solid #c6c6c6;
      border-radius: 10px;
      position: relative;
      padding: 20px;
      box-sizing: border-box;
      .title {
        position: absolute;
        top: -12px;
        left: 40px;
        padding: 0 10px;
        background-color: #f2f2f2;
        color: #666666;
        label {
          color: #48c9b0;
          font-size: 12px;
          margin-left: 10px;
        }
      }
    }
    .form-right {
      width: calc(100% - 280px);
      min-height: 500px;
      border: 1px solid #c6c6c6;
      border-radius: 10px;
      position: relative;
      padding: 20px;
      box-sizing: border-box;
      .form-right-header {
        width: 100%;
        height: 50px;
        padding: 10px 20px;
        box-sizing: border-box;
        background-color: rgba(126, 197, 183, 0.27);
      }
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #48c9b0;
      }
      .title {
        position: absolute;
        top: -12px;
        left: 40px;
        padding: 0 10px;
        background-color: #f2f2f2;
        color: #666666;
        label {
          color: #48c9b0;
          font-size: 12px;
          margin-left: 20px;
        }
      }
    }
  }
}
.el-icon-folder-opened {
  color: #666666;
}
::v-deep .el-scrollbar {
  width: 100%;
  height: var(--height);
  box-sizing: border-box;

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
::v-deep .el-tree {
  background-color: transparent;
}
</style>

