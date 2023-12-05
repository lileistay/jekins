<template>
    <div>
        <div class="table">
            <el-table :data="tableData" :height="height" border class="tables">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="dividendTypeName" label="分成级别" width="130" align="center"></el-table-column>
                <el-table-column prop="customerName" label="客户姓名" width="100" align="center"></el-table-column>
                <el-table-column prop="customPhone" label="客户电话" width="100" align="center"></el-table-column>
                <el-table-column prop="customSex" label="客户性别" width="200" align="center">

                     <template slot-scope="scope">
                          <div>{{ scope.row.customSex=='0'?'男':scope.row.customSex=='1'?'女':'未知' }}</div>
                     </template>
                </el-table-column>
                <el-table-column prop="customAge" label="客户年龄" width="100" align="center"></el-table-column>
                <el-table-column prop="customerStatus" label="客户状态" width="200" align="center">
                    <template slot-scope="scope">
                          <div>{{ scope.row.customSex=='1'?'新客':'老客' }}</div>
                     </template>
                </el-table-column>
                <el-table-column prop="acName" label="美学顾问" width="200" align="center"></el-table-column>
                <el-table-column prop="crName" label="客户代表" width="200" align="center"></el-table-column>、
                <el-table-column prop="refereeName" label="上级客户" width="200" align="center"></el-table-column>
                <el-table-column prop="receptionStatus" label="是否成交" width="200" align="center">
                    <template slot-scope="scope">
                          <div>{{ scope.row.receptionStatus=='1'?'未成交':'成交' }}</div>
                     </template>
                </el-table-column>
                <el-table-column prop="receptionTime" label="到院时间" width="200" align="center">
                         <template slot-scope="scope">
                                 <div>
                                    {{ newgetData(scope.row.receptionTime) }}
                                 </div>
                         </template>

                </el-table-column>
                <el-table-column prop="checkoutTime" label="最后消费时间" width="200" align="center">
                    <template slot-scope="scope">
                                 <div>
                                    {{ newgetData(scope.row.checkoutTime) }}
                                 </div>
                         </template>
                </el-table-column>
                <el-table-column prop="earningTotal" label="成交金额" width="200" align="center"></el-table-column>
            </el-table>
            <div class="pagation">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage4" :page-sizes="[20, 30, 40, 50]" :page-size="20"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
            <!-- <div style="position: absolute;bottom: 0;">dsadsad</div> -->
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: [],
            height: '0px',
            currentPage4: 0,
            total:0,
        }
    },
    watch: {
        $route() {
            let id = localStorage.getItem('children_id');
            let data = {
                id,
            }
            this.$api.modules.activityManagement.getSubordinateCustomerList(data).then(res => {
                this.tableData = res.rows;
                this.total=res.total;

            })
        }
    },
    created() {
        console.log(window.innerHeight);
        let id = localStorage.getItem('children_id');
        let data = {
            id,
        }
        this.$api.modules.activityManagement.getSubordinateCustomerList(data).then(res => {
            this.tableData = res.rows;
            this.total=res.total;
        })
        this.$nextTick(function () {
            this.height = document.documentElement.clientHeight - 182 + 'px'
            document.querySelector('.table').style.height = document.documentElement.clientHeight - 132 + 'px'
            document.querySelector('.tables').style.height = document.documentElement.clientHeight - 132 + 'px'
        })
    },
    methods: {
        handleCurrentChange(e) {
            let id = localStorage.getItem('children_id');
            let data = {
            id,
            pageNum:e,
            pageSize:20,
        }
        this.$api.modules.activityManagement.getSubordinateCustomerList(data).then(res => {
            this.tableData = res.rows;
            this.total=res.total;
        })
        },
        handleSizeChange() {

        },
        newgetData(value) {
            if(value==undefined){
                return ''
            }else{
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
            }
           
        },
    }
}
</script>
  
<style scoped lang="scss">
.table {
    width: 100%;
    position: relative;
    /* height: 100%;
    position: fixed; */
}

::v-deep .el-scrollbar {
    width: 100%;
    height: 100%;

    .el-scrollbar__wrap {
        margin-bottom: 0 !important;
        overflow-x: unset;
    }
}

// ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
//   width: 10px;
//   height: 10px;
//   background-color: aqua;
// }
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
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

.pagation {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

::v-deep .el-pager li.active {
    background-color: #409eff !important;
    color: #fff;
}
</style>