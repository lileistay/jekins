<template>
  <!--  微商城订单开单-->
  <div class="biling">
    <div class="formleft">
      <div class="formleftone one">
        <div class="title">微商城订单开单
          <span>[</span>
          &nbsp;
          <span><i>客户：李林 电话：180****8954 卡号：KH2022042600014 美学顾问：王亚祯</i></span>
          &nbsp;
          <span>]</span>
        </div>
        <div class="customer">客户账户信息:
          &nbsp;
          <span style="color: #b43636">欠款金额：0.00；</span>
          <span class="blue">预约金：0.00；住院押金：0.00；</span>
        </div>
        <div class="customertwo">
          <span class="blue">储值总额：0.00；[ 储值金额：0.00；储值赠送：0.00 ]</span>
        </div>
      </div>
      <div class="formleftone two">
        <div class="title">订单列表</div>
        <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
          <el-form-item label="订单号:">
            <el-input v-model="formInline.user" />
          </el-form-item>
          <el-form-item label="核销状态">
            <el-select v-model="formInline.region" filterable placeholder="请选择">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <!--todo 字段没有绑定-->
        <el-table :data="tableData" style="width: 100%" size="mini" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="订单号" />
          <el-table-column prop="address" label="客户姓名" />
          <el-table-column prop="address" label="电话" />
          <el-table-column prop="address" label="项目名称" />
          <el-table-column prop="address" label="项目价格" />
          <el-table-column prop="address" label="购买价格" />
          <el-table-column prop="address" label="购买数量" />
          <el-table-column prop="address" label="购买时间" />
          <el-table-column prop="address" label="订单类别" />
          <el-table-column prop="address" label="预收价格" />
          <el-table-column prop="address" label="营销类型" />
          <el-table-column prop="address" label="实付金额" />
          <el-table-column prop="address" label="核销时间" />
        </el-table>
      </div>
    </div>
    <div class="formright">
      <div class="title">收费单</div>
      <el-card>
        <el-form :inline="true" :model="formInline" size="mini" class="demo-form-inline">
          <el-form-item label="审批人">
            <el-input v-model="formInline.user" placeholder="审批人" />
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="formInline.region" filterable placeholder="活动区域">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="formInline.region" filterable placeholder="活动区域">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动形式">
            <el-input type="textarea" style="width: 400px;" v-model="formInline.desc" />
          </el-form-item>
          <el-form-item>
            <el-button type="danger" plain>关闭</el-button>
            <el-button type="primary" plain>保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-row>
        <el-col :span="12">
          <el-card class="box-card one">
            <div slot="header" class="clearfix">
              <span>卡片名称</span>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
              {{ '列表内容 ' + o }}
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>卡片名称</span>
            </div>
            <div v-for="o in 4" :key="o" class="text item">
              {{ '列表内容 ' + o }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        user: '',
        region: '',
        desc: ''
      },
      tableData: []
    }
  }
}
</script>

<style lang="scss">
.biling {
  width: 98%;
  height: 97%;
  margin: 10px;
  padding-right: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #c6c6c6;

  span {
    font-size: 12px;
    font-weight: 600;
  }

  .title {
    position: absolute;
    top: -11px;
    left: 25px;
    padding: 0 10px;
    background-color: #f2f2f2;
    color: #666666;
  }

  .formleft {
    width: 66%;
    height: 96%;
    position: relative;
    padding: 20px;
    box-sizing: border-box;

    .one {
      height: 100px;
    }

    .two {
      height: 87%;
    }

    .blue {
      color: #0066cc;
      font-weight: 400;
    }

    .customer {
      font-size: 12px;
      margin-top: 30px;
      margin-left: 30px;
    }

    .customertwo {
      margin-left: 114px;
    }

    .formleftone {
      width: 100%;
      margin-bottom: 20px;
      border: 1px solid #c6c6c6;
      border-radius: 10px;
      position: relative;
      box-sizing: border-box;
    }
  }

  .formright {
    width: 33%;
    height: 95%;
    min-height: 260px;
    border-radius: 10px;
    margin-top: 25px;
    position: relative;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #c6c6c6;
  }
}

//elemeng样式
.demo-form-inline {
  margin-top: 20px;
  //padding-left: 20px;
}
.box-card {
  width: 282px;
  margin-left: 3px;
  margin-top: 5px;
  .clearfix{
    height: 20px;
    font-size: 14px;
  }
}
</style>
