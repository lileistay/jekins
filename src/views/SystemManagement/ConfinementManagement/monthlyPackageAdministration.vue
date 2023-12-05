<template>
  <!--  月子套餐管理-->
  <div class="container">
    <div class="department-list">
      <el-input v-model="deptName" size="small" placeholder="请输入公司名称" />
      <div class="down-tree">
        <el-tree
          ref="tree"
          class="el-tree"
          default-expand-all
          :filter-node-method="filterNode"
          :data="deptOptions"
          :props="defaultProps"
          highlight-current
          @node-click="handleNodeClick"
        />
      </div>
    </div>
    <div class="dept-table">
      <sg-table
        ref="table"
        
        size="mini"
        border
        stripe
        index="序号"
        highlight-current-row
        :table-data="tableData"
        :columns="columns"
        :pagination="pagination"
        :operate="operate"
        @operateClick="operateClick"
        @size-change="sizeChange"
        @current-change="currentChange"
      >
        <div slot="searchBar">
          <el-button size="mini" plain type="primary" icon="el-icon-plus" :disabled="addBan" @click="handleAdd">添加</el-button>&nbsp;
          <span style="font-size: 13px">顾客姓名:</span>&nbsp;<el-input v-model="search.equipmentName" size="mini" style="width: 120px;" clearable />&nbsp;
          <span style="font-size: 13px">是否显示:</span>&nbsp;
          <el-select v-model="search.status" placeholder="请选择" size="mini" style="width: 120px;" clearable filterable>
            <el-option
              v-for="dict in dict.type.whether"
              :key="dict.value"
              :value="dict.value"
              :label="dict.label"
            />
          </el-select>&nbsp;
          <el-button size="mini" type="primary" @click="getData">搜索</el-button>
          <el-button size="mini" type="warning" @click="reset">重置</el-button>
        </div>
        <template #custom="data">
          <div v-if="data.props === 'status'">
            <dict-tag :options="dict.type.whether" :value="data.custom.status" />
          </div>
        </template>
      </sg-table>
      <!--添加修改弹框-->
      <sgDialog :title="dialogTitle" size="820px" :dialog="showDialog" @handleClose="handleClose">
        <div slot="out">
          <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="120px">
            <el-row :gutter="20">
<!--              左侧-->
              <el-col :span="12">
                <el-form-item label="顾客姓名:" prop="equipmentName">
                  <el-input v-model="form.equipmentName" style="width: 140px;" />
                </el-form-item>
                <el-form-item label="月子套餐:" prop="status">
                  <el-checkbox-group v-model="form.status">
                    <el-checkbox label="至尊A套餐" />
                    <el-checkbox label="至尊B套餐" />
                    <el-checkbox label="便捷单间套餐" />
                    <el-checkbox label="基础套餐" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="房间标准:" prop="status">
                  <el-checkbox-group v-model="form.status">
                    <el-checkbox label="标准单间" />
                    <el-checkbox label="温馨单间" />
                    <el-checkbox label="小套间" />
                    <el-checkbox label="大套间" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="增值服务:" prop="status">
                  <el-checkbox-group v-model="form.status">
                    <el-checkbox label="分娩后月子配送3天" />
                    <el-checkbox label="陪产月嫂3天服务" />
                    <el-checkbox label="上面乳腺疏通一次" />
                    <el-checkbox label="腹部注释" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="产后康复项目:" prop="remark">
                  <el-input v-model="form.remark" type="textarea" />
                </el-form-item>
              </el-col>
<!--              右侧-->
              <el-col :span="12">
                <el-form-item label="月子餐:">
                  <el-checkbox-group v-model="form.status">
                    <el-checkbox label="调理型四餐" />
                    <el-checkbox label="调理型六餐" />
                    <el-checkbox label="尊享型四餐" />
                    <el-checkbox label="尊享型六餐" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="月嫂服务:">
                  <el-checkbox-group v-model="form.status">
                    <el-checkbox label="母婴月嫂" />
                    <el-checkbox label="星级月嫂" />
                    <el-checkbox label="金牌月嫂" />
                    <el-checkbox label="24小时金牌月嫂" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="宝宝洗婴中心：">
                  <span>游泳</span><el-input style="width: 80px;" />&nbsp;
                  <span>洗澡</span><el-input style="width: 80px;" />
                </el-form-item>
                <el-form-item label="赠送服务:" prop="status">
                  <el-checkbox-group v-model="form.status">
                    <el-checkbox label="市内专车接送" />
                    <el-checkbox label="产后检查" />
                    <el-checkbox label="产后美体瑜伽" />
                    <el-checkbox label="宝宝小满月" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="CAA产康:" prop="remark">
                  <el-input v-model="form.remark" type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
              <el-button @click="showDialogs">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </sgDialog>
    </div>
  </div>
