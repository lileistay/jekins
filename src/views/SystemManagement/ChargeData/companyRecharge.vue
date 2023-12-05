<template>
  <!-- 储值卡管理 -->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="">
          <el-card class="box-card">
            <sg-table
              v-if="true"
              selection
              :hide-search-bar="true"
              :table-data="tableData"
              :pagination="pagination"
              :columns="columns"
              :operate="operate"
              @size-change="sizeChange"
              @current-change="currentChange"
              @operateClick="operateClick"
              @changeImg="changeImg"
              :hideSearchBar="hideSearchBar"
              @selection-change="handleSelectionChange"

            >
              <div slot="searchBar" style="display: flex;align-items: center">
                <div style="display: inline-block;margin-right: 10px;margin-top: 3px">
                  <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
                </div>
                <el-input
                  v-model="form.rechargeCardName"
                  clearable
                  class="header-search-item"
                  style="width: 200px;"
                  size="mini"
                  placeholder="请输入你想搜索的内容"
                />
                <el-button icon="el-icon-search" size="mini" type="primary" @click.stop="getData(true)" @keydown.enter.native="getData(true)">搜索</el-button>
                <el-button size="mini" @click="resetFormSearch">重置</el-button>
              </div>
              <div slot="header">
                <el-button v-has-permi="['confinement:rechargeCardInfo:add']" size="mini" plain icon="el-icon-plus" type="primary" :disabled="addBan" @click.stop="recharges">
                  新增
                </el-button>
                <el-button v-has-permi="['confinement:rechargeCardInfo:adddelte']" size="mini" plain icon="el-icon-delete" type="primary" :disabled="addBan" @click.stop="rechargesdelete">
                  删除
                </el-button>

              </div>
              <template #custom="data">
                <div v-if="data.props === 'status'">
                  <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
                </div>
                <div v-else-if="data.props === 'rechargeCardType'">
                  <dict-tag :options="dict.type.recharge_card_type" :value="data.custom.rechargeCardType" />
                </div>
                <div v-else-if="data.props === 'productUnitName'">
                  <p>{{ data.custom.productUnitName }}</p>
                </div>
              </template>
            </sg-table>
            <!-- 新增或修改弹框 -->
            <div>
              <el-dialog
                :title="title"
                width="20%"
                :visible.sync="recharge"
                :before-close="cancel"
              >
                <el-form
                  ref="formInline"
                  :inline="true"
                  size="mini"
                  :model="formInline"
                  :rules="rules"
                  label-width="120px"
                  class="demo-form-inline"
                >
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="充值卡名称:" prop="rechargeCardName">
                        <el-input v-model="formInline.rechargeCardName" placeholder="请输入名称" style="width:160px" />
                      </el-form-item>
                      <el-form-item label="充值金额:" prop="rechargeAmount">
                        <el-input
                          v-model="formInline.rechargeAmount"
                          placeholder="请输入金额"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                          step="0.01"
                          style="width:160px"
                        />
                      </el-form-item>
                      <el-form-item label="赠送金额:">
                        <el-input
                          v-model="formInline.giftAmount"
                          placeholder="请输入赠送金额"
                          oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                          step="0.01"
                          style="width:160px"
                        />
                      </el-form-item>
                      <el-form-item label="充值类型:" prop="rechargeCardType">
                        <el-select v-model="formInline.rechargeCardType" filterable placeholder="请选择类型" style="width:160px">
                          <el-option
                            v-for="item in dict.type.recharge_card_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item v-if="formInline.rechargeCardType === '1'" label="科室:">
                        <el-select v-model="formInline.departmentId" filterable placeholder="请选择科室" style="width:160px">
                          <el-option
                            v-for="item in deptOption"
                            :key="item.departmentId"
                            :label="item.departmentName"
                            :value="item.departmentId"
                          />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="状态:" prop="status">
                        <el-radio-group v-model="formInline.status">
                          <el-radio
                            v-for="dict in dict.type.sys_normal_disable"
                            :key="dict.value"
                            :label="dict.value"
                          >{{ dict.label }}
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
              <el-button @click="cancel">取 消</el-button>
              <el-button type="primary" @click="preservation">确 定</el-button>
            </span>
              </el-dialog>
            </div>
          </el-card>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>
