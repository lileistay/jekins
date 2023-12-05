<template>
    <div style="overflow: hidden;">
        <div class="Height"></div>
        <!-- <div class="Top">
            <div class="top_children" v-for="(item, index) in list" :key="index">
                <div class="top_children_top">
                    <img :src="item.imgurl" alt="" class="Img">
                </div>
                {{ item.name }}
            </div>
            <span class="Left">顾问：</span>
            <el-select v-model="acName" placeholder="请选择" size="mini" style="width: 120px;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" plain size="mini" icon="el-icon-edit" class="Left">健康登记</el-button>
            <el-button type="success" plain size="mini" icon="el-icon-sell" class="Left">快捷收款</el-button>
            <div class="line"></div>
            <div class="status">
                <div class="status_top">我的工作状态：【会员中心】 </div>
                <div class="Red">未开通快捷支付</div>
                <div class="Radio">
                    <el-radio v-model="radio" label="1">上网</el-radio>
                    <el-radio v-model="radio" label="2">忙碌</el-radio>
                    <el-radio v-model="radio" label="3">离开</el-radio>
                    <el-radio v-model="radio" label="4">休息</el-radio>
                </div>
            </div>
            <div class="line"></div>
            <div class="Left">咨询人数:</div>
            <el-input v-model="number" size="mini" style="width: 100px;margin-left: 5px;" disabled></el-input>
        </div> -->
        <div class="header">
            <div class="parent">
                <div class="header_left">
                </div>
                <div class="children">
                    <img src="@/assets/images/addcustom.png" alt="" class="Img">
                    <div class="Lefts">现场咨询</div>
                </div>
            </div>
            <div class="header_middle">
                <div class="header_middle_children">
                    客户状态:
                    <el-select v-model="form.customerStatus" filterable clearable size="mini" class="lemore">
                        <el-option v-for="item in dict.type.whether_Newguest" :key="item.dictValue" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
                <div class="header_middle_children">
                    接诊状态:
                    <el-select v-model="form.receptionStatus" filterable clearable class="lemore" size="mini">
                        <el-option v-for="item in dict.type.Reception_status" :key="item.dictValue" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
            </div>
            <div class="header_middle No">
                <div class="header_middle_children">
                    客户姓名:
                    <el-input v-model="form.customerName" size="mini" class="lemore" placeholder="请输入" clearable></el-input>
                </div>
                <div class="header_middle_children ">
                    成交状态:
                    <el-select v-model="form.isDeal" filterable clearable class="lemore" size="mini">
                        <el-option v-for="item in dict.type.whether_deal" :key="item.dictValue" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
            </div>
            <div class="header_middle No">
                <div class="header_middle_children">
                    <span class="newLeft">顾问:</span>
                    <el-select v-model="form.aestheticConsultant" filterable clearable size="mini" class="lemore"
                        :filter-method="aesFilter">
                        <el-option v-for="item in esthetics" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div class="header_middle_children ">

                    <!-- 咨询状态: -->
                    分诊类型:
                    <!-- <el-select v-model="acName" placeholder="请选择" size="mini" class="lemore">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select> -->
                    <el-select v-model="form.triageType" filterable clearable size="mini" class="lemore">
                        <el-option v-for="item in dict.type.Triage_type" :key="item.dictValue" :label="item.label"
                            :value="item.value" />
                    </el-select>

                </div>
            </div>
            <div class="header_middle No">
                <div class="header_middle_children">
                    <span class="">咨询科室:</span>
                    <el-select v-model="form.departmentId" filterable clearable class="lemore" size="mini">
                        <el-option v-for="item in TriageDepartment" :key="item.departmentId" :label="item.departmentName"
                            :value="item.departmentId" />
                    </el-select>
                </div>
                <div class="header_middle_children ">
                    咨询科目:
                    <el-select v-model="form.deptType" filterable clearable class="lemore" size="mini">
                        <el-option v-for="item in dict.type.new_oldDepartments" :key="item.dictValue" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
            </div>
            <div class="header_middle No" style="width: 420px">
                <div class="header_middle_children">
                    <!-- <span class="">咨询成交状态:</span> -->
                    <span class="">咨询处理情况:</span>
                    <el-select v-model="form.treatment" filterable clearable size="mini" class="lemore">
                        <el-option v-for="item in dict.type.treatment" :key="item.dictValue" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <span class="Left">助诊医生:</span>
                    <el-select v-model="form.doctorId" filterable clearable size="mini" class="lemore"
                        :filter-method="doctorFilter">
                        <el-option v-for="item in doctor" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div class="header_middle_children ">
                    <span class="newLeft">媒介来源:</span>
                    <el-select v-model="form.channelTypeId" placeholder="请选择" size="mini" class="lemore"
                        @change="channelTypeSelection" clearable>
                        <el-option v-for="(type, typeIndex) in channelType" :key="typeIndex + 'type'" :label="type.typeName"
                            :value="type.channelId ? type.channelId : type.typeId" />
                    </el-select>
                    <el-select v-model="form.channelId" size="mini" class="lemore" placeholder="请选择" clearable>
                        <el-option v-for="(type, typeChildIndex) in channelTypeChildren" :key="typeChildIndex + 'channelId'"
                            :label="type.typeName" :value="type.channelId" />
                    </el-select>
                </div>
            </div>
            <div class="header_middle No" style="width:400px">
                <div class="header_middle_children">
                    <span class="newLeft">接诊时间：</span>
                    <el-date-picker v-model="form.receptionTime" class="inputWidth" type="datetimerange" align="right"
                        unlink-panels format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" range-separator="-"
                        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
                        :default-time="['00:00:00', '23:59:59']" size="mini" style="width: 200px" />
                </div>
                <div class="header_middle_children">
                    <div class="Nheight">
                        <el-button plain type="primary" size="mini" icon="el-icon-refresh-left"
                            @click="clearForm">清除</el-button>
                    </div>
                    <div class="Nheight">
                        <el-button plain type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
                    </div>
                </div>
            </div>

            <!--            <div class="hearder_button">-->
            <!--                <div class="Nheight">-->
            <!--                    <el-button plain type="primary" size="mini" icon="el-icon-refresh-left"-->
            <!--                        @click="clearForm">清除</el-button>-->
            <!--                </div>-->
            <!--                <div class="Nheight">-->
            <!--                    <el-button plain type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>-->
            <!--                </div>-->
            <!--            </div>-->
        </div>
        <div class="contain" :style="{ height: height + 'px' }">
            <div class="contain_left" :style="{ height: height + 'px' }">
                <div class="contain_left_top">
                    <span>流程站</span>
                    <img src="@/assets/images/addcustom.png" alt="" class="Lefts">
                </div>
                <div style="margin-left: 20px;margin-top: 20px;">
                    <el-timeline>
                        <el-timeline-item v-for="(activity, index) in activities" :key="index" :icon="activity.icon"
                            :type="activity.type" :color="activity.color" :size="activity.size"
                            :timestamp="activity.timestamp">
                            {{ activity.content }}
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>
            <div class="contain_middle">
                <div class="contain_middle_top">
                    <div class="contain_middle_top_left">
                        客户接待列表
                        <span class="cj"></span>
                        成交
                        <span class="ncj" style="margin-left:20px"></span>
                        未成交
                        <!-- <span>咨询状态：</span>
                        <span>复查</span> -->
                    </div>
                    <div class="contain_middle_top_right">
                        <span class="Right" style="color: #800000;">新客首次：<span style="color: #800080;">{{
                            newCustomerFitst }}</span> </span>
                        <span class="Right" style="color: #800000;">新客首次成交率：{{ firstTransactionTurnoverRate }}%</span>
                        <span class="Right" style="color: #0000ff;">老客：<span style="color: #800080;">{{ regularCustomer
                        }}</span> </span>
                        <span class="Right" style="color: #800000;">老客成交率：{{ regularCustomerTurnoverRate }}%</span>
                        <span class="Right" style="color: #000080;">新客二次：<span style="color: red;">{{ newCustomerSecond
                        }}</span></span>
                        <span class="Right" style="color: #800000;">新客二次成交率：{{ secondaryTransactionTurnoverRate }}%</span>
                        <!-- <span class="Right">复查：<span style="color: #0000ff;">10</span> </span>
                        <span class="Right">其他：2</span> -->
                    </div>
                </div>
                <div class="contain_num" :style="{ height: height - 35 + 'px' }">
                    <div class="contain_num_left" style="width: 40%;">
                        <el-table :data="tableData" ref="table" key="Index" style="width: 100%" border :height="height - 65"
                            highlight-current-row @row-click="rowClick" >
                            <el-table-column type="index" width="50" align="center">
                            </el-table-column>
                            <el-table-column prop="customerName" label="姓名" align="center" width="150" showOverflowTooltip>
                                <template slot-scope="scope">
                                    <a @click="customerclick(scope.row.id, scope.row, scope.row.numberId, scope.row.id)"
                                        style="color:blue;cursor: pointer;">
                                        {{ scope.row.customerName }}
                                    </a>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="成交状态" align="center">
                                <template slot-scope="scope">
                                    <show-dict-data :options="dict.type.whether_deal" :value="scope.row.isDeal" :style="{color:scope.row.isDeal=='2'?'#7ec5b7':'#666'}" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="receptionTime" label="咨询日期" align="center" width="180">
                            </el-table-column>
                            <el-table-column prop="receptionStatus" label="接诊状态" align="center">
                                <template slot-scope="scope">
                                    <show-dict-data :options="dict.type.Reception_status"
                                        :value="scope.row.receptionStatus" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="customCardNumber" label="客户卡号" align="center" width="200">
                            </el-table-column>
                            <el-table-column prop="acName" label="顾问" align="center">
                            </el-table-column>
                            <el-table-column prop="triageType" label="分诊类型" align="center" width="150">
                                <template slot-scope="scope">
                                    <show-dict-data :options="dict.type.Triage_type" :value="scope.row.triageType" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="departmentName" label="科室" align="center" width="150">
                            </el-table-column>
                            <el-table-column prop="channelTypeName" label="媒介类型" align="center" width="150">
                            </el-table-column>
                            <el-table-column prop="consultationNotes" label="咨询情况" align="center" width="280"
                                showOverflowTooltip>
                            </el-table-column>
                        </el-table>
                        <div style="width: 100%;display: flex;align-items: center;justify-content: center;">
                            <el-pagination :current-page.sync="currentPage" :page-sizes="[20, 40, 60, 100]"
                                :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="Total"
                                @size-change="handleSizeChange" @current-change="handleCurrentChange" />


                        </div>
                    </div>
                    <div class="contain_num_left" style="width: 60%;">
                        <div class="contain_num_right_top">
                            <div @click="selcolor(index)" v-for="(item, index) in listarr" :key="index"
                                :style="{ color: item.color, marginLeft: '10px', display: 'flex', cursor: 'pointer' }">
                                <span>{{ item.name }}</span>
                                <div class="line_"></div>
                            </div>
                        </div>
                        <div style="width: 100%;overflow-y:scroll">
                            <div v-if="flag1">
                                <div class="customdata">
                                    <div class="customdata_children">
                                        <div class="pcood" style="color:red">&emsp;到院时间： {{ customData.arrivalTime }}</div>
                                        <div class="pcood" style="color:red">客户姓名： {{ customData.customerName }}</div>
                                        <div class="pcood" style="color:red">客户性别：{{ customData.customerSex == '0' ? '男' :
                                            '女'
                                        }}</div>
                                        <div class="pcood" style="color:red">客户卡号：{{ customData.customCardNumber }}</div>

                                    </div>
                                    <div class="customdata_children">
                                        <div class="pcood" style="color:red">&emsp;线上客服：{{ customData.oudName }}</div>
                                        <div class="pcood" style="color:red" >建档人员：{{ customData.cdName }}
                                        </div>
                                        <div class="pcood" style="color:red">美学顾问：{{ customData.rdName }}</div>
                                        <div class="pcood" style="color:red">经济能力：<show-dict-data :options="dict.type.marital_status"
                                                :value="customData.economicCapacity" /></div>
                                        
                                        <!-- <div class="pcood">预约科室：{{ customData.departmentName }}</div> -->

                                    </div>
                                    <div class="customdata_children">
                                        <div class="pcood">&emsp;客户年龄： {{ customData.customAge }}岁</div>
                                        <div class="pcood">联系电话： {{ customData.customPhone }}</div>
                                        <div class="pcood">顾客生日： {{ customData.birthday }}</div>
                                        <div class="pcood">通讯地址： {{ customData.addr }}</div>

                                    </div>
               
                                    <div class="customdata_children">
                                        <div class="pcood">&emsp;预约项目： {{ customData.bookingPeojectName }}</div>
                                        <div class="pcood">所在区域： {{ customData.area }}</div>
                                        <div class="pcood">媒介来源：{{ customData.channelName }}</div>
                                        <div class="pcood">关注问题：{{ customData.concerns }}</div>
                                   
                                


                                    </div>
                                    <div class="customdata_children">
                                        <div class="pcood">&emsp;建档类型一级： {{ customData.filingName }}</div>
                                        <div class="pcood">建档类型二级： {{ customData.typeTwoName }}</div>
                                        <div class="pcood">建档类型三级： {{ customData.typeThreeName }}</div>
                                        <div class="pcood">预约科室：{{ customData.departmentName }}</div>
                                        <!-- <div class="pcood">媒介来源：{{ customData.channelName }}</div> -->
              
                                    </div>
                                    <div class="customdata_children">
                                        <div class="pcood">&emsp;国家地区:{{
                                            customData.country == '0' ? '中国大陆' : customData.country == '1' ? '中国香港' :
                                            customData.country == '2' ? '中国澳门' : '中国台湾'
                                        }}</div>
                                        <div class="pcood">彼此关系： <show-dict-data
                                                :options="dict.type.mutual_relationship" :value="customData.relation" />
                                        </div>
                                        <div class="pcood">qq号码：{{ customData.qq }}</div>
                                        <div class="pcood">微信号码：{{ customData.wechat }}</div>
                                  
                                    </div>
                                    <div class="customdata_children">
                                        <div class="pcood">&emsp;个人职业： <show-dict-data :options="dict.type.occupation"
                                                :value="customData.occupation" /></div>
                                        <div class="pcood">婚姻状况： <show-dict-data :options="dict.type.marital_status"
                                                :value="customData.marriageType" /></div>
                                        <div class="pcood">交通工具： <show-dict-data :options="dict.type.vehicle"
                                                :value="customData.vehicle" /></div>
                                        <div class="pcood">访客Id：{{ customData.visitorId }}</div>
                               

                                    </div>
                                    <div class="customdata_children">
                                        <div class="pcood">&emsp;推荐人/电话：{{ customData.refereeName }}/{{ customData.refereePhone }}
                                        </div>
                                        <div class="pcood" style="visibility:hidden"></div>
                                        <div class="pcood" style="visibility:hidden"></div>
                                        <div class="pcood" style="visibility:hidden"></div>
                                    </div>


                                </div>

                            </div>
                            <div v-if="flag2">
                                <div class="name">
                                    {{ name }}
                                </div>
                                <div class="Table">
                                    <el-table :data="billingDataOk" style="width: 100%" border :height="height - 550"
                                        key="Indexs">
                                        <el-table-column type="index" width="50">
                                        </el-table-column>
                                        <!-- <el-table-column prop="date" label="咨询状态" align="center">
                                </el-table-column> -->
                                        <el-table-column prop="orderNumber" label="收费单号" align="center" width="200">
                                        </el-table-column>
                                        <!-- <el-table-column prop="date" label="收费状态" align="center">
                                </el-table-column> -->
                                        <el-table-column prop="checkoutTime" label="结账时间" align="center" width="180">
                                        </el-table-column>
                                        <el-table-column prop="projectName" label="项目名称" align="center" width="280">
                                        </el-table-column>
                                        <el-table-column prop="quantity" label="次数/数量" align="center">
                                        </el-table-column>
                                        <el-table-column prop="date" label="单位" align="center">
                                        </el-table-column>
                                        <!-- <el-table-column prop="date" label="面积" align="center">
                                </el-table-column> -->
                                        <el-table-column prop="priceOne" label="产品价格" align="center">
                                        </el-table-column>
                                        <el-table-column prop="discount" label="折扣" align="center">
                                        </el-table-column>
                                        <el-table-column prop="discountAmount" label="成交金额" align="center">
                                        </el-table-column>
                                        <el-table-column prop="billingPerformance" label="已付金额" align="center">
                                        </el-table-column>
                                        <el-table-column prop="refundNum" label="退款金额" align="center">
                                            <template slot-scope="scope">
                                                <div :style="{ color: Number(scope.row.refundNum > 0) ? 'red' : 'black' }">
                                                    {{ Number(scope.row.refundNum > 0) ? scope.row.discountAmount : '' }}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="company" label="单位" align="center">
                                        </el-table-column>
                                        <!-- <el-table-column prop="date" label="指定医生" align="center">
                                    </el-table-column> -->
                                    </el-table>
                                </div>
                                <div class="sum">
                                    <div>
                                        <span>储值总额：</span>
                                        <span style="color:#e6a23c">{{ customCardSum.totalStoredValue }}</span>
                                    </div>
                                    <div>
                                        <span>储值本金：</span>
                                        <span style="color:#e6a23c"> {{ customCardSum.storedValuePrincipal }}</span>
                                    </div>
                                    <div>
                                        <span>储值赠送：</span>
                                        <span style="color:red">{{ customCardSum.storedValueGift }}</span>
                                    </div>
                                    <div>
                                        <span>住院押金：</span>
                                        <span style="color:#739cd5">{{ customCardSum.deposit }}</span>
                                    </div>
                                    <div>
                                        <span>预约金：</span>
                                        <span style="color:#739cd5">{{ customCardSum.advancePayment }}</span>
                                    </div>
                                    <div>
                                        <span>欠款金额：</span>
                                        <span style="color:red">{{ customCardSum1.debtAmount }}</span>
                                    </div>
                                    <div>
                                        <span>开单业绩汇总：</span>
                                        <span style="color:#739cd5">{{ customCardSum1.billingPerformance }}</span>
                                    </div>
                                    <div>
                                        <span>科室业绩汇总：</span>
                                        <span style="color:#739cd5">{{ customCardSum1.departmentPerformance }}</span>
                                    </div>
                                </div>
                                <!-- <div class="sum_button">
                            <div>
                                <el-button type="primary" size="mini" icon="el-icon-plus" plain
                                    class="Lefts Tops">增加</el-button>
                                <el-button type="info" size="mini" icon="el-icon-s-ticket" plain
                                    class="Lefts Tops">折扣</el-button>
                                <el-button type="warning" size="mini" icon="el-icon-s-shop" plain
                                    class="Lefts Tops">套餐</el-button>
                                <el-button type="success" size="mini" icon="el-icon-magic-stick" plain
                                    class="Lefts Tops">零售产品</el-button>
                                <el-button type="success" size="mini" icon="el-icon-magic-stick" plain
                                    class="Lefts Tops">卡包</el-button>
                                <el-button type="primary" size="mini" icon="el-icon-user-solid" plain
                                    class="Lefts Tops">审核</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" plain
                                    class="Lefts Tops">删除</el-button>
                                <el-button type="warning" size="mini" icon="el-icon-magic-stick" plain
                                    class="Lefts Tops">指定医生</el-button>
                                <el-button type="success" size="mini" icon="el-icon-magic-stick" plain
                                    class="Lefts Tops">更换推介</el-button>
                                <el-button type="success" size="mini" icon="el-icon-magic-stick" plain
                                    class="Lefts Tops">调整返款额</el-button>
                            </div>

                        </div> -->
                                <div class="name">{{ name }}</div>
                                <div class="smf" :style="{ height: height - 245 + 'px', position: 'relative' }">
                                    <div class="smf_top">
                                        <div style="display:flex;align-items: center;">
                                            <div style="width: 380px;display: flex;flex-wrap: wrap;margin-left: 20px;">
                                                <div style="display: flex;align-items: center;">
                                                    咨询科室：
                                                    <el-select v-model="newform.departmentId" filterable clearable
                                                        style="width: 120px;" size="mini" disabled>
                                                        <el-option v-for="item in TriageDepartment" :key="item.departmentId"
                                                            :label="item.departmentName" :value="item.departmentId" />
                                                    </el-select>
                                                </div>

                                                <div style="display: flex;align-items: center;">
                                                    &emsp;顾问：
                                                    <el-select v-model="newform.aestheticConsultant" filterable clearable
                                                        size="mini" style="width: 120px;" :filter-method="aesFilters"
                                                        disabled>
                                                        <el-option v-for="item in estheticsl" :key="item.value"
                                                            :label="item.label" :value="item.value" />
                                                    </el-select>
                                                </div>
                                            </div>
                                            <div style="width: 380px;display: flex;flex-wrap: wrap;">
                                                <div style="display: flex;align-items: center;">
                                                    接诊状态：

                                                    <el-select v-model="newform.receptionStatus" filterable clearable
                                                        style="width: 120px;" size="mini" disabled>
                                                        <el-option v-for="item in dict.type.Reception_status"
                                                            :key="item.dictValue" :label="item.label" :value="item.value" />
                                                    </el-select>
                                                </div>
                                                <!-- <div style="display: flex;align-items: center;">
                                                &emsp;咨询项目：
                                                <el-select v-model="newform.projectName" placeholder="请选择" size="mini"
                                                    style="width: 120px;" disabled>
                                                    <el-option v-for="item in optionsName" :label="item.label"
                                                        :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </div> -->
                                            </div>
                                        </div>
                                        <div style="width:100%;display: flex;margin-top: 10px;">
                                            <div style="width: 380px;padding-left: 0px;">
                                                <span style="margin-left: 8px;">未成交原因:</span>
                                                <el-select v-model="newform.reason" clearable size="mini"
                                                    style="width: 285px;margin-left: 10px;" :disabled="isDealFlag">
                                                    <el-option v-for="item in dict.type.reason_choice" :key="item.value"
                                                        :label="item.label" :value="item.value" />
                                                </el-select>
                                                <!-- <el-select v-model="acName" placeholder="请选择" size="mini"
                                            style="width: 285px;margin-left: 10px;">
                                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select> -->
                                            </div>
                                            <div style="width: 380px;display: flex;flex-wrap: wrap;margin-left: 20px;">
                                                <div style="display: flex;align-items: center;">
                                                    客户状态：
                                                    <el-select v-model="newform.customerStatus" clearable size="mini"
                                                        style="width: 120px;" disabled>
                                                        <el-option v-for="item in dict.type.whether_Newguest"
                                                            :key="item.dictValue" :label="item.label" :value="item.value" />
                                                    </el-select>
                                                    <!-- <el-select v-model="newform.acName" placeholder="请选择" size="mini" style="width: 120px;">
                                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select> -->
                                                </div>
                                                <div style="display: flex;align-items: center;">
                                                    &emsp;当次来源：
                                                    <el-select v-model="channelTypeName" placeholder="请选择" size="mini"
                                                        style="width: 120px;" disabled>
                                                        <el-option v-for="item in options" :key="item.value"
                                                            :label="item.label" :value="item.value">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="width:100%;display: flex;margin-top: 10px;">
                                            <div style="width: 380px;padding-left: 0px;">
                                                <span style="margin-left: 8px;">潜在需求1:</span>
                                                <el-cascader v-model="newform.demandTypeId" :options="DemandList"
                                                    @change="handleChange" size="mini"
                                                    style="width: 285px;margin-left: 15px;"></el-cascader>
                                            </div>
                                            <div style="width: 380px;display: flex;flex-wrap: wrap;margin-left: 20px;">
                                                <div style="display: flex;align-items: center;">
                                                    潜在需求2：
                                                    <el-cascader v-model="newform.demandId" :options="DemandList"
                                                        @change="handleChange" size="mini"
                                                        style="width: 285px"></el-cascader>
                                                    <!-- <el-select v-model="acName" placeholder="请选择" size="mini" style="width: 120px;">
                                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select> -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="display: flex;align-items: center;margin-top: 20px;margin-left: 20px;">
                                        <el-button type="primary" size="mini" plain style="margin-left: 30px;"
                                            @click="selectAdd" :disabled="!checked">选择模板</el-button>
                                        <el-checkbox v-model="checked" style="margin-left: 20px;">是否追加咨询情况</el-checkbox>
                                        <el-button type="success" size="mini" plain icon="el-icon-check"
                                            style="margin-left:20px" @click="submit" :disabled="!checked">保存</el-button>
                                    </div>
                                    <div style="margin-left: 20px;margin-top: 5px;height: 350px;">
                                        <el-input type="textarea" :rows="10" placeholder="请输入内容" style="width: 580px;"
                                            v-model="chat" :disabled="!checked">
                                        </el-input>
                                    </div>
                                </div>
                            </div>
                            <div v-if="flag3">
                                <el-table :data="manualFormTableData" ref="table" key="Index" style="width: 100%" border
                                    :height="height - 105">
                                    <el-table-column prop="labelDataName" label="标签" align="center">
                                    </el-table-column>
                                    <el-table-column prop="createBy" label="登记人" align="center">
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="登记时间" align="center">
                                    </el-table-column>
                                    <el-table-column prop="remark" label="备注" align="center">
                                    </el-table-column>

                                </el-table>
                            </div>
                            <div v-if="flag4">
                                <div class="deal" style="display: flex">客户已成交项目
                                    <div
                                        style="margin-left: 50px;margin-bottom: 10px;display: flex;align-items: center;margin-top: 10px;">
                                        一级分类:
                                        <el-select v-model="changeselects" placeholder="请选择" @change="changeFirsts"
                                            size="mini" style="margin-left:20px" clearable>
                                            <el-option v-for="item in optionschange" :key="item.departmentId"
                                                :label="item.departmentName" :value="item.departmentId">
                                            </el-option>
                                        </el-select>
                                        <!-- <el-select size="mini" v-model="changeselect" @change="changeFirst">
                                    <el-option label="美容皮肤科" vlaue="2" key="2"></el-option>
                                </el-select> -->
                                    </div>

                                </div>
                                <div class="deal_list">
                                    <el-table :data="billingDataOks" style="width: 100%" border :height="200" key="Indexs">
                                        <el-table-column type="index" width="50">
                                        </el-table-column>
                                        <!-- <el-table-column prop="date" label="咨询状态" align="center">
                                </el-table-column> -->
                                        <el-table-column prop="orderNumber" label="收费单号" align="center" width="200">
                                        </el-table-column>
                                        <!-- <el-table-column prop="date" label="收费状态" align="center">
                                </el-table-column> -->
                                        <el-table-column prop="checkoutTime" label="结账时间" align="center" width="180">
                                        </el-table-column>
                                        <el-table-column prop="projectName" label="项目名称" align="center" width="280">
                                        </el-table-column>
                                        <el-table-column prop="quantity" label="次数/数量" align="center">
                                        </el-table-column>
                                        <el-table-column prop="date" label="单位" align="center">
                                        </el-table-column>
                                        <!-- <el-table-column prop="date" label="面积" align="center">
                                </el-table-column> -->
                                        <el-table-column prop="priceOne" label="产品价格" align="center">
                                        </el-table-column>
                                        <el-table-column prop="discount" label="折扣" align="center">
                                        </el-table-column>
                                        <el-table-column prop="discountAmount" label="成交金额" align="center">
                                        </el-table-column>
                                        <el-table-column prop="billingPerformance" label="已付金额" align="center">
                                        </el-table-column>
                                        <el-table-column prop="refundNum" label="退款金额" align="center">
                                            <template slot-scope="scope">
                                                <div :style="{ color: Number(scope.row.refundNum > 0) ? 'red' : 'black' }">
                                                    {{ Number(scope.row.refundNum > 0) ? scope.row.discountAmount : '' }}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="specs" label="规格" align="center">
                                        </el-table-column>
                                        <!--                                        <el-table-column prop="date" label="指定医生" align="center">-->
                                        <!--                                        </el-table-column>-->
                                    </el-table>
                                </div>
                                <div class="sum">
                                    <div>
                                        <span>储值总额：</span>
                                        <span style="color:#e6a23c">{{ customCardSum.totalStoredValue }}</span>
                                    </div>
                                    <div>
                                        <span>储值本金：</span>
                                        <span style="color:#e6a23c"> {{ customCardSum.storedValuePrincipal }}</span>
                                    </div>
                                    <div>
                                        <span>储值赠送：</span>
                                        <span style="color:red">{{ customCardSum.storedValueGift }}</span>
                                    </div>
                                    <div>
                                        <span>住院押金：</span>
                                        <span style="color:#739cd5">{{ customCardSum.deposit }}</span>
                                    </div>
                                    <div>
                                        <span>预约金：</span>
                                        <span style="color:#739cd5">{{ customCardSum.advancePayment }}</span>
                                    </div>
                                    <div>
                                        <span>欠款金额：</span>
                                        <span style="color:red">{{ customCardSum1.debtAmount }}</span>
                                    </div>
                                    <div>
                                        <span>开单业绩汇总：</span>
                                        <span style="color:#739cd5">{{ customCardSum1.billingPerformance }}</span>
                                    </div>
                                    <div>
                                        <span>科室业绩汇总：</span>
                                        <span style="color:#739cd5">{{ customCardSum1.departmentPerformance }}</span>
                                    </div>
                                </div>
                                <!-- <div
                                style="width:100%;height: 40px;display: flex;align-items: center;justify-content: space-evenly;">
                                <el-button type="primary" size="mini" plain icon="el-icon-close">取消项目</el-button>
                                <el-button type="success" size="mini" plain icon="el-icon-check">手术修复</el-button>
                                <el-button type="primary" size="mini" plain icon="el-icon-s-management">打印</el-button>
                            </div> -->
                                <div class="deal">
                                    <div>
                                        客户已消费项目
                                    </div>
                                    <div
                                        style="margin-left: 50px;margin-bottom: 10px;display: flex;align-items: center;margin-top: 10px;">
                                        一级分类:
                                        <el-select v-model="changeselect" placeholder="请选择" @change="changeFirst"
                                            size="mini" style="margin-left:20px" clearable>
                                            <el-option v-for="item in optionschange" :key="item.departmentId"
                                                :label="item.departmentName" :value="item.departmentId">
                                            </el-option>
                                        </el-select>
                                        <!-- <el-select size="mini" v-model="changeselect" @change="changeFirst">
                                        <el-option label="美容皮肤科" vlaue="2" key="2"></el-option>
                                    </el-select> -->
                                    </div>
                                </div>
                                <div class="project_list">
                                    <el-table :data="stbillingData" style="width: 100%" border :height="height - 400"
                                        key="Indexs">
                                        <el-table-column type="index" width="50">
                                        </el-table-column>
                                        <el-table-column prop="projectName" label="项目名称" align="center" width="280">
                                        </el-table-column>
                                        <!-- <el-table-column prop="projectName" label="项目/产品编号" align="center" width="150">
                                    </el-table-column> -->

                                        <el-table-column prop="departmentName" label="一级分类" align="center" width="150">
                                        </el-table-column>
                                        <!-- <el-table-column prop="sepcs" label="消费类型" align="center">
                                    </el-table-column> -->
                                        <el-table-column prop="treatStartTime" label="成交日期" align="center" width="280">
                                        </el-table-column>
                                        <el-table-column prop="acName" label="现场咨询" align="center">
                                        </el-table-column>

                                        <el-table-column prop="estimateScribingNum" label="计划治疗次数" align="center"
                                            width="150">
                                        </el-table-column>
                                        <el-table-column prop="thisScribingNum" label="当次治疗次数" align="center" width="150">
                                        </el-table-column>
                                        <el-table-column prop="projectType" label="项目类型" align="center">
                                        </el-table-column>
                                        <el-table-column prop="terraceType" label="排台类型" align="center">
                                        </el-table-column>
                                        <el-table-column prop="sepcs" label="规格" align="center">
                                        </el-table-column>
                                        <!-- <el-table-column prop="sepcs" label="单价" align="center">
                                    </el-table-column>
                                    <el-table-column prop="sepcs" label="折扣" align="center">
                                    </el-table-column> -->
                                    </el-table>
                                </div>
                            </div>
                            <div v-if="flag5">
                                <div class="deal">过往咨询项目</div>
                                <div class="Sizenormal">
                                    <el-table :data="billingDatatwo" style="width: 100%" border :height="height - 430"
                                        key="Indexs">
                                        <el-table-column type="index" width="50" align="center">
                                        </el-table-column>
                                        <el-table-column prop="date" label="成交状态" align="center">
                                            <template slot-scope="scope">
                                                <show-dict-data :options="dict.type.whether_deal"
                                                    :value="scope.row.isDeal" />
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="receptionNumber" label="接诊列表编号" align="center" width="200">
                                        </el-table-column>
                                        <el-table-column prop="receptionTime" label="咨询日期" align="center" width="180">
                                        </el-table-column>
                                        <el-table-column prop="reasonName" label="未成交原因" align="center" width="200"
                                            showOverflowTooltip>
                                        </el-table-column>
                                        <el-table-column prop="customerName" label="姓名" align="center" width="200">
                                            <template slot-scope="scope">
                                                <a @click="customerclick(scope.row.id, scope.row, scope.row.numberId, scope.row.id)"
                                                    style="color:rgb(64, 158, 255);cursor: pointer;">
                                                    {{ scope.row.customerName }}
                                                </a>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="customCardNumber" label="客户卡号" align="center" width="200">
                                        </el-table-column>
                                        <el-table-column prop="reservedItems" label="项目" align="center" width="200">
                                        </el-table-column>
                                        <el-table-column prop="acName" label="顾问" align="center">
                                        </el-table-column>
                                        <el-table-column prop="date" label="处理情况" align="center" width="150">
                                            <template slot-scope="scope">
                                                <show-dict-data :options="dict.type.treatment"
                                                    :value="scope.row.treatment" />
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="transactionMoney" label="接诊单金额" align="center" width="200">
                                        </el-table-column>
                                        <el-table-column prop="departmentName" label="科室" align="center" width="200">
                                        </el-table-column>
                                        <el-table-column prop="channelName" label="预约类型" align="center" width="200">
                                        </el-table-column>
                                        <el-table-column prop="consultationNotes" label="咨询情况" align="center"
                                            showOverflowTooltip width="200">
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <div class="deal">电话/网络报单情况：</div>
                                <el-table :data="billingDataflag5" style="width: 100%" border :height="height - 430"
                                    key="Indexs">
                                    <el-table-column type="index" width="50">
                                    </el-table-column>
                                    <el-table-column prop="customerName" label="客户姓名" align="center" width="180">
                                    </el-table-column>
                                    <el-table-column prop="isReachCourtyard" label="状态" align="center" width="180">
                                        <template slot-scope="scope">
                                            <show-dict-data :options="dict.type.hospat_yn"
                                                :value="scope.row.isReachCourtyard" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="preProduction" label="预约日期" align="center" width="180">
                                    </el-table-column>
                                    <el-table-column prop="appointmentTime" label="受理日期" align="center" width="180">
                                    </el-table-column>
                                    <el-table-column prop="pejectNames" label="咨询项目类型" align="center" width="180">
                                    </el-table-column>
                                    <el-table-column prop="remarks" label="受理情况" align="center" width="180">
                                    </el-table-column>
                                    <el-table-column prop="customPhone" label="受理电话" align="center" width="180">
                                    </el-table-column>
                                    <el-table-column prop="visituserName" label="受理人员" align="center" width="180">
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div v-if="flag6">
                                <div class="deal" style="background-color:#eee">
                                    <div>
                                        客户回访记录列表
                                    </div>
                                    <div style="margin-left:20px">
                                        <el-radio v-model="radio" label="1">查询全部</el-radio>
                                        <el-radio v-model="radio" label="2">只查本人</el-radio>
                                        <span class="cj"></span>
                                        已回访
                                        <span class="ncj" style="margin-left:20px"></span>
                                        未回访
                                    </div>
                                </div>
                                <div class="menus">
                                    <el-table :data="tableDatavisittwo" style="width: 100%" border :height="height - 150"
                                        key="Indexs" @row-click="rowClicks" ref="table"
                                        @selection-change="selectionChange" @select-all="selectAll" highlight-current-row>
                                        <el-table-column prop="customerName" label="客户姓名" align="center" width="90">
                                            <template slot-scope="scope">
                                                <div :style="{ color: scope.row.color==null?(scope.row.isExecute=='1'?'#7ec5b7':'#666'):scope.row.color }">{{ scope.row.customerName }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="reportTime" label="登记日期" align="center" width="105">
                                            <template slot-scope="scope">
                                                <div :style="{ color: scope.row.color }">{{ scope.row.reportTime }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="customPhone" label="回访电话" align="center" width="110">
                                            <template slot-scope="scope">
                                                <div :style="{ color: scope.row.color }">{{ scope.row.customPhone }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="planReturnTime" label="计划日期" align="center" width="112">
                                            <template slot-scope="scope">
                                                <el-date-picker v-model="scope.row.planReturnTime" type="date"
                                                    placeholder="选择日期" @change="changeesthetics(scope.row)" size="mini"
                                                    :editable="false" style="width: 95px;" :disabled="radio=='1'" />
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="planReturnUserName" label="计划回访人员" align="center"
                                            width="122">
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.planReturnUser" placeholder="请选择" size="mini"
                                                    @change="changeesthetics(scope.row)" :editable="true"
                                                    style="width:105px" :disabled="radio=='1'">
                                                    <el-option v-for="item in sysUserList" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </template>

                                        </el-table-column>
                                        <el-table-column prop="returnStage" label="回访阶段" align="center" width="142">
                                            <template slot-scope="scope">
                                                <el-select v-model="scope.row.returnStage" placeholder="请选择" size="mini"
                                                    style="width:125px;" @change="changeesthetics(scope.row)" :disabled="radio=='1'">
                                                    <el-option v-for="item in dict.type['return_stage']" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="returnVisit" label="回访目的" align="center" width="180"
                                            showOverflowTooltip>
                                            <template slot-scope="scope">
                                                <el-input rows="2" type="textarea" v-model="scope.row.returnVisit"
                                                    @input="changeesthetics(scope.row)" :disabled="radio=='1'">

                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="returnVisitFeedback" label="回访反馈" align="center" width="180"
                                            showOverflowTooltip>
                                            <template slot-scope="scope">
                                                <el-input rows="2" type="textarea" v-model="scope.row.returnVisitFeedback"
                                                    @input="changeesthetics(scope.row)" :disabled="radio=='1'">

                                                </el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="actualReturnvisitTime" label="执行日期" align="center"
                                            width="180">
                                            <template slot-scope="scope">
                                                <div :style="{ color: scope.row.color }">{{ scope.row.actualReturnvisitTime
                                                }}</div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="isThrough" label="是否打通" align="center" width="135">
                                            <template slot-scope="scope">
                                                <!-- <div :style="{ color: scope.row.color }">
                                                    <show-dict-data :options="dict.type.through_result"
                                                        :value="scope.row.isThrough" />
                                                </div> -->
                                                <el-select v-model="scope.row.isThrough" placeholder="请选择" size="mini"
                                                    @change="changeesthetics(scope.row)" :editable="true"
                                                    style="width:105px" :disabled="radio=='1'">
                                                    <el-option v-for="item in dict.type.through_result" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="returnExecutorUserName" label="回访执行人" align="center"
                                            width="135">
                                            <!-- <template slot-scope="scope">
                                                <el-select v-model="scope.row.returnExecutorUser" placeholder="请选择"
                                                    size="mini" @change="changeesthetics(scope.row)" :editable="true"
                                                    style="width:105px">
                                                    <el-option v-for="item in sysUserList" :key="item.value"
                                                        :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </template> -->
                                        </el-table-column>
                                        <el-table-column prop="createBy" label="添加人" align="center" width="125">
                                            <template slot-scope="scope">
                                                <div :style="{ color: scope.row.color }">{{ scope.row.createBy }}</div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div
                                        style="margin-top: 10px;margin-left: 10px;display:flex;justify-content: space-between;">
                                        <div></div>
                                        <div style="margin-right: 30px;">
                                            <el-button type="primary" size="mini" plain icon="el-icon-plus"
                                                @click="submitones" :disabled="radio=='1'">增加</el-button>
                                            <el-button type="primary" size="mini" plain icon="el-icon-plus"
                                                @click="submitonesplan" :disabled="radio=='1'">回访计划</el-button>
                                            <!-- <el-button type="danger" size="mini" plain icon="el-icon-delete"
                                                @click="submitonesstop">停止</el-button> -->
                                            <el-button type="danger" size="mini" plain icon="el-icon-delete"
                                                @click="submitonesdel"
                                                v-has-permi="['paidReturnVisit:remove']" :disabled="radio=='1'">删除</el-button>
                                            <el-button type="success" size="mini" plain icon="el-icon-s-platform"
                                                @click="submitonessubmit" :disabled="radio=='1'">保存</el-button>
                                        </div>

                                    </div>

                                </div>
                            </div>
                            <div v-if="flag7">
                                <div style="margin-top: 10px;margin-left: 10px;">
                                    <el-input v-model="followUpRecord.remark" type="textarea" style="width:80%"
                                        placeholder="请输入跟进记录" />
                                    <el-button type="primary" size="mini" plain @click="addsubmit"
                                        style="margin-left:20px">添加跟进记录</el-button>
                                </div>
                                <br>
                                <el-table :data="recorlist" border style="font-size: 10px;margin-left: 10px;width: 100%;"
                                    :height="height - 180" :header-cell-style="{ 'text-align': 'center' }"
                                    :cell-style="{ 'text-align': 'center' }">
                                    <el-table-column label="时间" prop="createTime" width="180" />
                                    <el-table-column label="添加人" prop="createBy" width="180" />
                                    <el-table-column label="内容" prop="remark" show-overflow-tooltip />
                                    <el-table-column label="操作" width="120">
                                        <template slot-scope="scope">
                                            <el-button type="text" size="small"
                                                @click="handleClick(scope.row)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
        <sg-dialog title="选择模板" :dialog="selectflag" size="300px" out-top="50px" @handleClose="selectflag = false">
            <div slot="out">
                <div>
                    <div>[咨询项目]:</div>
                    <div>[职业及消费能力]</div>
                    <div>[有无既往了解史]</div>
                    <div>[是否添加微信 ]</div>
                    <div>[面诊医生]</div>
                    <div>[本次设计方案及报价]</div>
                    <div>[未成交原因]</div>
                    <div>[其他铺垫及建议方案]</div>
                    <div>[其他备注]</div>
                </div>
                <div style="height: 50px;"></div>
                <div class=""
                    style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <div style="width: 160px;height: 40px;">
                        <el-button type="primary" size="mini" @click="ok">确定</el-button>
                        <el-button @click="selectflag = false" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sg-dialog>
        <sg-dialog title="回访计划" :dialog="dialogflag" size="100%" out-top="50px" @handleClose="dialogflag = false">
            <div slot="out">
                <el-card class="visitBox">
                    <ul>
                        <li>
                            回访类型：
                            <el-select v-model="returnTypeId" placeholder="请选择" size="mini" @change="changeselectel"
                                clearable>
                                <el-option v-for="item in optionstypeName" :key="item.returnTypeId" :label="item.typeName"
                                    :value="item.returnTypeId">
                                </el-option>
                            </el-select>
                        </li>
                    </ul>
                </el-card>
                <div class="chatList" style="height: 700px;overflow-y: scroll;">
                    <el-card v-for="(item, index) in returnVisitRecordList" :key="index" class="visitBox innerVisitBox">
                        <ul>
                            <li>计划{{ index + 1 }}<a>（若不能确定回访指定执行人,可选择填写执行人类型,系统自动匹配 ）</a>
                                <el-link v-if="index !== 0" type="danger" style="float: right" size="mini"
                                    @click.stop="deleteManualItem(index)">删除
                                </el-link>
                            </li>
                            <div class="visitContent">
                                <div>
                                    <div class="title">回访信息</div>
                                    <el-form :ref="'moreManualForm' + index" size="mini" label-width="124px" :model="item"
                                        :rules="manualFormRules">
                                        <el-row>
                                            <el-col :span="12">
                                                <el-form-item label="是否一次性回访" prop="isOneReturnVisit">
                                                    <el-select v-model="item.isOneReturnVisit" style="width: 100%;"
                                                        size="mini" placeholder="请选择">
                                                        <el-option v-for="dict in dict.type['whether']" :key="dict.value"
                                                            :label="dict.label" :value="dict.value" />
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="计划时间" prop="planReturnTime">
                                                    <el-date-picker v-model="item.planReturnTime" style="width: 100%;"
                                                        type="datetime" :clearable="false" placeholder="选择日期时间"
                                                        format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="任务等级" prop="taskLevel">
                                                    <!-- "item.taskLevel" -->
                                                    <el-select v-model="item.taskLevel" style="width: 100%;" size="mini"
                                                        placeholder="请选择">
                                                        <el-option v-for="dict in dict.type['task_level']" :key="dict.value"
                                                            :label="dict.label" :value="dict.value" />
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="回访阶段" prop="returnStage">
                                                    <el-select v-model="item.returnStage" style="width: 100%;" size="mini"
                                                        placeholder="请选择">
                                                        <el-option v-for="dict in dict.type['return_stage']"
                                                            :key="dict.value" :label="dict.label" :value="dict.value" />
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="关键字">
                                                    <el-input v-model="item.returnVisitKeyword" class="full-width"
                                                        placeholder="请输入" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="回访目的">
                                                    <el-input v-model="item.returnVisit" class="full-width" :rows="1"
                                                        resize="none" type="textarea" placeholder="请输入回访目的" />
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </div>
                                <div>
                                    <div class="title">回访人员</div>
                                    <el-form ref="forem" size="mini" :model="returnVisitRecordList[0]"
                                        :rules="manualFormRules" label-width="110px">
                                        <el-row>
                                            <el-col :span="10">
                                                <el-form-item label="指定执行人">
                                                    <el-checkbox v-model="item.appointPeople" @change="change(item)" />
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="14">
                                                <el-form-item label="选择执行人">
                                                    <el-select v-model="item.planReturnUser" filterable remote
                                                        reserve-keyword placeholder="请输入" :disabled="!item.appointPeople"
                                                        :remote-method="querySearchAsync">
                                                        <el-option v-for="items in sysUserList" :key="items.value"
                                                            :label="items.label" :value="items.value" />
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="10">
                                                <el-form-item label="执行类型">
                                                    <el-select v-model="item.returnUserType" :disabled="item.appointPeople"
                                                        placeholder="请选择" class="full-width">
                                                        <el-option v-for="dict in dict.type['execution_type']"
                                                            :key="dict.value" :label="dict.label" :value="dict.value" />
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="14">
                                                <!-- :disabled="!item.appointPeople" -->
                                                <el-form-item label="后备执行人" prop="backupExecutor">
                                                    <el-select v-model="item.backupExecutor" filterable remote
                                                        reserve-keyword placeholder="请输入" :disabled="item.appointPeople"
                                                        :remote-method="querySearchAsync">
                                                        <el-option v-for="items in sysUserList" :key="items.value"
                                                            :label="items.label" :value="items.value" />
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </div>
                            </div>
                        </ul>
                    </el-card>

                </div>
                <el-button style="margin-top: 10px" size="mini" type="primary"
                    @click.stop="saveManual('moreManualForm', true)">
                    保存
                </el-button>
            </div>
        </sg-dialog>
    </div>
</template>
<script>
import PinyinMatch from 'pinyin-match'
import { math } from '@/utils/math'
import SgDialog from '@/components/Dialog'
import {
    beforeDayTime,
    beforeWeek,
    lastMonth,
    lastQuarter, lastYear,
    monthData,
    thisQuarter,
    thisWeek, thisYear,
    todayTime,
    timeFmt
} from '@/utils/time'
export default {
    watch: {
        checked() {

        },
        radio(newV) {
            if (newV == '1') {
                this.getvisit('', '', '');
            } else {
                this.getvisit(this.customerName, this.departmentId, localStorage.getItem('userId'));
            }
        }
    },
    components: {
        SgDialog
    },
    dicts: ['execution_type', 'return_stage', 'task_level', 'whether', 'through_result', 'hospat_yn', 'new_guest', 'vehicle', 'marital_status', 'mutual_relationship', 'reason_choice', 'economic_capacity', 'whether_secondary', 'sys_user_sex', 'whether_deal', 'new_oldDepartments', 'whether_Newguest', 'economic_capacity', 'Reception_status', 'Triage_type', 'treatment', 'occupation'],
    async created() {
        this.deptId = this.$store.getters.departmentId
        this.$set(this.form, 'aestheticConsultant', Number(localStorage.getItem('userId')))
        this.Department();
        this.getUserList();
        this.getChannelInfo();
        this.search();
        this.DemandType();

    },
    mounted() {
        let h = window.innerHeight || document.documentElement.clientHeight
            || document.body.clientHeight;
        let y = parseInt(window.getComputedStyle(document.querySelector('.Height'), null).height);
        let x = parseInt(window.getComputedStyle(document.querySelector('.header'), null).height);
        // let z = parseInt(window.getComputedStyle(document.querySelector('.Top'), null).height);
        this.height = h - x - y - 132
        this.getTypelist();

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
    methods: {
        Classname({ row }) {
            if (row.isExecute == '1') {
                return 'success-row'
            }
        },
        newgetData(value) {
            let DateObj = new Date(value)
            // 将时间转换为 XX年XX月XX日XX时XX分XX秒格式
            let year = DateObj.getFullYear()
            let month = DateObj.getMonth() + 1
            let day = DateObj.getDate()
            // let hh = DateObj.getHours()
            // let mm = DateObj.getMinutes()
            // let ss = DateObj.getSeconds()
            month = month > 9 ? month : '0' + month
            day = day > 9 ? day : '0' + day
            // if (hh >= 0 && hh <= 9) {
            //     hh = "0" + hh;
            // }
            // if (mm >= 0 && mm <= 9) {
            //     mm = "0" + mm;
            // }
            // if (ss >= 0 && ss <= 9) {
            //     ss = "0" + ss;
            // }
            // 最终时间
            return `${year}-${month}-${day}`
        },
        //删除跟进记录
        handleClick(row) {
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.user.recordremove(row.followId).then(res => {
                    if (res) {
                        this.$message.success('删除成功')
                        this.getlistadd();
                    }
                })
            })
        },
        //获取跟进记录列表
        getlistadd() {
            this.$api.user.recordlist({ id: this.Id }).then(res => {
                if (res) {
                    this.recorlist = res.rows
                }
            })
        },
        //添加跟进记录
        addsubmit() {
            if (this.followUpRecord.remark == '') {
                this.$message.warning('请先填写跟进记录，再添加')
                return
            }
            this.followUpRecord.id = this.Id
            this.$api.user.recordAdd(this.followUpRecord).then(res => {
                if (res) {
                    this.followUpRecord.remark = ''
                    this.$message.success('添加成功');
                    this.getlistadd();
                }
            })
        },
        //修改改变颜色
        changeesthetics(row) {
            let len = this.tableDatavisittwo.indexOf(row);
            this.tableDatavisittwo[len].color = 'blue'
            this.$set(this.tableDatavisittwo, len, this.tableDatavisittwo[len])
            let selcolor = document.querySelector('.menus .el-table__body-wrapper tbody').children;
            selcolor[len].children[3].children[0].children[0].children[0].style.color = 'blue'
            selcolor[len].children[4].children[0].children[0].children[0].children[0].style.color = 'blue'
            selcolor[len].children[5].children[0].children[0].children[0].children[0].style.color = 'blue'
            selcolor[len].children[6].children[0].children[0].children[0].style.color = 'blue'
            selcolor[len].children[7].children[0].children[0].children[0].style.color = 'blue'
            selcolor[len].children[0].children[0].children[0].style.color = 'blue'
            selcolor[len].children[1].children[0].children[0].style.color = 'blue'
            selcolor[len].children[2].children[0].children[0].style.color = 'blue'
            selcolor[len].children[8].children[0].children[0].style.color = 'blue'
            selcolor[len].children[9].children[0].children[0].children[0].children[0].style.color = 'blue'
            // selcolor[len].children[10].children[0].children[0].children[0].children[0].style.color = 'blue'
            selcolor[len].children[11].children[0].children[0].style.color = 'blue'

        },
        //保存计划
        saveManual(form, isAddIndex) {
            let currindex = 0
            this.returnVisitRecordList.forEach((item, index) => {
                const formName = isAddIndex ? form + index : form
                const refForm = isAddIndex ? this.$refs[formName][0] : this.$refs[formName]
                if (refForm) {
                    refForm.validate((valid) => {
                        if (valid) {
                            delete item.appointPeople
                            currindex++
                        }
                    })
                }
            })
            if (currindex === this.returnVisitRecordList.length) {
                let len = this.tableDatavisittwo.length
                this.dialogflag = false;
                let that = this;
                setTimeout(function () {
                    that.returnVisitRecordList.forEach(value => {
                        value.customerName = that.customData.customerName
                        value.customPhone = that.customData.customPhone
                        value.reportTime = timeFmt('YYYY-mm-dd HH:MM:SS', new Date()).split(' ')[0];
                        value.planReturnUser = Number(localStorage.getItem('userId'))
                        value.color = 'blue'
                        that.tableDatavisittwo.push(value)
                    })
                    that.$nextTick(function () {
                        let selcolor = document.querySelector('.menus .el-table__body-wrapper tbody').children;
                        for (let i = 0; i < selcolor.length; i++) {
                            if (i > len - 1) {
                                selcolor[i].children[3].children[0].children[0].children[0].style.color = 'blue'
                                selcolor[i].children[4].children[0].children[0].children[0].children[0].style.color = 'blue'
                                selcolor[i].children[5].children[0].children[0].children[0].children[0].style.color = 'blue'
                                selcolor[i].children[6].children[0].children[0].children[0].style.color = 'blue'
                                selcolor[i].children[7].children[0].children[0].children[0].style.color = 'blue'
                                selcolor[i].children[9].children[0].children[0].children[0].children[0].style.color = 'blue'
                                // selcolor[i].children[10].children[0].children[0].children[0].children[0].style.color = 'blue'
                            }

                        }
                    })

                }, 50)
            }

        },
        //指定执行人
        change(item) {
            if (item.appointPeople) {
                // this.manualFormRules.backupExecutor = []
                // this.$refs.forem.clearValidate(["backupExecutor"])
                item.returnUserType = ''
                item.backupExecutor = ''
                // item.manualFormRules.backupExecutor = []//将此项的校验规则清空
                item.planReturnUser = this.$store.getters.user.userId
            } else {
                item.planReturnUser = ''
                // this.manualFormRules.backupExecutor = [{ required: true, message: '请输入活动名称', trigger: 'change' }]
            }
        },
        querySearchAsync(queryString) {
            const _this = this
            this.loading = true
            this.$forceUpdate();
            if (queryString !== '') {
                //取值
                let newlist = this.newsysUserList.filter((item) => {
                    if (item.nickName.toUpperCase().indexOf(queryString.toUpperCase()) !== -1) {
                        return true
                    }
                    return PinyinMatch.match(item.nickName, queryString)
                })
                this.sysUserList = newlist;
                this.$forceUpdate();

            } else {
                this.sysUserList = this.newsysUserList;
            }
            // this.getUserList(queryString, res => {
            //   _this.sysUserList = res
            //   _this.loading = false
            // })
        },
        //获取回访计划
        changeselectel(e) {
            let returnStage = ''
            this.optionstypeName.forEach(value => {
                if (value.returnTypeId == e) {
                    returnStage = value.returnVisitStage
                }
            })
            let data = {
                deptId: this.deptId,
                returnTypeId: e
            }
            this.$api.medical.returnVisitTypeList(data).then(res => {
                if (res) {
                    if (res.rows.length == 0) {
                        this.returnVisitRecordList = [
                            {
                                isOneReturnVisit: '',

                                appointPeople: true,
                                // returnExecutorUser: this.$store.getters.user.userId,
                                planReturnUser: this.$store.getters.user.userId, // 选择执行人
                                taskLevel: '',//等级
                                planReturnTime: timeFmt('', new Date()),
                                returnStage: '',
                                grade: undefined,
                                returnUserType: '', // 类型
                                backupExecutor: '',// 后备执行人
                                returnVisit: "",
                            }
                        ]
                    } else {
                        this.returnVisitRecordList = [];
                        res.rows.forEach(value => {
                            let currentDate = new Date();
                            currentDate.setDate(currentDate.getDate() + value.intervalDays)
                            this.returnVisitRecordList.push(
                                {
                                    isOneReturnVisit: '1',

                                    appointPeople: true,
                                    // returnExecutorUser: this.$store.getters.user.userId,
                                    planReturnUser: this.$store.getters.user.userId, // 选择执行人
                                    taskLevel: value.returnVisitLevel,//等级
                                    planReturnTime: currentDate,
                                    returnStage: returnStage,
                                    grade: undefined,
                                    returnUserType: '', // 类型
                                    backupExecutor: '',// 后备执行人
                                    returnVisit: value.returnVisit,
                                }
                            )
                        })
                    }
                }
            })
        },
        //获取回访类型
        getTypelist() {
            this.$api.medical.returnVisitTypeInfolist({
                deptId: this.deptId,
                type: '1'
            }).then(res => {
                if (res) {
                    this.optionstypeName = res.rows
                }
            })
        },
        //选择所有数据
        selectAll(e) {
            this.selectData = e;
        },
        //选择复选框触发事件
        selectionChange(e) {
            this.selectData = e;
        },
        //停止计划
        submitonesstop() {

        },
        //新增
        submitones() {
            let len = this.tableDatavisittwo.length
            let that = this;
            let object = {
                customerName: that.customData.customerName,
                customPhone: that.customData.customPhone,
                reportTime: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()).split(' ')[0],
                color: 'blue'
            };
            let Obs = Object.assign(object, this.returnVisitRecordList[0]);
            that.tableDatavisittwo.push(Obs)
            setTimeout(() => {
                that.$nextTick(function () {
                    let selcolor = document.querySelector('.menus .el-table__body-wrapper tbody').children;
                    for (let i = 0; i < selcolor.length; i++) {
                        if (i > len - 1) {
                            selcolor[i].children[3].children[0].children[0].children[0].style.color = 'blue'
                            selcolor[i].children[4].children[0].children[0].children[0].children[0].style.color = 'blue'
                            selcolor[i].children[5].children[0].children[0].children[0].children[0].style.color = 'blue'
                            selcolor[i].children[6].children[0].children[0].children[0].style.color = 'blue'
                            selcolor[i].children[7].children[0].children[0].children[0].style.color = 'blue'
                            selcolor[i].children[9].children[0].children[0].children[0].children[0].style.color = 'blue'
                            // selcolor[i].children[10].children[0].children[0].children[0].children[0].style.color = 'blue'
                        }

                    }
                })

            }, 50);

        },
        //回访计划
        submitonesplan() {
            this.dialogflag = true;
        },
        //删除计划
        submitonesdel() {

            if (this.selectData.length == 0) {
                this.$message.warning('请选择至少一条数据进行删除')
                return
            }
            let len = this.tableDatavisittwo.indexOf(this.selectData[0])
            if (this.selectData[0].numberId) {
                this.$confirm('确认删除该条回访信息？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.modules.netPower.deleteList(this.selectData[0].numberId).then((res) => {
                        if (res) {
                            this.$message.success('删除成功')
                            this.getvisit(this.customerName, this.departmentId, localStorage.getItem('userId'));
                        }
                    })
                })
            } else {
                this.tableDatavisittwo.splice(len, 1)
            }
        },
        //保存计划
        submitonessubmit() {
            let appoint = [];
            let flag = false;//记录回访阶段是否填写
            let flagTh = false //记录是否打通是否填写
            let Index = 0;
            let Indexs = 0;
            //这里是祛除不是修改和删除的数据的
            let tableDatavisittwo = [];
            this.tableDatavisittwo.forEach(value => {
                if (value.color) {
                    tableDatavisittwo.push(value)
                }
            })
            tableDatavisittwo.forEach((value, index) => {
                let app = {}
                app.planReturnTime = this.newgetData(value.planReturnTime) + ' ' + '00:00:00';
                app.planReturnUser = value.planReturnUser;
                app.returnVisit = value.returnVisit
                if (!value.isThrough) {
                    app.isThrough = "";
                } else {
                    app.isThrough = value.isThrough
                }
                app.returnVisitFeedback = value.returnVisitFeedback
                app.id = this.Id
                if (value.numberId) {
                    app.numberId = value.numberId
                }
                if (value.isExecute == '1') {
                    app.isExecute = '1'
                }
                app.returnStage = value.returnStage
                appoint.push(app)
            })
            if (appoint.length == 0) {
                this.$message.warning('没有修改或新增的回访数据，暂不能保存')
                return
            }
            this.tableDatavisittwo.forEach((value, index) => {
                if (value.returnStage == '') {
                    flag = true;
                    Index = index
                }
                if (value.returnVisit == "") {
                    flag = true;
                    Index = index
                }
                if (value.returnVisitFeedback) {
                    if (value.isThrough == "" || !value.isThrough) {
                        flagTh = true
                        Indexs = index
                    }
                }
            })

            if (flag) {
                this.$message.warning(`第${Index + 1}行的回访阶段和回访目的必须填写`)
                return
            }
            if (flagTh) {
                this.$message.warning(`第${Indexs + 1}行的是否打通必须填写`)
                return
            }

            // {
            //         isOneReturnVisit: '', //是否一次性回访
            //         backupExecutor: '',//后备执行人
            //         appointPeople: true,//指定执行人
            //         // returnExecutorUser: this.$store.getters.user.userId,
            //         planReturnUser: this.$store.getters.user.userId, // 选择执行人
            //         taskLevel: '',//任务等级
            //         planReturnTime: timeFmt('', new Date()),//计划回访时间
            //         returnStage: '', //回访阶段
            //         grade: undefined,//任务等级
            //         returnUserType: '', // 执行类型
            //         backupExecutor: '',// 后备执行人
            //         returnVisit: '',//回访目的
            //         value1: [],
            //         returnVisitFeedback: '',//回访反馈
            //         isThrough: '',//是否打通
            //         returnExecutorUser: '',//回访执行人

            //     }
            // return


            const data = {
                returnVisitHospitalDtoList: appoint
            }
            this.$api.confinementRoom.AlreadyArrivedAdd(data).then(res => {
                if (res) {
                    this.$message.success(res.msg);
                    this.getvisit(this.customerName, this.departmentId, localStorage.getItem('userId'));
                }
            })
        },
        rowClicks(row) {
            this.$refs.table.clearSelection(); //清除所有选中数据
            this.$refs.table.toggleRowSelection(row);
            this.selectData = [row]
        },
        //检验，辅助治疗单
        getOk() {
            this.$api.billingList.selectCusromerList({
                id: this.Id,
                deptId: this.deptId,
                jdxxId: this.jdxxId
            }).then((res) => {
                this.billingDataOk = this.billingData.concat(res.rows)
            })
        },
        getOks(billingDepartment) {
            this.$api.billingList.selectCusromerList({
                id: this.Id,
                deptId: this.deptId,
                billingDepartment,
            }).then((res) => {
                this.billingDataOks = this.billingDatanews.concat(res.rows)

            })
        },
        //获取预约单信息
        getyu() {
            this.$api.netPower.queryBookCustomerList({
                id: this.Id
            }).then(res => {
                if (res) {
                    this.billingDataflag5 = res.rows;
                }
            })
        },
        handleSizeChange(e) {
            this.pagination.pageSize = e;
            this.currentPage = 1;
            this.search();

        },
        handleCurrentChange(e) {
            this.pagination.pageNum = e;
            this.search();
        },
        // 获取接诊基本信息
        getCustomerInfo() {
            this.showDataDialog = true
            this.$api.dept.ReceptionList('get', { jdxxId: this.jdxxId }).then(res => {
                this.chat = res.rows[0].consultationNotes
            }).finally(() => {
                // this.showDataDialog = false
            })
        },
        rowClassName({ row, rowIndex }) {
            if (row.isDeal === '1') {
                return 'warning-row'
            } else if (row.isDeal === '2') {
                return 'success-row'
            }

        },
        submit() {
            let customerDtos = [];
            let labelList = [];
            if (this.newform.demandTypeId !== "") {
                let data = {
                    demandTypeId: this.newform.demandTypeId[0],
                    demandId: this.newform.demandTypeId[1],
                    id: this.customData.id
                }
                customerDtos.push(data)
            }
            if (this.newform.demandId !== "") {
                let data = {
                    demandTypeId: this.newform.demandId[0],
                    demandId: this.newform.demandId[1],
                    id: this.customData.id
                }
                customerDtos.push(data)
            }
            if (this.newform.reason !== "") {
                let label = ''
                this.dict.type.reason_choice.forEach(value => {
                    if (value.value == this.newform.reason) {
                        label = value.label
                    }
                })
                const obj = this.dict.type.reason_choice.filter(item => item.value === this.newform.reason)
                obj.forEach(item => {
                    this.$set(item, 'reason', item.label)
                })
                labelList.push(obj[0])
                labelList.forEach(item => {
                    this.$set(item, 'id', this.Id)
                    this.$set(item, 'deptId', this.deptId)
                    this.$set(item, 'departmentId', this.newdepartmentId)
                    this.$set(item, 'arrivalTime', this.arrivalTime)
                    this.$set(item, 'aestheticConsultant', localStorage.getItem('userId'))
                    this.$set(item, 'jdxxId', this.jdxxId)
                    this.$delete(item, 'createTime')
                })
            }
            if (this.chat == '') {
                this.$message.warning('请输入备注');
                return
            }
            this.$api.dept.ReceptionSupplementary({
                'result': {
                    'jdxxId': this.jdxxId,
                    consultationNotes: this.chat,
                },
                'noDealProjecInfos': [], // 未成交项目
                'customerDtos': [], // 客户需求
                'customerDtos': customerDtos, // 客户需求
                'nodealResultDto': labelList // 未成交原因
            }).then((res) => {
                if (res) {
                    this.$message.success('保存成功')
                    // this.chat = "";
                    this.newform.reason = "";
                    this.newform.demandTypeId = "";
                    this.newform.demandId = '';
                }
            })

        },
        //分类检索
        changeFirst(e) {
            this.xfdeparts = e;
            this.getreclist(e, '');

        },
        changeFirsts(e) {
            this.billingDataOks = [];
            this.xfdepart = e;
            this.getoders(this.Id, e);

        },
        //获取顾客标签
        getTitle(id) {
            this.$api.modules.netPower.getUserLabelInfo({ id: id }).then(res => {
                if (res) {
                    this.manualFormTableData = res.data.labelRelations
                }
            })
        },
        getbefore() {
            // this.$api.dept.MyReception({
            //     deptId: this.deptId,
            //     id: this.Id
            // }, 'get').then((res) => {
            this.$api.dept.ReceptionList('get', {
                deptId: this.deptId,
                id: this.Id,
                aestheticConsultant: localStorage.getItem('userId')
            }).then((res) => {
                if (res) {
                    this.billingDatatwo = res.rows;
                }
            }).finally(() => {

            })
        },
        clearflag() {
            if (this.flag1 == false && this.flag2 == false && this.flag3 == false && this.flag4 == false && this.flag5 == false && this.flag6 == false && this.flag7 == false) {
                this.getInfo(this.Id)
                this.flag1 = true
                this.listarr.forEach(value => {
                    value.color = ''
                })
                this.listarr[0].color = '#409eff'
            } else {
                if (this.flag1) {
                    this.getInfo(this.Id)
                }
                if (this.flag2) {
                    this.getCustomerInfo();
                    this.getoder(this.Id)
                    this.getCustomCardSum(this.Id)
                    this.totalConsumptionTimes(this.Id);
                }
                if (this.flag3) {
                    this.getTitle(this.Id)
                }
                if (this.flag4) {
                    this.getoders(this.Id, '')
                    this.getreclist('', this.Id);
                    this.getCustomCardSum(this.Id)
                    this.totalConsumptionTimes(this.Id);
                }
                if (this.flag5) {
                    this.getbefore()
                    this.getyu()
                }
                if (this.flag6) {
                    this.getvisit(this.customerName, this.departmentId, localStorage.getItem('userId'));
                }
                if (this.flag7) {
                    this.getlistadd()
                }

            }

        },
        setFlag(index) {
            if (this.Id == '') {
                this.$message.warning('请选择一名顾客');
                return
            }
            this.flag1 = false;
            this.flag2 = false;
            this.flag3 = false;
            this.flag4 = false;
            this.flag5 = false;
            this.flag6 = false;
            this.flag7 = false;
            let flag = 'flag' + (index + 1)
            this[flag] = true;
            if (index == 1) {
                this.getoder(this.Id)
                this.getCustomerInfo()
                this.getCustomCardSum(this.Id)
                this.totalConsumptionTimes(this.Id);
            }
            if (index == 2) {
                this.getTitle(this.Id)
            }
            if (index == 3) {
                this.getoders(this.Id, '')
                this.getreclist('', this.Id)
            }
            if (index == 4) {
                this.getbefore()
                this.getyu();
            }
            if (index == 5) {
                this.getvisit(this.customerName, this.departmentId, localStorage.getItem('userId'));
            }
            if (index == 6) {
                this.getlistadd()
            }
        },
        handleChange() {

        },
        ok() {
            this.chat = '[咨询项目]:\n[职业及消费能力]:\n[有无既往了解史]:\n[是否添加微信 ]:\n[面诊医生]:\n[本次设计方案及报价]:\n[未成交原因]:\n[其他铺垫及建议方案]:\n[其他备注]:'
            this.selectflag = false
        },
        selectAdd() {
            this.selectflag = true;
        },
        totalConsumptionTimes(id) {
            this.$api.user.totalConsumptionTimes(id).then(res => {
                if (res) {
                    this.customCardSum1 = res.data
                }
            })
        },
        getCustomCardSum(id) {
            this.$api.RechargeableCard.customCardSum({
                id: id
            }).then(res => {
                if (res.rows.length !== 0) {
                    this.customCardSum.totalStoredValue = math.add(res.rows[0].groupPrincipal, res.rows[0].groupGift, res.rows[0].companyPrincipal,
                        res.rows[0].companyGift, res.rows[0].departmentalPrincipal, res.rows[0].departmentalGift)
                    this.customCardSum.storedValuePrincipal = math.add(res.rows[0].groupPrincipal, res.rows[0].companyPrincipal,
                        res.rows[0].departmentalPrincipal)
                    this.customCardSum.storedValueGift = math.add(res.rows[0].groupGift, res.rows[0].companyGift, res.rows[0].departmentalGift)
                    this.customCardSum.deposit = res.rows[0].deposit
                    this.customCardSum.advancePayment = res.rows[0].advancePayment
                }
            })
        },
        clearForm() {
            this.form = {
                departmentId: "",
                aestheticConsultant: "",
                customerStatus: '',
                receptionStatus: "",
                isDeal: '',
                deptType: '',
                triageType: '',
                treatment: '',
                doctorId: '',
                channelTypeId: '',
                channelId: '',
                customerName: "",
            }
            this.channelTypeChildren = [];
        },
        receptionListStatistics() {
            this.$set(this.form, 'deptId', this.deptId)
            this.$api.dept.selectReceptionStatistics({
                ...this.form,
                receptionTime: this.form.receptionTime ? this.form.receptionTime[0] : null,
                endreceptionTime: this.form.receptionTime ? this.form.receptionTime[1] : null
            }).then(res => {
                if (res) {
                    this.totalNumber = res.data.totalNumber
                    this.totalPaidAmount = res.data.totalPaidAmount
                    this.regularCustomer = res.data.regularCustomer
                    this.newCustomer = res.data.newCustomer
                    this.newCustomerFitst = res.data.newCustomerFitst
                    this.newCustomerSecond = res.data.newCustomerSecond
                    this.billingPerformance = res.data.billingPerformance
                    this.totalRefund = res.data.totalRefund
                    this.regularCustomerTransaction = res.data.regularCustomerTransaction
                    this.firstTransaction = res.data.firstTransaction
                    this.secondaryTransaction = res.data.secondaryTransaction
                    if (isNaN(math.multiply(math.divide(res.data.regularCustomerTransaction, res.data.regularCustomer).toFixed(2), 100))) {
                        this.regularCustomerTurnoverRate = 0
                    } else {
                        this.regularCustomerTurnoverRate = math.multiply(math.divide(res.data.regularCustomerTransaction, res.data.regularCustomer).toFixed(2), 100)
                    }
                    if (isNaN(math.multiply(math.divide(res.data.firstTransaction, res.data.newCustomerFitst).toFixed(2), 100))) {
                        this.firstTransactionTurnoverRate = 0
                    } else {
                        this.firstTransactionTurnoverRate = math.multiply(math.divide(res.data.firstTransaction, res.data.newCustomerFitst).toFixed(2), 100)
                    }
                    if (isNaN(math.multiply(math.divide(res.data.secondaryTransaction, res.data.newCustomerSecond).toFixed(2), 100))) {
                        this.secondaryTransactionTurnoverRate = 0
                    } else {
                        this.secondaryTransactionTurnoverRate = math.multiply(math.divide(res.data.secondaryTransaction, res.data.newCustomerSecond).toFixed(2), 100)
                    }
                }
            })

        },
        async DemandManagement() {
            // 添加状态
            await this.$api.demand.DemandManagement({ status: '0' }).then((res) => {
                if (res) {
                    this.administration = res.rows;
                    let arr = [];
                    this.DemandData.forEach(value => {
                        let object = {};
                        object.value = value.demandTypeId
                        object.label = value.demandTypeName
                        object.children = this.changedemand(value.demandTypeId)
                        arr.push(object)
                    })
                    this.DemandList = arr;
                }
            })
        },
        changedemand(selection) {
            const data = this.administration.filter((item) => {
                return item.demandTypeId == selection
            })
            data.forEach(value => {
                value.value = value.demandId
                value.label = value.demandName
            })
            return data;
            // this.DemandList = data

        },
        DemandType() {
            // 添加状态
            let data = {
                deptId: this.deptId,
                status: '0'
            }
            this.$api.demand.DemandType(data).then((res) => {
                if (res) {
                    this.DemandData = res.rows
                    this.DemandManagement();
                }
            })
        },
        rowClick(row) {
            this.clear(row)
            let id = row.id;
            this.Id = id;
            this.newform.departmentId = row.departmentId
            this.newform.aestheticConsultant = row.aestheticConsultant
            this.newform.receptionStatus = row.receptionStatus
            this.channelTypeName = row.channelTypeName
            this.newform.customerStatus = row.customerStatus
            this.jdxxId = row.jdxxId;
            this.isDeal = row.isDeal;
            this.customerName = row.customerName
            this.newdepartmentId = row.departmentId
            this.arrivalTime = row.arrivalTime
            this.trueFlag = true
            // this.radio = "2";
            if (this.isDeal == '1') {
                this.isDealFlag = false
            } else {
                this.isDealFlag = true;
            }
            // this.getCustomCardSum(id)
            // this.totalConsumptionTimes(id);
            // this.getInfo(id)
            this.clearflag();
        },
        //获取开单信息
        getoder(id) {
            this.$api.billingList.neworderDetailsList({
                id,
                deptId: this.deptId,
                jdxxId: this.jdxxId
            }).then((res) => {
                if (res) {
                    res.rows.forEach(value => {
                        value.label = value.projectName
                        value.value = value.categoryId
                    })
                    this.billingData = res.rows
                    this.getOk()


                }
            })
        },
        getoders(id, billingDepartment) {
            this.$api.billingList.neworderDetailsList({
                id,
                deptId: this.deptId,
                billingDepartment: this.xfdepart,
            }).then((res) => {
                if (res) {
                    this.billingDatanews = res.rows
                    this.getOks(this.xfdepart)


                }
            })
        },
        getInfo(id) {
            this.$api.user.getinfo(id).then(res => {
                this.customData = res.data;
                // this.departmentId = res.data.phone
            })
        },
        //获取治疗记录
        getreclist(departmentId, id) {
            this.$api.medical.selectTreatment({
                customerName: this.customerName,
                departmentId: this.xfdeparts,
                id,
                aestheticConsultant: localStorage.getItem('userId')
            }).then(res => {
                this.stbillingData = res.rows;
            }
            )
        },
        //获取已到院回访记录
        getvisit(customerName, customPhone, planReturnUser) {
            let data = {
                deptId: this.deptId,
                customerName,
                customPhone,
                planReturnUser: this.radio == '1' ? '' : planReturnUser,
                id: this.Id,
            }
            this.$api.modules.netPower.AlreadyArrivedList(data).then(res => {
                if (res) {
                    if (this.radio == '2') {
                        this.tableDatavisittwo = res.rows;
                        this.getlistColor()
                    } else {
                        this.tableDatavisit = res.rows
                        this.getnovisit(customerName, customPhone, planReturnUser)
                    }

                }
            }).finally(() => {

            })
        },
        //获取未到院回访记录
        getnovisit(customerName, customPhone, planReturnUser) {
            let data = {
                deptId: this.deptId,
                customerName,
                customPhone,
                planReturnUser: this.radio == '1' ? '' : planReturnUser,
                id: this.Id,
            }
            this.$api.modules.netPower.returnVisitPlan(data).then(res => {
                this.tableDatavisittwo = this.tableDatavisit.concat(res.rows)
                this.getlistColor()
            })
            this.$forceUpdate();
        },
        //设置已到院未到院结果
        getlistColor() {
            this.tableDatavisittwo.forEach(value => {
                value.reportTime = value.reportTime.split(' ')[0];
                if (value.returnStage == 0) {
                    value.returnStage = ""
                } else {
                    value.returnStage = String(value.returnStage)
                }

                if (value.returnExecutorUser == 0) {
                    value.returnExecutorUser = "";
                } else {
                    value.returnExecutorUser = Number(value.returnExecutorUser)
                }
            })
            this.$nextTick(function () {
                let selcolor = document.querySelector('.menus .el-table__body-wrapper tbody').children;
                this.tableDatavisittwo.forEach((value, index) => {
                    selcolor[index].children[3].children[0].children[0].children[0].style.color = ''
                    selcolor[index].children[4].children[0].children[0].children[0].children[0].style.color = ''
                    selcolor[index].children[5].children[0].children[0].children[0].children[0].style.color = ''
                    selcolor[index].children[6].children[0].children[0].children[0].style.color = ''
                    selcolor[index].children[7].children[0].children[0].children[0].style.color = ''
                    selcolor[index].children[9].children[0].children[0].children[0].children[0].style.color = ''
                })
            })
        },
        clear(row) {
            this.activities.forEach((value, index) => {
                if (index <= Number(row.receptionStatus)) {
                    if (row.receptionStatus == '2' && row.isDeal == '2') {
                        value.color = '#0bbd87'
                        value.type = 'success'
                        value.icon = 'el-icon-check'
                        value.timestamp = '';
                        if (index == Number(row.receptionStatus)) {
                            this.activities[index + 1].color = '#0bbd87'
                            this.activities[index + 1].type = 'success'
                            this.activities[index + 1].icon = 'el-icon-check'
                            let h = row.receptionTime.split(' ');
                            let y = h[0].split('-')
                            let z = y[1] + '-' + y[2]
                            this.activities[index + 1].timestamp = z + ' ' + h[1]
                            this.$set(this.activities, 3, this.activities[index + 1])

                        }


                    } else {
                        value.color = '#0bbd87'
                        value.type = 'success'
                        value.icon = 'el-icon-check'
                        value.timestamp = '';
                        if (index == Number(row.receptionStatus)) {
                            let h = row.receptionTime.split(' ');
                            let y = h[0].split('-')
                            let z = y[1] + '-' + y[2]
                            value.timestamp = z + ' ' + h[1]
                        }

                    }


                }
                else {
                    if (row.receptionStatus == '2' && row.isDeal == '2') {
                    } else {
                        value.timestamp = '';
                        value.color = '';
                        value.icon = '';
                        value.type = ''
                    }

                }

            })
        },
        customerclick(id, val) {
            this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal } })
        },
        search() {
            this.$set(this.form, 'deptId', this.deptId);
            this.$api.dept.MyReception({
                ...this.form, ...this.pagination,
                receptionTime: this.form.receptionTime ? this.form.receptionTime[0] : null,
                endreceptionTime: this.form.receptionTime ? this.form.receptionTime[1] : null
            }, 'get').then((res) => {
                if (res) {
                    this.tableData = res.rows
                    this.Total = res.total
                    this.receptionListStatistics()
                }
            }).finally(() => {

            })
        },
        channelTypeSelection(selection) {
            if (selection == '') {
                this.channelTypeChildren = [];
                this.form.channelId = ""
                return
            }
            const data = this.channelType.filter(filter => {
                return filter.typeId === selection
            })
            this.channelTypeChildren = data[0].channelInfo
        },
        getChannelInfo() {
            this.$api.modules.channel.getChannelType({
                'deptId': this.deptId,
                'status': 0
            }).then(res => {
                if (res) {
                    this.channelType = res.data
                }
            })
        },
        doctorFilter(val) {
            if (val) {
                this.doctor = this.copyDoctor.filter((item) => {
                    if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
                        return true
                    }
                    return PinyinMatch.match(item.nickName, val)
                })
            } else {
                this.doctor = this.copyDoctor
            }
        },
        unique(arr) {
            const res = new Map()
            return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
        },
        async getUserList(data, result) {
            // 人员添加公司Id 添加状态 添加岗位
            await this.$api.user.getUserList({ data, deptId: this.deptId, status: '0' }).then(res => {
                if (res) {
                    res.data.forEach(item => {
                        item.label = item.nickName
                        item.value = item.userId
                    })
                    // 去重
                    const arr1 = this.unique(res.data)
                    this.sysUserList = arr1
                    this.sysUserList.forEach(value => {
                        if (value.value !== localStorage.getItem('userId')) {
                            this.newsysUserLists.push(value)
                        }
                    })
                    // ---------岗位------
                    res.data.forEach(item => {
                        if (item.postCode == 'doctor') {
                            this.doctor.push(item)
                            this.copyDoctor = this.doctor
                        }
                    }) // 医生
                    // ---------------------
                    res.data.forEach(item => {
                        if (item.postCode == 'xczxs') {
                            this.esthetics.push(item)
                            this.estheticsl.push(item)
                            this.estheticsList = this.esthetics
                            this.estheticsLists = this.estheticsl
                        }
                    }) // 美学顾问
                    // -----------
                    //   res.data.forEach(item => {
                    //     if (item.postCode == 'xczxs') {
                    //       this.customer.push(item)
                    //     }
                    //   })
                }
                this.estheticsl.forEach(value => {
                    if (value.value !== localStorage.getItem('userId')) {
                        this.newestheticsl.push(value)
                    }
                })
            })
        },
        aesFilter(val) {
            if (val) {
                this.esthetics = this.estheticsList.filter((item) => {
                    if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
                        return true
                    }
                    return PinyinMatch.match(item.nickName, val)
                })
            } else {
                this.esthetics = this.estheticsList
            }
        },
        aesFilters(val) {
            if (val) {
                this.estheticsl = this.estheticsLists.filter((item) => {
                    if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
                        return true
                    }
                    return PinyinMatch.match(item.nickName, val)
                })
            } else {
                this.estheticsl = this.estheticsLists
            }
        },
        Department() {
            const data = {
                deptId: this.deptId,
                status: '0',
                isDepartment: '1'
            }
            this.$api.dept.DepartmentList(data, 'get').then((res) => {
                if (res) {
                    this.TriageDepartment = res.rows
                    this.optionschange = res.rows;
                }
            })
        },
        selcolor(index) {
            this.listarr.forEach(value => {
                value.color = ''
            })
            this.listarr[index].color = '#409eff'
            this.name = this.listarr[index].name
            this.setFlag(index)
        },
    },
    data() {
        return {
            newestheticsl: [],
            newsysUserLists: [],
            recorlist: [],
            manualFormRules: {
                isOneReturnVisit: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                planReturnTime: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                taskLevel: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                returnStage: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                grade: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                value1: [
                    { required: true, message: '请选择固定回访时间', trigger: 'change' }
                ]

            },
            // 手工上报回访
            returnVisitRecordList: [
                {
                    isOneReturnVisit: '', //是否一次性回访
                    backupExecutor: '',//后备执行人
                    appointPeople: true,//指定执行人
                    // returnExecutorUser: this.$store.getters.user.userId,
                    planReturnUser: this.$store.getters.user.userId, // 选择执行人
                    taskLevel: '',//任务等级
                    planReturnTime: timeFmt('', new Date()),//计划回访时间
                    returnStage: '', //回访阶段
                    grade: undefined,//任务等级
                    returnUserType: '', // 执行类型
                    backupExecutor: '',// 后备执行人
                    returnVisit: '',//回访目的
                    value1: [],
                    returnVisitFeedback: '',//回访反馈
                    isThrough: '',//是否打通
                    returnExecutorUser: '',//回访执行人

                }
            ],
            selectflag: false,
            returnTypeId: '',
            dialogflag: false,
            readonlys: true,
            selectData: [],
            optionstypeName: [],
            xfdeparts: "",
            changeselects: '',
            xfdepart: "",
            billingDatanews: [],
            billingDataOks: [],
            pickerOptions: {
                firstDayOfWeek: 1,
                shortcuts: [
                    {
                        text: '昨天',
                        onClick(picker) {
                            picker.$emit('pick', beforeDayTime(1))
                        }
                    },
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', todayTime())
                        }
                    },
                    {
                        text: '上周',
                        onClick(picker) {
                            picker.$emit('pick', beforeWeek(1))
                        }
                    },
                    {
                        text: '本周',
                        onClick(picker) {
                            picker.$emit('pick', thisWeek())
                        }
                    },
                    {
                        text: '上月',
                        onClick(picker) {
                            picker.$emit('pick', lastMonth())
                        }
                    },
                    {
                        text: '本月',
                        onClick(picker) {
                            picker.$emit('pick', monthData())
                        }
                    },
                    {
                        text: '上季度',
                        onClick(picker) {
                            picker.$emit('pick', lastQuarter())
                        }
                    },
                    {
                        text: '本季度',
                        onClick(picker) {
                            picker.$emit('pick', thisQuarter())
                        }
                    },
                    {
                        text: '上年',
                        onClick(picker) {
                            picker.$emit('pick', lastYear())
                        }
                    },
                    {
                        text: '本年',
                        onClick(picker) {
                            picker.$emit('pick', thisYear())
                        }
                    },
                    {
                        text: '最近一周',
                        onClick(picker) {
                            picker.$emit('pick', [beforeDayTime(7)[0], todayTime()[1]])
                        }
                    },
                    {
                        text: '最近一月',
                        onClick(picker) {
                            picker.$emit('pick', [beforeDayTime(30)[0], todayTime()[1]])
                        }
                    }
                ]
            },
            billingDataOk: [],
            newdepartmentId: '',
            arrivalTime: '',
            currentPage: 1,
            pageSize: 20,
            customData: '',
            trueFlag: false,
            flag1: false,
            flag2: false,
            flag3: false,
            flag4: false,
            flag5: false,
            flag6: false,
            flag7: false,
            followUpRecord: {
                remark: ''
            },
            departmentId: '',
            isDealFlag: true,
            isDeal: '',
            tableDatavisit: [],
            tableDatavisittwo: [],
            stbillingData: [],
            billingDatatwo: [],
            billingDataflag5: [],
            channelTypeName: "",
            jdxxId: "",
            customerName: "",
            radio: "2",
            Id: 0,
            chat: "",
            changeselect: '',
            manualFormTableData: [],
            TriageDepartment: [],//科室
            esthetics: [],//顾问
            estheticsList: [],//用于搜索
            sysUserList: [],//所有人员
            doctor: [],//医生
            copyDoctor: [],//用于检索医生
            channelType: [],//媒介来源一级
            channelTypeChildren: [],//媒介来源二级
            estheticsl: [],//二级顾问
            estheticsLists: [],//用于检索顾问
            checked: false,
            Total: 0,
            billingData: [],
            DemandList: [],
            DemandData: [],
            administration: [],
            optionsName: [],
            firstTransactionTurnoverRate: 0,
            Adata: {},
            readoy: true,
            totalNumber: 0, // 总人数
            totalPaidAmount: 0, // 实付总金额
            regularCustomer: 0, // 老顾客
            newCustomer: 0, // 新顾客
            newCustomerFitst: 0, // 新客首次
            newCustomerSecond: 0, // 新客二次
            billingPerformance: 0, // 开单业绩
            totalRefund: 0, // 退款总额
            regularCustomerTransaction: 0, // 老客成交
            firstTransaction: 0, // 首次成交
            secondaryTransaction: 0, // 二次成交
            regularCustomerTurnoverRate: 0, // 老客成交率
            firstTransactionTurnoverRate: 0, // 首次成交率
            secondaryTransactionTurnoverRate: 0, // 二次成交率
            customCardSum: {
                totalStoredValue: 0,
                storedValuePrincipal: 0,
                storedValueGift: 0,
                deposit: 0,
                advancePayment: 0,
            },
            customCardSum1: {
                debtAmount: 0,
                departmentPerformance: 0,
                billingPerformance: 0,

            },
            form: {
                departmentId: "",
                receptionTime: todayTime(),
                aestheticConsultant: "",
                customerStatus: '',
                receptionStatus: "",
                isDeal: '',
                deptType: '',
                triageType: '',
                treatment: '',
                doctorId: '',
                channelTypeId: '',
                channelId: '',
                customerName: "",
            },
            pagination: {
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true,
                currentPage: 1
            },
            newform: {
                departmentId: '',
                aestheticConsultant: "",
                receptionStatus: "",
                reason: "",
                demandTypeId: '',
                demandId: "",
                projectName: "",
                customerStatus: "",
            },
            acName: '',
            name: '当前咨询项目',
            tableData: [],
            number: '20',
            checkList: ['停止自动刷新'],
            height: '',
            listarr: [
                {
                    name: '客户资料',
                    color: '#409eff'
                },
                {
                    name: '当前咨询项目',
                    color: ''
                },
                {
                    name: '客户标签',
                    color: ''
                },
                {
                    name: '客户消费',
                    color: ''
                },
                {
                    name: '过往咨询',
                    color: ''
                },
                {
                    name: '回访情况',
                    color: ''
                },
                {
                    name: '客户跟进记录',
                    color: ''
                },
                // {
                //     name: '预约登记',
                //     color: ''
                // },
                // {
                //     name: '客户关系',
                //     color: ''
                // },
                // {
                //     name: '治疗情况',
                //     color: ''
                // },
                // {
                //     name: '其他',
                //     color: ''
                // }
            ],
            activities: [{
                content: '已分诊',
                timestamp: '',
                size: 'large',
                type: '',
                icon: '',
                // icon: 'el-icon-check',
                // color: '#0bbd87'
                color: ''
            }, {
                content: '已接诊',
                timestamp: '',
                size: 'large',
                color: "",
                icon: '',
            },
            {
                content: '结束接诊',
                timestamp: '',
                size: 'large',
                color: "",
                icon: '',
            },
            {
                content: '收银',
                timestamp: '',
                size: 'large',
                color: "",
                icon: '',
            },
            {
                content: '开始治疗',
                timestamp: '',
                size: 'large',
                color: "",
                icon: '',
            },
            {
                content: '结束治疗',
                timestamp: '',
                size: 'large',
                color: "",
                icon: '',
            },
            ],
            options: [
                {
                    value: "0",
                    label: '周阳阳'
                }
            ],
            list: [
                {
                    name: "增加",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "刷新",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "保存",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "恢复",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "处方",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "设置",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "历史",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "助诊",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "照片",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "帮助",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "通知",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "报表",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "查价",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "定金",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "开始",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "结束",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "流程",
                    imgurl: require('@/assets/images/addcustom.png')
                },
                {
                    name: "退出",
                    imgurl: require('@/assets/images/addcustom.png')
                }

            ]
        }
    }
}
</script>
<style scoped lang="scss">
.innerVisitBox {
    margin-top: 20px;

    ul {
        li {
            padding: 6px 10px;
            box-sizing: border-box;
            border-bottom: 1px solid #c3ced5 !important;
            border-top: 1px solid #c3ced5;
            background-color: #f5f5f5;
        }

        .visitContent {
            width: 100%;
            height: 160px;
            padding: 10px 0;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;

            &>div {
                width: 50%;
                padding: 0 20px;
                box-sizing: border-box;

                &>.title {
                    padding: 0 10px;
                    box-sizing: border-box;
                    position: relative;
                    font-weight: bold;
                    margin-bottom: 10px;

                    &:before {
                        position: absolute;
                        display: inline-block;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        width: 3px;
                        background-color: #1abc9c;
                        content: "";
                    }
                }
            }
        }
    }
}

