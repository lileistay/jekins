<template>
  <!-- 维护正客信息 -->
  <div class="container">
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          :plain="true"
          @click.stop="getData"
          @keydown.enter.native="getData"
        >查询
        </el-button>
        <el-button
          v-has-permi="['confinement:customerCmt:exportName']"
          size="mini"
          icon="el-icon-document"
          type="success"
          :plain="true"
          @click="Export"
        >导出
        </el-button>
      </div>
      <slot>
        <sg-table
          v-if="true"
          id="out-table"
          ref="table"
          :sg-ref="'multipleTable'"
          :pagination="pagination"
          size="mini"
          selection
          :border="true"
          index="序号"
          :table-data="tableData"
          :columns="columns"
          @size-change="sizeChange"
          @current-change="currentChange"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          @table-current-change="handleCurrentChange"
        >
          <div slot="searchBar" class="searchBar">
            <div class="title">维护正客信息
            </div>
            <div>
              <el-button
                v-hasPermi="['confinement:customerCmt:formalModifyAscriptionPhone']"
                size="mini"
                type="primary"
                :plain="true"
                class="headerBarBtn"
                @click.stop.native="editPhone"
              >修改正客电话
              </el-button>
<!--              <el-button-->
<!--                v-hasPermi="['confinement:customerCmt:edit']"-->
<!--                size="mini"-->
<!--                type="success"-->
<!--                :plain="true"-->
<!--                class="headerBarBtn"-->
<!--              >号码合并-->
<!--              </el-button>-->
              <el-button
                v-hasPermi="['confinement:customerCmt:querystay']"
                size="mini"
                type="primary"
                :plain="true"
                class="headerBarBtn"
                @click="improveCustomerInformation"
              >补充客户信息
              </el-button>
            </div>
          </div>
          <div slot="header" style="width: 100%;">
            <!--<el-button-->
            <!--  v-hasPermi="['confinement:customerCmt:edit']"-->
            <!--  size="mini"-->
            <!--  type="primary"-->
            <!--  plain-->
            <!--  class="headerBarBtn"-->
            <!--  @click.stop.native="handlecompile"-->
            <!--&gt;正客合并-->
            <!--</el-button>-->
