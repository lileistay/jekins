<template>
  <!--技加工-->
  <div class="container">
    <sg-table
      :pagination="pagination"
      max-height="520"
      ref="table"
      id="out-table"
      :sg-ref="'multipleTable'"
      size="mini"
      selection
      border
      index="序号"
      :table-data="tableData"
      :columns="columns"
      @size-change="sizeChange"
      @current-change="currentChange"
      @selection-change="handleSelectionChange"
    >
      <template #custom="data">
        <div v-if="data.props === 'worksheetState'">
          <show-dict-data :options="dict.type.worksheetState" :value="data.custom.worksheetState" />
        </div>
        <div v-if="data.props === 'useFlag'">
          <show-dict-data :options="dict.type.useFlag" :value="data.custom.useFlag" />
        </div>
        <div v-if="data.props === 'settleFlag'" >
          <show-dict-data :options="dict.type.settleFlag" :value="data.custom.settleFlag" />
        </div>
        <div v-if="data.props === 'detail'">
          <a @click="clickDetail(data.custom)">详情</a>
        </div>
        <div v-if="data.props === 'num'">
          <div v-if="tableData.length && tableData[0].toothList[0][0]">
            {{tableData[0].toothList[0][0].materialName}}
          </div>
        </div>
      </template>
      <div slot="searchBar" class="searchBar">
        <el-form size="mini" label-width="100px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="加工单号：">
                <el-input v-model="worksheetNum"/>
              </el-form-item>
              <el-form-item label="加工单位：">
                <el-select filterable clearable v-model="newprocess">
                  <el-option v-for="item in process" :label="item.label" :value="item.value"
                    :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="医生：">
                <el-select filterable clearable v-model="newdoctor">
                  <el-option v-for="item in doctor" :label="item.label" :value="item.value"
                    :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="加工联系人：">
                <el-select filterable clearable v-model="newphone">
                  <el-option v-for="item in phone" :label="item.label" :value="item.value"
                    :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="状态：">
                <el-select filterable clearable v-model="newstatus">
                  <el-option v-for="item in status" :label="item.label" :value="item.value"
                    :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="就诊时间：">
                <el-date-picker
                  v-model="value1"
                  style="width: 160%"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否有效：">
                <el-select clearable v-model="newvalid">
                  <el-option v-for="item in valid" :label="item.label" :value="item.value"
                    :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否结算：">
                <el-select clearable v-model="newsettle">
                  <el-option v-for="item in settle" :label="item.label" :value="item.value"
                    :key="item.value"></el-option>
                </el-select>
                
              </el-form-item>
              <el-form-item label="结算时间：">
                <el-date-picker
                  v-model="settleTime"
                  style="width: 160%"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button size="mini" @click="getdentalWorksheetInfoList(true)">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="header" class="herader">
        <div>
          <span><i class="el-icon-s-data" style="color: #5f94de" />列表清单</span>
          <span><i style="background-color:#008000" />已戴走(完成)</span>
          <span><i style="background-color:#ff0000" />已结算</span>
          <span><i style="background-color:#ffff00" />无效</span>
        </div>
        <div>