</template>

<script>
import sgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  dicts: ['whether'],
  name: 'MonthlyPackage',
  components: {
    sgTable,
    sgDialog
  },
  data() {
    return {
      loadingData: false,
      deptName: undefined, // 公司搜索
      search: {
        equipmentName: '',
        status: '',
        deptId: ''
      },
      // 弹框
      form: {
        equipmentName: '',
        status: '',
        deptId: ''
      },
      TriageDepartment: [], // 科室
      addBan: true,
      single: true,
      rules: {
        equipmentName: [{ required: true, message: '请输入', trigger: 'blur' }],
        status: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      // 树
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ids: [], // 删除是否有选中的
      submitLoading: false,
      dialogTitle: '新增',
      showDialog: false,
      // 分页 搜索
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      tableData: [],
      // 表格数据列
      columns: [
        {
          lab: '顾客',
          val: 'equipmentName'
        },
        {
          lab: '创建日期',
          val: 'createTime'
        },
        {
          lab: '套餐类型',
          val: 'tape'
        },
        {
          lab: '房间类型',
          val: 'roomtype'
        },
        {
          lab: '月子餐',
          val: 'deliset'
        },
        {
          lab: '月嫂类型',
          val: 'yues'
        },
        {
          lab: '增值服务',
          val: 'fuw'
        },
        {
          lab: '赠送服务',
          val: 'fuww'
        },
        {
          lab: '产后康复项目',
          val: 'xiang'
        },
        {
          lab: 'CAA产康联合项目',
          width: 130,
          val: 'caa'
        },
        {
          lab: '游泳次数',
          val: 'sun'
        },
        {
          lab: '洗澡次数',
          val: 'sum'
        },
        {
          lab: '套餐总金额',
          width: 130,
          val: 'much'
        },
        {
          lab: '套餐折后金额',
          width: 130,
          val: 'jie'
        },
        {
          lab: '备注',
          val: 'remark'
        }
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '120',
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
      }
    }
  },
  watch: {
    // 根据名称筛选公司树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeselect()
  },
  methods: {
    // 获取数据
    getData: debounce(function() {
      // this.loadingData = true
    }),
    // 重置
    reset() {
      this.search = {
        equipmentName: '',
        remark: '',
        departmentId: '',
        status: ''
      }
      this.getData()
    },
    // 树 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handlecompile(e[1])
          break
        case '删除':
          this.handledcopy(e[1])
      }
    },
    // 表单 添加
    handleAdd() {
      this.showDialog = true
      this.dialogTitle = '新增'
    },
    // 删除操作
    handledcopy(e) {
      this.$confirm('此操作将永久此数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // let deviceIds = e.deviceId
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改
    handlecompile(e) {
      this.dialogTitle = '修改'
      this.showDialog = true
      this.handleNodeClick()
      this.$api.medical.getinfodeviceManagement(e.deviceId).then(res => {
        if (res) {
          this.form = res.data
        }
      })
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '新增') {
            // console.log('修改')
          } else {
            this.$api.medical.putdeviceManagement(this.form).then(res => {
              if (res) {
                console.log('新增')
              }
            })
          }
        }
      })
    },
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.pagination.deptId = res.data[0].id
          this.deptOptions = res.data
        }
      })
    },
    // 节点点击事件
    handleNodeClick(data) {
      if ('children' in data) {
        this.addBan = true
      } else {
        this.form.deptId = data.id
        this.search.deptId = data.id
        this.addBan = false
        this.$api.dept.DepartmentList({ deptId: data.id, status: '0', isDepartment: '1'  }, 'get').then((res) => {
          if (res) {
            this.TriageDepartment = res.rows
          }
        })
        this.getData()
      }
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
      this.form = {
        equipmentName: '',
        remark: '',
        departmentId: '',
        status: ''
      }
    },
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.getData()
    },
    // 弹框取消按钮
    showDialogs() {
      this.showDialog = false
      this.form = {
        equipmentName: '',
        remark: '',
        departmentId: '',
        status: ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container{
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
.department-list {
  width: 250px;
  padding: 5px;
  box-sizing: border-box;

  .down-tree {
    height: 730px;
    display: block;
    overflow-y: scroll;
  }

  .el-tree {
    background-color: #f8f8f8;
  }
}
.dept-table{
  width: calc(100% - 270px);
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>

