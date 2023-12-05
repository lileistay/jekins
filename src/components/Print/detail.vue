<template>
  <div >
    <!-- <div class="title">兰州时光医疗集团</div> -->
    <div v-for="(item,index) in codeArr" style="width: 100%;height: 100%">
      <div class="header" style="display: flex;margin-top: 10px">
        <el-row style="width: 100%">
          <el-col :span="8">
            <div class="text" style="margin-left: 25px">领料人：{{ print.drugRecipient }}</div>
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
            <div style="margin-left: 25px">姓名:{{ print.customerName }}</div>
          </el-col>
          <el-col :span="8">
            <div>收费单号:{{ print.orderNumber }}</div>
          </el-col>
          <el-col :span="8">
            <div >客户卡号:{{ print.customCardNumber }}</div>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 5px">
        <el-row style="width: 100%">
          <el-col :span="8">
            <div style="margin-left: 25px">收费单类型:
              <span v-for="item in dict.type.billing_type">
                          <span v-if="item.value==print.billType" :key="item.value">{{ item.label }}</span>
                        </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>打印时间: {{ getTime }}</div>
          </el-col>
          <el-col :span="8">
            <div >科室: {{ print.departmentName }}</div>
          </el-col>
        </el-row>
      </div>
      <table  style="border-collapse: collapse;width: 100%" border="1">
        <thead style="font-family: normal;font-size: 12px">
        <th>项目名称</th>
        <th>物资名称</th>
        <th>出库单号</th>
        <th>出库批次号</th>
        <th>单位</th>
        <th>规格</th>
        <th>库房</th>
        <th>领药数量</th>
        </thead>
        <tbody>
              <tr style="padding: 4px;line-height: 1;font-size: 12px;" v-for="newitem in item">
                <td style="width: 210px">{{newitem.projectName}}</td>
                <td style="width: 230px;padding: 4px;">{{newitem.materialName}}</td>
                                <td style="min-width: 50px;padding-left: 3px" >{{newitem.outDocumentNo}}</td>
                                <td style="min-width: 50px;padding-left: 3px" >{{newitem.outBatchNumber}}</td>
                <td style="width: 50px">{{newitem.unitName}}</td>
                <td class="Padding">{{newitem.materialSpec}}</td>

                <td style="min-width: 50px;padding-left: 3px" class="Right">{{newitem.whouseName}}</td>
                <td style="width: 90px">{{newitem.outNumber}}</td>
              </tr>
        </tbody>
      </table>
      <div style="margin-top: 5px">
        <el-row style="width: 100%">
          <el-col :span="8">
            <div style="margin-left: 25px">领料人签名：
            </div>
          </el-col>
<!--          <el-col :span="6">-->
<!--            <div style="margin-left: 25px">{{getType(item)}}数量：-->
<!--            </div>-->
<!--          </el-col>-->
          <el-col :span="8">
            <div>医生签名：</div>
          </el-col>
          <el-col :span="8">
            <div >库管员：</div>
          </el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  name: 'TreatmentPrint',
  dicts: ['billing_type'],
  watch:{
    details:{
      handler(newV){
        this.codeArr = [];
        this.codedetail = Math.ceil(this.details.length / 5);
        for (let i = 0; i < this.codedetail; i++) {
          this.codeArr.push(this.details.slice(i * 5, i * 5 + 5))
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
    details: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      getTime: '',
      codedetail:"",
      codeArr:[],
    }
  },
  created() {
    this.getCurrentTime()
  },
  methods: {
    //获取药品状态
    getType(val){
      console.log(val,'dsadasdasd')
    },
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
