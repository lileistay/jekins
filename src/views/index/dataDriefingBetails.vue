<template>
  <!--数据简报详情-->
  <div class="header">
    <div class="header-h">
      <div style="margin: 10px">
        
        <el-button type="primary" icon="el-icon-plus" size="mini">添加</el-button>
        <el-button icon="el-icon-download" size="mini">导入</el-button>
        <el-button icon="el-icon-upload2" size="mini">导出</el-button>
        <el-button icon="el-icon-s-fold" size="mini">新建任务</el-button>
        <el-button icon="el-icon-refresh" size="mini">转移订单</el-button>
        <el-button icon="el-icon-share" size="mini">合并客户</el-button>
        <el-button icon="el-icon-edit-outline" size="mini">批量编辑</el-button>
      </div>
      <el-table :data="tableData" size="mini" border :header-cell-style="{textAlign: 'center'}" :cell-style="{ textAlign: 'center' }" style="width: 100%;height: 700px;">
        <el-table-column prop="date" label="客户名称" />
        <el-table-column prop="name" label="客户状态" />
        <el-table-column prop="address" label="客户星级" />
        <el-table-column prop="name" label="首联系人" />
        <el-table-column prop="address" label="手机号码" />
        <el-table-column prop="address" label="最后跟进" />
        <el-table-column prop="address" label="未跟进天数" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small">跟进</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">置顶</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 100%;background-color: #ffffff; text-align: center">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataDriefingBetails',
  data() {
    return {
      tableData: [
        {}
      ],
      // 分页
      total: 0, // 一共多少条数据
      currentPage: 5
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped>
.header{
  width: 100%;
  height: 98%;
  padding-top: 10px;
}
.header-h{
  width: 95%;
  margin: 0 auto;
  background-color: #ffffff;
}
</style>
