<template>
    <div>
        <slideSearch :options="options">
            <div slot="btnBar">
                <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="search()">查询
                </el-button>
            </div>
            <slot>
                <sg-table ref="table" :sg-ref="'multipleTable'" size="mini" index="序号" border :pagination="pagination"
                    highlight-current-row :table-data="tableData" :columns="columns" :hideSearchBar="true"
                    @size-change="sizeChange" @current-change="currentChange">
                    <template #custom="data">
                        <div v-if="data.props === 'showFlag'">
                            <!-- <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" /> -->
<!--                            {{ data.custom.showFlag == '0' ? '否' : "是" }}-->
                          <el-switch
                            v-model="data.custom.showFlag"
                            active-color="#13ce66"
                            active-value="1" inactive-value="0"
                            inactive-color="#ff4949" @change="changeswitch(data.custom)">
                          </el-switch>
                        </div>
                        <div v-if="data.props === 'shelfFlag'">
                            {{ data.custom.shelfFlag=='0'?'上架':'下架' }}
                            </div>
                        
                        <div v-if="data.props === 'edit'">
                            <el-button size="mini" type="text" style="color: #E6A23C"
                                @click.stop="addDialogs(data.custom)">修改
                            </el-button>
                            <el-button size="mini" type="text" style="color: red"
                                @click.stop="removeaddDialogs(data.custom)">删除
                            </el-button>
                        </div>
                      <div v-if="data.props === 'orderDisplay'">
                        <el-input size="mini" v-model="data.custom.orderDisplay" @blur="blur(data.custom)" style="width: 50px"/>
                      </div>
                    </template>

                    <div slot="header"
                        style="width: 100%;display: flex;align-items: center;justify-content: space-between;">
                        <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
                        <el-button v-hasPermi="['sysManger:dept:Handmade']" size="mini" type="primary" plain
                            icon="el-icon-plus" class="headerBarBtn" @click.stop.native="openManualDialog">新增显示商品
                        </el-button>
                    </div>
                </sg-table>
            </slot>
        </slideSearch>

        <!--新增-->
        <sgDialog :title="newtitle" :dialog="dialogVisible" size="360px" @handleClose="cancles" v-if="dialogVisible">
            <div slot="out">
                <!-- <div class="activity">
                    <span><span style="color: red;">*</span> 活动banner:</span>
                    <div class="Left" style="margin-left: 50px;">
                        <upload @successFile="successFile" :fileList="fileList"></upload>
                    </div>
                </div> -->
                <!-- <div style="height: 30px;margin-top: 30px;display: flex;align-items: center;">
                    <span style="margin-left: 30px;">banner类型：</span>
                    <div style="margin-left: 40px;">
                        <el-radio v-model="radio" label="2">弹屏广告</el-radio>
                        <el-radio v-model="radio" label="1">首页图</el-radio>
                    </div>
                </div> -->
                <!-- <div style="height: 30px;margin-top: 30px;display: flex;align-items: center;">
                    <span style="margin-left: 20px;"><span style="color: red;">*</span>发放对象：</span>
                    <div style="margin-left: 60px;">
                        <el-select v-model="value" placeholder="请选择" size="mini" style="width: 350px;" clearable>
                            <el-option v-for="item in newoptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div> -->
                <div style="height: 30px;margin-top: 10px;display: flex;align-items: center;">
                    <span style="margin-left: 20px;"><span style="color: red;">*</span>公司：</span>
                    <div style="margin-left: 48px;">
                        <el-select v-model="valuenes" placeholder="请选择" size="mini" style="width: 200px;" clearable @change="changeselect">
                            <el-option v-for="item in deptList" :key="item.value" :label="item.deptName"
                                :value="item.deptId">
                            </el-option>
                        </el-select>
                    </div>
                </div>
<!--                <div style="height: 30px;margin-top: 10px;display: flex;align-items: center;">-->
<!--                    <span style="margin-left: 20px;"><span style="color: red;">*</span>显示顺序：</span>-->
<!--                    <div style="margin-left: 20px;">-->
<!--                        <el-input size="mini" style="width: 200px;" v-model="orderDisplay"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
                <!-- <div class="activity_time">
                    <span><span style="color:red">*</span> 活动时间:</span>
                    <div class="Left" style="margin-left: 68px;">
                        <el-date-picker v-model="value1" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                            format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" size="mini" clearable style="width: 350px;">
                        </el-date-picker>
                    </div>
                </div> -->
                <div style="height: 30px;display: flex;align-items: center;margin-top: 10px;">
                    <span style="margin-left: 17px;"><span style="color: red;">*</span> 商品编号：</span>
                    <div style="margin-left: 20px;">
                        <el-select v-model="newvalue" placeholder="请选择" size="mini" style="width: 200px;" clearable
                            @change="changefile">
                            <el-option v-for="item in tableDatashop" :key="item.value" :label="item.projectName"
                                :value="item.productId">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <!-- <div class="activity_time">
                    <span v-if="newvalue == '1'"><span style="color:red;">*</span>商品物链接地址:</span>
                    <span v-else><span style="color:red;">*</span>优惠券链接地址:</span>
                    <div class="Left" style="margin-left: 30px;">
                        <el-input size="mini" style="width: 350px;" v-model="disContent"></el-input>
                    </div>
                </div> -->
                <div style="height: 50px;"></div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: right;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="oks">确定</el-button>
                        <el-button @click="cancle" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sgDialog>
    </div>
