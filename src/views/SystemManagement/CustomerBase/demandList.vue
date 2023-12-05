<template>
  <div>
    <!-- 需求列表 -->
    <SgTable
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      :operate="operate"
      index="序号"
      size="mini"
      max-height="660"
      @current-change="change"
      @size-change="sizeChange"
      @operateClick="operateClick"
    >
      <div slot="searchBar" style="height:100%">
        <el-form size="mini" :inline="true" style="height:100%" @submit.native.prevent>
          <el-row type="flex" style="height:100%" justify="space-between">
            <el-col>
              <el-form-item>
                <el-button
                  v-has-permi="['confinement:demandInfo:add']"
                  size="mini"
                  icon="el-icon-plus"
                  type="primary"
                  @click.stop="addopen"
                >添加</el-button>
              </el-form-item>
            </el-col>
            <el-col>
              <el-row type="flex" justify="end" style="height:100%">
                <el-form-item>
                  <el-select v-model="query.demandTypeId" placeholder="请选择要查询的数据类型" clearable filterable>
                    <el-option
                      v-for="item in DemandType"
                      :key="item.demandTypeId"
                      :label="item.demandTypeName"
                      :value="item.demandTypeId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="query.demandName" placeholder="请输入要查询的需求名称" clearable />
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="mini"
                    icon="el-icon-search"
                    type="primary"
                    @click="DemandManagement(true)"
                  >搜索</el-button>
                  <el-button size="mini" icon="el-icon-refresh" @click="DemandManagement">重置</el-button>
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'status'">
          <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
        </div>
      </template>
    </SgTable>

    <!-- 编辑弹层和新增弹层 -->
    <sgDialog
      :title="dialogTitle"
      size="400px"
      :dialog="dialogVisible"
      @handleClose="handleClose"
    >
      <div slot="out">
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          size="mini"
          label-width="100px"
        >
          <el-form-item label="需求名称:" prop="demandName">
            <el-input v-model="form.demandName" placeholder="需求名称" />
          </el-form-item>
          <el-form-item label="需求类型" prop="demandTypeId">
            <el-select v-model="form.demandTypeId" filterable>
              <el-option
                v-for="item in DemandType"
                :key="item.demandTypeId"
                :label="item.demandTypeName"
                :value="item.demandTypeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">确认</el-button>
            <el-button @click="colseOpen ">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sgDialog>

  </div>

</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index' // 弹层组件
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  dicts: ['sys_normal_disable'],
  components: {
    SgTable,
    sgDialog
  },
  data() {
    return {
      dialogTitle: '编辑需求',
      query: {
        demandName: '',
        demandTypeId: ''
      },
      form: {
        status: '0'
        // demandTypeId: '',
        // demandName: ''
      },
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      dialogVisible: false, // 控制弹层
      columns: [
        {
          lab: '类型名称',
          val: 'demandName',
          width: 200
        },
        {
          lab: '创建时间',
          val: 'createTime'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        }
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['confinement:demandInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['confinement:demandInfo:remove']
          }
        ]
      },
      tableData: [],
      DemandType: [], // 需求类型
      rules: {
        demandName: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
        demandTypeId: [{ required: true, message: '类型名称不能为空', trigger: 'change' }]
      }
    }
  },
  methods: {
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
    // 删除
    handleDelete(e) {
      const demandIds = e.demandId
      this.$confirm('是否删除此条数据？').then(async() => {
        const { msg } = await this.$api.demand.removeDemandManagement(demandIds)
        this.$message.success(msg)
        this.DemandManagement()
      })
    },
    // 修改
    async handleUpdate(e) {
      this.dialogVisible = true
      const demandId = e.demandId
      const { data } = await this.$api.demand.getInfoDemandManagement(demandId)
      this.form = data
    },
    // 需求类型
    DemandTypes() {
      // 添加状态
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.demand.DemandType(data).then((res) => {
        if (res) {
          this.DemandType = res.rows
        }
      })
    },
    // 获取列表
    DemandManagement(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.$api.demand.DemandManagement({ ...this.pagination, ...this.query }).then((res) => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    reset() {
      this.query = {
        demandName: undefined,
        demandTypeId: undefined
      }
      this.DemandManagement(true)
    },
    // 点击搜索按钮
    // SearchOffice: debounce(function() {
    //   this.$api.demand.DemandManagement(this.query).then((res) => {
    //     if (res) {
    //       this.tableData = res.rows
    //     }
    //   })
    // }),
    // 点击添加按钮
    addopen() {
      this.dialogVisible = true
      // this.$api.demand.addDemandManagement(this.form)
    },
    // 点击关闭图标
    handleClose() {
      this.dialogVisible = false
      this.form = {}
    },
    // 取消按钮
    colseOpen() {
      this.dialogVisible = false
      this.form = {}
    },
    // 确定
    async submitForm() {
      this.$refs.form.validate(async(isOK) => {
        if (isOK) {
          if (this.form.demandId) {
            // 编辑
            const { msg } = await this.$api.demand.editDemandManagement(this.form)
            this.dialogVisible = false
            this.$message.success(msg)
            this.DemandManagement()
          } else {
            // 添加接口
            const { msg } = await this.$api.demand.addDemandManagement(this.form)
            this.form = {} // 重置表单
            this.dialogVisible = false
            this.$message.success(msg)
            this.DemandManagement()
          }
        }
      })
    },
    // 分页输入框事件
    change(e) {
      this.pagination.pageNum = e[1] // 将选择的页码赋值
      this.pagination.currentPage = e[1]
      this.DemandManagement() // 重新调用数据
    },
    // 分页按钮点击事件
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.DemandManagement() // 重新调用数据
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-scrollbar__wrap::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  z-index: 999999;
  // height: 8px;
}
</style>
