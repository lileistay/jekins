<template>
  <!--  物资转移单-->
  <div >
    <div style="width: 100%;height: 100%;" v-for="(item,index) in codeArr">
      <div class="title" style="text-align: center;font-weight: bolder;margin-top: 20px">{{message}}物资转移单</div>
      <div style="font-size: 14px">
        <el-row>
          <el-col :span="8"><div>
            <div style="margin-left: 20px">出库单号：{{ print.removeNo }}</div>
            <div style="margin-left: 20px">源库房：{{ print.oldwhouseName }}</div>
          </div></el-col>
          <el-col :span="8"><div>
            <div>执行人：{{ print.executeUserName }}</div>
            <div>目标库房：{{ print.newwhouseName }}</div>
          </div></el-col>
          <el-col :span="8"><div>
            <div>执行日期：{{ print.executeDate }}</div>
          </div></el-col>
        </el-row>
      </div>
      <div class="detailsTable">
        <table  style="border-collapse: collapse;width: 100%;width: 97%;margin-left: 20px" border="1" >
          <thead style="font-family: normal;font-size: 12px">
          <th>源批次号</th>
          <th>新批次号</th>
          <th>物资名称</th>
          <th>单位</th>
          <th>规格</th>
          <th>物资类型</th>
          <th>进价</th>
          <th>移库数量</th>
          <th>总金额</th>
          </thead>
          <tbody>
          <tr style="padding: 4px;line-height: 1;font-size: 12px;" v-for="newitem in item">
            <td class="Pad">{{newitem.oldInBatchNumber}}</td>
            <td class="Pad">{{newitem.newInBatchNumber}}</td>
            <td class="Pad" style="width: 210px;padding: 4px;">{{newitem.materialName}}</td>
            <td class="Padding Pad">{{newitem.unitName}}</td>
            <td class="Padding Pad">{{newitem.materialSpec}}</td>
            <td class="Pad"  style="min-width: 50px;padding-left: 3px">{{newitem.materialTypeName}}</td>
            <td class="Pad" style="min-width: 50px;padding-left: 3px">{{newitem.purchasePrice}}</td>
            <td class="Pad" style="min-width: 40px;padding-left: 3px">{{newitem.removeNumber}}</td>
            <td class="Pad" style="min-width: 50px;padding-left: 3px">{{newitem.removeAmount}}</td>

            <!--            <td style="min-width:50px;padding-left: 3px">{{newitem.materialTypeName}}</td>-->
          </tr>
          </tbody>
        </table>
        <!--      <el-table-->
        <!--        :data="templateList"-->
        <!--        size="mini"-->
        <!--        border-->
        <!--        class="elTable"-->
        <!--        style="width: 100%"-->
        <!--        :header-cell-style="{'color':'#000', 'text-align':'left', 'font-size':'14px','padding':'0', 'font-weight': 'bold','border-left':'1px solid #000','border-top':'1px solid #000'}"-->
        <!--        :cell-style="{'text-align':'left', 'font-size':'14px','padding':'0','border-left':'1px solid #000','border-top':'1px solid #000'}"-->
        <!--      >-->
        <!--        <el-table-column prop="oldInBatchNumber" label="源批次号" width="120" />-->
        <!--        <el-table-column prop="newInBatchNumber" label="新批次号" width="120" />-->
        <!--        <el-table-column prop="materialName" label="物资名称" width="120" />-->
        <!--        <el-table-column prop="materialSpec" label="规格" width="115" />-->
        <!--        <el-table-column prop="unitName" label="单位" width="85" />-->
        <!--        <el-table-column prop="removeNumber" label="移库数量" width="100" />-->
        <!--        <el-table-column prop="purchasePrice" label="进价" width="50" />-->
        <!--        <el-table-column prop="removeAmount" label="总金额" width="80" />-->
        <!--      </el-table>-->
      </div>
      <div style="display: flex;justify-content: space-between">
        <p style="margin-left: 50px">库管员:</p>
        <p>移库数量：{{newTotal(index)}}</p>
        <p style="margin-right: 50px">移库金额：{{Total(index)}}</p>

      </div>
    </div>

  </div>
</template>

<script>
import { math } from '@/utils/math'
export default {
  name: 'ReceiptDoc',
  watch:{
    print:{
      handler(newV){
        this.codeArr=[];
        this.codedetail=Math.ceil(this.templateList.length/5);
        for(let i=0;i<this.codedetail;i++){
          this.codeArr.push(this.templateList.slice(i*5,i*5+5))
        }
      },
      deep:true,
    }
  },
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
  methods:{
    //移库数量
    newTotal(item){
      let total=0;
      this.codeArr[item].forEach(value=>{
        total=math.add(total, value.removeNumber)
      })
      return total;
    },
    //移库合计金额
    Total(item){
      let total=0;
      this.codeArr[item].forEach(value=>{
        total=math.add(total, value.removeAmount)
      })
      return total;
    }
  },
  data() {
    return {
      codedetail:[],
      codeArr:[],
    }
  }
}
</script>

<style scoped lang="scss">
@page {
  size: auto;
  margin:0mm;
}
.Pad{
  padding:2px;
}
.print {
  width: 210mm;
  margin: 0;
  padding: 0;
  font-size: 16px;
  .title {
    margin: 5px  0;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
  }
}
.detailsTable {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 16px;
  .elTable {
    border: 1px solid #000000;
  }
}
</style>
