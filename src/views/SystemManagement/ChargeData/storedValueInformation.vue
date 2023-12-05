<template>
  <!-- 交储值基本信息 -->
  <div>
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getData(true)"
          @keydown.enter.native="getData(true)"
        >查询
        </el-button>
        <el-button
          size="mini"
          icon="el-icon-document"
          type="success"
          plain
          v-has-permi="['system:cardInformation:export']"
          
          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <SgTable
          ref="table"
         id="out-table"
          :sg-ref="'multipleTable'"
          :table-data="tableData"
          index="序号"
          size="mini"
          selection
          border
          highlight-current-row
          :operate="operate"
          :pagination="pagination"
          :columns="columns"
          @operateClick="operateClick"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <div slot="searchBar" class="header-float">
            <div style="font-size: 13px"><i class="el-icon-s-data" style="color: #409EFF" />收费类型列表</div>
            <div>
              <el-button
                v-has-permi="['share:groupRecharge:add']"
                size="mini"
                icon="el-icon-plus"
                type="primary"
                @click="add"
              >新增</el-button>
            </div>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'status'">
              <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
            </div>
            <div v-else-if="data.props === 'rechargeType'">
              <dict-tag :options="dict.type.stored_value_mode" :value="data.custom.rechargeType" />
            </div>
            <div v-else-if="data.props === 'groupRecharge'">
              <span>{{ data.custom.groupRecharge = data.custom.rechargeAmount + '(储值)/' + data.custom.giftAmount + '(赠送)[比例 ' + data.custom.proportion + ']' }}</span>
            </div>
          </template>
        </SgTable>
      </slot>
    </slideSearch>
    <sg-dialog title="交储值基本信息" size="300px" :dialog="showDialog" @handleClose="handleClose">
      <div slot="out">
        <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="75px">
          <el-form-item label="储值模式" prop="rechargeType">
            <el-select v-model="form.rechargeType" filterable style="width: 100%">
              <el-option
                v-for="dict in dict.type.stored_value_mode"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.rechargeType === '1'" label="储值金额" prop="rechargeAmount">
            <el-input v-model="form.rechargeAmount" placeholder="请输入储值金额" />
          </el-form-item>
          <el-form-item v-if="form.rechargeType === '2'" label="起始范围" prop="startValue">
            <el-input v-model="form.startValue" placeholder="请输入起始范围" />
          </el-form-item>
          <el-form-item v-if="form.rechargeType === '2'" label="结束范围" prop="endValue">
            <el-input v-model="form.endValue" placeholder="请输入结束范围" />
          </el-form-item>
          <el-form-item v-if="form.rechargeType === '1'" label="赠送金额" prop="giftAmount">
            <el-input v-model="form.giftAmount" placeholder="请输入赠送金额" />
          </el-form-item>
          <el-form-item v-if="form.rechargeType === '2'" label="比例" prop="proportion">
            <el-input v-model="form.proportion" placeholder="请输入比例" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" filterable style="width: 100%">
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :value="dict.value"
                :label="dict.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">确认</el-button>
            <el-button @click="showDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖

export default {
  dicts: ['sys_normal_disable', 'stored_value_mode'],
  name: 'ChargeType',
  components: {
    slideSearch,
    SgTable,
    SgDialog
  },
  data() {
    return {
      loadingData: false,
      showDialog: false,
      form: {
        rechargeType: '1',
        rechargeAmount: '',
        giftAmount: '',
        startValue: '',
        endValue: '',
        proportion: 0,
        status: '0'
      },
      rules: {
      },
      tableData: [],
      columns: [
        {
          lab: '储值',
          val: 'groupRecharge',
          custom: 'groupRecharge',
          width: 800
        },
        {
          lab: '储值模式',
          val: 'rechargeType',
          custom: 'rechargeType'
        },
        {
          lab: '是否启用',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '创建时间',
          val: 'createTime'
        }
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '140',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['share:groupRecharge:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:groupRecharge:remove']
          }
        ]
      },
      options: {
        rechargeAmount: {
          type: 'input',
          label: '储值金额',
          clearable: false
        },
        status: {
          type: 'select',
          label: '是否启用：',
          clearable: false,
          options: [],
          values: ''
        }
      }, // 查询参数
      // 分页
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      }
    }
  },
  created() {
    this.options.status.options = this.dict.type.sys_normal_disable
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
    Export(){
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      let data = {}
      for (const k in this.options) {
        data[k] = this.options[k].values
      }
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      data = Object.assign(data)
      this.loadingData = true
      this.$api.RechargeableCard.groupRechargeList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '交储值基本信息')
        // this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 回车搜索
    */
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData(true)
        }
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 获取数据
    */
    getData: debounce(function(isSearch) {
      let data = {}
      for (const k in this.options) {
        data[k] = this.options[k].values
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
      this.loadingData = true
      this.$api.RechargeableCard.groupRechargeList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 操作
    */
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
        case '删除':
          this.handleDelete(e[1])
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 添加
    */
    add() {
      this.showDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 修改
    */
    handleUpdate(row) {
      this.form = row
      this.showDialog = true
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description:
    */
    handleDelete(row) {
      this.$confirm('是否确认删除这条信息？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.RechargeableCard.deleteGroupRecharge(row.rechargeCardId).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.getData()
          }
        })
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 弹窗确认
    */
    submitForm() {
      if (this.form.rechargeCardId !== undefined) {
        this.$api.RechargeableCard.editGroupRecharge(this.form).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.$refs['form'].resetFields()
            this.showDialog = false
            this.getData()
          }
        })
      } else {
        this.$api.RechargeableCard.addGroupRecharge(this.form).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.$refs['form'].resetFields()
            this.showDialog = false
            this.getData()
          }
        })
      }
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 关闭弹窗
    */
    handleClose() {
      this.$refs.form.resetFields()
      this.showDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    /**
     * @author Nevin
     * @date 2022/5/12
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData()
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../../../styles/globalfloat.css';

::v-deep thead .el-table-column--selection .cell {
  display: none;
}
</style>
