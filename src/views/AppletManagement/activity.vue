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
                    @size-change="sizeChange" @current-change="currentChange" :row-class-name="className">
                    <template #custom="data">
                        <div v-if="data.props === 'disTarget'">
                            <!-- <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" /> -->
                            {{ data.custom.disTarget == '1' ? '新客' : "老客" }}
                        </div>
                        <div v-if="data.props === 'disContentType'">
                            <!-- <show-dict-data :options="dict.type.billing_type" :value="data.custom.billType" /> -->
                            {{ data.custom.disContentType == '0' ? '优惠券类型' : "商品类型" }}
                        </div>
                      <div v-if="data.props === 'showFlag'">
                        <el-switch
                          v-model="data.custom.showFlag"
                          active-color="#13ce66"
                          active-value="1" inactive-value="0"
                          inactive-color="#ff4949" @change="changeswitch(data.custom)">
                        </el-switch>
                      </div>
                      <div v-if="data.props === 'disFormType'">
<!--                        <el-tag v-for="posts in dict.type.banner_type" :key="posts.value" style="margin: 0 4px" size="mini">{{-->
<!--                            posts.label }}</el-tag>-->
                        <show-dict-data :options="dict.type.banner_type" :value="data.custom.disFormType" />

                      </div>
                        <div v-if="data.props === 'edit'">
                            <el-button size="mini" type="text" style="color: #E6A23C"
                                @click.stop="addDialogs(data.custom)">修改
                            </el-button>
                            <el-button size="mini" type="text" style="color: red"
                                @click.stop="removeaddDialogs(data.custom)">删除
                            </el-button>
                        </div>
                    </template>

                    <div slot="header" class="header"
                        style="width: 100%;display: flex;align-items: center;justify-content: space-between;">
                        <div>
                          <span style="font-size: 14px"><i class="el-icon-s-fold" /> 列表清单</span>
                          <span><i style="background-color:#f9baba" />活动结束</span>
                        </div>
                        <el-button v-hasPermi="['sysManger:dept:Handmade']" size="mini" type="primary" plain
                            icon="el-icon-plus" class="headerBarBtn" @click.stop.native="openManualDialog">新增活动banner
                        </el-button>
                    </div>
                </sg-table>
            </slot>
        </slideSearch>

        <!--新增-->
        <sgDialog :title="newtitle" :dialog="dialogVisible" size="600px" @handleClose="cancles" v-if="dialogVisible">
            <div slot="out">
                <div class="activity">
                    <span><span style="color: red;">*</span> 活动banner:</span>
                    <div class="Left" style="margin-left: 50px;">
                        <upload @successFile="successFile" :fileList="fileList" :limit="1"></upload>
                    </div>
                </div>
                <div style="height: 30px;margin-top: 30px;display: flex;align-items: center;">
                    <span style="margin-left: 30px;">banner类型：</span>
                    <div style="margin-left: 40px;">
                        <el-radio v-model="radio" label="2">弹屏广告</el-radio>
                        <el-radio v-model="radio" label="1">首页图</el-radio>
                    </div>
                </div>
              <div style="color: red;margin-left: 160px">首页图建议尺寸：350*100 弹屏广告建议尺寸：200*200</div>
