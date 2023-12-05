<template>
    <!--我的接诊列表-->
    <div>
        <SgTable v-if="true" ref="table" :sg-ref="'multipleTable'" :table-data="tableData" :columns="columns" index="序号"
            size="mini" selection border highlight-current-row :pagination="pagination"
            :header-style="{ backgroundColor: '#f8f8f8' }" :pagination-style="{ backgroundColor: '#f8f8f8' }"
            :cell-style="cellStyle" :cell-class-name="cellClassName" @selection-change="handleSelectionChange"
            @size-change="sizeChange" @current-change="change" @row-click="rowClick">
            <div slot="searchBar">
                <el-form ref="form" size="mini" label-width="100px" style="padding-top: 10px">
                    <div style="width: 100%;display: flex;flex-wrap: wrap;align-content: flex-start;" class="startFlag">
                        <el-form-item label="接诊时间 :">
<!--                            <el-date-picker v-model="triagePersonTime" style="width: 200px" clearable type="datetimerange"-->
<!--                                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"-->
<!--                                end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />-->
                          <el-date-picker
                            v-model="triagePersonTime" class="inputWidth"
                            size="mini"
                            type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;" />
                        </el-form-item>
                        <el-form-item label="治疗时间 :">
<!--                            <el-date-picker v-model="treatmentTime" style="width: 200px" clearable type="datetimerange"-->
<!--                                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"-->
<!--                                end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />-->
                          <el-date-picker
                            v-model="treatmentTime" class="inputWidth"
                            size="mini"
                            type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;" />
                        </el-form-item>
                        <el-form-item label="科室 :">
                            <el-select v-model="form.departmentId" filterable clearable style="width: 200px">
                                <el-option v-for="item in TriageDepartment" :key="item.departmentId"
                                    :label="item.departmentName" :value="item.departmentId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="治疗状态 :">
                            <el-select v-model="form.isDeal" filterable clearable style="width: 200px">
                                <el-option v-for="item in dict.type.treatment_type" :key="item.dictValue"
                                    :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="姓名 :">
                            <el-input v-model="form.customerName" clearable style="width: 200px" />
                        </el-form-item>
                        <el-form-item label="客户类型 :">
                            <el-select v-model="form.triageType" filterable clearable style="width: 200px">
                                <el-option v-for="item in customType" :key="item.dictValue" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户代表 :">
                            <el-select v-model="form.isSecondary" filterable clearable style="width: 200px">
                                <el-option v-for="item in customer" :key="item.dictValue" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户卡号 :">
                            <el-input v-model="form.customCardNumber" clearable style="width: 200px" />
                        </el-form-item>
                        <el-form-item label="是否生成业绩 :">
                            <el-select v-model="form.deptType" filterable clearable style="width: 200px">
                                <el-option v-for="item in performance" :key="item.dictValue" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="医助 :">
                            <el-select v-model="form.receptionStatus" filterable clearable style="width: 200px">
                                <el-option v-for="item in physicianAssistantData" :key="item.dictValue" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="手术单号 :">
                            <el-input v-model="form.remark" clearable style="width: 200px" />
                        </el-form-item> -->
                        <el-form-item label="护士 :">
                            <el-select v-model="circulatingNurse" filterable clearable style="width: 200px">
                                <el-option v-for="item in zerennurse" :key="item.dictValue" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="医生 :">
                            <el-select v-model="form.doctorId" filterable clearable style="width: 200px"
                                :filter-method="doctorFilter">
                                <el-option v-for="item in doctor" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目名称 :">
                            <el-input v-model="form.consultationNotes" clearable style="width: 200px" />
                        </el-form-item>
                        <el-form-item label="麻醉师 :">
                            <el-select v-model="form.treatment" filterable clearable style="width: 200px">
                                <el-option v-for="item in anesthesiologistList" :key="item.dictValue" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="美学顾问 :">
                            <el-select v-model="form.aestheticConsultant" filterable clearable style="width: 200px"
                                :filter-method="aesFilter">
                                <el-option v-for="item in esthetics" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="电话 :">
                            <el-input v-model="form.customPhone" clearable style="width: 200px" />
                        </el-form-item>

                        <el-form-item label="实际执行人 :">
                            <el-select v-model="form.membershipLevel" filterable clearable style="width: 200px">
                                <el-option v-for="item in sysUserList" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="服务助理 :">
                            <el-select v-model="form.pregnantWeek" filterable clearable style="width: 200px">
                                <el-option v-for="item in huli" :key="item.value" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="手术开始时间 :">
<!--                            <el-date-picker v-model="form.receptionTime" style="width: 200px" clearable type="datetimerange"-->
<!--                                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"-->
<!--                                end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />-->
                          <el-date-picker
                            v-model="form.receptionTime" class="inputWidth"
                            size="mini"
                            type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;" />
                        </el-form-item>
                        <el-form-item label="手术结束时间 :">
