<template>
  <!--  区域管理-->
  <div>
    <div class="container">
      <slideSearch :options="options">
        <div slot="btnBar">
          <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            plain
            @click.stop="getuserList(true)"
          >查询
          </el-button>
          <el-button
            v-has-permi="['payment:toBePaidList:export']"
            size="mini"
            type="success"
            :loading="submitLoadings"
            @click.stop="exportExcel"
          >导出</el-button>
        </div>
        <slot>
          <sg-table
            ref="table"
     
            :sg-ref="'multipleTable'"
            size="mini"
            border
            index="序号"
            :table-data="tableData"
            :columns="columns"
            :pagination="pagination"
            stripe
            highlight-current-row
            @size-change="sizeChange"
            @current-change="currentChange"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
          >
            <div slot="searchBar" class="searchBar">
              <span style="font-size: 14px"><i class="el-icon-s-fold" /> 用户列表</span>
            </div>
            <template #custom="data">
              <div v-if="data.props === 'sex'">
                <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.sex" />
              </div>
              <div v-else-if="data.props === 'headImg'">
                <img class="wx_img" :src="data.custom.headImg" />
              </div>
            </template>
          </sg-table>
        </slot>
      </slideSearch>
    </div>
  </div>
</template>

<script>

import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import { todayTime } from '@/utils/time'
export default {
  name: 'Region',
  components: {
    SgTable,
    slideSearch
  },
  data() {
    return {
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true,
        currentPage: 1
      },
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 多选数据
      selectionData: [],
      //  序列清单
      columns: [
        {
          lab: '微信头像',
          val: 'headImg',
          custom: 'headImg',
          width: 120
        },
        {
          lab: '微信昵称',
          val: 'wxName'
          // custom: 'billingStatus'
        },
        {
          lab: '用户手机号',
          val: 'phone'
          // custom: 'customerName'
        },
        {
          lab: '注册时间',
          val: 'createTime'
        },
        {
          lab: '项目',
          val: 'openId'
        },
        {
          lab: '应付金额',
          val: 'moth'
        },
        {
          lab: '实付金额',
          val: 'smoth'
        },
        {
          lab: '支付状态',
          val: 'smoth'
        },
        {
          lab: '付款地址',
          val: 'smoth'
        }
        // {
        //   lab: '开单备注',
        //   val: 'billingRemarks',
        //   width: 200,
        //   showOverflowTooltip: true
        // },
      ],
      // 查询出列表
      options: {
        userId: {
          type: 'input',
          label: '编号:'
        },
        wxName: {
          type: 'input',
          label: '微信昵称:'
        },
        phone: {
          type: 'input',
          label: '电话号码:'
        },
        sex: {
          type: 'select',
          label: '付款地址:',
          clearable: true,
          options: []
        },
        sequtyx: {
          type: 'select',
          label: '区域:',
          clearable: true,
          options: []
        },
        // addr: {
        //   type: 'input',
        //   label: '地址:'
        // },
        createTime: {
          type: 'Tdatetime',
          label: '支付时间:',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
