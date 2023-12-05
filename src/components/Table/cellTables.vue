<template>
  <!--复杂表单 组件 -->
  <el-table
    ref="table"
    v-loading="loading"
    :data="listData"
    :span-method="objectSpanMethod"
    :header-cell-style="getRowClass"
    :cell-style="cellStyle"
    class="tableArea"
    style="width: 1300px"
    :height="heights > 0 ? heights : null"
    border
    size="mini"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    :show-summary="summary"
    :row-style="{height:'8px'}"
    :show-header="false"
    @header-click="(column, event)=>{return tableMethods('header-click', column, event)}"
    @row-dblclick="(row, column, event)=>{return tableMethods('row-dblclick',row, column, event)}"
  >
    <template v-for="(item, index) in propData">
      <el-table-column
        :key="index + '1'"
        align="center"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable"
        :width="item.width"
        :formatter="stateFormat"
      >
        <el-table-column
          v-if="item.custom"
          :key="index"
          :prop="item.val"
          :label="item.lab"
          :sortable="item.sortable"
          :align="item.align ? 'tab.align' : 'center'"
          :column-key="item.columnKey"
          :width="item.width"
          :render-header="item.renderHeader"
          :sort-method="item.sortMethod"
          :min-width="item.minWidth"
          :fixed="item.fixed"
          :sort-by="item.sortBy"
          :sort-orders="item.sortOrder"
          :resizable="item.resizable"
          :show-overflow-tooltip="item.showOverflowTooltip"
          :header-align="item.headerAlign"
          :class-name="item.className"
          :label-class-name="item.labelClassName"
          :selectable="item.selectable"
          :reserve-selection="item.reserveSelection"
          :filters="item.filters"
          :filter-placement="item.filterPlacement"
          :filter-multiple="item.filterMultiple"
          :filter-method="item.filterMethod"
          :filtered-value="item.filteredValue"
        >
          <template #default="scope">
            <slot
              name="custom"
              :custom="scope.row"
              :index="scope.$index"
              :props="item.custom"
            />
          </template>
        </el-table-column>
      </el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  name: 'CellTable',
  props: {
    heights: {
      type: Number,
      default: () => {
        return document.body.clientHeight - 242
      }
    },
    summary: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    listData: {
      type: Array,
      default: () => {
        return []
      }
    },
    cellName: {
      type: String,
      default: ''
    },
    propData: {
      type: Array,
      default: () => {
        return []
      }
    },
    cellBack: {
      type: String,
      default: ''
    },
    // 展开行
    expands: {
      type: Object
    },
    cellMerge: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // heights: document.body.clientHeight - 242,
      rowList: [],
      spanArr: [],
      position: 0
    }
  },
  updated() {
    this.$nextTick(() => {
      this.$refs['table'].doLayout()
    })
  },
  mounted() {
    this.queryData()
  },
  methods: {
    tableMethods() {
      this.$emit(arguments[0], arguments)
    },
    stateFormat(row, column, cellValue) {
      cellValue += '';
      if (!cellValue.includes('.')) cellValue += '.';
      return cellValue.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ',';
      }).replace(/\.$/, '');
    },
    // formatter(row, column, item) {
    //   if (item.constructor === String) {
    //     const arr = item.split(',')
    //     if (arr.length === 2) {
    //       switch (item.split(',')[0]) {
    //         case 'date':
    //           return dateFormate(row[item.split(',')[1]])
    //       }
    //     }
    //   } else if (item.constructor === Array) {
    //     return item[0](row[item[1]], row)
    //   }
    //   function dateFormate(time) {
    //     if (time) {
    //       const date = new Date(time)
    //       const y = date.getFullYear()
    //       const M = p(date.getMonth() + 1)
    //       const d = p(date.getDate())
    //       const h = p(date.getHours())
    //       const m = p(date.getMinutes())
    //       const s = p(date.getSeconds())
    //       var timeFormat = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
    //       return timeFormat
    //     }
    //   }
    //   function p(s) {
    //     return s < 10 ? '0' + s : s
    //   }
    // },
    // noFormate(row, column, cellValue) {
    //   return cellValue
    // },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      const keys = this.cellBack.split(',')
      if (row.totalName == '合计') {
        return {
          color: keys[2] ? keys[2] : '',
          // 合计背景颜色
          'background-color': keys[1] ? '#AEEEEE' : '',
          'font-size': '12px',
          'height':'20px'
        }
      } else {
        return {
          'height':'20px',
          'background-color':'#fff',
        }
      }
      return {
        'height':'20px'
      }
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return {
          // 头部标签
          'background-color': '#87CEFA',
          'display': 'none',
          color: '#fff'
        }
      } else {
        return ''
      }
    },
    queryData() {
      this.$nextTick(() => {
        if (this.cellName !== '') {
          this.rowspan()
        }
      })
    },
    rowspan(row) {
      this.spanArr = []
      this.listData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (
            this.listData[index][this.cellName] ===
            this.listData[index - 1][this.cellName]
          ) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.position = index
          }
        }
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 表格合并行
      var _this = this
      if (this.cellMerge.length > 0) {
        for (let i = 0; i <= this.cellMerge.length; i++) {
          if (columnIndex === this.cellMerge[i]) {
            const _row = this.spanArr[rowIndex]
            const _col = _row > 0 ? 1 : 0
            return {
              rowspan: _row,
              colspan: _col
            }
          }
          continue
        }
      }
    }
  }
}
</script>

<style scoped>
.el-select {
  margin-right: 15px;
}
.el-input {
  margin-right: 15px;
  width: 200px;
}
.tableArea {
  /* box-shadow: 0 0 8px 0 #aaa; */
}
i[class^="el-icon"] {
  margin-right: 5px;
  font-size: 16px;
  cursor: pointer;
}
.modify_table td {
  padding: 10px;
}
.item_title {
  text-align: right;
}

</style>

