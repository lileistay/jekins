<template>
  <!--我的接诊列表-->
  <div>
      <SgTable
        v-if="true"
        ref="table"
        :sg-ref="'multipleTable'"
        :table-data="tableData"
        :columns="columns"
        index="序号"
        size="mini"
        selection
        border
        highlight-current-row
        :pagination="pagination"
        :header-style="{backgroundColor:'#f8f8f8'}"
        :pagination-style="{backgroundColor:'#f8f8f8'}"
        :cell-style="cellStyle"
        :cell-class-name="cellClassName"
        @selection-change="handleSelectionChange"
        @size-change=" sizeChange"
        @current-change="change"
      >
        <div slot="searchBar">
            <el-form ref="form" size="mini" label-width="100px" style="padding-top: 10px">
              <div style="width: 100%;display: flex;flex-wrap: wrap;align-content: flex-start;" class="startFlag">
              <el-form-item label="接诊时间 :">
<!--                    <el-date-picker-->
<!--                      v-model="form.receptionTime"-->
<!--                      style="width: 200px"-->
<!--                      clearable-->
<!--                      type="datetimerange"-->
<!--                      format="yyyy-MM-dd HH:mm:ss"-->
<!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                      start-placeholder="开始日期"-->
<!--                      end-placeholder="结束日期"-->
<!--                      :default-time="['00:00:00', '23:59:59']"-->
<!--                    />-->
                <el-date-picker
                  v-model="form.receptionTime" class="inputWidth"
                  type="datetimerange" align="right" unlink-panels format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                  :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']" style="width: 200px" />
                  </el-form-item>
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
                  <el-form-item label="是否成交 :">
                    <el-select v-model="form.isDeal" filterable clearable style="width: 200px">
                      <el-option
                        v-for="item in dict.type.whether_deal"
                        :key="item.dictValue"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="姓名 :">
                    <el-input v-model="form.customerName"  clearable style="width: 200px" />
                  </el-form-item>
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
                  <el-form-item label="是否二次来院 :">
                    <el-select v-model="form.isSecondary" filterable clearable style="width: 200px">
                      <el-option
                        v-for="item in dict.type.whether_secondary"
                        :key="item.dictValue"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="客户卡号 :">
                    <el-input v-model="form.customCardNumber" clearable style="width: 200px" />
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
                  <el-form-item label="接诊状态 :">
                    <el-select v-model="form.receptionStatus" filterable clearable style="width: 200px">
                      <el-option
                        v-for="item in dict.type.Reception_status"
                        :key="item.dictValue"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="分诊备注 :">
                    <el-input v-model="form.remark" clearable style="width: 200px" />
                  </el-form-item>
                  <el-form-item label="客户状态 :">
                    <el-select v-model="form.customerStatus" filterable clearable style="width: 200px">
                      <el-option
                        v-for="item in dict.type.whether_Newguest"
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
                  <el-form-item label="咨询备注 :">
                    <el-input v-model="form.consultationNotes" clearable style="width: 200px" />
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

                  <el-form-item label="电话 :">
                    <el-input v-model="form.customPhone" clearable style="width: 200px" />
                  </el-form-item>

                  <el-form-item label="会员等级 :">
                    <el-select v-model="form.membershipLevel" filterable clearable style="width: 200px">
                      <el-option
                        v-for="item in member"
                        :key="item.membershipLevel"
                        :label="item.gradeName"
                        :value="item.membershipLevel"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="怀孕几周 :">
                    <el-select v-model="form.pregnantWeek" filterable clearable style="width: 200px">
                      <el-option
                        v-for="(pregnantWeek,pregnantWeekIndex) in 52"
                        :key="pregnantWeekIndex+'pregnantWeek'"
                        :label="pregnantWeek+'周'"
                        :value="pregnantWeek"
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

                  <el-form-item label="生育状况 :">
                    <el-select v-model="form.fertility" filterable clearable style="width: 200px">
                      <el-option label="1胎" value="1胎" />
                      <el-option label="2胎" value="2胎" />
                      <el-option label="3胎" value="3胎" />
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
                  <!-- <el-form-item label="项目名称" style="visibility: hidden;">
                    <el-input v-model="value1" clearable style="width: 200px;visibility: hidden;"  />
                  </el-form-item> -->
                  <el-form-item label="项目名称" v-show="showFlag">
                    <el-input v-model="form.reservedItems" clearable style="width: 200px" />
                  </el-form-item>
                  <el-form-item label="预约类型" v-show="showFlag">
                    <el-cascader
                      v-model="form.filingType"
                      :options="filingType"
                      :props="props"
                      collapse-tags
                      clearable
                      style="width: 200px"
                    />
                  </el-form-item>
                  <el-form-item label="客户年龄" v-show="showFlag">
                    <el-input v-model="form.customAge" clearable style="width: 200px" />
                  </el-form-item>

                  <el-form-item label="媒介类型" v-show="showFlag">
                    <el-select
                      v-model="form.channelTypeId"
                      value=""
                      clearable filterable
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
                      clearable filterable
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

                  <el-form-item label="未成交原因" v-show="showFlag">
                    <el-select v-model="form.reason" clearable filterable style="width: 200px">
                      <el-option
                        v-for="item in dict.type.reason_choice"
                        :key="item.value"
                        :label="item.label"
                        :value="item.label"
                      />
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
                      <el-option
                        v-for="item in dict.type.economic_capacity"
                        :key="item.dictValue"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否黑名单" v-show="showFlag">
                    <el-select v-model="form.blacklist" filterable clearable style="width: 200px">
                      <el-option
                        v-for="item in dict.type.whether"
                        :key="item.dictValue"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="客户代表" v-show="showFlag">
                    <el-select v-model="form.customerRepresentative" filterable clearable style="width: 200px">
                      <el-option
                        v-for="item in customer"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item >
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
          <div >
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
          </div>
          <div>
              <span style="font-size: 14px"><i class="el-icon-s-fold" style="cursor:pointer" @click="getDialogSreceive"/> 列表清单</span>
            <span style="margin-right:10px;font-size: 14px"><i class="color-block-success" />成交</span>
            <span style="font-size: 14px"><i class="color-block-default" /> 未成交</span>
          </div>
          <div>
            <el-button
              v-hasPermi="['myReceptiont:Custome:label']"
              size="mini"
              icon="el-icon-edit-outline"
              plain
              type="success"
              @click.stop="customerLabelEdit"
            >客户标签</el-button>
            <el-button
              v-hasPermi="['customerDemand:demand']"
              size="mini"
              icon="el-icon-edit-outline"
              plain
              type="primary"
              @click="CustomerDemand"
            >客户需求</el-button>
            <el-button
              v-hasPermi="['diagnosis:supplement']"
              size="mini"
              icon="el-icon-edit-outline"
              plain
              type="success"
              @click="supplement"
            >补充接诊信息</el-button>
            <el-button
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
            >加入黑名单</el-button>
          </div>
        </div>
        <template #custom="data">
          <div v-if="data.props === 'customSex'">
            <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
          </div>
          <div v-else-if="data.props==='customerName'">
            <a @click="customerclick(data.custom.id, data.custom,data.custom.numberId,data.custom.id)">
              {{ data.custom.customerName }}
            </a>
          </div>
          <div v-if="data.props === 'isSecondary'">
            <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
          </div>
          <div v-if="data.props === 'customerStatus'">
            <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
          </div>
          <div v-if="data.props === 'blacklist'">
            <show-dict-data :options="dict.type.whether" :value="data.custom.blacklist" />
          </div>
          <div v-if="data.props === 'deptType'">
            <show-dict-data :options="dict.type.new_oldDepartments" :value="data.custom.deptType" />
          </div>
          <div v-if="data.props === 'isDeal'">
            <show-dict-data :options="dict.type.whether_deal" :value="data.custom.isDeal" />
          </div>
          <div v-if="data.props==='triageType'">
            <show-dict-data :options="dict.type.Triage_type" :value="data.custom.triageType" />
          </div>
          <!-- 职业 -->
          <div v-if="data.props==='occupation'">
            <show-dict-data :options="dict.type.occupation" :value="data.custom.occupation" />
          </div>
          <!-- 经济能力 -->
          <div v-if="data.props==='economicCapacity'">
            <show-dict-data :options="dict.type.economic_capacity" :value="data.custom.economicCapacity" />
          </div>
          <div v-if="data.props==='treatment'">
            <show-dict-data :options="dict.type.treatment" :value="data.custom.treatment" />
          </div>
        </template>
      </SgTable>
      <sg-dialog title="修改客户标签" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabelDialog=false">
        <div slot="out">
          <div class="dialog-box">
            <div class="title">
              <div>客户基本信息</div>
            </div>
            <div class="content">
              <el-form label-width="80px" size="mini" disabled>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="客户姓名">
                      <el-input v-model="manualForm.userInfo.customerName" class="full-width" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="客户电话">
                      <el-input v-model="manualForm.userInfo.customPhone" class="full-width" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="客户性别">
                      <el-select v-model="manualForm.userInfo.customSex" filterable class="full-width" placeholder="请选择性别">
                        <el-option
                          v-for="dict in dict.type.sys_user_sex"
                          :key="dict.dictValue"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="经济能力">
                      <el-select v-model="manualForm.userInfo.economicCapacity" filterable class="full-width" placeholder="请选择">
                        <el-option
                          v-for="dict in dict.type.economic_capacity"
                          :key="dict.dictValue"
                          :value="dict.value"
                          :label="dict.label"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="建档时间">
                      <el-input v-model="manualForm.userInfo.createTime" class="full-width" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="线上客服">
                      <el-input v-model="manualForm.userInfo.onlineUserName" class="full-width" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div class="dialog-box">
            <div class="title">
              <div>添加标签</div>
            </div>
            <div class="content">
              <el-form label-width="80px" size="mini" :disabled="manualFormLoading">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="标签类型">
                      <el-select
                        v-model="manualForm.form.customerLabelTypeId"
                        class="full-width" filterable
                        placeholder="请选择标签类型"
                        @change="labelTypeSelection"
                      >
                        <el-option
                          v-for="(labelType,labelTypeIndex) in customerLabelTypeData"
                          :key="labelTypeIndex+'labelType'"
                          :label="labelType.labelTypeName"
                          :value="labelType.customerLabelTypeId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="标签">
                      <el-select v-model="manualForm.form.labelDataId" filterable class="full-width" placeholder="请选择标签">
                        <el-option
                          v-for="(labelTypeChild,labelTypeChildIndex) in customerLabelTypeChildData"
                          :key="labelTypeChildIndex+'labelTypeChild'"
                          :label="labelTypeChild.labelTypeName"
                          :value="labelTypeChild.customerLabelTypeId"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="登记时间">
                      <el-date-picker
                        v-model="manualForm.form.registerTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        class="full-width"
                        placeholder="选择日期"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="备注信息">
                      <el-input
                        v-model="manualForm.form.remark"
                        placeholder="请输入备注信息"
                        type="textarea"
                        :rows="3"
                        resize="none"
                        class="full-width"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        :disabled="manualFormLoading"
                        @click.stop="addCustomerLabelTypeToTable"
                      >添加</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div class="dialog-box">
            <div class="title">
              <div>顾客标签</div>
            </div>
            <div class="content">
              <el-table
                :data="manualFormTableData"
                stripe
                size="mini"
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                  align="center"
                />
                <el-table-column
                  prop="labelDataName"
                  label="标签"
                  align="center"
                />
                <el-table-column
                  prop="createBy"
                  label="登记人"
                  align="center"
                />
                <el-table-column
                  prop="createTime"
                  label="登记日期"
                  width="140"
                  align="center"
                />
                <el-table-column
                  prop="remark"
                  label="备注"
                  width="200"
                  align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="address"
                  label="编辑"
                  align="center"
                  width="80"
                >
                  <template slot-scope="scope">
                    <el-button type="text" size="mini">
                      <span style="color: red" @click.stop="removeToTable(scope.row)">删除</span>
                    </el-button>
                  </template>

                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </sg-dialog>
      <!-- 手工上报弹层 -->
      <manual-submission
        :show-manual-dialog="showManualDialog"
        :inner-dialog="innerDialog"
        :selection-data="selectionData"
        :action="Action"
        :flagnew="true"
        @closeInnerDialog="closeInnerDialog"
        @closeShowManualDialog="closeShowManualDialog"
        @setInnerDialog="setInnerDialog"
        @selectAllpeople="selectAllpeople"
      />
      <!--  列表排序弹框    -->
      <Dsort :drow_table="'Receive'"
             :showDialogS="showDialogSReceive"
             @showdialogT="showdialogT"
             :sortList="columns1"
             :selectEnable="selectEnable"
             ref="Receive"
             :itemHandleSelectionChange="itemHandleSelectionChange"
      >

      </Dsort>
    </div>

