<template>
  <!--  企业微信员工-->
  <div>
    <Tree :showDefault="false" :isShowfile="false" @changeCompay="changeCompay">
      <template v-slot:company>
        <div class="dept-table">
          <sg-table
            v-if="true"


            size="mini"
            :table-data="tableData"
            :columns="columns"
            :operate="operate"
            hide-search-bar
            :pagination="pagination"
            @size-change="sizeChange"
            @current-change="currentChange"
            @operateClick="operateClick"

          >
            <div slot="header">
<!--              <el-button v-has-permi="['share:channelDeptTypeRelation:add']" size="mini" plain type="primary" icon="el-icon-plus" @click="handleAdd" :disabled="addBan">添加</el-button>-->
              <!--          <el-button v-has-permi="['share:channelDeptTypeRelation:remove']" size="mini" plain :dept-channel="ids.length<=0" type="danger" icon="el-icon-delete" @click="handleDelete">批量删除</el-button>-->

<!--              <el-date-picker-->
<!--                v-model="time"-->
<!--                type="datetimerange"-->
<!--                format="yyyy-MM-dd HH:mm:ss"-->
<!--                value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                size="mini"-->
<!--                style="margin-right: 10px;width:300px"-->
<!--                start-placeholder="开始日期"-->
<!--                end-placeholder="结束日期"-->
<!--                :default-time="['00:00:00', '23:59:59']"-->
<!--              >-->
<!--              </el-date-picker>-->
              <el-date-picker
                v-model="time" class="inputWidth"
                size="mini"
                type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 190px;margin-right: 30px" />

                <el-select
                  v-model="form.createCustomerName"
                  clearable
                  placeholder="请输入分享人"
                  filterable
                  remote
                  reserve-keyword
                  value-key="arr"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  size="mini"
                  style="margin-right: 10px"
                >
                  <el-option
                    v-for="(arr, index) in searchsharepeole"
                    :key="index"
                    :value="arr"
                    :label="arr.refereeName + arr.refereePhone"
                  />
                </el-select>
              <!--          <el-input v-model="pagination.searchValue" clearable size="mini" class="header-search-item" style="width: 200px;" placeholder="请输入要搜索的渠道名称" />-->
              <el-button icon="el-icon-search" size="mini" type="primary" @click="getData(true)">搜索</el-button>
<!--              <el-button size="mini" @click="resetFormSearch">重置</el-button>-->
            </div>
            <template #custom="data">
              <div v-if="data.props === 'status'">
                <dict-tag :options="dict.type.activation_status" :value="data.custom.status" />
              </div>
            </template>
          </sg-table>
          <sgDialog title="修改" size="350px" :dialog="showDialog" @handleClose="handleClose">
            <div slot="out">
              <el-form ref="form" :model="form" size="mini" :rules="rules" label-width="80px">
