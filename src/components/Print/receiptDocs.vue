<template>
  <div >
    <div style="width: 100%;height: 100%;" v-for="(item,index) in codeArr">
      <div class="title" style="text-align: center;font-weight: bolder;font-size: 18px;margin-top: 20px">{{message}}</div>
      <div style="margin: 0;font-size: 14px">
        <el-row>
          <el-col :span="8"><div>
            <div style="margin-left: 20px">入库单号：{{ print.inDocumentNo }}</div>
            <div style="margin-left: 20px" v-if="print.documentType!=='5'&&print.documentType!=='10'">供应商：{{ print.companyName }}</div>
            <div style="margin-left: 20px" v-else>
              科室:{{ departmentName }}
            </div>
          </div></el-col>
          <el-col :span="8"><div>
            <div>执行人：{{ print.executeUserName }}</div>
            <div>库房：{{ print.whouseName }}

            </div>
          </div></el-col>
          <el-col :span="8"><div>
            <div>执行日期：{{ print.executeDate }}</div>
            <template v-for="item in dict.type.document_type">

              <span :key="item.value" v-if="item.value === print.documentType">入库单类型：{{ item.label }}</span>
            </template>
          </div></el-col>
        </el-row>
      </div>
      <div class="detailsTable">
        <table  style="border-collapse: collapse;width: 98%;margin-left: 15px" border="1" >
          <thead style="font-family: normal;font-size: 12px">
          <th>入库批次号</th>
          <th>物资名称</th>
          <th>单位</th>
          <th>规格</th>
          <th>进价</th>
          <th>数量</th>
          <th>物资分类</th>
          <th>金额</th>
          <th>产地</th>
          <th>生产批次</th>
          </thead>
          <tbody>
          <tr style="padding: 4px;line-height: 1;font-size: 12px;" v-for="newitem in item">
            <td>{{newitem.inBatchNumber}}</td>
            <td style="width: 150px;padding: 4px;">{{newitem.materialName}}</td>
            <td class="Padding">{{newitem.unitName}}</td>
            <td class="Padding ">{{newitem.materialSpec}}</td>
            <td class="Padding Right">{{newitem.purchasePrice}}</td>
            <td class="Padding">{{newitem.quantity}}</td>
            <td style="min-width: 70px;padding-left: 3px">{{newitem.materialTypeName}}</td>
            <td class="Padding Right">{{newitem.amountOfMoney}}</td>
            <td style="min-width: 70px;padding-left: 3px">{{newitem.place}}</td>
            <td style="min-width: 100px;padding-left: 3px">{{newitem.productionBatch}}</td>
          </tr>
          </tbody>
        </table>
        <!--      <el-table-->
        <!--        :data="templateList"-->
        <!--        size="mini"-->
        <!--        border-->
        <!--        class="elTable"-->
        <!--        :header-cell-style="{'color':'#000', 'text-align':'left', 'font-size':'14px','padding':'0', 'font-weight': 'bold','border-left':'1px solid #000','border-top':'1px solid #000'}"-->
        <!--        :cell-style="{'text-align':'left', 'font-size':'14px','padding':'0','border-left':'1px solid #000','border-top':'1px solid #000'}"-->
        <!--      >-->
        <!--        <el-table-column prop="inBatchNumber" label="入库批次号" width="100" />-->
        <!--        <el-table-column prop="materialName" label="物资名称" width="100" />-->
        <!--        <el-table-column prop="unitName" label="单位" width="50" />-->
        <!--        <el-table-column prop="materialSpec" label="规格" width="80" />-->
        <!--        <el-table-column prop="purchasePrice" label="进价" width="60" />-->
        <!--        <el-table-column prop="quantity" label="数量" width="60" />-->
        <!--        <el-table-column prop="materialTypeName" label="物品分类" width="60" />-->
        <!--        <el-table-column prop="amountOfMoney" label="金额" width="70" />-->
        <!--        <el-table-column prop="place" width="100" label="产地" />-->
        <!--        <el-table-column prop="productionBatch" width="100" label="生产批次" />-->
        <!--        <el-table-column prop="startTime" label="有效起始时间" width="110">-->
        <!--          <template #default="scope">-->
        <!--            <p>{{ scope.row.startTime }}</p>-->
        <!--            <template v-if="scope.row.endTime">-->
        <!--              <p>-{{ scope.row.endTime }}</p>-->
        <!--            </template>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--      </el-table>-->
        <!--      <el-table-->
        <!--        :data="refundList"-->
        <!--        border-->
        <!--        size="mini"-->
        <!--        class="elTable"-->
        <!--        :show-header="false"-->
        <!--        :header-cell-style="{'text-align':'center','font-size':'16px','padding':'0','border-left':'1px solid #000','border-top':'1px solid #000'}"-->
        <!--        :cell-style="{'text-align':'left','font-size':'16px','padding':'0','border-left':'1px solid #000','border-right':'1px solid #000','border-bottom':'1px solid #000'}"-->
        <!--      >-->
        <!--        <el-table-column label="合计金额" prop="name1" width="540" />-->
        <!--        <el-table-column label="合计金额" prop="totalArrears" width="730" />-->
        <!--      </el-table>-->
      </div>
      <div style="font-size: 14px">
        <el-row>
          <el-col :span="8">
            <div style="margin-left: 20px">{{message.split(' ')[2]}}数量：{{newTotal(index)}}</div>
          </el-col>
          <el-col :span="8">
            <div style="margin-left: 20px">{{message.split(' ')[2]}}金额：{{Total(index)}}</div>
          </el-col>
        </el-row>
      </div>
      <div style="font-size: 14px">
        <el-row>
          <el-col :span="8">
            <div style="margin-left: 20px">财务：</div>
          </el-col>
          <el-col :span="8">
            <div>采购/经办人：</div>
          </el-col>
          <el-col :span="8">
            <div>库管员：</div>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>