<!--          <el-button size="mini" type="primary" icon="el-icon-plus">登记治疗</el-button>-->
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="addDilog">新建工单</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="editDilog">修改</el-button>

          <el-button size="mini" type="primary" icon="el-icon-plus" @click.stop.native="openManualDialog">手工上报</el-button>

          <el-button size="mini" type="primary" icon="el-icon-plus" @click="deleteDilog">删除</el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="printChargeSheet">打印工单</el-button>
        </div>
      </div>
    </sg-table>
    <sg-dialog ref="sg-dialog" :title="showdialog" size="800px" :dialog="showDialog" @handleClose="showDialog=false">
      <div slot="out" >
        <el-form ref="sgdialogform"  :model="form" size="mini" :rules="rules" label-width="120px">
         <div style="display: flex;justify-content: space-between;">
           <div style="width: 30%;height: 192px;margin-right: 6px" class="boxstyle customerinfo">
             <div class="headerinfo">客户信息</div>
             <div class="infoItem">
               <span>姓名:</span>
               <span>{{doctorList.customerName}}</span>
             </div>
             <div class="infoItem">
               <span>电话:</span>
               <span>{{doctorList.customPhone}}</span>
             </div>
             <div class="infoItem">
               <span>年龄:</span>
               <span>{{doctorList.customAge}}</span>
             </div>
             <div class="infoItem">
               <span>卡号:</span>
               <span>{{doctorList.customCardNumber}}</span>
             </div>
             <div class="infoItem">
               <span>美学顾问:</span>
               <span>{{doctorList.acName}}</span>
             </div>
           </div>
           <div style="width: 70%;">
             <div class="boxstyle" style="margin-bottom: 6px">
               <div class="headerinfo" style="display: flex;justify-content: space-between"><span>牙位信息</span><span style="color: #00a0e9" @click="addTooth">添加牙位</span></div>
               <el-form-item label="" prop="nickName" label-width="20px">
                 <div  v-for="(val,index) in addtoothList" :key="index">
                   <div v-for="(items,indexs) in val.contain" :key="index" style="display: flex;justify-content: space-around;margin-bottom: 10px"  >
                     <table   style="border-collapse: collapse;border: 1px solid #666;" border  @click="selectteech(index)" >
                       <!--                   {{handleleft(items.value)}}-->
                       <tbody>
                       <tr style="height: 50px;">
                         <!--                     <td class="mouth"><span style="">口腔检查：</span> </td>-->

                         <td class="newmouth">
                       <tr>
                         <td class="Width" align="right">
                          <span  v-for="(itemleft,indexleft) in handleleft(items.value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                         </td>
                         <td class="Width">
                          <span  v-for="(itemleft,indexleft) in handleleftright(items.value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                         </td>
                       </tr>
                       <tr >
                         <td
                           style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 20px;" align="right">
                          <span  v-for="(itemleft,indexleft) in handleright(items.value)" :key="indexleft" >
                         {{itemleft.num}}
                        </span>
                         </td>
                         <td>
                          <span  v-for="(itemleft,indexleft) in  handlerightright(items.value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>

                         </td>
                       </tr>
                       </td>
                       <!-- <td
                         style="width: 781px;background-color: #fff;border: 1px solid #666;border-top-color: transparent;border-bottom-color: transparent;">
                       </td>
                       <td style="width: 143px;background-color: #fff;border: 1px solid #fff;"></td> -->
                       </tr>
                       </tbody>
                     </table>
                     <div v-if="val.form">
                       <div>
                         <span>加工类型：</span>
                         <el-select v-model="val.form.type" filterable clearable style="width: 160px" placeholder="">
                           <el-option v-for="dict in typeInfo"
                                      :key="dict.materialId"
                                      :label="dict.materialName"
                                      :value="dict.materialId" />
                         </el-select>
                       </div>
                       <div>
                         <span style="padding: 0px 14px">色号：</span>
                         <el-select v-model="val.form.color" filterable clearable style="width: 160px;margin: 10px 0px" placeholder="">
                           <el-option v-for="dict in colorList"
                                      :key="dict.colourId"
                                      :label="dict.colourName"
                                      :value="dict.colourId" />
                         </el-select>
                       </div>
                       <div>
                         <span style="padding: 0px 14px">数量：</span>
                         <el-input v-model="val.form.num" style="width: 160px;" placeholder="请输入数量" maxlength="30" />
                       </div>
                     </div>
                     <div  style="padding-top: 10px;width: 24px;">
                       <i v-if="index!==0"  style="color: #F56C6C;font-size: 12px;" @click="deleteItem(index,indexs)">删除</i>
                     </div>

                   </div>

                 </div>
               </el-form-item>
             </div>
            <div  class="boxstyle" style="padding: 10px 0px">
              <el-form-item label="就诊时间：" label-width="120px" prop="value">
                <el-date-picker
                  v-model="form.value"
                  style="width: 160px"
                  type="datetime"
                  range-separator="至"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间"
                />
              </el-form-item>
              <el-form-item label="医生:" prop="doctorId">
                <el-select v-model="form.doctorId" filterable clearable style="width: 160px" placeholder="">
                  <el-option v-for="dict in doctor"
                             :key="dict.value"
                             :label="dict.label"
                             :value="dict.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="加工单位:" prop="producerId">
                <el-select v-model="form.producerId" filterable clearable @change="getdentalProducerContactList" style="width: 160px" placeholder="">
                  <el-option v-for="dict in ProducerInfoList"
                             :key="dict.producerId"
                             :label="dict.processName"
                             :value="dict.producerId" />
                </el-select>
              </el-form-item>
              <el-form-item label="加工单位联系人">
                <el-select v-model="form.contactId" filterable clearable style="width: 160px" placeholder="">
                  <el-option v-for="dict in ProducerContactList"
                             :key="dict.contactId"
                             :label="dict.contactName"
                             :value="dict.contactId" />
                </el-select>
              </el-form-item>
              <el-form-item label="加工费" prop="nickName">
                <el-input v-model="form.money" style="width: 190px;" placeholder="请输入加工费" maxlength="30" />
              </el-form-item>
              <el-form-item label="备注" prop="nickName">
                <el-input v-model="form.remark" type="textarea" style="width: 190px;" placeholder="请输入备注" maxlength="30" />
              </el-form-item>
            </div>
           </div>
         </div>
          <div style="text-align: right">
            <el-form-item >
              <el-button  type="primary" @click="submitForm">确认</el-button>
              <el-button @click="showDialog = false">取消</el-button>
            </el-form-item>
          </div>

        </el-form>
      </div>
    </sg-dialog>
    <sgDialog title="请选择牙位" size="55%" out-top="2%" :dialog="showDialogtooth" @handleClose="showDialogtooth=false">
      <div slot="out">
        <div>
          <el-button type="primary" size="small" @click="teeth">
            恒牙
          </el-button>
          <el-button type="primary" size="small" @click="deciduous">
            乳牙
          </el-button>
          <el-button type="primary" size="small" @click="full">
            {{ reset == false ? '全口' : '重置' }}
          </el-button>
        </div>
        <div class="teeth_contain">
          <!-- 恒牙 -->
          <div v-if="teethFlag">
            <table style="border-collapse: collapse;border: 1px solid #666;" border>
              <tbody>
              <tr style="height: 50px;">
                <td class="newmouth">
              <tr>
                <td class="Width teethWidth" style="background-color: #808080;">
                  <!-- 上一图 -->
                  <div style="display: flex;height: 150px;width: 450px;">
                    <div class="teeth_top" v-for="(item, index) in teethmonth" :key="index" @click="teethclick(index)"
                         :style="{ background: item.background }">
                      <div style="height: 120px;">
                        <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                      </div>
                      <div
                        :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                        {{ item.num }}</div>
                    </div>
                  </div>
                </td>
                <td class="Width " style="height: 150px;width: 450px;background-color: #808080;">
                  <div style="display: flex;height: 150px;width: 450px;">
                    <div class="teeth_top" v-for="(item, index) in teethmonthtwo" :key="index"
                         @click="teethclicktwo(index)" :style="{ background: item.background }">
                      <div style="height: 120px;">
                        <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                      </div>
                      <div
                        :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                        {{ item.num }}</div>
                    </div>
                  </div>

                </td>
              </tr>
              <tr>
                <td
                  style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 143px;width: 450px;background-color: #808080;">
                  <div style="display: flex;height: 150px;width: 450px;">
                    <div class="teeth_top" v-for="(item, index) in teethmonththree" :key="index"
                         @click="teethclickthree(index)" :style="{ background: item.background }">
                      <div style="height: 120px;">
                        <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                      </div>
                      <div
                        :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                        {{ item.num }} </div>
                    </div>
                  </div>
                </td>
                <td style="background-color: #808080;">
                  <div style="display: flex;height: 150px;width: 450px;">
                    <div class="teeth_top" v-for="(item, index) in teethmonthfour" :key="index"
                         @click="teethclickfour(index)" :style="{ background: item.background }">
                      <div style="height: 120px;">
                        <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                      </div>
                      <div
                        :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                        {{ item.num }}</div>
                    </div>
                  </div>
                </td>
              </tr>
              </td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- 恒牙结束 -->
          <!-- 乳牙开始 -->
          <div v-else>
            <table style="border-collapse: collapse;border: 1px solid #666;" border>
              <tbody>
              <tr style="height: 50px;">
                <td class="newmouth">
              <tr>
                <td class="Width teethWidth" style="background-color: #808080;">
                  <!-- 上一图 -->
                  <div style="display: flex;height: 150px;width: 450px;">
                    <div class="teeth_top" v-for="(item, index) in deciduousone" :key="index"
                         @click="deciduousclick(index)" :style="{ background: item.background, marginLeft: '30px' }">
                      <div style="height: 120px;">
                        <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                      </div>
                      <div
                        :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                        {{ item.num }}</div>
                    </div>
                  </div>
                </td>
                <td class="Width " style="height: 150px;width: 450px;background-color: #808080;">
                  <div style="display: flex;height: 150px;width: 450px;">
                    <div class="teeth_top" v-for="(item, index) in deciduoustwo" :key="index"
                         @click="deciduousclicktwo(index)" :style="{ background: item.background, marginLeft: '30px' }">
                      <div style="height: 120px;">
                        <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                      </div>
                      <div
                        :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                        {{ item.num }}</div>
                    </div>
                  </div>

                </td>
              </tr>
              <tr>
                <td
                  style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 143px;width: 450px;background-color: #808080;">
                  <div style="display: flex;height: 150px;width: 450px;">
                    <div class="teeth_top" v-for="(item, index) in deciduousthree" :key="index"
                         @click="deciduousclickthree(index)" :style="{ background: item.background, marginLeft: '30px' }">
                      <div style="height: 120px;">
                        <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                      </div>
                      <div
                        :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                        {{ item.num }}</div>
                    </div>
                  </div>
                </td>
                <td style="background-color: #808080;">
                  <div style="display: flex;height: 150px;width: 450px;">
                    <div class="teeth_top" v-for="(item, index) in deciduousfour" :key="index"
                         @click="deciduousclickfour(index)" :style="{ background: item.background, marginLeft: '30px' }">
                      <div style="height: 120px;">
                        <img :src="item.path" alt="" style="width: 100%;height: 100%;">
                      </div>
                      <div
                        :style="{ width: '30px', color: item.color, height: '20px', marginLeft: '12px', marginTop: '5px', backgroundColor: item.newbackground, textAlign: 'center', lineHeight: '20px' }">
                        {{ item.num }}</div>
                    </div>
                  </div>
                </td>
              </tr>
              </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- 乳牙结束 -->
        </div>
        <div style="height: 60px;"></div>
        <div class=""
             style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="ok">确定</el-button>
            <el-button @click="showDialogtooth=false" size="mini">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
    <manual-submission
      :show-manual-dialog="showManualDialogs"
      :inner-dialog="innerDialog"
      :selection-data="selectionData"
      :action="Action"
      @closeInnerDialog="closeInnerDialog"
      @closeShowManualDialog="closeShowManualDialog"
      @setInnerDialog="setInnerDialog"
    />
    <vue-easy-print ref="printChargeSheet">
      <machining-print :print="selectionData[0]" :details="details" :total="total" />
    </vue-easy-print>
    <sgDialog  title="工详情单" size="1000px" :dialog="showDialogDetail" @handleClose="showDialogDetail=false">
    <div slot="out">
      <div class="borderstyle" >
        <div class="heainfo">{{doctorList.customerName}} ({{doctorList.customCardNumber}})</div>
        <div class="costom">
          <span>电话：{{doctorList.customPhone}}</span>
          <span>卡号：{{doctorList.customCardNumber}}</span>
          <span>年龄：{{doctorList.customAge}}</span>
        </div>
        <div class="costom">
