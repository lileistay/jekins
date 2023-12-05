<template>
  <!--治疗登记-->
  <div class="container">
    <sg-table
      :pagination="pagination"
      size="mini"
      selection
      border
      index="序号"
      highlight-current-row
      :table-data="tableData"
      :columns="columns"
    >
      <div slot="searchBar" class="searchBar">
        <el-form size="mini" label-width="120px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="电话：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户卡号：">
                <el-input />
              </el-form-item>
              <el-form-item label="客户姓名：">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="科室归属服务助理：" label-width="140px">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="科室归属医生：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="分诊时间：">
                <el-date-picker
                  style="width: 100%"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="治疗状态：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="状态：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="回访类型：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="医生：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否有退款：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="是否安排：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="治疗时间：">
                <el-date-picker
                  style="width: 100%"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="是否有填写分值：" label-width="140px">
                <el-select filterable/>
              </el-form-item>
              <el-form-item label="护士：">
                <el-select filterable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item label="服务助理：">
                <el-select filterable/>
              </el-form-item>
              <el-form-item />
              <el-form-item>
                <el-button size="mini" type="primary" icon="el-icon-search">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="header">
        <div>
          <span>治疗登记</span>
          <span><i style="background-color:#ffffff" />已安排</span>
          <span><i style="background-color:#c6f9c3" />已执行</span>
          <span><i style="background-color:#ffff00" />已取消</span>
          <span>人数：</span>
        </div>
        <div>
          <el-button size="mini" type="primary" icon="el-icon-plus">客户需求</el-button>
          <!-- <el-button size="mini" type="primary" icon="el-icon-position">发送短信</el-button> -->
          <el-button size="mini" type="primary" icon="el-icon-plus">手工上报</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">护理分值</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">医助分值</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">年卡</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">套餐</el-button>
          <el-button size="mini" type="danger" icon="el-icon-close">取消</el-button>
          <el-button size="mini" type="primary" icon="el-icon-s-platform">发起治疗</el-button>
          <el-button size="mini" type="success" icon="el-icon-s-platform">扫码签名</el-button>
        </div>
      </div>
    </sg-table>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
export default {
  components: {
    SgTable
  },
  data() {
    return {
      tableData: [],
      pagination: {
        show: true
      },
      columns: [
        {
          lab: '客户',
          val: ''
        },
        {
          lab: '电话',
          val: '',
          width: 120
        },
        {
          lab: '客户卡号',
          val: '',
          width: 150
        },
        {
          lab: '项目名称',
          val: '',
          width: 120
        },
        {
          lab: '客户姓名',
          val: ''
        },
        {
          lab: '电话',
          val: ''
        },
        {
          lab: '客户卡号',
          val: ''
        },
        {
          lab: '购买数量',
          val: '',
          width: 150
        },
        {
          lab: '产品数量',
          val: '',
          width: 150
        },
        {
          lab: '总次数',
          val: '',
          width: 150
        },
        {
          lab: '已治疗次数',
          val: '',
          width: 150
        },
        {
          lab: '剩余次数',
          val: '',
          width: 150
        },
        {
          lab: '门诊病历',
          val: '',
          width: 150
        },
        {
          lab: '中医病历',
          val: '',
          width: 120
        },
        {
          lab: '医生',
          val: '',
          width: 150
        },
        {
          lab: '科室服务助理',
          val: '',
          width: 150
        },
        {
          lab: '主服务助理',
          val: '',
          width: 150
        },
        {
          lab: '美学顾问',
          val: '',
          width: 150
        },
        {
          lab: '科室归属医生/服务助理',
          val: '',
          width: 150
        },
        {
          lab: '产品类型',
          val: '',
          width: 150
        },
        {
          lab: '年卡/套餐',
          val: '',
          width: 120
        },
        {
          lab: '收费单编号',
          val: '',
          width: 165
        },
        {
          lab: '结账日期',
          val: '',
          width: 120
        },
        {
          lab: '是否退款',
          val: '',
          width: 120
        },
        {
          lab: '金额',
          val: '',
          width: 120
        },
        {
          lab: '退款金额',
          val: '',
          width: 120
        },
        {
          lab: '退款次数',
          val: '',
          width: 120
        },
        {
          lab: '客户类型',
          val: '',
          width: 120
        },
        {
          lab: '是否安排',
          val: '',
          width: 120
        },
        {
          lab: '单据明细备注',
          val: '',
          width: 120
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    font-size: 14px;
    margin-right: 15px;
  }
  & i {
    display: inline-block;
    margin-right: 5px;
    width: 10px;
    height: 10px;

  }
}
::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
  height: 100%;
}
</style>