.chatList::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 7px;
}

.chatList::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
    background: #dcdcdc;
}

.chatList::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
    border-radius: 10px;
    background: transparent;
}

.visitBox {
    width: 100%;

    ul {
        list-style: none;

        li {
            padding: 6px 10px;
            box-sizing: border-box;
            border-bottom: 1px solid #c3ced5;
            border-top: 1px solid #c3ced5;
            background-color: #f5f5f5;
        }

        &>li:nth-of-type(odd) {
            border-bottom: none;
        }
    }
}

::v-deep .menus .el-input__inner {
    padding: 0;
    padding-left: 10px;
    // width: 75px;
}

::v-deep .menus .el-input__prefix {
    display: none;
}

::v-deep .el-pager li.active {
    background-color: #1abc9c !important;
    color: #fff;
}

::v-deep .el-table .warning-row {
    background: #ffffff;
}

::v-deep .el-table .success-row {
    background: #7ec5b7;
}

.cj {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #7ec5b7;
}

.ncj {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #666;
}

.deal {
    font-size: 13px;
    height: 30px;
    display: flex;
    align-items: center;
    padding-left: 20px;
}

.pcood {
    display: flex;
}

.pcood {
    width: 25%;
    height: 20px;
}

.customdata {
    width: 100%;
    min-height: 40px;
}