</template>

<script>

import moment from 'moment'
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog' // 客户标签弹层
import {
  beforeDayTime,
  beforeWeek,
  lastMonth,
  lastQuarter, lastYear,
  monthData,
  thisQuarter,
  thisWeek, thisYear,
  todayTime
} from '@/utils/time'
import { debounce } from '@/utils/throttleAndDebounce'
import ManualSubmission from '@/components/ManualSubmission/indexTwo'
import { math } from '@/utils/math'
import PinyinMatch from 'pinyin-match'
import Dsort from '@/components/Dsort' //排序页面
import Sortable from 'sortablejs' //排序拖拽
export default {
  name: 'MyReception',
  dicts: ['new_guest', 'whether', 'reason_choice', 'economic_capacity', 'whether_secondary', 'sys_user_sex', 'whether_deal', 'new_oldDepartments', 'whether_Newguest', 'economic_capacity', 'Reception_status', 'Triage_type', 'treatment', 'occupation'],
  components: {
    SgTable,
    SgDialog,
    ManualSubmission,
    Dsort
  },
  data() {
    return {
      Action: {},
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
      value1:"",
      showFlag:false,
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
        receptionTime: todayTime(),
        customCardNumber: undefined,
        consultationNotes: undefined,
        departmentId: undefined,
        deptType: '',
        treatment: '',
        isDeal: '',
        receptionStatus: '',
        aestheticConsultant: undefined,
        customerName: undefined,
        remark: undefined,
        customPhone: undefined,
        triageType: undefined,
        customerStatus: '',
        membershipLevel: undefined,
        doctorId: undefined,
        isSecondary: '',
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
      sysUserList: [],
      esthetics: [],
      estheticsList: [],
      customer: [],
      doctor: [],
      copyDoctor: [],
      innerDialog: false,
      TriageDepartment: [], // 分诊科室数据
      showManualDialog: false, // 手工弹层
      tableData: [],
      columns: [
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
          width: 160
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
        showDialogSReceive:false,
        selectionDataSortList:[],//选中的列表数据
        xflagList:[],
        cancelList:[],
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
      this.columns = JSON.parse(localStorage.getItem('flagListReceive'))?JSON.parse(localStorage.getItem('flagListReceive')):this.columns
      this.columns1 = JSON.parse(localStorage.getItem('sortListReceive'))?JSON.parse(localStorage.getItem('sortListReceive')):this.columns1
      this.selectionDataSortList = JSON.parse(localStorage.getItem('selectionReceive'))?JSON.parse(localStorage.getItem('selectionReceive')):this.selectionDataSortList
      this.cancelList = JSON.parse(localStorage.getItem('cancelListReceive'))?JSON.parse(localStorage.getItem('cancelListReceive')):this.cancelList

      const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.ReceptionList()
      }
    }
    this.Department() // 科室列表
    this.getUserList() // 系统用户列表
    this.getChannelInfo(this.deptId) // 媒介类型
    this.DepartmentOne() // 科室类型
    this.CategoryThree() // 科室类目
    this.ReceptionList() // 页面一加载就获取数据
    this.customerLabelType(this.deptId) // 标签类型数据
    this.MembershipLevel() // 获取会员等级f
    this.deptFilingList()
    this.RoomTypeList()
  },
  mounted(){
    let that=this;
    document.querySelector('.sg-table-bar-content').style.height=((document.querySelector('.startFlag').offsetHeight)+15)+'px'
    window.addEventListener('resize',function(){
          if(that.$route.path=='/myReception'){
            document.querySelector('.sg-table-bar-content').style.height=((document.querySelector('.startFlag').offsetHeight)+15)+'px'
          }else{

          }

    })
  },
  methods: {
      // 弹出顺序弹框
      getDialogSreceive(){
          this.showDialogSReceive=true
          if (this.selectionDataSortList.length){
              this.columns.forEach(item=>{
                  this.columns1.forEach(items=>{
                      if (item.lab==items.lab){
                          this.$nextTick(()=>{
                              this.$refs.Receive.$refs.sortRef.$refs.sortRefs.toggleRowSelection(items, true)
                          })
                      }
                  })
              })
          }else {
              this.$nextTick(()=>{
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
                  filter:'.flagclass'
              },
              animation: 150, // ms, number 单位：ms，定义排序动画的时间
              onEnd ({ newIndex, oldIndex }) { // 结束拖拽
                  let currRow = _this.columns1.splice(oldIndex, 1)[0]
                  _this.columns1.splice(newIndex, 0, currRow)
                  if (_this.cancelList.length){
                      _this.columns=_this.columns1
                      _this.cancelList.forEach(iten=>{
                          _this.columns = _this.columns.filter(mm=>mm.lab!=iten.lab)
                      })
                  }else {
                      _this.columns=_this.columns1
                      _this.columns1=_this.columns1
                  }
                  localStorage.setItem('sortListReceive',JSON.stringify(_this.columns1))
                  localStorage.setItem('flagListReceive',JSON.stringify(_this.columns))
              }
          })
      },
      // 在点击列的时候被触发
      itemHandleSelectionChange(selection){
          this.xflagList=this.columns1
          this.selectionDataSortList=selection[1]
          // localStorage.setItem('sortList',JSON.stringify(this.sortList))
          let selected = selection[1].length && selection[1].indexOf(selection[2]) !== -1
          if (selected==false){
              this.cancelList.push(selection[2])
              this.cancelList = this.unique1(this.cancelList)
              this.xflagList=[]
              this.cancelList.forEach((item1,index1)=>{
                  this.columns=this.columns.filter(itemm=>itemm.lab!==item1.lab)
                  this.columns = this.unique1(this.columns)
                  localStorage.setItem('flagListReceive',JSON.stringify(this.columns))
                  localStorage.setItem('cancelListReceive',JSON.stringify(this.cancelList))
              })
          }else {
              this.cancelList=this.cancelList.filter(item=>item.val!=selection[2].val)
              this.columns1.forEach((item1,index1)=>{
                  if (item1.lab==selection[2].lab){
                      if (this.cancelList.length){
                          this.cancelList.forEach(item=>{
                              this.xflagList=this.xflagList.filter(mm=>mm.lab!=item.lab)
                              this.xflagList.splice(index1, 0, selection[2])
                              this.columns = this.xflagList
                          })
                      }else {
                          this.columns.splice(index1, 0, selection[2])
                      }
                      this.columns = this.unique1(this.columns)
                      localStorage.setItem('flagListReceive',JSON.stringify(this.columns))
                  }
              })
          }
          localStorage.setItem('selectionReceive',JSON.stringify(this.selectionDataSortList))
      },
      // 取消禁用
      selectEnable(row, rowIndex){
          return true;
      },
      // 去重
      unique1(arr) {
          const res = new Map()
          return arr.filter((arr) => !res.has(arr.lab) && res.set(arr.lab, 1))
      },
      // 排序弹窗关闭
      showdialogT(){
          this.showDialogSReceive=false
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
      this.showFlag=!this.showFlag;
      if(this.showFlag){

        document.querySelector('.sg-table-bar-content').style.height=((document.querySelector('.startFlag').offsetHeight)+100)+'px'
      }else{
        document.querySelector('.sg-table-bar-content').style.height=((document.querySelector('.startFlag').offsetHeight)-100)+'px'
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
      this.$router.push({ path: 'customerInfo', query: { id, status: val.customerStatus, noDeal: val.isDeal }})
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
      this.$router.push({ path: '/customerInformation', query: { id: this.selectionData[0].id }})
    },
    // 补充接诊信息
    supplement() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      if (this.selectionData.length > 1) {
        this.$message.warning('只能选择一名顾客')
        return
      }
      this.$router.push({ path: '/supplementaryReceptionInformation', query: { id: this.selectionData[0].id, jdxxId: this.selectionData[0].jdxxId, isDeal: this.selectionData[0].isDeal }, params: { obj: this.selectionData[0] }})
    },
    // CustomerDemand\
    // 客户需求
    CustomerDemand() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      if (this.selectionData.length > 1) {
        this.$message.warning('只能选择一名顾客')
        return
      }
      this.$router.push({ path: '/customerDemand', query: { id: this.selectionData[0].id }})
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
    ReceptionList: debounce(async function(isSearch,isShangbao) {
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
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      // this.form.preProduction = moment(this.form.preProduction).format('YYYY-MM-DD')
      // this.form.reserveRoomTime = moment(this.form.reserveRoomTime).format('YYYY-MM-DD')
      this.$set(this.form, 'deptId', this.deptId)
      this.showDataDialog = true
      if(isShangbao){
        await this.$api.dept.ReceptionList('get', {
           ...this.form,
          receptionTime: this.form.receptionTime ? this.form.receptionTime[0] : null,
          endreceptionTime: this.form.receptionTime ? this.form.receptionTime[1] : null
        }).then((res) => {
          if (res) {
             this.selectionData=res.rows
          }
        }).finally(() => {
          this.showDataDialog = false
        })
      }else {
      await this.$api.dept.ReceptionList('get', {
        ...this.pagination, ...this.form,
        receptionTime: this.form.receptionTime ? this.form.receptionTime[0] : null,
        endreceptionTime: this.form.receptionTime ? this.form.receptionTime[1] : null
      }).then((res) => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.receptionListStatistics()
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }
    }),
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
      this.$set(this.selectionData[0], 'customerType', '2')
      console.log('this.selectionData', this.selectionData)
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.getUserLabelInfo(this.selectionData[0].id)
      this.customLabelDialog = true
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
      await this.$api.user.getUserList({ data,deptId:this.deptId, status: '0' }).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
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
    },
    selectAllpeople(){
      this.ReceptionList(true,true);
    }
  }
}
</script>

<style scoped lang="scss">
.header-float{
  width: 100%;
  display: flex; /*弹性布局能够扩展和收缩 flex 容器内的元素，以最大限度地填充可用空间*/
  justify-content: space-between; /*两端对齐，盒子之间的间隔都相等*/
  align-items: center; /*位于容器的中心*/
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

.boxjiezhen{
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
::v-deep .el-icon-time{
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
}
</style>
