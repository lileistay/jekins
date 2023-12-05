<template>
    <div>
        <div>分院信息:
            <el-select v-model="value" filterable placeholder="请选择" size="mini" disabled>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="member_top">
            <div class="member_top_header">
                会员卡卡号：{{ item.customCardNumber
                }}
            </div>
            <div class="member_contain">
                <div class="member">
                    <div style="display: flex;align-items: center;justify-content: center;color: green;margin-top: 5px;"> <img
                            src="@/assets/images/VIP.png" alt=""> {{ item.levelDescription }}</div>
                    <div>年龄：{{ names }} 生日：{{ birthday=='undefined'?'':birthday }}</div>
                </div>
                <div class="member">
                    <div style="color: darksalmon;margin-top: 5px;">{{ item.usablePoints }}</div>
                    <div>可用积分</div>
                </div>
                <div class="member">
                    <div style="color: darksalmon;margin-top: 5px;">{{ item.pointsTotal }}</div>
                    <div>累计积分</div>
                </div>
                <div class="member">
                    <div style="color: darksalmon;margin-top: 5px;">{{ item.consumeTotal }}</div>
                    <div>累计消费金额</div>
                </div>
                <div class="member">
                    <div style="color: cornflowerblue;margin-top: 5px;">0</div>
                    <div>折扣</div>
                </div>
                <div class="member">
                    <div style="color: cornflowerblue;margin-top: 5px;">{{ item.createTime }}</div>
                    <div>注册时间</div>
                </div>
                <div class="member">
                    <div style="color: cornflowerblue;margin-top: 5px;">{{ item.customState == 0 ? '正常' : '销户' }}</div>
                    <div>会员卡状态</div>
                </div>
            </div>
        </div>
        <div class="member_list">
            <div class="member_list_left">
                <div class="integral_jf">
                    <div class="integral" style="margin-bottom: 10px;">积分兑换信息：</div>
                    <div style="width: 100%;">
                    <el-table :data="newlistByGroupNums" :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                        :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                        <el-table-column prop="createTime" label="执行时间" width="120%" align="center">
                        </el-table-column>
                        <el-table-column prop="giftTypeName" label="礼品类型" width="120%" align="center">
                        </el-table-column>
                        <el-table-column prop="giftName" label="礼品名称" width="115%" align="center">
                        </el-table-column>
                        <el-table-column prop="remarks" label="转换类型" width="110%" align="center">
                            <template>
                                礼品兑换
                            </template>
                        </el-table-column>
                        <el-table-column prop="amount" label="礼品数量" width="110%" align="center">
                        </el-table-column>
                        <el-table-column prop="redeemPoints" label="兑换积分" width="110%" align="center">
                        </el-table-column>
                        <el-table-column prop="pointsTotal" label="所用总积分" width="120%" align="center">
                        </el-table-column>
                        <el-table-column prop="createBy" label="执行人" width="120%" align="center">
                        </el-table-column>
                    </el-table>
                </div>
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-pagination @size-change="newhandleSizeChange" @current-change="newhandleCurrentChange"
                            :current-page="currentPage4" :page-sizes="[10, 20, 30, 50]" :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper" :total="conversion">
                        </el-pagination>
                    </div>
                </div>

                <div class="integral_jf">
                    <div class="integral" style="margin-bottom: 10px;">积分消费信息：</div>
                    <el-table :data="newlistByGroupNumlist" :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                        :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                        <el-table-column prop="itemName" label="结账时间" width="115%" align="center">
                        </el-table-column>
                        <el-table-column prop="itemName" label="收费单号" width="115%" align="center">
                        </el-table-column>
                        <el-table-column prop="itemName" label="可用积分" width="115%" align="center">
                        </el-table-column>
                        <el-table-column prop="itemName" label="消费积分" width="115%" align="center">
                        </el-table-column>
                        <el-table-column prop="itemName" label="积分金额比" width="115%" align="center">
                        </el-table-column>
                        <el-table-column prop="itemName" label="结账金额" width="200%" align="center">
                        </el-table-column>
                        <el-table-column prop="itemName" label="执行人" width="150%" align="center">
                        </el-table-column>
                    </el-table>
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="currentPage4" :page-sizes="[10, 20, 30, 50]" :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper" :total="0">
                        </el-pagination>
                    </div>
                </div>
            </div>

            <div class="member_list_right">

                <div class="integral_jf">
                    <div class="integral" style="margin-bottom: 10px;">积分变动信息 <span
                    style="width: 10px;height: 10px;display: inline-block;background-color: #e55451;"></span>减少积分 </div>
                    <el-table :data="newlistByGroupNum" :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                        :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :row-class-name="getColor">
                        <el-table-column prop="createTime" label="积分变动时间" width="200%" align="center">
                        </el-table-column>
                        <el-table-column prop="executorName" label="积分变动相关人员" width="200%" align="center">
                        </el-table-column>
                        <el-table-column prop="remarks" label="积分变动类型" width="200%" align="center">
                        </el-table-column>
                        <el-table-column prop="pointsAdjust" label="积分变动" width="200%" align="center">
                        </el-table-column>
                        <el-table-column prop="remarks" label="积分调整备注" width="120%" align="center">
                        </el-table-column>
                    </el-table>
                    <div style="display: flex;align-items: center;justify-content: center;">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="currentPage4" :page-sizes="[10, 20, 30, 50]" :page-size="10"
                            layout="total, sizes, prev, pager, next, jumper" :total="changetotal">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    watch: {
        member: {
            handler(newV) {

            },

            deep: true
        }
    },
    data() {
        return {
            // newlistByGroupNum: [{ itemName: "1232" }, { itemName: "1232" }, { itemName: "1232" }],
            item: { customCardNumber: "" },
            name: "",
            value: "",
            newlistByGroupNums: [],
            newlistByGroupNum: [],
            options: [],
            newlistByGroupNumlist: [],
            currentPage4: 1,
            conversion: 0,
            page: {
                pageSize: 10,
                pageNum: 1
            },
            newpage: {
                pageSize: 10,
                pageNum: 1
            },
            changetotal: 0,
            id: "",
            names:"",
            birthday:""

        }
    },
    mounted() {


    },
    methods: {
      getColor({row}){
        if (Number(row.pointsAdjust)<0) {
              return 'success-error'
        }
      },
        //积分兑换信息
        exchange(data) {
            this.$api.confinementRoom.listById(data).then(res => {
                this.newlistByGroupNums=res.rows;
                this.conversion = res.total
            })
        },
        //积分变动列表
        IntegralVariation(data) {
            this.$api.confinementRoom.getListByIdChange(data).then(res => {
                this.newlistByGroupNum = res.rows;
                this.changetotal = res.total
                // this.item=res.data
            })
        },
          //积分兑换列表切换
        newhandleSizeChange(val) {
            this.newpage.pageSize = val;
            let data = {
                id: this.id
            }
            let object = Object.assign(data, this.page)
            this.exchange(object)

        },
          //积分兑换列表切换
        newhandleCurrentChange(val) {
            this.newpage.pageNum = val;
            let data = {
                id: this.id
            }
            let object = Object.assign(data, this.page)
            this.exchange(object)
        },
        //积分变动列表切换
        handleCurrentChange(val) {
            this.page.pageNum = val;
            let data = {
                id: this.id
            }
            let object = Object.assign(data, this.page)
            this.IntegralVariation(object)
        },
           //积分变动列表切换
        handleSizeChange(val) {
            this.page.pageSize = val;
            let data = {
                id: this.id
            }
            let object = Object.assign(data, this.page)
            this.IntegralVariation(object)

        },
        //点击发起会员信息请求
        search(ids) {
            this.id = ids
            this.value = document.querySelector('.el-dropdown-link').innerHTML.split('<')[0]
            this.names=document.querySelector('.customerInfo-head').children[2].innerHTML
            this.birthday=localStorage.getItem('birthday')
            this.$api.confinementRoom.getInfoById({ id: ids }).then(res => {
                this.item = res.data
            })
            let data = {
                id: this.id,
            }
            let object = Object.assign(data, this.page)
            let newobject = Object.assign(data, this.newpage)
            this.IntegralVariation(object);
            this.exchange(newobject)




        }
    }

}
</script>
<style scoped>
::v-deep .success-error{
  background-color: #e55451;
}
* {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
}

::v-deep .el-pager li.active {
    background-color: #409eff !important;
    color: #fff;
}

.member_top {
    width: 99%;
    height: 100px;
    /* border: 1px solid black; */
    margin-top: 10px;
}

.member_top_header {
    width: 100%;
    height: 30px;
    line-height: 30px;

}

.member_contain {
    width: 100%;
    height: 30px;
    /* border: 1px solid black; */
    display: flex;
    justify-content: space-around;
}

.member {
    width: 200px;
    height: 50px;
    border: 1px solid #eaeefb;
    text-align: center;
}

.member_list {
    width: 99%;
    min-height: 500px;
    /* border: 1px solid black; */
    display: flex;

}

.member_list_left {
    width: 50%;
    height: 500px;
    /* border: 1px solid red; */

}

.member_list_right {
    width: 50%;
    height: 500px;
    /* border: 1px solid red; */

}

.integral_jf {
    width: 99.5%;
    min-height: 100px;
    /* border: 1px solid red; */
}

.integral {
    width: 100%;
    height: 16px;
    /* border: 1px solid black; */
}
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
  /* box-shadow: inset 0 0 5px #999; */
  background: transparent;
  /* border-radius: 2px; */
}
</style>