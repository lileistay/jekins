<template>
    <div>
        <div class="acne_bottom" :style="{position:'relative',height:height+'px'}">
          <slideSearch :options="options">
            <div slot="btnBar">
              <el-button
                size="mini"
                icon="el-icon-search"
                type="primary"
                plain
                @click.stop="getData"
                @keydown.enter.native="getData"
              >查询
              </el-button>
              <el-button
                size="mini"
                icon="el-icon-upload2"
                type="success"
                plain
                :loading="submitLoadings"
                @click.stop="exportExcel"
              >导出
              </el-button>
            </div>
            <slot>

                <!-- <div  class="searchBar">
            <div class="title">信息统计</div>
            <div>
              <span style="margin-right: 20px;">客户数量:人</span>
            </div>
          </div> -->
                <div class="table">

              <SgTable
                :columns="newclums"
                :pagination="pagination"
                :table-data="tableData"
                id="out-table"
                border
                :hideSearchBar="true"
                :default-sort="{prop: 'num', order: 'descending'}"
              >
              <div slot="header" style="width: 100%;">
            <span style="font-size: 14px;"><i class="el-icon-s-fold" style="cursor:pointer" @click="getDialogStemporary"/> 列表清单</span>
            </div>
                <template #custom="data">
                  <div v-if="data.props === 'project'">
                    {{ data.custom.project | numberToCurrency}}
                  </div>
                  <div v-if="data.props === 'pmage'">
                    {{ data.custom.pmage | numberToCurrency}}
                  </div>
                  <div v-if="data.props === 'amount'">
                    {{ data.custom.amount | numberToCurrency}}
                  </div>
                  <div v-if="data.props === 'amountPai'">
                    {{ data.custom.amountPai | numberToCurrency}}
                  </div>
                  <div v-if="data.props === 'salesAmount'">
                  {{ data.custom.salesAmount | numberToCurrency}}
                </div>
                  <div v-if="data.props === 'salesAmountPai'">
                  {{ data.custom.salesAmountPai | numberToCurrency}}
                </div>
                  <div v-if="data.props === 'arrears'">
                  {{ data.custom.arrears | numberToCurrency}}
                </div>
                  <div v-if="data.props === 'Repayment'">
                  {{ data.custom.Repayment | numberToCurrency}}
                </div>
                  <div v-if="data.props === 'inment'">
                  {{ data.custom.inment | numberToCurrency}}
                </div>
                  <div v-if="data.props === 'copment'">
                  {{ data.custom.copment | numberToCurrency}}
                </div>
<!--                  <div v-if="data.props === 'refundNum'">-->
<!--                    {{ data.custom.refundNum | numberToCurrency}}-->
<!--                  </div>-->
                  <div v-if="data.props === 'refundNum'">
                    {{ data.custom.refundNum | numberToCurrency}}
                  </div>
                  <div v-if="data.props === 'refundNumPai'">
                  {{ data.custom.refundNumPai | numberToCurrency}}
                </div>
                  <div v-if="data.props === 'num'">
                  {{ data.custom.num | numberToCurrency}}
                </div>
                </template>
              </SgTable>
            </div>
            </slot>
          </slideSearch>

        </div>
