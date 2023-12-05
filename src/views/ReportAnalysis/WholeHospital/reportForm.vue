<template>
  <!--  统计-->
  <div class="box">
    <sg-table
      v-if="true"
      size="mini"
      border
      selection
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
      :pagination="pagination"
      :header-style="{backgroundColor:'#1abc9c'}"
      @size-change=" sizeChange"
      @current-change="change"
    >
      <div slot="searchBar" class="tou">
        <div>
          <el-form :inline="true" size="mini">
            <el-form-item label="时间 :">
              <el-date-picker
                v-model="form.receptionTime"
                style="width: 200px"
                clearable
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item>
            <el-form-item label="咨询 :">
              <el-select v-model="form.consulting" clearable filterable style="width: 200px">
                <el-option
                  v-for="item in sysUserList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="科室 :">
              <el-select v-model="form.departmentId" clearable filterable style="width: 200px">
                <el-option
                  v-for="item in TriageDepartment"
                  :key="item.departmentId"
                  :label="item.departmentName"
                  :value="item.departmentId"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            plain
            @click.stop="getDate"
          >搜索</el-button>
        </div>
      </div>
      <div slot="header">
        <div style="font-size: 13px">统计</div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import { todayTime } from '@/utils/time'
export default {
  components: {
    SgTable
  },
  data() {
    return {
      form: {
        receptionTime: todayTime(),
        consulting: '',
        departmentId: ''
      },
      TriageDepartment: [], // 科室
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      sysUserList: [],
      tableData: [],
      columns: [
        {
          lab: '咨询',
          val: 'customerName'
          // custom: 'customerName'
        },
        {
          lab: '报表',
          val: 'b'
        },
        {
          lab: '预约人数',
          val: 'customPhone'
          // width: 150
        },
        {
          lab: '到院人数',
          val: 'customAge'
        },
        {
          lab: '成交人数',
          val: 'customSex'
        },
        {
          lab: '未成交人数',
          val: 'createUserName'
        },
        {
          lab: '成交金额',
          val: 'onlineUserName'
        }
      ]
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
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.getUserList()
    this.Department()
  },
  methods: {
    getDate() {
    // ...this.pagination, ...this.form,
    //       receptionTime: this.form.receptionTime ? this.form.receptionTime[0] : '',
    //       endreceptionTime: this.form.receptionTime ? this.form.receptionTime[1] : ''
    },
    // 分页组件
    change(e) {
      this.pagination.pageNum = e[1]
      this.getDate()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getDate()
    },
    // 获取科室的列表
    Department() {
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0',
        isDepartment: '1'
      }
      this.$api.dept.DepartmentList(data, 'get').then((res) => {
        if (res) {
          this.TriageDepartment = res.rows
          this.OneprojectList = res.rows
        }
      })
    },
    getUserList() {
      // 人员添加公司Id 添加状态
      const data = {
        status: '0',
        deptId: this.deptId
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
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

<style lang="scss" scoped>
.box {
   padding: 0;
  .tou {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    height: 100%;
  }
}
::v-deep .el-drawer__header>:first-child {
    padding-left: 20px;
}
::v-deep .el-drawer {
  height: 60% !important;
  .el-drawer__header {
    height: 28px;
    font-size: 14px;
    color: #fff;
    background-color: #1abc9c !important;
    padding: 5px 0 !important;
  }
  .pagination {
    align-content: center;
  }
}
::v-deep .align-left{
  text-align: left !important;
}
</style>
