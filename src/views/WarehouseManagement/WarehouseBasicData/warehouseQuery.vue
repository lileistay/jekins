<template>
  <!-- 库房剩余 -->
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
      <div slot="searchBar" class="tou">
        <div>
          <el-form :inline="true" size="mini" style="height:100%">
            <el-form-item label="物资编码:">
              <el-input v-model="form.propps" style="width: 100px" clearable />
            </el-form-item>
            <el-form-item label="物资名称:">
              <el-input v-model="form.customCardNumber" style="width: 135px" clearable />
            </el-form-item>
            <el-form-item label="类型:">
              <el-select
                v-model="form.customerStatus"
                placeholder="请选择"
                style="width: 100px"
                clearable filterable
              >
                <el-option
                  v-for="item in dict.type.whether_Newguest"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="入库时间 :">
              <el-date-picker
                v-model="form.receptionTime"
                style="width:200px"
                clearable
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                size="mini"
                type="primary"
                plain
                style="margin-right:3px"
                @click.stop.native="getData"
              >查询</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 按钮 -->
      <div slot="header" class="headers">
        <div>库房数据</div>
      </div>
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
export default {
  dicts: ['sys_user_sex', 'Reception_status', 'whether_secondary', 'whether_Newguest', 'Triage_type'],
  components: { SgTable },
  data() {
    return {
      // TODO 字段没对
      showDataDialog: false,
      selectionData: [], // 选择的数据
      //   搜索框
      form: {
        propps: '',
        customCardNumber: '', // 顾客卡号
        customerStatus: '', // 顾客状态
        receptionTime: '' // 接待时间
      },
      tableData: [],
      // 表头
      columns: [
        {
          lab: '物资类型',
          val: 'receptionTime',
          width: 150
        },
        {
          lab: '物资类别',
          val: 'receptionStatus'
          //   custom: 'receptionStatus'
        },
        {
          lab: '物资名称',
          val: 'customerName'
        },
        {
          lab: '规格',
          val: 'customCardNumber'
        },
        {
          lab: '是否关键物资',
          width: 130,
          val: 'wuzi'
        },
        {
          lab: '价格',
          val: 'jiage'
        },
        {
          lab: '单位',
          val: 'danwei'
        },
        {
          lab: '最小库存',
          val: 'kucun'
        },
        {
          lab: '是否显示',
          val: 'customSex'
        },
        {
          lab: '默认产地(厂家)',
          width: 130,
          val: 'customPhone'
        },
        {
          lab: '默认注册证号',
          width: 130,
          val: 'customerStatus'
        }
      ],
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
      sysUserList: []
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 搜索
    getData: debounce(function() {
      // 正在加载
      this.showDataDialog = false
    }),
    // 修改列表
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handlecompile(e[1])
          break
      }
    },
    // 修改
    handlecompile(e) {
      this.$message('226行')
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
    }
  }
}
</script>

<style lang='scss' scoped>
.box {
  .tou {
    width: 100%;
    font-size: 14px;
    overflow: scroll;
    white-space: nowrap;
  }
  .headers {
    font-size: 14px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

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
