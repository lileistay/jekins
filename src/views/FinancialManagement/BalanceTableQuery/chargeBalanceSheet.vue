<template>
  <!-- 收费平衡表 -->
  <div>
    <div class="header">
      <div class="time">时间</div>
      <div class="search">
        <el-button type="primary" plain icon="el-icon-search" size="mini">搜索</el-button>
      </div>
    </div>
    <div class="neck">
      <div>
        <el-table
          :data="tableData"
          border
          sizi="mini"
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column type="index" label="序号" width="260" />
          <el-table-column prop="name" label="借方科目" width="260" />
          <el-table-column prop="address" label="金额" width="200" />
          <el-table-column prop="address" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-table
          :data="tableData"
          border
          sizi="mini"
          style="width: 100%"
          :header-cell-style="{'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
        >
          <el-table-column type="index" label="序号" width="260" />
          <el-table-column prop="date" label="贷方科目" width="260" />
          <el-table-column prop="address" label="金额" width="200" />
          <el-table-column prop="address" label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #e0f0fb;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  .time {
    padding-left: 40px;
  }
  .search {
    padding-right: 40px;
  }
}
.neck{
  display: flex;
  justify-content: space-between;
}
</style>
