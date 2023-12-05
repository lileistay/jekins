<template >
    <div>
        <div class="physical">
            <div class="order">
                <div class="ORDER_CHILDREN">
                    <div class="order-children">
                        <span>筛选条件:</span>
                        <el-switch v-model="value1" class="Left">
                        </el-switch>
                    </div>
                    <div class="order-children" style="width: 500px;">
                        <el-select v-model="value" placeholder="请选择类型" size="mini" class="Left">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker v-model="value3" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" size="mini" :editable="false" class="Left">
                        </el-date-picker>
                    </div>
                    <div class="order-children" style="width: 560px;">
                        <span class="Left">商品分类:</span>
                        <el-select v-model="value2" placeholder="请选择" size="mini" class="Left" clearable>
                            <el-option v-for="item in newoptionsl" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input size="mini" placeholder="请输入" v-model="name" style="width: 250px;margin-left: 20px;"
                            clearable></el-input>
                    </div>
                    <div class="order-children" style="width: 150px;">
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
                        <!-- <el-button type="primary" size="mini">重置</el-button> -->
                    </div>

                </div>
            </div>
            <div v-show='showflag'>
                <div style="margin:5px 0px 5px 20px" v-for="(item, index) in alllist" :key="index">
                    <span v-for="(items, indexs) in item.value" class="order_children"
                        :style="{ border: items.border == true ? '1px solid #eee' : '', background: items.back, color: items.color }"
                        @click="addlist(indexs, index)" :key="indexs">{{ items.name }}</span>
                </div>
            </div>

        </div>
        <!-- 表格 -->
        <div class="physical_table">
            <div style="margin-top:10px;margin-bottom: 5px;">
                <span class="Left" style="margin-left: 20px;">快捷操作</span>
                <el-button type="success" size="mini" style="margin-left:20px" @click="add"
                    icon="el-icon-plus">新增商品</el-button>
                <el-button type="warning" size="mini" @click="upload">批量{{upflag==true?"下":"上"}}架</el-button>
                <el-button type="primary" size="mini" @click="exports">导出</el-button>
            </div>
            <div class="table">
                <el-table :data="tableData" height="700" border class="tables" @selection-change="handleSelectionChange" id="out-table">
                    <el-table-column type="selection" width="55" align="center">
                    </el-table-column>
                    <el-table-column prop="projectName" label="商品名称" width="280" align="center">
                    </el-table-column>
                    <el-table-column prop="date" label="服务类型" width="200" align="center">
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.makeType == 0 ? "付费预约" : "免费预约" }}
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="originalPrice" label="商品原价" width="180" align="center">

                    </el-table-column>
                    <el-table-column prop="sellingPrice" label="商品售价" width="180" align="center">
                    </el-table-column> -->
                    <el-table-column prop="categoryId" label="商品分类" width="180" align="center">
                        <template slot-scope="scope">
                            <div>
                                {{ projecttype(scope.row.categoryId) }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="productType" label="商品类型" width="280" align="center">
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.productType == '1' ? "实物" : '服务' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="actualSales" label="实际销量" width="180" align="center">
                        <template slot-scope="scope">
                            <div>
                                {{ sumadd(scope.row.productSpecInfo)}}
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="date" label="已预约" width="180" align="center">
                    </el-table-column> -->
                    <el-table-column prop="shelfTime" label="上/下架时间" width="180" align="center">
                    </el-table-column>
                    <!-- <el-table-column prop="date" label="下架时间" width="180" align="center">
                    </el-table-column> -->
                    <el-table-column prop="shelfFlag" label="上架状态" width="180" align="center">
                        <template slot-scope="scope">
                            <div>
                                {{ scope.row.shelfFlag == '0' ? "上架" : '下架' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="weightSort" label="排序权重" width="180" align="center">
                    </el-table-column>
                    <el-table-column prop="name" label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="text" size="mini" @click="editADD(scope.row)">
                                    编辑
                                </el-button>
                                <!-- <el-button type="text" size="mini">
                                    分享
                                </el-button> -->
                                <el-button type="text" size="mini" @click="newdelete(scope.row.productId)" v-has-permi="['client:productInfo:remove']">
                                    删除
                                </el-button>
                                <!-- <el-button type="text" size="mini">
                                    推荐
                                </el-button> -->
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
        <div class="pagation">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { export_table_to_excel } from '@/utils/utils'
export default {
    watch: {
        value1(newV) {
            if (newV) {
                this.showflag = true;
            } else {
                this.showflag = false;
            }
        },
        deptId(newV){
            this.search();
        }
    },
    computed: {
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId;
            }
        }
    },
    created() {
        this.search();
        let data = {
            deptId: this.deptId,
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }
        this.$api.confinementRoom.productCategorylist(data).then(res => {
            res.rows.forEach(value => {
                value.value = value.categoryId;
                value.label = value.categoryName
            })
            this.newoptionsl = res.rows;
            // this.tableData = res.rows;
            // this.total = res.total;
        })
    },
    methods: {
        sumadd(val){
            let str=0;
            val.forEach(value=>{
                str+=Number(value.virtualSales)
            })
            return str;
        },
        editADD(val){
             localStorage.setItem('ifshowtal',JSON.stringify(val))
             localStorage.setItem('ifshowtalFlag',true)
             this.$router.push('/addserver');
        },
        exports(){
            if(this.selectdatas.length == 0) {
                this.$message.warning('请选择需要导出的数据');
            }else{
                let data = {
                categoryId: this.value2,
                shelfFlag: this.Index,
                payType: this.Indexs,
                shelfTime:this.value3==''||this.value3==null?'':this.newgetData(this.value3[0]),
                endShelfTime:this.value3==''||this.value3==null?'':this.newgetData(this.value3[1]),

            };
            this.$api.confinementRoom.productInfo(data).then(res => {
                this.tableData = res.rows;
                setTimeout(()=>{
                    export_table_to_excel('#out-table', '商品')
                })
                
                
                // this.total = res.total;
            })
            }
        },
        newdelete(id){
            this.$confirm('确认删除产品信息，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.confinementRoom.editProductInfoShelfdel(id).then(res => {
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.search();
          })
  
        }).catch(() => {

        });
        },
        projecttype(e) {
            let num = '';
            this.newoptionsl.forEach(value => {
                if (value.value == e) {
                    num = value.label
                }
            })
            return num
        },
        upload() {
            if (this.selectdatas.length == 0) {
                this.$message.warning(`请选择要${this.upflag==true?"下":"上"}架的数据`);
                return;
            }
            if(this.upflag){
                this.selectdatas.forEach(value=>{
                    value.shelfFlag=1
                })
            }else{
                this.selectdatas.forEach(value=>{
                    value.shelfFlag=0
                })

            }
            this.$api.confinementRoom.editProductInfoShelf(this.selectdatas).then(res => {
                if (res) {
                    this.$message.success('下架成功');
                    this.search();
                }
            })

        },
        handleSelectionChange(e) {
            this.selectdatas = e;
            // this.search();
        },
        handleSizeChange(e) {
            this.pageSize=e;
            this.search();
        },
        handleCurrentChange(e) {
            this.pageNum=e
            this.search();
        },
        newgetData(value) {
            let DateObj = new Date(value)
            // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
            let year = DateObj.getFullYear()
            let month = DateObj.getMonth() + 1
            let day = DateObj.getDate()
            let hh = DateObj.getHours()
            let mm = DateObj.getMinutes()
            let ss = DateObj.getSeconds()
            month = month > 9 ? month : '0' + month
            day = day > 9 ? day : '0' + day
            if (hh >= 0 && hh <= 9) {
                hh = "0" + hh;
            }
            if (mm >= 0 && mm <= 9) {
                mm = "0" + mm;
            }
            if (ss >= 0 && ss <= 9) {
                ss = "0" + ss;
            }
            // 最终时间
            return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
        },
        search() {
            if(this.Index==0){
            this.upflag=true
            }else{
                this.upflag=false
            }
            let data = {
                categoryId: this.value2,
                shelfFlag: this.Index,
                payType: this.Indexs,
                shelfTime:this.value3==''||this.value3==null?'':this.newgetData(this.value3[0]),
                endShelfTime:this.value3==''||this.value3==null?'':this.newgetData(this.value3[1]),
                pageNum:this.pageNum,
                pageSize:this.pageSize,
                deptId:this.deptId

            };
            this.$api.confinementRoom.productInfo(data).then(res => {
                this.tableData = res.rows;
                this.total = res.total;
            })

        },
        add() {
            this.$router.push('/addserver');
            localStorage.setItem('ifshowtalFlag',false)
        },
        addlist(indexs, index) {

            this.alllist[index].value.forEach(value => {
                value.back = '';
                value.color = ''
            })
            if(this.alllist[index].value[0].name=='付款方式'){
                this.Indexs=this.alllist[index].value[indexs].indexs;
            }else{
                this.Index =this.alllist[index].value[indexs].index;
            }
        
            this.alllist[index].value[indexs].back = '#1abc9c';
            this.alllist[index].value[indexs].color = '#fff';

        },
    },
    data() {
        return {
            currentPage4: 1,
            upflag:true,
            pageNum:1,
            pageSize:20,
            newoptionsl: [],
            selectdatas: [],
            pageSize: 20,
            pageNum: 1,
            value1: false,
            total: 0,
            Index: 0,
            Indexs: '',
            value: "0",
            value2: "",
            value3: '',
            name: "",
            showflag: false,
            tableData: [],
            alllist: [
                {
                    value: [{ name: '商品状态', border: false }, { name: '已上架', border: true, back: "#1abc9c", color: "#fff", index: 0, }, { name: '已下架', border: true, back: "", color: "", index: 1, }],
                },
                {
                    value: [{ name: '付款方式', border: false }, { name: '不限', border: true, back: "#1abc9c", color: "#fff",indexs:""}, { name: '全款', border: true, back: "", color: "",indexs:0}, { name: '预约金尾款', border: true, back: "", color: "",indexs:1 }],
                }
            ],
            newoptions: [
                {
                    value: "0",
                    label: '嫩肤美白'
                },
                {
                    value: "1",
                    label: '脱毛'
                },
                {
                    value: "2",
                    label: '除皱'
                },
                {
                    value: "3",
                    label: '注射塑性'
                },
                {
                    value: "4",
                    label: '眼部整形'
                }
            ],
            options: [
                {
                    value: "0",
                    label: '上架时间'
                },
                {
                    value: "1",
                    label: '下架时间'
                }
            ]
        }
    }
}
</script>
<style scoped>
* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}

.ORDER_CHILDREN {
    margin-top: 10px;
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    min-height: 40px;
    align-items: center;
}

.ORDER_CHILDREN .order-children {
    width: 130px;
    min-height: 40px;
    display: flex;
    align-items: center;
}

::v-deep .el-table__row td {
    padding: 3px;
}

.pagation {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid black; */
}

::v-deep .el-pager li.active {
    background-color: rgb(26, 188, 156) !important;
    color: #fff;
}

.Left {
    margin-left: 15px;
}

.table {
    width: 100%;
    position: relative;
    /* border: 1px solid black; */
    /* height: 100%;
  position: fixed; */
}

.physical_table {
    width: 100%;
    height: 710px;
    /* border: 1px solid black; */
    overflow: hidden;

}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    height: 12px;
    z-index: 999999;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px;
    height: 20px;
    background: #dcdcdc;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px #999; */
    background: transparent;
    /* border-radius: 2px; */
}

.order_children {
    width: 80px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    cursor: pointer;
    border-radius: 4px;
}

.physical {
    width: 100%;
    min-height: 40px;
    /* height: 200px; */
    background-color: #fff;
    overflow: hidden;
}

.physical_top {
    width: 100%;
    height: 50px;
    border: 1px solid red
}</style>