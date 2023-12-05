<template>
  <!--  盘点物资-->
  <div class="print">
    <div class="title">{{message}}盘点单</div>
    <div style="margin: 0 40px">
      <el-row>
        <el-col :span="12">
          <div>盘点单号：{{ print.inventoryNo }}</div>
          <div>盘点状态：{{ pstat(print.status) }}</div>
        </el-col>
        <el-col :span="6">
          <div>创建人：{{ print.createPersonName }}</div>
          <div>盘点人：{{ print.inventoryPersonName }}</div>
        </el-col>

        <el-col :span="6">
          <div>库房：{{ print.executeUserName }}</div>
          <div>审核人：{{ print.examinePersonName }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div>创建日期：{{ print.generateTime }}</div>
          <div>盘点日期：{{ print.inventoryDate }}</div>
        </el-col>
      </el-row>


    </div>
    <div class="detailsTable">
      <table class="newtable" style="border-collapse: collapse;border: 1px solid #999;">
        <thead>
        <th>一级类型</th>
        <th>二级类型</th>
        <th>三级类型</th>
        <th>物资简码</th>
        <th>物资名称</th>
        <th>规格</th>
        <th>单位</th>
        <th>账面数量</th>
        <th>实盘数量</th>
        <th>盈亏数量</th>
        <th>物资单价</th>
        <th>账面总金额</th>
        <th>实盘总金额</th>
        <th>盈亏总金额</th>
        <th>备注</th>
        </thead>
        <tr v-for="item in templateList">
          <td align="center" >
            {{item.materialTypeName}}
          </td>
          <td align="center" >
            {{item.typeName}}
          </td>
          <td align="center" >
            {{item.matTypeName}}
          </td>
<!--          物资简码-->
          <td align="center" >
            {{item.shortCode}}
          </td>
          <td align="center" >
            {{item.materialName}}
          </td>
          <td align="center" >
            {{item.unitName}}
          </td>
<!--          单位-->
          <td align="center" >
            {{item.materialSpec}}
          </td>
          <td align="center" >
            {{item.inventoryQuantity}}
          </td>
          <td align="center" >
            {{item.inventoryNumber}}
          </td>
          <td align="center" >
            {{item.inventoryLossNumber}}
          </td>
<!--          物资单价-->
          <td align="center" >
            {{item.purchasePrice}}
          </td>
          <td align="center" >
            {{item.materialPrice}}
          </td>
          <td align="center" >
            {{item.inventoryPrice}}
          </td>
          <td align="center" >
            {{item.inventoryLossPrice}}
          </td>
          <td align="center" >
            {{item.remark}}
          </td>

        </tr>

      </table>
<!--      <el-table-->
<!--        :data="templateList"-->
<!--        size="mini"-->
<!--        border-->
<!--        class="elTable"-->
<!--        style="width: 100%"-->
<!--        :header-cell-style="{'text-align':'center', 'font-size':'12px'}"-->
<!--        :cell-style="{'text-align':'center', 'font-size':'12px'}"-->
<!--      >-->
<!--        <el-table-column prop="whouseName" label="一级类型" width="50"  />-->
<!--        <el-table-column prop="typeId" label="二级类型" />-->
<!--        <el-table-column prop="matTypeId" label="三级类型" />-->
<!--        <el-table-column prop="shortCode" label="物资简码" />-->
<!--        <el-table-column prop="startTime" label="物资编码" />-->
<!--        <el-table-column prop="matTypeName" label="物资名称" />-->
<!--        <el-table-column prop="materialSpec" label="规格" width="80" />-->
<!--        <el-table-column prop="unitName" label="单位" width="80" />-->
<!--        <el-table-column prop="availableNumber" label="账面数量" width="70" />-->
<!--        <el-table-column prop="whouseId" label="实盘数量" width="70" />-->
<!--        <el-table-column prop="place" show-overflow-tooltip label="盈亏数量" width="70" />-->
<!--        <el-table-column prop="certificateNo" show-overflow-tooltip label="物资单价" />-->
<!--        <el-table-column prop="inventoryPrice" show-overflow-tooltip label="账面总金额" width="88" />-->
<!--        <el-table-column prop="materialPrice" show-overflow-tooltip label="实盘总金额" width="88" />-->
<!--        <el-table-column prop="inventoryLossNumber" show-overflow-tooltip label="盈亏总金额" width="88" />-->
<!--        <el-table-column prop="remark" show-overflow-tooltip label="备注" />-->
<!--      </el-table>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Inventory',
  dicts: ['counting_status'],
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    message:{
      type:String,
      default: function() {
        return ''
      }
    },
    templateList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    pstat(str) {
      const obj = this.dict.type.counting_status.find(items => items.value === str)
      return obj ? obj.label : '未知'
    },
  }
}
</script>

<style scoped lang="scss">
.newtable tr{
  border: 1px solid #999;
}
.newtable tr td{
   font-size: 4px;
  border: 1px solid #999;
}
.newtable th{
  font-size: 4px;
  font-weight: normal;
  padding: 0px 2px;
  border: 1px solid #999;
}
.print {
  height: 50%;
  margin: 0;
  padding: 0;
  .title {
    margin: 20px  0;
    font-size: 28px;
    font-weight: 600;
    text-align: center;
  }
}
.detailsTable {
  margin: 20px 20px 0 20px;
  font-size: 14px;
  .elTable {
    border: 1px solid #000000;
  }
  .total {
    //float: right;
    margin-right: 50px;
    //font-weight: 400;
  }
}
.table {
  width: 95%;
  margin: 0 20px 0 20px;
  font-size: 14px;
  .elTable {
    border: 1px solid #000000;
  }
  .total {
    //float: right;
    margin-right: 50px;
    //font-weight: 400;
  }
}
</style>