<!--                            <el-date-picker v-model="newreceptionTime" style="width: 200px" clearable type="datetimerange"-->
<!--                                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期"-->
<!--                                end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />-->
                          <el-date-picker
                            v-model="newreceptionTime" class="inputWidth"
                            size="mini"
                            type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px;" />
                        </el-form-item>


                        <!-- <el-form-item label="项目名称" style="visibility: hidden;">
                      <el-input v-model="value1" clearable style="width: 200px;visibility: hidden;"  />
                    </el-form-item> -->
                        <el-form-item label="项目名称" v-show="showFlag">
                            <el-input v-model="form.reservedItems" clearable style="width: 200px" />
                        </el-form-item>
                        <el-form-item label="预约类型" v-show="showFlag">
                            <el-cascader v-model="form.filingType" :options="filingType" :props="props" collapse-tags
                                clearable style="width: 200px" />
                        </el-form-item>
                        <el-form-item label="客户年龄" v-show="showFlag">
                            <el-input v-model="form.customAge" clearable style="width: 200px" />
                        </el-form-item>

                        <el-form-item label="媒介类型" v-show="showFlag">
                            <el-select v-model="form.channelTypeId" value="" filterable clearable style="width: 100px"
                                @change="channelTypeSelection">
                                <el-option v-for="(type, typeIndex) in channelType" :key="typeIndex + 'type'"
                                    :label="type.typeName" :value="type.channelId ? type.channelId : type.typeId" />
                            </el-select>
                            <el-select v-model="form.channelId" style="width: 100px"  filterable clearable value="" class="halfInput"
                                placeholder="请选择">
                                <el-option v-for="(type, typeChildIndex) in channelTypeChildren"
                                    :key="typeChildIndex + 'typeChild'" :label="type.typeName" :value="type.channelId" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="未成交原因" v-show="showFlag">
                            <el-select v-model="form.reason" filterable clearable style="width: 200px">
                                <el-option v-for="item in dict.type.reason_choice" :key="item.value" :label="item.label"
                                    :value="item.label" />
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="项目名称" style="visibility: hidden;">
                      <el-input v-model="value1" clearable style="width: 200px;visibility: hidden;"  />
                    </el-form-item> -->
                        <el-form-item label="接诊单总金额" v-show="showFlag">
                            <el-input v-model="form.transactionMoney" clearable style="width: 200px" />
                        </el-form-item>
                        <el-form-item label="消费能力" v-show="showFlag">
                            <el-select v-model="form.economicCapacity" filterable clearable style="width: 200px">
                                <el-option v-for="item in dict.type.economic_capacity" :key="item.dictValue"
                                    :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否黑名单" v-show="showFlag">
                            <el-select v-model="form.blacklist" filterable clearable style="width: 200px">
                                <el-option v-for="item in dict.type.whether" :key="item.dictValue" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户代表" v-show="showFlag">
                            <el-select v-model="form.customerRepresentative" filterable clearable style="width: 200px">
                                <el-option v-for="item in customer" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="mini" style="margin-left:5px" icon="el-icon-search" type="primary"
                                @click="ReceptionList(true)" >搜索</el-button>
                            <!-- <el-button size="mini" type="primary" @click="more">更多</el-button> -->
                        </el-form-item>
                    </div>
                </el-form>

                <!-- <div style="width: 500px;height: 20px;border: 1px solid red;">
  
            </div>
            <div style="width: 500px;height: 20px;border: 1px solid red;">
    </div>
     <div style="width: 500px;height: 20px;border: 1px solid red;">
     </div>
  <div style="width: 500px;height: 20px;border: 1px solid red;">
  </div>
  <div style="width: 500px;height: 20px;border: 1px solid red;">
  </div> -->

                <el-form ref="form" size="mini" label-width="100px" style="padding-top: 10px">
                    <!-- <el-row class="" style="border:1px solid black;overflow: hidden;display: flex;flex-wrap: wrap;">
                  <el-col :span="4">
                    <el-form-item label="接诊时间 :">
                      <el-date-picker
                        v-model="form.receptionTime"
                        style="width: 200px"
                        clearable
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                      />
                    </el-form-item>
                    <el-form-item label="客户卡号 :">
                      <el-input v-model="form.customCardNumber" clearable style="width: 200px" />
                    </el-form-item>
                    <el-form-item label="咨询备注 :">
                      <el-input v-model="form.consultationNotes" clearable style="width: 200px" />
                    </el-form-item>
                    <el-form-item label="怀孕几周 :">
                      <el-select v-model="form.pregnantWeek" clearable style="width: 200px">
                        <el-option
                          v-for="(pregnantWeek,pregnantWeekIndex) in 52"
                          :key="pregnantWeekIndex+'pregnantWeek'"
                          :label="pregnantWeek+'周'"
                          :value="pregnantWeek"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="科室 :">
                      <el-select v-model="form.departmentId" filterable clearable style="width: 200px">
                        <el-option
                          v-for="item in TriageDepartment"
                          :key="item.departmentId"
                          :label="item.departmentName"
                          :value="item.departmentId"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="科室状态 :">
                      <el-select v-model="form.deptType" filterable clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.new_oldDepartments"
                          :key="item.dictValue"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="处理情况 :">
                      <el-select v-model="form.treatment" filterable clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.treatment"
                          :key="item.dictValue"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="预产期 :">
                      <el-date-picker
                        v-model="form.preProduction"
                        style="width: 200px"
                        clearable
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择预产期时间"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="是否成交 :">
                      <el-select v-model="form.isDeal" clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.whether_deal"
                          :key="item.dictValue"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="接诊状态 :">
                      <el-select v-model="form.receptionStatus" clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.Reception_status"
                          :key="item.dictValue"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="美学顾问 :">
                      <el-select v-model="form.aestheticConsultant" filterable clearable style="width: 200px" :filter-method="aesFilter">
                        <el-option
                          v-for="item in esthetics"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="房间类型 :">
                      <el-select v-model="form.roomTypeId" filterable clearable style="width: 200px">
                        <el-option
                          v-for="item in getRoomTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="姓名 :">
                      <el-input v-model="form.customerName" clearable style="width: 200px" />
                    </el-form-item>
                    <el-form-item label="分诊备注 :">
                      <el-input v-model="form.remark" clearable style="width: 200px" />
                    </el-form-item>
                    <el-form-item label="电话 :">
                      <el-input v-model="form.customPhone" clearable style="width: 200px" />
                    </el-form-item>
                    <el-form-item label="生育状况 :">
                      <el-select v-model="form.fertility" clearable style="width: 200px">
                        <el-option label="1胎" value="1胎" />
                        <el-option label="2胎" value="2胎" />
                        <el-option label="3胎" value="3胎" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="分诊类型 :">
                      <el-select v-model="form.triageType" filterable clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.Triage_type"
                          :key="item.dictValue"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="客户状态 :">
                      <el-select v-model="form.customerStatus" clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.whether_Newguest"
                          :key="item.dictValue"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="会员等级 :">
                      <el-select v-model="form.membershipLevel" clearable style="width: 200px">
                        <el-option
                          v-for="item in member"
                          :key="item.membershipLevel"
                          :label="item.gradeName"
                          :value="item.membershipLevel"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="预计入住时间 :">
                      <el-date-picker
                        v-model="form.reserveRoomTime"
                        style="width: 200px"
                        clearable
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择预计入住时间"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="是否二次来院 :">
                      <el-select v-model="form.isSecondary" clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.whether_secondary"
                          :key="item.dictValue"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="医生 :">
                      <el-select v-model="form.doctorId" filterable clearable style="width: 200px" :filter-method="doctorFilter">
                        <el-option
                          v-for="item in doctor"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        size="mini"
                        style="margin-left:5px"
                        icon="el-icon-search"
                        type="primary"
                        @click="ReceptionList(true)"
                        @keydown.enter.native="ReceptionList(true)"
                      >搜索</el-button>
                      <el-button size="mini" type="primary" @click="more">更多</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :class="{ 'active': isActive }">
                  <el-col :span="4">
                    <el-form-item label="项目名称">
                      <el-input v-model="form.reservedItems" clearable style="width: 200px" />
                    </el-form-item>
                    <el-form-item label="接诊单总金额">
                      <el-input v-model="form.transactionMoney" clearable style="width: 200px" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="预约类型">
                      <el-cascader
                        v-model="form.filingType"
                        :options="filingType"
                        :props="props"
                        collapse-tags
                        clearable
                        style="width: 200px"
                      />
                    </el-form-item>
                    <el-form-item label="消费能力">
                      <el-select v-model="form.economicCapacity" filterable clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.economic_capacity"
                          :key="item.dictValue"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="客户年龄">
                      <el-input v-model="form.customAge" clearable style="width: 200px" />
                    </el-form-item>
                    <el-form-item label="是否黑名单">
                      <el-select v-model="form.blacklist" clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.whether"
                          :key="item.dictValue"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="媒介类型">
                      <el-select
                        v-model="form.channelTypeId"
                        value=""
                        clearable
                        style="width: 100px"
                        @change="channelTypeSelection"
                      >
                        <el-option
                          v-for="(type,typeIndex) in channelType"
                          :key="typeIndex +'type'"
                          :label="type.typeName"
                          :value="type.channelId ? type.channelId : type.typeId"
                        />
                      </el-select>
                      <el-select
                        v-model="form.channelId"
                        style="width: 100px"
                        clearable
                        value=""
                        class="halfInput"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(type,typeChildIndex) in channelTypeChildren"
                          :key="typeChildIndex+'typeChild'"
                          :label="type.typeName"
                          :value="type.channelId"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="客户代表">
                      <el-select v-model="form.customerRepresentative" filterable clearable style="width: 200px">
                        <el-option
                          v-for="item in customer"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="未成交原因">
                      <el-select v-model="form.reason" clearable style="width: 200px">
                        <el-option
                          v-for="item in dict.type.reason_choice"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row> -->
                </el-form>
                <!-- <div style="width: 600px;height: 300px;border: 1px solid black;"></div> -->
            </div>
            <div slot="header" class="header-float">
                <!-- <div >
              <el-form style="float: left;font-size: 14px;margin-right: 15px">
                <p>总人数: {{ totalNumber }}人</p>
                <p>实付总金额: {{ totalPaidAmount.toFixed(2) }}</p>
                <p>老顾客: {{ regularCustomer }}人    新顾客: {{ newCustomer }}人</p>
                <p>新客首次: {{ newCustomerFitst }}人</p>
                <p>新客二次: {{ newCustomerSecond }}人 </p>
              </el-form>
              <el-form style="float: left;font-size: 14px;margin-right: 15px">
                <p>开单业绩: {{ billingPerformance.toFixed(2) }}</p>
                <p>退款总额: {{ totalRefund }}</p>
                <p>老客成交: {{ regularCustomerTransaction }}人</p>
                <p>首次成交: {{ firstTransaction }}人</p>
                <p>二次成交: {{ secondaryTransaction }}人 </p>
              </el-form>
              <el-form style="float: left;font-size: 14px">
                <p>&nbsp;</p>
                <p>不包括辅助治疗、检验和住院</p>
                <p>老客成交率: {{ regularCustomerTurnoverRate }}%</p>
                <p>首次成交率: {{ firstTransactionTurnoverRate }}%</p>
                <p>二次成交率: {{ secondaryTransactionTurnoverRate }}%</p>
              </el-form>
            </div> -->
                <div>
                    <!-- <span style="font-size: 14px"><i class="el-icon-s-fold" style="cursor:pointer" @click="getDialogSreceive"/> 列表清单</span>
              <span style="margin-right:10px;font-size: 14px"><i class="color-block-success" />成交</span>
              <span style="font-size: 14px"><i class="color-block-default" /> 未成交</span> -->
                </div>
                <div>
                    <el-button v-hasPermi="['myReceptiont:Custome:labelcancle']" size="mini" icon="el-icon-edit-outline" plain
                        type="success" @click.stop="customerLabelEdit">取消治疗</el-button>
                    <el-button v-hasPermi="['customerDemand:demandupdate']" size="mini" icon="el-icon-edit-outline" plain
                        type="primary" @click="CustomerDemand">更改治疗记录</el-button>
                    <el-button v-hasPermi="['diagnosis:supplementup']" size="mini" icon="el-icon-edit-outline" plain
                        type="success" @click="supplement">批量修改服务助理</el-button>
                    <!-- <el-button
                v-hasPermi="['customer:supplement']"
                size="mini"
                icon="el-icon-edit-outline"
                plain
                type="primary"
                @click="Supplementary"
              >补充客户信息</el-button>
              <el-button
                v-hasPermi="['myReceptiont:Custome:manual']"
                size="mini"
                icon="el-icon-plus"
                plain
                type="primary"
                @click.stop.native="openManualDialog"
              >手工上报</el-button>
              <el-button
                v-hasPermi="['myReceptiont:Custome:blacklist']"
                size="mini"
                icon="el-icon-s-promotion"
                plain
                type="danger"
                @click="Addblacklist"
              >加入黑名单</el-button> -->
                </div>
            </div>
            <template #custom="data">
                <div v-if="data.props === 'customSex'">
                    <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
                </div>
                <div v-else-if="data.props === 'customerName'">
                    <a @click="customerclick(data.custom.id, data.custom, data.custom.numberId, data.custom.id)">
                        {{ data.custom.customerName }}
                    </a>
                </div>
                <div v-if="data.props === 'isSecondary'">
                    <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
                </div>
                <div v-if="data.props === 'customerStatus'">
                    {{ data.custom.customerStatus == '1' ? "新客户" : '老客户' }}
                </div>

                <div v-if="data.props === 'treatmentStatus'">
                    <!-- {{ data.custom.treatmentStatus == '1' ? '初诊' : '复诊' }} -->
                    <show-dict-data :options="dict.type.treatment_type" :value="data.custom.treatmentStatus" />
                </div>
                <div v-if="data.props === 'generateFlag'">
                    {{ data.custom.generateFlag == '0' ? "未生成" : '已生成' }}
                </div>
                <div v-if="data.props === 'operationType'">
                    {{ data.custom.operationType == '1' ? '门诊' : '住院' }}
                </div>
                <div v-if="data.props === 'anesthesiaMethod'">
                    <show-dict-data :options="dict.type.Anesthesia_mode" :value="data.custom.anesthesiaMethod" />
                </div>
                <div v-if="data.props === 'triageType'">
                    <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType" />
                </div>
                <!-- 职业 -->
                <div v-if="data.props === 'occupation'">
                    <show-dict-data :options="dict.type.occupation" :value="data.custom.occupation" />
                </div>
                <!-- 经济能力 -->
                <div v-if="data.props === 'economicCapacity'">
                    <show-dict-data :options="dict.type.economic_capacity" :value="data.custom.economicCapacity" />
                </div>
                <div v-if="data.props === 'treatment'">
                    <show-dict-data :options="dict.type.treatment" :value="data.custom.treatment" />
                </div>
            </template>
        </SgTable>
        <sg-dialog title="更改治疗记录" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabelDialog = false"
            size="1300px">
            <div slot="out">
                <div style="min-height: 300px;display: flex;">
                    <div class="customleft">
                        <div class="shu">

                        </div>
                        <div>
                            <span class="Left">{{ this.selectionData.length > 0 ? this.selectionData[0].customerName : ''
                            }}</span>
                            <!-- <span class="Left">男</span> -->
                            <span class="Left">{{
                                this.selectionData.length > 0 ? this.selectionData[0].treatmentStatus == '1' ? '初诊' : '复诊' :
                                ''
                            }}</span>
                        </div>
                        <div class="Top">
                            <span class="Left">{{ this.selectionData.length > 0 ? this.selectionData[0].customPhone : ''
                            }}</span>
                        </div>
                        <div class="Top">
                            <span class="Left">美学顾问:</span>
                            <span class="Left">{{ this.selectionData.length > 0 ? this.selectionData[0].acName : ''
                            }}</span>
                        </div>
                        <div class="Top">
                            <span class="Left">欠款:</span>
                            <span class="Left">{{ this.selectionData.length > 0 ? this.selectionData[0].totalArrears : ''
                            }}</span>
                        </div>
                        <div class="Top">
                            <span class="Left">主诊医生:</span>
                            <span class="Left">{{ this.selectionData.length > 0 ? this.selectionData[0].doctorName : ''
                            }}</span>
                        </div>
                    </div>
                    <div class="customright">
                        <div class="customright_top">
                            {{ this.selectionData.length > 0 ?this.selectionData[0].projectName:'' }}
            <span class="spantitem">套餐 </span>&nbsp;
            <span class="spantitem">第{{ this.selectionData.length > 0 ?this.selectionData[0].numberTime:"" }}次治疗</span>&nbsp;
            <span class="spantitem">总次数：{{ this.selectionData.length > 0 ?this.selectionData[0].quantitySum:"" }}</span>&nbsp;
            <span class="spantitem">剩余次数：{{ this.selectionData.length > 0 ?this.selectionData[0].surplusQuantity:"" }}</span>&nbsp;
            <span class="spantitem">已缴费用：{{ this.selectionData.length > 0 ?this.selectionData[0].discountAmount:"" }}</span>&nbsp;
            <span class="spantitem">欠款金额：{{ }}</span>

                        </div>
                        <div class="customright_select">
                            <div class="customright_select_contain">
                                <span class="Red Left">*</span> <span>实际执行人</span>
                                <el-select v-model="newmembershipLevel"  filterable placeholder="请选择" size="mini" class="Width"
                                    clearable>
                                    <el-option v-for="item in newsysUserList" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="customright_select_contain">
                                <span class="Red Left">*</span> <span>服务助理</span>
                                <el-select v-model="newserviceAssistant" filterable placeholder="请选择" size="mini" class="Width"
                                    clearable>
                                    <el-option v-for="item in newhuli" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="customright_select_contain">
                                <span class="Red Left">*</span> <span>治疗时间</span>
                                <el-date-picker v-model="newtreatmentTime" type="date" placeholder="选择日期" size="mini"
                                    class="Width Left" clearable>
                                </el-date-picker>
                            </div>
                            <div class="customright_select_contain">
                                <span class="Red Left">*</span> <span>当前治疗次数</span>
                                <el-input size="mini" style="width:150px;margin-left:20px" v-model="newthisScribingNum"
                                    clearable></el-input>
                            </div>
                            <div class="customright_select_contain">
                                <span style="margin-left:25px">治疗时长</span>
                                <el-input size="mini" style="width:150px;margin-left:20px" v-model="reatmentLength"
                                    clearable></el-input>
                            </div>
                            <!-- <div class="customright_select_contain">
                                <span class="Red Left">*</span> <span>回访类型</span>
                                <el-select v-model="value" placeholder="请选择" size="mini" class="Width">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div> -->
                            <div class="customright_select_contain">
                                <span class="Red Left" style="visibility:hidden">*</span> <span>是否体验</span>
                                <el-select v-model="isExperience" filterable placeholder="请选择" size="mini" class="Width" clearable>
                                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="customright_select_contain">
                                <span class="Red Left" style="visibility:hidden">*</span> <span>护士</span>
                                <el-select v-model="newcirculatingNurse" filterable placeholder="请选择" size="mini" class="Width"
                                    style="margin-left:35px" clearable>
                                    <el-option v-for="item in newzerennurse" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="customright_select_contain">
                                <span class="Red Left" style="visibility:hidden">*</span> <span>仪器</span>
                                <el-select v-model="deviceId" filterable placeholder="请选择" size="mini" class="Width"
                                    style="margin-left:40px">
                                    <el-option v-for="item in deviceList" :key="item.value" :label="item.equipmentName"
                                        :value="item.deviceId" clearable>
                                    </el-option>
                                </el-select>
                            </div>

                        </div>
                        <div>
                            <span class="Left">备注:</span>
                            <div>
                                <el-input type="textarea" :rows="5" placeholder="请输入备注" v-model="remarks" clearable>
                                </el-input>
                            </div>

                        </div>
                        <div style="margin-top:20px">
                            <!-- <el-table :data="curetableData" style="width: 100%">
                                <el-table-column prop="date" label="项目名称" width="180" align="center">
                                </el-table-column>
                                <el-table-column prop="date" label="总次数" width="100" align="center">
                                </el-table-column>
                                <el-table-column prop="date" label="已治疗次数" width="180" align="center">
                                </el-table-column>
                                <el-table-column prop="date" label="退款次数" width="180" align="center">
                                </el-table-column>
                                <el-table-column prop="date" label="剩余治疗次数" width="180" align="center">
                                </el-table-column> <el-table-column prop="date" label="当次治疗次数" width="220" align="center">
                                    <template>
                                        <div style="dispay:flex;align-items:center;justify-content:center"
                                            class="cure_number">
                                            <el-input-number></el-input-number>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table> -->
                        </div>
                    </div>
                </div>
                <div class="bottom_cure">
                    <div style="" class="bottom_width">
                        <el-button type="primary" size="mini" @click="cureok">确定</el-button>
                        <el-button @click="customLabelDialog = false" size="mini">取消</el-button>
                    </div>
                </div>
            </div>
        </sg-dialog>
        <sg-dialog title="批量修改服务助理" :dialog="newcustomLabelDialog" out-top="50px"
            @handleClose="newcustomLabelDialog = false" size="500px">
            <div slot="out" style="height:180px">
                <div class="serverpeople">
                    <div>
                        <span class="Red">*</span>
                        <span>已选择人数</span>
                        <el-input class="Width Left" size="mini" disabled :placeholder="selectionData.length"
                            style="width:250px"></el-input>
                    </div>
                    <!-- <div>
                        <el-input class="Width Left Right" size="mini" placeholder="请输入搜索内容" v-model="mash"></el-input>
                        <el-button size="mini" type="primary" >搜索</el-button>

                    </div> -->
                </div>
                <!-- <div class="serverpeople_remark">
                    <span class="Red">*</span>
                    <span>变更备注</span>
                    <el-input type="textarea" :rows="2" placeholder="请输入变更备注" v-model="textarea" class="Width"
                        style="width:380px">
                    </el-input>
                </div> -->
                <div class="bgserver">
                    <div class="bgserver_top">
                        变更服务助理
                    </div>
                    <div class="bgserverpeople">
                        <span class="Left">变更服务助理</span>

                        <div class="Left" v-for="item in newhuliselect">
                            <el-radio v-model="radio" :label="item.value">{{ item.label }}</el-radio>
                        </div>
                    </div>
                </div>
                <div class="bottom_cure">
                    <div style="" class="bottom_width">
                        <el-button type="primary" size="mini" @click="serverok">确定</el-button>
                        <el-button @click="newcustomLabelDialog = false" size="mini">取消</el-button>
                    </div>
                </div>
            </div>


        </sg-dialog>
        <!-- 手工上报弹层 -->
        <manual-submission :show-manual-dialog="showManualDialog" :inner-dialog="innerDialog"
            :selection-data="selectionData" :action="Action" @closeInnerDialog="closeInnerDialog"
            @closeShowManualDialog="closeShowManualDialog" @setInnerDialog="setInnerDialog" />
        <!--  列表排序弹框    -->
        <Dsort :drow_table="'Receive'" :showDialogS="showDialogSReceive" @showdialogT="showdialogT" :sortList="columns1"
            :selectEnable="selectEnable" ref="Receive" :itemHandleSelectionChange="itemHandleSelectionChange">

        </Dsort>
    </div>
