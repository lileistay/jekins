<template>
  <!-- 这是一个组件 添加删除搜索模块的 -->
  <div
    v-if="showTable"
    class="data-sg-table"
  >
    <div
      v-if="!hideSearchBar"
      ref="searchTopBar"
      class="sg-table-bar-content"
    >
      <div
        v-if="$slots.searchBar"
        class="sg-table-bar"
        :style="SearchBarStyle"
      >
        <slot name="searchBar"/>
      </div>
      <div
        v-else
        class="sg-table-bar"
      >
        <el-form
          :inline="true"
          size="mini"
          :show-message="false"
        >
          <el-form-item :label="searchBar.lab">
            <el-input
              v-model="search"
              :placeholder="searchBar.placeholder"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :icon="searchBar.btnIcon"
              @click="tableMethods('search',search)"
            >{{ searchBar.btnText }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div
      v-if="$slots.header"
      ref="searchHeaderBar"
      :style="headerStyle"
      class="custom-slot"
    >
      <div class="header-slot">
        <slot name="header"/>
      </div>
      <div class="backUp">
        <el-tooltip
          effect="dark"
          content="返回"
          placement="top"
        >
          <el-button
            size="mini"
            plain
            circle
            icon="el-icon-back"
            @click="backUp"
          />

        </el-tooltip>
<!--        <img src="@/assets/searchtop.png" v-if="isShow" class="Img" @click="changeImg">-->
        <!-- <el-button>编辑</el-button> -->
        <!-- <el-button>dhjdhd</el-button> -->
      </div>
    </div>
    <div class="data-sg-table-content">
      <el-table
        v-if="tableData"
        :ref="sgRef"
        :size="size"
        :data="tableData"
        :border="border"
        :stripe="stripe"
        :height="height"
        :max-height="maxHeight"
        :fit="fit"
        :show-header="showHeader"
        :highlight-current-row="highlightCurrentRow"
        :current-row-key="currentRowKey"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :cell-class-name="cellClassName"
        :cell-style="cellStyle"
        :header-row-class-name="headerRowClassName"
        :header-row-style="headerRowStyle"
        :header-cell-class-name="headerCellClassName"
        :header-cell-style="headerCellStyle"
        :row-key="rowKey"
        :empty-text="emptyText"
        :default-expand-all="defaultExpandAll"
        :expand-row-keys="expandRowKeys"
        :default-sort="defaultSort"
        :tooltip-effect="tooltipEffect"
        :show-summary="showSummary"
        :sum-text="sumText"
        :summary-method="summaryMethod"
        :span-method="spanMethod"
        :select-on-indeterminate="selectOnIndeterminate"
        :indent="indent"
        :lazy="lazy"
        :load="load"
        :tree-props="treeProps"
        style="width: 100%;height: 100%"
        @select="(selection,row)=>{return tableMethods('select',selection,row)}"
        @select-all="(selection)=>{return tableMethods('select-all',selection)}"
        @selection-change="(selection)=>{return tableMethods('selection-change',selection)}"
        @cell-mouse-enter="(row, column, cell, event)=>{return tableMethods('cell-mouse-enter',row, column, cell, event)}"
        @cell-mouse-leave="(row, column, cell, event)=>{return tableMethods('cell-mouse-leave',row, column, cell, event)}"
        @cell-click="(row, column, cell, event)=>{return tableMethods('cell-click',row, column, cell, event)}"
        @cell-dblclick="(row, column, cell, event)=>{return tableMethods('cell-dblclick',row, column, cell, event)}"
        @row-click="(row, column, event)=>{return tableMethods('row-click',row, column, event)}"
        @row-contextmenu="(row, column, event)=>{return tableMethods('row-contextmenu',row, column, event)}"
        @row-dblclick="(row, column, event)=>{return tableMethods('row-dblclick',row, column, event)}"
        @header-click="(column, event)=>{return tableMethods('header-click', column, event)}"
        @header-contextmenu="(column, event)=>{return tableMethods('header-contextmenu', column, event)}"
        @sort-change="({ column, prop, order })=>{return tableMethods('sort-change', { column, prop, order })}"
        @filter-change="(filters)=>{return tableMethods('filter-change', filters)}"
        @current-change="(currentRow, oldCurrentRow)=>{return tableMethods('table-current-change', currentRow, oldCurrentRow)}"
        @header-dragend="(newWidth, oldWidth, column, event)=>{return tableMethods('header-dragend', newWidth, oldWidth, column, event)}"
        @expand-change="(row,expandedRows)=>{return tableMethods('expand-change', row, expandedRows)}"
      >
        <el-table-column
          v-if="expands"
          type="expand"
          :width="expands.with"
        >
          <template #default="scope">
            <!-- 表格展开行自定义样式 -->
            <slot
              name="expands"
              :data="scope.row"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="selection"
          :selectable="selectEnable"
          type="selection"
          align="center"
          width="50"
        />
        <el-table-column
          v-if="index && index !== ''"
          type="index"
          :label="index"
          align="center"
          width="50"
        />
        <template v-for="(tab,tabIndex) in columns">
          <!-- <el-table-column
            v-if="selection && isDisabled"
            type="selection"
            align="center"
            width="50"
            :disabled="item.isExecute === '是'"
          /> -->
          <el-table-column
            v-if="tab.image"
            :key="tabIndex"
            :prop="tab.val"
            :label="tab.lab"
            :sortable="tab.sortable"
            :align="tab.align ? 'tab.align' : 'center'"
            :column-key="tab.columnKey"
            :width="tab.width"
            :render-header="tab.renderHeader"
            :sort-method="tab.sortMethod"
            :min-width="tab.minWidth"
            :fixed="tab.fixed"
            :sort-by="tab.sortBy"
            :sort-orders="tab.sortOrder"
            :resizable="tab.resizable"
            :show-overflow-tooltip="tab.showOverflowTooltip"
            :header-align="tab.headerAlign"
            :class-name="tab.className"
            :label-class-name="tab.labelClassName"
            :selectable="tab.selectable"
            :reserve-selection="tab.reserveSelection"
            :filters="tab.filters"
            :filter-placement="tab.filterPlacement"
            :filter-multiple="tab.filterMultiple"
            :filter-method="tab.filterMethod"
            :filtered-value="tab.filteredValue"
          >
            <template #default="scope">
              <el-image
                :style="{
                  width: tab.image.width
                    ? tab.image.size + 'px'
                    : '30px',
                  height: tab.image.size
                    ? tab.image.width + 'px'
                    : '30px',
                  borderRadius: tab.image.radius
                    ? tab.image.radius
                    : '4px',
                }"
                :src="scope.row[tab.val]"
                :preview-src-list="[scope.row[tab.val]]"
              />
            </template>
          </el-table-column>
    
          <el-table-column
            v-else-if="tab.custom"
            :key="tabIndex"
            :prop="tab.val"
            :label="tab.lab"
            :sortable="tab.sortable"
            :align="tab.align ? 'tab.align' : 'center'"
            :column-key="tab.columnKey"
            :width="tab.width"
            :render-header="tab.renderHeader"
            :sort-method="tab.sortMethod"
            :min-width="tab.minWidth"
            :fixed="tab.fixed"
            :sort-by="tab.sortBy"
            :sort-orders="tab.sortOrder"
            :resizable="tab.resizable"
            :show-overflow-tooltip="tab.showOverflowTooltip"
            :header-align="tab.headerAlign"
            :class-name="tab.className"
            :label-class-name="tab.labelClassName"
            :selectable="tab.selectable"
            :reserve-selection="tab.reserveSelection"
            :filters="tab.filters"
            :filter-placement="tab.filterPlacement"
            :filter-multiple="tab.filterMultiple"
            :filter-method="tab.filterMethod"
            :filtered-value="tab.filteredValue"
          >
            <template #default="scope" >
              
              <slot
                name="custom"
                :custom="scope.row"
                :index="scope.$index"
                :props="tab.custom"

              />
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="tab.expands"
            :key="tabIndex"
            type="expand"
            :prop="tab.val"
            :label="tab.lab"
            :sortable="tab.sortable"
            :align="tab.align ? 'tab.align' : 'center'"
            :column-key="tab.columnKey"
            :width="tab.width"
            :render-header="tab.renderHeader"
            :sort-method="tab.sortMethod"
            :min-width="tab.minWidth"
            :fixed="tab.fixed"
            :sort-by="tab.sortBy"
            :sort-orders="tab.sortOrder"
            :resizable="tab.resizable"
            :show-overflow-tooltip="tab.showOverflowTooltip"
            :header-align="tab.headerAlign"
            :class-name="tab.className"
            :label-class-name="tab.labelClassName"
            :selectable="tab.selectable"
            :reserve-selection="tab.reserveSelection"
            :filters="tab.filters"
            :filter-placement="tab.filterPlacement"
            :filter-multiple="tab.filterMultiple"
            :filter-method="tab.filterMethod"
            :filtered-value="tab.filteredValue"
          >
            <template #default="scope">
              <slot
                name="expands"
                :expands="scope.row"
                :index="scope.$index"
                :props="tab.val"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="tabIndex"
            :prop="tab.val"
            :label="tab.lab"
            :sortable="tab.sortable"
            :align="tab.align ? 'tab.align' : 'center'"
            :column-key="tab.columnKey"
            :width="tab.width"
            :render-header="tab.renderHeader"
            :sort-method="tab.sortMethod"
            :min-width="tab.minWidth"
            :fixed="tab.fixed"
            :sort-by="tab.sortBy"
            :sort-orders="tab.sortOrder"
            :resizable="tab.resizable"
            :show-overflow-tooltip="tab.showOverflowTooltip"
            :header-align="tab.headerAlign"
            :class-name="tab.className"
            :label-class-name="tab.labelClassName"
            :selectable="tab.selectable"
            :reserve-selection="tab.reserveSelection"
            :filters="tab.filters"
            :filter-placement="tab.filterPlacement"
            :filter-multiple="tab.filterMultiple"
            :filter-method="tab.filterMethod"
            :filtered-value="tab.filteredValue"
            :formatter="
              tab.format === 'date'
                ? (row, column, cellValue, index) => {
                  return formatMethods(
                    tab.formatType,
                    row,
                    column,
                    cellValue,
                    index
                  );
                }
                : tab.format
            "
          />
        </template>
        <el-table-column
          v-if="operate"
          :label="operate.name"
          align="center"
          :fixed="operate.fixed"
          :width="operate.width"
        >
          <template slot-scope="scope">
            {{ scope.name }}
            <div>
              <span
                v-for="(slab,uIndex) in operate.cell"
                :key="uIndex"
                style="margin: 0 4px"
              >
                <el-button
                  v-if="!slab.permi"
                  :size="size"
                  type="text"
                  @click.stop="operateClick(slab,scope.row)"
                >
                  <span
                    :style="{color:CheckColor(slab.type)}"
                    class="operateButton"
                  >
                    <i class="operateIcon" :class="slab.icon"/>
                    {{ slab.lab }}
                  </span>
                </el-button>
                <el-button
                  v-else
                  v-hasPermi="slab.permi"
                  :size="size"
                  type="text"
                  @click.stop="operateClick(slab,scope.row)"
                >
                  <span
                    :style="{color:CheckColor(slab.type)}"
                    class="operateButton"
                  >
                    <i
                      class="operateIcon"
                      :class="slab.icon"
                    />
                    {{ slab.lab }}
                  </span>
                </el-button>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="pagination.show"
        ref="pagination"
        class="pagination"
      >
        <el-pagination
          size="mini"
          :style="paginationStyle"
          background
          :page-sizes="pagination.sizes?pagination.sizes:[20, 30, 40, 50]"
          :page-size="pagination.pageSize"
          :layout="pagination.layout?pagination.layout:'total, sizes, prev, pager, next, jumper'"
          :total="pagination.total"
          :current-page="pagination.currentPage"
          @size-change="(e)=>{return tableMethods('size-change',e)}"
          @current-change="(e)=>{return tableMethods('current-change',e)}"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {timeFmt} from '@/utils/time.js'
