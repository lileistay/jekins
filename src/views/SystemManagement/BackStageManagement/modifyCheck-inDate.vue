<template>
  <!---- 修改入住日期 ---->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay" :emitWidth="emitWidth">
      <template v-slot:company>
        <div class="container">

          <div class="dept-table">
            <sg-table
              v-if="true"

              class="sadss"
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
            >
              <div slot="searchBar" style="display: flex;align-items: center">
                <div style="display: inline-block;margin-right: 10px;margin-top: -13px">
                  <img src="@/assets/images/left.png" alt="" :style="{width:'20px',height:'20px',cursor: 'pointer',transform:trans,transition:'all .5s'}" @click="fold">
                </div>
                <el-form :inline="true" size="mini" :model="formInline" class="demo-form-inline">
                  <el-form-item label="姓名：">
                    <el-input v-model="formInline.customerName" placeholder="姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="电话：">
                    <el-input v-model="formInline.customPhone" placeholder="姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="入住日期:">
                    <el-date-picker
                      v-model="formInline.checkTime"
                      style="width: 135px"
                      clearable
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="date"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click.stop="searchClick" @keydown.enter.native="searchClick">查询</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div slot="header">

              </div>
              <template #custom="data">
                <div v-if="data.props === 'status'">
                  <dict-tag :options="dict.type.sys_normal_disable" :value="data.custom.status" />
                </div>
              </template>
            </sg-table>
            <!-- 新增或修改弹框 -->
            <sgDialog :title="dialogTitle" size="380px" :dialog="showDialog" @handleClose="handleClose">
              <div slot="out">
                <el-form ref="productUnitInfo" :model="productUnitInfo" size="mini" label-width="120px">
                  <el-form-item label="入住日期:">
                    <el-date-picker
                      v-model="productUnitInfo.checkTime"
                      style="width: 135px"
                      clearable
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="date"
                    />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="editForm">确认</el-button>
                    <el-button @click="showDialog = false">取消</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </sgDialog>
          </div>
        </div>
      </template>

    </Tree>
  </div>

</template>

<script>
import sgTable from '@/components/Table/index'
import sgDialog from '@/components/Dialog/index'
import { debounce } from '@/utils/throttleAndDebounce'
import {timeFmt} from '@/utils/time'; // 防抖
import Tree from '@/components/newTree/index'
export default {
  name: 'ModifyCheckInDate',
  dicts: ['sys_normal_disable'],
  components: {
    sgTable,
    sgDialog,
    Tree
  },
  props: ['tabs'],
  data() {
    return {
      // 树形
      deptName: '',
      deptOptions: [],
      emitWidth:'250px',
      trans:'rotate(-180deg)',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogTitle: '',
      formInline: {
        customerName: '',
        customPhone: '',
        checkTime: timeFmt('YYYY-mm-dd', new Date()) // 接待时间
      },
      deptid: 0,
      addBan: true,
      // 加载
      loadingData: false,
      // 表格数据
      tableData: [],
      showDialog: false,
      // 新增表单数据
      productUnitInfo: {},
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
            type: 'warning'
          }
        ]
      },
      // 表格数据列
      columns: [
        {
          lab: '顾客姓名',
          val: 'customerName'
        },
        {
          lab: '顾客电话',
          val: 'customPhone'
        },
        {
          lab: '入住时间',
          val: 'checkTime'
        },
        {
          lab: '剩余天数',
          val: 'remainingDays'
        },
        {
          lab: '退房时间',
          val: 'checkOutTime'
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
    deptId(val) {
      this.deptId = val
      this.getData()
    }
  },
  created() {
    this.getData()
    this.getTreeselect()
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
        this.getData()
      }

    },
    // 树形
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点点击事件
    handleNodeClick(data) {
      if ('children' in data) {
        this.addBan = true
      } else {
        this.deptid = data.id
        this.addBan = false
        this.getData()
      }
    },
    /** 查询公司下拉树结构 */
    async getTreeselect() {
      await this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
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
      }
    },
    // 修改
    async handleUpdate(e) {
      this.productUnitInfo = e
      this.dialogTitle = '修改入住时间'
      this.showDialog = true
    },
    editForm() {
      var date = {
        checkTime: this.productUnitInfo.checkTime,
        waitId: this.productUnitInfo.waitId
      }
      this.$api.user.updateCheckTime(date).then(res => {
        if (res) {
          this.$message.warning('修改成功')
          this.getData()
          this.showDialog = false
        }
      })
    },
    // 重置
    resetFormSearch() {
      this.pagination.productUnitName = ''
      this.getData(true)
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
    },
    activated() {
      this.getData()
    },
    deactivated() {
      this.getData()
    },
    searchClick(){
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      if (this.deptid==0){
        this.$message.warning('请选择公司查询')
        return
      }
      this.getData()
    },
    // 获取数据
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      this.loadingData = true
      var date = {
        customPhone: this.formInline.customPhone,
        customerName: this.formInline.customerName,
        checkTime: this.formInline.checkTime,
        deptId: this.deptid
      }
      date = Object.assign(date, this.pagination)
      this.$api.user.roomReservationStatus(date).then(res => {
        if (res) {
          this.tableData = res.rows
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
// .sadss {
//   height: 861px;
// }
// .box-card{
//   height: 690px;
// }
</style>