<!--                <div style="height: 30px;margin-top: 30px;display: flex;align-items: center;">-->
<!--                    <span style="margin-left: 30px;">是否显示：</span>-->
<!--                    <div style="margin-left: 60px;">-->
<!--                        <el-radio v-model="radios" label="0">不显示</el-radio>-->
<!--                        <el-radio v-model="radios" label="1">显示</el-radio>-->
<!--                    </div>-->
<!--                </div>-->
                <div style="height: 30px;margin-top: 30px;display: flex;align-items: center;">
                    <span style="margin-left: 20px;"><span style="color: red;">*</span>发放对象：</span>
                    <div style="margin-left: 60px;">
                        <el-select v-model="value" placeholder="请选择" size="mini" style="width: 350px;" clearable>
                            <el-option v-for="item in newoptions" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div style="height: 30px;margin-top: 10px;display: flex;align-items: center;">
                    <span style="margin-left: 20px;"><span style="color: red;">*</span>公司：</span>
                    <div style="margin-left: 88px;">
                        <el-select v-model="valuenes" placeholder="请选择" size="mini" style="width: 350px;" clearable>
                            <el-option v-for="item in deptList" :key="item.value" :label="item.deptName"
                                :value="item.deptId">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="activity_time">
                    <span><span style="color:red">*</span> 活动时间:</span>
                    <div class="Left" style="margin-left: 68px;">
                        <el-date-picker v-model="value1" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                            format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至"
                            :picker-options="pickerOptions"
                            start-placeholder="开始日期" end-placeholder="结束日期" size="mini" clearable style="width: 350px;">
                        </el-date-picker>
                    </div>
                </div>
                <div style="height: 30px;display: flex;align-items: center;">
                    <span style="margin-left: 17px;"><span style="color: red;">*</span> 发放类型：</span>
                    <div style="margin-left: 60px;">
                        <el-select v-model="newvalue" placeholder="请选择" size="mini" style="width: 350px;" clearable
                            @change="changefile">
                            <el-option v-for="item in newoptionsl" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="activity_time">
                    <span v-if="newvalue == '1'"><span style="color:red;">*</span>商品物链接地址:</span>
                    <span v-else><span style="color:red;">*</span>优惠券链接地址:</span>
                    <div class="Left" style="margin-left: 30px;">
                        <el-input size="mini" style="width: 350px;" v-model="disContent"></el-input>
                    </div>
                </div>
                <div style="height: 50px;"></div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
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
import { todayTime,shortcuts } from "@/utils/time";
import moment from "moment/moment";
import upload from '@/components/newUpload'
const serverPath = process.env.VUE_APP_BASE_API+'/file'
export default {
    name: "CashierInformation.vue",
    components: { SgTable, sgDialog, slideSearch, upload },
    dicts: ['billing_type','banner_type'],
    data() {
        return {
            path: "",
            deptList: [],
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
            newvalue: '0',
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
                    value: "1",
                    label: "新客"
                },
                {
                    value: "2",
                    label: "老客"
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
                    lab: '发放对象',
                    val: 'disTarget',
                    custom: 'disTarget'
                },
                {
                    lab: '发放内容类型',
                    val: 'disContentType',
                    custom: 'disContentType',
                },
                {
                    lab: '公司名称',
                    val: 'deptName',
                },
              {
                lab: '是否显示',
                val: 'showFlag',
                custom: 'showFlag'
              },
              {
                lab: 'banner类型',
                val:'disFormType',
                custom: 'disFormType'
              },
                {
                    lab: '发放地址',
                    val: 'disContent',
                    width: 380,
                },
                {
                    lab: '活动开始时间',
                    val: 'startTime'
                },
                {
                    lab: '活动结束时间',
                    val: 'endTime'
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
              timeType: {
                type: 'select',
                label: '时间类型:',
                clearable: true,
                options: [
                  {value:0,label:"活动开始时间"},
                  {value:1,label:"活动结束时间"},
                  {value:2,label:"创建时间"},
                ],
                values:0
              },
                startTime: {
                    type: 'Tdatetime',
                    label: '活动时间',
                    clearable: true,
                    values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
                },
                disTarget: {
                    type: 'select',
                    label: '发放对象:',
                    clearable: true,
                    options: []
                },
                disContentType: {
                    type: 'select',
                    label: '发放内容类型:',
                    clearable: true,
                    options: []
                },
              showFlag: {
                type: 'select',
                label: '是否显示:',
                clearable: true,
                options: [
                  {value:0,label:"不显示"},
                  {value:1,label:"显示"},
                ]
              },
              deptId: {
                type: 'select',
                label: '公司名称:',
                clearable: true,
                options: []
              },
            },
            billtypeDate: [],
            chargeId: '',
          pickerOptions: {
            shortcuts: shortcuts()
          },
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
        this.options.disTarget.options = this.newoptions;
        this.options.disContentType.options = this.newoptionsl;
        this.$api.modules.coupon.couponInfoList({ deptId: this.deptId }).then(res => {
            if (res.code == 200) {
                res.rows.forEach(value => {
                    value.label = `/page_subject/pages/shop/index?id=${value.couponId}(${value.couponName})`
                    value.value = `/page_subject/pages/shop/index?id=${value.couponId}(${value.couponName})`
                })
                this.tableDatayhq = res.rows
            }
        })
        this.$api.confinementRoom.productInfo({ deptId: this.deptId }).then(res => {
            res.rows.forEach(value => {
                value.label = `/page_subject/pages/shopdetail/index?id=${value.productId}(${value.projectName})`
                value.value = `/page_subject/pages/shopdetail/index?id=${value.productId}(${value.projectName})`
            })
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
                      this.deptList.forEach(value=>{
                        value.label=value.deptName;
                        value.value=value.deptId
                      })
                      this.options.deptId.options=this.deptList
                    }
                })

            }
            this.valuenes = this.deptId
        })

    },
    methods: {
      className({row, column, rowIndex, columnIndex}){
        const timestamp = Date.parse(new Date());
        const timeStamp1 = Date.parse(row.endTime)
        if (timestamp > timeStamp1){
          return 'classNames'
        }else {
          return ''
        }
        // if (columnIndex==2 || columnIndex==1){
        //   return 'className1'
        // }
      },
      // 是否显示开关
      changeswitch(row){
        let data = {
          deptId: row.deptId,
          showFlag: row.showFlag== '0' ? '0' : '1',
          dmId:row.dmId
        }
          this.$api.confinementRoom.disManageListedit(data).then(res => {
            if (res.code == 200) {
              this.$message.success('修改成功')
              this.search();
              this.fileList = [];
            }
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
                this.$api.confinementRoom.disManageListremove(data.dmId).then(res => {
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
            // data.deptId = this.deptId;
            let datas = data.endstartTime
            delete data.endstartTime
            data.endTime = datas
          const query={
              params:{
                startTime:data.startTime,
                endTime:data.endTime,
                timeType:data.timeType
              },
            disContentType:data.disContentType,
            disTarget:data.disTarget,
            showFlag:data.showFlag,
            deptId:data.deptId
          }
            this.$api.confinementRoom.listactivity(query).then(res => {
                this.tableData = res.rows;
                this.pagination.total = res.total
            })
        },
        oks() {
            if (this.imgurl == '') {
                this.$message.warning("请上传活动banner");
                return;
            }
            if (this.value1 == '' || this.value1 == null) {
                this.$message.warning("请选择活动时间");
                return;
            }
            if (this.value == '' || this.value == null) {
                this.$message.warning("请选择发放对象");
                return;
            }
            if (this.valuenes == '' || this.valuenes == null) {
                this.$message.warning("请选择公司");
                return;
            }
            if (this.newvalue == '' || this.newvalue == null) {
                this.$message.warning("请选择发放类型");
                return;
            }

            let flag = false
            let newflag = false
            if (this.newvalue == '0') {
                if (this.disContent == '' || this.disContent == null) {
                    flag = true
                }
            } else {
                if (this.disContent == '' || this.disContent == null) {
                    newflag = true
                }
            }
            if (flag) {
                this.$message.warning("请输入优惠券跳转地址");
                return;
            }
            if (newflag) {
                this.$message.warning("请输入商品跳转地址");
                return;
            }
            let data = {
                disFormType: this.radio,
                disPicture: this.imgurl,
                disTarget: this.value,
                startTime: this.value1[0],
                endTime: this.value1[1],
                disContentType: this.newvalue,
                disContent: this.disContent,
                deptId: this.valuenes,
                // showFlag: this.radios,
            }
            if (this.newtitle == '编辑') {
                data.dmId = this.dmId
                this.$api.confinementRoom.disManageListedit(data).then(res => {
                    if (res.code == 200) {
                        this.$message.success('修改成功')
                        this.dialogVisible = false;
                        this.search();
                        this.fileList = [];
                    }
                })
            } else {
                this.$api.confinementRoom.disManageList(data).then(res => {
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
            this.disContent = '';
            this.valuenes = this.deptId;
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
            console.log(val, 'dsahdsadsad')
            this.fileList.push({
                name: "活动",
                url: serverPath + val.disPicture
            })
            this.dialogVisible = true;
            this.newtitle = '编辑';
            this.radio = val.disFormType;
            this.value = val.disTarget;
            this.value1[0] = val.startTime
            this.value1[1] = val.endTime;
            this.newvalue = val.disContentType;
            this.radios = val.showFlag;
            this.disContent = val.disContent;
            this.valuenes = val.deptId;
            this.imgurl = val.disPicture;
            this.dmId = val.dmId
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
::v-deep .el-table .classNames{
  background: #f9baba;
}
.header span i {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 5px;
  margin-left: 10px;
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