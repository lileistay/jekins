<template>
  <!-- 维护临客信息//这个页面应该没用，但是也不敢删 -->
  <div class="container">
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
          icon="el-icon-document"
          type="success"
          plain
          v-has-permi="['confinement:customerCmt:exporttwo']"
          
          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          ref="table"
          id="out-table"
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          selection
          border
          index="序号"
          highlight-current-row
          :table-data="tableData"
          :columns="columns"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="searchBar">
            <div class="title">更改临客归属，<span style="color: red">全选无需勾选(变更查询结果的所有客户)</span>，直接点击归属更改按钮</div>
            <div>
              <el-button
                v-hasPermi="['confinement:customerCmt:guestList:addlisthispital']"
                size="mini"
                type="success"
                plain
                class="headerBarBtn"
                @click.stop.native="handlecompileadd"
              >临客合并
              </el-button>
              <el-button
                v-hasPermi="['confinement:customerCmt:guestList:editchangehispital']"
                size="mini"
                type="success"
                plain
                class="headerBarBtn"
                @click.stop.native="newhandlecompile"
              >临客归属更改
              </el-button>
<!--              <el-button-->
<!--                v-hasPermi="['confinement:customerCmt:edit']"-->
<!--                size="mini"-->
<!--                type="primary"-->
<!--                plain-->
<!--                class="headerBarBtn"-->
<!--                @click.stop.native="handlecompile"-->
<!--              >【导入】临客归属更改-->
<!--              </el-button>-->
            </div>
          </div>
          <div slot="header" style="width: 100%;">
            <el-button
              v-hasPermi="['confinement:customerCmt:guestList:editnormal']"
              size="mini"
              type="success"
              plain
              class="headerBarBtn"
              @click.stop.native="openManualDialog"
            >更改正客媒介等同临客媒介
            </el-button>
            <el-button
              v-hasPermi="['confinement:customerCmt:guestList:editmore']"
              size="mini"
              type="success"
              plain
              class="headerBarBtn"
              @click.stop.native="openManualDialog"
            >更改临客媒介等同正客媒介
            </el-button>
            <el-button
              v-has-permi="['confinement:customerCmt:guestList:editupdatenew']"
              size="mini"
              type="primary"
              plain
              class="headerBarBtn"
              @click.stop.native="newsappointmentAddition"
            >补建档
            </el-button>
            <el-button
              v-hasPermi="['confinement:customerCmt:guestList:editupdatefirst']"
              size="mini"
              type="success"
              plain
              class="headerBarBtn"
              @click.stop.native="openManualDialog"
            >临客媒介修改
            </el-button>
            <el-button
              v-has-permi="['confinement:customerCmt:guestList:editupdatelist']"
              size="mini"
              type="primary"
              plain
              class="headerBarBtn"
              @click.stop.native="appointmentAddition"
            >修改临客建档信息
            </el-button>
            <el-button
              v-hasPermi="['confinement:customerCmt:guestList:editupdatePhone']"
              size="mini"
              type="primary"
              plain
              class="headerBarBtn"
              @click.stop.native="handlecompile"
            >修改临客电话
            </el-button>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'isReachCourtyard'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isReachCourtyard" />
            </div>
            <!--  是否下单-->
            <div v-else-if="data.props === 'appointment'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.appointment" />
            </div>
            <div v-else-if="data.props === 'phoneDetail'">
              <a @click="phoneDetailClick(data)">号码详情</a>
            </div>
            <div v-else-if="data.props === 'changeList'">
              <!--<a :href="'GuestAscriptionChangeDetail?guestId='+data.custom.customerId">归属更改详情</a> |-->
              <router-link
                :to="{path:'GuestAscriptionChangeDetail',query:{guestId:data.custom.id}}"
                @click.stop.native
              >
                归属更改详情
              </router-link>
            </div>
            <div v-else-if="data.props === 'guestLabel'">
              <el-button type="text" @click.stop.native="getCustomerLabel(data.custom.id)">临客标签详情</el-button>
            </div>
            <div v-else-if="data.props === 'marriageType'">
              <show-dict-data :options="dict.type.marital_status" :value="data.custom.marriageType" />
            </div>
            <div v-else-if="data.props === 'querTimeType'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.querTimeType" />
            </div>
            <div v-else-if="data.props === 'economicCapacity'">
              <show-dict-data :options="dict.type.economic_capacity" :value="data.custom.economicCapacity" />
            </div>
            <div v-else-if="data.props === 'occupation'">
              <show-dict-data :options="dict.type.occupation" :value="data.custom.occupation" />
            </div>
            <div v-else-if="data.props === 'marriageType'">
              <show-dict-data :options="dict.type.marital_status" :value="data.custom.marriageType" />
            </div>
            <div v-else-if="data.props === 'occupation'">
              <show-dict-data :options="dict.type.occupation" :value="data.custom.occupation" />
            </div>
            <div v-else-if="data.props === 'customSex'">
              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
            </div>
            <div v-else-if="data.props === 'openId'">
              <span>{{ data.custom.openId !== '' && data.custom.openId !== undefined ? '是' : '否' }}</span>
            </div>
            <div v-else-if="data.props === 'blacklist'">
              <show-dict-data :options="dict.type.sys_is_blacklist" :value="data.custom.blacklist" />
            </div>
            <div v-else-if="data.props === 'receptionStatus'">
              <span>{{ data.custom.receptionStatus=='2'?'是':'否' }}</span>
              <!-- <show-dict-data :options="dict.type.sys_is_blacklist" :value="data.custom.blacklist" /> -->
            </div>
            
            <!-- 是否分配线上客服，有线上客服name就是分配了 -->
            <div v-else-if="data.props === 'hasOnlineWaiter'">
              <span>{{
                data.custom.onlineUserName !== '' && data.custom.onlineUserName !== undefined ? '是' : '否'
              }}</span>
            </div>
            <!-- 点击姓名跳转路由 -->
            <div v-else-if="data.props === 'customerName'">
              <a @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <sg-dialog title="临客标签" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabel">
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
                    <el-select
                      v-model="manualForm.userInfo.customSex"
                      class="full-width" filterable
                      placeholder="请选择性别"
                    >
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
                  <el-form-item label="经济能力">
                    <el-select
                      v-model="manualForm.userInfo.economicCapacity"
                      class="full-width" filterable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="dict in dict.type.economic_capacity"
                        :key="dict.value"
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
            <el-form label-width="80px" size="mini" :loading="manualFormLoading">
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
                    <el-select
                      v-model="manualForm.form.GuestLabel"
                      class="full-width" filterable
                      placeholder="请选择标签"
                    >
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
                      :loading="manualFormLoading"
                      @click.stop="addCustomerLabelTypeToTable"
                    >添加
                    </el-button>
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
                  <el-button
                    type="text"
                    size="mini"
                  ><span
                    style="color: red"
                    @click.stop="removeToTable(scope.row)"
                  >删除</span></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </sg-dialog>
    <manual-submission
      :show-manual-dialog="showManualDialog"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
    <send-message
      :show-send-message-dialog="showSendMessageDialog"
      :selection-data="selectionData"
      @closeDialog="closeDialog"
    />
    <sg-table
      id="out-table"
      size="mini"
      index="序号"
      style="display: none"
      :table-data="tableDatas"
      :columns="columns"
    >
      <template #custom="data">
        <div v-if="data.props === 'isReachCourtyard'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.isReachCourtyard" />
        </div>
        <!--  是否下单-->
        <div v-else-if="data.props === 'appointment'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.appointment" />
        </div>
        <div v-else-if="data.props === 'marriageType'">
          <show-dict-data :options="dict.type.marital_status" :value="data.custom.marriageType" />
        </div>
        <div v-else-if="data.props === 'querTimeType'">
          <show-dict-data :options="dict.type.whether" :value="data.custom.querTimeType" />
        </div>
        <div v-else-if="data.props === 'economicCapacity'">
          <show-dict-data :options="dict.type.economic_capacity" :value="data.custom.economicCapacity" />
        </div>
        <div v-else-if="data.props === 'occupation'">
          <show-dict-data :options="dict.type.occupation" :value="data.custom.occupation" />
        </div>
        <!-- 点击姓名跳转路由 -->
        <div v-else-if="data.props === 'customerName'">
          <a @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
        </div>
      </template>
    </sg-table>
    <sg-dialog title="临客电话号码" :dialog="Telephone" size="400px" @handleClose="customTelephone">
      <div slot="out">
        <el-form ref="changePhoneForm" label-width="120px" size="mini" :model="changePhoneForm" :rules="phoneRules">
          <el-form-item label="临时客户：">
            <el-input v-model="changePhoneForm.customerName" disabled />
          </el-form-item>
          <el-form-item label="原电话：">
            <el-input v-model="changePhoneForm.customPhone" disabled />
          </el-form-item>
          <el-form-item label="变更后号码：" prop="phone">
            <el-input v-model="changePhoneForm.phone" />
          </el-form-item>
          <el-form-item label="变更备注：">
            <el-input v-model="changePhoneForm.remark" />
          </el-form-item>
          <el-button size="mini" @click="AddPhones">保存</el-button>
          <el-button size="mini" @click="customTelephone">关闭</el-button>
        </el-form>
      </div>
    </sg-dialog>
    <sg-dialog
      title="修改临客建档信息"
      :dialog="Record"
      size="900px"
      @handleClose="deitRecord"
    >
      <div slot="out">
        <el-form label-width="120px" size="mini" :model="putOnRecordForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="已选择人数：">
                <el-input v-model="putOnRecordForm.people" disabled style="width: 200px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="变更备注：">
            <el-input v-model="putOnRecordForm.remark" style="width: 100%;" type="textarea" />
          </el-form-item>
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
                    :class="putOnRecordForm.filingId ===filingItem.filingId?'active':''"
                    @click.stop="selectFilingOneType(filingItem)"
                  >
                    {{ filingItem.filingName }}
                  </li>
                </ul>
              </div>
              <div class="buildRecordOne">
                <div class="buildTitle">第二类型</div>
                <el-empty
                  v-if="filingTypeDataTwoData.length<=0 || putOnRecordForm.filingId===undefined"
                  :image-size="60"
                  :description="putOnRecordForm.filingId===undefined?'请先选择第一类型':'暂无数据'"
                />
                <ul v-show="filingTypeDataTwoData.length>0 && putOnRecordForm.filingId!==undefined">
                  <li
                    v-for="(filingItem,filingIndex) in filingTypeDataTwoData"
                    :key="filingIndex+'filingTwo'"
                    :class="putOnRecordForm.typeTwoId ===filingItem.filingId?'active':''"
                    @click.stop="selectFilingTowType(filingItem)"
                  >
                    {{ filingItem.filingName }}
                  </li>
                </ul>
              </div>
              <div class="buildRecordOne">
                <div class="buildTitle">查询第二类型</div>
                <el-empty
                  v-if="filingTypeDataThreeData.length<=0 || putOnRecordForm.typeTwoId===undefined"
                  :image-size="60"
                  :description="putOnRecordForm.typeTwoId===undefined?'请先选择第二类型':'暂无数据'"
                />
                <ul v-show="filingTypeDataThreeData.length>0 && putOnRecordForm.typeTwoId!==undefined">
                  <li
                    v-for="(filingItem,filingIndex) in filingTypeDataThreeData"
                    :key="filingIndex+'filingThree'"
                    :class="putOnRecordForm.typeThreeId ===filingItem.filingId ? 'active':'' "
                    @click.stop="selectFilingThreeType(filingItem)"
                  >
                    {{ filingItem.filingName }}
                  </li>
                </ul>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="选择建档人">
            <el-radio-group v-model="putOnRecordForm.createUserId">
              <el-radio
                v-for="item in sysUserList"
                :key="item.value"
                style="margin: 5px;width: 120px"
                :label="item.value"
                name="type"
              > {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button size="mini" @click="Addrecord">保存</el-button>
        <el-button size="mini" @click="deitRecord">关闭</el-button>
      </div>
    </sg-dialog>
    <sg-dialog title="临客媒介修改" :dialog="mediaModification" size="400px" @handleClose="Media">
      <div slot="out">
        <el-form label-width="100px" size="mini" :model="mediumForm">
          <el-form-item label="已选择人数：">
            <el-input v-model="mediumForm.people" disabled style="width: 100%;" />
          </el-form-item>
          <el-form-item label="变更备注：">
            <el-input v-model="mediumForm.remark" style="width: 100%;" type="textarea" />
          </el-form-item>
          <h4>变更媒介</h4>
          <el-form-item label="媒介来源" prop="channelId">
            <el-select
              v-model="mediumForm.channelTypeId"
              class="halfInput"
              placeholder="请选择"
              style="width: 50%;"
              @change="channelTypeSelection"
            >
              <el-option
                v-for="(type,typeIndex) in channelType"
                :key="typeIndex +'type'"
                :label="type.typeName"
                :value="type.channelId ? type.channelId : type.typeId"
              />
            </el-select>
            <el-select v-model="mediumForm.channelId" style="width: 50%;" class="halfInput" placeholder="请选择">
              <el-option
                v-for="(type,typeChildIndex) in channelTypeChildren"
                :key="typeChildIndex+'channelId'"
                :label="type.typeName"
                :value="type.channelId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="AddMedia">保存</el-button>
            <el-button size="mini" @click="Media">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </sg-dialog>
    <sg-dialog title="临客归属更改" :dialog="ascriptionDialog" @handleClose="ModificationClose">
      <div slot="out">
        <div class="dialog-box">
          <div class="title">
            <div>临客归属更改 <span style="color: red">*不选择就不变更</span></div>
          </div>
          <div class="content">
            <el-form label-width="120px" size="mini" :model="ascriptionForm">
              <el-form-item label="已选择人数：">
                <el-input v-model="ascriptionForm.people" disabled style="width: 100%;" />
              </el-form-item>

              <el-form-item label="变更备注：">
                <el-input v-model="ascriptionForm.remark" style="width: 100%;" type="textarea" />
              </el-form-item>
              <el-form-item label="变更回访人" prop="visituserId">
                <el-radio-group v-model="ascriptionForm.visituserId">
                  <el-radio
                    v-for="item in sysUserList"
                    :key="item.value"
                    style="margin: 5px;width: 110px"
                    :label="item.value"
                    name="type"
                  > {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="变更线上客服" prop="onlineUserId">
                <el-radio-group v-model="ascriptionForm.onlineUserId">
                  <el-radio
                    v-for="item in sysUserList"
                    :key="item.value"
                    style="margin: 5px;width: 110px"
                    :label="item.value"
                    name="type"
                  > {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-button size="mini" @click="ascription">保存</el-button>
              <el-button size="mini" @click="ModificationClose">关闭</el-button>
            </el-form>
          </div>
        </div>

      </div>
    </sg-dialog>
    <sg-dialog
      title="临客合并"
      :dialog="comutTemporary"
      :inner-dialog="selectMergeCustomerDialog"
      inner-title="选择合并人"
      :inner-size="'880px'"
      @innerHandleClose="margeInnerHandleClose"
      @handleClose="Temporary"
    >
      <div slot="out">
        <div class="dialog-box">
          <div class="title">
            主号码信息 <span style="color: red">*客户信息会被合并到主号码姓名下</span>
          </div>
          <div class="content">
            <el-form label-width="120px" size="mini" :model="mergeForm">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：">
                    <el-input :value="margeMainCustomerInfo.customerName" style="width: 150px;" disabled />
                    <span style="color: red">{{
                      margeMainCustomerInfo.isReachCourtyard === '0' ? '未到院' : '到院'
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电话：" prop="customPhone">
                    <el-radio-group v-model="mergeForm.customPhone">
                      <el-radio :label="margeMainCustomerInfo.phone">{{ margeMainCustomerInfo.phone }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="建档类型：" prop="typeThreeId">
                    <el-radio-group v-model="mergeForm.typeThreeId">
                      <el-radio
                        :label="margeMainCustomerInfo.typeThreeId"
                      >
                        {{
                          margeMainCustomerInfo.filingName + '/' + margeMainCustomerInfo.typeTwoName + '/' + margeMainCustomerInfo.typeThreeName
                        }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="建档人：" prop="createuserId">
                    <el-radio-group v-model="mergeForm.createuserId">
                      <el-radio :label="margeMainCustomerInfo.createuserId">{{ margeMainCustomerInfo.cdName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="媒介来源：" prop="channelId">
                    <el-radio-group v-model="mergeForm.channelId">
                      <el-radio :label="margeMainCustomerInfo.channelId">{{ margeMainCustomerInfo.channelName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="线上客服：" prop="onlineUserId">
                    <el-radio-group v-model="mergeForm.onlineUserId">
                      <el-radio :label="margeMainCustomerInfo.onlineUserId">{{ margeMainCustomerInfo.oudName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="回访人：" prop="visituserId">
                    <el-radio-group v-model="mergeForm.visituserId">
                      <el-radio :label="margeMainCustomerInfo.visituserId">{{ margeMainCustomerInfo.visituserName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12" />
              </el-row>
            </el-form>
          </div>
        </div>
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="selectMergeCustomerDialog=true">选择号码合并
        </el-button>
        <div class="dialog-box">
          <div class="title">
            被合并号码信息
          </div>
          <div v-if="Object.keys(margeSecondaryCustomerInfo).length!==0" class="content">
            <el-form label-width="120px" size="mini" :model="mergeForm">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="姓名：">
                    <el-input :value="margeSecondaryCustomerInfo.customerName" style="width: 150px;" disabled />
                    <span style="color: red">{{
                      margeSecondaryCustomerInfo.isReachCourtyard === '0' ? '未到院' : '到院'
                    }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电话：" prop="customPhone">
                    <el-radio-group v-model="mergeForm.customPhone">
                      <el-radio :label="margeSecondaryCustomerInfo.customTruePhone">
                        {{ margeSecondaryCustomerInfo.customTruePhone }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="建档类型：" prop="typeThreeId">
                    <el-radio-group v-model="mergeForm.typeThreeId">
                      <el-radio
                        :label="margeSecondaryCustomerInfo.typeThreeId"
                      >
                        {{
                          margeSecondaryCustomerInfo.filingName + '/' + margeSecondaryCustomerInfo.typeTwoName + '/' + margeSecondaryCustomerInfo.typeThreeName
                        }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="建档人：" prop="createuserId">
                    <el-radio-group v-model="mergeForm.createuserId">
                      <el-radio :label="margeSecondaryCustomerInfo.createuserId">
                        {{ margeSecondaryCustomerInfo.createUserName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="媒介来源：" prop="channelId">
                    <el-radio-group v-model="mergeForm.channelId">
                      <el-radio :label="margeSecondaryCustomerInfo.channelId">
                        {{ margeSecondaryCustomerInfo.channelName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="线上客服：" prop="onlineUserId">
                    <el-radio-group v-model="mergeForm.onlineUserId">
                      <el-radio :label="margeSecondaryCustomerInfo.onlineUserId">
                        {{ margeSecondaryCustomerInfo.onlineUserName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="回访人：" prop="visituserId">
                    <el-radio-group v-model="mergeForm.visituserId">
                      <el-radio :label="margeSecondaryCustomerInfo.visituserId">
                        {{ margeSecondaryCustomerInfo.visituserName }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12" />
              </el-row>
            </el-form>
          </div>
        </div>
        <el-button size="mini" type="primary" plain @click="mergeSave">保存</el-button>
        <el-button type="danger" plain size="mini" @click="Temporary">关闭</el-button>
      </div>
      <div slot="in">
        <sg-table
          ref="selectMergeCustomerTable"
          :sg-ref="'selectMergeCustomerTable'"
          :pagination="selectMergeCustomerTablePagination"
          size="mini"
          border
          index="序号"
          highlight-current-row
          :max-height="'400px'"
          :table-data="selectMergeCustomerTableData"
          :columns="selectMergeCustomerTableColumns"
        >
          <div slot="searchBar">
            <el-form :inline="true" size="mini">
              <el-form-item label="客户姓名">
                <el-input
                  v-model="searchMergeCustomersForm.customerName"
                  @keyup.enter.native="searchMergeCustomers"
                />
              </el-form-item>
              <el-form-item label="客户电话">
                <el-input
                  v-model="searchMergeCustomersForm.customPhone"
                  @keyup.enter.native="searchMergeCustomers"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchMergeCustomers">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customSex'">
              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
            </div>
            <div v-if="data.props === 'operation'">
              <el-button size="mini" type="primary" :disabled="mergeForm.mainId===data.custom.id" @click="selectedSecondaryCustomer(data.custom)">选择</el-button>
            </div>
          </template>
        </sg-table>
      </div>
    </sg-dialog>
  </div>
</template>

<script>
import area from '@/utils/area'
import { debounce } from '@/utils/throttleAndDebounce'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog'
import { todayTime } from '@/utils/time'
import ManualSubmission from '@/components/ManualSubmission'
import SendMessage from '@/components/SendMessage'
import moment from 'moment'
import { validPhone } from '@/utils/validate'
export default {
  name: 'MaintainArrivalInformation',
  dicts: ['marital_status', 'sys_user_sex', 'hospat_yn', 'economic_capacity', 'execution_type', 'return_stage', 'occupation', 'whether'],
  components: {
    SendMessage,
    ManualSubmission,
    SgDialog,
    SgTable,
    slideSearch
  },
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
    return {
      tableDatas: [],
      submitLoading: false,
      changePhoneForm:{},
      customLabelTableData: [],
      searchMergeCustomersForm: {
        customPhone: '',
        customerName: ''
      },
      Telephone:false,
      phoneRules: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          // { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
          { validator: validatePhone, trigger: 'change' }
        ]
      },
      putOnRecordForm: {
        people: null,
        type: []
      },
      Record:false,
           // 建档第一类型
           filingTypeData: [],
      // 建档第二类型
      filingTypeDataTwoData: [],
      // 建档第三类型
      filingTypeDataThreeData: [],
      filingLoading:"",
      mediumForm: {
        people: null
      },
      mediaModification: false,
      channelTypeChildren: [],
      ascriptionForm: {
        people: null
      },
      ascriptionDialog:false,
      mergeForm: {
        mainId: null,
        secondaryId: null,
        createuserId: null,
        filingId: null,
        typeTwoId: null,
        typeThreeId: null,
        channelId: null,
        channelTypeId: null,
        onlineUserId: null,
        visituserId: null,
        customPhone: null,
        deptId: null
      },
      comutTemporary:false,
      selectMergeCustomerDialog: false,
      margeMainCustomerInfo: {},
      margeSecondaryCustomerInfo: {},
      selectMergeCustomerTablePagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      selectMergeCustomerTableData: [],
      selectMergeCustomerTableColumns: [
        {
          lab: '姓名',
          val: 'customerName',
          width: '100px'
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex',
          width: '50px'
        },
        {
          lab: '年龄',
          val: 'customAge',
          width: '50px'
        },
        {
          lab: '媒介来源',
          val: 'channelName',
          width: '150px'
        },
        {
          lab: '手机',
          val: 'customPhone',
          width: '100px'
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: '150px'
        },
        {
          lab: '线上客服',
          val: 'onlineUserName',
          width: '100px'
        },
        {
          lab: '操作',
          custom: 'operation',
          width: '80px'
        }
      ],



      // 多选数据
      selectionData: [],
      // 系统用户列表
      sysUserList: [],
      // 手工上报
      showManualDialog: false,
      innerDialog: false,
      manualFormLoading: false,
      // 客户标签
      customLabelDialog: false,
      // 显示发送短信弹窗
      showSendMessageDialog: false,
      // 加载蒙版
      showDataDialog: false,
      tableData: [],
      // 统计
      statisticsData: 0,
      // 分页
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      // 媒介来源数据
      channelType: [],
      // 手工上报表单
      manualForm: {
        userInfo: {},
        form: {
          customerLabelTypeId: undefined,
          GuestLabel: undefined,
          registerTime: null,
          remark: undefined,
          labelTypeName: undefined,
          labelDataName: undefined
        }
      },
      // 顾客标签数据table
      manualFormTableData: [],
      // 地区
      areaArr: area.arrAll, // 省
      cityArr: [], // 市
      districtArr: [], // 区
      // 顾客标签类型
      customerLabelTypeData: [],
      customerLabelTypeChildData: [],
      columns: [
        {
          lab: '号码详情',
          val: 'phoneDetail',
          custom: 'phoneDetail'
        },
        {
          lab: '归属更改详情',
          val: 'changeList',
          custom: 'changeList',
          width: 120
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: 160
        },
        {
          lab: '客户',
          val: 'customerName',
          width: 120
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 140
        },
        {
          lab: '临客标签',
          val: '',
          width: 100,
          custom: 'guestLabel',
          showOverflowTooltip: true
        },
        {
          lab: '公司',
          val: 'deptName',
          width:200,
        },
        {
          lab: '回访执行人',
          val: 'visituserName',
          width: 120
        },
        {
          lab: '最后回访时间',
          val: 'lastReturnVisitTime',
          width: 120
        },
        {
          lab: '回访次数',
          val: 'returnNum'
        },
        {
          lab: '线上客服',
          val: 'onlineUserName',
        },
        {
          lab: '建档人',
          val: 'createUserName',
          width: 120
        },
        {
          lab: '建档类型',
          val: 'channelName',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '媒介',
          val: 'typeThreeName',
          width: 180,
          showOverflowTooltip: true

        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex',
          width: 140
        },
        {
          lab: '县市',
          val: 'city',
          width: 160
        },
        {
          lab: '职业',
          val: 'occupation',
          width: 140,
          custom: 'occupation'
        },
        {
          lab: '婚姻',
          val: 'marriageType',
          custom: 'marriageType',
          width: 100
        },
        {
          lab: '是否微信绑定',
          val: 'openId',
          custom: 'openId',
          width:200,
        },
        {
          lab: '是否分配线上客服',
          val: '',
          custom: 'hasOnlineWaiter',
          width: 140
        },
        {
          lab: '是否成交',
          val: 'receptionStatus',
          custom:"receptionStatus",
          width: 180
        },
        {
          lab: '正客媒介',
          val: 'channelName',
          width: 180
        },
        {
          lab: '备注',
          val: 'remarks',
          width: 140,
          showOverflowTooltip: true
        },
        {
          lab: '是否黑名单',
          val: 'blacklist',
          custom: 'blacklist',
          width: 120
        }
      ],
      // 查询列表
      options: {
        createTime: {
          type: 'Tdatetime',
          label: '建档时间',
          clearable: true,
          values: [new Date(todayTime()[0]), new Date(todayTime()[1])]
        },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '电话'
        },
        customSex: {
          type: 'select',
          label: '性别',
          clearable: true,
          options: []
        },
        channel: {
          type: 'Tselect',
          label: '媒介',
          clearable: true,
          values: [],
          options: []
        },
        createuserId: {
          type: 'select',
          label: '建档人',
          clearable: true,
          options: []
        },
        typeThreeIds: {
          type: 'cascader',
          label: '建档类型',
          clearable: true,
          props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
          options: []
        },
        pregnantWeek: {
          type: 'select',
          label: '怀孕几周',
          clearable: true,
          options: []
        },
        reserveRoomTime: {
          type: 'daterange',
          label: '预计入住时间',
          clearable: true,
          values: []
        },
        preProduction: {
          type: 'Tdatetime',
          label: '预产期',
          clearable: true,
          values: []
        },
        roomTypeId: {
          type: 'select',
          label: '房间类型',
          clearable: true,
          options: []
        },
        fertility: {
          type: 'select',
          label: '生育情况',
          clearable: true,
          options: []
        },
        lastReturnVisitTime: {
          type: 'Tdatetime',
          label: '最后回访时间',
          clearable: true,
          values: []
        },
        visituserId: {
          type: 'select',
          label: '回访人',
          clearable: true,
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '线上客服',
          clearable: true,
          options: []
        },
        isReachCourtyard: {
          type: 'select',
          label: '是否到院',
          clearable: true,
          options: []
        },
        returnNum: {
          type: 'Tinput',
          label: '回访次数',
          clearable: true,
          values: []
        },
        arrivalTime: {
          type: 'Tdatetime',
          label: '到院时间',
          clearable: true,
          values: []
        },
        remarks: {
          type: 'input',
          label: '备注'
        },
        province: {
          type: 'select',
          label: '省份',
          clearable: true,
          options: [],
          values: ''
        },
        city: {
          type: 'select',
          label: '市县',
          clearable: true,
          options: [],
          values: ''
        },
        area: {
          type: 'select',
          label: '区',
          clearable: true,
          options: [],
          values: ''
        },
        appointment: {
          type: 'select',
          label: '是否下单',
          clearable: true,
          options: []
        },
        occupation: {
          type: 'select',
          label: '职业',
          clearable: true,
          options: []
        },
        concerns: {
          type: 'input',
          label: '关注问题'
        },
        addr: {
          type: 'input',
          label: '地址'
        },
        qq: {
          type: 'input',
          label: 'QQ号码'
        },
        wechat: {
          type: 'input',
          label: '微信号码'
        },
        customAge: {
          type: 'Tinput',
          label: '年龄',
          clearable: true,
          values: []
        },
        customerLabelTypeId: {
          type: 'select',
          label: '标签类别',
          clearable: true,
          options: []
        },
        labelDataId: {
          type: 'cascader',
          label: '标签',
          clearable: true,
          options: []
        },
        refereeuserId: {
          type: 'select',
          label: '员工推荐人',
          clearable: true,
          options: []
        },
        refereePhone: {
          type: 'input',
          label: '顾客推荐人电话'
        },
        refereeCard: {
          type: 'input',
          label: '推荐人卡号'
        },
        reservationNumber: {
          type: 'input',
          label: '预约号'
        },
        economicCapacity: {
          type: 'select',
          label: '消费能力',
          clearable: true,
          options: []
        },
        visitorId: {
          type: 'input',
          label: '访客ID'
        }
      },
      rowTable: undefined,
      doctor: [],
      Bath: [],
      Chankang: [],
      esthetics: []
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
      this.deptFilingList()
      this.getData()
    },
    'options.channel.values'() {
      if (this.options.channel.values[0]) {
        this.options.channel.options[1] = this.channelType.filter(filter => {
          return filter.typeId === this.options.channel.values[0]
        })[0].channelInfo
      } else {
        this.options.channel.options[1] = []
      }
    },
    'options.channel.values.0'() {
      this.options.channel.values[1] = ''
    },
    // 省
    'options.province.values'() {
      // 如果省份为空 将市清空
      if (this.options.province.values === '') {
        this.options.city.options = []
        this.options.city.values = ''
        return
      }
      // 循环省份里面数据，判断省是否对应，拿到下面的市区
      for (const i in this.options.province.values) {
        const obj = this.options.province.values
        for (const item of this.areaArr) {
          if (obj === item.name) {
            item.sub.forEach(item => {
              item.label = item.name
              item.value = item.name
            })
            this.options.city.options = item.sub
          } else {
            // 当省为空的时候清空区
            this.options.city.values = ''
          }
        }
      }
    },
    'options.city.values'() {
      // 如果市区为空 将区清空
      if (this.options.city.values === '') {
        this.options.area.options = []
        this.options.area.values = ''
        return
      }
      // 循环市里面数据，判断市是否对应的区
      for (const i in this.options.city.values) {
        const obj = this.options.city.values
        for (const item of this.options.city.options) {
          if (obj === item.name) {
            item.sub.forEach(item => {
              item.label = item.name
              item.value = item.name
            })
            this.options.area.options = item.sub
          } else {
            // 当市为空的时候清空区
            this.options.area.values = ''
          }
        }
      }
    },
    'options.customerLabelTypeId.values'() {
      if (this.options.customerLabelTypeId.values === '') {
        this.options.labelDataId.options = []
        // this.options.label.options.splice(0, this.options.label.options.length)
        this.options.labelDataId.values = ''
        return
      }
      var id = this.options.customerLabelTypeId.values
      this.$api.modules.custLabel.custLabelData({
        customerLabelTypeId: id,
        deptId: this.deptId
      }).then(res => {
        if (res) {
          res.rows.forEach(ite => {
            ite.value = ite.labelDataId
            ite.label = ite.labelDataName
          })
          this.options.labelDataId.options = res.rows
        }
      })
    }
  },
  created() {
    this.getData()
    this.deptId = this.$store.getters.departmentId
    this.getUserList()
    this.customerLabelType()
    this.deptFilingList()
    this.customerLabelTypes()
    this.getChannelInfo()
    this.areaArr.forEach(item => {
      item.value = item.name
      item.label = item.name
    })
    this.options.province.options = this.areaArr
    this.options.isReachCourtyard.options = this.dict.type.whether
    this.options.customSex.options = this.dict.type.sys_user_sex
    this.options.appointment.options = this.dict.type.whether // 是否下单
    this.options.occupation.options = this.dict.type.occupation
    this.options.economicCapacity.options = this.dict.type.economic_capacity
    this.getRoomTypeList()
    this.pregnantWeek()
    this.fertility()
    // this.province()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    getCustomerLabel(customerId) {
      this.$api.user.usrtlist({ id: customerId }).then(res => {
        console.log(res)
        this.customLabelDialog = true
        this.customLabelTableData = res.rows
      })
    },
    phoneDetailClick(val) {
      // console.log(val)
      this.$router.push({ path: '/maintainGuestPhoneDetail'})
      sessionStorage.setItem('guestId',val.custom.id)
    },
    newsappointmentAddition(){
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客进行补建档')
        return
      }
      console.log(this.selectionData[0])
      this.$router.push({path:'/consultInput'})
     const query={
        phone:this.selectionData[0].customTruePhone,
        deptId:this.deptId
      }
      sessionStorage.setItem('consultInputitem',JSON.stringify(query))
    },
    searchMergeCustomers() {
      if (this.searchMergeCustomersForm.customPhone === '' && this.searchMergeCustomersForm.customerName === '') {
        this.$message.warning('请输入姓名或电话后再搜索！')
        return
      }
      this.$set(this.searchMergeCustomersForm, 'deptId', this.deptId)
      this.$api.user.customerCmtList(this.searchMergeCustomersForm).then(res => {
        if (res) {
          this.selectMergeCustomerTableData = res.rows
          this.selectMergeCustomerTablePagination.total = res.total
          this.$message.success('查询成功')
        }
      })
    },
    mergeSave() {
      if (Object.keys(this.margeSecondaryCustomerInfo).length === 0) {
        this.$message.error('请先选择要被合并的客户信息')
        return
      }
      this.$api.customerCmt.mergeCustomer(this.mergeForm).then(res => {
        // 操作成功，关闭弹窗
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.Temporary()
          this.getData()
        }
      })
    },
    Temporary() {
      // 清除上次选中的副账户数据
      this.margeSecondaryCustomerInfo = {}
      this.comutTemporary = false
    },
    margeInnerHandleClose() {
      // 清除上次查询的数据
      this.selectMergeCustomerTableData = []
      // 清除上次搜索的表单
      this.searchMergeCustomersForm.customerName = ''
      this.searchMergeCustomersForm.customPhone = ''
      // 关闭弹窗
      this.selectMergeCustomerDialog = false
    },
    handlecompileadd(){
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客')
        return
      }
      let id=this.selectionData[0].id
      this.$api.user.getUserInfoById(id).then(res => {
        if (res) {
          console.log(res.data)
          this.mergeForm.mainId = res.data.id
          this.mergeForm.mainName = res.data.customerName
          this.mergeForm.createuserId = res.data.createuserId
          this.mergeForm.channelTypeId = res.data.channelTypeId
          this.mergeForm.channelId = res.data.channelId
          this.mergeForm.filingId = res.data.filingId
          this.mergeForm.typeTwoId = res.data.typeTwoId
          this.mergeForm.typeThreeId = res.data.typeThreeId
          this.mergeForm.onlineUserId = res.data.onlineUserId
          this.mergeForm.visituserId = res.data.visituserId
          this.mergeForm.customPhone = res.data.phone
          this.mergeForm.deptId = res.data.deptId
          this.margeMainCustomerInfo = res.data
          // 先绑定数据再打开弹出框
          this.comutTemporary = true
        }
      })
    },
    ascription() {
      const data = {
        // id是传递的选中的要修改临客的id数组
        ids: this.selectionData.flatMap(item => [item.id]),
        visituserId: this.ascriptionForm.visituserId,
        onlineUserId: this.ascriptionForm.onlineUserId,
        remark: this.ascriptionForm.remark
      }
      this.$api.customerCmt.modifyAscription(data).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.ascriptionForm = {}
          this.ascriptionDialog = false
        }
      })
    },
    ModificationClose() {
      this.ascriptionDialog = false
    },
    newhandlecompile(){
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.$confirm('变更所选择的所有记录？')
        .then(_ => {
          // this.Addascription(this.selectionData[0].id)
          this.ascriptionDialog = true
          this.ascriptionForm.people = this.selectionData.length
        })
        .catch(_ => {
        })
    },
    channelTypeSelection(selection) {
      const data = this.channelType.filter(filter => {
        return filter.typeId === selection
      })
      this.channelTypeChildren = data[0].channelInfo
    },
    AddMedia() {
      const data = {
        // id是传递的选中的要修改临客的id数组
        ids: this.selectionData.flatMap(item => [item.id]),
        // customerName: this.mediumForm.customerName,
        channelTypeId: this.mediumForm.channelTypeId,
        channelId: this.mediumForm.channelId,
        // 变更备注
        remark: this.mediumForm.remark
      }
      this.$api.customerCmt.modifyAscription(data).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.mediumForm = {}
          this.mediaModification = false
        }
      })
    },
    Media() {
      this.mediaModification = false
    },
    Addrecord() {
      const data = {
        // id是传递的选中的要修改临客的id数组
        ids: this.selectionData.flatMap(item => [item.id]),
        // customerName: this.form.customerName,
        createUserId: this.putOnRecordForm.createUserId,
        filingId: this.putOnRecordForm.filingId,
        typeTwoId: this.putOnRecordForm.typeTwoId,
        typeThreeId: this.putOnRecordForm.typeThreeId,
        remark: this.putOnRecordForm.remark
      }
      this.$api.customerCmt.modifyAscription(data).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.putOnRecordForm = {}
          this.Record = false
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
    selectFilingOneType(data) {
      this.filingTypeDataTwoData = data.child
      this.putOnRecordForm.filingId = data.filingId
      this.putOnRecordForm.typeTwoId = ''
      this.filingTypeDataThreeData = []
    },
    selectFilingTowType(data) {
      this.filingTypeDataThreeData = data.child
      this.queryTypeThreeList = data.child
      this.putOnRecordForm.typeTwoId = data.filingId
      this.putOnRecordForm.typeThreeId = ''
    },
    selectFilingThreeType(data) {
      console.log(data)
      this.putOnRecordForm.typeThreeId = data.filingId
      console.log(this.putOnRecordForm.typeThreeId)
      console.log(this.putOnRecordForm.typeThreeId === data.filingId)
      this.ThreeType = ''
      this.$forceUpdate()
      // this.ThreeType = data.filingNamedata.filingName
    },
    deitRecord(){
      this.Record=false
    },
    AddPhones(){
      this.$refs.changePhoneForm.validate((validate) => {
        if (validate) {
          this.changePhoneForm.deptId = this.deptId
          this.$api.customerCmt.changePhone(this.changePhoneForm).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.changePhoneForm = {}
              this.Telephone = false
            }
          })
        }
      })
    },
    customTelephone(){
    this.Telephone=false
    },
    Export(){
      if (this.tableData.length === 0) {
        this.$message('打印数据为空')
        return
      }
      var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
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
        } else if (this.options[k].type === 'cascader') {
          let filingIds = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingIds.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingIds', filingIds.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingIds = []
            typeTwoIds = []
            typeThreeIds = []
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      const grossConsumption = {
        grossConsumption: 0
      }
      data = Object.assign(data, grossConsumption)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.showDataDialog = true
      this.$api.user.customerCmtList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.statisticsData = res.total
        }
      }).finally(() => {
        this.$export('#out-table', '维护到院临客信息')
        this.showDataDialog = false
      })
  
    },
    // 生育情况
    fertility() {
      const fertility = []
      for (let i = 1; i <= 3; i++) {
        const compet = {
          label: i + '胎',
          value: i + '胎'
        }
        fertility.push(compet)
      }
      this.options.fertility.options = fertility
    },
    // 怀孕几周
    pregnantWeek() {
      const pregnantWeek = []
      for (let i = 1; i <= 52; i++) {
        const temp = {
          label: i + '周',
          value: i
        }
        pregnantWeek.push(temp)
      }
      this.options.pregnantWeek.options = pregnantWeek
    },
    // 房间类型
    getRoomTypeList() {
      this.$api.confinementRoom.roomTypeInfoList({
        deptId: this.deptId,
        state: '0'
      }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.label = item.roomType
            item.value = item.roomTypeId
          })
          this.options.roomTypeId.options = res.rows
        }
      })
    },
    // 关闭临客标签
    customLabel() {
      this.customLabelDialog = false
      this.manualForm.form.customerLabelTypeId = ''
      this.manualForm.form.remark = ''
      this.manualForm.form.registerTime = null
    },

    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    // 预约添加
    appointmentAddition() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.$confirm('变更所选择的所有记录？')
        .then(_ => {
          // this.Temporarycustom(this.selectionData[0].id)
          this.putOnRecordForm.people = this.selectionData.length
          this.Record = true
          this.getFilingType();
        })
        .catch(_ => {
        })
    },
    // 点击跳转是否已到院路由
    customerclick(id, val) {
      if (val.isReachCourtyard === '1') {
        this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
      } else {
        this.$router.push({ path: '/notInHospital', query: { id }})
      }
    },
    // 打开发送短信弹窗
    sendMessage() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.showSendMessageDialog = true
    },
    // 关闭发送短信弹窗
    closeDialog() {
      this.showSendMessageDialog = false
    },
    // 客户标签
    customerLabelEdit() {
      this.$set(this.selectionData[0], 'customerType', '1')
      if (this.selectionData === undefined  || this.selectionData[0] === undefined) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      this.getUserLabelInfo(this.selectionData[0].id)
    },
    // 获取顾客标签
    customerLabelTypes() {
      this.$api.modules.custLabel.custLabelTypeList({
        deptId: this.deptId
      }).then(res => {
        if (res) {
          res.rows.forEach(item => {
            item.value = item.customerLabelTypeId
            item.label = item.labelTypeName
          })
          this.options.customerLabelTypeId.options = res.rows
        }
      })
    },
    // 顾客标签选择
    labelTypeSelection(selection) {
      this.manualForm.form.GuestLabel = undefined
      this.customerLabelTypeChildData = []
      const data = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === selection
      })
      this.customerLabelTypeChildData = data[0].customLabelData
    },
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
    // 为顾客添加标签
    addUserLabel(data) {
      this.manualFormLoading = true
      this.$api.modules.netPower.addUserLabel(data).then(res => {
        if (res) {
          this.getUserLabelInfo(this.selectionData[0].id)
        }
      }).finally(() => {
        this.manualFormLoading = false
      })
    },
    // 从表格中删除
    removeToTable(row) {
      this.$api.modules.netPower.deleteCustomerLabel(row.customerLabelId).then(res => {
        if (res.code === 200) {
          this.$message.success('添加成功')
          this.getUserLabelInfo(this.selectionData[0].id)
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      console.log(e)
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    //
    respliceNameLabel(data) {
      data.forEach(item => {
        item.label = item.typeName
        item.value = item.channelId === undefined ? item.typeId : item.channelId
        if (item.channelInfo !== undefined) {
          this.respliceNameLabel(item.channelInfo)
        }
      })
    },
    // 获取渠道信息
    getChannelInfo(val) {
      this.deptId = val
      /**
       * @author 李尚
       * @date 2022/6/18
       * @Description: 人员添加公司Id 添加状态
       */
      const data = {
        deptId: this.deptId,
        status: '0'
      }
      this.$api.modules.channel.getChannelType(data).then(res => {
        if (res) {
          if (res.data.length !== 0) {
            this.channelType = res.data
            this.respliceNameLabel(res.data)
            this.options.channel.options.splice(0, 0, res.data)
          } else {
            this.options.channel.options = []
            this.options.channel.values = []
          }
        }
      })
    },
    // 打开高级选项
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialog = false
    },
    // 关闭手工上报
    closeShowManualDialog() {
      this.showManualDialog = false
    },
    // 关闭
    closeInnerDialog() {
      this.innerDialog = false
    },
    // 打开手工上报弹窗
    openManualDialog() {
      console.log(this.selectionData)
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      if (this.selectionData[0]==undefined) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      if (this.selectionData.length >1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.$confirm('变更所选择的所有记录？')
        .then(_ => {
          // this.Addmodification(this.selectionData[0].id)
          this.mediumForm.people = this.selectionData.length
          this.mediaModification = true
        })
        .catch(_ => {
        })
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
          this.options.typeThreeIds.options = res.data
        }
      })
    },
    addCustomerLabelTypeToTable() {
      if (this.manualForm.form.GuestLabel === undefined || this.manualForm.form.customerLabelTypeId === undefined) {
        this.$message.error('请先选择标签类型和标签')
        return
      }
      const type = this.customerLabelTypeData.filter(filter => {
        return filter.customerLabelTypeId === this.manualForm.form.customerLabelTypeId
      })
      this.manualForm.form.labelTypeName = type[0].labelTypeName

      const label = this.customerLabelTypeChildData.filter(filter => {
        return filter.customerLabelTypeId === this.manualForm.form.GuestLabel
      })
      this.manualForm.form.labelDataName = label[0].labelTypeName

      let flag = true
      this.manualFormTableData.forEach(item => {
        if (item.GuestLabel === this.manualForm.form.GuestLabel) {
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
        GuestLabel: undefined,
        customerLabelTypeId: undefined,
        labelTypeName: undefined,
        labelDataName: undefined,
        registerTime: null,
        remark: undefined
      }
      this.customerLabelTypeChildData = []
    },
    // 修改列表
    handlecompile() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      if (this.selectionData.length > 1) {
        this.$message.warning('只能同时修改一名顾客的电话')
        return
      }
      this.Telephone = true
      let id=this.selectionData[0].id;
      this.$api.user.getUserInfoById(id).then(res => {
        if (res) {
          this.changePhoneForm = {
            id: id,
            customId: res.data.customId,
            customerName: res.data.customerName,
            phone: '',
            customPhone: res.data.phone,
            remark: ''
          }
        }
      })
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.getData()
    },
    // 搜索栏表格多选
    getUserList(deptId) {
      /**
       * @author 李尚
       * @date 2022/6/17
       * @Description: 人员添加公司Id  添加状态
       */
      const data = {
        deptId: deptId,
        status: '0'
      }
      this.$api.user.getUserList(data).then(res => {
        if (res) {
          res.data.forEach(item => {
            item.label = item.nickName
            item.value = item.userId
          })
          // ---------岗位------
          // 医生
          res.data.forEach(item => {
            if (item.postCode === 'doctor') {
              this.doctor.push(item)
            }
          })
          // ---------------------
          // 洗浴师
          res.data.forEach(item => {
            if (item.postCode === 'therapeutist') {
              this.Bath.push(item)
            }
          })
          // ---------------------
          // 产康
          res.data.forEach(item => {
            if (item.postCode === 'chks') {
              this.Chankang.push(item)
            }
          })
          // ---------------------
          // 美学顾问
          res.data.forEach(item => {
            if (item.postCode === 'xczxs') {
              this.esthetics.push(item)
            }
          })
          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          this.options.visituserId.options = arr1
          this.options.onlineUserId.options = arr1
          this.options.createuserId.options = arr1
          this.options.refereeuserId.options = arr1

        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
    },
    // 获取顾客标签
    customerLabelType() {
      this.$api.modules.custLabel.customerLabelType({
        deptId: this.deptId
      }).then(res => {
        if (res) {
          this.customerLabelTypeData = res.data
        }
      })
    },
    // 获取数据
    getData: debounce(function() {
      var data = {}
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime') {
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
        } else if (this.options[k].type === 'cascader') {
          let filingIds = []
          let typeTwoIds = []
          let typeThreeIds = []
          if (this.options[k].values !== undefined) {
            const arr = this.options[k].values
            arr.forEach(item => {
              filingIds.push(item[0])
              typeTwoIds.push(item[1])
              typeThreeIds.push(item[2])
            })
            this.$set(data, 'filingIds', filingIds.join(','))
            this.$set(data, 'typeTwoIds', typeTwoIds.join(','))
            this.$set(data, 'typeThreeIds', typeThreeIds.join(','))
          } else {
            filingIds = []
            typeTwoIds = []
            typeThreeIds = []
          }
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      const grossConsumption = {
        grossConsumption: 0
      }
      data = Object.assign(data, this.pagination, grossConsumption)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$set(data, 'deptId', this.deptId)
      this.showDataDialog = true
      this.$api.user.customerCmtList(data).then(res => {
        if (res) {
          this.tableData = res.rows
          this.pagination.total = res.total
          this.statisticsData = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    })
  }
}
</script>

<style scoped lang="scss">
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
.container {
  width: 100%;
  height: 100%;
}
.searchBar {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  height: 99%;
  line-height: 30px;
  color: #999;
.title {
  font-weight: bold;
  padding-left: 10px;
  box-sizing: border-box;
  position: relative;
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
ul {
  list-style: none;
li {
  display: inline-block;
  margin: 0 10px;
span {
  color: #666666;
  font-weight: bold;
}
}
}
}
.headerTopPadding {
  padding-top: 16px;
  padding-left: 10px;
  box-sizing: border-box;
}
.color-block-success {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #7ec5b7;
  border-radius: 2px;
  border: 1px solid #7ec5b7;
}
.color-block-default {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  border-radius: 2px;
  border: 1px solid #7ec5b7;
}
.dialogTop {
  width: 100%;
  height: 20px;
  padding-left: 10px;
  box-sizing: border-box;
  position: relative;
  line-height: 20px;
  font-size: 14px;
  font-weight: bold;
  white-space: break-spaces;
  margin-bottom: 10px;
&:before {
   position: absolute;
   left: 0;
   top: 0;
   width: 3px;
   height: 100%;
   background-color: #1abc9c;
   content: "";
 }
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
& > li:nth-of-type(odd) {
    border-bottom: none;
  }
}
}
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
& > div {
    width: 50%;
    padding: 0 20px;
    box-sizing: border-box;
& > .title {
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
.dialog-box {
  width: 100%;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  font-size: 14px;
.title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  background-color: #eeeeee;
  padding: 0 10px;
  line-height: 30px;
  box-sizing: border-box;
span {
  color: #7ec5b7;
}
}
.content {
  padding: 10px;
  box-sizing: border-box;
}
}
span {
  color: #999;
}
::v-deep thead .el-table-column--selection .cell {
  display: none;
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
