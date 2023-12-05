<template>
  <!--创建预约单 -->
  <el-scrollbar>
    <div >
      <div class="progressBar">
        <ul>
          <li class="active">① 去重</li>
          <li>----</li>
          <li class="active">② 基础信息录入</li>
          <li>----</li>
          <li>③ 创建预约单</li>
          <li>----</li>
          <li>④ 添加完成</li>
        </ul>
        <div style="display: flex">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-s-claim"
            :loading="submitLoading"
            @click.stop="submitForm"
          >保存
          </el-button>
          <!-- <el-button-->
          <!--   size="mini"-->
          <!--   circle-->
          <!--   icon="el-icon-back"-->
          <!--   @click.stop.native="goBack"-->
          <!-- />-->
        </div>
      </div>
      <el-scrollbar :style="styleObjectFun()">
        <div class="formBox">
          <div class="formBodylift">
            <div class="title">建档时间: {{ nowTime }}</div>
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              size="mini"
              :disabled="submitLoading"
              label-width="109px"
            >
              <el-row>
                <el-col :span="8">
                  <el-form-item label="顾客电话" prop="customPhone">
                    <el-input
                      v-model="form.customPhone"
                      disabled
                      style="width: 100%;"
                      class="fullInput"
                      placeholder="请输入客户电话"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="客户姓名" prop="customerName">
                    <el-input v-model="form.customerName" class="fullInput" style="width: 100%;" placeholder="请输入客户姓名" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="顾客性别">
                    <el-select v-model="form.customSex" class="fullInput" style="width: 100%;" placeholder="请选择性别" filterable>
                      <el-option
                        v-for="dict in dict.type.sys_user_sex"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="出生日期">
                    <!--                    form.birthday-->
                    <el-select filterable v-model="yearsModel" placeholder="请选择" style="width:100px; display: none" @change="dateChange(1)">
                      <el-option
                        v-for="item in years"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select filterable v-model="monthsModel" placeholder="请选择" style="width:50%;" @change="dateChange(2)">
                      <el-option
                        v-for="item in months"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <el-select filterable v-model="daysModel" placeholder="请选择" style="width:50%;" @change="dateChange(3)">
                      <el-option
                        v-for="item in days"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="顾客年龄">
                    <el-input-number
                      v-model.number="form.customAge"
                      class="fullInput"
                      placeholder="请输入年龄"
                      style="width: 100%;"
                      :min="0"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="民族" prop="nation">
                    <el-select v-model="form.nation" class="fullInput" filterable style="width: 100%;" placeholder="请选择民族">
                      <el-option
                        v-for="dict in dict.type.nation_list"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="国家/地区" prop="country">
                    <el-select v-model="form.country" class="fullInput" style="width: 100%;" placeholder="请选择国家/地区" filterable>
                      <el-option label="中国大陆" value="0" />
                      <el-option label="中国香港" value="1" />
                      <el-option label="中国澳门" value="2" />
                      <el-option label="中国台湾" value="3" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预产期" prop="preProduction">
                    <el-date-picker
                      v-model="form.preProduction"
                      class="fullInput"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="date"
                      clearable
                      placeholder="请选择预产期"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!--                  v-hasPermi="['share:maternityHotels:add']"-->
                  <el-form-item label="怀孕几周" prop="pregnantWeek">
                    <el-select
                      v-model="form.pregnantWeek"
                      class="fullInput"
                      placeholder="请选择怀孕周数"
                      clearable
                      filterable
                      style="width: 100%;"
                    >
                      <el-option
                        v-for="(pregnantWeek,pregnantWeekIndex) in 52"
                        :key="pregnantWeekIndex+'pregnantWeek'"
                        :label="pregnantWeek+'周'"
                        :value="pregnantWeek"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="省份" >
                    <el-select v-model="form.province" style="width: 100%;" class="fullInput" placeholder="请选择省份" filterable>
                      <el-option
                        v-for="(option, optionxIndex) in areaArr"
                        :key="optionxIndex"
                        :value="option.name"
                        :label="option.name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="经济能力" prop="economicCapacity">
                    <el-select v-model="form.economicCapacity" class="fullInput" style="width: 100%;" placeholder="请选择经济能力" filterable>
                      <el-option
                        v-for="dict in dict.type.economic_capacity"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="媒介来源" prop="channelId" >
                    <el-select
                      v-model="form.channelTypeId"
                      class="halfInput"
                      placeholder="请选择"
                      style="width: 50%;"
                      @change="channelTypeSelection"
                     filterable>
                      <el-option
                        v-for="(type,typeIndex) in channelType"
                        :key="typeIndex +'type'"
                        :label="type.typeName"
                        :value="type.channelId ? type.channelId : type.typeId"
                      />
                    </el-select>
                    <el-select v-model="form.channelId" style="width: 50%;" class="halfInput" placeholder="请选择" filterable>
                      <el-option
                        v-for="(type,typeChildIndex) in channelTypeChildren"
                        :key="typeChildIndex+'channelId'"
                        :label="type.typeName"
                        :value="type.channelId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="市县" >
                    <el-select v-model="form.city" class="fullInput" style="width: 100%;" placeholder="请选择市县" filterable>
                      <el-option
                        v-for="(option, optionIndex) in cityArr"
                        :key="optionIndex"
                        :value="option.name"
                        :label="option.name"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="区"

                  >
                    <el-select
                      v-model="form.area"
                      class="fullInput"
                      placeholder="请选择地区"
                      style="width: 100%;"
                      filterable
                    >
                      <el-option
                        v-for="(options, optionsIndex) in districtArr"
                        :key="optionsIndex"
                        :value="options.name"
                        :label="options.name"
                      />
                    </el-select>
                  </el-form-item>
                  <!--v-hasPermi="['share:maternityHotels:add']"-->
                </el-col>
                <el-col :span="8">
                  <el-form-item label="意向房间" prop="pregnantWeek">
                    <el-select
                      v-model="form.roomTypeId"
                      class="fullInput"
                      placeholder="请选择续约房间"
                      clearable
                      filterable
                      style="width: 100%;"
                    >
                      <el-option
                        v-for="item in roomOptions"
                        :key="item.roomTypeId"
                        :label="item.roomType"
                        :value="item.roomTypeId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- v-hasPermi="['share:maternityHotels:add']"-->
                  <el-form-item label="生育状况">
                    <el-select
                      v-model="form.isFertility"
                      class="halfInput"
                      placeholder="是否生育"
                      style="width: 50%;"
                      @change="birthSelectChange"
                      filterable
                    >
                      <el-option label="是" value="0" />
                      <el-option label="否" value="1" />
                    </el-select>
                    <el-select
                      v-model="form.fertility"
                      class="halfInput"
                      :disabled="parseInt(form.isFertility)===1"
                      placeholder="生育胎数"
                      style="width: 50%;"
                      filterable
                    >
                      <el-option label="1胎" value="1胎" />
                      <el-option label="2胎" value="2胎" />
                      <el-option label="3胎" value="3胎" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <!-- v-hasPermi="['share:maternityHotels:add']"-->
                  <el-form-item label="预计入住时间">
                    <el-date-picker
                      v-model="form.reserveRoomTime"
                      class="fullInput"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      type="date"
                      clearable
                      placeholder="请选择预约时间"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item style="visibility:hidden;">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="公司" prop="deptId">
                    <treeselect
                      v-model="form.deptId"
                      :options="deptOptions"
                      :show-count="true"
                      :clearable="false"
                      :disable-branch-nodes="true"
                      placeholder="请选择公司"
                      style="width: 100%;"
                      @select="handelDeptSelect"
                      :disabled="true"
                    />
                  </el-form-item>
                  <el-form-item label="建档人" prop="createuserId">
                    <el-select
                      v-model="form.createuserId"
                      filterable
                      class="fullInput"
                      placeholder="请选择"
                      style="width: 100%;"
                      :filter-method="mays"


                    >
                      <el-option
                        v-for="(userItem,userIndex) in userList"
                        :key="userIndex+'biling'"
                        :label="userItem.nickName"
                        :value="userItem.userId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预约科室">
                    <el-select
                      v-model="form.departmentId"
                      class="fullInput"
                      clearable
                      filterable
                      style="width: 100%;"
                      @change="departmentid"
                    >
                      <el-option
                        v-for="item in postOptions"
                        :key="item.departmentId"
                        :label="item.departmentName"
                        :value="item.departmentId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="预约类型">
                    <el-select
                      v-model="form.projectTypeId"
                      class="fullInput"
                      clearable
                      filterable
                      style="width: 50%;"
                      @change="categoryId"
                     >
                      <el-option
                        v-for="item in projectType"
                        :key="item.departmentId"
                        :label="item.projectTypeName"
                        :value="item.projectTypeId"
                      />
                    </el-select>
                    <el-select
                      v-model="form.categoryId"
                      class="fullInput"
                      clearable
                      style="width: 50%;"
                      @change="categoryIds"
                     filterable>
                      <el-option
                        v-for="item in category"
                        :key="item.categoryId"
                        :label="item.categoryName"
                        :value="item.categoryId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="回访人" prop="visituserId">
                    <el-select
                      v-model="form.visituserId"
                      filterable
                      class="fullInput"
                      placeholder="请选择"
                      style="width: 100%;"
                      :filter-method="newmy"
                    >
                      <el-option
                        v-for="userItem in hfuserList"
                        :key="userItem.userId"
                        :label="userItem.nickName"
                        :value="userItem.userId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="线上客服" prop="onlineUserId">
                    <el-select
                      v-model="form.onlineUserId"
                      filterable
                      class="fullInput"
                      placeholder="请选择"
                      style="width: 100%;"
                      :filter-method="maykf"
                    >
                      <el-option
                        v-for="(userItem,userIndex) in kfuserList"
                        :key="userIndex+'biling'"
                        :label="userItem.nickName"
                        :value="userItem.userId"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="建档类型" prop="typeThreeId">
                    <div class="buildRecordBox">
                      <div class="buildRecordOne">
                        <div class="buildTitle">第一类型</div>
                        <el-empty
                          v-if="filingTypeData.length<=0"
                          :image-size="60"
                          description="暂无数据"
                        />
                        <ul
                          v-show="filingTypeData.length>0"
                          v-loading="filingLoading"
                        >
                          <li
                            v-for="(filingItem,filingIndex) in filingTypeData"
                            :key="filingIndex+'filing'"
                            :class="form.filingId ===filingItem.filingId?'active':''"
                            @click.stop="selectFilingOneType(filingItem)"
                          >
                            {{ filingItem.filingName }}
                          </li>
                        </ul>
                      </div>
                      <div class="buildRecordOne">
                        <div class="buildTitle">第二类型</div>
                        <el-empty
                          v-if="filingTypeDataTwoData.length<=0 || form.filingId===undefined"
                          :image-size="60"
                          :description="form.filingId===undefined?'请先选择第一类型':'暂无数据'"
                        />
                        <ul v-show="filingTypeDataTwoData.length>0 && form.filingId!==undefined">
                          <li
                            v-for="(filingItem,filingIndex) in filingTypeDataTwoData"
                            :key="filingIndex+'filingTwo'"
                            :class="form.typeTwoId ===filingItem.filingId?'active':''"
                            @click.stop="selectFilingTowType(filingItem)"
                          >
                            {{ filingItem.filingName }}
                          </li>
                        </ul>
                      </div>
                      <div class="buildRecordOne">
                        <div class="buildTitle">
                          <el-input
                            v-model="ThreeType"
                            size="mini"
                            placeholder="查询第三类型"
                            @input="queryTypeThreeData"
                          />
                        </div>
                        <el-empty
                          v-if="filingTypeDataThreeData.length<=0 || form.typeTwoId===undefined"
                          :image-size="60"
                          :description="form.typeTwoId===undefined?'请先选择第二类型':'暂无数据'"
                        />
                        <ul v-show="filingTypeDataThreeData.length>0 && form.typeTwoId!==undefined">
                          <li
                            v-for="(filingItem,filingIndex) in filingTypeDataThreeData"
                            :key="filingIndex+'filingThree'"
                            :class="form.typeThreeId ===filingItem.filingId?'active':''"
                            @click.stop="selectFilingThreType(filingItem)"
                          >
                            {{ filingItem.filingName }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="formBodyoly">
            <div class="title">其他信息</div>
            <el-form
              ref="otherForm"
              :disabled="submitLoading"
              label-width="140px"
              :model="otherForm"
              size="mini"
            >
              <el-row>
                <el-col>
                  <el-form-item label="查询推荐人" prop="searchRefereeuser">
                    <el-select
                      v-model="otherForm.searchRefereeuser"
                      style="width: 40%;"
                      clearable
                      placeholder="请输入查询推荐人"
                      filterable
                      remote
                      reserve-keyword
                      value-key="arr"
                      :remote-method="remoteMethod"
                      :loading="loading"
                      @change="changes"
                    >
                      <el-option
                        v-for="arr in phone"
                        :key="arr.value"
                        :value="arr"
                        :label="arr.refereeName + arr.refereePhone"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="推荐人" prop="refereeName">
                    <el-input
                      style="width: 40%;"
                      :value="otherForm.refereeName!==''?otherForm.refereeName + '(美学顾问：' + otherForm.receptionName + ')':''"
                      clearable
                      disabled
                      placeholder="请输入推荐人姓名"
                    />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item label="推荐人电话/卡号" prop="refereePhone">
                    <el-input
                      style="width: 40%;"
                      :value="otherForm.refereePhone!== ''?otherForm.refereePhone + '(' + otherForm.customCardNumber + ')':''"
                      clearable
                      disabled
                      placeholder="请输入推荐人的电话/卡号"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="彼此关系" prop="relation">
                    <el-select v-model="otherForm.relation" style="width: 70%;" clearable filterable class="fullInput" placeholder="请选择彼此关系">
                      <el-option
                        v-for="dict in dict.type.mutual_relationship"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="员工推荐" prop="refereeuserId">
                    <el-select v-model="otherForm.refereeuserId" style="width: 70%;" clearable filterable class="fullInput" :filter-method="may" placeholder="请选择员工推荐" @clear="clearselect">
                      <el-option
                        v-for="(userItem,userIndex) in userList"
                        :key="userIndex+'user'"
                        :label="userItem.nickName"
                        :value="userItem.userId"

                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="QQ号码" prop="qq">
                    <el-input
                      v-model="otherForm.qq"
                      style="width: 70%;"
                      clearable
                      class="fullInput"
                      maxlength="12"
                      placeholder="请输入QQ号码"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="微信号码"
                    prop="wechat"
                  >
                    <el-input
                      v-model="otherForm.wechat"
                      style="width: 70%;"
                      clearable
                      class="fullInput"
                      maxlength="20"
                      placeholder="请输入微信号码"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="职业"
                    prop="occupation"
                  >
                    <el-select
                      v-model="otherForm.occupation"
                      style="width: 70%;"
                      clearable
                      class="fullInput"
                      placeholder="请选择职业"
                      filterable
                    >
                      <el-option
                        v-for="dict in dict.type.occupation"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="婚姻状况"
                    prop="marriageType"
                  >
                    <el-select
                      v-model="otherForm.marriageType"
                      style="width: 70%;"
                      clearable
                      class="fullInput"
                      placeholder="请选择婚姻状况"
                      filterable
                    >
                      <el-option
                        v-for="dict in dict.type.marital_status"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="交通工具"
                    prop="vehicle"
                  >
                    <el-select
                      v-model="otherForm.vehicle"
                      style="width: 70%;"
                      clearable
                      class="fullInput"
                      placeholder="请选择交通工具"
                      filterable
                    >
                      <el-option
                        v-for="dict in dict.type.vehicle"
                        :key="dict.value"
                        :value="dict.value"
                        :label="dict.label"
                      />

                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="地址"
                    prop="addr"
                  >
                    <el-input
                      v-model="otherForm.addr"
                      style="width: 70%;"
                      clearable
                      class="fullInput"
                      placeholder="请输入地址"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="访客ID"
                    prop="visitorId"
                  >
                    <el-input
                      v-model="otherForm.visitorId"
                      style="width: 70%;"
                      clearable
                      class="fullInput"
                      placeholder="请输入访客ID"
                    />
                  </el-form-item>
                </el-col>
                <el-col>
                  <el-form-item
                    label="咨询备注"
                    prop="remarks"
                  >
                    <el-input
                      v-model="otherForm.remarks"
                      style="width: 88%;"
                      clearable
                      type="textarea"
                      maxlength="500"
                      show-word-limit
                      :placeholder="'\n顾客来源:\n咨询内容:\n推荐方案:\n报价情况:\n考虑因素:\n客户背景:'"
                      :rows="10"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="formBody">
            <div class="title">客户标签<label>请选择标签，在点添加按钮，可以添加多个标签在保存</label></div>
            <el-form inline size="mini" :loading="submitLoading">
              <el-form-item>
                <el-select
                  v-model="labelForm.customerLabelTypeId"
                  style="width: 160px;"
                  placeholder="请选择标签类型"
                  @change="labelTypeSelection"
                  filterable
                >
                  <el-option
                    v-for="(labelType,labelTypeIndex) in customerLabelTypeData"
                    :key="labelTypeIndex+'labelType'"
                    :label="labelType.labelTypeName"
                    :value="labelType.customerLabelTypeId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="labelForm.labelDataId" style="width: 160px;" placeholder="请选择标签" filterable>
                  <el-option
                    v-for="(labelTypeChild,labelTypeChildIndex) in customerLabelTypeChildData"
                    :key="labelTypeChildIndex+'labelTypeChild'"
                    :label="labelTypeChild.labelTypeName"
                    :value="labelTypeChild.customerLabelTypeId"

                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input v-model="labelForm.remark" placeholder="备注" />
              </el-form-item>
              <el-form-item>
                <el-button
                  icon="el-icon-plus"
                  plain
                  type="primary"
                  @click.stop="addCustomerLabelTypeToTable"
                >添加
                </el-button>
              </el-form-item>
            </el-form>
            <el-table :data="tableData" style="width: 100%" size="mini">
              <el-table-column label="操作" width="55" align="center">
                <template slot-scope="scope">
                  <span class="el-icon-close" @click.stop="removeTableItem(scope.row)" />
                </template>
              </el-table-column>
              <el-table-column prop="labelTypeName" label="标签类型" width="180" align="center" />
              <el-table-column prop="labelDataName" label="标签" width="180" align="center" />
              <el-table-column prop="remark" label="备注" align="center" />
            </el-table>
          </div>
          <div v-show="useUserInfo.customPhone && useUserInfo.customerName" class="formBody">
            <div class="title">客户基础信息<label>点击 引用 按钮可以使用已有的客户基础信息</label></div>
            <el-form size="mini" disabled label-width="100px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="客户姓名">
                    <el-input v-model="useUserInfo.customerName" class="fullInput" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="国家/地区">
                    <el-select v-model="useUserInfo.country" class="fullInput" placeholder="请选择国家/地区" filterable>
                      <el-option label="中国大陆" value="0" />
                      <el-option label="中国香港" value="1" />
                      <el-option label="中国澳门" value="2" />
                      <el-option label="中国台湾" value="3" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="出生年月">
                    <el-input v-model="useUserInfo.birthday" class="fullInput" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="省份">
                    <el-input v-model="useUserInfo.province" class="fullInput" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="顾客年龄">
                    <el-input v-model="useUserInfo.customAge" class="fullInput" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="市/县">
                    <el-input v-model="useUserInfo.city" class="fullInput" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="顾客性别">
                    <el-select v-model="useUserInfo.customSex" class="fullInput" placeholder="请选择性别">
                      <el-option
                        v-for="dict in dict.type.sys_user_sex"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="区">
                    <el-input v-model="useUserInfo.area" class="fullInput" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="客户电话">
                    <el-input v-model="useUserInfo.customPhone" class="fullInput" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="民族">
                    <el-select
                      v-model="useUserInfo.nation"
                      class="fullInput"
                      placeholder="请选择民族"
                    >
                      <el-option
                        v-for="dict in dict.type.nation_list"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <!--            <el-button-->
            <!--              style="float: right;margin-right: 50px"-->
            <!--              type="primary"-->
            <!--              plain-->
            <!--              size="mini"-->
            <!--              @click.stop.native="useUserInfoToForm"-->
            <!--            >引用-->
            <!--            </el-button>-->
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-scrollbar>
</template>

<script>
import area from '@/utils/area'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { validPhone } from '@/utils/validate'
import { timeFmt } from '@/utils/time'
import { math } from '@/utils/math.js'
import vm from '@/utils/util'
import PinyinMatch from "pinyin-match";
export default {
  name: 'ConsultInput',
  components: { Treeselect },
  dicts: ['vehicle', 'marital_status', 'occupation', 'economic_capacity', 'mutual_relationship', 'sys_user_sex', 'nation_list'],
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value !== undefined) {
        const valid = validPhone(value)
        if (!valid) {
          callback(new Error('手机号码格式不正确'))
        }
        callback()
      }
    }
    const qqLength = (rule, value, callback) => {
      if (value.length > 12) {
        callback(new Error('长度不能超过12'))
      }
      callback()
    }
    const wechatLength = (rule, value, callback) => {
      if (value.length > 20) {
        callback(new Error('长度不能超过20'))
      }
      callback()
    }
    return {
      showDataDialog: false,
      phone: [],
      name: '',
      newuserlist:[],
      hfuserList:[],
      newhfuserList:[],
      kfuserList:[],
      newkfuserList:[],
      phones: '',
      channe: '',
      loading: false,
      // 提交时禁用表单
      submitLoading: false,
      // 建档类型加载
      filingLoading: false,
      // 第三类型模糊查询
      ThreeType: undefined,
      queryTypeThreeList: [],
      nowTime: timeFmt('YYYY-mm-dd HH:MM:SS', new Date()),
      // 顾客标签表单
      labelForm: {
        customerType: 1,
        labelDataId: undefined,
        customerLabelTypeId: undefined,
        labelTypeName: undefined,
        labelDataName: undefined,
        remark: undefined
      },
      tableData: [],
      // 公司树
      deptOptions: [],
      // 科室
      postOptions: [],
      // 类型
      projectType: [],
      // 项目
      category: [],
      // 顾客基本信息
      form : {
        deptId: '', // 公司
        departmentId: '', // 科室
        projectTypeId: '', // 类型
        categoryId: '', // 预约项目
        customPhone: '', // 顾客电话
        country: '', // 国家/地区
        customerName: '', // 客户姓名
        province: '', // 省份
        birthday: '', // 生日
        city: '', // 市县
        customAge: '', // 顾客年龄
        area: '', // 区
        customSex: '', // 顾客性别
        nation: '', // 名族
        economicCapacity: '', // 经济能力
        isFertility: '1', // 生育状况
        fertility: '', // 生育胎数
        pregnantWeek: '', // 怀孕几周
        preProduction: '', // 预产期
        visituserId: '', // 回访人
        channelTypeId: '', // 媒介来源
        channelId: '', // 媒介来源
        onlineUserId: '', // 线上客服
        createuserId: '', // 建档人
        filingId: '', // 建档第一类型
        typeTwoId: '', // 建档第二类型
        typeThreeId: '', // 建档第三类型
        roomTypeId: '', // 预约房间
        reserveRoomTime: ''
      },
      // 其他信息
      otherForm: {
        searchRefereeuser: '', // 查询推荐人
        refereeName: '', // 推荐人姓名
        receptionName: '', // 美学顾问
        refereePhone: '', // 推荐人电话
        customCardNumber: '', // 推荐人卡号
        relation: '', // 关系
        refereeuserId: '', // 员工推荐
        qq: '', // qq
        wechat: '', // 微信
        occupation: '', // 职业
        marriageType: '', // 婚姻状况
        vehicle: '', // 交通工具
        addr: '', // 地址
        visitorId: '', // 访客ID
        remarks: '' // 咨询备注
      },
      roomOptions: [],
      // 引用的表单
      useUserInfo: {},
      // 表单校验规则
      rules: {
        customerName: [
          { required: true, message: '顾客姓名不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '长度必须介于 2 和 20 个字符之间', trigger: 'blur' }
        ],
        nation: [
          { required: true, message: '请选择民族', trigger: 'change' }
        ],
        // country: [
        //   { required: true, message: '请选择顾客国家/地区', trigger: 'change' }
        // ],
        province: [
          { required: true, message: '请选择顾客省份', trigger: 'change' }
        ],
        city: [
          { required: true, message: '请输入选择顾客市/县', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择顾客地区', trigger: 'change' }
        ],
        customPhone: [
          { required: true, message: '请输入顾客联系电话', trigger: 'change' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: '请选择媒介来源', trigger: 'change' }
        ],
        economicCapacity: [
          { required: true, message: '请选择经济能力', trigger: 'change' }
        ],
        onlineUserId: [
          { required: true, message: '请选择客服', trigger: 'change' }
        ],
        visituserId: [
          { required: true, message: '请选择回访人', trigger: 'change' }
        ],
        createuserId: [
          { required: true, message: '请选择建档人', trigger: 'change' }
        ],
        deptId: [
          { required: true, message: '请选择公司', trigger: 'change' }
        ],
        typeThreeId: [
          { required: true, message: '请选择建档类型', trigger: 'change' },
          { required: true, message: '请选择建档类型', trigger: 'blur' }
        ],
        preProduction: [
          { required: false, message: '请选择预产期', trigger: 'change' }
        ],
        isFertility: [
          { required: false, message: '请选择生育胎数', trigger: 'change' }
        ]
      },
      // 建档第一类型
      filingTypeData: [],
      // 建档第二类型
      filingTypeDataTwoData: [],
      // 建档第三类型
      filingTypeDataThreeData: [],
      // 来源渠道
      channelType: [],
      channelTypeChildren: [],
      // 顾客标签类型
      customerLabelTypeData: [],
      // 标签
      customerLabelTypeChildData: [],
      // 地区地址
      // areaArr: [],
      areaArr: area.arrAll, // 省
      cityArr: [], // 市
      districtArr: [], // 区
      //  用户列表
      userList: [],
      inputval: {},
      user: {},
      yearsModel: null,
      years: [],
      monthsModel: null,
      months: [],
      daysModel: null,
      days: [],
      queryList:{}
    }
  },
  computed: {
    // deptId: {
    //   get() {
    //     return this.$store.getters.departmentId
    //   },
    //   set(val) {
    //     val = this.$store.getters.departmentId
    //   }
    // }
  },
  watch: {
    deptId(val) {
      this.deptId = this.queryList.deptId
      this.handleNodeClick(val)
      this.getChannelInfo(val)
      this.getFilingType()
      this.customerLabelType(val)
      this.channelType.splice(0, this.channelType.length)
      this.channelTypeChildren = []
      this.form.channelId = ''
      this.form.channelTypeId = ''
      this.filingTypeData = []
      this.filingTypeDataTwoData = []
      this.filingTypeDataThreeData = []
    },
    'form.channelTypeId'() {
      this.form.channelId = ''
    },
    'form.province'() {
      this.updateCity()
      this.updateDistrict()
    },
    'form.city'() {
      this.updateDistrict()
    }
  },
  created() {
   this.queryList = JSON.parse(sessionStorage.getItem('consultInputitem'))
    // this.deptId = this.$store.getters.departmentId
    this.deptId = this.queryList.deptId
    this.user = this.$store.getters.user
    this.form.visituserId = this.user.userId
    this.form.onlineUserId = this.user.userId
    this.form.createuserId = this.user.userId
    this.getChannelInfo(this.deptId)
    this.customerLabelType(this.deptId)
    this.getFilingType()
    this.getUserList()
    this.getRoom()
    this.handleNodeClick({ deptId: this.deptId, isDepartment: '1' })
    this.getTreeselect()
    // this.handelDeptSelect()
    this.form.customPhone = this.queryList.phone
    this.getUserInfo(this.queryList.phone)
    this.init();
    this.form.deptId=this.queryList.deptId
  },
  methods: {
    maykf(val){
      this.form.onlineUserId=''
      if (val) {
        // this.form.onlineUserId='';
      let newlist = this.newkfuserList.filter((item) => {
        if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
          return true
        }
        return PinyinMatch.match(item.nickName, val)
      })
      this.kfuserList=newlist;
        this.form.onlineUserId=val
      // this.otherForm.refereeuserId=val
    }else{
      this.kfuserList=this.newkfuserList;
    }
    },
    newmy(val){

      if (val) {
        //取值
        let newlist = this.newhfuserList.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
        this.hfuserList=newlist;

        this.$forceUpdate()
        // this.otherForm.refereeuserId=val
      }else{
        this.hfuserList=this.newhfuserList;
      }
    },
    clearselect(){
       this.userList=this.newuserlist
    },
   may(val){
     if (val) {
       //取值
       let newlist = this.newuserlist.filter((item) => {
         if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
           return true
         }
         return PinyinMatch.match(item.nickName, val)
       })
      this.userList=newlist;

       this.$forceUpdate()
       // this.otherForm.refereeuserId=val
     }else{
       this.userList=this.newuserlist;
     }
   },
    mays(val){
      this.$forceUpdate();
      this.form.createuserId=''
      if (val) {
        //取值
        let newlist = this.newuserlist.filter((item) => {
          if (item.nickName.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.nickName, val)
        })
        this.userList=newlist;
        this.form.createuserId=val
        this.$forceUpdate();

      }else{
        this.userList=this.newuserlist;
      }
      console.log(val,'HEIEI1')
    },
    /** 关闭当前标签*/
    closeTag() {
      vm.$emit('closeTag', this.$route.path)
    },
    init() {
      var myDate = new Date()
      var year = myDate.getFullYear()// 获取当前年
      var month = myDate.getMonth() + 1// 获取当前月
      var day = myDate.getDate()// 获取当前日
      this.initSelectYear(year)
      this.initSelectMonth()
      this.initSelectDay(year, month)
      this.yearsModel = year
      this.monthsModel = month
      this.daysModel = day
      const obj = { year: this.yearsModel, month: this.monthsModel, day: this.daysModel }
    },
    initSelectYear(year) {
      this.years = []
      for (let i = 0; i < 30; i++) {
        this.years.push({ value: (year - i), label: (year - i) + '年' })
      }
    },
    initSelectMonth() {
      this.months = []
      // this.months.push({ value: 0, label: '全部' })
      for (let i = 1; i <= 12; i++) {
        this.months.push({ value: i, label: i })
      }
    },
    initSelectDay(year, month) {
      var maxDay = this.getMaxDay(year, month)
      this.days = []
      // this.days.push({ value: 0, label: '全部' })
      for (var i = 1; i <= maxDay; i++) {
        this.days.push({ value: i, label: i })
      }
    },
    dateChange(type) {
      // 1年 2月 3日 4 左 5右
      if (type === 1 || type === 2) {
        if (this.monthsModel === 0) {
          this.daysModel = 0
          this.initSelectDay(this.yearsModel, 1)
        } else {
          this.initSelectDay(this.yearsModel, this.monthsModel)
        }
      }
      if (type == 4) {
        this.dayleft()
      }
      if (type == 5) {
        this.dayright()
      }
      this.form.birthday = this.monthsModel + '-' + this.daysModel
    },
    dayleft() {
      var tmpYear = this.yearsModel
      var tmpMonth = this.monthsModel
      var tmpDay = this.daysModel
      if (tmpYear == null) {
        var myDate = new Date()
        var year = myDate.getFullYear()// 获取当前年
        var month = myDate.getMonth() + 1// 获取当前月
        var day = myDate.getDate()// 获取当前日
        this.yearsModel = year
        this.monthsModel = month
        this.daysModel = day
        return
      }
      if (tmpMonth == null) { tmpMonth = 0 }
      if (tmpDay == null) { tmpDay = 0 }

      var yearV = tmpYear
      var monthV = tmpMonth
      var dayV = tmpDay

      if ((tmpMonth == 0 || tmpMonth == 1) && (tmpDay == 0 || tmpDay == 1)) {
        yearV = tmpYear - 1; monthV = 12
        dayV = this.getMaxDay(tmpYear, tmpMonth)
      }
      if (!(tmpMonth == 0 || tmpMonth == 1) && (tmpDay == 0 || tmpDay == 1)) {
        monthV = tmpMonth - 1
        dayV = this.getMaxDay(tmpYear, tmpMonth)
      }
      if ((tmpMonth == 0 || tmpMonth == 1) && !(tmpDay == 0 || tmpDay == 1)) {
        dayV = tmpDay - 1
      }
      if (!(tmpMonth == 0 || tmpMonth == 1) && !(tmpDay == 0 || tmpDay == 1)) {
        dayV = tmpDay - 1
      }
      this.yearsModel = yearV
      this.monthsModel = monthV
      this.daysModel = dayV
    },
    dayright() {
      var myDate = new Date()
      var year = myDate.getFullYear()// 获取当前年
      var month = myDate.getMonth() + 1// 获取当前月
      var day = myDate.getDate()// 获取当前日

      var tmpYear = this.yearsModel
      var tmpMonth = this.monthsModel
      var tmpDay = this.daysModel

      if (tmpYear == null) {
        var myDate = new Date()
        var year = myDate.getFullYear()// 获取当前年
        var month = myDate.getMonth() + 1// 获取当前月
        var day = myDate.getDate()// 获取当前日
        this.yearsModel = year
        this.monthsModel = month
        this.daysModel = day
        return
      }

      if (tmpMonth == null) { tmpMonth = 0 }
      if (tmpDay == null) { tmpDay = 0 }
      if (tmpYear > year) {
        this.yearsModel = year
        this.monthsModel = month
        this.daysModel = day
        return
      }
      if (tmpYear == year) {
        if ((tmpMonth > month || tmpMonth == 0) || (tmpMonth == month) && (tmpDay >= day || tmpDay == 0)) {
          this.yearsModel = year
          this.monthsModel = month
          this.daysModel = day
          return
        }
      }

      var maxDay = this.getMaxDay(tmpYear, tmpMonth)
      var yearV = tmpYear
      var monthV = tmpMonth
      var dayV = tmpDay

      if ((tmpMonth == 0 || tmpMonth == 12) && (tmpDay == 0 || tmpDay == maxDay)) {
        yearV = tmpYear + 1; monthV = 1
        dayV = 1
      }
      if (!(tmpMonth == 0 || tmpMonth == 12) && (tmpDay == 0 || tmpDay == maxDay)) {
        monthV = tmpMonth + 1
        dayV = 1
      }
      if (!(tmpMonth == 0 || tmpMonth == 12) && !(tmpDay == 0 || tmpDay == maxDay)) {
        dayV = tmpDay + 1
      }

      this.yearsModel = yearV
      this.monthsModel = monthV
      this.daysModel = dayV
    },
    getMaxDay(year, month) {
      var new_year = year // 取当前的年份
      var new_month = month++// 取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) // 如果当前大于12月，则年份转到下一年
      {
        new_month -= 12 // 月份减
        new_year++ // 年份增
      }
      var new_date = new Date(new_year, new_month, 1)// 取当年当月中的第一天
      return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate()// 获取当月最后一天日期
    },
    // // 节点点击事件
    handleNodeClick(data) {
      this.form.deptId = data.deptId
      console.log(data,'哈哈哈哈哈')
      this.$api.dept.DepartmentList(data, 'get').then((res) => {
        if (res) {
          this.postOptions = res.rows
        }
      })
    },
    /** 查询公司下拉树结构 */
    getTreeselect() {
      this.$api.dept.deptTree().then(res => {
        if (res) {
          this.deptOptions = res.data
        }
      })
    },
    // 公司
    handelDeptSelect(e) {
      this.form.departmentId = ''
      this.form.projectTypeId = ''
      this.form.categoryId = ''
      this.postOptions = []
      this.projectType = []
      this.category = []
      const data = {
        deptId: e.id,
        status: '0'
      }
      console.log(data,'哈哈')
      this.$api.dept.DepartmentList(data, 'get').then((res) => {
        if (res) {

          this.postOptions = res.rows
        }
      })
    },
    // 科室
    departmentid(event) {
      this.form.projectTypeId = '' // 类型
      this.form.categoryId = ''
      this.projectType = []
      this.category = []
      this.$api.dept.TypeList({ departmentId: event }, 'get').then((res) => {
        if (res) {
          let count=0;
          res.rows.forEach(value=>{
            count++;
            value.departmentId=count
          })
          this.projectType = res.rows;

        }
      })
    },
    categoryId(e) {
      this.form.categoryId = ''
      this.category = []
      if (this.form.departmentId === '') {
        this.form.projectTypeId = ''
        this.form.categoryId = ''
        this.projectType = []
        this.category = []
      }
      this.$api.dept.CategoryList({ projectTypeId: e }, 'get').then((res) => {
        if (res) {
          this.category = res.rows
        }
      })
    },
    categoryIds() {
      if (this.form.departmentId === '' || this.form.projectTypeId === '') {
        this.form.categoryId = ''
        this.category = []
      }
    },
    // 拿取被点击的对象进行重新赋值
    changes(val) {
      this.otherForm.refereeName = val.refereeName
      this.otherForm.refereePhone = val.refereePhone
      this.otherForm.refereeId = val.id
      this.otherForm.refereeCard = val.customCardNumber
      this.otherForm.searchRefereeuser = ''
    },
    // 查询推荐人
    remoteMethod(query) {
      // 当input里面的值大于两个的时候触法搜索
      if (query.length > 2) {
        this.loading = true
        //  一秒后再搜索
        setTimeout(() => {
          this.loading = false
          this.$api.modules.netPower.selectRecommend({ namephonecard: query }).then(res => {
            if (res) {
              console.log(res.data,'_________________')
              this.phone = res.data
            }
          })
        }, 1000)
      }
    },
    getUserInfo(phone) {
      if (!phone) {
        this.$message.warning('页面参数错误')
        return
      }
      this.showDataDialog = true
      this.$api.modules.netPower.getUserInfo({ customPhone: phone }).then(res => {
        if (res) {
          if (res.rows.length > 0) {
            const obj = {
              customerName: res.rows[0].customerName,
              country: res.rows[0].country,
              birthday: res.rows[0].birthday,
              province: res.rows[0].province,
              customAge: res.rows[0].customAge,
              city: res.rows[0].city,
              customSex: res.rows[0].customSex,
              area: res.rows[0].area,
              customPhone: res.rows[0].customPhone,
              nation: res.rows[0].nation,
              customerId: res.rows[0].customerId
            }
            this.useUserInfo = obj
            this.form.customerName = this.useUserInfo.customerName,
            this.form.country = this.useUserInfo.country,
            this.form.birthday = this.useUserInfo.birthday,
            this.form.province = this.useUserInfo.province,
            this.form.customAge = this.useUserInfo.customAge,
            this.form.city = this.useUserInfo.city,
            this.form.customSex = this.useUserInfo.customSex,
            this.form.area = this.useUserInfo.area,
            this.form.customPhone = this.useUserInfo.customPhone,
            this.form.nation = this.useUserInfo.nation,
            this.form.typeThreeId = undefined,
            this.form.filingId = undefined,
            this.form.typeTwoId = undefined,
            this.form.channelId = undefined,
            this.form.customerId = this.useUserInfo.customerId
          }
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 上方按钮注释，
    // useUserInfoToForm() {
    //   this.form = {
    //     customerName: this.useUserInfo.customerName,
    //     country: this.useUserInfo.country,
    //     birthday: this.useUserInfo.birthday,
    //     province: this.useUserInfo.province,
    //     customAge: this.useUserInfo.customAge,
    //     city: this.useUserInfo.city,
    //     customSex: this.useUserInfo.customSex,
    //     area: this.useUserInfo.area,
    //     customPhone: this.useUserInfo.customPhone,
    //     nation: this.useUserInfo.nation,
    //     typeThreeId: undefined,
    //     filingId: undefined,
    //     typeTwoId: undefined,
    //     channelId: undefined,
    //     // channelIdBack: undefined,
    //     customerId: this.useUserInfo.customerId
    //   }
    // },
    // 提交保存表单
    submitForm() {
      if (this.form.isFertility === '' || this.form.isFertility === '0' && this.form.fertility === '') {
        this.$message('请填写生育胎数')
        return
      }
        console.log(this.form.typeThreeId ,'cccc')
      this.$refs['form'].validate(valid => {

        if (valid) {
          this.dateChange()
          this.submitLoading = true
          const nowDate = new Date()
          const date = {
            // 获取当前年份
            year: nowDate.getFullYear()
          }
          const yeart = math.subtract(Number(date.year), Number(this.form.customAge))
          if (this.form.birthday === '') {
            this.form.birthday = '01-01'
          } else if (this.form.customAge === null) {
            this.form.birthday = yeart + '-' + Number(date.year)
          }
          this.form.birthday = yeart + '-' + this.form.birthday
          const customerInfo = {
            refereeId: this.otherForm.refereeId, // 推荐人ID
            refereeName: this.otherForm.refereeName, // 推荐人姓名
            refereePhone: this.otherForm.refereePhone, // 推荐人电话
            refereeCard: this.otherForm.refereeCard, // 推荐人卡号
            area: this.form.area,
            city: this.form.city,
            country: this.form.country,
            customAge: this.form.customAge,
            customPhone: this.form.customPhone,
            customSex: this.form.customSex,
            customerName: this.form.customerName,
            nation: this.form.nation,
            province: this.form.province,
            birthday: this.form.birthday,
            customerId: this.form.customerId,
            deptId: this.deptId
          }
          let birthday=this.form.birthday.split('-')
          this.form.birthday=birthday[1]+'-'+birthday[2]
          const customerCmt = Object.assign(this.form, this.otherForm);
          this.$api.modules.netPower.submitComsultInput({
            customerCmt: customerCmt,
            customerInfo: customerInfo,
            customerLabelRelationList: this.tableData
          }).then(res => {
            if (res) {
              this.$message.success('信息录入成功！')
              this.closeTag()
              this.$router.replace({ path: '/buildRecord', query: { id: res.data,deptId:this.deptId }})
            }
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    // // 选择出生年月计算生日
    // selectBirthday(data) {
    //   // this.form.birthday = strAge(data)
    //   let nowDate = new Date()
    //   let date = {
    //     // 获取当前年份
    //     year: nowDate.getFullYear()
    //   }
    //
    // },
    // 获取房间
    getRoom() {
      this.$api.confinementRoom.roomTypeInfoList({ state: '0', deptId: this.deptId }).then(res => {
        if (res) {
          this.roomOptions = res.rows
        }
      })
    },
    // 获取系统用户列表
    getUserList() {
      // 添加状态 todo   取消公司查询出 用户所有权限的
      this.$api.user.getUserList({ status: '0' }).then(res => {
        if (res) {
          this.$forceUpdate()
          const arr1 = this.unique(res.data)
          // 员工推荐
          this.userList = arr1
          this.newuserlist=arr1
          this.hfuserList=arr1;
          this.newhfuserList=arr1;
          this.kfuserList=arr1;
          this.newkfuserList=arr1;
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    // 点击建档类型
    selectFilingOneType(data) {
      this.filingTypeDataTwoData = data.child
      this.form.filingId = data.filingId
      this.form.typeTwoId = ''
      this.filingTypeDataThreeData = []
      this.form.typeThreeId = ''
    },
    selectFilingTowType(data) {
      this.filingTypeDataThreeData = data.child
      this.queryTypeThreeList = data.child
      this.form.typeTwoId = data.filingId
      this.form.typeThreeId = ''
    },
    selectFilingThreType(data) {
      this.form.typeThreeId = data.filingId
      this.ThreeType = ''
      // this.ThreeType = data.filingNamedata.filingName
    },
    // 模糊查询建档第三类型
    queryTypeThreeData(data) {
      if (data) {
        this.filingTypeDataThreeData = this.queryTypeThreeList.filter(filter => {
          return filter.filingName.indexOf(data) !== -1
        })
      } else {
        this.filingTypeDataThreeData = this.queryTypeThreeList
      }
    },
    // 选择生育状况
    birthSelectChange(e) {
      if (this.form.isFertility === '') {
        this.form.fertility = ''
      }
      if (parseInt(e) === 1) {
        this.form.fertility = ''
      } else {
        if (this.form.fertility === '') {
          this.$message('请填写胎数')
        }
      }
    },
    // 添加顾客标签至表格
    addCustomerLabelTypeToTable() {
      if (this.labelForm.labelDataId === undefined || this.labelForm.customerLabelTypeId === undefined) {
        this.$message.error('请先选择标签类型和标签')
        return
      }
      const type = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === this.labelForm.customerLabelTypeId
      })
      this.labelForm.labelTypeName = type[0].labelTypeName

      const label = this.customerLabelTypeChildData.filter(filter => {
        return filter.customerLabelTypeId === this.labelForm.labelDataId
      })
      this.labelForm.labelDataName = label[0].labelTypeName

      let flag = true
      this.tableData.forEach(item => {
        if (item.labelDataId === this.labelForm.labelDataId) {
          flag = false
          return
        }
      })

      if (flag) {
        this.tableData.push(this.labelForm)
      } else {
        this.$message.warning('不可重复添加！')
      }
      this.labelForm = {
        labelDataId: undefined,
        customerLabelTypeId: undefined,
        labelTypeName: undefined,
        labelDataName: undefined,
        remark: undefined
      }
      this.customerLabelTypeChildData = []
    },
    // 顾客标签选择
    labelTypeSelection(selection) {
      this.labelForm.labelDataId = undefined
      this.customerLabelTypeChildData = []
      const data = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === selection
      })
      this.customerLabelTypeChildData = data[0].customLabelData
    },
    // 获取顾客标签
    customerLabelType(val) {
      this.$api.modules.custLabel.customerLabelType({
        'deptId': val
      }).then(res => {
        if (res) {
          this.customerLabelTypeData = res.data
        }
      })
    },
    getFilingType() {
      this.filingLoading = true
      this.$api.modules.filing.getFilingTypeById({
        'deptId': this.deptId,
        'status': '0'
      }).then(res => {
        if (res) {
          if (res.data.length !== 0) {
            res.data.forEach(item => {
              this.filingTypeData.push(item)
            })
          } else {
            this.filingTypeData = []
          }
        }
      }).finally(() => {
        this.filingLoading = false
      })
    },
    styleObjectFun() {
      return {
        '--height': document.body.clientHeight - 185 + 'px'
      }
    },
    goBack() {
      window.history.back()
    },
    // 获取渠道信息
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
    // 选择媒介来源第一级
    channelTypeSelection(selection) {
      const data = this.channelType.filter(filter => {
        return filter.typeId === selection
      })
      this.channelTypeChildren = data[0].channelInfo
    },
    // channelSelection(selection) {
    //   const data = this.channelTypeChildren.filter(filter => {
    //     return filter.deptChannelId === selection
    //   })
    // this.form.channelId = data[0].deptChannelId
    // this.form.channelName = ''
    // },
    // 删除表格行
    removeTableItem(row) {
      let Rindex = -1
      this.tableData.forEach((item, index) => {
        if (item.labelDataId === row.labelDataId) {
          Rindex = index
          return
        }
      })
      if (Rindex !== -1) {
        this.tableData.splice(Rindex, 1)
      }
    },
    //  更新地址
    updateCity() {
      for (const i in this.areaArr) {
        const obj = this.areaArr[i]
        if (obj.name) {
          if (obj.name === this.form.province) {
            this.cityArr = obj.sub
            break
          }
        }
      }
      this.form.city = this.cityArr[0].name
    },
    updateDistrict() {
      for (var i in this.cityArr) {
        var obj = this.cityArr[i]
        if (obj.name === this.form.city) {
          this.districtArr = obj.sub
          break
        }
      }
      if (
        this.districtArr && this.districtArr.length > 0 && this.districtArr[0].name
      ) {
        this.form.area = this.districtArr[0].name
      } else {
        this.form.area = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
/*选择日期，年份的隐藏 */
.picker-date {
  .el-date-picker__header {
    span:nth-child(3) { /*第三个标签是span的标签，把它隐藏*/
      display: none;
    }
    button:nth-child(1) {
      display: none;
    }
    button:nth-child(5) {
      display: none;
    }
  }
}
// -----------
.fullInput {
  width: 220px;
}

.halfInput {
  width: 109px;
}

.el-icon-close {
  color: red;
  font-weight: bold;
  cursor: pointer;
}

.progressBar {
  width: 100%;
  height: 50px;
  background-color: #f2f2f2;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  ul {
    list-style: none;
    width: 100%;
    line-height: 30px;
    display: flex;

    .active {
      color: #48c9b0;
    }

    li {
      margin: 0 20px;
      font-size: 14px;
      color: #454545;
    }
  }
}

.formBox {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  .formBodylift{
    width: 62%;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    padding: 40px 20px;
    box-sizing: border-box;
    position: relative;
    margin: 20px 0;
    .buildRecordBox {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .buildRecordOne {
        width: 32%;
        height: 260px;
        border: 1px solid #cccccc;

        ul {
          width: 100%;
          height: 220px;
          list-style: none;
          overflow-x: hidden;
          overflow-y: scroll;

          li {
            padding: 0 10px;
            box-sizing: border-box;
            font-size: 12px;
            cursor: pointer;
          }

          .active {
            background-color: #7ec5b7;
          }
        }

        .buildTitle {
          width: 100%;
          height: 40px;
          background-color: #f0f0f0;
          color: #666;
          text-align: center;
          line-height: 40px;
          padding: 0 10px;
          box-sizing: border-box;
        }
      }
    }

    .title {
      position: absolute;
      top: -12px;
      left: 40px;
      padding: 0 10px;
      background-color: #f2f2f2;
      color: #666666;

      label {
        color: #48c9b0;
        font-size: 12px;
        margin-left: 10px;
      }
    }
  }
  .formBodyoly{
    width: 35%;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    padding: 40px 20px;
    box-sizing: border-box;
    position: relative;
    margin: 20px 0;
  }
  .formBody {
    width: calc(50% - 10px);
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    padding: 40px 20px;
    box-sizing: border-box;
    position: relative;
    margin: 20px 0;

    .buildRecordBox {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .buildRecordOne {
        width: 32%;
        height: 260px;
        border: 1px solid #cccccc;

        ul {
          width: 100%;
          height: 220px;
          list-style: none;
          overflow-x: hidden;
          overflow-y: scroll;

          li {
            padding: 0 10px;
            box-sizing: border-box;
            font-size: 12px;
            cursor: pointer;
          }

          .active {
            background-color: #7ec5b7;
          }
        }

        .buildTitle {
          width: 100%;
          height: 40px;
          background-color: #f0f0f0;
          color: #666;
          text-align: center;
          line-height: 40px;
          padding: 0 10px;
          box-sizing: border-box;
        }
      }
    }

    .title {
      position: absolute;
      top: -12px;
      left: 40px;
      padding: 0 10px;
      background-color: #f2f2f2;
      color: #666666;

      label {
        color: #48c9b0;
        font-size: 12px;
        margin-left: 10px;
      }
    }
  }
}

::v-deep .el-scrollbar {
  width: 100%;
  height: var(--height);
  box-sizing: border-box;

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
::v-deep .vue-treeselect__control{
  height: 30px;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left: 15px !important;
  padding-right: 10px !important;
}
::v-deep .el-input__icon{
  width: 10px !important;
}
</style>
<style>
.el-input__prefix{
  display: none;
}
</style>