</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import slideSearch from '@/components/SlideSearchBar/index'
import { todayTime } from "@/utils/time";
import moment from "moment/moment";
import upload from '@/components/newUpload'
const serverPath = process.env.VUE_APP_BASE_API+'/file'
export default {
    name: "CashierInformation.vue",
    components: { SgTable, sgDialog, slideSearch, upload },
    dicts: ['billing_type'],
    data() {
        return {
            path: "",
            hpdId:"",
            deptList: [],
            orderDisplay:0,
            valuenes: "",
            disContent: "",
            imgurl: "",
            radios: '0',
            tableDatayhq: [],
            tableDatashop: [],
            lnewvalue: "",
            newvalues: "",
            radio: '2',
            value: "1",
            newvalue: '',
            newoptionsl: [
                {
                    value: "0",
                    label: "优惠券类型"
                },
                {
                    value: "1",
                    label: "商品类型"
                }
            ],
            newoptions: [
                {
                    value: "0",
                    label: "否"
                },
                {
                    value: "1",
                    label: "是"
                },

            ],
            shopPath: "",
            newtitle: "新增",
            value1: todayTime(),
            pagination: {
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true,
                currentPage: 1
            },
            tableData: [],
            columns: [
              {
                lab: '权重',
                val:'orderDisplay',
                custom: 'orderDisplay'
              },
                {
                    lab: '公司名称',
                    val: 'deptName',
                },
                {
                    lab: '项目名称',
                    val: 'projectName',
                },
                {
                    lab: '上/下架',
                    val: 'shelfFlag',
                    custom:'shelfFlag',
                },
                
                // {
                //     lab: '显示顺序',
                //     val: 'orderDisplay',
                // },
                {
                    lab: '是否展示',
                    val: 'showFlag',
                   custom:'showFlag'
                },
                {
                    lab: '创建时间',
                    val: 'createTime'
                },


                // {
                //     lab: '赠送',
                //     val: 'giveMoney',
                // },
                // {
                //     lab: '科室',
                //     val: 'departmentName'
                // },
                // {
                //     lab: '支付金额',
                //     val: 'paymentAmount',
                // },
                // {
                //     lab: '收费渠道',
                //     val: 'payName',
                // },
                // {
                //     lab: '结账时间',
                //     val: 'createTime',
                // },
                {
                    lab: '操作',
                    val: 'edit',
                    custom: 'edit'
                }
            ],
            orderNumber: '',
            fileList: [],
            dialogVisible: false,
            xFlag: '',
            submitLoading: false,
            formList: {},
            rules: {

            },
            options: {
                showFlag: {
                    type: 'select',
                    label: '是否显示:',
                    clearable: true,
                    options: []
                },
                deptId: {
                    type: 'select',
                    label: '公司名称:',
                    clearable: true,
                    options: []
                },
            },
            billtypeDate: [],
            chargeId: ''
        }
    },
    computed: {
        deptId: {
            get() {
                return this.$store.getters.departmentId
            },
            set(val) {
                val = this.$store.getters.departmentId
            }
        }
    },
    watch: {
        deptId(val) {
            this.deptId = val
            this.search();
        },
        radio(newV) {
            if (this.newtitle == '新增') {
                if (newV == '1') {
                    document.querySelector('.el-upload--picture-card').style.width = '375px';
                } else {
                    document.querySelector('.el-upload--picture-card').style.width = '146px';
                }
            } else {
                if (newV == '1') {
                    setTimeout(()=>{
                        document.querySelector('.el-upload-list__item').style.width = '375px'
                    },200)
                } else {
                    setTimeout(()=>{
                        document.querySelector('.el-upload-list__item').style.width = '146px'
                    },200)
                }
            }

        }
    },
    created() {
        // this.getList();
        this.search();
        this.options.showFlag.options=this.newoptions
        // this.options.disTarget.options = this.newoptions;
        // this.options.disContentType.options = this.newoptionsl;
        this.valuenes=this.deptId
        this.$api.confinementRoom.productInfo({ deptId: this.deptId,shelfFlag:'0' }).then(res => {
            this.tableDatashop = res.rows;
        })
        this.$api.dept.deptList({ status: '0' }, 'get').then(res => {
            if (res) {
                res.data.forEach(item => {
                    let list = []
                    list = item.ancestors.split(',')
                    item.list = list
                    if (list.length == 4) {
                        item.ancestorsId = Number(list[item.list.length - 1])
                        this.tableData.forEach(val => {
                            if (val.deptId == item.deptId) {
                                item.disabled = true
                            } else {
                                item.false = false
                            }
                        })
                        this.deptList.push(item)
                    }
                })

            }
            this.deptList.forEach(value=>{
             value.label=value.deptName;
             value.value=value.deptId
            })
            this.options.deptId.options=this.deptList
            this.valuenes = this.deptId
        })
    },
    methods: {
      // 权重修改
      blur(val){
        const query={
          orderDisplay: val.orderDisplay,//排序
          hpdId:val.hpdId
        }
        this.$api.confinementRoom.homeProductDisplayedit(query).then(res => {
          if (res) {
            if (res.code == 200) {
              this.$message.success('修改权重成功');
              this.search();
            }
          }
        })

      },
      // 是否显示开关
      changeswitch(row){
        let data = {
          deptId: row.deptId,
          showFlag: row.showFlag== '0' ? '0' : '1',
          hpdId:row.hpdId
        }
        this.$api.confinementRoom.homeProductDisplayedit(data).then(res => {
          if (res.code == 200) {
            this.$message.success('修改成功')
            this.search();
            this.fileList = [];
          }
        })
      },
        changeselect(e){
            this.$api.confinementRoom.productInfo({ deptId: e }).then(res => {
            this.tableDatashop = res.rows;
            this.newvalue=''
        })
        },
        cancles() {
            this.dialogVisible = false;
            this.fileList = [];
        },
        cancle() {
            this.dialogVisible = false;
            this.fileList = [];
        },
        changefile(e) {
            if (e == '0') {
                this.lnewvalue = '';

            } else {
                this.newvalues = '';
            }
        },
        removeaddDialogs(data) {
            this.$confirm('确认删除吗，是否继续？', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then((res) => {
                this.$api.confinementRoom.disManageListremoves(data.hpdId).then(res => {
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }
                    this.search()
                })
            }).catch((res) => {

            });
        },

        search() {
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
            this.$api.confinementRoom.homeProductDisplaylist(data).then(res => {
                this.tableData = res.rows;
                this.pagination.total = res.total
            })
        },
        oks() {
            let data = {
                // showFlag:this.radios,
                deptId:this.valuenes,
                // orderDisplay:this.orderDisplay,
                productId:this.newvalue
            }
            if (this.newtitle == '编辑') {
                data.hpdId = this.hpdId
                this.$api.confinementRoom.homeProductDisplayedit(data).then(res => {
                    if (res.code == 200) {
                        this.$message.success('修改成功')
                        this.dialogVisible = false;
                        this.search();
                        this.fileList = [];
                    }
                })
            } else {
                this.$api.confinementRoom.homeProductDisplay(data).then(res => {
                    if (res.code == 200) {
                        this.$message.success('提交成功')
                        this.dialogVisible = false;
                        this.search();
                    }
                })
            }

        },
        successFile(e) {
            this.imgurl = e.url;
            let that = this;
            if (that.radio == '1') {
                document.querySelector('.el-upload-list__item').style.width = '375px'
            } else {
                document.querySelector('.el-upload-list__item').style.width = '146px'
            }

        },
        openManualDialog() {
            this.dialogVisible = true;
            this.newtitle = '新增';
            this.valuenes = this.deptId;
            this.radios='0'
        },
        getPayment(val) {
            const query = {
                billType: val,

            }
            this.$api.modules.finance.payDeptChannelRecord(query).then(res => {
                if (res) {
                    this.billtypeDate = res.rows
                }
            })
        },
        getList(isSearch) {
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
            /**
             * @author Nevin
             * @date 2022/8/12
             * @Description: 如果点击搜索按钮，将页码设为1
             */
            if (isSearch) {
                this.pagination.pageNum = 1
                this.pagination.currentPage = 1
            }
            const query = {
                ...this.pagination,
                deptId: this.deptId,
                ...data,
            }
            this.$api.billingList.chargeRecordInfoList(query).then(res => {
                if (res.code == 200) {
                    this.tableData = res.rows
                    this.pagination.total = res.total
                }
            })
        },
        addDialogs(val) {
            this.fileList.push({
                name: "活动",
                url: serverPath + val.disPicture
            })
            this.dialogVisible = true;
            this.newtitle = '编辑';
            this.radios=val.showFlag;
            this.valuenes=val.deptId;
            // this.orderDisplay=val.orderDisplay
            this.newvalue=val.productId;
            this.hpdId=val.hpdId
        },
        submit() {
            const query = {
                paymentChannel: this.formList.payId,
                chargeId: this.chargeId
            }
            this.$api.billingList.chargeRecordInfoEdit(query).then(res => {
                if (res) {
                    this.getList()
                    this.$message.success(res.msg)
                    this.dialogVisible = false
                }
            })
        },
        handleClose() {
            this.dialogVisible = false
        },
        // 分页组件的方法
        currentChange(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.getList()
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.getList()
        },

    }
}
</script>

