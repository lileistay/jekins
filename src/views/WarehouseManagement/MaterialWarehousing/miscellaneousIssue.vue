<template>
  <!-- 其他出库 -->
  <div class="box">
    <sg-table
      ref="table"

      :sg-ref="'multipleTable'"
      size="mini"
      index="序号"
      border
      :pagination="pagination"
      selection
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :operate="operate"
      :header-style="{backgroundColor:'#1abc9c'}"
      @operateClick="operateClick"
      @size-change=" sizeChange"
      @current-change="change"
      @row-click="rowClick"
      @selection-change="handleSelectionChange"
    >
      <!--搜索框 -->
      <div slot="searchBar" class="headers">
        <div>
          <el-form ref="form" :model="form" :inline="true" size="mini" style="height:100%">
            <el-form-item label="单据号:">
              <el-input v-model="form.outDocumentNo" style="width: 100px" clearable />
            </el-form-item>
            <el-form-item label="操作人:">
              <el-input v-model="form.executeUserName" style="width: 130px" clearable />
            </el-form-item>
            <el-form-item label="领料部门:">
              <treeselect
                v-model="form.departmentId"
                :options="menuOptions"
                :normalizer="normalizer"
                placeholder="选择部门"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="领料人:">
              <el-select v-model="executeUserNames" placeholder="请选择" filterable :filter-method="may" @change="$forceUpdate()">
                <el-option
                  v-for="item in outPersonList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
<!--              <el-input v-model="form.executeUserName" style="width: 135px" clearable />-->
            </el-form-item>
            <el-form-item label="出库日期 :" prop="receptionTime">
              <el-date-picker
                v-model="form.receptionTime"
                style="width:200px"
                clearable
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-bottom: 10px">
          <el-button
            icon="el-icon-search"
            size="mini"
            type="primary"
            plain
            style="margin-right:3px"
            @click.stop.native="getData(true)"
            @keydown.enter.native="getData(true)"
          >查询</el-button>
        </div>
      </div>
      <!-- 按钮 -->
      <div slot="header" class="headers">
        <div>出库列表</div>
        <div style="float: right">
          <el-button
            size="mini"
            plain
            type="primary"
            style="float: right;margin-left: 10px"
            icon="el-icon-back"
            @click="getOther"
          >其他出库</el-button>
          <el-button
            size="mini"
            plain
            type="success"
            style="float: right"
            icon="el-icon-back"
            @click="getOut"
          >盘亏出库</el-button>
        </div>
      </div>
      <template #custom="data">
        <div v-if="data.props === 'documentType'">
          <show-dict-data :options="dict.type.document_type" :value="data.custom.documentType" />
        </div>
        <div v-else-if="data.props === 'statets'">
          <p />
          <p :class="{redStr: data.custom.status == '0'}"> 已审核/已执行 </p>
          <p :class="{redStr: data.custom.status !== '0'}">未执行</p>
        </div>
        <div v-else-if="data.props === 'payName'">
          <p :class="{redStr: data.custom.status !== '0'}"> --- </p>
          <p :class="{redStr: data.custom.status == '0'}" style="color: #5f94de;cursor:pointer" @click="expiret(data.custom)">打印</p>
        </div>
        <div v-else-if="data.props === 'outDocumentNo'">
          <p :class="{redStr: data.custom.status !== '0'}">{{ data.custom.outDocumentNo }}</p>
          <a :class="{redStr: data.custom.status == '0'}" style="color: #5f94de;cursor:pointer" @click="Receipt(data.custom)">{{ data.custom.outDocumentNo }}</a>
        </div>
        <div v-else-if="data.props === 'caozuo'">
          <p :class="{redStr: data.custom.status == '0'}"> --- </p>
          <a :class="{redStr: data.custom.status !== '0'}" style="color: #5f94de;cursor:pointer" @click="handlecompile(data.custom)">编辑</a>
        </div>
      </template>
      <!-- --字典-- -->
      <!-- <template #custom="data">
        <div v-if="data.props==='customSex'">
          <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
        </div>
      </template> -->
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { debounce } from '@/utils/throttleAndDebounce'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import PinyinMatch from "pinyin-match";


