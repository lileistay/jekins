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
          <div slot="searchBar" class="header">
  
          </div>
            <template #custom='data'>
                <span v-if="data.props === 'achievement'">{{Number(data.custom.achievement).toFixed(0) | numberToCurrency}}</span>
                <span v-if="data.props === 'perCapita'">
                    {{  Number(data.custom.receptionVolume)==0?'0':((Number(data.custom.deal).toFixed(0) / Number(data.custom.receptionVolume))*100).toFixed(0)}}%</span>
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
        tableData: [],
        columns: [
          {
            lab: '接待人',
            val: 'acName'
          },
          {
            lab: '接待量',
            val: 'receptionVolume',
          },
          {
            lab: '成交量',
            val: 'deal',
          },
          {
            lab: '成交率',
            val: 'perCapita',
            custom: 'perCapita'
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
      this.formitem = JSON.parse(this.$route.query.order)
      this.getData()
    },
    methods: {
      // 查询
      getData(isSearch) {
        if (isSearch) {
          this.pagination.pageNum = 1
          this.pagination.currentPage = 1
        }
        var date = {
          deptId: this.formitem.deptId,
          time: this.formitem.time,
        }
        date = Object.assign(date, this.pagination)
        this.$api.deptId.reception(date).then(res => {
          if (res) {
            this.tableData = res.data
            this.pagination.total = res.data.length
          }
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
  