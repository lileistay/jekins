<template>
  <div class="box">
    <el-row
      type="flex"
      justify="space-between"
    >
      <el-col
        style="margin-right:10px"
        :span="15"
      >
        <el-card class="one card">
          <div class="title">{{ title.label }}</div>
          <!-- 表单 -->
          <slot name="searchBar" />

        </el-card>
        <!-- 第二行-->
        <div v-if="xianshi">
          <div class="tow">
            <el-card class="one card">
              <div class="title">临客跟进信息</div>
              <slot name="linke"></slot>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :span="9">
        <el-card class="one card ">
          <div class="title">{{ title.other }}</div>
          <slot name="main" />
        </el-card>
        <div v-if="display" class="footrleft">
          <el-card
            class="one card"
            :style="footrleft"
          >
            <div class="title">{{ title.other }}</div>
            <slot name="mainfooter" />
          </el-card>
        </div>
      </el-col>
    </el-row>
    <!-- 底部 -->
    <slot name="bottom" />
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    title: {
      type: Object,
      default: () => {
        return {
          label: '客户信息',
          other: '其他信息'
        }
      }
    },
    xianshi: {
      type: Boolean,
      default: false
    },
    footrleft: {
      type: Object
    },
    display: {
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        name: 'ZS'
      },
      tableData: []
    }
  }
}
</script>

<style lang="scss">
.box {
  padding: 20px;
  // margin: 20px;
  border: 1px solid #f8f8f8;
  background-color: #f8f8f8;

  .card {
    border: 1px solid #c6c6c6;
    border-radius: 10px;
  }

  .title {
    font-size: 14px;
    position: absolute;
    margin-top: -30px;
    font-weight: 700;
    background-color: #f8f8f8;
    z-index: 2;
  }

  .footrleft {
    margin-top: 12px;
  }

  .one {
    background-color: #f8f8f8;

    .el-form-item__label {
      padding: 0 10px 0 0;
    }
  }

  .tow {
    margin-top: 15px;
    background-color: #f8f8f8;

    .footer {
      position: absolute;
      margin-top: -30px;
      font-weight: 700;
      background-color: #f8f8f8;
      z-index: 2;
    }

    .box-bottom {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .el-table__header tr,
    .el-table__header th {
      padding: 0;
      height: 20px !important;
    }

    .el-table th.el-table__cell {
      line-height: 10px;
    }

    .el-form-item__label {
      padding: 0 10px 0 0;
    }
  }
}
</style>