<!--            <el-button-->
<!--              v-hasPermi="['confinement:customerCmt:edit']"-->
<!--              size="mini"-->
<!--              type="success"-->
<!--              :plain="true"-->
<!--              class="headerBarBtn"-->
<!--            >科室归属服务助理更改-->
<!--            </el-button>-->
<!--            <el-button-->
<!--              v-hasPermi="['confinement:customerCmt:edit']"-->
<!--              size="mini"-->
<!--              type="primary"-->
<!--              :plain="true"-->
<!--              class="headerBarBtn"-->
<!--            >科室归属医生更改-->
<!--            </el-button>-->
            <el-button
              v-hasPermi="['confinement:customerCmt:formalModifyAscriptionem']"
              size="mini"
              type="success"
              :plain="true"
              class="headerBarBtn"
              @click="openRecommend"
            >员工推荐人管理
            </el-button>
            <el-button
              v-hasPermi="['confinement:customerCmt:formalModifyAscriptiongl']"
              size="mini"
              type="primary"
              :plain="true"
              class="headerBarBtn"
              @click="openRefereeManagement"
            >推荐人管理
            </el-button>
            <el-button
              v-hasPermi="['confinement:customerCmt:formalModifyAscriptionedit']"
              size="mini"
              type="success"
              :plain="true"
              class="headerBarBtn"
              @click.stop.native="modification"
            >正客媒介修改
            </el-button>
            <el-button
              v-hasPermi="['confinement:customerCmt:formalModifyAscriptiongs']"
              size="mini"
              type="primary"
              :plain="true"
              class="headerBarBtn"
              @click.stop.native="ascrip"
            >正客归属更改
            </el-button>
            <el-button
              v-hasPermi="['confinement:customerCmt:guestList:edit']"
              size="mini"
              type="primary"
              plain
              class="headerBarBtn"
              @click.stop.native="editPeople"
            >修改新老客
            </el-button>
            <!--<el-button-->
            <!--  v-has-permi="['Appointment:modification']"-->
            <!--  size="mini"-->
            <!--  type="primary"-->
            <!--  plain-->
            <!--  class="headerBarBtn"-->
            <!--  @click.stop.native="deitCustomRecord"-->
            <!--&gt;修改正客建档信息-->
            <!--</el-button>-->
          </div>
          <template #custom="data">
            <div v-if="data.props === 'isReachCourtyard'">
              <show-dict-data :options="dict.type.whether" :value="data.custom.isReachCourtyard" />
            </div>
            <div v-if="data.props === 'isSecondary'">
              <show-dict-data :options="dict.type.whether_secondary" :value="data.custom.isSecondary" />
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
            <div v-else-if="data.props === 'customSex'">
              <show-dict-data :options="dict.type.sys_user_sex" :value="data.custom.customSex" />
            </div>
            <div v-else-if="data.props === 'blacklist'">
              <show-dict-data :options="dict.type.sys_is_blacklist" :value="data.custom.blacklist" />
            </div>
            <div v-else-if="data.props === 'customerStatus'">
              <show-dict-data :options="dict.type.whether_Newguest" :value="data.custom.customerStatus" />
            </div>
            <!-- 是否分配线上客服，有线上客服name就是分配了 -->
            <div v-else-if="data.props === 'hasOnlineWaiter'">
              <span>{{
                data.custom.onlineUserName !== '' && data.custom.onlineUserName !== undefined ? '是' : '否'
              }}</span>
            </div>
            <!-- 是否微信绑定，有openId就是微信绑定 -->
            <div v-else-if="data.props === 'openId'">
              <span>{{ data.custom.openId !== '' && data.custom.openId !== undefined ? '是' : '否' }}</span>
            </div>
            <!-- 点击姓名跳转路由 -->
            <div v-else-if="data.props === 'customerName'">
              <a @click="customerclick(data.custom.id,data.custom)">{{ data.custom.customerName }}</a>
            </div>
            <!-- 点击号码详情跳转到修改 -->
            <div v-else-if="data.props === 'phoneDetail'">
              <a @click="phoneDetailClick(data)">号码详情</a>
            </div>
            <div v-else-if="data.props === 'followUpRemarks'">
              <a @click="followUpRemarksClick(data)">回访备注</a>
            </div>
            <div v-else-if="data.props === 'remarks'">
              <a @click="remarksClick(data)">客户备注</a>
            </div>
            <!-- 点击归属详情跳转到归属更改详情路由 -->
            <div v-else-if="data.props === 'changeList'">
              <!--<a :href="'GuestAscriptionChangeDetail?guestId='+data.custom.customerId">归属更改详情</a> |-->
              <router-link
                :to="{path:'GuestAscriptionChangeDetail',query:{guestId:data.custom.id}}"
                @click.stop.native
              >
                归属更改详情
              </router-link>
            </div>
            <!-- 点击归属详情跳转到归属更改详情路由 -->
            <div v-else-if="data.props === 'guestLabel'">
              <el-button type="text" @click.stop.native="getCustomerLabel(data.custom.id)">正客标签详情</el-button>
            </div>
          </template>
        </sg-table>
      </slot>
    </slideSearch>
    <sg-dialog title="正客标签" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabel">
      <div slot="out">
        <div class="dialog-box">
          <div class="title">
            <div>顾客标签</div>
          </div>
          <div class="content">
            <el-table
              :data="customLabelTableData"
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
            </el-table>
          </div>
        </div>
      </div>
    </sg-dialog>
    <!--【导入】正客归属更改-->
    <!--<sg-dialog title="【导入】正客归属更改" :dialog="Import" @handleClose="fileImport">-->
    <!--  <div slot="out">-->
    <!--    <el-row>-->
    <!--      <el-col :span="20">-->
    <!--        <el-input v-model="Filer" size="mini" clearable placeholder="输入内容查询" style="width: 80%;" />-->
    <!--        <el-button size="mini" icon="el-icon-search" @click="getDeit">浏览文件</el-button>-->
    <!--        <el-checkbox-group v-model="type">-->
    <!--          <el-checkbox-->
    <!--            label="是否同步分配回访>*更改归属后，未回访计划中计划回访人同步更改"-->
    <!--            name="type"-->
    <!--          />-->
    <!--        </el-checkbox-group>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <!--    <el-button size="mini" style="margin-top: 10px" type="primary" plain>提交</el-button>-->
    <!--  </div>-->
    <!--</sg-dialog>-->
    <!--正客合并-->
    <sg-dialog
      title="正客合并"
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
        <el-button size="mini" type="primary" :plain="true" @click="mergeSave">保存</el-button>
        <el-button type="danger" :plain="true" size="mini" @click="Temporary">关闭</el-button>
      </div>
      <div slot="in">
        <sg-table
          ref="selectMergeCustomerTable"
          :sg-ref="'selectMergeCustomerTable'"
          :pagination="selectMergeCustomerTablePagination"
          size="mini"
          :border="true"
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
              <el-button size="mini" type="primary" @click="selectedSecondaryCustomer(data.custom)">选择</el-button>
            </div>
          </template>
        </sg-table>
      </div>
    </sg-dialog>
    <!-- 修改正客电话 -->
    <sg-dialog title="正客电话号码" :dialog="Telephone" size="400px" @handleClose="customTelephone">
      <div slot="out">
        <el-form label-width="120px" size="mini" :model="changePhoneForm" :rules="phoneRules">
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

    <!-- 推荐员工管理 -->
    <sg-dialog title="推荐员工管理" :dialog="recommend" size="400px" @handleClose="recommendClose">
      <div slot="out">
        <el-form
          ref="changeRecommendForm"
          label-width="120px"
          size="mini"
          :model="changeRecommendForm"
          :rules="changeRecommendFormRules"
        >
          <el-form-item label="推荐员工：" prop="refereeuserId">
            <el-select
              v-model="changeRecommendForm.refereeuserId"
              placeholder="请选择推荐员工"
              clearable
              filterable
              :style="{width: '100%'}"
            >
              <el-option
                v-for="(item, index) in sysUserList"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="变更备注：">
            <el-input v-model="changeRecommendForm.remark" />
          </el-form-item>
          <el-button size="mini" @click="AddRecommend">保存</el-button>
          <el-button size="mini" @click="recommendClose">关闭</el-button>
        </el-form>
      </div>
    </sg-dialog>

    <!-- 推荐人管理 -->
    <sg-dialog title="推荐人管理" :dialog="refereeManagement" size="400px" @handleClose="closeRefereeManagement">
      <div slot="out">
        <el-form
          ref="refereeManagementRef"
          label-width="120px"
          size="mini"
          :model="recommendedBy"
          :rules="recommendedByRules"
        >
          <el-form-item label="推荐人姓名：" prop="refereeName">
            <el-select
              v-model="recommendedBy"
              placeholder="请输入推荐人姓名"
              :filterable="true"
              :remote="true"
              :remote-method="searchCustomerCmtList"
              clearable
              filterable
              :style="{width: '100%'}"
            >
              <el-option
                v-for="(item, index) in customerCmtList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="变更备注：">
            <el-input v-model="recommendedBy.remark" />
          </el-form-item>
          <el-button size="mini" @click="refereeManagementSubmit">保存</el-button>
          <el-button size="mini" @click="closeRefereeManagement">关闭</el-button>
        </el-form>
      </div>
    </sg-dialog>

    <!--修改正客建档信息-->
    <sg-dialog
      title="修改正客建档信息"
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
    <!-- 正客媒介修改-->
    <sg-dialog title="正客媒介修改" :dialog="mediaModification" size="400px" @handleClose="Media">
      <div slot="out">
        <el-form ref="mediumForm" label-width="100px" size="mini" :model="mediumForm" :rules="mediumRules">
          <el-form-item label="已选择人数：">
            <el-input v-model="mediumForm.people" disabled style="width: 100%;" />
            <el-button type="primary" size="mini" style="margin-left: 10px;margin-top: 10px" @click="allselects">选择全部人员</el-button>
          </el-form-item>
          <el-form-item label="变更备注：">
            <el-input v-model="mediumForm.remark" style="width: 100%;" type="textarea" />
          </el-form-item>
          <h4>变更媒介</h4>
          <el-form-item label="媒介来源" prop="channelId">
            <el-select
              filterable
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
            <el-select filterable v-model="mediumForm.channelId" style="width: 50%;" class="halfInput" placeholder="请选择">
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
    <!--正客归属更改-->
    <sg-dialog title="正客归属更改" :dialog="ascriptionDialog" @handleClose="ModificationClose">
      <div slot="out">
        <div class="dialog-box">
          <div class="title">
            <div>正客归属更改 <span style="color: red">*不选择就不变更</span></div>
          </div>
          <div class="content">
            <el-form label-width="120px" size="mini" :model="ascriptionForm">
              <el-form-item label="已选择人数：">
                <el-input v-model="ascriptionForm.people" disabled style="width: 100%;" />
                <el-button type="primary" size="mini" style="margin-left: 10px;margin-top: -10px;margin-top: 10px" @click="allselect">选择全部人员</el-button>

              </el-form-item>

              <el-form-item label="变更备注：">
                <el-input v-model="ascriptionForm.remark" style="width: 100%;" type="textarea" />
              </el-form-item>
              <el-form-item label="选择公司：">
                <el-select clearable  size="mini" v-model="companylist" @change="selectChange">
                  <el-option v-for="item in newoptions" :value="item.value" :label="item.label">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="变更美学顾问" prop="receptionId">
                <el-radio-group v-model="ascriptionForm.receptionId">
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
              <el-form-item label="变更客户代表" prop="customerRepresentative">
                <el-radio-group v-model="ascriptionForm.customerRepresentative">
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
              <el-form-item label="变更会员客服" prop="customerRepresentative">
                <el-radio-group v-model="ascriptionForm.memberServiceId">
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
    <!--回访备注与客户备注-->
    <sg-dialog title="备注详情" :dialog="remarksDialog" @handleClose="remarksDialogClose">
      <div slot="out">
        <div class="dialog-box">
          <div class="title">
            <div>备注详情 <span style="color: red" /></div>
          </div>
          <div class="content">
            <el-input
              :value="remarks !== '' ?remarks :'无数据'"
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 12 }"
            />
          </div>
        </div>

      </div>
    </sg-dialog>
    <sg-dialog title="新老客更改" :dialog="peopleDialog" size="400px" @handleClose="peopleDialog=false">
      <div slot="out">
        <div class="content">
          <el-form label-width="120px" ref="peoplelist" size="mini" :rules="rules" :model="peoplelist">
            <el-form-item label="客户状态" prop="user">
              <el-select v-model="peoplelist.user" placeholder="请选择收费单类型" filterable >
                <el-option
                  v-for="item in dict.type.whether_Newguest"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否二次到院" prop="status">
              <el-select v-model="peoplelist.status" placeholder="请选择收费单类型" filterable >
                <el-option
                  v-for="item in dict.type.whether_secondary"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <div style="text-align: right">
              <el-button size="mini" @click="submitPeople">保存</el-button>
              <el-button size="mini" @click="peopleDialog=false">关闭</el-button>
            </div>
          </el-form>
        </div>
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
import { beforeDayTime, todayTime } from '@/utils/time'
import moment from 'moment'
import { validPhone } from '@/utils/validate'