import sgTable from '@/components/Table/index'
import { math } from '@/utils/math'
import { debounce } from '@/utils/throttleAndDebounce' // 防抖
import Tree from '@/components/newTree/index'
export default {
  name: 'ProductUnitInfo',
  dicts: ['sys_normal_disable', 'recharge_card_type'],
  components: {
    sgTable,
    Tree
  },
  props: ['tabs'],

  data() {
    return {
      addBan: true,
      selectdata:[],
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      // 搜索
      form: {
        rechargeCardName: ''
      },
      // 加载
      loadingData: false,
      // 表格数据
      tableData: [],
      deptName: undefined,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogTitle: undefined,
      recharge: false,
      rules: {
        rechargeCardName: [
          { required: true, message: '请输名称', trigger: 'blur' }
        ],
        rechargeAmount: [
          { required: true, message: '请输金额', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '必须选一个', trigger: 'blur' }
        ],
        rechargeCardType: [
          { required: true, message: '请选择充值类型', trigger: 'blur' }
        ]
      },
      formInline: {
        rechargeAmount: '',
        giftAmount: '',
        rechargeCardName: '',
        departmentId: '',
        rechargeCardType: '',
        status: '0',
        deptId: ''
      },
      deptid: '',
      deptOptions: [],
      deptOption: [],
      title: '新增充值',
      // 分页 搜索
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      // 操作列
      operate: {
        name: '操作',
        width: '160',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['confinement:rechargeCardInfo:edit']
          },
          {
            lab: '删除',
            type: 'danger',
            permi: ['confinement:rechargeCardInfo:remove']
          }
        ]
      },
      // 表格数据列
      columns: [
        // {
        //   lab: '公司',
        //   val: 'deptName'
        // },
        {
          lab: '科室',
          val: 'departmentName'
        },
        {
          lab: '充值类型',
          val: 'rechargeCardType',
          custom: 'rechargeCardType'
        },
        {
          lab: '充值卡名称',
          width: 130,
          val: 'rechargeCardName'
        },
        {
          lab: '充值金额',
          val: 'rechargeAmount'
        },
        // {
        //   lab: '充值卡编号',
        //   val: 'rechargeCardId'
        // },
        {
          lab: '赠送金额',
          val: 'giftAmount'
        },
        {
          lab: '比例',
          val: 'proportion'
        },
        {
          lab: '状态',
          val: 'status',
          custom: 'status'
        }
      ],
      hideSearchBar:false
    }
  },
  // computed: {
  //   deptId: {
  //     get() {
  //       return this.$store.getters.departmentId
  //     },
  //     set(val) {
  //       val = this.$store.getters.departmentId
  //     }
  //   }
  // },
  watch: {
    // 根据名称筛选公司树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeselect()
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
    fold(){
      if(this.trans=='rotate(-180deg)'){
        this.trans='rotate(0deg)'
        this.emitWidth='0px';
      }else{
        this.trans='rotate(-180deg)'
        this.emitWidth='250px';
      }

    },
    handleSelectionChange(e){
      this.selectdata=e[1]
    },
    rechargesdelete(){
      this.$confirm('是否确认删除数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 删除接口
        let str='';
        if(this.selectdata.length<=1){
          str=this.selectdata[0].rechargeCardId
        }else{
          for(let i=0;i<this.selectdata.length;i++){
            if(i>=0&&i<this.selectdata.length-1){
              str+=this.selectdata[i].rechargeCardId+','
            }
            if(i==this.selectdata.length-1){
              str+=this.selectdata[i].rechargeCardId
            }
          }
        }

        this.$api.RechargeableCard.deleterechargeCardInfo(str).then(res => {
          if (res) {
            this.getData()
          }
        })
      })
    },
    changeImg(e){
      this.hideSearchBar=!e
    },
    changeCompay(id,item){
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20

      if (item.children!==undefined){
        this.addBan = true
      }else {
        this.addBan = false
        this.deptid=id
        this.pagination.deptId = id

        this.getData()
        this.deptOption = []
        this.$api.modules.netPower.projectTreeselect({ deptId: id }).then(res => {
          if (res) {
            this.deptOption = res.data
            this.getData()
          }
        })
      }

    },
    // Tree
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      if ('children' in data) {
        this.addBan = true
        this.tableData = []
      } else {
        this.deptid = data.id
        // this.formInline.rechargeCardName = data.label
        this.formInline.deptId = data.label
        // this.addBan = true
        this.addBan = false
        if (this.pagination.deptId !== data.id) {
          this.pagination.deptId = data.id
        }
        this.deptOption = []
        this.$api.modules.netPower.projectTreeselect({ deptId: data.id }).then(res => {
          if (res) {
            this.deptOption = res.data
            this.getData()
          }
        })
      }
    },
    /** 查询公司下拉树结构 */
    getTreeselect() {
      this.$api.dept.deptTree().then(res => {
        if (res) {
          this.pagination.deptId = res.data[0].id
          this.deptOptions = res.data
          this.getData()
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
    cancel() {
      this.recharge = false
      this.formInline = {
        rechargeAmount: '',
        giftAmount: '',
        rechargeCardName: '',
        departmentId: '',
        rechargeCardType: ''
      }
    },
    // 修改
    async handleUpdate(e) {
      this.title = '修改充值'
      await this.$api.RechargeableCard.getInforechargeCardInfo(e.rechargeCardId).then(res => {
        if (res) {
          this.formInline = res.data
          this.recharge = true
        }
      })
    },
    // 新增
    recharges() {
      this.title = '新增充值'
      this.recharge = true
    },
    // 确定
    preservation() {
      this.$refs.formInline.validate((valid) => {
        if (valid) {
          if (this.title === '新增充值') {
            this.formInline.deptId = this.deptid
            this.$api.RechargeableCard.addRecharge(this.formInline).then(res => {
              if (res) {
                this.$message.success('充值成功')
                this.getData()
                this.recharge = false
              }
            })
            this.formInline = {
              rechargeAmount: '',
              giftAmount: '',
              rechargeCardName: '',
              departmentId: '',
              rechargeCardType: ''
            }
            this.recharge = false
          } else {
            this.$api.RechargeableCard.rechargeCardInfo(this.formInline).then(res => {
              if (res) {
                this.$message.success('修改成功')
                this.recharge = false
                this.formInline = {
                  rechargeAmount: '',
                  giftAmount: '',
                  rechargeCardName: '',
                  departmentId: '',
                  rechargeCardType: ''
                }
                this.getData()
              }
            })
          }
        } else {
          return
        }
      })
    },
    // 重置
    resetFormSearch() {
      this.form.rechargeCardName = ''
      this.getData(true)
    },
    // 删除
    handleDelete(e) {
      this.$confirm('是否确认删除"' + e.rechargeCardName + '"的数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 删除接口
        this.$api.RechargeableCard.deleterechargeCardInfo(e.rechargeCardId).then(res => {
          if (res) {
            this.getData()
          }
        })
      })
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
        if (this.form.deptId==1){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      this.loadingData = true
      // 将this.deptid 传入到deptId里，再交给form，有名字的时候传名字，没有就穿deptid
      // 在this.form里新建一个deptId，将this.deptid
      this.$set(this.form, 'deptId', this.deptid)
      let data=Object.assign(this.form,this.pagination)
      this.$api.RechargeableCard.rechargeCardInfolist(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.tableData.forEach(item => {
            item.proportion = (parseFloat(math.divide(item.giftAmount, item.rechargeAmount)) * 100).toFixed(2) + '%'
          })
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    })
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog__header {
  background-color: #1abc9c;
}

.container {
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

.dept-table {
  width: calc(100% - 270px);
}
::v-deep .el-card{
  border: 0;
}
::v-deep .el-card__body{
  padding: 0 20px;
}
// 树形 背景颜色
::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #1abc9c !important;
  color: #ffffff;
}
// .sadss {
//   height: 861px;
// }
// .box-card{
//   padding: 0 20px;
// }
</style>
