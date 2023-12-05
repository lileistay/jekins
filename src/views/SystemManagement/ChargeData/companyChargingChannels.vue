<template>
  <!-- 公司收费渠道 -->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="dept-table">
          <sg-table
            v-if="true"

            selection
            size="mini"
            :table-data="tableData"
            :columns="columns"
            :operate="operate"
            hide-search-bar
            :pagination="pagination"
            @size-change="sizeChange"
            @current-change="currentChange"
            @operateClick="operateClick"
            @selection-change="handleSelectionChange"
            @changeImg="changeImg"
            :hideSearchBar="hideSearchBar"
          >
            <div slot="searchBar" style="display: flex;align-items: center">
              <div style="display: inline-block;margin-right: 10px;margin-top: 3px">
                <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
              </div>
              <el-select v-model="billType" size="mini" filterable clearable placeholder="请选择收费单类型" style="margin-left: 10px">
                <el-option v-for="(dict, index) in dict.type.billing_type" :key="index" :label="dict.label" :value="dict.value" />
              </el-select>
              <el-button icon="el-icon-search" size="mini" type="primary" style="margin-left: 10px" @keydown.enter.native="getData(true)" @click.stop="getData(true)" >搜索</el-button>
              <el-button size="mini" @click="resetFormSearch">重置</el-button>
            </div>
            <div slot="header">
              <el-button v-has-permi="['share:payDeptChannelRecord:add']" size="mini" plain :disabled="btnDisabled" type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
              <el-button v-has-permi="['share:payDeptChannelRecord:remove']" size="mini" plain :disabled="ids.length<=0" type="danger" icon="el-icon-delete" @click="handleDelete">批量删除</el-button>
              <el-button   size="mini" plain :disabled="ids.length<=0" type="primary" icon="el-icon-plus" @click="handleAdds" v-has-permi="['share:payDeptChannelRecord:updateBatchPayChannel']">一键同步</el-button>
            </div>
            <template #custom="data">
              <div v-if="data.props === 'status'">
                <el-switch
                  v-model="data.custom.status"
                  active-value="0"
                  inactive-value="1"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="handleStatusChange(data.custom)"
                />
              </div>
              <div v-else-if="data.props === 'billType'">
                <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" />
              </div>
            </template>
          </sg-table>
          <sgDialog :title="dialogTitle" size="430px" :dialog="showDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="150px">
                <el-form-item label="归属公司：" prop="deptId">
                  <treeselect v-model="form.deptId" disabled :options="deptOptions" :show-count="true" placeholder="请选择归属公司" style="width: 190px" />
                </el-form-item>
                <el-form-item label="收费单类型：" prop="billType">
                  <el-select v-model="form.billType" size="mini" filterable clearable placeholder="请选择收费单类型" @change="changeSelect">
                    <el-option v-for="(dict, index) in dict.type.billing_type" :key="index" :label="dict.label" :value="dict.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="是否重要：" prop="insertion">
                  <el-radio v-model="form.insertion" label="0">否</el-radio>
                  <el-radio v-model="form.insertion" label="1">是</el-radio>
                </el-form-item>
                <el-form-item label="选择付款渠道：" prop="payId">
                  <el-select v-model="form.payId" size="mini" multiple filterable clearable placeholder="请选择付款渠道" :disabled="Disable">
                    <el-option
                      v-for="item in payData"
                      :key="item.payId"
                      :label="item.payName"
                      :value="item.payId"
                      :disabled="item.disabled"
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
                  <el-button type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                  <el-button @click="handleClose">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </sgDialog>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>