export default {
  name: 'MaintainFormalInformation',
  dicts: ['marital_status', 'sys_user_sex', 'hospat_yn',
    'economic_capacity', 'execution_type', 'return_stage',
    'occupation', 'whether', 'sys_is_blacklist', 'occupation',
    'whether_Newguest','whether_secondary'
  ],
  components: {
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
      peoplelist:{},
      peopleDialog:false,
      companylist:0,
      deptOptions:[],
      newoptions:[],
      selectAlls:false,
      selectionDatanew:[],
      newselectAlls:false,
      newselectionDatanew:[],
      rules:{
        user: [{ required: true, message: '客户状态不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '选择是否二次到院', trigger: 'blur' }],
      },
      selectionData: [],
      channelTypeChildren: [],
      Beauty: '',
      ascriptionDialog: false, // 正客归属更改
      remarksDialog: false, // 备注详情弹出框
      remarks: '', // 备注详情弹出框
      type: [],
      Filer: '', // 修改正客建档信息
      Telephone: false, // 正客修改
      comutTemporary: false, // 正客合并
      // 正客合并内选择框开关
      selectMergeCustomerDialog: false,
      Import: false, // 导入
      putOnRecordForm: {
        people: null,
        type: []
      },
      // 推荐员工管理
      recommend: false,
      changeRecommendForm: {},
      changeRecommendFormRules: {
        refereeuserId: [{
          required: true, message: '请选择推荐员工', trigger: 'blur'
        }]
      },
      // 推荐人管理
      customerCmtList: [], // 搜索出的推荐人
      refereeManagement: false,
      refereeManagementForm: {},
      recommendedBy: {},
      recommendedByRules: {
        refereeName: [{
          required: true, message: '请选择推荐人', trigger: 'blur'
        }]
      },
      // 修改客户电话
      changePhoneForm: {},
      phoneRules: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
          { validator: validatePhone, trigger: 'change' }
        ]
      },
      // 正客媒介修改
      mediumForm: {
        people: null
      },
      mediumRules: {
        channelId: [{ required: true, message: '请选择媒介', trigger: 'blur' }]
      },
      // 正客合并
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
        customPhone: null
      },
      // 正客合并主账号信息
      margeMainCustomerInfo: {},
      // 正客合并副账号信息
      margeSecondaryCustomerInfo: {},
      // 正客合并的查询副账户请求
      searchMergeCustomersForm: {
        customPhone: '',
        customerName: ''
      },
      // :pagination="selectMergeCustomerTablePagination"
      // :table-data="selectMergeCustomerTableData"
      // :columns="selectMergeCustomerTableColumns"
      // 选择合并人的分页
      selectMergeCustomerTablePagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      // 选择合并人的表格数据和选择合并人的表头
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
      ascriptionForm: {
        people: null
      },
      Record: false, // 修改正客建档信息
      mediaModification: false, // 正客媒介更改
      // 建档类型加载
      filingLoading: false,
      // 建档第一类型
      filingTypeData: [],
      // 建档第二类型
      filingTypeDataTwoData: [],
      // 建档第三类型
      filingTypeDataThreeData: [],
      // 第三类型模糊查询
      ThreeType: undefined,
      tableDatas: [],
      submitLoading: false,
      // 系统用户列表
      sysUserList: [],
      manualFormLoading: false,
      // 客户标签
      customLabelDialog: false,
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
          registerTime: undefined,
          remark: undefined,
          labelTypeName: undefined,
          labelDataName: undefined
        }
      },
      // 顾客标签数据table
      customLabelTableData: [],
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
          width: 120,
          val: 'changeList',
          custom: 'changeList'
        },
        {
          lab: '客户',
          val: 'customerName',
          custom: 'customerName',
          width: 120
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 140
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '客户状态',
          val: 'customerStatus',
          custom: 'customerStatus',
          width: 140
        },

        {
          lab: '是否二次到院',
          val: 'isSecondary',
          custom: 'isSecondary',
          width: 120
        },
        {
          lab: '性别',
          val: 'customSex',
          width: 140,
          custom: 'customSex'
        },
        {
          lab: '年龄',
          val: 'customAge',
          width: 140
        },
        {
          lab: '会员客服',
          val: 'memberServiceName',
          width: 140
        },
        {
          lab: '美学顾问',
          val: 'receptionName',
          width: 140
        },
        {
          lab: '归属客户代表',
          val: 'customerrepName',
          width: 140
        },
        // {
        //   lab: '服务助理',
        //   val: '',
        //   width: 140
        // },
        // {
        //   lab: '会员客服',
        //   val: '',
        //   width: 140
        // },
        {
          lab: '推荐人',
          val: 'refereeName',
          width: 140
        },
        {
          lab: '员工推荐人',
          val: 'refereeuserName',
          width: 140
        },
        {
          lab: '消费金额',
          val: 'grossConsumption',
          width: 140
        },
        {
          lab: '建档时间',
          val: 'createTime',
          width: 160
        },
        {
          lab: '会员等级',
          val: 'membershipEvel',
          width: 160
        },
        {
          lab: '消费次数',
          val: 'eliminateNumber',
          width: 160
        },
        {
          lab: '回访次数',
          val: 'returnNum',
          width: 160
        },
        {
          lab: '最后回访时间',
          width: 160,
          val: 'lastReturnVisitTime'
        },
        {
          lab: '最后来院时间',
          width: 160,
          val: 'lastArrivalTime'
        },
        {
          lab: '是否黑名单',
          width: 120,
          val: 'blacklist',
          custom: 'blacklist'
        },
        {
          lab: '正客标签',
          val: '',
          custom: 'guestLabel',
          width: 120
        },
        {
          lab: '媒介类型',
          val: 'channelName',
          width: 180,
          showOverflowTooltip: true
        },
        {
          lab: '客户备注',
          val: 'remarks',
          width: 140,
          custom: 'remarks',
          showOverflowTooltip: true
        },
        {
          lab: '回访备注',
          val: 'followUpRemarks',
          width: 140,
          custom: 'followUpRemarks',
          showOverflowTooltip: true
        },
        {
          lab: '剩余预约金',
          width: 160,
          val: 'advancePayment'
        },
        {
          lab: '剩余储值现金',
          width: 160,
          val: 'storedValue'
        },
        {
          lab: '剩余储值总额',
          width: 160,
          val: 'totalStoredValue'
        }
      ],
      // 查询列表
      options: {
        createTime: {
          type: 'datetimerangeopentions',
          label: '建档时间',
          clearable: true,
          // beforeDayTime 传递天数可以获取几天前的时间，方便查询
          values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
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
        memberServiceId: {
          type: 'select',
          label: '会员客服',
          clearable: true,
          options: []
        },
        receptionId: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },
        customerRepresentative: {
          type: 'select',
          label: '客户代表',
          clearable: true,
          options: []
        },
        refereeName: {
          type: 'input',
          label: '推荐人姓名',
          clearable: true,
          options: []
        },
        visituserId: {
          type: 'select',
          label: '回访人',
          clearable: true,
          options: []
        },
        // typeThreeIds: {
        //   type: 'cascader',
        //   label: '建档类型',
        //   clearable: true,
        //   props: { multiple: true, children: 'child', label: 'filingName', value: 'filingId' },
        //   options: []
        // },
        lastReturnVisitTime: {
          type: 'Tdatetime',
          label: '最后回访时间',
          clearable: true,
          values: []
        },
        returnNum: {
          type: 'Tinput',
          label: '回访次数',
          clearable: true,
          values: []
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
        occupation: {
          type: 'select',
          label: '职业',
          clearable: true,
          options: []
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
          label: '顾客标签',
          clearable: true,
          options: []
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
    },
    nickName: {
      get() {
        return this.$store.getters.user.nickName
      }
    }
  },
  watch: {
    deptId(val) {
      this.deptId = val
      this.getChannelInfo(val)
      this.customerLabelType(val)
      // this.deptFilingList()
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
    },
    // 监听正客合并表单中媒介来源的变化，同时修改媒介类型的id
    'mergeForm.channelId'() {
      if (this.mergeForm.channelId === this.margeMainCustomerInfo.channelId) {
        this.mergeForm.channelTypeId = this.margeMainCustomerInfo.channelTypeId
      } else {
        this.mergeForm.channelTypeId = this.margeSecondaryCustomerInfo.channelTypeId
      }
    },
    // 监听正客合并三级建档类型的变化，并修改提交表单中二级和一级的id
    'mergeForm.typeThreeId'() {
      if (this.mergeForm.typeThreeId === this.margeMainCustomerInfo.typeThreeId) {
        this.mergeForm.typeTwoId = this.margeMainCustomerInfo.typeTwoId
        this.mergeForm.filingId = this.margeMainCustomerInfo.filingId
      } else {
        this.mergeForm.typeTwoId = this.margeSecondaryCustomerInfo.typeTwoId
        this.mergeForm.filingId = this.margeSecondaryCustomerInfo.filingId
      }
    }
  },
  created() {
    this.getData()
    this.deptId = this.$store.getters.departmentId

    this.getUserList()
    this.customerLabelType()
    // this.deptFilingList()
    this.customerLabelTypes()
    this.getChannelInfo()
    this.getFilingType()
    this.areaArr.forEach(item => {
      item.value = item.name
      item.label = item.name
    })
    this.options.province.options = this.areaArr
    this.setSex()
    this.setOccupation()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
    this.$api.dept.deptList({ status: '0' }, 'get').then(res => {
      if (res) {
        this.deptOptions = this.handleTree(res.data, 'deptId')
        this.newoptions=[];
        this.deptOptions[0].children.forEach(value=>{
            value.children.forEach(newvalue=>{
              newvalue.children.forEach(values=>{
                values.label=values.deptName
                values.value=values.deptId
                // if(values.deptId)
                this.newoptions.push(values)
              })
            })
        })
        this.companylist=this.deptId
      }
    })

  },
  methods: {
    selectChange(e){
      const data = {
        deptId: e,
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

          // 去重
          const arr1 = this.unique(res.data)
          this.sysUserList = arr1
          // this.options.refereeuserId.options = arr1
        }
      })
    },
    allselects(){
      var data = {}
      this.newselectAlls=true;
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime' || this.options[k].type === 'datetimerangeopentions') {
          if (this.options[k].values === null) {
            data['end' + k] = null
          } else if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          } else if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          } else if (this.options[k].values[1] === undefined && this.options[k].values[0] === undefined) {
            data[k] = null
            data['end' + k] = null
          } else if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          } else if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            console.log(this.options[k].values[1])
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          } else if (this.options[k].values.length === 0) {
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
      data = Object.assign(data, this.pagination)
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'formalCustomer', '1')
      this.showDataDialog = true
      this.$api.user.customerCmtList(data).then(res => {
        if (res) {
          this.mediumForm.people = res.total;
          res.rows.forEach(value=>{
            this.newselectionDatanew.push(value)
          })

          // this.pagination.total = res.total
          // this.statisticsData = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    allselect(){
      var data = {}
      this.selectAlls=true;
      for (const k in this.options) {
        if ((this.options[k].type === 'datetimerange' || this.options[k].type === 'Tinput' || this.options[k].type === 'daterange') && Array.isArray(this.options[k].values)) {
          data[k] = this.options[k].values[0]
          data['end' + k] = this.options[k].values[1]
        } else if (this.options[k].type === 'Tselect') {
          this.$set(data, 'channelTypeId', this.options[k].values[0])
          this.$set(data, 'channelId', this.options[k].values[1])
          this.$delete(data, 'channel')
        } else if (this.options[k].type === 'Tdatetime' || this.options[k].type === 'datetimerangeopentions') {
          if (this.options[k].values === null) {
            data['end' + k] = null
          } else if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          } else if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          } else if (this.options[k].values[1] === undefined && this.options[k].values[0] === undefined) {
            data[k] = null
            data['end' + k] = null
          } else if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          } else if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            console.log(this.options[k].values[1])
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          } else if (this.options[k].values.length === 0) {
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
      data = Object.assign(data, this.pagination)
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'formalCustomer', '1')
      this.showDataDialog = true
      this.$api.user.customerCmtList(data).then(res => {
        if (res) {
          this.ascriptionForm.people = res.total;
          res.rows.forEach(value=>{
            this.selectionDatanew.push(value)
          })

          // this.pagination.total = res.total
          // this.statisticsData = res.total
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    },
    // 修改新老客
    editPeople(){
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      if (this.selectionData.length > 1) {
        this.$message.warning('只能同时修改一名顾客的电话')
        return
      }
      this.peoplelist={
        status:this.selectionData[0].isSecondary,
        user:this.selectionData[0].customerStatus
      }
      this.peopleDialog=true
    },
    submitPeople(){
      this.$refs.peoplelist.validate(valid => {
        if (valid) {
          const query={
            isSecondary:this.peoplelist.status,
            customerStatus:this.peoplelist.user,
            id:this.selectionData[0].id
          }
          this.$api.modules.netPower.editCustomerBookInfo(query).then(res=>{
            if (res.code==200){
              this.peopleDialog=false
              this.getData()
            }
          })
        }
      })
    },

    Export() {
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
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
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
        this.$export('#out-table', '维护正式客户信息')
        this.showDataDialog = false
      })
    },
    // 补充客户信息
    improveCustomerInformation() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      if (this.selectionData.length > 1) {
        this.$message.warning('只能同时修改一名顾客的电话')
        return
      }
      this.$router.push({ path: '/ImproveCustomerInformation', query: { customerId: this.selectionData[0].id }})
    },
    // 保存正客合并
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
    // 搜索要合并的正客信息
    searchMergeCustomers() {
      if (this.searchMergeCustomersForm.customPhone === '' && this.searchMergeCustomersForm.customerName === '') {
        this.$message.warning('请输入姓名或电话后再搜索！')
        return
      }
      this.$api.user.customerCmtList(this.searchMergeCustomersForm).then(res => {
        if (res) {
          this.selectMergeCustomerTableData = res.rows
          this.selectMergeCustomerTablePagination.total = res.total
          this.$message.success('查询成功')
        }
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
      }
    },
    getCustomerLabel(customerId) {
      this.$api.user.usrtlist({ id: customerId }).then(res => {
        // console.log(res)
        this.customLabelDialog = true
        this.customLabelTableData = res.rows
      })
    },
    // 设置职业选择框
    setOccupation() {
      // console.log('设置职业options')
      this.$api.dict.getDicts('occupation').then(res => {
        if (res) {
          res.data.forEach(item => {
            this.options.occupation.options.push({ label: item.dictLabel, value: item.dictValue })
          })
        }
      })
    },
    // 设置性别选择框
    setSex() {
      // console.log('设置性别')
      this.$api.dict.getDicts('sys_user_sex').then(res => {
        if (res) {
          res.data.forEach(item => {
            this.options.customSex.options.push({ label: item.dictLabel, value: item.dictValue })
          })
        }
      })
    },
    // 点击跳转号码详情页面
    phoneDetailClick(val) {
      // console.log(val)
      this.$router.push({ path: '/maintainGuestPhoneDetail'})
      sessionStorage.setItem('guestId',val.custom.id)
    },
    // 点击建档类型
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
      this.putOnRecordForm.typeThreeId = data.filingId
      this.ThreeType = ''
      this.$forceUpdate()
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
    // 关闭正客标签
    customLabel() {
      this.customLabelDialog = false
      this.manualForm.form.customerLabelTypeId = ''
      this.manualForm.form.remark = ''
      this.manualForm.form.registerTime = ''
    },
    // 回车搜索
    getDatakeyup() {
      document.onkeyup = e => {
        if (e.keyCode === 13) {
          this.getData()
        }
      }
    },
    handleCurrentChange(val) {
      this.rowTable = val[1]
    },
    // 点击跳转客户详情路由
    customerclick(id, val) {
      if (val.isReachCourtyard === '1') {
        this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus }})
      } else {
        this.$router.push({ path: '/notInHospital', query: { id }})
      }
    },
    // 正客归属更改
    ownership() {
      this.Import = true
    },
    fileImport() {
      this.Import = false
    },
    // 修改正客电话 - 打开
    editPhone() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      if (this.selectionData.length > 1) {
        this.$message.warning('只能同时修改一名顾客的电话')
        return
      }
      this.Editphone(this.selectionData[0].id)
    },
    // 修改正客电话 - 取数据
    Editphone(id) {
      // this.changePhoneForm.id = id
      this.Telephone = true
      this.$api.user.getUserInfoById(id).then(res => {
        if (res) {
          this.changePhoneForm = {
            id: id,
            customerName: res.data.customerName,
            phone: '',
            customPhone: res.data.phone,
            remark: ''
          }
        }
      })
    },
    // 打开推荐员工弹窗
    openRecommend() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.recommend = true
    },
    // 修改推荐员工
    AddRecommend() {
      this.$refs.changeRecommendForm.validate((valid) => {
        if (valid) {
          this.changeRecommendForm.ids = this.selectionData.flatMap(item => [item.id])
          this.$api.customerCmt.formalModifyAscription(this.changeRecommendForm).then(res => {
            if (res) {
              this.$message.success('修改成功')
              const recordList = []
              const changerAfter = this.sysUserList.find((user) => user.value === this.changeRecommendForm.refereeuserId)
              this.selectionData.forEach(item => {
                recordList.push({
                  id: item.id,
                  changeField: '推荐员工',
                  changerBefore: item.refereeuserName || '',
                  changerAfter: changerAfter.nickName,
                  operatorName: this.nickName,
                  changerRemark: this.changeRecommendForm.remark
                })
              })
              this.$api.changeAscriptionRecord.batchAddChangeCustomerRecordList(recordList).then(res => {
                this.changeRecommendForm = {}
                this.recommend = false
              })
            }
          }).finally(() => {
            this.changeRecommendForm = {}
            this.recommend = false
          })
        } else {
          this.$message.error('请选择推荐员工')
        }
      })
    },
    recommendClose() {
      this.changeRecommendForm = {}
      this.recommend = false
    },
    // 修改正客电话 - 保存
    AddPhones() {
      this.changePhoneForm.deptId = this.deptId
      this.$api.customerCmt.changePhone(this.changePhoneForm).then(res => {
        if (res) {
          this.$message.success('修改成功')
          this.changePhoneForm = {}
          this.Telephone = false
        }
      })
    },
    // 修改正客电话 - 关闭
    customTelephone() {
      this.Telephone = false
    },
    // 修改正客建档信息
    deitRecord() {
      this.Record = false
    },
    // 打开修改正客建档弹窗
    deitCustomRecord() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.$confirm('变更所选择的所有记录？')
        .then(_ => {
          // this.Temporarycustom(this.selectionData[0].id)
          this.putOnRecordForm.people = this.selectionData.length
          this.Record = true
        })
        .catch(_ => {
        })
    },
    // 修改建档类型
    Addrecord() {
      const data = {
        // id是传递的选中的要修改正客的id数组
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

    // 正客媒介更改 - 打开
    modification() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
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
    // 保存正客媒介修改
    AddMedia() {
      this.$refs.mediumForm.validate((valid) => {
        if (valid) {
          let data={}
          if(this.newselectAlls){
            data = {
              // id是传递的选中的要修改正客的id数组
              ids: this.newselectionDatanew.flatMap(item => [item.id]),
              // customerName: this.mediumForm.customerName,
              channelTypeId: this.mediumForm.channelTypeId,
              channelId: this.mediumForm.channelId,
              // 变更备注
              remark: this.mediumForm.remark
            }
          }else{
            data = {
              // id是传递的选中的要修改正客的id数组
              ids: this.selectionData.flatMap(item => [item.id]),
              // customerName: this.mediumForm.customerName,
              channelTypeId: this.mediumForm.channelTypeId,
              channelId: this.mediumForm.channelId,
              // 变更备注
              remark: this.mediumForm.remark
            }
          }

          this.$api.customerCmt.formalModifyAscription(data).then(res => {
            if (res) {
              this.$message.success('修改成功')
              // 添加修改记录
              const recordList = []
              const channel = this.channelType.find((channel) => channel.typeId === this.mediumForm.channelTypeId)
              console.log(channel)
              const channelTwo = this.channelTypeChildren.find((channel1) => channel1.channelId === this.mediumForm.channelId)
              this.selectionData.forEach(item => {
                recordList.push({
                  id: item.id,
                  changeField: '媒介类型',
                  changerBefore: item.channelName,
                  changerAfter: channel.typeName + ' / ' + channelTwo.typeName,
                  operatorName: this.nickName,
                  changerRemark: this.mediumForm.remark
                })
              })
              this.$api.changeAscriptionRecord.batchAddChangeCustomerRecordList(recordList).then(res => {
                this.mediumForm = {}
                this.mediaModification = false
              })
            }
          }).finally(() => {
            this.mediumForm = {}
            this.mediaModification = false
          })
        } else {
          this.$message.error('表单验证不通过')
          return false
        }
      })
    },
    Media() {
      this.mediaModification = false
    },
    channelTypeSelection(selection) {
      const data = this.channelType.filter(filter => {
        return filter.typeId === selection
      })
      this.channelTypeChildren = data[0].channelInfo
    },
    // 正客归属更改
    ascrip() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.$confirm('变更所选择的所有记录？')
        .then(_ => {
          this.ascriptionDialog = true
          this.ascriptionForm.people = this.selectionData.length
        }).catch(_ => {
        })
    },
    // 获取某一人的归属信息
    // Addascription(id) {
    //   this.$api.user.getUserInfoById(id).then(res => {
    //     if (res) {
    //       this.ascriptionForm = res.data
    //     }
    //   })
    // },
    // 正客改归属-保存
    ascription() {
      if (this.ascriptionForm.customerRepresentative === undefined &&
        this.ascriptionForm.receptionId === undefined &&
        this.ascriptionForm.memberServiceId === undefined
      ) {
        this.$message.error('未进行任何修改！')
        return
      }
        if(this.selectAlls){
          data = {
            // id是传递的选中的要修改正客的id数组
            ids: this.selectionDatanew.flatMap(item => [item.id]),
            customerRepresentative: this.ascriptionForm.customerRepresentative,
            receptionId: this.ascriptionForm.receptionId,
            memberServiceId: this.ascriptionForm.memberServiceId,
            remark: this.ascriptionForm.remark
          }
        }else{
         data = {
            // id是传递的选中的要修改正客的id数组
            ids: this.selectionData.flatMap(item => [item.id]),
            customerRepresentative: this.ascriptionForm.customerRepresentative,
            receptionId: this.ascriptionForm.receptionId,
            memberServiceId: this.ascriptionForm.memberServiceId,
            remark: this.ascriptionForm.remark
          }
        }

      this.$api.customerCmt.formalModifyAscription(data).then(res => {
        if (res) {
          this.$message.success('修改成功')
          // 添加美学顾问修改记录
          if (this.ascriptionForm.receptionId) {
            const recordList = []
            const changerAfter = this.sysUserList.find((user) => user.value === this.ascriptionForm.receptionId)
            this.selectionData.forEach(item => {
              recordList.push({
                id: item.id,
                changeField: '美学顾问',
                changerBefore: item.receptionName ? item.receptionName : '',
                changerAfter: changerAfter.nickName,
                operatorName: this.nickName,
                changerRemark: this.ascriptionForm.remark
              })
            })
            this.$api.changeAscriptionRecord.batchAddChangeCustomerRecordList(recordList).then(res => {
              console.log(res)
            })
          }
          // 添加客户代表修改记录
          if (this.ascriptionForm.customerRepresentative) {
            const recordList = []
            const changerAfter = this.sysUserList.find((user) => user.value === this.ascriptionForm.customerRepresentative)
            this.selectionData.forEach(item => {
              recordList.push({
                id: item.id,
                changeField: '客户代表',
                changerBefore: item.customerrepName ? item.customerrepName : '',
                changerAfter: changerAfter.nickName,
                operatorName: this.nickName,
                changerRemark: this.ascriptionForm.remark
              })
            })
            this.$api.changeAscriptionRecord.batchAddChangeCustomerRecordList(recordList).then(res => {
              console.log(res)
            })
          }
          // 添加会员客服修改记录
          if (this.ascriptionForm.memberServiceId) {
            const recordList = []
            const changerAfter = this.sysUserList.find((user) => user.value === this.ascriptionForm.memberServiceId)
            this.selectionData.forEach(item => {
              recordList.push({
                id: item.id,
                changeField: '会员客服',
                changerBefore: item.memberServiceName ? item.memberServiceName : '',
                changerAfter: changerAfter.nickName,
                operatorName: this.nickName,
                changerRemark: this.ascriptionForm.remark
              })
            })
            console.log(recordList)
            this.$api.changeAscriptionRecord.batchAddChangeCustomerRecordList(recordList).then(res => {
              this.ModificationClose()
            })
          }
        }
      }).finally(() => {
        this.ModificationClose()
      })
    },
    // 正客改归属-关闭
    ModificationClose() {
      this.ascriptionDialog = false
      this.ascriptionForm = {}
    },
    // 客户标签
    customerLabelEdit() {
      this.$set(this.selectionData[0], 'customerType', '1')
      if (this.selectionData === undefined || this.selectionData[0] === undefined) {
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
          this.customLabelTableData = res.data.labelRelations
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
     * @Description: 此处表格需要多选
     */
    handleSelectionChange(e) {
      // console.log(e[1])
      this.selectionData = e[1]
      // 获取多选选择列表中的某一个属性的，类似java的流式计算
      // console.log(this.selectionData.flatMap(item => [item.id]))
    },
    /**
     * @author yun
     * @date 2023/3/24
     * @Description: 多选行内点击选中
     */
    rowClick(e) {
      this.selectionData = e[1]
      this.$refs.table.$refs.multipleTable.toggleRowSelection(this.selectionData)
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
    // 打开手工上报弹窗
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.showManualDialog = true
    },
    // 获取建档类型
    // deptFilingList() {
    //   const data = {
    //     deptId: this.deptId,
    //     status: '0'
    //   }
    //   this.$api.modules.filing.getFilingTypeById(data).then(res => {
    //     if (res.data) {
    //       this.options.typeThreeIds.options = res.data
    //     }
    //   })
    // },
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
      this.customLabelTableData.forEach(item => {
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
        registerTime: undefined,
        remark: undefined
      }
      this.customerLabelTypeChildData = []
    },
    // 修改列表
    handlecompile() {
      if (this.selectionData.length !== 1) {
        this.$message.warning('请选择一名顾客')
        return
      }
      this.Addhandlecompile(this.selectionData[0].id)
    },
    // 打开正客合并弹窗
    Addhandlecompile(id) {
      this.$api.user.getUserInfoById(id).then(res => {
        if (res) {
          // console.log(res.data)
          this.mergeForm.mainId = res.data.id
          this.mergeForm.createuserId = res.data.createuserId
          this.mergeForm.channelTypeId = res.data.channelTypeId
          this.mergeForm.channelId = res.data.channelId
          this.mergeForm.filingId = res.data.filingId
          this.mergeForm.typeTwoId = res.data.typeTwoId
          this.mergeForm.typeThreeId = res.data.typeThreeId
          this.mergeForm.onlineUserId = res.data.onlineUserId
          this.mergeForm.visituserId = res.data.visituserId
          this.mergeForm.customPhone = res.data.phone
          this.margeMainCustomerInfo = res.data
          // 先绑定数据再打开弹出框
          this.comutTemporary = true
        }
      })
    },
    Temporary() {
      // 清除上次选中的副账户数据
      this.margeSecondaryCustomerInfo = {}
      this.comutTemporary = false
    },
    // 正客合并内部弹框选择副正客信息
    selectedSecondaryCustomer(info) {
      this.margeSecondaryCustomerInfo = info
      // 正客合并表单的副账户id
      this.mergeForm.secondaryId = info.id
      // 关闭内弹窗
      this.margeInnerHandleClose()
      this.$forceUpdate()
    },
    // 合并内部弹框关闭
    margeInnerHandleClose() {
      // 清除上次查询的数据
      this.selectMergeCustomerTableData = []
      // 清除上次搜索的表单
      this.searchMergeCustomersForm.customerName = ''
      this.searchMergeCustomersForm.customPhone = ''
      // 关闭弹窗
      this.selectMergeCustomerDialog = false
    },
    /** 分页*/
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getData()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
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
          this.options.customerRepresentative.options = arr1
          this.options.receptionId.options = arr1
          this.options.memberServiceId.options = arr1
          // this.options.refereeuserId.options = arr1
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
        } else if (this.options[k].type === 'Tdatetime' || this.options[k].type === 'datetimerangeopentions') {
          if (this.options[k].values === null) {
            data['end' + k] = null
          } else if (this.options[k].values[0] === null && this.options[k].values[1] !== null) {
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          } else if (this.options[k].values[1] === null && this.options[k].values[0] !== null) {
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
          } else if (this.options[k].values[1] === undefined && this.options[k].values[0] === undefined) {
            data[k] = null
            data['end' + k] = null
          } else if (this.options[k].values[1] === null && this.options[k].values[0] === null) {
            data[k] = null
            data['end' + k] = null
          } else if (this.options[k].values[1] !== null && this.options[k].values[0] !== null) {
            console.log(this.options[k].values[1])
            data[k] = moment(this.options[k].values[0]).format('YYYY-MM-DD HH:mm:ss')
            data['end' + k] = moment(this.options[k].values[1]).format('YYYY-MM-DD HH:mm:ss')
          } else if (this.options[k].values.length === 0) {
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
      data = Object.assign(data, this.pagination)
      this.$set(data, 'deptId', this.deptId)
      this.$set(data, 'formalCustomer', '1')
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
    }),
    // 点击客户备注
    remarksClick(data) {
      this.remarks = data.custom.remarks ? data.custom.remarks : ''
      this.remarksDialog = true
    },
    // 点击回访备注
    async followUpRemarksClick(val) {
      // console.log(val.custom)
      const data = {
        id: val.custom.id,
        pageSize: 1000,
        pageNum: 1
      }
      // 发起回访备注获取请求
      const { rows: res1 } = await this.$api.netPower.noArrivedList(data)
      const { rows: res2 } = await this.$api.netPower.AlreadyArrivedList(data)
      const list = [...res1, ...res2]
      // console.log(list)
      list.forEach(item => {
        if (item.returnVisitFeedback) {
          this.remarks = this.remarks + '[' + item.actualReturnvisitTime + ']:' + item.returnVisitFeedback + '\n\n'
        }
      })
      this.remarksDialog = true
    },
    // 备注详情弹窗关闭
    remarksDialogClose() {
      this.remarks = ''
      this.remarksDialog = false
    },
    // 推荐人管理
    openRefereeManagement() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.refereeManagement = true
    },
    // 推荐人管理提交
    refereeManagementSubmit() {
      this.$refs.refereeManagementRef.validate((valid) => {
        if (valid) {
          this.refereeManagementForm.ids = this.selectionData.flatMap(item => [item.id])
          this.refereeManagementForm.refereeId = this.recommendedBy.id
          this.refereeManagementForm.refereeCard = this.recommendedBy.customCardNumber
          this.refereeManagementForm.refereePhone = this.recommendedBy.refereePhone
          this.refereeManagementForm.refereeName = this.recommendedBy.refereeName
          this.refereeManagementForm.remark = this.recommendedBy.remark
          this.$api.customerCmt.formalModifyAscription(this.refereeManagementForm).then(res => {
            if (res) {
              this.$message.success('修改成功')
              this.closeRefereeManagement()
            }
          })
          // 添加修改记录
          const recordList = []
          this.selectionData.forEach(item => {
            recordList.push({
              id: item.id,
              changeField: '推荐人',
              changerBefore: item.refereeName,
              changerAfter: this.recommendedBy.refereeName,
              operatorName: this.nickName,
              changerRemark: this.recommendedBy.remark
            })
          })
          this.$api.changeAscriptionRecord.batchAddChangeCustomerRecordList(recordList).then(res => {
            console.log(res)
          })
        } else {
          this.$message.error('请选择推荐人')
        }
      })
    },
    // 关闭推荐人管理
    closeRefereeManagement() {
      this.recommendedBy = {}
      this.customerCmtList = []
      this.refereeManagementForm = {}
      this.refereeManagement = false
    },
    // 远程搜索推荐人
    searchCustomerCmtList(val) {
      // console.log(val)
      if (val) {
        this.$api.netPower.selectRecommend({ namephonecard: val }).then(res => {
          console.log(res)
          res.data.forEach(item => {
            item.label = item.refereeName + '(' + item.refereePhone + ')'
            item.value = item
          })
          this.customerCmtList = res.data
        })
      }
    }
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
    //width: 100%;
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

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}

::v-deep .el-table .success-row {
  background: #4cb20d;
}

</style>
<style>
.el-input__prefix {
  display: none;
  width: 1px;
}
</style>