<!--                <el-form-item label="归属公司" prop="deptId">-->
<!--                  <treeselect v-model="form.deptId" disabled :options="deptOptions" :show-count="true" placeholder="请选择归属公司" />-->
<!--                </el-form-item>-->
                <el-form-item label="分享人" prop="searchRefereeuser">
                  <el-select
                    v-model="form.searchRefereeuser"
                    clearable
                    placeholder="请输入分享人"
                    filterable
                    remote
                    reserve-keyword
                    value-key="arr"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    size="mini"
                  >
                    <el-option
                      v-for="(arr, index) in sharepeole"
                      :key="index"
                      :value="arr.id"
                      :label="arr.refereeName + arr.refereePhone"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="归属人" prop="userId">
                  <el-select
                    v-model="form.userId"
                    clearable
                    placeholder="请输入归属人"
                    filterable
                    remote
                    reserve-keyword
                    value-key="arr"
                    :remote-method="getRelevancyCompany"
                    :loading="loading"
                    size="mini"
                  >
                    <el-option
                      v-for="(arr, index) in sharepeoles"
                      :key="index"
                      :value="arr.id"
                      :label="arr.refereeName + arr.refereePhone"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <div style="float: right">
                    <el-button type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                    <el-button @click="showDialog = false">取消</el-button>
                  </div>

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
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime
} from "@/utils/time";
export default {
  dicts: ['activation_status'],
  name: 'ascription',
  components: {
    sgTable,
    Tree,
    Treeselect,
    sgDialog
  },
  data() {
    // var validateType = (rule, value, callback) => {
    //   if (this.form.type === undefined || this.form.type.length <= 0) {
    //     callback(new Error('请选择渠道'))
    //   }
    //   callback()
    // }
    return {
      deptName: undefined,
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              picker.$emit('pick', beforeDayTime(1))
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', todayTime())
            }
          },
          {
            text: '上周',
            onClick(picker) {
              picker.$emit('pick', beforeWeek(1))
            }
          },
          {
            text: '本周',
            onClick(picker) {
              picker.$emit('pick', thisWeek())
            }
          },
          {
            text: '上月',
            onClick(picker) {
              picker.$emit('pick', lastMonth())
            }
          },
          {
            text: '本月',
            onClick(picker) {
              picker.$emit('pick', monthData())
            }
          },
          {
            text: '上季度',
            onClick(picker) {
              picker.$emit('pick', lastQuarter())
            }
          },
          {
            text: '本季度',
            onClick(picker) {
              picker.$emit('pick', thisQuarter())
            }
          },
          {
            text: '上年',
            onClick(picker) {
              picker.$emit('pick', lastYear())
            }
          },
          {
            text: '本年',
            onClick(picker) {
              picker.$emit('pick', thisYear())
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(7)[0], todayTime()[1]])
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [beforeDayTime(30)[0], todayTime()[1]])
            }
          }
        ]
      },
      sharepeoles:[],
      Idlist:"",
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ids: [],
      submitLoading: false,
      selectBoxDisabled: false,
      // 类型渠道数据
      typeData: [],
      props: { multiple: true },

      dialogTitle: undefined,
      showDialog: false,
      deptTypeData: [],
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
        deptId: ''
      },
      rules: {
        searchRefereeuser: [
          { required: true, message: '请输入分享人', trigger: 'blur' },
        ],
        userId: [
          { required: true, message: '请输入归属人', trigger: 'blur' },
        ]
      },
      // 表格数据列
      columns: [

        {
          lab: '注册用户',
          val: 'customerName'
        },
        {
          lab: '分享人',
          val: 'shCustomerName',
        },
        {
          lab: '归属人',
          val: 'createCustomerName',
        },
        {
          lab: '系统用户',
          val: 'sysUserName'
        },
        {
          lab: '分享内容',
          val: 'waitSource'
        },
        {
          lab: '注册时间',
          val: 'privilegedTime'
        },
      ],
      // 操作列
      operate: {
        name: '操作',
        width: '100',
        cell: [
          // {
          //   lab: '删除',
          //   type: 'danger',
          //   permi: ['share:channelDeptTypeRelation:remove']
          // }
          {
            lab: '修改',
            type: 'warning',
            permi: ['share:channelDeptTypeRelation:edit']
          }
        ]
      },
      addBan:true,
      sharepeole:[],
      loading:false,
      searchsharepeole:[],
      time:[]
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
    // 根据名称筛选公司树
    deptName(val) {
      this.$refs.tree.filter(val)
    },
    deptId(val) {
      this.deptId = val
    }
  },
  created() {
    this.getTreeselect()
    // this.getType()
  },
  methods: {
    // 查询推荐人
    remoteMethod(query) {
      // 当input里面的值大于两个的时候触法搜索
      if (query.length > 2) {
        this.loading = true
        //  一秒后再搜索
        setTimeout(() => {
          this.loading = false
          this.$api.modules.netPower.selectRecommend({ namephonecard: query }).then(res => {
            if (res) {
              this.sharepeole = res.data
              this.searchsharepeole = res.data
            }
          })
        }, 1000)
      }
    },
    getRelevancyCompany(query){
      if (query.length > 2) {
        this.loading = true
        //  一秒后再搜索
        setTimeout(() => {
          this.loading = false
          this.$api.modules.netPower.getRelevancyCompanyStaff({ namephonecard: query }).then(res => {
            if (res) {
              this.sharepeoles = res.data
              // this.searchsharepeole = res.data
            }
          })
        }, 1000)
      }
    },
    changeCompay(id,item){
      this.pagination.pageNum = 1
      this.pagination.currentPage = 1
      this.pagination.pageSize = 20
      if (item.children!==undefined){
        this.addBan = true
      }else {
        this.addBan = false
        this.pagination.deptId = id
        this.getData()
      }
      // this.$store.dispatch('department', { departmentId: id })

    },
    handleSelectionChange(selection) {
      this.ids = selection[1].map(item => item.deptChannel)
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
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
        // case '删除':
        //   this.handleDelete(e[1])
        // //   break
        case '修改':
          this.handlecompile(e[1])
      }
    },
    handlecompile(e) {
      this.showDialog = true
      this.belongId=e.belongId
      this.Idlist=e.id
      this.form={
        searchRefereeuser:'',
        userId:'',
      }
    },

    // 重置表单
    resetForm(form) {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
        this.form = {
          deptId: undefined,
          type: undefined
        }
      }
    },
    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
            const data = {
              deptId: this.pagination.deptId==1?this.deptId:this.pagination.deptId,
              belongId:this.belongId,
              sharedBy:this.form.searchRefereeuser,
              userId:this.form.userId,
              id:this.Idlist,
            }
            this.submitLoading = true
            this.$api.modules.groupGoods.customerBelongEdit(data).then(res => {
              if (res) {
                this.$message.success(res.msg)
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
          this.pagination.deptId = res.data[0].id
          // this.deptOptions = res.data
          this.getData()
        }
      })
    },
    resetFormSearch() {
      this.pagination.typeId = undefined
      this.getData(true)
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
        if (this.pagination.deptId==1){
          this.$message.warning('请选择公司查询')
          return
        }
      }
      const query={
        deptId:this.pagination.deptId==1?4:this.pagination.deptId,
        params:{
          beginTime:this.time[0],
          endTime:this.time[1]
        }
      }
      this.showDataDialog = true
      this.$api.modules.groupGoods.customerBelongList({...this.pagination,...query}).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
    // getData() {
    //   this.$api.modules.groupGoods.customerBelongList({ status: '0' }).then(res => {
    //     if (res) {
    //       this.tableData = res.rows
    //
    //     }
    //   })
    // }
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