<!--          <span>客户状态：{{}}</span>-->
          <span>美学顾问：{{doctorList.acName}}</span>
        </div>
      </div>
      <div class="butt">
        <el-button size="mini" type="primary" icon="el-icon-plus" :disabled="disable" @click="WorksheeCourseAdd">登记取件</el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" :disabled="disable1" @click="WorksheeCourseAdd1">登记回件</el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" :disabled="disable2" @click="WorksheeCourseAdd2">登记返工</el-button>
        <el-button size="mini" type="primary" icon="el-icon-plus" :disabled="disable3" @click="WorksheeCourseAdd3">登记戴走</el-button>
      </div>
      <div class="costom" style="margin-top: 10px">
       <div style="width: 50%">
         <div  class="borderstyle">
           <div>
             <div class="heainfo" >
               <span>工单信息</span>
               <span style="float: right;margin-top: 0px;margin-right: 10px">
                <a  style="margin-right: 10px;color:red" @click="deleteInfo">删除</a>
               <a @click="editInfo">修改</a>
             </span>

             </div>
             <div v-for="(items, indexs) in contain" style="display: flex;justify-content: space-between;width: 100%">
               <table   style="border-collapse: collapse;border: 1px solid #666;" border  >
                 <!--                   {{handleleft(items.value)}}-->
                 <tbody>
                 <tr style="height: 50px;">
                   <td class="newmouth">
                 <tr>
                   <td class="Width" align="right">
                    <span  v-for="(itemleft,indexleft) in handleleft(items.value)" :key="indexleft">
                   {{itemleft.num}}
                  </span>
                   </td>
                   <td class="Width">
                    <span  v-for="(itemleft,indexleft) in handleleftright(items.value)" :key="indexleft">
                   {{itemleft.num}}
                  </span>
                   </td>
                 </tr>
                 <tr >
                   <td
                     style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 20px;" align="right">
                          <span  v-for="(itemleft,indexleft) in handleright(items.value)" :key="indexleft" >
                         {{itemleft.num}}
                        </span>
                   </td>
                   <td>
                          <span  v-for="(itemleft,indexleft) in  handlerightright(items.value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>

                   </td>
                 </tr>
                 </td>
                 <!--             <td-->
                 <!--               style="width: 781px;background-color: #fff;border: 1px solid #666;border-top-color: transparent;border-bottom-color: transparent;">-->
                 <!--             </td>-->
                 <!--             <td style="width: 143px;background-color: #fff;border: 1px solid #fff;"></td>-->
                 </tr>

                 </tbody>
               </table>
               <div style="font-size: 12px; margin-left: 37px;line-height: 25px;">
                 <div>
                   <span >加工类型：{{items.materialName }}</span>
                 </div>
                 <div>
                   色号：{{items.colourName}}
                 </div>
                 <div>
                   数量：{{items.nums}}
                 </div>
               </div>

             </div>

           </div>

         </div>
         <div class="info borderstyle" style="margin-top: 10px">
           <div><span>就诊时间：{{detailData.healTime}}</span><span>医生：{{detailData.doctorName}}</span></div>
           <div><span>加工费：{{detailData.worksheetFee}}</span><span>加工总数量：{{detailData.makeNum}}</span></div>
           <div><span>加工天数：{{detailData.producerNum}}</span><span>状态：{{detailData.worksheetState}}</span></div>
           <div><span>加工单位：{{detailData.processName}}</span><span>加工单位联系人：{{detailData.contactName}}</span></div>
           <div><span>是否结算：{{detailData.settleFlag}}</span><span>备注：{{detailData.remarks}}</span></div>
         </div>
       </div>
        <div style="width: 50%;margin-left: 10px" class="borderstyle">
          <div class="heainfo">工单进度</div>
          <div class="linesty" v-for="(item,index) in worksheetData">
            <div class="point" style="">
              <span>
                <span class="pointitem" style="">·</span >
                <span v-html="item.worksheetState==0?'待派送':(item.worksheetState==1?'已取件':item.worksheetState==2?'已回件':item.worksheetState==3?'已戴走':'已返工')"></span>
              </span>
              <span>{{item.handleTime}}</span>
            </div>
            <div class="name" v-if="item.processName">
              <div>加工单位:{{item.processName}}</div>
              <div>加工数量：{{item.producerNum}}</div>
              <div>加工费:{{item.worksheetFee}}</div>
              <div>备注:{{item.remarks}}</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </sgDialog>
    <sgDialog title="登记取件" :dialog="WorksheeDiaog" size="340px" @handleClose="WorksheeDiaog=false" >
      <div slot="out">
        <el-form :model="Worksheelist" :inline="true" size="mini" label-position="left" >
          <el-form-item label="取件时间">
            <el-date-picker
              style="width: 100%"
              v-model="Worksheelist.time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"   placeholder="选择日期时间" size="mini"
            />
          </el-form-item>
          <el-form-item label="加工单号">
            <el-input v-model="Worksheelist.num" disabled size="mini"></el-input>
          </el-form-item>
<!--          <el-form-item label="加工单位">-->
<!--              <el-select filterable clearable v-model="Worksheelist.newprocess">-->
<!--                <el-option v-for="item in process" :label="item.label" :value="item.value"-->
<!--                           :key="item.value"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          <el-form-item label="加工单位联系人">-->
<!--            <el-select filterable clearable v-model="Worksheelist.newphone">-->
<!--              <el-option v-for="item in phone" :label="item.label" :value="item.value"-->
<!--                         :key="item.value"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="加工天数">
            <el-input v-model="Worksheelist.day"  size="mini"></el-input>
          </el-form-item>
          <div style="text-align: right">
            <el-form-item >
              <el-button  type="primary" @click="submitWorkshee" size="mini">确认</el-button>
              <el-button @click="WorksheeDiaog = false" size="mini">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </sgDialog>
    <sgDialog  title="登记回件" :dialog="WorksheeDiaog1" size="340px" @handleClose="WorksheeDiaog1=false" >
      <div slot="out">
        <el-form :model="Worksheelist1" :inline="true" size="mini" label-position="left">
          <el-form-item label="回件时间">
            <el-date-picker
              v-model="Worksheelist1.time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"   placeholder="选择日期时间" size="mini"
            />
          </el-form-item>
          <div style="text-align: right">
            <el-form-item >
              <el-button  type="primary" @click="submitWorkshee1" size="mini">确认</el-button>
              <el-button @click="WorksheeDiaog1 = false" size="mini">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </sgDialog>
    <sgDialog title="登记返工" :dialog="WorksheeDiaog2" size="340px" @handleClose="WorksheeDiaog2=false" >
      <div slot="out">
        <el-form :model="Worksheelist2" :inline="true" size="mini" label-position="left">
          <el-form-item label="返工时间">
            <el-date-picker
              v-model="Worksheelist2.time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"   placeholder="选择日期时间" size="mini"
            />
          </el-form-item>
          <div style="text-align: right">
            <el-form-item >
              <el-button  type="primary" @click="submitWorkshee2" size="mini">确认</el-button>
              <el-button @click="WorksheeDiaog2 = false" size="mini">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </sgDialog>
    <sgDialog title="登记戴走" :dialog="WorksheeDiaog3" size="340px" @handleClose="WorksheeDiaog3=false" >
      <div slot="out">
        <el-form :model="Worksheelist3" :inline="true" size="mini" label-position="left">
          <el-form-item label="戴走时间">
            <el-date-picker
              v-model="Worksheelist3.time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"   placeholder="选择日期时间" size="mini"
            />
          </el-form-item>
          <div style="text-align: right">
            <el-form-item >
              <el-button  type="primary" @click="submitWorkshee3" size="mini">确认</el-button>
              <el-button @click="WorksheeDiaog3 = false" size="mini">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog'
