<template>
  <div class="print">
    <!-- <div class="title">兰州时光医疗集团</div> -->
    <div class="header">
      <div class="text">顾客：{{ print.customName }}</div>
      <div class="text">电话：{{ print.customPhone }}</div>
      <div class="text">科室：{{ print.departmentName }}</div>
      <div class="text">时间：{{ getTime }}</div>
    </div>
    <div class="line">
      <span class="text">====================</span>
    </div>
    <div class="table">
      <el-table
        :data="details"
        style="width: 100%"
        size="mini"
        :header-cell-style="{'font-size':'10px'}"
        :cell-style="{'font-size':'10px'}"
      >
        <el-table-column prop="projectName" label="#计划项#" />
        <el-table-column prop="estimateScribingNum" label="#小计#" width="45" align="right" />
      </el-table>
    </div>
    <div class="line">
      <span class="text">---------------------------------</span>
    </div>
    <div class="footer">
      <div class="text">治疗师：{{ print.doctorName }}</div>
      <div class="text">小票是重要凭据，请您妥善保管！</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TreatmentPrint',
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

::v-deep .el-table {
  table-layout: auto!important;
}
::v-deep .el-table__header {
  width: 100%!important;
}
::v-deep .el-table__body {
  width: 100%!important;
}
.print {
  width: 100%;
  margin-top: 30px;
  padding: 0;
  .title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }
  .header {
    margin: 10px 5px 0 5px;

    .text {
      font-size: 12px;
    }
  }
  .line {
    margin: 0 5px;

    .text {
      font-size: 12px;
    }
  }
  .table {
    width: 100%;
    //margin: 10px 10px 0 10px;
  }
  .footer {
    margin: 10px 5px 0 5px;

    .text {
      font-size: 12px;
    }
  }
}
</style>
