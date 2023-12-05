<template>
  <!--员工目标-->
  <div class="headerss">
    <sg-table
      v-if="true"
   
      :hide-search-bar="true"
      :table-data="tableData"
      :pagination="pagination"
      :columns="columns"
      :operate="operate"
      max-height="650"
      @size-change="sizeChange"
      @current-change="currentChange"
      @operateClick="operateClick"
    >
      <div slot="header">
        <el-button size="mini" plain icon="el-icon-plus" type="primary" :disabled="addBan" @click.stop="handleAdd">新增</el-button>
        <el-date-picker
          v-model="stringDate"
          size="mini"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          style="width: 30%; line-height: 40px; margin: 0 5px"
          placeholder="选择月"
        />
        <el-button size="mini" type="primary" @click="getData(true)">搜索</el-button>
        <el-button size="mini" @click="resetFormSearch">重置</el-button>
      </div>
    </sg-table>
    <!-- 新增或修改弹框 -->
    <sgDialog :title="dialogTitle" size="380px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <el-form ref="form" :rules="rules" :model="form" size="mini" label-width="120px">
          <el-form-item label="用户编号：">
            <el-select v-model="form.prNo" filterable placeholder="请输用户编号">
              <el-option
                v-for="item in sysUserList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期：">
            <el-date-picker
              v-model="form.performanceDate"
              size="mini"
              type="month"
              format="yyyy-MM"
              value-format="yyyy-MM"
              style="width: 80%; line-height: 40px; margin: 0 5px"
              placeholder="选择月"
            />
          </el-form-item>
          <el-form-item label="目标业绩：">
            <el-input v-model="form.targetsNumber" placeholder="请输入部门业绩" style="width: 80%;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">确认</el-button>
            <el-button @click="showDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import sgTable from '@/components/Table/index'
import sgDialog from '@/components/Dialog/index'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import { timeFmt } from '@/utils/time'

export default {
  name: 'ProductUnitInfo',
  dicts: ['sys_normal_disable'],
  props: ['deptids','addBan'],
  components: {
    sgTable,
    sgDialog
  },
  data() {
    return {
      // 加载
      loadingData: false,
      // 表格数据
      tableData: [],
      dialogTitle: undefined,
      showDialog: false,
      // 新增表单数据
      form: {
        performanceDate: timeFmt('YYYY-mm', new Date())
      },
      sysUserList: [], // 用户
      stringDate: timeFmt('YYYY-mm', new Date()),
      // 分页 搜索
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      rules: {},
      // 操作列
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning'
          },
          {
            lab: '删除',
            type: 'danger'
          }
        ]
      },
      // 表格数据列
      columns: [
        {
          lab: '创建人',
          val: 'createBy'
        },
        {
          lab: '个人名称',
          val: 'name'
        },
        {
          lab: '创建日期',
          val: 'performanceDate'
        },
        {
          lab: '个人业绩',
          val: 'targetsNumber'
        },
        {
          lab: '添加时间',
          val: 'createTime'
        }
      ]
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
    },
    deptids() {
      this.getData()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getData()
  },
  methods: {
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    },
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    // 添加
    handleAdd() {
      this.form = {}
      this.showDialog = true
      this.$nextTick(() => {
        this.dialogTitle = '添加目标'
      })
      this.$api.user.userList({ deptId: this.deptids === 0 ? this.deptId : this.deptids }).then(res => {
        if (res) {
          this.sysUserList = res.rows
        }
      })
    },
    // 修改
    async handleUpdate(e) {
      this.dialogTitle = '修改目标'
      this.showDialog = true
      this.form = e
    },
    // 删除
    handleDelete(e) {
      this.$confirm('确定删除该目标业绩', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deptId.atTarremove(e.atTargetId).then(res => {
          if (res) {
            this.getData()
          }
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.loadingData = true
      var date = {
        deptId: this.deptids === 0 ? this.deptId : this.deptids, // 公司
        prType: 3, // 个人
        performanceDate: this.stringDate // 时间
      }
      date = Object.assign(date, this.pagination)
      this.tableData = []
      this.$api.deptId.atTargetList(date).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          // 加载过程
          this.loadingData = false
        }
      })
    }),
    // 弹框 - 新增
    async submitForm() {
      if (this.dialogTitle === '添加目标') {
        let dates = {
          performanceDate: this.form.performanceDate, // 时间
          targetsNumber: Number(this.form.targetsNumber), // 目标业绩
          prType: 3, // 人员 类型
          deptId: this.deptids === 0 ? this.deptId : this.deptids, // 公司
          prNo: this.form.prNo // 用户编号
        }
        this.$api.deptId.atTargetAdd(dates).then(res => {
          if (res) {
            this.$message.success('新增成功')
            this.getData()
            this.showDialog = false
          }
        })
      } else {
        let dates = {
          performanceDate: this.form.performanceDate, // 时间
          targetsNumber: Number(this.form.targetsNumber), // 目标业绩
          prType: 3, // 个人
          deptId: this.deptids === 0 ? this.deptId : this.deptids, // 公司
          prNo: this.form.prNo, // 用户编号
          atTargetId: this.form.atTargetId // 数据id
        }
        this.$api.deptId.atTargetEdit(dates).then(res => {
          if (res) {
            this.$message.warning('修改成功')
            this.getData()
            this.showDialog = false
          }
        })
      }
    },
    resetFormSearch() {
      this.stringDate = ''
      this.getData()
    }
  }
}
</script>

<style scoped lang="scss">

// .box-card{
//   height: 690px;
// }
</style>