.customdata_children {
    width: 100%;
    min-height: 20px;
    align-items: center;
    justify-content: space-evenly;
    display: flex;
    font-size: 12px;
    margin-top: 10px;
    flex-wrap: wrap;
}

::v-deep .el-table__body tr.current-row>td {
    background-color: #eee !important;
}

::v-deep .menus .el-table__body tr.current-row>td {
    background-color: #eee !important;
}

::v-deep .contain_num_left .el-table__body tr td {
    padding: 3px;
    font-size: 14px;
    cursor: pointer;
}

.smf_top {
    width: 100%;
    height: 100px;
    font-size: 12px !important;
}

.Tops {
    margin-top: 5px;
}

.smf {
    width: 100%;
    margin-top: 10px;
}

.sum_button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 40px;
    flex-wrap: wrap;
}

.Table {
    margin-top: 10px;
}

.sum {
    display: flex;
    align-items: center;
    height: 35px;
    font-size: 12px;
    padding-left: 20px;
    justify-content: space-evenly;
}

.name {
    margin-left: 20px;
    margin-top: 5px;
}

.line_ {
    border-left: 1px solid #999;
    margin-left: 8px;
}

.contain_num_right_top {
    width: 100%;
    min-height: 35px;
    display: flex;
    align-items: center;
    background-color: #eee;
    font-size: 14px;
    padding-left: 20px;
    flex-wrap: wrap;
}

