<template>
  <!-- 用户列表 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          plain
          @click.stop="getuserList(true)"
        >查询
        </el-button>
        <el-button
          v-has-permi="['payment:toBePaidList:export']"
          size="mini"
          type="success"
          :loading="submitLoadings"
          @click.stop="exportExcel"
        >导出</el-button>
      </div>
      <slot>
        <sg-table
          ref="table"
      
          :sg-ref="'multipleTable'"
          size="mini"
          border
          index="序号"
          :table-data="tableData"
          :columns="columns"
          :pagination="pagination"
          stripe
          :operate="operate"
          highlight-current-row
          @operateClick="operateClick"
          @size-change="sizeChange"
          @current-change="currentChange"
        >
          <div slot="searchBar" class="searchBar">
            <span style="font-size: 14px"><i class="el-icon-s-fold" /> 用户列表</span>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'sex'">
              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.sex" />
            </div>
            <div v-else-if="data.props === 'region'">
              <show-dict-data :options="dict.type.nucleic_acid_test" :value="data.custom.region" />
            </div>
            <div v-else-if="data.props === 'nucleicAcid'">
              <show-dict-data :options="dict.type.nucleic_acid_test" :value="data.custom.nucleicAcid" />
            </div>
            <div v-else-if="data.props === 'headImg'">
              <img class="wx_img" :src="data.custom.headImg">
            </div>
            <div v-else-if="data.props === 'isDirector'">
              <el-switch
                v-model="data.custom.isDirector"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleStatusChange(data.custom)"
              />
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <sg-table
      id="out-table"
      size="mini"
      index="序号"
      style="display: none"
      :table-data="tableDatas"
      :columns="columns"
    >
      <template #custom="data">
        <div v-if="data.props === 'sex'">
          <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.sex" />
        </div>
      </template>
    </sg-table>
    <sg-dialog
      :title="title"
      :dialog="showDialog"
      @handleClose="handleClose"
      size="380px"
    >
      <div slot="out">
        <el-form :model="form" label-width="100px" size="mini">
          <el-form-item label="微信名称">
            <el-input v-model="form.wxName" disabled style="width: 160px;" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="form.phone" disabled style="width: 160px;" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="form.sex" disabled filterable style="width: 160px;">
              <el-option
                v-for="dict in dict.type.sys_user_sex"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="form.region" filterable placeholder="请选择活动区域" style="width: 160px;">
              <el-option
                v-for="dict in dict.type.nucleic_acid_test"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否管理员">
            <el-switch
              v-model="form.isDirector"
              active-value="1"
              inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="determine">确定</el-button>
            <el-button size="mini" @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
  </div>
</template>

<script>

// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils.js'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import moment from 'moment'
import { todayTime } from '@/utils/time'

export default {
  dicts: ['sys_user_sex', 'nucleic_acid_test'],
  components: {
    SgTable,
    slideSearch,
    sgDialog
  },
  data() {
    return {
      // 弹框
      title: '修改',
      showDialog: false,
      form: {
        wxName: '',
        sex: '',
        phone: '',
        region: '',
        isDirector: ''
      },
      // 列表
      tableDatas: [],
      submitLoadings: false,
      coument: '',
      payableSigle: 0,
      placeorder: 0, // 下单人数
      // checkOut: 0,
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      rules: {
        returnComments: [
          { required: true, message: '请填写打回备注', trigger: 'change' }
        ]
      },
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 多选数据
      selectionData: [],
      operate: {
        name: '操作',
        width: 210,
        cell: [
          {
            lab: '修改',
            type: 'warning'
          }
        ]
      },
      //  序列清单
      columns: [
        //   custom: 'sex' // 调用字段或修改字体颜色
        //  width: 200, // 列表宽度
        // showOverflowTooltip: true // 字符串溢出隐藏
        {
          lab: '微信头像',
          val: 'headImg',
          custom: 'headImg',
          width: 120
        },
        {
          lab: '微信昵称',
          val: 'wxName'
        },
        {
          lab: '性别',
          val: 'sex',
          custom: 'sex'
        },
        // {
        //   lab: '区域',
        //   val: 'wxName'
        // },
        {
          lab: '用户手机号',
          val: 'phone'
        },
        {
          lab: '区域',
          val: 'region',
          custom: 'region'
        },
        {
          lab: '注册时间',
          val: 'createTime'
        },
        {
          lab: '是否管理员',
          val: 'isDirector',
          custom: 'isDirector',
          width: 120
        }
      ],
      // 查询出列表
      options: {
        wxName: {
          type: 'input',
          label: '微信昵称:'
        },
        phone: {
          type: 'input',
          label: '电话号码:'
        },
        region: {
          type: 'select',
          label: '区域:',
          clearable: true,
          options: []
        },
        sex: {
          type: 'select',
          label: '性别:',
          clearable: true,
          options: []
        },
        createTime: {
          type: 'Tdatetime',
          label: '创建时间:',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        }
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
      this.getuserList()
    }
  },
  created() {
    this.options.region.options = this.dict.type.nucleic_acid_test
    this.options.sex.options = this.dict.type.sys_user_sex
    this.getuserList()
  },
  methods: {
    // 是否管理员
    handleStatusChange(row) {
      this.$confirm('确认要修改吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const data = {
          userId: row.userId,
          isDirector: row.isDirector
        }
        await this.$api.user.userInfoEdit(data).then(res => {
          if (res) {
            this.$message.success(res.msg)
            this.getuserList()
          } else {
            // row.isDirector = row.isDirector === '0' ? '1' : '0'
          }
        })
      }).catch(() => {
        row.isDirector = row.isDirector === '0' ? '1' : '0'
      })
    },
    // 导出
    exportExcel() {
      var data = {}
      this.submitLoadings = true
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = Object.assign(data)
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      this.$api.user.userInfoList(data).then(res => {
        if (res) {
          this.tableDatas = res.rows
        }
      }).finally(() => {
        export_table_to_excel('#out-table', '待结账列表')
        setInterval(() => {
          this.submitLoadings = false
        }, 5000)
      })
    },
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getuserList()
        }
      }
    },
    // 表格操作事件
    operateClick(e) {
      switch (e[0].lab) {
        case '修改':
          this.handleUpdate(e[1])
          break
      }
    },
    handleUpdate(val) {
      this.form = val
      this.showDialog = true
    },
    determine() {
      this.$api.user.userInfoEdit(this.form).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.handleClose()
          this.getuserList()
        }
      })
    },
    handleClose() {
      this.showDialog = false
      this.form = {}
    },
    // 分页组件的方法
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getuserList()
    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getuserList()
    },
    /**
     * @author 李尚
     * @date 17/5/2022
     * @Description: 搜索
     */
    getuserList(isSearch) {
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      data = {
        wxName: this.options.wxName.values,
        phone: this.options.phone.values,
        region: this.options.region.values,
        sex: this.options.sex.values,
        params: {
          begincreateTime: data.createTime === undefined ? null : data.createTime,
          endcreateTime: data.endcreateTime === undefined ? null : data.endcreateTime
        }
      }
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = Object.assign(data, this.pagination)
      this.showDataDialog = true
      this.$api.user.userInfoList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
a{
  color: #7b95ef;
}
.wx_img{
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.container {
  width: 100%;
  height: 100%;
}
::v-deep .el-dialog__header{
  background-color: #1abc9c;
}
.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 30px;
  color: #999;
}

.headerTopPadding {
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
}
span {
  color: #999;
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
</style>
<style>
.el-input__prefix{
  display: none;
}
</style>
