<template>
  <!--全院销售漏斗 --- 第一个表-->
  <div>
    <div class="header">
      <el-button style="margin-left: 20px" type="danger" plain size="mini" @click="remode">返回</el-button>
      <div>
        <el-form ref="formdept" size="mini" :inline="true" :model="formdept" label-width="80px">
          <el-form-item>
            <el-date-picker
              v-model="ruleForm.timeData"
              type="daterange"
              style="width: 55%;"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="组织" prop="deptId">
            <treeselect v-model="ruleForm.deptId" style="width: 190px;" :options="deptOptions" :show-count="true" :clearable="false" :disable-branch-nodes="true" placeholder="请选择归属公司" />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="getData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div />
    </div>
    <!-- 表头 -->
    <allTableone :form="form" />
    <!-- 表身 -->
    <allTabletwo :form="form" />
    <!--弹出框-->
    <el-dialog
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      :before-close="handleClose"
    >
      <el-form ref="ruleForm" :model="ruleForm" size="mini" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="报表维度" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio :label="0">全</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="ruleForm.timeData"
            type="daterange"
            style="width: 210px;"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="组织" prop="deptId">
          <treeselect v-model="ruleForm.deptId" style="width: 210px;" :options="deptOptions" :show-count="true" :clearable="false" :disable-branch-nodes="true" placeholder="请选择归属公司" />
        </el-form-item>
        <el-form-item>
          <el-button style="float: right; margin-right: 40px" size="mini" type="primary" plain @click="hosTime">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import allTableone from '@/views/ReportAnalysis/WholeHospital/allTableone'
import allTabletwo from '@/views/ReportAnalysis/WholeHospital/allTabletwo'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import vm from '@/utils/util'
export default {
  name: 'AllHospitalSales',
  components: {
    allTableone,
    allTabletwo,
    Treeselect
  },
  data() {
    return {
      formdept: {},
      dialogVisible: true,
      ruleForm: {
        resource: 0,
        timeData: new Date()
      },
      dialogWidth: 0,
      // 公司树
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        timeData: null
      }, // 父子传值
      rules: {
        resource: { required: true, message: '请选择', trigger: 'blur' },
        time: { required: true, message: '请选择时间', trigger: 'blur' }
      }
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
  watch: {
    deptId(val) {
      this.deptId = val
      this.handleNodeClick(val) // 监听表头公司
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.defaultDate()
    this.getTreeselect()
    this.handleNodeClick({ deptId: this.deptId, isDepartment: '1' })
    // 初始化调用
    this.setDialogWidth()
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.setDialogWidth()
      })()
    }
  },
  methods: {
    setDialogWidth() {
      var val = document.body.clientWidth
      const def = 800 // 宽度最小为800,可修改
      // 窗口宽度小于默认宽度时，将弹框看度设置为50%,可修改
      if (val < def) {
        this.dialogWidth = '360px'
      } else {
        // 窗口宽度大于默认宽度1200时，将弹框设置为400宽度,可修改
        this.dialogWidth = '520px'
      }
    },
    getData() {
      // 接口 表头搜索
      this.form = {
        timeData: this.ruleForm.timeData,
        deptId: this.ruleForm.deptId // 公司
      }
    },
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // // 节点点击事件
    handleNodeClick(data) {
      this.ruleForm.deptId = data.deptId
      this.$api.dept.DepartmentList(data, 'get').then((res) => {
        if (res) {
          this.postOptions = res.rows
        }
      })
    },
    hosTime() {
      this.getData()
      this.form = {
        timeData: this.ruleForm.timeData,
        deptId: this.ruleForm.deptId // 公司
      }
      this.dialogVisible = false
    },
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogVisible = false
          this.form = {
            timeData: this.ruleForm.timeData,
            deptId: this.ruleForm.deptId // 公司
          }
        })
        .catch(_ => {
        })
    },
    // 返回
    remode() {
      this.closeTag()
      // this.$router.back()
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    defaultDate() {
      // 获取新的时间(2019.4.12）
      const date = new Date()
      // 获取当前时间的年份转为字符串
      const year = date.getFullYear().toString() // '2019'
      // 获取月份，由于月份从0开始，此处要加1，判断是否小于10，如果是在字符串前面拼接'0'
      const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString() // '04'
      // 获取天，判断是否小于10，如果是在字符串前面拼接'0'
      const da = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString() // '12'
      // 字符串拼接，开始时间，结束时间
      const end = year + '-' + month + '-' + da // 当天'2019-04-12'
      const beg = year + '-' + month + '-01' // 当月第一天'2019-04-01'
      this.ruleForm.timeData = [beg, end] // 将值设置给插件绑定的数据
    }
  }
}
</script>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
>>> .el-dialog__header{
  height: 28px;
  background: #1abc9c;
}
</style>