::v-deep .contain_num_left .el-table__header-wrapper th {
    padding: 2px !important;
    font-weight: normal;
    font-size: 12px;
    color: black;


}

::v-deep .el-table__body-wrapper::-webkit-scrollbar {
    height: 8px !important;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 5px !important;
    background: #dcdcdc !important;
}

::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
    background: transparent !important;
}

.contain_num_left {
    width: 50%;
}

.contain_num {
    width: 100%;
    display: flex;
}

.Right {
    margin-right: 20px;
    font-size: 14px;
}

.contain_middle_top_left {
    margin-left: 20px;
}

.contain_middle_top_left span:nth-of-type(1) {
    margin-left: 30px;
    color: #000080;
}

.contain_middle_top_left span:nth-of-type(2) {
    color: #800000;
}

.contain_middle_top {
    width: 100%;
    height: 35px;
    background-color: #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.contain_middle {
    width: calc(100% - 170px);
}

.contain_left_top {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;
}

.contain_left {
    width: 170px;
    overflow-y: scroll;
}

.contain {
    width: 100%;
    display: flex;
    font-size: 15px;
}

.Nheight {
    height: 40px;
    margin-left: 5px;
}

::v-deep .hearder_button .el-button--primary .is-plain {
    height: 40px !important;
}

.hearder_button {
    width: 340px;
    height: 70px;
    display: flex;
    flex-wrap: wrap;
    position: relative;
}