</template>
  
<script>
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter,
  lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear
} from '@/utils/time'
import moment from 'moment'
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog' // 客户标签弹层
import { todayTime } from '@/utils/time'
import { debounce } from '@/utils/throttleAndDebounce'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import { math } from '@/utils/math'
import PinyinMatch from 'pinyin-match'
import Dsort from '@/components/Dsort' //排序页面
import Sortable from 'sortablejs' //排序拖拽

export default {
    name: 'MyReception',
    dicts: ['new_guest', 'whether', 'reason_choice', 'economic_capacity', 'whether_secondary', 'sys_user_sex', 'whether_deal', 'new_oldDepartments', 'whether_Newguest', 'economic_capacity', 'Reception_status', 'Triage_type', 'treatment', 'occupation', 'treatment_type', 'Anesthesia_mode'],
    components: {
        SgTable,
        SgDialog,
        ManualSubmission,
        Dsort
    },
    data() {
        return {
            Action: {},
            tableDatanows: [],
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
            mash: "",
            radio: '',
            newserviceAssistant: "",
            newhuliselect: [],
            remarks: "",
            value1: "",
            deviceList: [],
            newtreatmentTime: '',
            newthisScribingNum: "",
            newcirculatingNurse: '',
            reatmentLength: '',
            deviceId: "",
            isExperience: '',
            options: [],
            options: [
                {
                    value: '0',
                    label: "否"
                },
                {
                    value: '1',
                    label: "是"
                },

            ],


            performance: [
                {
                    value: "0",
                    label: "否"
                },
                {
                    value: '1',
                    label: "是"
                }
            ],
            value: "",
            textarea: "",
            checked: "",
            newmembershipLevel: '',//修改实际执行人
            triagePersonTime:'',//分诊时间
            treatmentTime: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])],//治疗时间
            physicianAssistantData: [],//医助
            anesthesiologistList: [],//麻醉师
            sysUserList: [],//实际执行人
            zerennurse: [],//护士
            Service: [],
            huli: [],//服务助理
            customerName: "",//姓名
            customPhone: "",//电话
            customCardNumber: '',//卡号
            circulatingNurse: '',//护士
            newsysUserList: [],//实际执行人2
            newhuli: [],//服务助理2
            newzerennurse: [],//护士2
            newreceptionTime:'',//手术结束时间
            customType: [
                {
                    value: "1",
                    label: "新客户"
                },
                {
                    value: "2",
                    label: "老客户"
                }
            ],
            newcustomLabelDialog: false,
            showFlag: false,
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
            // 加载蒙版
            showDataDialog: false,
            props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
            filingType: [],
            member: [], // 会员的数据
            isActive: true,
            customLabelDialog: false, // 客户标签
            pagination: {
                pageSize: 20, // 每页显示的条数
                total: 0, // 总条数
                pageNum: 1,
                show: true,
                currentPage: 1
            },
            // 顾客标签数据table
            manualFormTableData: [],
            // 顾客标签类型
            customerLabelTypeData: [],
            customerLabelTypeChildData: [],
            selectionData: [],
            manualFormLoading: false,
            // 媒介来源数据
            // channelType: [],
            type: [], // 二级循环的数据
            typeChildren: [], // 三级循环的数据
            // 一级项目数据
            OneprojectList: [],
            Twoprojects: [],
            Treeproject: [],
            // 来源渠道
            channelType: [],
            channelTypeChildren: [],
            // 手工上报表单
            manualForm: {
                userInfo: {},
                manualReport: {
                    isOneReturnVisit: true
                },
                form: {
                    customerLabelTypeId: undefined,
                    labelDataId: undefined,
                    registerTime: undefined,
                    remark: undefined,
                    labelTypeName: undefined,
                    labelDataName: undefined
                }
            },
            getRoomTypeList: [],
            form: {
                receptionTime:'',
                customCardNumber: undefined,
                consultationNotes: undefined,
                departmentId: undefined,
                deptType: undefined,
                treatment: undefined,
                isDeal:'2',
                receptionStatus: undefined,
                aestheticConsultant: undefined,
                customerName: undefined,
                remark: undefined,
                customPhone: undefined,
                triageType: '1',
                customerStatus: undefined,
                membershipLevel: undefined,
                doctorId: undefined,
                isSecondary: undefined,
                reservedItems: undefined,
                transactionMoney: undefined,
                filingType: undefined,
                economicCapacity: undefined,
                customAge: undefined,
                blacklist: undefined,
                channelTypeId: undefined,
                channelId: undefined,
                customerRepresentative: undefined,
                reason: undefined,
                pregnantWeek: '',
                preProduction: '',
                roomTypeId: '',
                fertility: '',
                reserveRoomTime: '' // 预计入住时间
            }, // 表单的数据
            // 系统用户列表
            esthetics: [],
            estheticsList: [],
            customer: [],
            doctor: [],
            copyDoctor: [],
            innerDialog: false,
            TriageDepartment: [], // 分诊科室数据
            showManualDialog: false, // 手工弹层
            tableData: [],
            curetableData: [{}],
            columns: [
                {
                    lab: '客户姓名',
                    val: 'customerName',
                    custom: 'customerName'
                },
                {
                    lab: '电话',
                    val: 'customPhone',
                    width: 100
                },
                {
                    lab: '客户卡号',
                    val: 'customCardNumber',
                    width: 165
                },
                {
                    lab: '客户类型',
                    val: 'customerStatus',
                    custom: 'customerStatus'
                },
                {
                    lab: '治疗状态',
                    val: 'treatmentStatus',
                    custom: 'treatmentStatus'
                },
                {
                    lab: '科室',
                    val: 'departmentName',
                    width: 120
                },
                {
                    lab: '项目名称',
                    val: 'projectName',
                    width: 300
                },
                {
                    lab: '美学顾问',
                    val: 'acName',
                    width: 160
                },
                {
                    lab: '客户代表',
                    val: 'crName',
                    width:150,
                },
                {
                    lab: '医生',
                    val: 'doctorName',
                    width:150,
                },
                {
                    lab: '实际执行人',
                    val: 'aeuName',
                    width: 140
                },
                {
                    lab: '服务助理',
                    val: 'saName',
                    width:150,
                },
                {
                    lab: '医助',
                    val: 'daName',
                    width:150,

                },
                {
                    lab: '护士',
                    val: 'cnName',
                    width:150,
                    // showOverflowTooltip: true
                },
                {
                    lab: '麻醉师',
                    val: 'alName ',
                    width: 100
                },
                {
                    lab: '麻醉方式',
                    val: 'anesthesiaMethod',
                    custom: 'anesthesiaMethod',
                    width: 150,
                },
                {
                    lab: '当次治疗次数',
                    val: 'thisScribingNum',
                    width: 100
                },
                {
                    lab: '手术类型',
                    val: 'operationType',
                    custom: 'operationType',
                    width: 100
                },
                // {
                //   lab: '会员客服',
                //   val: 'actName',
                //   width: 100
                // },
                {
                    lab: '手术开始时间',
                    val: 'startTime',
                    width: 240,
                    showOverflowTooltip: true
                },
                {
                    lab: '手术结束时间',
                    val: 'endStartTime',
                    width: 240
                },
                {
                    lab: '分诊时间',
                    val: 'triagePersonTime',
                    width: 240
                },
                {
                    lab: '治疗时间',
                    val: 'treatmentTime',
                    width: 240,
                    showOverflowTooltip: true
                },
                {
                    lab: '备注',
                    val: 'remarks',
                    width: 110
                },
                {
                    lab: '是否生成业绩',
                    val: 'generateFlag',
                    custom: "generateFlag",
                    width: 100
                },
                // {
                //     lab: '口腔归属医生/服务助理',
                //     val: 'customAge',
                //     width: 150
                // },
                // {
                //     lab: '皮肤归属医生/服务助理',
                //     val: 'occupation',
                //     custom: 'occupation',
                //     width: 150
                // },
                // {
                //     lab: '无创归属医生/服务助理',
                //     val: ' isSecondary',
                //     width: 150
                // },
                // {
                //     lab: '中医归属医生/服务助理',
                //     val: ' isSecondary',
                //     width: 150
                // },

            ],
            columns1: [
                {
                    lab: '接待时间',
                    val: 'receptionTime',
                    width: 150
                },
                {
                    lab: '客户名称',
                    val: 'customerName',
                    custom: 'customerName'
                },
                {
                    lab: '性别',
                    val: 'customSex',
                    custom: 'customSex'
                },
                {
                    lab: '手机',
                    val: 'customPhone',
                    width: 100
                },
                {
                    lab: '客户卡号',
                    val: 'customCardNumber',
                    width: 165
                },
                {
                    lab: '预约类型',
                    val: 'channelName',
                    showOverflowTooltip: true
                },
                {
                    lab: '客户状态',
                    val: 'customerStatus',
                    custom: 'customerStatus'
                },
                {
                    lab: '预计入住时间',
                    val: 'reserveRoomTime',
                    width: 120
                },
                {
                    lab: '怀孕几周',
                    val: 'pregnantWeek'
                },
                {
                    lab: '预产期',
                    val: 'preProduction',
                    width: 160
                },
                {
                    lab: '房间类型',
                    val: 'roomType'
                },
                {
                    lab: '胎数',
                    val: 'fertility'
                },
                {
                    lab: '科室',
                    val: 'departmentName',
                    width: 140
                },
                {
                    lab: '是否成交',
                    val: 'isDeal',
                    custom: 'isDeal'
                },
                {
                    lab: '处理情况',
                    val: 'treatment',
                    custom: 'treatment'
                },
                {
                    lab: '二次来院',
                    val: 'isSecondary',
                    custom: 'isSecondary'
                    // showOverflowTooltip: true
                },
                {
                    lab: '是否黑名单',
                    val: 'blacklist',
                    custom: 'blacklist',
                    width: 100
                },
                {
                    lab: '咨询备注',
                    val: 'consultationNotes',
                    width: 150,
                    showOverflowTooltip: true
                },
                {
                    lab: '客户意向',
                    val: 'intentionDescription',
                    width: 100,
                    showOverflowTooltip: true
                },
                {
                    lab: '客户代表',
                    val: 'crName',
                    width: 100
                },
                {
                    lab: '线上客服',
                    val: 'ciName',
                    width: 100
                },
                {
                    lab: '美学顾问',
                    val: 'acName',
                    width: 100
                },
                // {
                //   lab: '会员客服',
                //   val: 'actName',
                //   width: 100
                // },
                {
                    lab: '项目',
                    val: 'reservedItems',
                    width: 160,
                    showOverflowTooltip: true
                },
                {
                    lab: '接诊列表编号',
                    val: 'receptionNumber',
                    width: 140
                },
                {
                    lab: '接诊单总金额',
                    val: 'transactionMoney',
                    width: 100
                },
                {
                    lab: '分诊备注',
                    val: 'remark',
                    width: 120,
                    showOverflowTooltip: true
                },
                {
                    lab: '分诊类型',
                    val: 'triageType',
                    custom: 'triageType',
                    width: 110
                },
                {
                    lab: '医生',
                    val: 'diName',
                    width: 100
                },
                {
                    lab: '年龄',
                    val: 'customAge',
                    width: 80
                },
                {
                    lab: '职业',
                    val: 'occupation',
                    custom: 'occupation',
                    width: 80
                },
                {
                    lab: '科室二次',
                    val: ' isSecondary'
                },
                {
                    lab: '媒介类型',
                    val: 'channelTypeName'
                },
                {
                    lab: '分诊人',
                    val: 'gmaName',
                    width: 100
                },
                {
                    lab: '经济能力',
                    val: 'economicCapacity',
                    custom: 'economicCapacity',
                    width: 150
                },
                // {
                //   lab: '会员卡号',
                //   val: 'refereeuserName'
                // },
                {
                    lab: 'qq',
                    val: 'qq',
                    width: 110
                },
                {
                    lab: '微信号',
                    val: 'wechat',
                    showOverflowTooltip: true
                },
                {
                    lab: '科室状态',
                    val: 'deptType',
                    custom: 'deptType'
                },
                {
                    lab: '未成交原因',
                    val: 'reasonName',
                    width: 150
                }
            ],
            // 排序弹框
            showDialogSReceive: false,
            selectionDataSortList: [],//选中的列表数据
            xflagList: [],
            cancelList: [],
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
            this.getChannelInfo(val)
            this.customerLabelType(val)
            this.Department()
            this.deptFilingList()
            this.ReceptionList()
            this.getUserList() // 系统用户列表
        }
    },
    created() {
        this.columns = JSON.parse(localStorage.getItem('flagListReceive')) ? JSON.parse(localStorage.getItem('flagListReceive')) : this.columns
        this.columns1 = JSON.parse(localStorage.getItem('sortListReceive')) ? JSON.parse(localStorage.getItem('sortListReceive')) : this.columns1
        this.selectionDataSortList = JSON.parse(localStorage.getItem('selectionReceive')) ? JSON.parse(localStorage.getItem('selectionReceive')) : this.selectionDataSortList
        this.cancelList = JSON.parse(localStorage.getItem('cancelListReceive')) ? JSON.parse(localStorage.getItem('cancelListReceive')) : this.cancelList

        const this_ = this
        // 点击回车后事件
        // document.onkeydown = function (e) {
        //     if (e.keyCode === 13) {
        //         this_.ReceptionList()
        //     }
        // }
        this.Department() // 科室列表
        this.getUserList() // 系统用户列表
        this.getChannelInfo(this.deptId) // 媒介类型
        this.DepartmentOne() // 科室类型
        this.CategoryThree() // 科室类目
        this.ReceptionList() // 页面一加载就获取数据
        this.customerLabelType(this.deptId) // 标签类型数据
        this.MembershipLevel() // 获取会员等级f
        this.deptFilingList()
        this.RoomTypeList();
        const data = {
            deptId: this.deptId
        }
        this.$api.user.getUserList(data).then(res => {

            res.data.forEach(item => {
                item.label = item.nickName;
                item.value = item.userId
                this.physicianAssistantData.push(item);
                this.sysUserList.push(item);
                this.Service.push(item);
                this.newsysUserList.push(item);
                // this.newhuli.push(item);
            })
            this.sysUserList = this.unique(this.sysUserList);
            this.Service = this.unique(this.Service)
            this.physicianAssistantData = this.unique(this.physicianAssistantData);
            this.newsysUserList = this.unique(this.newsysUserList);
            console.log(this.newsysUserList, 'asdgd')
            // this.newhuli = this.unique(this.newhuli);

        })
    },
    mounted() {
        let that = this;
        document.querySelector('.sg-table-bar-content').style.height = ((document.querySelector('.startFlag').offsetHeight) + 15) + 'px'
        window.addEventListener('resize', function () {
            if (that.$route.path == '/myReception') {
                document.querySelector('.sg-table-bar-content').style.height = ((document.querySelector('.startFlag').offsetHeight) + 15) + 'px'
            } else {

            }

        })
    },
    methods: {
        rowClick(e) {
            // console.log(e)
            this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
        },
        unique(arr) { // 去重字典
            const res = new Map()
            return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
        },
        serverok() {
            let arr = [];
            console.log(this.selectionData,'jehjeiiej')
          this.selectionData.forEach(value => {
            let object = {
              deductionId: value.deductionId,
              serviceAssistant: this.radio,
            }
            arr.push(object)
          })

            this.$api.confinementRoom.editBatchServiceAssistant(arr).then(res => {
                if (res.code == 200) {
                    this.$message.success('批量修改服务助理成功');
                    this.newcustomLabelDialog = false;
                    this.ReceptionList();
                }
            })

        },
        cureok() {
            if (this.newmembershipLevel == '' || this.newmembershipLevel == null) {
                this.$message.warning('请选择实际执行人');
                return;
            }
            if (this.newserviceAssistant == '' || this.newserviceAssistant == null) {
                this.$message.warning('请选择服务助理');
                return;
            }
            if (this.newtreatmentTime == '' || this.newtreatmentTime == null) {
                this.$message.warning('请选择治疗时间');
                return;
            }
            if (this.newthisScribingNum == '' || this.newthisScribingNum == null) {
                this.$message.warning('请输入当前治疗次数');
                return;
            }
            // if (this.isExperience == '' || this.isExperience == null) {
            //     this.$message.warning('请选择是否体验');
            //     return;
            // }
            // if (this.newcirculatingNurse == '' || this.newcirculatingNurse == null) {
            //     this.$message.warning('请选择护士');
            //     return;
            // }
            // if (this.deviceId == '' || this.deviceId == null) {
            //     this.$message.warning('请选择仪器');
            //     return;
            // }
             if(Number(this.newthisScribingNum)>Number(this.selectionData[0].surplusQuantity)){
                this.$message.warning('当次治疗次数不能大于剩余次数');
                return;
             }
            let data = {
                actualExecutorUser: this.newmembershipLevel,
                serviceAssistant: this.newserviceAssistant,
                treatmentTime: this.newtreatmentTime == '' || this.newtreatmentTime == null ? '' : this.newgetData(this.newtreatmentTime),
                thisScribingNum: this.newthisScribingNum,
                deviceId: this.deviceId,
                isExperience: this.isExperience,
                remarks: this.remarks,
                circulatingNurse: this.newcirculatingNurse,
                reatmentLength: this.reatmentLength,
                deductionId: this.selectionData[0].deductionId,
                deptId: this.deptId,
            }
            this.$api.confinementRoom.deductionRecord(data).then(res => {
                if (res.code == 200) {
                    this.$message.success('修改成功')
                    this.ReceptionList();
                    this.customLabelDialog = false;
                }
            })


        },
        // 弹出顺序弹框
        getDialogSreceive() {
            this.showDialogSReceive = true
            if (this.selectionDataSortList.length) {
                this.columns.forEach(item => {
                    this.columns1.forEach(items => {
                        if (item.lab == items.lab) {
                            this.$nextTick(() => {
                                this.$refs.Receive.$refs.sortRef.$refs.sortRefs.toggleRowSelection(items, true)
                            })
                        }
                    })
                })
            } else {
                this.$nextTick(() => {
                    this.$refs.Receive.$refs.sortRef.$refs.sortRefs.toggleAllSelection()
                })
            }
            this.$nextTick(() => {
                this.rowDrop()
            })
        },
        // 在行拖拽的方法进行querySelector的查找时，需对查询到dialog的el-table的类中
        rowDrop() {
            let tbody = document.querySelector('.Receive .el-table__body-wrapper tbody')
            let _this = this
            Sortable.create(tbody, {
                // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
                group: {
                    name: 'words',
                    pull: true,
                    put: true,
                    sort: true,
                    filter: '.flagclass'
                },
                animation: 150, // ms, number 单位：ms，定义排序动画的时间
                onEnd({ newIndex, oldIndex }) { // 结束拖拽
                    let currRow = _this.columns1.splice(oldIndex, 1)[0]
                    _this.columns1.splice(newIndex, 0, currRow)
                    if (_this.cancelList.length) {
                        _this.columns = _this.columns1
                        _this.cancelList.forEach(iten => {
                            _this.columns = _this.columns.filter(mm => mm.lab != iten.lab)
                        })
                    } else {
                        _this.columns = _this.columns1
                        _this.columns1 = _this.columns1
                    }
                    localStorage.setItem('sortListReceive', JSON.stringify(_this.columns1))
                    localStorage.setItem('flagListReceive', JSON.stringify(_this.columns))
                }
            })
        },
        // 在点击列的时候被触发
        itemHandleSelectionChange(selection) {
            this.xflagList = this.columns1
            this.selectionDataSortList = selection[1]
            // localStorage.setItem('sortList',JSON.stringify(this.sortList))
            let selected = selection[1].length && selection[1].indexOf(selection[2]) !== -1
            if (selected == false) {
                this.cancelList.push(selection[2])
                this.cancelList = this.unique1(this.cancelList)
                this.xflagList = []
                this.cancelList.forEach((item1, index1) => {
                    this.columns = this.columns.filter(itemm => itemm.lab !== item1.lab)
                    this.columns = this.unique1(this.columns)
                    localStorage.setItem('flagListReceive', JSON.stringify(this.columns))
                    localStorage.setItem('cancelListReceive', JSON.stringify(this.cancelList))
                })
            } else {
                this.cancelList = this.cancelList.filter(item => item.val != selection[2].val)
                this.columns1.forEach((item1, index1) => {
                    if (item1.lab == selection[2].lab) {
                        if (this.cancelList.length) {
                            this.cancelList.forEach(item => {
                                this.xflagList = this.xflagList.filter(mm => mm.lab != item.lab)
                                this.xflagList.splice(index1, 0, selection[2])
                                this.columns = this.xflagList
                            })
                        } else {
                            this.columns.splice(index1, 0, selection[2])
                        }
                        this.columns = this.unique1(this.columns)
                        localStorage.setItem('flagListReceive', JSON.stringify(this.columns))
                    }
                })
            }
            localStorage.setItem('selectionReceive', JSON.stringify(this.selectionDataSortList))
        },
        // 取消禁用
        selectEnable(row, rowIndex) {
            return true;
        },
        // 去重
        unique1(arr) {
            const res = new Map()
            return arr.filter((arr) => !res.has(arr.lab) && res.set(arr.lab, 1))
        },
        // 排序弹窗关闭
        showdialogT() {
            this.showDialogSReceive = false
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
        /**
         * @author Nevin
         * @date 2022/7/4
         * @Description: 行内样式
        */
        cellStyle({ row, column, rowIndex, columnIndex }) {
            if (row.isDeal === '2') {
                if (columnIndex === 15) {
                    return { 'color': '#ff0000', 'font-weight': '600' }
                }
            }
            if (row.treatment === '1') {
                if (columnIndex === 16) {
                    return { 'color': 'blueviolet', 'font-weight': '600' }
                }
            }
        },
        RoomTypeList() {
            this.$api.confinementRoom.roomTypeInfoList({
                deptId: this.deptId,
                state: '0'
            }).then(res => {
                if (res) {
                    res.rows.forEach(item => {
                        item.label = item.roomType
                        item.value = item.roomTypeId
                    })
                    this.getRoomTypeList = res.rows
                }
            })
        },
        cellClassName({ row, rowIndex }) {
            if (row.isDeal === '1') {
                return 'warning-row'
            } else if (row.isDeal === '2') {
                return 'success-row'
            }
            return ''
        },
        // 更多按钮
        more() {
            this.showFlag = !this.showFlag;
            if (this.showFlag) {

                document.querySelector('.sg-table-bar-content').style.height = ((document.querySelector('.startFlag').offsetHeight) + 50) + 'px'
            } else {
                document.querySelector('.sg-table-bar-content').style.height = ((document.querySelector('.startFlag').offsetHeight) - 100) + 'px'
            }

            // if (!this.isActive) {
            //   this.isActive = true
            // } else {
            //   this.isActive = false
            //   this.SearchBarStyle.height = '100%'
            // }
        },
        // 点击顾客姓名转跳详情页
        customerclick(id, val) {
            this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal } })
        },
        // 获取会员等级数据
        MembershipLevel() {
            this.$api.dept.MembershipLevel().then((res) => {
                if (res) {
                    this.member = res.rows
                }
            })
        },
        // 一级项目事件
        Oneproject(selections) {
            this.form.two = ''
            this.form.three = ''
            const data = this.Twoprojects.filter((item) => {
                return item.departmentId === selections
            })
            this.type = data
        },
        secondLevel(selections) {
            const data = this.Treeproject.filter((item) => {
                return item.projectTypeId === selections
            })
            this.typeChildren = data
        },
        // 二级项目
        DepartmentOne() {
            this.$api.dept.TypeList('get').then((res) => {
                if (res) {
                    this.Twoprojects = res.rows
                }
            })
        },
        // 三级
        CategoryThree() {
            this.$api.dept.CategoryList('get').then((res) => {
                if (res) {
                    this.Treeproject = res.rows
                }
            })
        },
        // 补充客户信息
        Supplementary() {
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客进行修改')
                return
            }
            if (this.selectionData.length > 1) {
                this.$message.warning('只能选择一名顾客')
                return
            }
            this.$router.push({ path: '/customerInformation', query: { id: this.selectionData[0].id } })
        },
        // 补充接诊信息
        supplement() {
            if(this.selectionData.length==0){
               this.$message.warning('请至少选择一名顾客进行修改服务助理');
               return
            }
            this.radio='';
            this.newcustomLabelDialog = true;
            // if (this.selectionData.length < 1) {
            //     this.$message.warning('请选择至少一名顾客进行修改')
            //     return
            // }
            // if (this.selectionData.length > 1) {
            //     this.$message.warning('只能选择一名顾客')
            //     return
            // }
            // this.$router.push({ path: '/supplementaryReceptionInformation', query: { id: this.selectionData[0].id, jdxxId: this.selectionData[0].jdxxId, isDeal: this.selectionData[0].isDeal }, params: { obj: this.selectionData[0] } })
        },
        // CustomerDemand\
        // 客户需求
        CustomerDemand() {
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客进行修改')
                return
            }
            if(this.selectionData[0].generateFlag!==0){
                this.$message.warning('该顾客已治疗，不能修改');
                return;
            }
            this.newmembershipLevel = this.selectionData[0].actualExecutorUser;
            this.newserviceAssistant = this.selectionData[0].serviceAssistant;
            this.newtreatmentTime = this.selectionData[0].treatmentTime;
            this.newthisScribingNum = this.selectionData[0].thisScribingNum
            this.deviceId = this.selectionData[0].deviceId;
            this.isExperience = this.selectionData[0].isExperience;
            this.remarks = this.selectionData[0].remarks;
            this.newcirculatingNurse =Number(this.selectionData[0].circulatingNurse);
            this.customLabelDialog = true;
            this.$api.medical.deviceManagementlist({
                deptId: this.deptId,
                departmentId: this.selectionData[0].departmentId,
                status: '0' // 添加状态
            }).then(res => {
                if (res) {
                    this.deviceList = res.rows
                }
            })
            // if (this.selectionData.length > 1) {
            //   this.$message.warning('只能选择一名顾客')
            //   return
            // }
            // this.$router.push({ path: '/customerDemand', query: { id: this.selectionData[0].id }})
        },
        /**
         * @author Nevin
         * @date 2022/6/29
         * @Description: 统计
        */
        async receptionListStatistics() {
            let filingIds = []
            let typeTwoIds = []
            let typeThreeIds = []
            if (this.form.filingType !== undefined) {
                this.form.filingType.forEach(item => {
                    filingIds.push(item[0])
                    typeTwoIds.push(item[1])
                    typeThreeIds.push(item[2])
                })
                this.form.filingIds = filingIds.join(',')
                this.form.typeTwoIds = typeTwoIds.join(',')
                this.form.typeThreeIds = typeThreeIds.join(',')
            } else {
                filingIds = []
                typeTwoIds = []
                typeThreeIds = []
            }
            this.$set(this.form, 'deptId', this.deptId)
            await this.$api.dept.selectReceptionStatistics({
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
        // 搜索按钮
        ReceptionList: debounce(async function (isSearch) {
            let data = {
                triagePersonTime: this.triagePersonTime == null || this.triagePersonTime == '' ? '' : this.newgetData(this.triagePersonTime[0]),
                EndtriagePersonTime: this.triagePersonTime == null || this.triagePersonTime == '' ? '' : this.newgetData(this.triagePersonTime[1]),
                treatmentTime: this.treatmentTime == null || this.treatmentTime == '' ? '' : this.newgetData(this.treatmentTime[0]),
                EndtreatmentTime: this.treatmentTime == null || this.treatmentTime == '' ? '' : this.newgetData(this.treatmentTime[1]),
                departmentId: this.form.departmentId,//科室
                treatmentStatus: this.form.isDeal,//治疗状态
                customerName: this.form.customerName,//姓名
                customerStatus: this.form.triageType,//客户类型
                customerRepresentative: this.form.isSecondary, //客户代表
                customCardNumber: this.form.customCardNumber,//卡号
                generateFlag: this.form.deptType,//是否生成业绩
                doctorAssistant: this.form.receptionStatus,//医助
                circulatingNurse: this.circulatingNurse,//护士
                doctorId: this.form.doctorId,//医生
                projectName: this.form.consultationNotes,//项目名称
                anesthesiologist: this.form.treatment,//麻醉师
                aestheticConsultant: this.form.aestheticConsultant,//美学顾问
                customPhone: this.customPhone,//电话
                actualExecutorUser: this.form.membershipLevel,//实际执行人
                serviceAssistant: this.form.pregnantWeek,//服务助理
                deptId: this.deptId,//公司
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.pageNum,
                startTime: this.form.receptionTime == '' || this.form.receptionTime == null ? '' : this.newgetData(this.form.receptionTime[0]),//手术开始时间
                EndTime: this.form.receptionTime == '' || this.form.receptionTime == null ? '' : this.newgetData(this.form.receptionTime[1]),//手术开始时间结束
                endStartTime: this.newreceptionTime == '' || this.newreceptionTime == null ? '' : this.newgetData(this.newreceptionTime[0]),//手术结束时间开始
                endEndTime: this.newreceptionTime == '' || this.newreceptionTime == null ? '' : this.newgetData(this.newreceptionTime[1]),//手术结束时间结束
            }
            let newdata = {
                triagePersonTime: this.triagePersonTime == null || this.triagePersonTime == '' ? '' : this.newgetData(this.triagePersonTime[0]),
                EndtriagePersonTime: this.triagePersonTime == null || this.triagePersonTime == '' ? '' : this.newgetData(this.triagePersonTime[1]),
                treatmentTime: this.treatmentTime == null || this.treatmentTime == '' ? '' : this.newgetData(this.treatmentTime[0]),
                EndtreatmentTime: this.treatmentTime == null || this.treatmentTime == '' ? '' : this.newgetData(this.treatmentTime[1]),
                departmentId: this.form.departmentId,//科室
                treatmentStatus: this.form.isDeal,//治疗状态
                customerName: this.form.customerName,//姓名
                customerStatus: this.form.triageType,//客户类型
                customerRepresentative: this.form.isSecondary, //客户代表
                customCardNumber: this.form.customCardNumber,//卡号
                generateFlag: this.form.deptType,//是否生成业绩
                doctorAssistant: this.form.receptionStatus,//医助
                circulatingNurse: this.circulatingNurse,//护士
                doctorId: this.form.doctorId,//医生
                projectName: this.form.consultationNotes,//项目名称
                anesthesiologist: this.form.treatment,//麻醉师
                aestheticConsultant: this.form.aestheticConsultant,//美学顾问
                customPhone: this.customPhone,//电话
                actualExecutorUser: this.form.membershipLevel,//实际执行人
                serviceAssistant: this.form.pregnantWeek,//服务助理
                deptId: this.deptId,//公司
                pageSize: this.pagination.pageSize,
                pageNum: this.pagination.pageNum,
                startTime: this.form.receptionTime == '' || this.form.receptionTime == null ? '' : this.newgetData(this.form.receptionTime[0]),//手术开始时间
                EndTime: this.form.receptionTime == '' || this.form.receptionTime == null ? '' : this.newgetData(this.form.receptionTime[1]),//手术开始时间结束
                endStartTime: this.newreceptionTime == '' || this.newreceptionTime == null ? '' : this.newgetData(this.newreceptionTime[0]),//手术结束时间开始
                endEndTime: this.newreceptionTime == '' || this.newreceptionTime == null ? '' : this.newgetData(this.newreceptionTime[1]),//手术结束时间结束
            }
            this.$api.confinementRoom.getTreatmentRecordList(data).then(res => {
              this.tableData=[];
                this.tableData = res.rows;
                this.pagination.total = res.total
            })
            this.$api.confinementRoom.getTreatmentRecordList(newdata).then(res => {
                this.tableDatanows = res.rows;
            })
            // await this.$api.dept.ReceptionList('get', {
            //     ...this.pagination, ...this.form,
            //     receptionTime: this.form.receptionTime ? this.form.receptionTime[0] : null,
            //     endreceptionTime: this.form.receptionTime ? this.form.receptionTime[1] : null
            // }).then((res) => {
            //     if (res) {
            //         this.tableData = res.rows
            //         this.pagination.total = res.total
            //         this.receptionListStatistics()
            //     }
            // }).finally(() => {
            //     this.showDataDialog = false
            // })
        }),
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
        // 分页组件
        change(e) {
            this.pagination.pageNum = e[1]
            this.pagination.currentPage = e[1]
            this.ReceptionList()
        },
        sizeChange(e) {
            this.pagination.pageSize = e[1]
            this.ReceptionList()
        },
        addCustomerLabelTypeToTable() {
            if (this.manualForm.form.labelDataId === undefined || this.manualForm.form.customerLabelTypeId === undefined) {
                this.$message.error('请先选择标签类型和标签')
                return
            }
            const type = this.customerLabelTypeData.filter(filter => {
                return filter.customerLabelTypeId === this.manualForm.form.customerLabelTypeId
            })
            this.manualForm.form.labelTypeName = type[0].labelTypeName

            const label = this.customerLabelTypeChildData.filter(filter => {
                return filter.customerLabelTypeId === this.manualForm.form.labelDataId
            })
            this.manualForm.form.labelDataName = label[0].labelTypeName

            let flag = true
            this.manualFormTableData.forEach(item => {
                if (item.labelDataId === this.manualForm.form.labelDataId) {
                    flag = false
                    return
                }
            })

            if (flag) {
                this.manualForm.form.customerId = this.manualForm.userInfo.customId
                this.manualForm.form.id = this.selectionData[0].id

                this.addUserLabel(this.manualForm.form)
            } else {
                this.$message.warning('不可重复添加！')
            }
            this.manualForm.form = {
                customerType: 2,
                labelDataId: undefined,
                customerLabelTypeId: undefined,
                labelTypeName: undefined,
                labelDataName: undefined,
                registerTime: undefined,
                remark: undefined
            }
            this.customerLabelTypeChildData = []
        },
        // 获取顾客标签
        customerLabelType(val) {
            /**
             * @author 李尚
             * @date 2022/6/18
             * @Description: 添加状态 添加状态
             */
            const data = {
                deptId: val,
                status: '0'
            }
            this.$api.modules.custLabel.customerLabelType(data).then(res => {
                if (res) {
                    this.customerLabelTypeData = res.data
                }
            })
        },
        // 顾客标签选择
        labelTypeSelection(selection) {
            this.manualForm.form.labelDataId = undefined
            this.customerLabelTypeChildData = []
            const data = this.customerLabelTypeData.filter(filter => {
                return filter.customerLabelTypeId === selection
            })
            this.customerLabelTypeChildData = data[0].customLabelData
        },
        // 客户标签删除按钮
        removeToTable(row) {
            this.$api.modules.netPower.deleteCustomerLabel(row.customerLabelId).then(res => {
                if (res.code === 200) {
                    this.$message.success('删除成功')
                    this.getUserLabelInfo(this.selectionData[0].id)
                }
            })
        },
        // 为顾客添加标签
        addUserLabel(data) {
            // 这里添加标签为正客标签，所以customerType传2
            this.$set(data, 'customerType', 2)
            this.manualFormLoading = true
            this.$api.modules.netPower.addUserLabel(data).then(res => {
                if (res) {
                    this.getUserLabelInfo(this.selectionData[0].id)
                }
            }).finally(() => {
                this.manualFormLoading = false
            })
        },
        // 客户标签
        customerLabelEdit() {
            if (this.selectionData === undefined || this.selectionData[0] === undefined) {
                this.$message.warning('请选择一名顾客进行取消')
                return
            }
            let data = {
                deductionId: this.selectionData[0].deductionId
            }

            this.$api.confinementRoom.getTreatmentRecordCancel(data).then(res => {
                if (res.code == 200) {
                    this.$message.success('取消治疗成功');
                    this.ReceptionList();
                }
            })
        },
        // 获取顾客标签信息
        getUserLabelInfo(id) {
            this.showDataDialog = true
            this.$api.modules.netPower.getUserLabelInfo({ id: id }).then(res => {
                if (res) {
                    res.data.customInfoVo.economicCapacity = res.data.customInfoVo.economicCapacity + ''
                    this.manualForm.userInfo = res.data.customInfoVo
                    this.manualFormTableData = res.data.labelRelations
                    this.customLabelDialog = true
                }
            }).finally(() => {
                this.showDataDialog = false
            })
        },
        handleSelectionChange(e) {
            /**
             * @author Nevin
             * @date 2022/5/10
             * @Description: 表格单选
             */
            this.selectionData = e[1]
            // if (e[1].length > 1) {
            //   this.$refs.table.$refs.multipleTable.clearSelection()
            //   this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
            // }
            // this.selectionData.push(e[1].pop())
            // this.$delete(this.selectionData, 1)
        },
        // 打开手工上报弹窗
        openManualDialog() {
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客进行修改')
                return
            }
            this.Action = this.selectionData[0]
            this.showManualDialog = true
        },
        // 打开高级选项
        setInnerDialog() {
            this.innerDialog = true
            this.showManualDialog = false
        },
        closeShowManualDialog() {
            this.showManualDialog = false
        },
        // 关闭高级选项弹层
        closeInnerDialog() {
            this.innerDialog = false
        },
        // 获取科室的列表
        Department() {
            /**
             * @author 李尚
             * @date 2022/6/18
             * @Description: 添加状态
             */
            const data = {
                deptId: this.deptId,
                status: '0',
                isDepartment: '1'
            }
            this.$api.dept.DepartmentList(data, 'get').then((res) => {
                if (res) {
                    this.TriageDepartment = res.rows
                    this.OneprojectList = res.rows
                }
            })
        },
        // 获取用户列表
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
                    // this.sysUserList = arr1
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
                            this.estheticsList = this.esthetics
                        }
                    }) // 美学顾问
                    res.data.forEach(item => {
                        if (item.postCode === 'anesthesiologist') {
                            this.anesthesiologistList.push(item)
                            // this.options.anesthesiologist.options.push(item)
                        }//麻醉师
                    })
                    res.data.forEach(item => {
                        if (item.postCode === 'zerennurse') {
                            this.zerennurse.push(item)
                            this.newzerennurse.push(item)
                        }
                    })
                    res.data.forEach(item => {
                        if (item.postCode === 'huli') {
                            this.huli.push(item);
                            this.newhuli.push(item);
                            this.newhuliselect.push(item)
                        }
                    })
                    // -----------
                    res.data.forEach(item => {
                        if (item.postCode == 'xczxs') {
                            this.customer.push(item)
                        }
                    })
                }
            })
        },
        unique(arr) {
            const res = new Map()
            return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
        },
        // 获取建档类型
        deptFilingList() {
            /**
             * @author 李尚
             * @date 2022/6/18
             * @Description: 添加状态
             */
            const data = {
                deptId: this.deptId,
                status: '0'
            }
            this.$api.modules.filing.getFilingTypeById(data).then(res => {
                if (res.data) {
                    this.filingType = res.data
                }
            })
        },
        // 获取渠道信息
        getChannelInfo() {
            /**
             * @author 李尚
             * @date 2022/6/18
             * @Description: 添加状态
             */
            const data = {
                deptId: this.deptId,
                status: '0'
            }
            this.$api.modules.channel.getChannelType(data).then(res => {
                if (res) {
                    this.channelType = res.data
                }
            })
        },
        // 选择媒介来源第一级
        channelTypeSelection(selection) {
            const data = this.channelType.filter(filter => {
                return filter.typeId === selection
            })
            this.channelTypeChildren = data[0].channelInfo
        },
        channelSelection(selection) {
            const data = this.channelTypeChildren.filter(filter => {
                return filter.deptChannelId === selection
            })
            // this.form.channelId = data[0].deptChannelId
            // this.form.channelName = ''
        },
        // 黑名单
        Addblacklist() {
            if (this.selectionData.length < 1) {
                this.$message.warning('请选择至少一名顾客进行修改')
                return
            }
            this.$api.modules.netPower.blacklist({ id: this.selectionData[0].id, blacklist: 1 }).then((res) => {
                if (res) {
                    this.$message.success('加入黑名单成功')
                }
            })
        }
    }
}
</script>
  
