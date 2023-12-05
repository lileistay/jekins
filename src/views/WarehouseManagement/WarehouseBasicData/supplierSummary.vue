<template>
  <!--采购供应商汇总查询-->
  <div class="box">
    <sg-table
      size="mini"
      index="序号"
      border
      :pagination="pagination"
      selection
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :header-style="{backgroundColor:'#1abc9c'}"
      @size-change="sizeChange"
      @current-change="currentChange"
    >
      <div slot="searchBar" class="header-float">
        <div>
          <el-form size="mini" label-width="120px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="供应商:" prop="supplierNo">
                  <el-select v-model="form.supplierNo" filterable clearable>
                    <el-option
                      v-for="(item, index) in supplier"
                      :key="index"
                      :label="item.companyName"
                      :value="item.supplierNo"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="库房:" prop="whouseId">
                  <el-select v-model="form.whouseId" filterable clearable>
                    <el-option
                      v-for="(item, index) in RoomList"
                      :key="index"
                      :label="item.whouseName"
                      :value="item.whouseId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入库日期：">
                  <el-date-picker
                    v-model="form.executeDate"
                    style="width: 80%"
                    clearable
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="getData(true)">搜索</el-button>
        </div>
      </div>
      <div slot="header" class="header">
        <div>
          <span> 进价汇总：{{ Summary|numberToCurrency }}</span>
        </div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { math } from '@/utils/math'
import { debounce } from '@/utils/throttleAndDebounce'
import { todayTime } from '@/utils/time'
export default {
  name: 'PurchaseReceiptQuery',
  components: {
    SgTable
  },
  data() {
    return {
      Summary: 0, // 汇总
      form: {
        supplierNo: '',
        whouseId: '',
        executeDate: todayTime()
      },
      RoomList: [],
      supplier: [],
      tableData: [],
      columns: [
        {
          lab: '供应商',
          val: 'companyName'
        },
        {
          lab: '库房',
          val: 'whouseName'
        },
        {
          lab: '张数',
          val: 'supplierNumber'
        },
        {
          lab: '进价金额',
          val: 'materialPprice'
        }
      ],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      }
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
    this.getData()
    this.getUserList()
  },
  methods: {
    getData: debounce(function(isSearch) {
      var data = {
        params: {
          beginTime: this.form.executeDate === null ? null : this.form.executeDate[0],
          endTime: this.form.executeDate === null ? null : this.form.executeDate[1],
        },
        supplierNo: this.form.supplierNo,
        whouseId: this.form.whouseId,
        deptId: this.deptId
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = Object.assign(data, this.pagination)
      this.$api.storageRoom.selectSuppliertotalLsit(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.Summary = res.data
        }
      })
    }, 500),
    async getUserList() {
      // 库房
      await this.$api.storageRoom.wpartmentList({status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.RoomList = res.rows
        }
      })
      // 供应商
      await this.$api.storageRoom.supplierList({ status: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.supplier = res.rows
        }
      })
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

<style scoped lang="scss">
@import '../../../styles/globalfloat.css';

.box{
  width: 100%;
  height: 100%;
  overflow: auto;
}
.header {
  width: 100%;
  & span {
    font-size: 14px;
    margin-right: 10px;
  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