import sgTable from '@/components/Table'
import Treeselect from '@riophae/vue-treeselect'
import sgDialog from '@/components/Dialog'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
export default {
  dicts: ['whether', 'sys_normal_disable', 'Loan_account_type', 'billing_type'],
  name: 'DeptChannel',
  components: {
    sgTable,
    Tree,
    Treeselect,
    sgDialog
  },
  data() {
    return {
      deptName: undefined,
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      Disable:true,
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ids: [],
      submitLoading: false,
      selectBoxDisabled: false,
      // 类型渠道数据
      // typeData: [],
      getform: {
        peyId: ''
      },
      props: { multiple: true },
      payData: [],
      dialogTitle: undefined,
      showDialog: false,
      // deptTypeData: [],
      // 分页 搜索
      pagination: {
        show: true,
        deptId: undefined,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      showDataDialog: false,
      tableData: [],
      // 表单数据
      form: {
        deptId: undefined,
        status: '0',
        billType: undefined,
        payId: [],
        insertion:'0',
      },
      rules: {
        payId: [{ required: true, message: '至少选择一个付款方式', trigger: 'change' }],
        billType: [{ required: true, message: '请选择收费单类型', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        insertion:[{ required: true, message: '请选择是否重要', trigger: 'change' }]
      },
      // 表格数据列
      columns: [
        {
          lab: '支付渠道名称',
          width: 130,
          val: 'payName'
        },
        {
          lab: '收费单类型',
          val: 'billType',
          custom: 'billType'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        },
        {
          lab: '创建人',
          val: 'createBy'
        },
        {
          lab: '创建时间',
          val: 'createTime'
        }
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '80',
        cell: [
          {
            lab: '删除',
            type: 'danger',
            permi: ['share:payDeptChannelRecord:remove']
          }
        ]
      },
      deptId: 0,
      billType: '',
      btnDisabled: true,
      hideSearchBar:false
    }
  },
  watch: {
    // 根据名称筛选公司树
    showDialog(newV){
      if(!newV){
        this.Disable=true;
      }
    },
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeselect()
    this.paymentChannelList()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
    // this.getType()
  },
  methods: {
    fold(){
      if(this.trans=='rotate(-180deg)'){
        this.trans='rotate(0deg)'
        this.emitWidth='0px';
      }else{
        this.trans='rotate(-180deg)'
        this.emitWidth='250px';
      }

    },
    handleAdds(e){
      const deptChannel = e.deptPayChannelId || this.ids
      this.$confirm('是否一键同步数据吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.confinementRoom.updateBatchPayChannel(deptChannel).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      })
    },
    changeSelect(id){
      this.Disable=false;
      this.payData.forEach(hvalue=>{
        hvalue.disabled=false;
      })
      this.tableData.forEach(value=>{
        if(value.billType==id){
           this.payData.forEach(newvalue=>{
             if(newvalue.payName==value.payName){
                newvalue.disabled=true
             }
           })
        }
      })
    },
    changeImg(e){
      this.hideSearchBar=!e
    },
    changeCompay(id,item){
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20
      // this.$store.dispatch('department', { departmentId: id })
      if (item.children!==undefined){
        this.btnDisabled = true
      }else {
        this.btnDisabled = false
        this.deptId=id
        this.form.deptId=id
        this.getData()
      }

    },
    /**
     * @author Nevin
     * @date 2022/6/24
     * @Description: 修改状态
    */
    handleStatusChange(row) {
      this.$confirm('确认要修改该收费渠道的状态？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const data = {
          deptPayChannelId: row.deptPayChannelId,
          status: row.status
        }
        await this.$api.modules.finance.payDeptChannelEdit(data).then(res => {
          if (res) {
            this.getData()
            this.$forceUpdate()
            this.$message.success(res.msg)
          } else {
            row.status = row.status === '0' ? '1' : '0'
          }
        })
      }).catch(() => {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.deptPayChannelId)
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
      this.resetForm()
      this.form = {
        deptId: undefined,
        payId: [],
        billType: undefined,
        status: '0',
        insertion:'0'
      }
    },
    // 添加
    handleAdd() {
      this.showDialog = true
      this.form.type = undefined
      this.dialogTitle = '添加公司收款渠道'
      this.form.deptId = this.deptId
      this.form.status='0'
      this.form.insertion='0'
    },
    // 支付方式
    paymentChannelList() {
      // 添加状态
      this.$api.modules.finance.paymentChannelList({ status: '0' }).then(res => {
        if (res) {
          res.rows.forEach(value=>{
            value.disabled=false
          })
          this.payData = res.rows
        }
      })
    },
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
    // 节点点击事件
    handleNodeClick(data) {
      this.deptId = data.id
      if (data.children === undefined) {
        this.btnDisabled = false
        this.getData()
      } else {
        this.btnDisabled = true
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 操作列
    operateClick(e) {
      switch (e[0].lab) {
        case '删除':
          this.handleDelete(e[1])
      }
    },
    // 删除操作
    handleDelete(e) {
      const deptChannel = e.deptPayChannelId || this.ids
      this.$confirm('是否确认删除此数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$api.finance.payDeptChannelRecordRemove(deptChannel).then(res => {
          if (res) {
            this.getData()
            this.$message.success(res.msg)
          }
        })
      })
    },
    // 重置表单
    resetForm() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
        this.form = {
          deptId: undefined,
          payId: [],
          billType: undefined,
          status: '0'
        }
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            deptId: this.form.deptId,
            payId: this.form.payId,
            billType: this.form.billType,
            status: this.form.status,
            params:{
              insertion:this.form.insertion
            }
          }
          this.submitLoading = true
          this.$api.modules.finance.payDeptChannelAdd(data).then(res => {
            if (res) {
              this.$message.success(res.msg)
              this.form = {
                deptId: undefined,
                payId: [],
                billType: undefined,
                status: '0',
                insertion:'0'
              }
              this.showDialog = false
              this.getData()
            }
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
          // this.getData()
        }
      })
    },
    resetFormSearch() {
      this.getform.peyId = undefined
      this.getData(true)
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      this.showDataDialog = true
      let data = {}
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        if (this.deptId==0){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      data = Object.assign(data, this.pagination)
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'billType', this.billType)
      this.$api.modules.finance.payDeptChannelRecord(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    })
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
  width: calc(100% - 0px);
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
</style>
