<template>
    <!--个人业绩排行-->
    <el-scrollbar>
      <div>
        <SgTable
          :columns="columns"
          :pagination="pagination"
          :table-data="tableData"
          selection
          border
          index="序号"
          @operateClick="operateClick"
          @size-change="sizeChange"
          @current-change="currentChange"
        >

          <div slot="header" style="width: 100%;">
            <el-select filterable v-model="form.user" placeholder="请选择" style="width: 150px;margin-left: 20px" @change="loadmore" size="mini">
              <el-option label="订单排行" value="singular" />
              <el-option label="总业绩" value="amount" />
              <el-option label="人均消费" value="monomer" />
            </el-select>
          </div>
          <template #custom='data'>
              <span v-if="data.props === 'amount'">{{data.custom.amount | numberToCurrency}}</span>
              <span v-if="data.props === 'monomer'">{{data.custom.monomer | numberToCurrency}}元/人</span>
          </template>
        </SgTable>
      </div>
    </el-scrollbar>
  </template>

  <script>
  import SgTable from '@/components/Table'
  export default {
    name: 'Announcement',
    components: {
      SgTable
    },

    data() {
      return {
        setMeal: {},
        formitem: {
          deptId: '',
          stringDate: '',
          postType: ''
        },
        form: {
        user: 'singular'
      },
        tableData: [],
        columns: [
          {
            lab: '名称',
            val: 'projectName'
          },
          {
            lab: '单数',
            val: 'singular'
          },
          {
            lab: '总金额/元',
            val: 'amount',
             custom: 'amount'
          },
          {
            lab: '价格/人',
            val: 'monomer',
              custom: 'monomer'
          }
        ],
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
    //   this.formitem = JSON.parse(this.$route.query.order)
      this.getData(this.deptId)
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
              this.getData(val)
          }},
    methods: {
      loadmore() {
        var data = {
          orderType: this.form.user,
          deptId: this.deptId
        }
        this.tableData = []
        this.$api.deptId.productList(data).then(res => {
          if (res) {
            res.rows.forEach(item => {
              item.singular = item.singular
              item.monomer = (Number(item.monomer)).toFixed(0)
              item.amount = (Number(item.amount)).toFixed(0)
            })
            res.rows.some((v, i) => {
              this.tableData.push(v)
            })
          }
        })
      },
      // 查询
      getData(val) {
        let date;
        var data = {
        orderType: this.form.user,
        deptId: this.deptId
      }
      this.tableData=[]
      date = Object.assign(data, this.pagination)
      this.$api.deptId.productList(date).then(res => {
        res.rows.forEach(item => {
            item.singular = item.singular + '单'
            item.amount = Number(item.amount).toFixed(0)
            item.monomer =  Number(item.monomer).toFixed(0)
          })
          res.rows.some((v, i) => {
            this.tableData.push(v)
          })
          this.pagination.total=res.total
      })
      },
      // 表格操作事件
      operateClick(e) {
        switch (e[0].lab) {
          case '详情':
            this.handleUpdate(e[1])
            break
        }
      },
      handleUpdate() {},
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

  <style scoped>
  ::v-deep .sg-table-bar-content{
    display: none !important;
  }
  .headers{
    height: 60px;
    padding-top: 30px;
    text-align: center;
    background-color: #ffffff;
  }
  .nav{
    margin-top: 10px;
    background-color: #ffffff;
  }
  .btn{
    margin: 20px 0 10px 20px;
  }
  ::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar[data-v-3363c4d1] {
    display: none;
  }
  .scrollbar {
    box-sizing: border-box;
    padding: 10px 20px;
  }
  </style>