import Treeselect from "@riophae/vue-treeselect";
import vueEasyPrint from 'vue-easy-print'
import ManualSubmission from '@/components/ManualSubmission/indexTwo.vue'
import machiningPrint from '@/components/Print/machining'
export default {
  name: 'Machining',
  dicts:['worksheetState','useFlag','settleFlag'],
  components: {
    Treeselect,
    SgTable,
    sgDialog,
    ManualSubmission,
    machiningPrint,
    vueEasyPrint
  },
  newdoctor:"",
  props:['doctor','dentalWorkflag'],
  watch:{
    doctor(val,val1){

    },
    dentalWorkflag(val){
      if (val.index==4){
          this.getdentalWorksheetInfoList()
        this.doctorList=JSON.parse(localStorage.getItem('doctorList'))
      }
    }
  },
  data() {
    return {
      print: {
        customName: '',
        customPhone: '',
        orderNumber: '',
        billType: '',
        billingRemarks: ''
      },
      details: [],
      total: '',
      selectionData1:[],
      activeName:"",
      showManualDialogs: false,
      Action:{},
      innerDialog:false,
      pagination: {
        show: true,
        total: 0,
        pageSize: 20,
        pageNum: 1,
        currentPage: 1
      },
      value1:"",
      settleTime:'',
      newprocess:"",
      newdoctor:"",
      newstatus:"",
      worksheetNum:'',
      newvalid:"",
      valid:[
         {
          value:"0",
          label:"否"
         },
         {
          value:"1",
          label:"是"
         },

      ],
      newsettle:"",
      settle:[
      {
          value:"0",
          label:"否"
         },
         {
          value:"1",
          label:"是"
         },
      ],
      phone:[
        {
          value:"0",
          label:"徐一"
        }
      ],
      newphone:"",
      process:[
       {
        value:"0",
        label:'12'
       }
      ],
      status:[
      {
        value:"0",
        label:'待派送'
       },
       {
        value:"1",
        label:'已取件'
       },
       {
        value:"2",
        label:'已回件'
       },
       {
        value:"3",
        label:'反公'
       },      {
        value:"4",
        label:'已预约试截'
       },
       {
        value:"5",
        label:'已截走'
       },
      ],
      columns: [
        {
          lab: '详情',
          val: 'detail',
          custom: 'detail'
        },
        {
          lab: '客户',
          val: 'customerName'
        },
        {
          lab: '加工类型',
          val: 'num',
          custom: 'num',
          width: 120
        },
        {
          lab: '加工单号',
          val: 'worksheetNum',
          width: 150
        },
        {
          lab: '工单状态',
          val: 'worksheetState',
          custom:'worksheetState'
        },
        {
          lab: '是否有效',
          val: 'useFlag',
          custom: 'useFlag'
        },
        {
          lab: '是否已结算',
          val: 'settleFlag',
          custom: 'settleFlag',
          width: 120
        },
        {
          lab: '就诊时间',
          val: 'healTime',
          width: 150
        },
        {
          lab: '医生',
          val: 'doctorName'
        },
        {
          lab: '加工单位',
          val: 'processName'
        },
        {
          lab: '加工单位联系人',
          val: 'contactName',
          width: 150
        },
        {
          lab: '加工总数量',
          val: 'makeNum',
          width: 150
        },
        {
          lab: '加工费',
          val: 'worksheetFee'
        },
        {
          lab: '加工天数',
          val: 'producerNum'
        },
        {
          lab: '结算时间',
          val: 'settleTime'
        },
        {
          lab: '结算员',
          val: 'settleName'
        },
        {
          lab: '备注',
          val: 'remarks'
        }
      ], // 列的数据 // 列的数据
      tableData: [], // 表格的数据
      showDialog:false,
      form:{},
      rules:{
        producerId: [
          { required: true, message: '加工单位不能为空', trigger: 'blur' }
        ],
        doctorId: [
          { required: true, message: '医生不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '时间不能为空', trigger: 'blur' }
        ],
      },
      doctorList:[],
      reset: false,//重置
      object: {
        //恒牙获取牙
        arr: [],
        newarr: [],
        arrs: [],
        newarrs: [],
        //乳牙获取牙
        teetharr: [],
        teethnewarr: [],
        teetharrs: [],
        teethnewarrs: [],

      },//获取牙齿的
      Index:'',
      teethFlag:true,
      deciduousone: [
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_55_Facial.png", num: "E", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_54_Facial.png", num: "D", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_53_Facial.png", num: "C", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_52_Facial.png", num: "B", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_51_Facial.png", num: "A", background: "", newbackground: "#fff", color: "black", isok: false },
      ],
      deciduoustwo: [
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_61_Facial.png", num: "A", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_62_Facial.png", num: "B", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_63_Facial.png", num: "C", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_64_Facial.png", num: "D", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_65_Facial.png", num: "E", background: "", newbackground: "#fff", color: "black", isok: false },
      ],
      deciduousthree: [
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_85_Facial.png", num: "E", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_84_Facial.png", num: "D", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_83_Facial.png", num: "C", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_82_Facial.png", num: "B", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_81_Facial.png", num: "A", background: "", newbackground: "#fff", color: "black", isok: false },
      ],
      deciduousfour: [
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_71_Facial.png", num: "A", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_72_Facial.png", num: "B", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_73_Facial.png", num: "C", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_74_Facial.png", num: "D", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "	http://192.168.1.216/assets/img/teeth/Tooth_75_Facial.png", num: "E", background: "", newbackground: "#fff", color: "black", isok: false },
      ],
      teethmonth: [
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_18_Facial.png", num: "8", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_17_Facial.png", num: "7", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_16_Facial.png", num: "6", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_15_Facial.png", num: "5", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_14_Facial.png", num: "4", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_13_Facial.png", num: "3", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_12_Facial.png", num: "2", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_11_Facial.png", num: "1", background: "", newbackground: "#fff", color: "black", isok: false },
      ],
      teethmonthtwo: [
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_21_Facial.png", num: "1", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_22_Facial.png", num: "2", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_23_Facial.png", num: "3", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_24_Facial.png", num: "4", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_25_Facial.png", num: "5", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_26_Facial.png", num: "6", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_27_Facial.png", num: "7", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_28_Facial.png", num: "8", background: "", newbackground: "#fff", color: "black", isok: false },
      ],
      teethmonththree: [
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_48_Facial.png", num: "8", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_47_Facial.png", num: "7", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_46_Facial.png", num: "6", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_45_Facial.png", num: "5", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_44_Facial.png", num: "4", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_43_Facial.png", num: "3", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_42_Facial.png", num: "2", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_41_Facial.png", num: "1", background: "", newbackground: "#fff", color: "black", isok: false },
      ],
      teethmonthfour: [
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_31_Facial.png", num: "1", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_32_Facial.png", num: "2", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_33_Facial.png", num: "3", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_34_Facial.png", num: "4", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_35_Facial.png", num: "5", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_36_Facial.png", num: "6", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_37_Facial.png", num: "7", background: "", newbackground: "#fff", color: "black", isok: false },
        { path: "http://192.168.1.216/assets/img/teeth/Tooth_38_Facial.png", num: "8", background: "", newbackground: "#fff", color: "black", isok: false },
      ],
      contain: [
        // {
        //   name: '拔牙',
        //   flag: false,
        //   fz: "",
        //   value:{
        //     //恒牙
        //     arr: [],
        //     newarr: [],
        //     arrs: [],
        //     newarrs: [],
        //     //乳牙获取牙
        //     teetharr: [],
        //     teethnewarr: [],
        //     teetharrs: [],
        //     teethnewarrs: [],
        //   }
        // },
      ],
      showDialogtooth:false,
      Indexsx:-1,
      newthread: '',
      newcure: '',
      typeInfo:[],
      colorList:[],
      ProducerInfoList:[],
      ProducerContactList:[],
      selectionData:[],
      worksheetId:'',//修改主键
      xFlag:null,
      showDialogDetail:false,
      detailData:{},
      worksheetData:[],//工单进度表
      WorksheeDiaog:false,
      Worksheelist:{},
      WorksheeDiaog1:false,
      Worksheelist1:{},
      WorksheeDiaog2:false,
      Worksheelist2:{},
      WorksheeDiaog3:false,
      Worksheelist3:{},
      disable:false,
      disable1:true,
      disable2:true,
      disable3:true,
      showdialog:'新增工单',
      addtoothList:[

      ],//新增牙位
      totalArrList:[]
    }
  },
  methods:{
    // 添加牙位
    addTooth(){
    this.addtoothList.push({
      contain:[
        {
          name: '拔牙',
          flag: false,
          fz: "",
          value:{
            //恒牙
            arr: [],
            newarr: [],
            arrs: [],
            newarrs: [],
            //乳牙获取牙
            teetharr: [],
            teethnewarr: [],
            teetharrs: [],
            teethnewarrs: [],
          }
        },
      ],
      form:{
        type:'',
        color:'',
        num:''
      }
    })
    },
    deleteItem(index,indexs){
      if (index !== 0) {
        this.addtoothList[index].contain.splice(indexs, 1)
      }
    },
    // 登记取件
    WorksheeCourseAdd(){
      this.WorksheeDiaog=true
      this.Worksheelist.num=this.detailData.worksheetNum
    },
    //
    submitWorkshee(){
      const query={
        handleTime:this.Worksheelist.time,
        worksheetNum:this.Worksheelist.num,
        worksheetId:this.detailData.worksheetId,
        courseId:this.detailData.courseId,
        deptId: this.detailData.deptId,
        worksheetState:1,
      }
      this.$api.modules.kouqiang.dentalWorksheeCourseAdd(query).then(res=>{
        // this.worksheetData=res.rows
        if (res.code==200){
          this.dentalWorksheeCourseList(this.detailData.worksheetId)
          this.showDialogDetail=false
          this.getdentalWorksheetInfoList()
          this.WorksheeDiaog=false
          this.disable=true,
            this.disable1=false,
            this.disable2=true,
            this.disable3=true
        }
      })
    },
    WorksheeCourseAdd1(){
      this.WorksheeDiaog1=true
    },
    // 回件确认
    submitWorkshee1(){
      const query={
        handleTime:this.Worksheelist1.time,
        worksheetState:2,
        deptId: this.detailData.deptId,
        worksheetId:this.detailData.worksheetId,
        courseId:this.detailData.courseId,
        worksheetNum:this.detailData.worksheetNum
      }
      this.$api.modules.kouqiang.dentalWorksheeCourseAdd(query).then(res=>{
        // this.worksheetData=res.rows
        if (res.code==200){
          this.dentalWorksheeCourseList(this.detailData.worksheetId)
          this.WorksheeDiaog1=false
          this.showDialogDetail=false
          this.getdentalWorksheetInfoList()
          this.disable=true,
            this.disable1=true,
            this.disable2=false,
            this.disable3=false
        }
      })
    },
    WorksheeCourseAdd2(){
      this.WorksheeDiaog2=true
    },
    // 登记返工
    submitWorkshee2(){
      const query={
        handleTime:this.Worksheelist2.time,
        worksheetState:4,
        deptId: this.detailData.deptId,
        worksheetId:this.detailData.worksheetId,
        courseId:this.detailData.courseId,
        worksheetNum:this.detailData.worksheetNum
      }
      this.$api.modules.kouqiang.dentalWorksheeCourseAdd(query).then(res=>{
        if (res.code==200){
          this.dentalWorksheeCourseList(this.detailData.worksheetId)
          this.WorksheeDiaog2=false
          this.showDialogDetail=false
          this.getdentalWorksheetInfoList()
          this.disable=false,
            this.disable1=true,
            this.disable2=true,
            this.disable3=true
        }
      })
    },
    WorksheeCourseAdd3(){
      this.WorksheeDiaog3=true
    },
    // 登记戴走
    submitWorkshee3(){
      const query={
        handleTime:this.Worksheelist3.time,
        worksheetState:3,
        deptId: this.detailData.deptId,
        worksheetId:this.detailData.worksheetId,
        courseId:this.detailData.courseId,
        worksheetNum:this.detailData.worksheetNum

      }
      this.$api.modules.kouqiang.dentalWorksheeCourseAdd(query).then(res=>{
        if (res.code==200){
          this.dentalWorksheeCourseList(this.detailData.worksheetId)
          this.WorksheeDiaog3=false
          this.showDialogDetail=false
          this.getdentalWorksheetInfoList()
          this.disable=false,
            this.disable1=true,
            this.disable2=true,
            this.disable3=true
        }
      })
    },
    // 详情删除
    deleteInfo(){
      this.$confirm('是否确认删除该数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const worksheetId=this.detailData.worksheetId
        await this.$api.modules.kouqiang.dentalWorksheetInfoDelete(worksheetId).then(res => {
          if (res) {
            this.getdentalWorksheetInfoList()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    // 详情修改
    editInfo(){
      this.showDialogDetail=false
      this.showdialog='修改工单'
      this.addtoothList=[]
      let item=this.detailData
      this.getType()
      this.showDialog=true
      this.contain.forEach(item=>{
        item.value.arr=[]
        item.value.newarr=[]
        item.value.newarrs=[]
        item.value.arrs=[]
        item.value.teetharr=[]
        item.value.teetharrs=[]
        item.value.teethnewarr=[]
        item.value.teethnewarrs=[]
      })
      this.contain=[]
      this.form={
        num:item.makeNum,
        value:item.healTime,
        doctorId:item.doctorId,
        producerId:item.producer,
        contactId:item.producerContact,
        money:item.worksheetFee,
        remark:item.remarks
      }
      this.worksheetId=item.worksheetId
      item.toothList.forEach((value,index)=>{
        if (item.toothList.length!=0){
          this.contain.push(
            {
              name: '拔牙',
              flag: false,
              fz: "",
              value:{
                //恒牙
                arr: [],
                newarr: [],
                arrs: [],
                newarrs: [],
                //乳牙获取牙
                teetharr: [],
                teethnewarr: [],
                teetharrs: [],
                teethnewarrs: [],
              }
            },
          )
        }
        value.forEach(newvalue=>{
          this.form={
            type:newvalue.materialId,
            color:newvalue.colourId,
            num:newvalue.nums,
            ...this.form
          }
          if(newvalue.flag=='0'){
            if(newvalue.sort=='1'){
              this.listmonth(newvalue,index,'arr')
            }
            if(newvalue.sort=='2'){
              this.listmonth(newvalue,index,'newarr')
            }
            if(newvalue.sort=='3'){
              this.listmonth(newvalue,index,'newarrs')
            }
            if(newvalue.sort=='4'){
              this.listmonth(newvalue,index,'arrs')
            }
          }else{
            if (newvalue.sort==1){
              this.listmonth(newvalue,index,'teetharr')

            }else if (newvalue.sort==2){
              this.listmonth(newvalue,index,'teethnewarr')

            }else if (newvalue.sort==3){
              this.listmonth(newvalue,index,'teethnewarrs')

            }else if (newvalue.sort==4){
              this.listmonth(newvalue,index,'teetharrs')

            }
          }
        })
        this.addtoothList.push({
          contain:[
            this.contain[index]
          ],
          form:this.form
        })
      })
    },
    // 详情
    clickDetail(item){
      if(item.worksheetState==0){
        this.disable=false,
        this.disable1=true,
        this.disable2=true,
        this.disable3=true
      }else if (item.worksheetState==1){
        this.disable=true,
          this.disable1=false,
          this.disable2=true,
          this.disable3=true
      }else if (item.worksheetState==2){
        this.disable=true,
          this.disable1=true,
          this.disable2=false,
          this.disable3=false
      }
      this.showDialogDetail=true
      this.detailData=item,
        this.dentalWorksheeCourseList(item.worksheetId)
      // this.xFlag=1
      // this.getType()
      // this.showDialog=true
      this.contain.forEach(item=>{
        item.value.arr=[]
        item.value.newarr=[]
        item.value.newarrs=[]
        item.value.arrs=[]
        item.value.teetharr=[]
        item.value.teetharrs=[]
        item.value.teethnewarr=[]
        item.value.teethnewarrs=[]
      })
      this.contain=[]
      this.form={
        num:item.makeNum,
        value:item.healTime,
        doctorId:item.doctorId,
        producerId:item.producer,
        contactId:item.producerContact,
        money:item.worksheetFee,
        remark:item.remarks
      }
      this.worksheetId=item.worksheetId

      item.toothList.forEach((value,index)=>{
        if (item.toothList.length!=0){
          let ht={
            materialName:value[0].materialName,
            colourName:value[0].colourName,
            nums:value[0].nums
          }
          this.contain.push(
            {
              name: '拔牙',
              flag: false,
              fz: "",
              ...ht,
              value:{
                //恒牙
                arr: [],
                newarr: [],
                arrs: [],
                newarrs: [],
                //乳牙获取牙
                teetharr: [],
                teethnewarr: [],
                teetharrs: [],
                teethnewarrs: [],
              }
            },
          )
        }
        value.forEach(newvalue=>{
          this.form={
            type:newvalue.materialId,
            color:newvalue.colourId,
            num:newvalue.nums
          }
          if(newvalue.flag=='0'){
            if(newvalue.sort=='1'){
              this.listmonth(newvalue,index,'arr')
            }
            if(newvalue.sort=='2'){
              this.listmonth(newvalue,index,'newarr')
            }
            if(newvalue.sort=='3'){
              this.listmonth(newvalue,index,'newarrs')
            }
            if(newvalue.sort=='4'){
              this.listmonth(newvalue,index,'arrs')
            }
          }else{
            if (newvalue.sort==1){
              this.listmonth(newvalue,index,'teetharr')

            }else if (newvalue.sort==2){
              this.listmonth(newvalue,index,'teethnewarr')

            }else if (newvalue.sort==3){
              this.listmonth(newvalue,index,'teethnewarrs')

            }else if (newvalue.sort==4){
              this.listmonth(newvalue,index,'teetharrs')

            }
          }
        })
        this.addtoothList.push({
          contain:[
            this.contain[index]
          ],
          form:this.form
        })
      })
    },
    // 获取工单进度表
    dentalWorksheeCourseList(val){
      const query={
        worksheetId:val
      }
      this.$api.modules.kouqiang.dentalWorksheeCourseList(query).then(res=>{
        this.worksheetData=res.rows
      })
    },
    // 打印
    printChargeSheet(data) {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }
      // this.print.titleName = '收费单'
      this.$refs.printChargeSheet.print()
    },
    setInnerDialog() {
      this.innerDialog = true
      this.showManualDialogs = false
    },
    // 关闭
    closeInnerDialog() {
      this.innerDialog = false
    },
    // 关闭手工上报
    closeShowManualDialog() {
      this.showManualDialogs = false
    },
    // 列表
    getdentalWorksheetInfoList(val){
      if (val){
        this.pagination.pageSize=20,
          this.pagination.pageNum=1
      }
      const query={
        pageSize:this.pagination.pageSize,
        pageNum:this.pagination.pageNum,
        worksheetNum:this.worksheetNum,
        producer:this.newprocess,
        doctorId :this.newdoctor,
        producerContact :this.newphone,
        worksheetState :this.newstatus,
        healTime :this.value1,
        settleFlag :this.newsettle,
        settleTime :this.newvalid,
      }
      let materialName=''
      this.$api.modules.kouqiang.dentalWorksheetInfoList(query).then(res=>{
        this.tableData=res.rows
      })
    },
    // 打开手工上报弹窗
    openManualDialog() {
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择至少一名顾客进行修改')
        return
      }
      this.showManualDialogs = true
    },


    // 新增
    addDilog(){
      this.addtoothList=[]
      this.addtoothList.push({
        contain:[
          {
            name: '拔牙',
            flag: false,
            fz: "",
            value:{
              //恒牙
              arr: [],
              newarr: [],
              arrs: [],
              newarrs: [],
              //乳牙获取牙
              teetharr: [],
              teethnewarr: [],
              teetharrs: [],
              teethnewarrs: [],
            }
          },
        ],
        form:{
          type:'',
          color:'',
          num:''
        }
      })
      this.xFlag=0
      this.showdialog='新增工单'
      this.contain.forEach(item=>{
        item.value.arr=[]
        item.value.newarr=[]
        item.value.newarrs=[]
        item.value.arrs=[]
        item.value.teetharr=[]
        item.value.teetharrs=[]
        item.value.teethnewarr=[]
        item.value.teethnewarrs=[]
      })
      this.contain=[]
      this.contain.push(
        {
          name: '拔牙',
          flag: false,
          fz: "",
          value:{
            //恒牙
            arr: [],
            newarr: [],
            arrs: [],
            newarrs: [],
            //乳牙获取牙
            teetharr: [],
            teethnewarr: [],
            teetharrs: [],
            teethnewarrs: [],
          }
        }
      )
      this.form={}
      this.showDialog=true
      this.getType()
    },
    listmonth(item,val,list){
      let numliat = item.num.split(',')
      numliat.forEach(mmm=>{

        let object={
          background:item.background,
          color:item.color,
          newbackground:item.newbackground,
          isok:item.isok,
          num:mmm,
        }
        this.contain[val].value[list].push(object)
      })
    },
    // 编辑弹框
    editDilog(){
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名顾客进行修改')
        return
      }

      this.addtoothList=[]
      this.xFlag=1
      this.showdialog='修改工单'
      this.getType()
      let item=this.selectionData[0]
      this.showDialog=true
      this.contain.forEach(item=>{
        item.value.arr=[]
        item.value.newarr=[]
        item.value.newarrs=[]
        item.value.arrs=[]
        item.value.teetharr=[]
        item.value.teetharrs=[]
        item.value.teethnewarr=[]
        item.value.teethnewarrs=[]
      })
      this.contain=[]
      this.form={
        num:item.makeNum,
        value:item.healTime,
        doctorId:item.doctorId,
        producerId:item.producer,
        contactId:item.producerContact,
        money:item.worksheetFee,
        remark:item.remarks
      }
      this.worksheetId=item.worksheetId
      item.toothList.forEach((value,index)=>{
        if (item.toothList.length!=0){
          this.contain.push(
            {
              name: '拔牙',
              flag: false,
              fz: "",
              value:{
                //恒牙
                arr: [],
                newarr: [],
                arrs: [],
                newarrs: [],
                //乳牙获取牙
                teetharr: [],
                teethnewarr: [],
                teetharrs: [],
                teethnewarrs: [],
              }
            },
          )

        }
         value.forEach(newvalue=>{
           this.form={
             type:newvalue.materialId,
             color:newvalue.colourId,
             num:newvalue.nums,
             ...this.form
           }
          if(newvalue.flag=='0'){
             if(newvalue.sort=='1'){
               this.listmonth(newvalue,index,'arr')
             }
            if(newvalue.sort=='2'){
              this.listmonth(newvalue,index,'newarr')
            }
            if(newvalue.sort=='3'){
              this.listmonth(newvalue,index,'newarrs')
            }
            if(newvalue.sort=='4'){
              this.listmonth(newvalue,index,'arrs')
            }
          }else{
            if (newvalue.sort==1){
              this.listmonth(newvalue,index,'teetharr')

            }else if (newvalue.sort==2){
              this.listmonth(newvalue,index,'teethnewarr')

            }else if (newvalue.sort==3){
              this.listmonth(newvalue,index,'teethnewarrs')

            }else if (newvalue.sort==4){
              this.listmonth(newvalue,index,'teetharrs')

            }
          }
         })
        console.log(this.contain[index],'ssgggs')
        this.addtoothList.push({
          contain:[
            this.contain[index]
          ],
          form:this.form
        })
        console.log(this.addtoothList,'this.addtoothList22222')
      })
      // this.addtoothList.push({
      //   contain:this.contain,
      //   form:this.form
      // })

    },
    // 确认
    submitForm(){
      console.log(this.addtoothList,'this.addtoothList')
      this.$refs.sgdialogform.validate(valid => {
        if (valid) {
          this.addtoothList.forEach((item, index) => {
            if (item.contain.length>0){

            let allList = []
            item.contain[0].value.arr.forEach(item => {
              allList.push(item.num)
            })
            let arrsList = []
            item.contain[0].value.arrs.forEach(item => {
              arrsList.push(item.num)
            })
            let newarrList = []
            item.contain[0].value.newarr.forEach(item => {
              newarrList.push(item.num)
            })
            let newarrsList = []
            item.contain[0].value.newarrs.forEach(item => {
              newarrsList.push(item.num)
            })
            let teetharrList = []
            item.contain[0].value.teetharr.forEach(item => {
              teetharrList.push(item.num)
            })
            let teetharrsList = []
            item.contain[0].value.teetharrs.forEach(item => {
              teetharrsList.push(item.num)
            })
            let teethnewarrList = []
            item.contain[0].value.teethnewarr.forEach(item => {
              teethnewarrList.push(item.num)
            })
            let teethnewarrsList = []
            item.contain[0].value.teethnewarrs.forEach(item => {
              teethnewarrsList.push(item.num)
            })
            let materialName = this.typeInfo.filter(val => val.materialId == item.form.type)[0].materialName
            let colourName = this.colorList.filter(val => val.colourId == item.form.color)[0].colourName
            let list = {
              materialName: materialName,
              colourName: colourName,
              materialId: item.form.type,
              colourId: item.form.color,
              nums: item.form.num
            }

            let listdata = [
              {
                num: allList.toString(), sort: 1, flag: 0, background: "#fff", ...list,
                color: "#fff", isok: true, newbackground: "#286090"
              },
              {
                num: arrsList.toString(), sort: 4, flag: 0, background: "#fff", ...list,
                color: "#fff", isok: true, newbackground: "#286090"
              },
              {
                num: newarrList.toString(), sort: 2, flag: 0, background: "#fff", ...list,
                color: "#fff", isok: true, newbackground: "#286090"
              },
              {
                num: newarrsList.toString(), sort: 3, flag: 0, background: "#fff", ...list,
                color: "#fff", isok: true, newbackground: "#286090"
              },
              {
                num: teetharrList.toString(), sort: 1, flag: 1, background: "#fff", ...list,
                color: "#fff", isok: true, newbackground: "#286090"
              },
              {
                num: teetharrsList.toString(), sort: 4, flag: 1, background: "#fff", ...list,
                color: "#fff", isok: true, newbackground: "#286090"
              },
              {
                num: teethnewarrList.toString(), sort: 2, flag: 1, background: "#fff", ...list,
                color: "#fff", isok: true, newbackground: "#286090"
              },
              {
                num: teethnewarrsList.toString(), sort: 3, flag: 1, background: "#fff", ...list,
                color: "#fff", isok: true, newbackground: "#286090"
              },
            ]
            // console.log(listdata,'listdatappp')
            // return

            listdata = listdata.filter(item => item.num != '')
            let A = "["
            listdata.forEach((item, index) => {
              A += JSON.stringify(item) + ','
            })
            let A1 = A + "]"
            this.totalArrList.push(A1)
            }
          })

          this.totalArrList = this.totalArrList.join(";")
          const query={
            toothMessage:this.totalArrList,
            makeNum:this.form.num,
            healTime:this.form.value,
            doctorId:this.form.doctorId,
            producer:this.form.producerId,
            producerContact:this.form.contactId,
            worksheetFee:this.form.money,
            remarks:this.form.remark,
            id:this.doctorList.id,//用户id
            deptId:this.doctorList.deptId,//公司主键，
            deptRegnId:this.doctorList.deptRegnId,//挂号主键
            worksheetId:this.worksheetId?this.worksheetId:''
          }
          // console.log(query,'query')
          // return
          if (this.xFlag==0){
            this.$api.modules.kouqiang.dentalWorksheetInfoAdd(query).then(res=>{
              if (res.code==200){
                this.$message.success(res.msg)
                this.showDialog=false
                this.showDialogDetail=false
                this.getdentalWorksheetInfoList()

              }
            })
          }else if (this.xFlag==1) {
            this.$api.modules.kouqiang.dentalWorksheetInfoEdit(query).then(res=>{
              if (res.code==200){
                this.$message.success(res.msg)
                this.showDialog=false
                this.showDialogDetail=false
                this.getdentalWorksheetInfoList()

              }
            })
          }
        }
        })
    },
    deleteDilog(item,index){
      if (this.selectionData.length < 1) {
        this.$message.warning('请选择一名顾客')
        return
      }
      this.$confirm('是否确认删除该数据项？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const worksheetId=this.selectionData[0].worksheetId
        await this.$api.modules.kouqiang.dentalWorksheetInfoDelete(worksheetId).then(res => {
          if (res) {
            this.getdentalWorksheetInfoList()
            this.$message.success(res.msg)
          }
        })
      }).catch(() => {

      })
    },
    getType(){
      this.$api.modules.hospital.dentalMaterialInfoList().then(res=>{
        if (res.code==200){
          this.typeInfo=res.rows
        }
      })
      this.$api.modules.hospital.dentalMakeColourList().then(res=>{
        if (res.code==200){
          this.colorList=res.rows
        }
      })
      // 加工单位
      this.$api.modules.hospital.dentalProducerInfoList().then(res=>{
        if (res.code==200){
          this.ProducerInfoList=res.rows
        }
      })

    },
    // 根据加工单位获取加工单位联系人
    getdentalProducerContactList(val){
      // 加工单位联系人
      const query={
        producerId:val,
      }
      this.$api.modules.hospital.dentalProducerContactList({...query}).then(res=>{
        if (res.code==200){
          this.ProducerContactList=res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/5/10
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }else {
        this.selectionData = e[1]
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      // if (this.selectionData[0]!=undefined){
      //   this.coument = this.selectionData[0].customerName
      // }
      // let totals = 0
      // let temp = []
      // this.tableData.forEach(item => {
      //   if (this.selectionData[0]!=undefined&&item.id === this.selectionData[0].id) {
      //     totals = math.add(item.amountPayable, totals)
      //   }
      // })
      // temp = this.tableData.filter(item => {
      //   if (this.selectionData[0]!=undefined){
      //     return item.id === this.selectionData[0].id
      //   }
      //
      // })
      // this.payableSigle = temp.length
      // this.placeorder = totals
    },
    handlerightright(val){
      let arr=[];
      if(val==undefined){
      }else{
        if(val.newarrs.length==0){
          if(val.teethnewarrs.length==0){
            arr=[]
          }else{
            arr=val.teethnewarrs
          }
        }else{
          arr=val.newarrs
        }
      }
      return arr
    },
    handleright(val){
      let arr=[];
      if(val==undefined){
      }else{
        if(val.arrs.length==0){
          if(val.teetharrs.length==0){
            arr=[]
          }else{
            arr=val.teetharrs
          }
        }else{
          arr=val.arrs
        }
      }
      return arr
    },
    handleleft(val){
      let arr=[];
      if(val==undefined){
      }else{
        if(val.arr.length==0){

          if(val.teetharr.length==0){
            arr=[]
          }else{
            arr=val.teetharr;
          }
        }else{
          arr=val.arr
        }
      }
      return arr
    },
    handleleftright(val){
      let arr=[];
      if(val==undefined){
      }else{
        if(val.newarr.length==0){
          if(val.teethnewarr.length==0){
            arr=[]
          }else{
            arr=val.teethnewarr
          }
        }else{
          arr=val.newarr
        }
      }
      return arr
    },
    // 深拷贝
    deepClone(obj) {
      // 根据类型制造一个新的数组或对象 => 指向一个新的空间
      // 由于数组的typeof也是'object',所以用Array.isArray(obj)
      var new_obj = Array.isArray(obj) ? [] : {};
      // 首先判断obj的类型
      // 普通类型
      if (typeof obj != 'object') {
        // 这里不能直接返回obj,不然就是浅拷贝的性质
        return new_obj = obj
      }
      //引用类型
      //数组
      if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
          new_obj[i] = obj[i];
          if (typeof new_obj[i] == 'object') {
            this.deepClone(new_obj[i])
          }
        }
      } else { //对象
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 对象中的数组和对象
            if (typeof obj[key] == 'object') {
              new_obj[key] = this.deepClone(obj[key]);
            } else {//对象中没有引用类型
              new_obj[key] = obj[key]
            }
          }
        }
      }
      return new_obj;
    },
    ok() {
      this.object={
        //恒牙获取牙
        arr: [],
        newarr: [],
        arrs: [],
        newarrs: [],
        //乳牙获取牙
        teetharr: [],
        teethnewarr: [],
        teetharrs: [],
        teethnewarrs: [],

      },//获取牙齿的

        this.teethmonth.forEach(value => {
          if (value.isok) {
            this.object.arr.push(this.deepClone(value))
          }
        })
      this.teethmonthtwo.forEach(value => {
        if (value.isok) {
          this.object.newarr.push(this.deepClone(value))
        }
      })
      this.teethmonththree.forEach(value => {
        if (value.isok) {
          this.object.arrs.push(this.deepClone(value))
        }
      })
      this.teethmonthfour.forEach(value => {
        if (value.isok) {
          this.object.newarrs.push(this.deepClone(value))
        }
      })

      //乳牙
      this.deciduousone.forEach(value => {
        if (value.isok) {
          this.object.teetharr.push(this.deepClone(value))
        }
      })
      this.deciduoustwo.forEach(value => {
        if (value.isok) {
          this.object.teethnewarr.push(this.deepClone(value))
        }
      })
      this.deciduousthree.forEach(value => {
        if (value.isok) {
          this.object.teetharrs.push(this.deepClone(value))
        }
      })
      this.deciduousfour.forEach(value => {
        if (value.isok) {
          this.object.teethnewarrs.push(this.deepClone(value))
        }
      })
      this.showDialogtooth = false;
      // this.contain[0].value=this.object;
      this.addtoothList[this.numIndex].contain[0].value = this.object
      console.log(this.addtoothList,'嘿嘿')
    },
    changeteeth(val){
      for(let x in this['teeth'+val]){
        this['teeth'+val][x].isok=false
        this['teeth'+val][x].background=""
        this['teeth'+val][x].newbackground="#fff"
        this['teeth'+val][x].color="black"
      }
    },
    // 选择牙齿弹窗
    selectteech(index){
      this.numIndex=index
      this.changeteeth('month');
      this.changeteeth('monthtwo');
      this.changeteeth('monththree');
      this.changeteeth('monthfour');
      if ( this.addtoothList[index].contain[0].value.arr.length!==0){
        this.addtoothList[index].contain[0].value.arr.forEach(item=>{
          this.teethmonth.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      if (this.addtoothList[index].contain[0].value.newarr.length!==0){
        this.addtoothList[index].contain[0].value.newarr.forEach(item=> {
          this.teethmonthtwo.forEach(val => {
            if (val.num == item.num) {
              val.background = item.background
              val.color = item.color
              val.newbackground = item.newbackground
              val.isok = item.isok
            }
          })
        })
      }
      // 三
      if (this.addtoothList[index].contain[0].value.newarrs.length!==0){
        this.addtoothList[index].contain[0].value.newarrs.forEach(item=> {
          this.teethmonthfour.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      if (this.addtoothList[index].contain[0].value.arrs.length!==0){
        this.addtoothList[index].contain[0].value.arrs.forEach(item=> {
          this.teethmonththree.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      // 恒牙结束
      // 乳牙开始
      if (this.addtoothList[index].contain[0].value.teetharr.length){
        this.addtoothList[index].contain[0].value.teetharr.forEach(item=> {
          this.deciduousone.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      if (this.addtoothList[index].contain[0].value.teethnewarr.length){
        this.addtoothList[index].contain[0].value.teethnewarr.forEach(item=> {
          this.deciduoustwo.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      if (this.addtoothList[index].contain[0].value.teetharrs.length){
        this.addtoothList[index].contain[0].value.teetharrs.forEach(item=> {
          this.deciduousthree.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      if (this.addtoothList[index].contain[0].value.teethnewarrs.length){
        this.addtoothList[index].contain[0].value.teethnewarrs.forEach(item=> {
          this.deciduousfour.forEach(val=>{
            if (val.num==item.num){
              val.background=item.background
              val.color=item.color
              val.newbackground=item.newbackground
              val.isok=item.isok
            }
          })
        })
      }
      this.showDialogtooth = true;
      this.contain.forEach(value => {
        value.flag = false
      })
    },
    teeth() {
      this.teethFlag = true;
      this.reset = false;
      this.object = {
        //恒牙获取牙
        arr: [],
        newarr: [],
        arrs: [],
        newarrs: [],
        //乳牙获取牙
        teetharr: [],
        teethnewarr: [],
        teetharrs: [],
        teethnewarrs: [],

      },//获取牙齿的
        this.deciduousone.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })
      this.deciduoustwo.forEach(value => {
        value.background = '';
        value.newbackground = '#fff'
        value.color = 'black';
        value.isok = false
      })
      this.deciduousthree.forEach(value => {
        value.background = '';
        value.newbackground = '#fff'
        value.color = 'black';
        value.isok = false
      })
      this.deciduousfour.forEach(value => {
        value.background = '';
        value.newbackground = '#fff'
        value.color = 'black';
        value.isok = false
      })

    },
    //乳牙
    deciduous() {
      this.teethFlag = false
      this.reset = false;
      this.object = {
        //恒牙获取牙
        arr: [],
        newarr: [],
        arrs: [],
        newarrs: [],
        //乳牙获取牙
        teetharr: [],
        teethnewarr: [],
        teetharrs: [],
        teethnewarrs: [],

      },//获取牙齿的
        this.teethmonth.forEach(value => {
          value.background = '';
          value.newbackground = '#fff'
          value.color = 'black';
          value.isok = false
        })
      this.teethmonthtwo.forEach(value => {
        value.background = '';
        value.newbackground = '#fff'
        value.color = 'black';
        value.isok = false
      })
      this.teethmonththree.forEach(value => {
        value.background = '';
        value.newbackground = '#fff'
        value.color = 'black';
        value.isok = false
      })
      this.teethmonthfour.forEach(value => {
        value.background = '';
        value.newbackground = '#fff'
        value.color = 'black';
        value.isok = false
      })
    },
    //全口
    full() {
      this.reset = !this.reset;
      if (this.teethFlag) {
        if (this.reset) {
          this.teethmonth.forEach(value => {
            value.background = '#fff';
            value.color = '#fff';
            value.newbackground = '#286090'
            value.isok = true;
          })
          this.teethmonthtwo.forEach(value => {
            value.background = '#fff';
            value.color = '#fff';
            value.newbackground = '#286090';
            value.isok = true;
          })
          this.teethmonththree.forEach(value => {
            value.background = '#fff';
            value.color = '#fff';
            value.newbackground = '#286090';
            value.isok = true;
          })
          this.teethmonthfour.forEach(value => {
            value.background = '#fff';
            value.color = '#fff';
            value.newbackground = '#286090';
            value.isok = true;
          })
        } else {
          this.clearthee();
        }
      } else {
        if (this.reset) {
          this.deciduousone.forEach(value => {
            value.background = '#fff';
            value.color = '#fff';
            value.newbackground = '#286090'
            value.isok = true;
          })
          this.deciduoustwo.forEach(value => {
            value.background = '#fff';
            value.color = '#fff';
            value.newbackground = '#286090';
            value.isok = true;
          })
          this.deciduousthree.forEach(value => {
            value.background = '#fff';
            value.color = '#fff';
            value.newbackground = '#286090';
            value.isok = true;
          })
          this.deciduousfour.forEach(value => {
            value.background = '#fff';
            value.color = '#fff';
            value.newbackground = '#286090';
            value.isok = true;
          })
        } else {
          this.cleartooth();
        }
      }

    },
    teethclickthree(index) {
      if (this.teethmonththree[index].background == '') {
        this.teethmonththree[index].background = '#fff';
        this.teethmonththree[index].color = '#fff';
        this.teethmonththree[index].newbackground = '#286090';
        this.teethmonththree[index].isok = true
      } else {
        this.teethmonththree[index].background = '';
        this.teethmonththree[index].newbackground = '#fff'
        this.teethmonththree[index].color = 'black';
        this.teethmonththree[index].isok = false
      }
    },
    teethclickfour(index) {
      if (this.teethmonthfour[index].background == '') {
        this.teethmonthfour[index].background = '#fff';
        this.teethmonthfour[index].color = '#fff';
        this.teethmonthfour[index].newbackground = '#286090';
        this.teethmonthfour[index].isok = true
      } else {
        this.teethmonthfour[index].background = '';
        this.teethmonthfour[index].newbackground = '#fff'
        this.teethmonthfour[index].color = 'black';
        this.teethmonthfour[index].isok = false
      }
    },
    teethclicktwo(index) {
      if (this.teethmonthtwo[index].background == '') {
        this.teethmonthtwo[index].background = '#fff';
        this.teethmonthtwo[index].color = '#fff';
        this.teethmonthtwo[index].newbackground = '#286090';
        this.teethmonthtwo[index].isok = true
      } else {
        this.teethmonthtwo[index].background = '';
        this.teethmonthtwo[index].newbackground = '#fff'
        this.teethmonthtwo[index].color = 'black';
        this.teethmonthtwo[index].isok = false
      }
    },
    teethclick(index) {
      if (this.teethmonth[index].background == '') {
        this.teethmonth[index].isok = true
        this.teethmonth[index].background = '#fff';
        this.teethmonth[index].color = '#fff';
        this.teethmonth[index].newbackground = '#286090'
      } else {
        this.teethmonth[index].background = '';
        this.teethmonth[index].newbackground = '#fff'
        this.teethmonth[index].color = 'black';
        this.teethmonth[index].isok = false
      }

    },
    deciduousclick(index) {
      if (this.deciduousone[index].background == '') {
        this.deciduousone[index].background = '#fff';
        this.deciduousone[index].color = '#fff';
        this.deciduousone[index].newbackground = '#286090';
        this.deciduousone[index].isok = true;
      } else {
        this.deciduousone[index].background = '';
        this.deciduousone[index].newbackground = '#fff'
        this.deciduousone[index].color = 'black';
        this.deciduousone[index].isok = false
      }
    },
    deciduousclicktwo(index) {
      if (this.deciduoustwo[index].background == '') {
        this.deciduoustwo[index].background = '#fff';
        this.deciduoustwo[index].color = '#fff';
        this.deciduoustwo[index].newbackground = '#286090';
        this.deciduoustwo[index].isok = true;
      } else {
        this.deciduoustwo[index].background = '';
        this.deciduoustwo[index].newbackground = '#fff'
        this.deciduoustwo[index].color = 'black';
        this.deciduoustwo[index].isok = false
      }
    },
    deciduousclickthree(index) {
      if (this.deciduousthree[index].background == '') {
        this.deciduousthree[index].background = '#fff';
        this.deciduousthree[index].color = '#fff';
        this.deciduousthree[index].newbackground = '#286090';
        this.deciduousthree[index].isok = true;
      } else {
        this.deciduousthree[index].background = '';
        this.deciduousthree[index].newbackground = '#fff'
        this.deciduousthree[index].color = 'black';
        this.deciduousthree[index].isok = false;
      }
    },
    deciduousclickfour(index) {
      if (this.deciduousfour[index].background == '') {
        this.deciduousfour[index].background = '#fff';
        this.deciduousfour[index].color = '#fff';
        this.deciduousfour[index].newbackground = '#286090';
        this.deciduousfour[index].isok = true;
      } else {
        this.deciduousfour[index].background = '';
        this.deciduousfour[index].newbackground = '#fff'
        this.deciduousfour[index].color = 'black';
        this.deciduousfour[index].isok = false;
      }
    },
    // 分页
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getdentalWorksheetInfoList()
    },
    currentChange(e) {
      this.pagination.pageNum = e[1]
      this.pagination.currentPage = e[1]
      this.getdentalWorksheetInfoList()
    },
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 690px;
}
.herader {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & span {
    font-size: 14px;
    margin-right: 10px;
    i {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 3px;
    }
  }
}
.headerinfo{
  height: 30px;
  line-height: 30px;
  background: rgb(129 251 226 / 48%);
  padding-left: 14px;
}
.boxstyle{
  border: 1px solid #ccc;
  border-radius: 5px;

}
.mouth {
  border: 1px solid transparent;
  background-color: #fff;
}

.newmouth {
  border: 1px solid transparent;
  background-color: #fff;
}

.Width {
  width: 100px;
  height: 20px;
}

.Width:nth-of-type(1) {
  border: 1px solid #666;
  border-top-color: transparent;
  border-left-color: transparent;

}

.Width:nth-of-type(2) {
  border: 1px solid #666;
  border-top-color: transparent;
  border-right-color: transparent;

}

.Width:nth-of-type(3) {
  border: 1px solid #666;
  border-left-color: transparent;
  border-bottom-color: transparent !important;

}

.Width:nth-of-type(4) {
  /* border: 1px solid #666;
  border-right-color: transparent;
  border-bottom-color: transparent; */

}
.heainfo{
  height: 30px;
  background: rgb(129 251 226 / 48%);
  line-height: 30px;
  padding-left: 15px;
}
.borderstyle{
  border: 1px solid #ccc;
  border-radius:5px ;
  //padding: 0px 15px 0px;
}
.costom{
  display: flex;
  justify-content: space-between;
  padding: 0px 15px 0px;


  span{
    margin: 5px 0px;
  }
  .info{
  div{
    margin: 10px;
    display: flex;justify-content: space-between;
    span{
      //margin-right: 30px;
      text-align: left;
    }
  }
  }
}
.butt{
  text-align: right;
  margin-top: 10px;
  border-top: 1px dashed #ccc;
  border-bottom: 1px dashed #ccc;
  padding: 5px 0px;
}
.linesty{
  padding: 10px;
 .name{
   border-left: 1px solid #ccc;
   margin: 0px 10px 0px;
   padding: 5px 10px;

 }
}
.point{
  position: relative;margin-left: 25px;
  display: flex;
  justify-content: space-between;
  .pointitem{
    font-size: 115px;
    position: absolute;
    top: -74px;
    left: -25px;
    color: #ccc;
  }
}
.customerinfo{
  .infoItem{
    margin-left: 20px;
    line-height: 30px;
  }
}

</style>
