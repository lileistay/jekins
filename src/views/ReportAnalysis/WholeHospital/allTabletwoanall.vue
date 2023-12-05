<template>
  <!--点击四个字的子组件表身 的表头点击后子组件-->
  <cellTable
    ref="cellTable"
    :prop-data="propData"
    :list-data="tableDatalist"
    :heights="0"
    :summary="false"
    :cell-merge="cellMerge"
    :cell-name="cellnaem"
    :cell-back="cellBack"
  >
  </cellTable>
</template>

<script>
import { math } from '@/utils/math'
import cellTable from '@/components/Table/cellTable'
export default {
  name: 'AllTabletwoanall',
  components: {
    cellTable
  },
  data() {
    return {
      cellMerge: [0],
      cellnaem: 'name',
      cellBack: 'id,合计,#666,#eee',
      propData: [
        {
          prop: 'name',
          column: 'name',
          label: '姓名'
        },
        {
          prop: 'id',
          label: '新老客'
        },
        {
          prop: 'id',
          label: '新老客'
        },
        {
          prop: 'id',
          label: '新老客'
        },
        {
          prop: 'amount1',
          label: '总接待人数'
        },
        {
          prop: 'amount1',
          label: '人均消费'
        },
        {
          prop: 'amount2',
          label: '成交人数'
        },
        {
          prop: 'amount3',
          label: '未成交人数'
        },
        {
          prop: 'amount3',
          label: '成交金额'
        },
        {
          prop: 'amount2',
          label: '成交率'
        },
        {
          prop: 'amount4',
          label: '数据'
        },
        {
          prop: 'amount1',
          label: '人均消费'
        },
        {
          prop: 'amount3',
          label: '成交金额'
        }
        // {
        //   prop: "peopleSecond",
        //   label: "接诊人次",
        // },

      ],
      tableDatalist: [],
      tableData: [{
        id: '12987122',
        name: '王小虎1',
        amount1: '234',
        amount2: '3.2',
        amount3: 10,
        amount4: 10
      }, {
        id: '12987122',
        name: '王小虎1',
        amount1: '165',
        amount2: '4.43',
        amount3: 12
      }, {
        id: '12987122',
        name: '王小虎1',
        amount1: '324',
        amount2: '1.9',
        amount4: 10,
        amount3: 9
      }, {
        id: '12987123',
        name: '王小虎3',
        amount1: '621',
        amount2: '2.2',
        amount3: 17
      }, {
        id: '12987123',
        name: '王小虎3',
        amount1: '539',
        amount2: '4.1',
        amount3: 15
      }]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      var map = {}
      var dest = []
      // this.tableData后端返回的数据
      for (var i = 0; i < this.tableData.length; i++) {
        var ai = this.tableData[i]
        if (!map[ai.id]) {
          dest.push({
            id: ai.id,
            data: [ai]
          })
          map[ai.id] = ai
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j]
            if (dj.id === ai.id) {
              dj.data.push(ai)
              break
            }
          }
        }
      }
      dest.forEach(item => {
        var amount1 = 0
        var amount2 = 0
        var amount3 = 0
        const id = '合计'
        item.data.forEach(c => {
          amount1 = math.add(amount1, c.amount1)
          amount2 = math.add(amount2, c.amount2)
          amount3 = math.add(amount3, c.amount3)
        })
        item.data.push({
          amount1: amount1,
          amount2: amount2,
          amount3: amount3,
          id: id
        })
      })
      var arr = []
      dest.forEach(v => {
        v.data.forEach(c => {
          arr.push(c)
        })
      })
      this.tableDatalist = arr
    }
  }
}
</script>

<style scoped lang="scss">

</style>