import {debounce} from '@/utils/throttleAndDebounce' // 防抖

export default {
  name: 'SgTable',
  components: {},
  props: {
    // 搜索栏
    searchBar: {
      type: Object,
      default: function () {
        return {
          lab: '手机号码',
          placeholder: '请输入手机号码',
          btnIcon: 'el-icon-search',
          btnText: '搜索'
        }
      }
    },
    hideSearchBar: {
      type: Boolean,
      default: false
    },

    // 传入ref
    sgRef: {
      type: String
    },
    // Table 的最大高度。合法的值为数字或者单位为 px 的高度。
    maxHeight: {
      type: String || Number
    },
    // 动态style样式
    // 调用组件时候改变组件的样式
    headerStyle: {
      type: Object
    },
    // 动态style样式
    SearchBarStyle: {
      type: Object
    },
    // 分页的组件动态样式
    paginationStyle: {
      type: Object
    },
    // 展开行
    expands: {
      type: Object
    },
    // 需要显示的列
    columns: {
      type: Array
    },
    // 选择框
    selection: {
      type: Boolean || String,
      default: false
    },
    // 是否为斑马纹 table
    stripe: {
      type: Boolean,
      default: false
    },
    // 是否带有纵向边框
    border: {
      type: Boolean,
      default: false
    },
    // Table 的尺寸    medium / small / mini
    size: {
      type: String,
      default: 'mini'
    },
    // 列的宽度是否自撑开
    fit: {
      type: Boolean,
      default: true
    },
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default: true
    },
    // 是否要高亮当前行
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    // 显示序列
    index: {
      type: String
    },
    // 当前行的 key，只写属性
    currentRowKey: {
      type: String || Number
    },
    // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className
    rowClassName: {
      type: Function
    },
    // 行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style
    rowStyle: {
      type: Function
    },
    // 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。
    cellClassName: {
      type: Function
    },
    // 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。
    cellStyle: {
      type: Function
    },
    // 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。
    headerRowClassName: {
      type: Function
    },
    // 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。
    headerRowStyle: {
      type: Function
    },
    // 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。
    headerCellClassName: {
      type: Function
    },
    // 表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。
    headerCellStyle: {
      type: Function
    },
    // 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。
    rowKey: {
      type: Function || String
    },
    // 空数据时显示的文本内容
    emptyText: {
      type: String
    },
    // 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    // 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
    expandRowKeys: {
      type: Array
    },
    // 默认的排序列的 prop 和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序  ascending, descending
    defaultSort: {
      type: Object
    },
    // tooltip effect 属性
    tooltipEffect: {
      type: String
    },
    // 是否在表尾显示合计行
    showSummary: {
      type: Boolean,
      default: false
    },
    // 合计行第一列的文本
    sumText: {
      type: String,
      default: '合计'
    },
    // 自定义的合计计算方法
    summaryMethod: {
      type: Function
    },
    // 合并行或列的计算方法
    spanMethod: {
      type: Function
    },
    // 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    // 展示树形数据时，树节点的缩进
    indent: {
      type: Number,
      default: 16
    },
    // 是否懒加载子节点数据
    lazy: {
      type: Boolean,
      default: false
    },
    // 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息
    load: {
      type: Function,
      default: function () {
        return {}
      }
    },
    // 渲染嵌套数据的配置选项
    treeProps: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 表格数据
    tableData: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 操作
    operate: {
      type: Object
    },
    // 分页
    pagination: {
      type: Object,
      default: () => {
        return {
          show: false
        }
      }
    },
      selectEnable:{
          type: Function,
          default: function () {
              return {}
          }
      }
  },
  data() {
    return {
      search: '',
      height: 0,
      showTable: true,
      isShow:false
    }
  },
  watch:{
    tableData:{
      handler(newV){
        this.$nextTick(function(){
          this.SetColor();
        })
     
      },
      deep:true
    },
   '$store.getters.setShowButton':{
          handler(newv){

          },
          deep:true
   }
  },
  computed: {
    setShowButton: {
            get() {
           
                return this.$store.getters.setShowButton
            },
            set(val) {
                val = this.$store.getters.setShowButton;
            }
        }
    },
  created() {
    this.setShowButton=this.$store.getters.setShowButton
    if(!this.setShowButton){
      this.columns.forEach((value,index)=>{
        if(value.custom=='orderNumber'||value.val=='orderNumber'){
          this.columns.splice(index,1)
        }
      })
    }
  },
  mounted() {
    let that=this;
    this.$nextTick(() => {
      const searchHeaderBar = this.$refs.searchHeaderBar ? this.$refs.searchHeaderBar.clientHeight : 0
      const searchTopBar = this.$refs.searchTopBar ? this.$refs.searchTopBar.clientHeight : 0
      const pagination = this.$refs.pagination ? this.$refs.pagination.clientHeight : 0
      this.height = document.documentElement.clientHeight - searchHeaderBar - searchTopBar - pagination - 132
    })
    window.addEventListener('resize',function(){
      const searchHeaderBar = that.$refs.searchHeaderBar ? that.$refs.searchHeaderBar.clientHeight : 0
      const searchTopBar = that.$refs.searchTopBar ? that.$refs.searchTopBar.clientHeight : 0
      const pagination = that.$refs.pagination ? that.$refs.pagination.clientHeight : 0
      that.height = document.documentElement.clientHeight - searchHeaderBar - searchTopBar - pagination - 132
      // document.querySelector('.data-sg-table-content').style.height= document.documentElement.clientHeight-132 +'px'
    })
  },
  methods: {
    SetColor(){
    //   let Color=document.querySelectorAll('.el-table__row')
    // for(let i=0;i<Color.length;i++){
    //   if(i%2==0){
    //     let childrens=Color[i].children
    //     console.log(Color[i],'dsaudasuduasd')
    //     let Num=(window.getComputedStyle(childrens[0])['background']).split('none');
    //     if(Num[0]!=='rgb(255, 255, 255) '){
    //            if(Num[0]=='rgba(0, 0, 0, 0) '){
    //             Color[i].style.background='#eee'
    //            }
    //     }else{
    //       if(Num[0]=='rgb(255, 255, 255) '){
    //         Color[i].style.background='#eee'
    //       }
          
    //     }
        
    //   }
    // }
    },
    // backUpkeyup() {
    //   document.onkeyup = e => {
    //     if (e.keyCode === 27) {
    //       this.backUp()
    //     }
    //   }
    // },
    backUp() {
      window.history.go(-1)
    },
    changeImg(){
      this.$emit('changeImg', this.hideSearchBar)
    },
    formatMethods(fmt, row, column, cellValue) {
      return timeFmt(fmt, cellValue)
    },
    tableFun(reg) {
      let index = 0
      const arr = []
      for (const argument of arguments) {
        if (index > 0) {
          arr.push(argument)
        }
        index++
      }
      this.$refs[this.sgRef][reg](...arr)
    },
    tableMethods() {
      this.$emit(arguments[0], arguments)
    },
    CheckColor(color) {
      return {
        'primary': '#1ABC9C',
        'success': '#D6F1E4',
        'warning': '#E6A23C',
        'danger': '#F56C6C',
        'info': '#909399'
      }[color]
    },
    operateClick: debounce(function () {
      this.$emit('operateClick', arguments)
    })
  }
}
</script>

