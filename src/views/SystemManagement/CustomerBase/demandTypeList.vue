<template>
  <div>
    <!-- 需求类型 -->
    <SgTable
      v-if="true"
      :table-data="tableData"
      :columns="columns"
      index="序号"
      size="mini"
      :operate="operate"
      :pagination="pagination"
      max-height="660"
      @current-change="change"
      @size-change="sizeChange"
      @operateClick="operateClick"
    >
      <div slot="searchBar" class="searchBar">
        <el-form
          ref="formName"
          size="mini"
          :show-message="false"
          :inline="true"
          :model="form"
          :rules="rules"
          @submit.native.prevent
        >
          <el-row
            type="flex"
            justify="space-between"
          >
            <el-col>
              <el-form-item prop="demandTypeName">
                <el-input v-model="form.demandTypeName" placeholder="请输入添加的类型名称" :show-message="false" clearable />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-has-permi="['confinement:demandTypeInfo:add']"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click.stop="addType"
                >添加</el-button>
              </el-form-item>
            </el-col>
            <el-col>
              <el-row type="flex" justify="end" style="height:100%;align-items: center;">
                <el-form-item>
                  <el-input v-model="demandTypeName" placeholder="请输入搜索的类型名称" clearable />
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="mini"
                    icon="el-icon-search"
                    type="primary"
                    @click.stop="DemandType(true)"
                    @keydown.enter.native="DemandType(true)"
                  >搜索</el-button>
                  <el-button size="mini" icon="el-icon-refresh" @click.stop="reset">重置</el-button>
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
    <!-- 编辑弹层 -->
    <sgDialog
      :title="dialogTitle"
      size="400px"
      :dialog="showDialog"
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
          <el-form-item label="需求类型名称:" prop="peojectName">
            <el-input v-model="getInfo.demandTypeName" placeholder="需求类型名称" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="getInfo.status">
              <el-radio
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
              >{{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.stop="submitForm">确认</el-button>
            <el-button @click="showDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sgDialog>
    <!-- <el-dialog
  title="编辑"
  :visible="dialogVisible"
  width="30%"
 >
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog> -->
  </div>
</template>

<script>
import sgDialog from '@/components/Dialog/index' // 弹层组件
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
export default {
  dicts: ['sys_normal_disable'],
  components: {
    SgTable,
    sgDialog
  },
  data() {
    return {
      demandTypeName: '', // 搜索的数据
      dialogTitle: '编辑需求',
      showDialog: false, // 编辑弹层
      getInfo: {}, // 弹层回填的数据
      form: {
        demandTypeName: ''
      },
      // demandTypeName
      columns: [

        {
          lab: '类型名称',
          val: 'demandTypeName',
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
            permi: ['confinement:demandTypeInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['confinement:demandTypeInfo:remove']
          }
        ]
      },
      tableData: [],
      // 分页组件
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      rules: {
        demandTypeName: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.DemandType() // 列表
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.DemandType()
      }
    }
  },
  methods: {
    // 添加按钮
    addType() {
      this.$refs.formName.validate(async(isOK) => {
        if (isOK) {
          await this.$api.demand.addDemandType({ demandTypeName: this.form.demandTypeName })
          this.form = {}
          this.DemandType() // 添加完成后拉取数据
        }
      })
    },
    // 获取客户需求类型列表
    DemandType(isSearch) {
      // 添加状态
      let data = {
        deptId: this.deptId,
        status: '0',
        demandTypeName: this.demandTypeName
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
      this.$api.demand.DemandType(data).then((res) => {
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
      this.DemandType(true)
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
    // 关闭弹层
    handleClose() {
      this.showDialog = false
    },
    // 点击确定后
    submitForm() {
      // 编辑的额接口
      this.$api.demand.editDemandType(this.getInfo).then((res) => {
        if (res) {
          this.$message.success(res.msg) // 提示消息
          this.showDialog = false // 关闭弹层
          this.DemandType() // 关闭弹层调用列表数据
        }
      })
    },
    // 删除
    handleDelete(e) {
      const demandTypeIds = e.demandTypeId
      this.$confirm('是否删除此条数据？').then(async() => {
        await this.$api.demand.removeDemandType(demandTypeIds).then((res) => {
          if (res) {
            this.$message.success(res.msg)
            this.DemandType() // 重新拉取列表
          }
        })
      })
    },
    // 搜索按钮
    // SearchOffice: debounce(function() {
    //   this.$api.demand.DemandType({ demandTypeName: this.demandTypeName }).then((res) => {
    //     if (res) {
    //       this.tableData = res.rows
    //     }
    //   })
    // }),
    // 编辑
    handleUpdate(e) {
      const demandTypeId = e.demandTypeId
      this.showDialog = true // 打开弹层
      // 获取单挑的数据
      this.$api.demand.getInfoDemandType(demandTypeId).then((res) => {
        if (res) {
          this.getInfo = res.data
        }
      })
    },
    // 分页组件
    change(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.DemandType() // 重新拉去列表
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.DemandType() // 重新拉取数据
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