<style scoped lang="scss">
.serverpeople_remark {
    display: flex;
    margin-top: 20px
}

.bgserver {
    min-height: 80px;
    border: 1px solid #eee;
    margin-top: 20px;
    border-radius: 15px;
    position: relative
}

.bgserverpeople {
    margin-top: 20px;
    width: 100%;
    min-height: 20px;
    display: flex;
    flex-wrap: wrap;

}

.bgserver_top {
    height: 10px;
    position: absolute;
    left: 30px;
    top: -10px;
    background-color: #fff;
}

.Right {
    margin-right: 10px
}

.serverpeople {
    height: 30px;
    display: flex;
    justify-content: space-between
}

::v-deep .el-table__row td {
    padding: 2px
}

::v-deep .cure_number .el-input__inner {
    padding: 0;
    text-align: left;
    padding-left: 10px;
    height: 30px
}

::v-deep .el-input-number__decrease {
    display: none
}

::v-deep .el-input-number__increase {
    display: none
}

.Width {
    width: 150px;
    margin-left: 10px;
}

.Red {
    color: red
}

.bottom_cure {
    position: absolute;
    width: 100%;
    height: 60px;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center
}

.bottom_width {
    width: 160px;
    height: 40px;
}

.customright_select_contain {
    margin-bottom: 10px
}