<style scoped lang="scss">
.data-sg-table {
  width: 100%;

  position: relative;
  box-sizing: border-box;

  .custom-slot {
    width: 100%;
    // height: 40px;
    // 此处给了高度有的页面会被遮盖
    padding: 4px 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-slot {
      width: calc(100% - 50px);
      display: flex;
      white-space: nowrap;
    }

    .backUp {
      width: 60px;
      margin-left: 20px;
      display: flex;
    }
  }

  .sg-table-bar-content {
    width: 100%;
    background-color: #f2f2f2;
    z-index: 999;

    .sg-table-bar {
      width: 100%;
      height: 40px;
      padding: 5px 10px 5px 10px;
      box-sizing: border-box;
    }
  }

  .data-sg-table-content {
    width: 100%;

    .pagination {
      width: 100%;
      text-align: center;
      box-sizing: border-box;
    }
  }
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 8px;
  z-index: 999999;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  height: 20px;
  background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  //box-shadow: inset 0 0 5px #999;
  background: transparent;
  //border-radius: 2px;
}

::v-deep .el-scrollbar {
  width: 100%;
  height: 100%;

  .el-scrollbar__wrap {
    margin-bottom: 0 !important;
    overflow-x: unset;
  }
}

::v-deep .el-table {
  padding: 0 4px;
}

.operateButton {
  position: relative;
}

.operateButton:after {
  position: absolute;
  content: "";
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  background-color: #48c9b0;
  border-radius: 50%;
  width: 0;
  transition: 0.35s;
}

.operateButton:hover:after {
  width: 100%;
}

::v-deep .el-table__row .el-table tr .success-row {
  background-color: rgba(26, 188, 156, 0.6) !important;
}

::v-deep .el-table__row .el-table tr .warning-row {
  background-color: red !important;
}

::v-deep  .el-table__row td{
  height: 1px;
  padding: 3px 0px;

}

.el-table .warning-row {
  background: oldlace;
}

.el-table > > > .success-row {
  //background: #1abc9c;
  background-color: rgba(26, 188, 156, 0.6);
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #1abc9c;
  color: #ffffff;
}
.Img{
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-top: 5px;
}
</style>
