<template>
  <!--  领取接诊单-->
  <el-dialog
    title="领取接诊单"
    :visible="dialogVisible"
    width="800px"
    @close="closeDialog"
  >
    <div>
      <div class="one">
        <span>客户信息</span>
        <el-row>
          <el-form
            ref="form"
            size="mini"
            label-width="100px"
            :model="form"
          >
            <el-col :span="7">
              <el-form-item label="客户姓名：" prop="customerName">
                <el-input v-model="form.customerName" readonly onfocus="this.removeAttribute('readonly');" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="手机：">
                <el-input v-model="form.customPhone" readonly onfocus="this.removeAttribute('readonly');" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="卡号：">
                <el-input v-model="form.customCardNumber" readonly onfocus="this.removeAttribute('readonly');" />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" size="mini" style="margin-left: 10px" @click="search">搜索</el-button>
            </el-col>
          </el-form>
        </el-row>

      </div>
      <!-- 第二行 -->
      <div class="one" style="margin-top:10px">
        <el-row>
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column
              label="客户卡号"
              prop="customCardNumber"
              width="160"
            />
            <el-table-column
              label="客户姓名"
              prop="customerName"
            />
            <el-table-column
              label="手机"
              prop="customPhone"
            />
            <el-table-column
              label="客户类型"
              prop="customSex"
            />
            <el-table-column
              label="性别"
              prop="customSex"
            >
              <template slot-scope="scope">
                <show-dict-data :options="dict.type.sys_user_sex" :value="scope.row.customSex" />
              </template>
            </el-table-column>
            <el-table-column
              label="归属美学顾问"
              prop="receptionName"
            />
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="add(scope.row)">领取接诊单</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
      <!-- 第三行 -->
      <div
        class="one"
        style="margin-top:10px"
      >
        <el-form
          ref="formInline"
          :model="formInline"
          :rules="rules"
          size="mini"
          label-width="100px"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名：" prop="customerName">
                <el-input v-model="formInline.customerName" disabled />
              </el-form-item>

            </el-col>
            <el-col :span="8">
              <el-form-item label="手机：" prop="customPhone">
                <el-input v-model="formInline.customPhone" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="分诊科室：" prop="departmentId">
                <el-select v-model="formInline.departmentId" filterable clearable value="">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.departmentId"
                    :label="item.departmentName"
                    :value="item.departmentId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="医生：" prop="doctorId">
                <el-select v-model="formInline.doctorId" filterable clearable>
                  <el-option
                    v-for="item in doctor"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="二开推荐人：" prop="secondOpeningUser">
                <el-select v-model="formInline.secondOpeningUser" filterable clearable>
                  <el-option
                    v-for="item in sysUserList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="分诊备注：" prop="remark">
                <el-input v-model="formInline.remark" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button size="mini" @click="closeDialog">取 消</el-button>
      <el-button
        :loading="loadingSubmit"
        type="primary"
        size="mini"
        @click="submit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { throttle } from '@/utils/throttleAndDebounce'
import deptId from "../../../api/index/deptId"; // 节流
export default {
  dicts: ['sys_user_sex'],
  // 接受传递过来的值
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadingSubmit: false,
      newcustomPhone:"",
      esthetics:[],
      form: {
        customerName: '',
        customPhone: '',
        customCardNumber: ''
      },
      formInline: {
        customerName: '',
        customPhone: '',
        departmentId: '',
        doctorId: '',
        secondOpeningUser: '',
        customerRepresentative: '',
        aestheticConsultant: '',
        id: '',
        remark: ''
      },
      rules: {
        customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      tableData: [],
      sysUserList: [],
      doctor: [],
      departmentList: []
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
      this.getDepartment()
      this.getUserList(val)
    }
  },
  created() {
    this.getDepartment()
    this.deptId = this.$store.getters.departmentId
    this.getUserList(this.deptId)
  },
  methods: {
    /**
     * @author Nevin
     * @date 2022/5/9
     * @Description: 获取客户信息
    */
    search() {
      if (this.form.customerName === '' && this.form.customPhone === '' && this.form.customCardNumber === '') {
        return
      }
      this.$api.dept.ReceptionTriagelist({ ...this.form ,deptId:this.deptId}, 'get').then((res) => {
        this.tableData = res.data;
        this.newcustomPhone=res.data[0].trueCustomPhone;
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/9
     * @Description: 领取接诊单按钮
    */
    add(val) {
      this.formInline.customPhone = val.customPhone
      this.formInline.customerName = val.customerName
      this.formInline.customerRepresentative = val.customerRepresentative
      this.formInline.aestheticConsultant = val.receptionId
      this.formInline.onlineUserId = val.onlineUserId
      this.formInline.id = val.id
      this.formInline.deptId = this.deptId
    },
    /**
     * @author Nevin
     * @date 2022/5/9
     * @Description: 保存按钮
    */
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.formInline.validate((val) => {
            if (val) {
              // this.$delete(this.formInline, 'customPhone')
              // this.$delete(this.formInline, 'customerName')
              this.formInline.customPhone=this.newcustomPhone;
              this.$set(this.formInline, 'isReachCourtyard', '0')
              this.$set(this.formInline, 'triageType', '2')
              this.$set(this.formInline, 'deptId', this.deptId)
              this.$set(this.formInline, 'receptionType', 'kk')
              this.loadingSubmit = true;
              this.$api.dept.addReceptiondata({ ...this.formInline }).then(res => {
                if (res) {
                  this.$message.success(res.msg)
                  this.loadingSubmit = false
                  // this.formInline.customPhone = ''
                  // this.formInline.customerName = ''
                  this.formInline.customerRepresentative = ''
                  this.formInline.aestheticConsultant = ''
                  this.formInline.id = ''
                  this.formInline.deptId = ''
                  this.formInline.departmentId = ''
                  this.formInline.doctorId = ''
                  this.formInline.remark = ''
                  this.formInline.secondOpeningUser = ''
                  this.$emit('update:dialogVisible', false)
                }
              })
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/9
     * @Description: 取消按钮
    */
    closeDialog() {
      this.form.customerName = ''
      this.form.customPhone = ''
      this.form.customCardNumber = ''
      this.formInline.customPhone = ''
      this.formInline.customerName = ''
      this.formInline.customerRepresentative = ''
      this.formInline.aestheticConsultant = ''
      this.formInline.id = ''
      this.formInline.deptId = ''
      this.formInline.departmentId = ''
      this.formInline.doctorId = ''
      this.formInline.remark = ''
      this.formInline.secondOpeningUser = ''
      this.tableData = []
      this.$emit('update:dialogVisible', false)
    },
    /**
     * @author Nevin
     * @date 2022/5/9
     * @Description: 获取科室列表
    */
    getDepartment() {
      this.$api.dept.DepartmentList({ deptId: this.deptId, status: '0', isDepartment: '1'  }, 'get').then((res) => {
        if (res) {
          this.departmentList = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/9
     * @Description: 获取用户列表
    */
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      let data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.esthetics.push(item)
              this.doctor.push(item)
            }
          })
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    }
  }
}
</script>

<style lang="scss" scoped>
.one {
  border: 1px solid #f2f2f2;
  padding: 20px;
  border-radius: 5px;
  & > span {
    font-size: 15px;
    background-color: #fff;
    position: absolute;
    margin-top: -30px;
  }
}
</style>