.customright_select {
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
}

.Left {
    margin-left: 10px;
}

.Top {
    margin-top: 10px;
}

.customright_top {
    width: 100%;
    height: 40px;
    background-color: #f5f5f5;
    padding-left: 20px;
    line-height: 40px;
}

.customleft {
    width: 180px;
    height: 100%;
    position: relative;
    // border: 1px solid red;
}

.shu {
    position: absolute;
    width: 2px;
    height: 300px;
    background-color: #409eff;
}

.customright {
    width: calc(100% - 180px);
    height: 100%;
    // border: 1px solid red;
}

.header-float {
    width: 100%;
    display: flex;
    /*弹性布局能够扩展和收缩 flex 容器内的元素，以最大限度地填充可用空间*/
    justify-content: space-between;
    /*两端对齐，盒子之间的间隔都相等*/
    align-items: center;
    /*位于容器的中心*/
    flex-wrap: wrap;
}

/*全绿 正方形*/
.color-block-success {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 4px;
    background-color: #7ec5b7;
    border-radius: 2px;
    border: 1px solid #7ec5b7;
}

/*变绿 内白 正方形*/
.color-block-default {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 4px;
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid #7ec5b7;
}

/*全白正方形*/
.color-block-white {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 4px;
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid #fff;
}

.boxjiezhen {
    width: 100%;
    height: 100%;
    padding: 0;
    position: fixed;
}

.searchBar {
    //height: 30%;
}

.active {
    display: none;
}

::v-deep .el-icon-time {
    display: none;
}

::v-deep thead .el-table-column--selection .cell {
    // display: none;
}

::v-deep.el-form-item--mini .el-form-item__label {
    font-size: 12px !important;
}

.el-form-item__label {
    font-size: 12px !important;
}

::v-deep .data-sg-table .sg-table-bar-content .sg-table-bar {
    height: 220px !important;
}

::v-deep .el-table .warning-row {
    background: #ffffff;
}

::v-deep .el-table .success-row {
    background: #7ec5b7;
}

//日期边框
::v-deep .el-date-editor .el-range__close-icon {
    width: 12px;
}

::v-deep .el-range-editor.el-input__inner {
    padding: 3px 15px;
}</style>
  