import { math } from '@/utils/math'
export default {
  name: 'ReceiptDoc',
  dicts: ['document_type'],
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    templateList: {
      type: Array,
      default: function() {
        return []
      }
    },
    message:{
      type:String,
      default: function() {
        return '1221313'
      }
    }
  },
  data() {
    return {
      refundList: [],
      codedetail:[],
      codeArr:[],
      departmentName:""
    }
  },
  watch: {
    print: {
      handler(newValue, oldValue) {
        this.codeArr=[];
        this.codedetail=Math.ceil(this.templateList.length/5);
        for(let i=0;i<this.codedetail;i++){
          this.codeArr.push(this.templateList.slice(i*5,i*5+5))
        }
        if(this.codeArr.length>0){
          this.departmentName=this.codeArr[0][0].departmentName
        }

        this.getChange(newValue)
      },
      deep: true
    }
  },
  methods: {
    Total(index){
      let total=0;
      this.codeArr[index].forEach(value=>{
        total=math.add(total,value.amountOfMoney)
      })
      return total;

    },
    newTotal(index){
      let total=0;
      this.codeArr[index].forEach(value=>{
        total=math.add(total,value.quantity)
      })
      return total;

    },
    getChange(data) {
      this.refundList = []
      const temp = {
        name1: '合计金额',
        totalArrears: data.totalArrears
      }
      this.refundList.push(temp)
    }
  }
}
</script>

<style scoped lang="scss">
@page {
  size: auto;
  margin:0mm;
}
.Padding{
  min-width: 50px;
  padding-left: 3px;
}
.Right{
  text-align: right;
}
.print {
  // A4 210的宽度
  width: 243mm;
  //height: 297mm;
  margin: 0;
  padding: 0;
  font-size: 16px;
  .title {
    margin: 10px  0;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
  }
}
.detailsTable {
  width: 100%;
  margin: 0;
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
.header{
  width: 85%;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