<!--        <div class="pagation">-->
<!--            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
<!--                :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"-->
<!--                layout="total, sizes, prev, pager, next, jumper" :total="total">-->
<!--            </el-pagination>-->
<!--        </div>-->
<SgDialog title="列表清单设置" size="600px" :dialog="listDialog" @handleClose="listDialog = false">
            <div slot="out">
                <div class="draggle">
                    <el-table :data="changeclums" :fit="true" style="cursor:pointer" @select-all="selectAll"
                        @select="select" ref="tabledata">
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column type="index" width="75" label="序号" align="center" >
                        </el-table-column>
                        <el-table-column label="列名" align="center">
                            <template slot-scope="scope">
                                <div>
                                    {{ scope.row.lab }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="拖拽调整顺序" align="center">
                            <template slot-scope="scope">
                                <div>
                                    <i class="el-icon-d-caret"></i>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </SgDialog>
    </div>
</template>
<script>
import SgTable from '@/components/Table'
import {monthData} from "../../utils/time";
import slideSearch from '@/components/SlideSearchBar/index'
import moment from "moment/moment";
import {numberToCurrencyNo} from '@/utils/numberToCurrency'
import SgDialog from '@/components/Dialog'
import Sortable from 'sortablejs'
export default {
  components:{
    SgTable,
    slideSearch,
    SgDialog
  },
    data() {
        return {
          submitLoadings:false,
            currentPage4: 1,
            pageSize: 10,
            pageNum: 1,
            total: 0,
            height:"",
            listDialog:false,
            typeVuex:'emopy',
          columns:[
            {
              lab: '姓名',
              val: 'name'
            },
            {
              lab: '项目',
              val: 'project',
              custom: 'project'
            },
            {
              lab: '产品',
              val: 'pmage',
              custom:'pmage'
            },{
              lab: '会员卡',
              val: 'amount',
              custom: 'amount'
            },
            {
              lab: '会员卡配合',
              val: 'amountPai',
              custom: 'amountPai'
            },
            {
              lab: '活动',
              val: 'salesAmount',
              custom: 'salesAmount',
            },
            {
              lab: '活动配合',
              val: 'salesAmountPai',
              custom: 'salesAmountPai',

            },
            {
              lab: '欠款',
              val: 'arrears',
              custom: 'arrears'
            },
            {
              lab: '还款',
              val: 'Repayment',
              custom: 'Repayment'
            },
            {
              lab: '独立开发',
              val: 'inment',
              custom: 'inment'
            },
            {
              lab: '配合开发',
              val: 'copment',
              custom: 'copment'
            },
            {
              lab: '独立退款',
              val: 'refundNum',
              custom: 'refundNum'
            },
            {
              lab: '配合退款',
              val: 'refundNumPai',
              custom: 'refundNumPai'
            },
            {
              lab: '总计',
              val: 'num',
            custom: 'num',
              sortable:true
            },

          ],
          newclums:[],
          changeclums:[],
          pagination:{},
          tableData:[],
          // 查询出列表
          options: {
            startTime: {
              type: 'Tdatetime',
              label: '时间:',
              clearable: true,
              values: [new Date(monthData()[0]), new Date(monthData()[1])]
            },
            sthreId: {
              type: 'select1',
              label: '门店:',
              clearable: true,
              options: []
            },

          },


        }
    },
    
    mounted(){
        let that=this;
        let h = window.innerHeight || document.documentElement.clientHeight
            || document.body.clientHeight;//获取可视区域高度
            this.height=h-32-132
            this.newclums = this.deepClone(this.columns);
        this.changeclums = this.deepClone(this.columns);
        this.newclums.forEach(value => {
            value.Isshow = true
        })
        this.changeclums.forEach(value => {
            value.Isshow = true
        })
        if (this.$store.getters.rembertable[this.typeVuex] == undefined || this.$store.getters.rembertable[this.typeVuex] == null) {
            this.$store.dispatch('settabledata', {
                data: [],
                name: this.typeVuex
            });
        } else {
            if (this.$store.getters.rembertable[this.typeVuex].length !== 0) {
                this.newclums = this.$store.getters.rembertable[this.typeVuex];
                setTimeout(()=>{
                    let span=document.querySelector('.table').children[0].children[1].children[0].children[2].children[0].children[1].children;
                    let spans=document.querySelector('.table').children[0].children[1].children[0].children[1].children[0].children[1].children[0].children
                    that.newclums.forEach((value,index)=>{
                        if(value.Isshow==false){
                            spans[index].style.display='none'
                            for(let i=0;i<span.length;i++){
                                span[i].children[index].style.display='none'
                            }
                           
                        }
                      })
                },1000)
      
          
            }
        }
            // setTimeout(()=>{
            //     let span=document.querySelector('.table').children[0].children[0].children[0].children[2].children[0].children[1].children;
            //   for(let i=0;i<span.length;i++){
            //   span[i].style.display='none'
            //    }
            // },1000)

    },
  created() {
    this.getstore()
    this.getData()
  },
  methods:{
    rowDrop() {
            //获取拖拽对象
            const tbody = document.querySelector('.draggle .el-table__body-wrapper tbody');
            const _this = this
            Sortable.create(tbody, {
                group: {
                    name: "words",
                    pull: true,
                    put: true
                },
                animation: 150, //动画参数
                onAdd: function (evt) {//拖拽时候添加有新的节点的时候发生该事件

                },
                onUpdate: function (evt) {//拖拽更新节点位置发生该事件

                },
                onRemove: function (evt) {//删除拖拽节点的时候触发该事件

                },
                onStart: function (evt) {//开始拖拽出发该函数

                },
                onSort: function (evt) {//发生排序发生该事件
                },
                onEnd({ newIndex, oldIndex }) { //拖拽结束的回调
                    let data = _this.newclums.splice(oldIndex, 1);
                    _this.newclums.splice(newIndex, 0, data[0]);
                    // //触发方法修改原表格行数据
                    _this.$emit('changeIndex', oldIndex, newIndex);
                    _this.$store.dispatch('settabledata',
                        {
                            data: _this.newclums,
                            name: this.typeVuex
                        }
                    );
                    setTimeout(() => {
                        let span = document.querySelectorAll('.draggle .el-table__body tbody tr');
                        for (let i = 0; i < span.length; i++) {
                            span[i].children[1].children[0].children[0].innerHTML = i + 1
                        }
                        document.querySelector('.el-table__body-wrapper').style.height = _this.warpperHeight + 'px'
                    }, 80);
                }
            })
        },
        //列拖拽逻辑
        columnDrop() {
            //获取拖拽对象
            const wrapperTr = document.querySelector('.draggle .el-table__header-wrapper tr')
            this.sortable = Sortable.create(wrapperTr, {
                animation: 180,
                delay: 0,
                onEnd: evt => {
                }
            })
        },
    getDialogStemporary(){
        this.listDialog = true;
            let that = this;
            this.changeclums = this.deepClone(this.newclums);
            setTimeout(function () {
                that.rowDrop();
                that.columnDrop();
                that.changeclums.forEach(value => {
                    if (value.Isshow !== false) {
                        that.$refs.tabledata.toggleRowSelection(value, true)
                    }
                })
            }, 80)
    },
    select(selection,row){
        let that = this;
            let flag = false;
            let Index = 0;
            this.newclums = this.deepClone(this.columns);
            selection.forEach(value => {
                if (value.lab == row.lab) {
                    flag = true
                } else {
                    flag = false
                }
            })
            this.columns.forEach((value, index) => {
                if (value.lab == row.lab) {
                    Index = index
                }
            })
            if (flag) {
                let span=document.querySelector('.table').children[0].children[1].children[0].children[2].children[0].children[1].children;
                let spans=document.querySelector('.table').children[0].children[1].children[0].children[1].children[0].children[1].children[0].children
                spans[Index].style.display=''
              for(let i=0;i<span.length;i++){
                span[i].children[Index].style.display=''
               }
            //    this.newclums[Index].Isshow = true;
            } else {
                this.newclums[Index].Isshow = false;
                let span=document.querySelector('.table').children[0].children[1].children[0].children[2].children[0].children[1].children;
                let spans=document.querySelector('.table').children[0].children[1].children[0].children[1].children[0].children[1].children[0].children
                spans[Index].style.display='none'
              for(let i=0;i<span.length;i++){
                span[i].children[Index].style.display='none';
                
               }
                // this.newclums = this.deepClone(this.clums);
                // this.newclums[Index].Isshow = false;
            }
            this.$store.dispatch('settabledata', {
                data: this.newclums,
                name: this.typeVuex
            });
    },
    selectAll(){

    },
    deepClone(obj) {
            // 根据类型制造一个新的数组或对象 => 指向一个新的空间
            // 由于数组的typeof也是'object',所以用Array.isArray(obj)
            var new_obj = Array.isArray(obj) ? [] : {};
            // 首先判断obj的类型
            // 普通类型
            if (typeof obj != 'object') {
                // 这里不能直接返回obj,不然就是浅拷贝的性质
                return new_obj = obj
            }
            //引用类型
            //数组
            if (obj instanceof Array) {
                for (let i = 0; i < obj.length; i++) {
                    new_obj[i] = obj[i];
                    if (typeof new_obj[i] == 'object') {
                        this.deepClone(new_obj[i])
                    }
                }
            } else { //对象
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        // 对象中的数组和对象
                        if (typeof obj[key] == 'object') {
                            new_obj[key] = this.deepClone(obj[key]);
                        } else {//对象中没有引用类型
                            new_obj[key] = obj[key]
                        }
                    }
                }
            }
            return new_obj;
        },
    getstore(){
      this.$api.deptId.listStoreinfo().then(res=>{
        res.data.forEach(item=>{
          item.value=item.store_id, item.label=item.store_name
        })
        this.options.sthreId.options=res.data

      })
    },
    exportExcel() {
      if (this.tableData.length === 0) {
        this.$message('导出数据为空')
        return
      }
      var data = {}
      this.submitLoadings = true
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = Object.assign(data)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'billingStatus', '1')
      this.$message({
        message: '稍等一下，马上就好',
        type: 'success'
      })
      if (!data.sthreId || data.sthreId.length==0){
        let list=[]
        setTimeout(()=>{
          console.log( this.options.sthreId.options)
          this.options.sthreId.options.forEach(item=>{
            list.push(item.store_id)
          })
          const query={
            startTime:data.startTime,
            endTime:data.endstartTime,
            sthreId:list?list.toString():'',
          }
          this.$api.deptId.dnwStatistics(query).then(res=>{
            if (res) {
              res.data.forEach(item=>{
                for (let key in item) {

                  if (item[key]==null){
                  }else if (key!='name' ){
                    item[key]=item[key].toFixed(0)
                    item.num=Number(item.project)+Number(item.pmage)+Number(item.amount)+Number(item.amountPai)+Number(item.salesAmount)+
                      Number(item.salesAmountPai)+Number(item.arrears)+Number(item.Repayment)+Number(item.inment)+Number(item.copment)+Number(item.refundNum)+Number(item.refundNumPai)
                  }

                }
              })
              this.tableData=res.data
            }

          }).finally(() => {
            this.$export('#out-table', '员工绩效列表')
            setInterval(() => {
              this.submitLoadings = false
            }, 5000)
          })
        },200)
      }else {
        const query={
          startTime:data.startTime,
          endTime:data.endstartTime,
          sthreId:data.sthreId?data.sthreId.toString():'',
        }
        this.$api.deptId.dnwStatistics(query).then(res => {
          if (res) {
            res.data.forEach(item=>{
              for (let key in item) {

                if (item[key]==null){
                }else if (key!='name' ){
                  item[key]=item[key].toFixed(0)
                  item.num=Number(item.project)+Number(item.pmage)+Number(item.amount)+Number(item.amountPai)+Number(item.salesAmount)+
                    Number(item.salesAmountPai)+Number(item.arrears)+Number(item.Repayment)+Number(item.inment)+Number(item.copment)+Number(item.refundNum)+Number(item.refundNumPai)
                }

              }
            })
            this.tableData=res.data
          }
        }).finally(() => {
          this.$export('#out-table', '员工绩效列表')
          setInterval(() => {
            this.submitLoadings = false
          }, 5000)
        })
      }
    },
    getData(){
      console.log('ddd')
      var data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
          if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          }
          if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          }
          if (this.options[k].values.length === 0) {
            data[k] = null
            data['end' + k] = null
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      data = Object.assign(data)
      if (!data.sthreId || data.sthreId.length==0){
        let list=[]
        setTimeout(()=>{
          console.log( this.options.sthreId.options)
          this.options.sthreId.options.forEach(item=>{
            list.push(item.store_id)
          })
          const query={
            startTime:data.startTime,
            endTime:data.endstartTime,
            sthreId:list?list.toString():'',
          }
          this.$api.deptId.dnwStatistics(query).then(res=>{
            res.data.forEach(item=>{
              for (let key in item) {

                if (item[key]==null){
                }else if (key!='name' ){
                  item[key]=item[key].toFixed(0)
                  item.num=Number(item.project)+Number(item.pmage)+Number(item.amount)+Number(item.amountPai)+Number(item.salesAmount)+
                    Number(item.salesAmountPai)+Number(item.arrears)+Number(item.Repayment)+Number(item.inment)+Number(item.copment)+Number(item.refundNum)+Number(item.refundNumPai)
                }

              }
            })
            this.tableData=res.data

          })
        },200)
      }else {
        const query={
          startTime:data.startTime,
          endTime:data.endstartTime,
          sthreId:data.sthreId?data.sthreId.toString():'',
        }
        this.$api.deptId.dnwStatistics(query).then(res=>{
          res.data.forEach(item=>{
            for (let key in item) {

              if (item[key]==null){
              }else if (key!='name' ){
                item[key]=item[key].toFixed(0)
                item.num=Number(item.project)+Number(item.pmage)+Number(item.amount)+Number(item.amountPai)+Number(item.salesAmount)+
                  Number(item.salesAmountPai)+Number(item.arrears)+Number(item.Repayment)+Number(item.inment)+Number(item.copment)+Number(item.refundNum)+Number(item.refundNumPai)
              }
            }
          })
          this.tableData=res.data

        })
      }

    }
  }
}
</script>
<style scoped lang="scss">
.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 99%;
  line-height: 30px;
  color: #999;
  margin-top: 10px;

  .title {
    font-weight: bold;
    padding-left: 10px;
    box-sizing: border-box;
    position: relative;
    margin-left: 10px;

    &:before {
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 15px;
      background-color: #1abc9c;
      left: 0px;
      border-radius: 10px;
      content: "";
    }
  }
}
::v-deep .el-table__header thead tr th{
    padding:5px;
}
::v-deep .el-table__row td{
    padding:3px;
    font-size:9px;
}
::v-deep .el-pager li.active {
    background-color: rgb(26, 188, 156) !important;
    color: #fff;
}

.pagation {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    /* border: 1px solid black; */
}
</style> 