<style scoped>
* {
    font-size: 14px;
}

.Left:nth-of-type(1) {
    margin-left: 50px;
}

.activity_time {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 20px;
}

.activity {
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    margin-top: 10px;
}
</style>

<!-- <template>
    <div style="overflow: hidden;">
        <div style="position: absolute;right: 20px;top:0px;background-color: #fff;height: 50px;">
            <el-button v-has-permi="['client:companyLabel:add']" type="primary" size="mini"
                style="position: absolute;right:120px;top:145px;z-index:1000" @click="submit" :loading="submitcompant">
                提交
            </el-button>
            <el-button type="primary" size="mini" style="position: absolute;right:50px;top:145px;z-index: 1000;"
                @click="submitback">
                返回
            </el-button>
        </div>
        <div class="activity">
            <span><span style="color: red;">*</span> 活动banner:</span>
            <div class="Left" style="margin-left: 50px;">
                <upload @successFile="successFile"></upload>
            </div>
        </div>
        <div class="activity_time">
            <span><span style="color:red">*</span> 活动时间:</span>
            <div class="Left" style="margin-left: 70px;">
                <el-date-picker v-model="value1" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                    format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" size="mini" clearable>
                </el-date-picker>
            </div>
        </div>
        <div class="activity_time">
            <span><span style="color:red;visibility: hidden;">*</span>商品链接地址:</span>
            <div class="Left" style="margin-left: 45px;">
                <el-input size="mini" style="width: 350px;" v-model="shopPath"
                    placeholder="/page_subject/pages/shopdetail/index?id=32" clearable></el-input>
            </div>
        </div>
        <div class="activity_time">
            <span><span style="color:red;visibility: hidden;">*</span>优惠券链接地址:</span>
            <div class="Left" style="margin-left: 30px;">
                <el-input size="mini" style="width: 350px;" v-model="path"
                    placeholder="/page_subject/pages/shopdetail/index?id=32" clearable></el-input>
            </div>
        </div>
    </div>
