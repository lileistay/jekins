<template>
  <!-- 临客查询 -->
  <div>
    <slideSearch :options="options">
      <div slot="btnBar">
        <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="getData(true)"
          @keyup.enter.native="getData">查询
        </el-button>
        <el-button v-has-permi="['confinement:customerReservationForm:exportguest']" size="mini" type="success"
          icon="el-icon-upload2" plain :loading="submitLoading" @click="exportExcel">导出
        </el-button>
      </div>
      <slot>
        <sg-table id="out-table" v-if="true" ref="table" :sg-ref="'multipleTable'" :pagination="pagination" size="mini"
          selection border index="序号" highlight-current-row :table-data="tableData" :columns="columns"
          :row-class-name="rowClassName" @size-change="sizeChange" @current-change="currentChange" @row-click="rowClick"
          @selection-change="handleSelectionChange" @table-current-change="handleCurrentChange">
          <div slot="searchBar" class="searchBar">
            <div class="title">信息统计</div>
            <div>
              <span>客户数量: {{ statisticsData }}人</span>

            </div>
          </div>
          <div slot="header" style="width: 100%;">
            <span style="font-size: 14px;"><i class="el-icon-s-fold" style="cursor:pointer"
                @click="getDialogStemporary" /> 列表清单</span>
            <el-button v-hasPermi="['confinement:customerCmt:edit']" size="mini" type="primary" plain icon="el-icon-plus"
              class="headerBarBtn" @click.stop.native="handlecompile">补充客户信息
            </el-button>
            <el-button v-has-permi="['Appointment:modification']" size="mini" type="success" plain icon="el-icon-plus"
              class="headerBarBtn" @click.stop.native="appointmentAddition">修改分成级别
            </el-button>
            <el-button v-hasPermi="['sysManger:dept:Handmade']" size="mini" type="primary" plain icon="el-icon-plus"
              class="headerBarBtn" @click.stop.native="openManualDialog">手工上报
            </el-button>
            <el-button v-has-permi="['sysManger:dept:label']" size="mini" type="primary" plain icon="el-icon-edit-outline"
              class="headerBarBtn" @click.stop="customerLabelEdit">新增分成客户
            </el-button>
          </div>
          <template #custom="data">
            <div v-if="data.props === 'customSex'">
              {{ data.custom.customSex == '0' ? '男' : data.custom.customSex == '1' ? "女" : "未知" }}
            </div>
            <div v-else-if="data.props === 'onlineUserId'">
              {{ newlistch(data.custom.onlineUserId) }}
            </div>
            <div v-else-if="data.props === 'appointment'">
              <a href="#" @click="deduction(data.custom)">抵扣</a>
              <a href="#" style="margin-left: 10px;" @click="integral(data.custom)">转积分</a>
              <a href="#" style="margin-left: 10px;" @click="addform(data.custom)">增加</a>
            </div>
            <div v-else-if="data.props === 'isReachCourtyard'">
              <a href="#" @click="addvariation(data.custom)">收益变动详情</a>
              <a href="#" style="margin-left: 10px;" @click="editpass(data.custom)">分成级别修改记录</a>
            </div>
            <div v-else-if="data.props === 'acName'">
              {{ data.custom.acName == 'null' ? '' : data.custom.acName }}
            </div>
            <div v-else-if="data.props === 'refereeNum'">
              <a  @click="handadd(data.custom)">{{ data.custom.refereeNum }}人查看</a>
            </div>
            <div v-else-if="data.props === 'dividendTypeName'">
              <div>{{ datanewsl(data.custom.dividendTypeName) }}</div>
            </div>

            <!-- 点击姓名跳转路由 -->
            <div v-else-if="data.props === 'customerName'">
              <a @click="customerclick(data.custom.id, data.custom)">{{ data.custom.customerName }}</a>
            </div>
          </template>
        </sg-table>

      </slot>
    </slideSearch>
    <sg-dialog title="新增分成客户" :dialog="customLabelDialog" out-top="50px" @handleClose="customLabelDialog = false"
      size="470px">
      <div slot="out">

        <div
          style="position: absolute;width: 300px;height: 200px;border: 1px solid #eee;background-color: #fff;z-index: 1000;margin-left:100px;margin-top: 40px;overflow: scroll;overflow-x: hidden;"
          v-show="listnews">
          <div style="width: 100%;height: 40px;text-align: center;line-height:40px;border: 1px solid #eee;"
            v-for="(item, index) in listnew" :key="index" @click="handchanges(item)">
            {{ item.refereePhone }}({{ item.refereeName }})
          </div>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="客户姓名" prop="configName">
            <el-input v-model="ruleForm.configName" style="width: 300px;" @input="inputchange" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="客户电话" prop="configKey">
            <el-input v-model="ruleForm.configKey" style="width: 300px;" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="分成类型">
            <el-select filterable v-model="ruleForm.dividendTypeName" @change="changedivi" style="width:300px" size="mini">
              <el-option v-for="item in options.ratioId.options" :value="item.dividendTypeId"
                :label="item.dividendTypeName">

              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="">
            <el-input v-model="ruleForm.remark" style="width: 300px;" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-button size="mini" type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                        <el-button size="mini" @click="showDialog = false">取消</el-button> -->
          </el-form-item>

        </el-form>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;align-items: center;">
          <div style="width: 150px;">
            <el-button size="mini" type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
            <el-button size="mini" @click="customLabelDialog = false">取消</el-button>
          </div>
        </div>
      </div>
    </sg-dialog>
    <sg-dialog title="修改分成级别" :dialog="customLabelDialogs" out-top="50px" @handleClose="customLabelDialogs = false"
      size="470px">
      <div slot="out">

        <div
          style="position: absolute;width: 300px;height: 200px;border: 1px solid #eee;background-color: #fff;z-index: 1000;margin-left:100px;margin-top: 40px;overflow: scroll;overflow-x: hidden;"
          v-show="listnews">
          <div style="width: 100%;height: 40px;text-align: center;line-height:40px;border: 1px solid #eee;"
            v-for="(item, index) in listnew" :key="index" @click="handchanges(item)">
            {{ item.refereePhone }}({{ item.refereeName }})
          </div>
        </div>
        <el-form :model="ruleForms" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
          <el-form-item label="客户姓名" prop="configName">
            <el-input v-model="ruleForms.configName" style="width: 300px;" @input="inputchange" disabled="" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="客户电话" prop="configKey">
            <el-input v-model="ruleForms.configKey" style="width: 300px;" disabled="" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="分成类型">
            <el-select filterable v-model="ruleForms.dividendTypeName" @change="changedivi" style="width:300px" size="mini">
              <el-option v-for="item in options.ratioId.options" :value="item.dividendTypeId"
                :label="item.dividendTypeName">

              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="">
            <el-input v-model="ruleForms.remark" style="width: 300px;" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-button size="mini" type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                        <el-button size="mini" @click="showDialog = false">取消</el-button> -->
          </el-form-item>

        </el-form>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;align-items: center;">
          <div style="width: 150px;">
            <el-button size="mini" type="primary" :loading="submitLoading" @click="submitForms">确认</el-button>
            <el-button size="mini" @click="customLabelDialogs = false">取消</el-button>
          </div>
        </div>
      </div>
    </sg-dialog>
    <sg-dialog title="抵扣" :dialog="deductions" out-top="50px" @handleClose="deductions = false" size="470px">
      <div slot="out">
        <div
          style="position: absolute;width: 300px;height: 200px;border: 1px solid #eee;background-color: #fff;z-index: 1000;margin-left:100px;margin-top: 40px;overflow: scroll;overflow-x: hidden;"
          v-show="listnews">
          <div style="width: 100%;height: 40px;text-align: center;line-height:40px;border: 1px solid #eee;"
            v-for="(item, index) in listnew" :key="index" @click="handchanges(item)">
            {{ item.refereePhone }}({{ item.refereeName }})
          </div>
        </div>
        <el-form :model="newruleForm" :rules="newrules" ref="newformadd" label-width="100px" class="demo-ruleForm">
          <el-form-item label="客户姓名">
            <el-input v-model="newruleForm.configName" style="width: 300px;" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="客户电话">
            <el-input v-model="newruleForm.configKey" style="width: 300px;" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="可用收益">
            <el-input v-model="newruleForm.configKeyky" style="width: 300px;" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="抵扣收益" prop="configKeysy">
            <el-input-number v-model="newruleForm.configKeysy" style="width: 600px;" :min="0"
              @input="ysinput" size="mini"></el-input-number>
          </el-form-item>
          <el-form-item label="业务类型">
            <el-select filterable v-model="newruleForm.dividendTypeName" @change="changedivi" style="width:300px" size="mini">
              <el-option v-for="item in dict.type.deduct_type" :value="item.value" :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务单号" prop="configKeydh">
            <el-input v-model="newruleForm.configKeydh" style="width: 300px;" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="">
            <el-input v-model="newruleForm.remark" style="width: 300px;" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-button size="mini" type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                        <el-button size="mini" @click="showDialog = false">取消</el-button> -->
          </el-form-item>

        </el-form>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;align-items: center;">
          <div style="width: 150px;">
            <el-button size="mini" type="primary" :loading="submitLoading" @click="submitFormdeduction">确认</el-button>
            <el-button size="mini" @click="deductions = false">取消</el-button>
          </div>
        </div>
      </div>
    </sg-dialog>
    <sg-dialog title="转积分" :dialog="integratings" out-top="50px" @handleClose="integratings = false" size="470px">
      <div slot="out">
        <div
          style="position: absolute;width: 300px;height: 200px;border: 1px solid #eee;background-color: #fff;z-index: 1000;margin-left:100px;margin-top: 40px;overflow: scroll;overflow-x: hidden;"
          v-show="listnews">
          <div style="width: 100%;height: 40px;text-align: center;line-height:40px;border: 1px solid #eee;"
            v-for="(item, index) in listnew" :key="index" @click="handchanges(item)">
            {{ item.refereePhone }}({{ item.refereeName }})
          </div>
        </div>
        <el-form :model="newsruleForm" :rules="newsrules" ref="newforms" label-width="100px" class="demo-ruleForm">
          <el-form-item label="客户姓名">
            <el-input v-model="newsruleForm.configName" style="width: 300px;" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="客户电话">
            <el-input v-model="newsruleForm.configKey" style="width: 300px;" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="可用收益">
            <el-input v-model="newsruleForm.configKeyky" style="width: 300px;" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="转换收益" prop="expendNum" >
            <el-input v-model="newsruleForm.expendNum" style="width: 300px;" :min="0" placeholder="每单位收益=10积分" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="">
            <el-input v-model="newsruleForm.remark" style="width: 300px;" type="textarea" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-button size="mini" type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                        <el-button size="mini" @click="showDialog = false">取消</el-button> -->
          </el-form-item>

        </el-form>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;align-items: center;">
          <div style="width: 150px;">
            <el-button size="mini" type="primary" :loading="submitLoading" @click="submitFormintegral">确认</el-button>
            <el-button size="mini" @click="integratings = false">取消</el-button>
          </div>
        </div>
      </div>
    </sg-dialog>
    <sg-dialog title="增加收益" :dialog="addintegratings" out-top="50px" @handleClose="addintegratings = false" size="470px">
      <div slot="out">
        <div
          style="position: absolute;width: 300px;height: 200px;border: 1px solid #eee;background-color: #fff;z-index: 1000;margin-left:100px;margin-top: 40px;overflow: scroll;overflow-x: hidden;"
          v-show="listnews">
          <div style="width: 100%;height: 40px;text-align: center;line-height:40px;border: 1px solid #eee;"
            v-for="(item, index) in listnew" :key="index" @click="handchanges(item)">
            {{ item.refereePhone }}({{ item.refereeName }})
          </div>
        </div>
        <el-form :model="addnewsruleForm" :rules="addnewsrules" ref="newlform" label-width="100px" class="demo-ruleForm">
          <el-form-item label="客户姓名">
            <el-input v-model="addnewsruleForm.configName" style="width: 300px;" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="客户电话">
            <el-input v-model="addnewsruleForm.configKey" style="width: 300px;" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="可用收益">
            <el-input v-model="addnewsruleForm.configKeyky" style="width: 300px;" disabled size="mini"></el-input>
          </el-form-item>
          <el-form-item label="增加收益" prop="expendNum">
            <el-input v-model="addnewsruleForm.expendNum" style="width: 300px;" :min="0" placeholder="" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="">
            <el-input v-model="addnewsruleForm.remark" style="width: 300px;" type="textarea" size="mini"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-button size="mini" type="primary" :loading="submitLoading" @click="submitForm">确认</el-button>
                        <el-button size="mini" @click="showDialog = false">取消</el-button> -->
          </el-form-item>

        </el-form>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;align-items: center;">
          <div style="width: 150px;">
            <el-button size="mini" type="primary" :loading="submitLoading" @click="submitFormintegraladd">确认</el-button>
            <el-button size="mini" @click="addintegratings = false">取消</el-button>
          </div>
        </div>
      </div>
    </sg-dialog>
    <sg-dialog title="收益变动详情" :dialog="variation" out-top="50px" @handleClose="variation = false" size="50%">
      <div slot="out">
        <div style="height:450px">


          <el-table :data="newDectorAdvicePrice" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" border height="400px">

            <el-table-column prop="customerName" label="姓名" width="100" align="center"></el-table-column>
            <el-table-column prop="customPhone" label="电话" width="130" align="center"></el-table-column>
            <el-table-column prop="dividendAmount" label="收益" width="100" align="center"></el-table-column>
            <el-table-column prop="executorName" label="执行人" width="100" align="center"></el-table-column>
            <el-table-column prop="executorTime" label="执行时间" width="200" align="center"></el-table-column>
            <el-table-column prop="changeType" label="业务类型" width="100" align="center">
              <template slot-scope="scope">
                <div>
                  {{ newsheight(scope.row.changeType) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注" width="200" align="center"></el-table-column>
          </el-table>
        </div>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;align-items: center;">
          <div style="width: 80px;">
            <el-button size="mini" @click="variation = false">关闭</el-button>
          </div>
        </div>
      </div>


    </sg-dialog>
    <sg-dialog title="分成级别修改记录" :dialog="editvariation" out-top="50px" @handleClose="editvariation = false" size="72%">
      <div slot="out">
        <div style="height:450px">
          <el-table :data="newDectorAdvicePrices" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" border height="400px">
            <!-- <el-table-column prop="customerName" label="序号" width="100" align="center"></el-table-column> -->
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="customerName" label="姓名" width="130" align="center"></el-table-column>
            <el-table-column prop="customPhone" label="电话" width="200" align="center"></el-table-column>
            <el-table-column prop="beforeTypeName" label="修改前" width="200" align="center"></el-table-column>
            <el-table-column prop="typeName" label="修改后" width="200" align="center"></el-table-column>
            <el-table-column prop="createTime" label="修改时间" width="180" align="center"></el-table-column>
            <el-table-column prop="createBy" label="修改人" width="200" align="center"></el-table-column>
            <el-table-column prop="remarks" label="备注" width="200" align="center"></el-table-column>
          </el-table>
        </div>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;align-items: center;">
          <div style="width: 80px;">
            <el-button size="mini" @click="editvariation = false">关闭</el-button>
          </div>
        </div>
      </div>


    </sg-dialog>
    <!-- <sg-dialog title="下级客户列表" :dialog="neweditvariation" out-top="50px" @handleClose="neweditvariation = false"
      size="95%">
      <div slot="out">
        <div style="height:450px">
          <el-table :data="newDectorAdvicePrice" stripe :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" border height="400px">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="customName" label="分成级别" width="130" align="center"></el-table-column>
            <el-table-column prop="customPhone" label="客户姓名" width="100" align="center"></el-table-column>
            <el-table-column prop="beforeTypeName" label="客户电话" width="100" align="center"></el-table-column>
            <el-table-column prop="typeName" label="客户性别" width="200" align="center"></el-table-column>
            <el-table-column prop="changeTime" label="客户年龄" width="100" align="center"></el-table-column>
            <el-table-column prop="remarks" label="客户状态" width="200" align="center"></el-table-column>
            <el-table-column prop="remarks" label="美学顾问" width="200" align="center"></el-table-column>
            <el-table-column prop="remarks" label="客户代表" width="200" align="center"></el-table-column>、
            <el-table-column prop="remarks" label="上级客户" width="200" align="center"></el-table-column>
            <el-table-column prop="remarks" label="是否成交" width="200" align="center"></el-table-column>
            <el-table-column prop="remarks" label="到院时间" width="200" align="center"></el-table-column>
            <el-table-column prop="remarks" label="最后消费时间" width="200" align="center"></el-table-column>
            <el-table-column prop="remarks" label="成交金额" width="200" align="center"></el-table-column>
          </el-table>
        </div>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;align-items: center;">
          <div style="width: 80px;">
            <el-button size="mini" @click="neweditvariation = false">关闭</el-button>
          </div>
        </div>
      </div>


    </sg-dialog> -->
    <manual-submission :show-manual-dialog="showManualDialog" :inner-dialog="innerDialog" :selection-data="selectionData"
      @closeInnerDialog="closeInnerDialog" @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog" />
    <send-message :show-send-message-dialog="showSendMessageDialog" :selection-data="selectionData"
      @closeDialog="closeDialog" />
    <sg-table id="out-table" size="mini" index="序号" style="display: none" :table-data="tableDatas" :columns="columns">
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
          <a @click="customerclick(data.custom.id, data.custom)">{{ data.custom.customerName }}</a>
        </div>
      </template>
    </sg-table>
    <import-template ref="import" :upload="upload" @downloadTemplate="downloadTemplate" @handleFileClose="handleFileClose"
      @handleFileUploadProgress="handleFileUploadProgress" @handleFileSuccess="handleFileSuccess"
      @handleFileError="handleFileError" @submitFileForm="submitFileForm" />
    <!--  列表排序弹框    -->
    <Dsort :drow_table="'LINKE'" :showDialogS="showDialogStemporary" @showdialogT="showdialogT" :sortList="columns1"
      :selectEnable="selectEnable" ref="temporary" :itemHandleSelectionChange="itemHandleSelectionChange">

    </Dsort>
  </div>
</template>

<script>

import area from '@/utils/area'
import { debounce } from '@/utils/throttleAndDebounce'
import slideSearch from '@/components/SlideSearchBar/index'
import SgTable from '@/components/Table'
import SgDialog from '@/components/Dialog'
import {beforeDayTime, newgetData, todayTime} from '@/utils/time'
import ManualSubmission from '@/components/ManualSubmission'
import SendMessage from '@/components/SendMessage'
import importTemplate from '@/components/ImportTemplate'
import moment from 'moment'
import Dsort from '@/components/Dsort'
import Sortable from 'sortablejs' //排序拖拽
// 引入导出Excel表格依赖
import { export_table_to_excel } from '@/utils/utils'

export default {
  name: 'BookFormQuery',
  dicts: ['marital_status', 'sys_user_sex', 'hospat_yn', 'economic_capacity', 'execution_type', 'return_stage', 'occupation', 'whether', 'deduct_type'],
  components: {
    SendMessage,
    ManualSubmission,
    SgDialog,
    SgTable,
    slideSearch,
    importTemplate,
    Dsort
  },
  data() {
    return {
      listnews: false,
      isSelect:false,
      newDectorAdvicePrice: [],
      customLabelDialogs: false,
      deductions: false,
      integratings: false,
      addintegratings: false,
      variation: false,
      editvariation: false,
      neweditvariation: false,
      ruleForm: {
        configName: '',
        configKey: "",
        configValue: "",
        configType: "Y",
        remark: "",
        dividendTypeName: "",


      },
      ruleForms: {
        configName: '',
        configKey: "",
        configValue: "",
        configType: "Y",
        remark: "",
        dividendTypeName: "",
      },
      newruleForm: {
        configName: '',
        configKey: "",
        configKeyky: "",
        configKeysy: "",
        configKeydh: "",
        remark: "",
        dividendTypeName: "",
      },
      newsruleForm: {
        configName: '',
        configKey: "",
        configKeyky: "",
        expendNum: "",
        remark: "",
      },
      addnewsruleForm: {
        configName: '',
        configKey: "",
        configKeyky: "",
        expendNum: "0",
        remark: "",
      },
      rules: {
        configName: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
        ],
        configKey: [
          { required: true, message: '请输入客户电话', trigger: 'blur' },

        ],
        configValue: [
          // { required: true, message: '请输入参数键值', trigger: 'blur' },

        ],
      },
      newrules: {
        configKeysy: [
          { required: true, message: '请输入抵扣收益', trigger: 'blur' },
        ],
        configKeydh: [
          { required: true, message: '请输入业务单号', trigger: 'blur' },

        ],

      },
      newsrules: {
        expendNum: [
          { required: true, message: '请输入转换积分', trigger: 'blur' },
        ],

      },
      addnewsrules: {
        expendNum: [
          { required: true, message: '请输入增加收益', trigger: 'blur' },
        ],

      },

      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 上传的地址
        url: '/api/sorage/insertInfo/importInstall'
      },
      tableDatas: [],
      submitLoading: false,
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
        total: 0,
        currentPage: 1
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
          lab: '操作',
          val: 'appointment',
          custom: 'appointment',
          width: 150,
        },
        {
          lab: '操作记录',
          val: 'isReachCourtyard',
          custom: 'isReachCourtyard',
          width: 200,
        },
        {
          lab: '分成级别',
          val: 'dividendTypeName',
          custom: 'dividendTypeName',
          width: 120
        },
        // {
        //   lab: '性别',
        //   val: 'customSex'
        // },
        {
          lab: '客户姓名',
          val: 'customerName',
          custom: 'customerName',
          width: 120
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '电话',
          val: 'customPhone',
          width: 100,
          showOverflowTooltip: true
        },
        {
          lab: '性别',
          val: 'customSex',
          custom: 'customSex',
        },
        {
          lab: '年龄',
          val: 'customAge',
          width: 120

        },
        {
          lab: '线上客服',
          val: 'onlineUserId',
          custom: 'onlineUserId',

        },
        {
          lab: '推广客户数量',
          val: 'refereeNum',
          custom: 'refereeNum',
          width: 160
        },
        {
          lab: '可用积分',
          val: 'usablePoints'
        },
        {
          lab: '可用收益',
          val: 'usableIncome'
        },
        {
          lab: '累积收益',
          val: 'incomeTotal',
          width: 120,
          showOverflowTooltip: true
        },
        {
          lab: '美学顾问',
          val: 'acName',
          width: 180,
          custom: 'acName',
        },
        {
          lab: '加入时间',
          val: 'joinTime',
          width: 180
        },
        {
          lab: '备注',
          val: 'remarks',
          width: 140
        },
      ],
      columns1: [
        {
          lab: '是否下单',
          val: 'appointment',
          custom: 'appointment'
        },

      ],
      // 查询列表
      options: {
        joinTime: {
          type: 'datetimerangeopentions',
          label: '加入时间',
          clearable: true,
          values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
        },
        usableIncome: {
          type: 'Tinput',
          label: '可用收益范围:',
          clearable: true,
          values: [],
          options: []
        },
        // usableIncome: {
        //   type: 'Tdatetime',
        //   label: '可收益时间',
        //   clearable: true,
        //   values: [new Date(beforeDayTime(0)[0]), new Date(todayTime()[1])]
        // },
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '电话'
        },
        customCardNumber: {
          type: 'input',
          label: '客户卡号'
        },
        aestheticConsultant: {
          type: 'select',
          label: '美学顾问',
          clearable: true,
          options: []
        },

        ratioId: {
          type: 'select',
          label: '分成级别',
          clearable: true,
          options: []
        },
        onlineUserId: {
          type: 'select',
          label: '线上客服',
          clearable: true,
          options: []
        },
        channelTypeId: {
          type: 'Tselect',
          label: '媒介类型',
          clearable: true,
          values: [],
          options: []
        },

      },
      rowTable: undefined,
      doctor: [],
      Bath: [],
      Chankang: [],
      esthetics: [],
      // 排序弹框
      showDialogStemporary: false,
      selectionDataSortList: [],//选中的列表数据
      xflagList: [],
      cancelList: [],
      listnew: [],
      newid: "",
      ratioId: "",
      dividendRatio: "",
      dividendTypeName: "",
      debounces: [],
      newDectorAdvicePrices: [],
      beforeTypeName: "",


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
      this.getData() // 人员数据
    },
    'options.channelTypeId.values'() {
      if (this.options.channelTypeId.values[0]) {
        this.options.channelTypeId.options[1] = this.channelType.filter(filter => {
          return filter.typeId === this.options.channelTypeId.values[0]
        })
      } else {
        this.options.channelTypeId.options[1] = []
      }
    },
    'options.channelTypeId.values.0'() {
      this.options.channelTypeId.values[1] = ''
    },

  },
  mounted(){
    let that=this;
       document.querySelector('body').onclick=function(){
        that.listnews = false;
       }
  },
  created() {

    this.getData();
    this.$api.user.getUserList().then((res) => {
      res.data.forEach((item) => {
        item.label = item.nickName
        item.value = item.userId
      })
      res.data.forEach((item) => {
        // 医美顾问 xczxs
        if (item.postCode === 'xczxs') {
          this.options.aestheticConsultant.options.push(item)

        }
      })
      this.options.aestheticConsultant.options = this.handleArrRepeat(
        this.options.aestheticConsultant.options
      ) // 医美顾问
    })
    this.$api.user.getUserList({ status: '0', deptId: this.deptId }).then(res => {
      if (res) {
        this.$forceUpdate();
        res.data.forEach((item) => {
          item.label = item.nickName
          item.value = item.userId
        })
        const arr1 = this.unique(res.data);
        // 员工推荐
        this.options.onlineUserId.options = arr1;
      }
    })
    const query = {
      pageNum: 1,
      pageSize: 100,
      deptId: this.deptId
    }
    this.$api.modules.activityManagement.selectRecommend(query).then(res => {

      if (res) {
        res.rows.forEach((item) => {
          item.label = item.dividendTypeName
          item.value = item.dividendTypeId
        })
        this.options.ratioId.options = res.rows;
        console.log(this.options.ratioId.options, 'sdakdjasj')

      }
    })
    const data = {
      deptId: this.deptId,
      status: '0'
    }
    this.$api.modules.channel.getChannelType(data).then(res => {
      if (res) {
        if (res.data.length !== 0) {
          this.channelType = res.data;
          this.respliceNameLabel(res.data);
          this.options.channelTypeId.options.splice(0, 0, res.data)
        } else {
          this.options.channelTypeId.options = []
          this.options.channelTypeId.values = []
        }
      }
    })
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    exportExcel(){
      console.log('道出了')
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
      // const grossConsumption = {
      //   grossConsumption: 0
      // }
      // data = Object.assign(data, this.pagination, grossConsumption)
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      // if (isSearch) {
      //   this.pagination.pageNum = 1
      //   this.pagination.currentPage = 1
      // }
      // data = Object.assign(data, this.pagination)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
      */
      this.$set(data, 'deptId', this.deptId)
      this.showDataDialog = true
      this.$api.modules.activityManagement.extensionCustomer(data).then(res => {
        if (res) {
          this.pagination.total = res.total
          this.tableData = res.rows
        }
      }).finally(() => {
        this.$export('#out-table', '老带新推广客户查询')
        this.showDataDialog = false
      })

    },
    customerclick(id, val) {
      this.$router.push({ path: '/customerInfo', query: { id, status: val.customerStatus, noDeal: val.receptionStatus, } })
    },
    newsheight(val) {
      let name = ''
      this.dict.type.deduct_type.forEach(value => {
        if (value.value == val) {
          name = value.label;
        }
      })
      return name
    },
    datanewsl(val) {
      return val

    },
    handadd(val) {
      console.log('12113')
      this.$router.push('/billchildren')
      localStorage.setItem('children_id', val.id)

    },
    editpass(val) {
      this.editvariation = true;
      let data = {
        id: val.id
      }
      this.$api.modules.activityManagement.extensionDividendChangeInfoedit(data).then(res => {
        this.newDectorAdvicePrices = res.rows;
      })

    },
    addvariation(val) {
      this.variation = true;
      let data = {
        id: val.id
      }
      this.$api.modules.activityManagement.getIncreaseIncomenews(data).then(res => {
        this.newDectorAdvicePrice = res.rows;
      })

    },
    submitFormintegraladd() {
      this.$refs['newlform'].validate(valid => {
        if (valid) {
          let data = {
            ecId: this.debounces.ecId,
            id: this.debounces.id,
            expendNum: this.addnewsruleForm.expendNum,
            deptId: this.deptId,
          }
          this.$api.modules.activityManagement.getIncreaseIncome(data).then(res => {
            if (res.code == 200) {
              this.$message.success('增加收益成功');
              this.addintegratings = false;
              this.getData();
            }
          })
        }


      })

    },
    addform(val) {
      this.addintegratings = true;
      this.addnewsruleForm.configName = val.customerName;
      this.addnewsruleForm.configKey = val.customPhone;
      this.addnewsruleForm.configKeyky = val.usableIncome
      this.debounces = [];
      this.debounces = val;
    },
    integral(val) {
      this.newsruleForm.configName = val.customerName;
      this.newsruleForm.configKey = val.customPhone;
      this.newsruleForm.configKeyky = val.usableIncome
      this.integratings = true;
      this.debounces = [];
      this.debounces = val;
    },
    submitFormintegral() {
      //       ecId		-- 推广客户主键
      // id
      // expendNum 	-- 抵扣转换收益值
      // deptId
      if (this.newsruleForm.expendNum > this.debounces.usableIncome) {
        this.$message.warning('可用收益不够');
        return
      }
      this.$refs['newforms'].validate(valid => {
        if (valid) {
          let data = {
            ecId: this.debounces.ecId,
            id: this.debounces.id,
            expendNum: this.newsruleForm.expendNum,
            deptId: this.deptId,
          }

          this.$api.modules.activityManagement.getRevenueConversionCredits(data).then(res => {
            if (res.code == 200) {
              this.$message.success('转积分成功');
              this.integratings = false;
              this.getData();
            }
          })
        }

      })

    },
    submitFormdeduction() {
      this.$refs['newformadd'].validate(valid => {
        if (valid) {

          console.log(this.newruleForm.configKeyky,this.debounces.usableIncome)
          if(this.newruleForm.configKeysy > this.debounces.usableIncome) {
        this.$message.warning('可用收益不足');
        return
      }
          let data = {
            deductType: this.newruleForm.dividendTypeName,
            orderNumber: this.newruleForm.configKeydh,
            deptId: this.deptId,
            expendNum: this.newruleForm.configKeysy,
            id: this.debounces.id,
            ecId: this.debounces.ecId,
            remarks: this.newruleForm.remark
          }
          this.$api.modules.activityManagement.getIncomeDeduction(data).then(res => {
            if (res.code == 200) {
              this.$message.success('抵扣成功');
              this.deductions = false;
              this.getData();
            }
          })
        }


      })

      // /confinement/extensionCustomer/getIncomeDeduction

    },
    ysinput(val) {
      // if (val > this.selectionData[0].usableIncome) {
      //   this.$message.warning('可用收益不足')
      // }
    },
    deduction(val) {
      this.deductions = true;
      this.debounces = [];
      this.debounces = val;
      this.newruleForm.configName = val.customerName;
      this.newruleForm.configKey = val.customPhone;
      this.newruleForm.configKeyky = val.usableIncome;
      this.newruleForm.configKeydh='';
      this.newruleForm.dividendTypeName='';



    },
    handlecompile() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.$router.push({ path: '/customerInformation', query: { id: this.selectionData[0].id } })
    },
    submitForms() {
      this.selectionData[0].remarks = this.ruleForms.remark;
      let Name = '';
      this.options.ratioId.options.forEach(value => {
        if (value.value == this.ruleForms.dividendTypeName) {
          Name = value.dividendTypeName;
        }
      })
      this.selectionData[0]['typeName'] = Name
      this.selectionData[0]['beforeTypeName'] = this.beforeTypeName;

      this.ruleForms.dividendTypeName;

      this.$api.modules.activityManagement.extensionDividendChangeInfo(this.selectionData[0]).then(res => {
        if (res.code == 200) {
          this.$message.success('修改成功');
          this.customLabelDialogs = false;
          this.getData();
        }
      })
    },
    appointmentAddition() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }

      this.ruleForms.configName = this.selectionData[0].customerName;
      this.ruleForms.configKey = this.selectionData[0].customPhone;
      this.beforeTypeName = this.selectionData[0].dividendTypeName
      this.options.ratioId.options.forEach(value => {
        if (value.label == this.selectionData[0].dividendTypeName) {
          this.ruleForms.dividendTypeName = Number(value.value);
        }
      })
      this.ruleForms.remark = '';
      this.customLabelDialogs = true;
    },
    closeShowManualDialog() {
      this.showManualDialog = false;
    },
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客')
        return
      }
      this.showManualDialog = true
    },
    newlistch(val) {
      let Name = '';
      this.options.onlineUserId.options.forEach(value => {
        if (value.userId == val) {
          Name = value.nickName;
        }
      })
      return Name
    },
    handchanges(item) {
      this.ruleForm.configName = item.refereeName
      this.ruleForm.configKey = item.refereePhone;
      this.newid = item.id;
      this.listnews = false;
      this.isSelect=true;

    },
    inputchange(val) {
      let data = {
        namephonecard: val
      }
      if(val==''){
        this.listnews = false;
        this.listnew=[];
      }else{
        this.$api.modules.activityManagement.selectRecommendadd(data).then(res => {
        if (res) {
          this.listnew = res.data;
          if (this.listnew.length > 0) {
            this.listnews = true;
          } else {
            this.listnews = false;
            this.$message.warning('搜索暂无数据')
          }
        }
      }).finally(() => {
        this.showDataDialog = false
      })
      }

    },
    submitForm() {

      this.$refs['form'].validate(valid => {
        if (valid) {
          if(!this.isSelect){
            this.$message.warning('请选择指定用户');
            return
          }
          let data = {
            "deptId": this.deptId,
            "ratioId": this.ratioId,
            "dividendRatio": this.dividendRatio,
            "dividendTypeName": this.dividendTypeName,
            "id": this.newid,
            "remarks": this.ruleForm.remark,
          }
          this.$api.modules.activityManagement.extensionCustomeradd(data).then(res => {
            if (res.code == 200) {

              this.$message.success('添加成功');
              this.customLabelDialog = false;
              this.getData();
            }

          })
        }
      })


    },
    changedivi(val) {
      this.options.ratioId.options.forEach(value => {
        if (value.dividendTypeId == val) {
          this.ratioId = value.ratioId;
          this.dividendRatio = value.dividendRatio;
          this.dividendTypeName = value.dividendTypeName;
        }
      })
    },
    customerLabelEdit() {
      this.customLabelDialog = true;
      this.ruleForm.configName = '';
      this.ruleForm.configKey = "";
      this.ruleForm.remark = "";
      this.ruleForm.dividendTypeName = "";
    },
    respliceNameLabel(data) {
      data.forEach(item => {
        item.label = item.typeName
        item.value = item.channelId === undefined ? item.typeId : item.channelId
        if (item.channelInfo !== undefined) {
          this.respliceNameLabel(item.channelInfo)
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.userId) && res.set(arr.userId, 1))
    },
    handleArrRepeat(arr) {
      const newArr = []
      const empty = {}
      arr.forEach((item) => {
        if (!empty[item.userId]) {
          newArr.push(item)
          empty[item.userId] = true
        }
      })
      return newArr
    },
    rowClassName() {

    },
    sizeChange(e) {

    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getData();
    },
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
    },
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      this.selectionData = !this.selectionData[0] ? [] : this.selectionData

    },
    handleCurrentChange() {

    },
    getDialogStemporary() {

    },
    customLabel() {

    },
    closeInnerDialog() {

    },
    setInnerDialog() {

    },
    closeDialog() {

    },
    downloadTemplate() {

    },
    handleFileClose() {

    },
    handleFileUploadProgress() {

    },
    handleFileSuccess() {

    },
    handleFileError() {

    },
    submitFileForm() {

    },
    selectEnable() {

    },
    itemHandleSelectionChange() {

    },
    showdialogT() {

    },
    getData: debounce(function (isSearch) {
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
        }
        else if(this.options[k].type === 'datetimerangeopentions'){
          if(this.options[k].values){
            if(this.options[k].values.length!==0){
              data[k] =newgetData(this.options[k].values[0])
              data['end' + k] =newgetData(this.options[k].values[1])
            }
          }


        }
        else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      // const grossConsumption = {
      //   grossConsumption: 0
      // }
      // data = Object.assign(data, this.pagination, grossConsumption)
      /**
       * @author Nevin
       * @date 2022/8/12
       * @Description: 如果点击搜索按钮，将页码设为1
       */
      if (isSearch) {
        this.pagination.pageNum = 1
        this.pagination.currentPage = 1
      }
      data = Object.assign(data, this.pagination)
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
      */
      this.$set(data, 'deptId', this.deptId)
      this.showDataDialog = true
      if(data.usableIncome<0){
        this.$message.warning('可用收益范围存在负数,请重新输入');
        return
      }
      if(data.endusableIncome<0){
        this.$message.warning('可用收益范围存在负数,请重新输入');
        return
      }
      if(data.endusableIncome<data.usableIncome){
        this.$message.warning('可用收益二应大于可用收益一');
        return
      }
      this.$api.modules.activityManagement.extensionCustomer(data).then(res => {
        if (res) {
          this.pagination.total = res.total
          this.tableData = res.rows
        }
      }).finally(() => {
        this.showDataDialog = false
      })
    }),
  }
}
</script>

<style scoped lang="scss">
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

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 15px !important;
  padding-right: 10px !important;
}

::v-deep .el-input__icon {
  width: 10px !important;
}

::v-deep .el-input-number__decrease {
  display: none !important;
}

::v-deep .el-input-number__increase {
  display: none !important;
}

::v-deep .el-input-number .el-input__inner {
  padding: 0;
  width: 80px;
}
</style>
<style>
.el-table .success-row {
  background-color: #7ec5b7;
}

.el-input__prefix {
  display: none;
}

/* .el-input__inner{
  width: 300px !important;
} */
</style>