export default {
  name: 'MiscellaneousIssue',
  dicts: ['whether', 'document_type'],
  // eslint-disable-next-line vue/no-unused-components
  components: { SgTable, Treeselect },
  data() {
    return {
      executeUserNames:'',
      // TODO 字段没对
      showDataDialog: false,
      selectionData: [], // 选择的数据
      //   搜索框
      form: {
        outDocumentNo: '',
        executeUserNames:"",
      },
      menuOptions: [], // 部门
      tableData: [],
      // 表头
      columns: [
        {
          lab: '单据号',
          val: 'outDocumentNo',
          custom: 'outDocumentNo',
          width: 150
        },
        {
          lab: '单据类型',
          val: 'documentType',
          custom: 'documentType'
        },
        {
          lab: '执行人',
          val: 'executeUserName'
        },
        {
          lab: '执行日期',
          val: 'operationDate'
        },
        {
          lab: '领料部门',
          val: 'sectionName'
        },
        {
          lab: '领料人',
          val: 'outPerson'
        },
        {
          lab: '备注',
          val: 'remark'
        },
        {
          lab: '详细',
          val: 'remark'
        }
      ],
      outPersonList:[],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          {
            lab: '修改',
            type: 'warning',
            permi: ['system:chargeType:edit']
          }
        ]
      },
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      sysUserList: [],
      newhfuserList:[],
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
      this.getData()
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getoutPersonList();
    this.getData()
    this.getUserList()
    this.getTreese()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    getoutPersonList(){
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        res.data.forEach(item => {
          item.label = item.nickName
          item.value = item.userId
        })
        const arr1 = this.unique(res.data)
        this.outPersonList=arr1;
        this.newhfuserList=arr1;
      })
    },
    may(val){
      if (val) {
        //取值
        let newlist = this.newhfuserList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
        this.outPersonList=newlist;

        this.$forceUpdate()
        // this.otherForm.refereeuserId=val
      }else{
        this.outPersonList=this.newhfuserList;
      }
    },
    // 点击单据号
    Receipt(val) {
      this.form = val
      this.title = val.outDocumentNo
      this.$api.storageRoom.outList({ outDocumentNo: val.outDocumentNo }).then(res => {
        if (res) {
          this.templateData = res.rows
          this.showDialog = true
        }
      })
    },
    // 打印
    async expiret(val) {
      this.printList = []
      this.print = {}
      await this.$api.storageRoom.outList({ outDocumentNo: val.outDocumentNo }).then(res => {
        if (res) {
          this.printList = res.rows
        }
      })
      this.print = val
      this.$nextTick(() => {
        this.$refs.outsourcing.print()
      })
    },
    // 搜索
    getData: debounce(function(isSearch) {
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      var data = {}
      this.loadingData = true
      // form = Object.assign(form, this.pagination)
      data = {
        params: {
          // beginexecuteData: data.executeData === undefined ? null : data.executeData, // 出库日期开始
          // endexecuteData: data.endexecuteData === undefined ? null : data.endexecuteData // 出库日期结束
          // beginoperationDate: data.executeData === undefined ? null : data.executeData, // 出库日期开始
          // endoperationDate: data.endexecuteData === undefined ? null : data.endexecuteData // 出库日期结束
        },
        deptId: this.deptId,
        outDocumentNo: this.form.outDocumentNo ? this.form.outDocumentNo : null,
        executeUserName: this.form.executeUserName,
        remark: this.remark,
        documentType: '4'
      }
      data = Object.assign(data, this.pagination)
      this.$api.storageRoom.outInfoList(data).then(res => {
        if (res) {
          // triagePersonTime : this.form.triagePersonTime ? this.form.triagePersonTime[0] : null,
          // endtriagePersonTime : this.form.triagePersonTime ? this.form.triagePersonTime[1] : null,
          // departmentId : this.$route.query.departmentId
          this.tableData = res.rows
          this.pagination.total = res.total
          this.form = res.data
          this.boyMap = res.data
        }
      }).finally(() => {
        this.loadingData = false
      })
    }),
    // 修改列表
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handlecompile(e[1])
          break
      }
    },
    // 盘亏出库
    getOut() {
      this.$router.push({ path: 'outWarehouse' })
    },
    // 其他出库
    getOther() {
      console.log('miscellaneousIssue')
      this.$router.push({ path: 'miscellaneousIssue' })
    },
    // 修改
    handlecompile(e) {
      this.$message('226行')
    },
    /** 查询部门下拉树结构 */
    async getTreese() {
      var data = {
        status: '0',
        deptId: this.deptId
      }
      await this.$api.post.sectionInfoList(data).then(res => {
        if (res) {
          this.menuOptions = []
          const menu = { sectionId: 0, sectionName: '请选择', children: [] }
          menu.children = this.handleTree(res.rows, 'sectionId')
          this.menuOptions.push(menu)
        }
      })
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.sectionId,
        label: node.sectionName,
        children: node.children
      }
    },
    // 分页
    change(e) {
      this.pagination.pageNum = e[1]
      this.getData() // 调用数据
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    // 表格单选
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    // 行内点击选中
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    // 操作人员
    getUserList() {
      // 库房
      this.$api.storageRoom.wpartmentList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.RoomList = res.rows
        }
      })
      // 供应商
      this.$api.storageRoom.supplierList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.supplier = res.rows
        }
      })
      // 添加状态
      this.$api.user.getUserList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.$forceUpdate()
          // 去重
          const arr1 = this.unique(res.data)
          this.userList = arr1
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

<style lang='scss' scoped>
.box {
  padding: 0;
  .headers {
    font-size: 14px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
//.el-row .el-col {
//  height: 100% !important;
//  .el-form-item {
//    margin: 0 !important;
//  }
//}

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

.red {
  color: red;
}

.kaidan {
  padding-top: 10px;
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
}
</style>
