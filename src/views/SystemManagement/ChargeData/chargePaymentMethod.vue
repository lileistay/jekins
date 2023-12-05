<template>
  <!--收费单支付方式 -->
  <div class="headers">
    <div class="header">
      <div class="left">
        <p class="titme ment">
          <span>收费单基础数据</span>&nbsp;/&nbsp;<span>收费单支付方式</span>
        </p>
        <div>
          <p class="item">收费单类型</p>
          <p
            v-for="dict in dict.type.billing_type"
            :key="dict.value"
            class="dictitem"
            :label="dict.value"
            @click="getData($event)"
          >{{ dict.label }}</p>
        </div>
      </div>
      <!-- 右侧-->
      <div class="reght">
        <div class="header" style="height: 40px; border-bottom: 1px solid #d7d5d5">
          <div>
            <p class="titme">
              <span>收费单支付方式列表</span>
            </p>
          </div>
          <div style="margin-right: 5px">
            <el-button type="primary" plain icon="el-icon-plus" size="mini">新增</el-button>
            <el-button type="danger" plain icon="el-icon-close" size="mini">删除</el-button>
          </div>
        </div>
        <el-table ref="multipleTable" :data="tableData" size="mini" :header-cell-style="{'text-align':'center'}" border style="width: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" width="55" />
          <el-table-column label="操作" width="55">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column label="顺序号" width="70" />
          <el-table-column label="收费单类型" />
          <el-table-column label="结账方式" />
          <el-table-column label="结账代码" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
/**
  * @author 李尚
  * @date 17/5/2022
  * @Description: 收费单类型
*/
export default {
  dicts: ['billing_type'],
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    getData(e) {
    }
  }
}
</script>

<style scoped lang="scss">
.headers{
  margin: 5px;
  padding: 5px;
}
.header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left{
    width: 20%;
    height: 80vh;
    border: 1px solid #d7d5d5;
    border-radius: 7px;
  }
  .ment{
    padding-top: 8px;
    margin-bottom: 10px;
  }
  .dictitem{
    font-size: 12px;
    padding: 5px 0 5px 15px;
    border-bottom: 1px solid #d7d5d5;
  }
  .item{
    height: 30px;
    font-size: 5px;
    line-height: 30px;
    color: #fffffc;
    background-color: #337ab7;
    padding-left: 5px;
  }
  .reght{
    width: 78%;
    height: 80vh;
    border: 1px solid #d7d5d5;
    border-radius: 7px;
  }
}
.titme{
  font-size: 12px;
}
</style>