.newLeft {
    margin-left: 24px;
}

.No {
    margin-left: 2px !important;
}

.lemore {
    width: 120px;
    margin-left: 15px;
}

.header_middle_children {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.header_middle {
    width: 200px;
    height: 80px;
    margin-left: 50px;
}

.Lefts {
    margin-left: 10px;
}

.children {
    display: flex;
    position: absolute;
    top: 18px;
    left: 45px;
    align-items: center;
}

.parent {
    position: relative;
}

.header_left {
    width: 80px;
    height: 50px;
    transform: scale(2, 1);
    border-radius: 50%;
    border: 1px solid #aebde6;
    margin-left: 43px;
    display: flex;
    align-items: center;
    /* border-radius: 35px; */
}

.header {
    width: 100%;
    min-height: 80px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 12px;
    background-color: #fff;
    overflow: hidden;
}

/* ::v-deep .Radio .el-radio {
    width: 0px !important;
} */

.Red {
    color: red;
}

.status_top {
    color: #800000;
}

.status {
    width: 300px;
    height: 50px;
    margin-left: 15px;
}

.line {
    border-left: 1px solid #999;
    height: 40px;
    margin-left: 20px;
}

.Left {
    margin-left: 20px;
}

.Img {
    width: 20px;
    height: 20px;
}

.Top {
    width: 100%;
    min-height: 50px;
    display: flex;
    align-items: center;
    background-color: #eee;
    font-size: 12px;
    flex-wrap: wrap;
}

.top_children {
    width: 50px;
    height: 40px;
    text-align: center;

    border-right: 1px solid #999;
    cursor: pointer;
}

.Height {
    height: 10px;
}
</style>