</template>
<script>
import upload from '@/components/newUpload'
import vm from '@/utils/util'
import { monthData, todayTime } from '@/utils/time'
const serverPath = process.env.VUE_APP_BASE_APIS
export default {
    components: {
        upload
    },
    methods: {
        successFile(e) {
            this.imgurl = e.url
        },
        submit() {
            if (this.imgurl == '') {
                this.$message.warning("请上传活动banner");
                return;
            }
            if (this.value1 == '' || this.value1 == null) {
                this.$message.warning("请选择活动时间");
                return;
            }
            let data = {
                createTime: "",
                endCreateTime: "",
                path: "",
                imgurl: "",
                shopPath: "",
            }
            if (this.ifEdit) {
                this.$api.confinementRoom.activityedit(data).then(res => {
                    if (res.code == 200) {
                        this.$message.success('修改成功')
                        vm.$emit('closeTag', this.$route.path);

                    }
                })
            } else {
                this.$api.confinementRoom.activity(data).then(res => {
                if (res.code == 200) {
                    this.$message.success('提交成功')
                    vm.$emit('closeTag', this.$route.path);

                }
            })


            } 
        },
        submitback() {
            vm.$emit('closeTag', this.$route.path);
        }
    },
    data() {
        return {
            filelist: [],
            value1: "",
            path: '',
            shopPath: "",
            submitcompant: false,
            value1: todayTime(),
            imgurl:"",
        }
    }
}
</script>

<style scoped >
* {
    font-size: 14px;
}

.Left:nth-of-type(1) {
    margin-left: 50px;
}

.activity_time {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 20px;
}

.activity {
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    margin-top: 10px;
}
</style> -->