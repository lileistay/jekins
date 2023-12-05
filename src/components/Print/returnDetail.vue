<template>
  <div class="print">
    <!-- <div class="title">兰州时光医疗集团</div> -->
    <div style="margin-top: 5px">
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="text" style="margin-left: 25px">退料人：{{ print.drugReturner }}</div>
        </el-col>
        <el-col :span="8">
          <div class="text">执行人：</div>
        </el-col>
        <el-col :span="8">
          <div class="text">执行时间：{{ print.createTime }}</div>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 5px">
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="text" style="margin-left: 25px">姓名:{{ print.customerName }}</div>
        </el-col>
        <el-col :span="8">
          <div class="text">收费单号:{{ print.orderNumber }}</div>
        </el-col>
        <el-col :span="8">
          <div class="text">客户卡号:{{ print.customCardNumber }}</div>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 5px">
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="text" style="margin-left: 25px">收费单类型：
            <template v-for="item in dict.type.billing_type">
              <span v-if="item.value===print.billType" :key="item.value">{{ item.label }}</span>
            </template>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="text">打印时间: {{ getTime }}</div>
        </el-col>
        <el-col :span="8">
          <div class="text">科室: {{ print.departmentName }}</div>
        </el-col>
      </el-row>
    </div>
    <table  style="border-collapse: collapse;width: 100%" border="1">
      <thead style="font-family: normal;font-size: 12px">
      <th>项目名称</th>
      <th>物资名称</th>
      <th>入库单号</th>
      <th>入库批次号</th>
      <th>单位</th>
      <th>规格</th>
      <th>库房</th>
      <th>退药数量</th>
      </thead>
      <tbody>
      <tr style="padding: 4px;line-height: 1;font-size: 12px;" v-for="newitem in details">
        <td style="width: 210px">{{newitem.projectName}}</td>
        <td style="width: 230px;padding: 4px;">{{newitem.materialName}}</td>
        <td style="min-width: 50px;padding-left: 3px" >{{newitem.inDocumentNo}}</td>
        <td style="min-width: 50px;padding-left: 3px" >{{newitem.inBatchNumber}}</td>
        <td style="width: 50px">{{newitem.unitName}}</td>
        <td class="Padding">{{newitem.materialSpec}}</td>

        <td style="min-width: 50px;padding-left: 3px" class="Right">{{newitem.whouseName}}</td>
        <td style="width: 110px">{{newitem.returnedQuantity}}</td>
      </tr>
      </tbody>
    </table>
<!--    <div class="box">-->
<!--      <div class="Name">-->
<!--        <div style="margin-right: 70px">-->
<!--          <div style="margin-bottom: 10px">姓名:{{ print.customerName }}</div>-->
<!--          <div>收费单号:{{ print.orderNumber }}</div>-->
<!--        </div>-->
<!--        <div style="margin-right: 70px">-->
<!--          <div style="margin-bottom: 10px">客户卡号:{{ print.customCardNumber }}</div>-->
<!--          <div>-->
<!--            收费单类型：-->
<!--            <template v-for="item in dict.type.billing_type">-->
<!--              <span v-if="item.value===print.billType" :key="item.value">{{ item.label }}</span>-->
<!--            </template>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div style="margin-right: 70px">-->
<!--          <div style="margin-bottom: 10px">打印时间: {{ getTime }}</div>-->
<!--          <div> 科室: {{ print.departmentName }}</div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="table">-->
<!--        <el-table-->
<!--          :data="details"-->
<!--          style="width: 100%"-->
<!--          size="mini"-->
<!--          :border="true"-->
<!--          :header-cell-style="{'font-size':'10px','border-color':'#000','border-right':'1px solid #000'}"-->
<!--          :cell-style="{'font-size':'10px','border-top':'1px solid #000','border-color':'#000'}"-->
<!--          height="97"-->
<!--        >-->
<!--          <el-table-column prop="projectName" label="项目名称" />-->
<!--          <el-table-column prop="materialName" label="物资名称" />-->
<!--          <el-table-column prop="materialSpec" label="规格" />-->
<!--          <el-table-column prop="unitName" label="物资单位" />-->
<!--          <el-table-column prop="inDocumentNo" label="入库单号" />-->
<!--          <el-table-column prop="inBatchNumber" label="入库批次号" />-->
<!--          <el-table-column prop="whouseName" label="库房" />-->
<!--          <el-table-column prop="returnedQuantity" label="退药数量" />-->
<!--        </el-table>-->
<!--      </div>-->
<!--    </div>-->
    <div style="margin-top: 5px">
      <el-row style="width: 100%">
        <el-col :span="8">
          <div class="text" style="margin-left: 25px">退料人签名：
          </div>
        </el-col>
        <el-col :span="8">
          <div class="text">医生签名：</div>
        </el-col>
        <el-col :span="8">
          <div class="text">库管员：</div>
        </el-col>
      </el-row>
    </div>
<!--    <div class="footer">-->
<!--      <div class="text" style="margin-left: 15px">退料人签名：</div>-->
<!--      <div class="text">医生签名：</div>-->
<!--      <div class="text">库管员：</div>-->
<!--    </div>-->
  </div>
</template>

<script>

export default {
  name: 'ReturnDetails',
  dicts: ['billing_type'],
  props: {
    print: {
      type: Object,
      default: function() {
        return {}
      }
    },
    details: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      getTime: ''
    }
  },
  created() {
    this.getCurrentTime()
  },
  methods: {
    getCurrentTime() {
      // 获取当前时间并打印
      const yy = new Date().getFullYear()
      const mm = new Date().getMonth() < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
      const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      const hh = new Date().getHours()
      const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.getTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    }
  }
}
</script>

<style scoped lang="scss">

@page {
  size: auto;
  margin:0mm;
}
*{
  font-size: 14px;
}
.Padding{
  width: 70px;
}
</style>
