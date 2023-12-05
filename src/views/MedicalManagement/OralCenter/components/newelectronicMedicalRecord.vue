<template>
    <div class="elect">
      <!-- 不新病例展示 -->
      <div v-if="flag">
        <div class="elect_top">
          <img src="@/assets/time.png" alt="" class="Left">
          <el-button type="primary" size="mini" class="Left" @click="addelec">新增</el-button>
        </div>
  
        <table border style="border-collapse: collapse;margin-left: 25px;border: 1px solid #666;">
          <tbody>
            <tr>
              <td class="Border"></td>
              <td class="Bordertwo"></td>
            </tr>
          </tbody>
        </table>
        <!-- 病例列表 -->
        <div v-for="(item, index) in list " :key="index">
          <div class="elect_contain">
            <div class="elect_left" >
              <div class="elect_left_top">
                {{item.healTime }}
              </div>
              <div class="elect_left_top"></div>
              <table style="border-collapse: collapse;border: 1px solid #409eff;height: 100%;" border>
                <tbody>
                  <tr>
                    <td class="merge" ></td>
                    <td class="merge" ></td>
                  </tr>
                </tbody>
              </table>
  
            </div>
            <div class="elect_right">
              <div class="elect_right_top">
                <table style="border-collapse: collapse;border: 1px solid #666;" border>
                  <tbody>
                    <tr>
                      <td class="merages">
<!--                        复诊病历 [挂号No：GH2023041800004] [病历编号：ED20230526000002]-->
                      </td>
                      <td class="merages" align="center">
                        <el-button type="text" size="mini" @click="detail(item,index)">详情</el-button>
                      </td>
                      <td class="merages" align="center">
                        <el-button type="text" size="mini" @click="editrecord(item,index)">编辑</el-button>
                        <el-button type="text" size="mini" @click="deleterecord(item,index)">删除</el-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- 点击详情受否要展开 -->
                <div v-show="item.flag">
  
                  <table style="border-collapse: collapse;border: 1px solid #666;" border>
                    <tbody>
                      <tr>
                        <td style="width: 1074px;height: 30px;" class="glnews">
                          <span style="margin-left: 20px;">口腔检查：</span>
                        </td>
                        <td style="border: 1px solid #fff;background-color: #fff;width: 145px;">
                          <span style="margin-left: 10px;">医生:</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 展开详情了 -->
                <div v-if="item.newflag">
                  <table style="border-collapse: collapse;border: 1px solid #666;" border>
                    <tbody>
                    <tr>
                      <td style="width: 1074px;height: 30px;" class="glnews">
<!--                        <span style="margin-left: 20px;">既往史：</span>-->
                      </td>
                      <td style="border: 1px solid #fff;background-color: #fff;width: 145px;">
                        <div>  <span style="margin-left: 10px;">医生:{{item.doctorName}}</span></div>
                        <div>  <span style="margin-left: 10px;">医助:{{item.assistantName}}</span></div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <table v-for="(val,index) in item.dentalInspectList" :key="index" style="border-collapse: collapse;border: 1px solid #666;" border>
                    <tbody>
                    <tr style="height: 50px;">
                      <td class="mouth"><span style="margin-left: 20px;">口腔检查：</span> </td>
                      <td class="newmouth">
                    <tr>
                      <td class="Width" align="right">
                          <span  v-for="(itemleft,indexleft) in handleleft1(val)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                      </td>
                      <td class="Width">
                          <span  v-for="(itemleft,indexleft) in handleright2(val)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 20px;" align="right">
                          <span  v-for="(itemleft,indexleft) in handleright4(val)" :key="indexleft" >
                         {{itemleft.num}}
                        </span>
                      </td>
                      <td>
                          <span  v-for="(itemleft,indexleft) in  handlerightright3(val)" :key="indexleft">
                         {{itemleft.num}}
                        </span>

                      </td>
                    </tr>
                    </td>
                    <td
                      style="width: 781px;background-color: #fff;border: 1px solid #666;border-top-color: transparent;border-bottom-color: transparent;">
                    </td>
                    <td style="width: 143px;background-color: #fff;border: 1px solid #fff;"></td>
                    </tr>
                    </tbody>
                  </table>
                  <table style="border-collapse: collapse;border: 1px solid #666;" border v-for="(val,index) in item.disposeDataList" :key="index">
                    <tbody>
                    <tr style="height: 50px;">
                      <td class="mouth"><span style="margin-left: 20px;padding: 0 14px">处置：</span> </td>
                      <td class="newmouth">
                    <tr>
                      <td class="Width" align="right">
                          <span  v-for="(itemleft,indexleft) in handleleft1(val)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                      </td>
                      <td class="Width">
                          <span  v-for="(itemleft,indexleft) in handleright2(val)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 20px;" align="right">
                          <span  v-for="(itemleft,indexleft) in handleright4(val)" :key="indexleft" >
                         {{itemleft.num}}
                        </span>
                      </td>
                      <td>
                          <span  v-for="(itemleft,indexleft) in  handlerightright3(val)" :key="indexleft">
                         {{itemleft.num}}
                        </span>

                      </td>
                    </tr>
                    </td>
                    <td
                      style="width: 781px;background-color: #fff;border: 1px solid #666;border-top-color: transparent;border-bottom-color: transparent;">
                    </td>
                    <td style="width: 143px;background-color: #fff;border: 1px solid #fff;"></td>
                    </tr>
                    </tbody>
                  </table>
                  <table style="border-collapse: collapse;border: 1px solid #666;" border v-for="(val,index) in item.doctorAdviceList" :key="index">
                    <tbody>
                    <tr style="height: 50px;">
                      <td class="mouth"><span style="margin-left: 20px;padding: 0 14px">医嘱：</span> </td>
                      <td class="newmouth">
                    <tr>
                      <td class="Width" align="right">
                          <span  v-for="(itemleft,indexleft) in handleleft1(val)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                      </td>
                      <td class="Width">
                          <span  v-for="(itemleft,indexleft) in handleright2(val)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 20px;" align="right">
                          <span  v-for="(itemleft,indexleft) in handleright4(val)" :key="indexleft" >
                         {{itemleft.num}}
                        </span>
                      </td>
                      <td>
                          <span  v-for="(itemleft,indexleft) in  handlerightright3(val)" :key="indexleft">
                         {{itemleft.num}}
                        </span>

                      </td>
                    </tr>
                    </td>
                    <td
                      style="width: 781px;background-color: #fff;border: 1px solid #666;border-top-color: transparent;border-bottom-color: transparent;">
                    </td>
                    <td style="width: 143px;background-color: #fff;border: 1px solid #fff;"></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 展开详情结尾了 -->
  
  
              </div>
            </div>
          </div>
        </div>
        <!-- 病例列表 -->
      </div>
      <!-- 新增页面 -->
      <div v-else>
        <div>
          <!-- <span>类型：</span>
          <el-radio v-model="radio" label="1">初诊病历</el-radio>
          <el-radio v-model="radio" label="2">复诊病历</el-radio> -->
          <el-form ref="form" :rules="rules" :model="addlist" :inline="true">
            <el-form-item label="就诊时间：" prop="value1">
              <el-date-picker v-model="addlist.value1"
                              type="datetime"
                              format="yyyy-MM-dd HH:mm:ss"
                              value-format="yyyy-MM-dd HH:mm:ss"   placeholder="选择日期时间" size="mini">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="医生：">
              <el-select filterable clearable v-model="newdoctor" size="mini" style="width: 150px;">
                <el-option v-for="item in doctor" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="医助：">
              <el-select filterable clearable v-model="newyizhu" size="mini" style="width: 150px;">
                <el-option v-for="item in yizhu" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
<!--          <span></span>-->

<!--          <span style="margin-left: 50px;">医生：</span>-->

<!--          <span style="margin-left: 50px;">医助：</span>-->

          <!-- <span style="margin-left: 50px;">护士：</span>
          <el-select clearable v-model="newzerennurse" size="mini" style="width: 150px;">
            <el-option v-for="item in zerennurse" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select> -->
        </div>
        <div class="plate" @click="electemplate">
          <el-button type="text" size="mini">
            病历模板
          </el-button>
        </div>
        <div style="margin-top: 20px;background: #fff;" v-for="(items, indexs) in containData" :key="indexs">
          <el-button type="primary" size="mini">{{ items.name }}</el-button>
          <div class="" >
            <div class="" @click="addvisit">
              <!-- 是否显示十字架 -->
              <div v-show="indexs >=0  && indexs < 3 ? true : false"  v-for="(val, num) in items.contain" style="display: flex;margin-bottom: 13px">
                <table style="border-collapse: collapse;border: 1px solid #666;" border  :key="num" @click="cross(indexs,num)">
                  <tbody>
                    <tr style="height: 50px;">
                      <td class="newmouth">
                    <tr>
                      <td class="Width" align="right" style="width:110px;height:30px">
  
                        <span  v-for="(itemleft,indexleft) in handleleft(val.value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                      </td>
                      <td class="Width" style="width:110px">
                        <span  v-for="(itemleft,indexleft) in handleleftright(val.value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="border: 1px solid #666;border-left-color: transparent;border-bottom-color: transparent;height: 20px;" align="right">
                        <span  v-for="(itemleft,indexleft) in handleright(val.value)" :key="indexleft" >
                         {{itemleft.num}}
                        </span>
                      </td>
                      <td>
                        <span  v-for="(itemleft,indexleft) in  handlerightright(val.value)" :key="indexleft">
                         {{itemleft.num}}
                        </span>
                       
                      </td>
                    </tr>
                    </td>
                    </tr>
                  </tbody>
                </table>
                <div style="width: 78%;">
<!--                  {{val.value.arr[0].color}}-->
                  <el-input type="textarea" style="height: 20px !important;" v-model="val.fz"
                            @focus="visit(indexs)"></el-input>
                  <div class="Height_bottom" v-show="items.flag" @click="newvisit"
                       :style="{ marginLeft: indexs >=0 && indexs < 3 ? '190px' : '0px', width: indexs >=0 && indexs < 3 ? '85%' : '' }">
                    <el-button type="text" size="mini" style="position: absolute;right: 20px;"
                               @click="closeIndex(indexs)">关闭</el-button>
                    <div
                      style="width: 120px;height: 30px;border: 3px solid #eee;border-bottom-color: transparent;border-top-color: transparent;border-left-color: transparent;text-align: center;line-height: 30px;">
                      词条
                    </div>
                    <div class="Height_contain" v-for="(item, index) in newlist" :key="index">
                      <div class="Height_contain_left">
                        {{ item.name }}：
                      </div>
                      <div class="Height_contain_right"
                           :style="{ border: index == 0 ? '1px solid #eee' : '', borderLeftColor: 'transparent', borderBottomColor: 'transparent' }">
                    <span
                      :style="{ display: 'inline-block', border: '1px solid #eee', padding: '5px 10px 5px 10px', marginLeft: '20px', marginTop: '3px', cursor: 'pointer' }"
                      v-for="(newitem, newindex) in item.data" :key="newindex" @click="addentry(indexs, index, newindex)">{{
                        newitem.name }}</span>
                      </div>
                    </div>
                  </div>

                </div>
                <div  v-if="num!==0" style="padding-top: 10px;">
                    <i style="color: #F56C6C;margin-left: 16px;font-size: 12px;" @click="deleteItem(indexs,num)">删除</i>
                </div>
              </div>
              <!-- 检查页面底部 -->
            </div>
          </div>
          <div class="addstyle">
            <div @click="addTooth(items,indexs)">添加牙位</div>
          </div>
        </div>
        <div style="text-align: right;">
          <el-button type="primary" size="mini" @click="submit">保存</el-button>
          <el-button @click="goback"  size="mini">返回</el-button>
        </div>
      </div>
      <!-- 新增页面底部 -->
      <sgDialog title="请选择模板" size="85%" out-top="2%"  :dialog="showDialog" @handleClose="closeRoomDialog">
        <div slot="out">
          <div class="newplate">
            <div class="newplate_top">
              <div class="newplate_top_left">
                <p style="margin-top: 10px;margin-left: 10px;">模板类型：</p>
                <!-- <div> <el-input v-model="Name" placeholder="请输入内容搜索" size="mini"
                    style="width: 180px;margin-left: 10px;"></el-input> </div> -->
                <div>
                  <el-tree ref="tree" class="el-tree" :filter-node-method="filterNode" :data="deptOptions"
                    :props="defaultProps" highlight-current :expand-on-click-node="false" @node-click="handleNodeClick" />
                </div>
              </div>
              <div class="newplate_top_right">
                <div style="width:100%;height: 30px;text-align: center;line-height: 30px;">
                  纵折牙拔除
                </div>
                <hr style="border: 1px dotted #eee ;">
                <div style="width: 100%;height: 510px;overflow-y: scroll;">
                  <div class="history">
                    <span>口腔检查：</span>
                  </div>
                  <div class="history">
                    <span>处置：</span>
                  </div>
                  <div class="history">
                    <span>医嘱：</span>
                  </div>
                  <!-- <div class="history">
                    <span>流行病学史：</span>
                  </div>
                  <div class="history">
                    <span>辅助检查：</span>
                  </div>
                  <div class="history">
                    <span>诊断：</span>
                  </div>
                  <div class="history">
                    <span>处置：</span>
                  </div>
                  <div class="history">
                    <span>治疗计划：</span>
                  </div>
                  <div class="history">
                    <span>医嘱：</span>
                  </div> -->
                </div>
                <!-- 主要模块 -->
  
              </div>
            </div>
            <!-- 底部按钮 -->
            <div class=""
              style="position: absolute;width: 100%;height: 40px;bottom: 0;display: flex;align-items: center;justify-content: center;">
              <div style="width: 160px;height: 40px;">
                <el-button type="primary" size="mini">确定</el-button>
                <el-button @click="closeRoomDialog">取消</el-button>
              </div>
            </div>
          </div>
        </div>
      </sgDialog>
      <sgDialog title="请选择牙位" size="55%" out-top="2%" v-if="showDialogtooth" :dialog="showDialogtooth" @handleClose="closeRoomDialogtooth">
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
                            {{ item.num }}</div>
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
              <el-button @click="closeRoomDialogteeth">取消</el-button>
            </div>
          </div>
        </div>
      </sgDialog>
  
    </div>
  </template>
  
  <script>
  import sgDialog from '@/components/Dialog/index'
  import fa from "element-ui/src/locale/lang/fa";
  export default {
    name: 'electronicMedicalRecord',
    components: {
      sgDialog
    },
    props:{
      xflag:{
        type:[String, Number]
      }
    },
    data() {
      return {
        teethFlag: true,//控制乳牙恒牙切换
        showDialogtooth: false,//选择牙齿
        Index:'',
        Indexnum:'',
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
        containData:[
          {
            name: '口腔检查',
            flag: false,
            fz: "",
            contain:[
              {
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
          },
          {
            name: '处置',
            flag: false,
            fz: "",
            contain:[
              {
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

          },
          {
            name: '医嘱',
            flag: false,
            fz: "",
            contain:[
              {
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
          },
        ],
        contain: [
          {
            name: '口腔检查',
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
          {
            name: '处置',
            flag: false,
            fz: "",
            value: {
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
          {
            name: '医嘱',
            flag: false,
            fz: "",
            value: {
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
        ],//主体内容
        newlist: [
          {
          name: "部位",
          flag: false,
          data: [{
            name: "向右"
          },
          {
            name: "向下"
          }]
        }, {
          name: "症状",
          data: [{
            name: "太疼"
          },
          {
            name: "折断"
          }]
        }],
        flag: true,
        detailflag: true,
        list: [{ flag: true, newflag: false, height: 130 }, { flag: true, newflag: false, height: 130 }],
        radio: '2',
        value1: '',
        newdoctor: '',//医生
        newzerennurse: '',//护士
        newyizhu: "",//医助
        showDialog: false,
        Name: "",
        deptOptions: [],
        reset: false,//重置
        fz: "",
        ifshow: false,//是否显示词条
        defaultProps: {
          children: 'children',
          label: 'label'
        },
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
        doctor:[],//医生列表
        yizhu:[],//医嘱列表
        dentalInspectData:[],//口腔检查数组
        disposeData:[],//处置
        doctorAdviceData:[],//医嘱
        dentalInspectList:[],
        disposeDataList:[],
        doctorAdviceList:[],
        disposeList:[],
        editFlag:0,//新增还是修改
        processId:'',
        totalArrList:[],//保存的时候第一组数组
        totalArrList1:[],
        totalArrList2:[],
        contain1:[
          {
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
        contain2:[
          {
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
        addlist:{},
        rules:{
          value1: [
            { required: true, message: '就诊时间不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    watch: {
      deptId(val) {
        this.deptId = val
        // this.search();
      },
      xflag(newval){
        if (newval==2){
          this.doctorList=JSON.parse(localStorage.getItem('doctorList'))
          this.getUserList()
          this.getdentalProcessInfoList()
        }
      },
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
    mounted() {
      let that = this;
      document.body.addEventListener('click', function () {
        if (that.ifshow) {
          that.ifshow = false
        } else {
          that.contain.forEach(value => {
            value.flag = false;
  
          })
          that.ifshow = false
        }
  
  
      })
    },
    created() {
      this.deptId = this.$store.getters.departmentId
    },
    // dicts: ['doctor', 'zerennurse', 'yizhu'],
    methods: {
      // 添加牙位
      addTooth(item,indexs){
        // return
        this.containData[indexs].contain.push({
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
        })
      },
      // 查询正畸过程列表- 分页
      getdentalProcessInfoList(){
        this.$api.modules.kouqiang.dentalProcessInfoList().then(res=>{
          if (res.code==200){
            res.rows.forEach(item=>{
              item.flag=true,
              item.newflag=false,
                item. height=130
            })
           this.list=res.rows
          }
        })
      },
      listmonth(item,val,list){
        let numliat = item.num.split(',')
        numliat.forEach(mmm=>{
          let object={
            background:item.background,
            color:item.color,
            newbackground:item.newbackground,
            isok:item.isok,
            num:mmm
          }
          this.contain[val].value[list].push(object)
        })
      },
      listmonth1(item,val,list){
        let numliat = item.num.split(',')
        numliat.forEach(mmm=>{
          let object={
            background:item.background,
            color:item.color,
            newbackground:item.newbackground,
            isok:item.isok,
            num:mmm
          }
          console.log(this.contain1,item,val,list,this.contain1[val],'this.contain1[val]')
          this.contain1[val].value[list].push(object)
        })
      },
      listmonth2(item,val,list){
        let numliat = item.num.split(',')
        numliat.forEach(mmm=>{
          let object={
            background:item.background,
            color:item.color,
            newbackground:item.newbackground,
            isok:item.isok,
            num:mmm
          }
          this.contain2[val].value[list].push(object)
        })
      },
      // 列表点击编辑
      editrecord(item){
        this.contain.forEach((item)=>{
          item.value.arr=[]
          item.value.newarr=[]
          item.value.newarrs=[]
          item.value.arrs=[]
          item.value.teetharr=[]
          item.value.teetharrs=[]
          item.value.teethnewarr=[]
          item.value.teethnewarrs=[]
        })
        this.contain1.forEach((item)=>{
          item.value.arr=[]
          item.value.newarr=[]
          item.value.newarrs=[]
          item.value.arrs=[]
          item.value.teetharr=[]
          item.value.teetharrs=[]
          item.value.teethnewarr=[]
          item.value.teethnewarrs=[]
        })
        this.contain2.forEach((item)=>{
          item.value.arr=[]
          item.value.newarr=[]
          item.value.newarrs=[]
          item.value.arrs=[]
          item.value.teetharr=[]
          item.value.teetharrs=[]
          item.value.teethnewarr=[]
          item.value.teethnewarrs=[]
        })
        this.containData[0].contain=[]
        this.containData[1].contain=[]
        this.containData[2].contain=[]
        // this.contain=[]
        this.processId=item.processId
        this.editFlag=1
        this.flag=false
        this.newdoctor=item.doctorId
        this.newyizhu=item.assistantId
        item.dentalInspectList.forEach((value,index)=>{
          if (item.dentalInspectList.length!=0){
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

          value.forEach(newvalue=>{
            newvalue.fz=''
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
          this.containData[0].contain.push( this.contain[index])
        })

        item.disposeList.forEach((value,index)=>{
          if (item.disposeList.length!=0){
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
          value.forEach((newvalue)=>{
            newvalue.fz=''
            if(newvalue.flag=='0'){
              if(newvalue.sort=='1'){
                this.listmonth1(newvalue,index,'arr')
              }
              if(newvalue.sort=='2'){
                this.listmonth1(newvalue,index,'newarr')
              }
              if(newvalue.sort=='3'){
                this.listmonth1(newvalue,index,'newarrs')
              }
              if(newvalue.sort=='4'){
                this.listmonth1(newvalue,index,'arrs')
              }
            }else{
              if (newvalue.sort==1){
                this.listmonth1(newvalue,index,'teetharr')

              }else if (newvalue.sort==2){
                this.listmonth1(newvalue,index,'teethnewarr')

              }else if (newvalue.sort==3){
                this.listmonth1(newvalue,index,'teethnewarrs')

              }else if (newvalue.sort==4){
                this.listmonth1(newvalue,index,'teetharrs')

              }
            }
          })
          this.contain1.push({
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
          })
          this.containData[1].contain.push( this.contain1[index])
        })
        item.doctorAdviceList.forEach((value,index)=>{
          if (item.doctorAdviceList.length!=0){

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
          value.forEach((newvalue)=>{
            newvalue.fz=''
            if(newvalue.flag=='0'){
              if(newvalue.sort=='1'){
                this.listmonth2(newvalue,index,'arr')
              }
              if(newvalue.sort=='2'){
                this.listmonth2(newvalue,index,'newarr')
              }
              if(newvalue.sort=='3'){
                this.listmonth2(newvalue,index,'newarrs')
              }
              if(newvalue.sort=='4'){
                this.listmonth2(newvalue,index,'arrs')
              }
            }else{
              if (newvalue.sort==1){
                this.listmonth2(newvalue,index,'teetharr')

              }else if (newvalue.sort==2){
                this.listmonth2(newvalue,index,'teethnewarr')

              }else if (newvalue.sort==3){
                this.listmonth2(newvalue,index,'teethnewarrs')

              }else if (newvalue.sort==4){
                this.listmonth2(newvalue,index,'teetharrs')

              }
            }
          })
          this.contain2.push({
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
          })
          this.containData[2].contain.push( this.contain2[index])
        })

      },
      deleterecord(item,index){
        this.$confirm('是否确认删除该数据项？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const processIds=item.processId
          await this.$api.modules.kouqiang.dentalProcessInfoDelete(processIds).then(res => {
            if (res) {
              this.getdentalProcessInfoList()
              this.$message.success(res.msg)
            }
          })
        }).catch(() => {

        })
      },
      // 新增正畸过程保存
      submit(){
        this.$refs.form.validate(valid => {
          if (valid) {

        this.totalArrList=[],//保存的时候第一组数组
        this.totalArrList1=[],
        this.totalArrList2=[],
        this.containData[0].contain.forEach(item=>{
          let allList=[]
          item.value.arr.forEach(item=>{
            allList.push(item.num)
          })
          let arrsList=[]
          item.value.arrs.forEach(item=>{
            arrsList.push(item.num)
          })
          let newarrList=[]
          item.value.newarr.forEach(item=>{
            newarrList.push(item.num)
          })
          let newarrsList=[]
          item.value.newarrs.forEach(item=>{
            newarrsList.push(item.num)
          })
          let teetharrList=[]
          item.value.teetharr.forEach(item=>{
            teetharrList.push(item.num)
          })
          let teetharrsList=[]
          item.value.teetharrs.forEach(item=>{
            teetharrsList.push(item.num)
          })
          let teethnewarrList=[]
          item.value.teethnewarr.forEach(item=>{
            teethnewarrList.push(item.num)
          })
          let teethnewarrsList=[]
          item.value.teethnewarrs.forEach(item=>{
            teethnewarrsList.push(item.num)
          })
          // listdata.push({num:allList.toString()})
          let listdata=[
            {num:allList.toString(),sort:1,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:arrsList.toString(),sort:4,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:newarrList.toString(),sort:2,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:newarrsList.toString(),sort:3,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teetharrList.toString(),sort:1,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teetharrsList.toString(),sort:4,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teethnewarrList.toString(),sort:2,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teethnewarrsList.toString(),sort:3,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
          ]
          listdata=listdata.filter(item=>item.num!='')
          let A="["
          listdata.forEach((item,index)=>{
            A+=JSON.stringify(item)+','
          })
          let A1=A+"]"
          this.totalArrList.push(A1)
        })
        // 第二组
        this.containData[1].contain.forEach(item=>{
          let allList1=[]
          item.value.arr.forEach(item=>{
            allList1.push(item.num)
          })
          let arrsList1=[]
          item.value.arrs.forEach(item=>{
            arrsList1.push(item.num)
          })
          let newarrList1=[]
          item.value.newarr.forEach(item=>{
            newarrList1.push(item.num)
          })
          let newarrsList1=[]
          item.value.newarrs.forEach(item=>{
            newarrsList1.push(item.num)
          })
          let teetharrList1=[]
          item.value.teetharr.forEach(item=>{
            teetharrList1.push(item.num)
          })
          let teetharrsList1=[]
          item.value.teetharrs.forEach(item=>{
            teetharrsList1.push(item.num)
          })
          let teethnewarrList1=[]
          item.value.teethnewarr.forEach(item=>{
            teethnewarrList1.push(item.num)
          })
          let teethnewarrsList1=[]
          item.value.teethnewarrs.forEach(item=>{
            teethnewarrsList1.push(item.num)
          })
          // listdata.push({num:allList.toString()})
          let listdata1=[
            {num:allList1.toString(),sort:1,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:arrsList1.toString(),sort:4,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:newarrList1.toString(),sort:2,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:newarrsList1.toString(),sort:3,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teetharrList1.toString(),sort:1,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teetharrsList1.toString(),sort:4,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teethnewarrList1.toString(),sort:2,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teethnewarrsList1.toString(),sort:3,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
          ]
          listdata1=listdata1.filter(item=>item.num!='')
          let B="["
          listdata1.forEach((item,index)=>{
            B+=JSON.stringify(item)+','
          })
          let B1=B+"]"
          this.totalArrList1.push(B1)
        })
        this.containData[2].contain.forEach(item=>{
          // 医嘱
          let allList2=[]
          item.value.arr.forEach(item=>{
            allList2.push(item.num)
          })
          let arrsList2=[]
          item.value.arrs.forEach(item=>{
            arrsList2.push(item.num)
          })
          let newarrList2=[]
          item.value.newarr.forEach(item=>{
            newarrList2.push(item.num)
          })
          let newarrsList2=[]
          item.value.newarrs.forEach(item=>{
            newarrsList2.push(item.num)
          })
          let teetharrList2=[]
          item.value.teetharr.forEach(item=>{
            teetharrList2.push(item.num)
          })
          let teetharrsList2=[]
          item.value.teetharrs.forEach(item=>{
            teetharrsList.push(item.num)
          })
          let teethnewarrList2=[]
          item.value.teethnewarr.forEach(item=>{
            teethnewarrList.push(item.num)
          })
          let teethnewarrsList2=[]
          item.value.teethnewarrs.forEach(item=>{
            teethnewarrsList.push(item.num)
          })
          // listdata.push({num:allList.toString()})
          let listdata2=[
            {num:allList2.toString(),sort:1,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:arrsList2.toString(),sort:4,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:newarrList2.toString(),sort:2,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:newarrsList2.toString(),sort:3,flag:0,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teetharrList2.toString(),sort:1,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teetharrsList2.toString(),sort:4,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teethnewarrList2.toString(),sort:2,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
            {num:teethnewarrsList2.toString(),sort:3,flag:1,background:"#fff",value:item.fz,
              color:"#fff",isok :true,newbackground: "#286090"},
          ]
          listdata2=listdata2.filter(item=>item.num!='')
          let C="["
          listdata2.forEach((item,index)=>{
            C+=JSON.stringify(item)+','
          })
          let C1=C+"]"
          this.totalArrList2.push(C1)
        })
        this.totalArrList = this.totalArrList.join(";")
        this.totalArrList1 = this.totalArrList1.join(";")
        this.totalArrList2 = this.totalArrList2.join(";")
        const query={
          dentalInspect:this.totalArrList,//口腔检查,
          deptId:this.doctorList.deptId,//公司主键，
          deptRegnId:this.doctorList.deptRegnId,//挂号主键
          dispose:this.totalArrList1,//处置
          doctorAdvice:this.totalArrList2,//医嘱
          doctorId:this.newdoctor,//医生主键
          healTime:this.value1,//就诊时间
          processId:this.processId,//过程主键，
          id:this.doctorList.id,//用户id
          assistantId:this.newyizhu,//医助主键
        }
        // console.log(query,'queryquery')
        // return
        if(this.editFlag==0){
          this.$api.modules.kouqiang.dentalProcessInfoAdd(query).then(res=>{
            if (res.code==200){
              this.flag=true
              this.getdentalProcessInfoList()
              this.$message.success('操作成功')
            }
          })
        }else if(this.editFlag==1){
          this.$api.modules.kouqiang.dentalProcessInfoEdit(query).then(res=>{
            if (res.code==200){
              this.flag=true
              this.getdentalProcessInfoList()
              this.$message.success('操作成功')
            }
          })
        }
          }
        })
      },
      // 删除新增牙位选项
      deleteItem(indexs,index) {
        if (index !== 0) {
          this.containData[indexs].contain.splice(index, 1)
        }
      },
      // 返回新增页面
      goback(){
          this.flag=true
      },
      /** 获取用户列表*/
      getUserList() {
        // 人员添加公司Id  添加状态
        let data = {
          deptId: this.doctorList.deptId,
          status: '0'
        }
        this.$api.user.getUserList(data).then(res => {
          if (res) {
            res.data.forEach(item => {
              item.label = item.nickName
              item.value = item.userId
              if (item.postCode === 'yizhu') {
                const arr=[]
                arr.push(item)
                this.yizhu=this.unique(arr)
              }
              if (item.postCode === 'doctor') {
                const arr1=[]
                arr1.push(item)
                this.doctor=this.unique(arr1)
                // this.doctor.push(item)
              }
            })
          }
        })
      },
      unique(arr) {
        const res = new Map()
        return arr.filter((arr) => !res.has(arr.value) && res.set(arr.value, 1))
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
        // this.contain[this.Index].value=this.deepClone(this.object);
        this.containData[this.Index].contain[this.Indexnum].value = this.object
        console.log(this.contain,'黑恶hi')
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
      closeRoomDialogteeth() {
        this.showDialogtooth = false
      },
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
      //恒牙
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
      changeteeth(val){
    for(let x in this['teeth'+val]){
      this['teeth'+val][x].isok=false
      this['teeth'+val][x].background=""
      this['teeth'+val][x].newbackground="#fff"
      this['teeth'+val][x].color="black"
    }
     },
      //清除恒牙
      clearthee() {
        this.teethmonth.forEach(value => {
          value.background = '';
          value.color = 'black';
          value.newbackground = '#fff';
          value.isok = false;
        })
        this.teethmonthtwo.forEach(value => {
          value.background = '';
          value.color = 'black';
          value.newbackground = '#fff';
          value.isok = false
        })
        this.teethmonththree.forEach(value => {
          value.background = '';
          value.color = 'black';
          value.newbackground = '#fff';
          value.isok = false
        })
        this.teethmonthfour.forEach(value => {
          value.background = '';
          value.color = 'black';
          value.newbackground = '#fff'
          value.isok = false;
        })
      },
      //清除乳牙
      cleartooth() {
        this.deciduousone.forEach(value => {
          value.background = '';
          value.color = 'black';
          value.newbackground = '#fff'
        })
        this.deciduoustwo.forEach(value => {
          value.background = '';
          value.color = 'black';
          value.newbackground = '#fff'
        })
        this.deciduousthree.forEach(value => {
          value.background = '';
          value.color = 'black';
          value.newbackground = '#fff'
        })
        this.deciduousfour.forEach(value => {
          value.background = '';
          value.color = 'black';
          value.newbackground = '#fff'
        })
      },
      closeRoomDialogtooth() {
        this.showDialogtooth = false
      },
      cross(index,num) {
        this.Index=index;
        this.Indexnum=num;
          this.changeteeth('month');
          this.changeteeth('monthtwo');
          this.changeteeth('monththree');
          this.changeteeth('monthfour');
        // 恒牙开始
        // this.addtoothList[index].contain[0].value
        if ( this.containData[index].contain[num].value.arr.length!==0){
          this.containData[index].contain[num].value.arr.forEach(item=>{
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
        if (this.containData[index].contain[num].value.newarr.length!==0){
          this.containData[index].contain[num].value.newarr.forEach(item=> {
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
        if (this.containData[index].contain[num].value.newarrs.length!==0){
          this.containData[index].contain[num].value.newarrs.forEach(item=> {
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
        if (this.containData[index].contain[num].value.arrs.length!==0){
          this.containData[index].contain[num].value.arrs.forEach(item=> {
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
        if (this.containData[index].contain[num].value.teetharr.length){
          this.containData[index].contain[num].value.teetharr.forEach(item=> {
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
        if (this.containData[index].contain[num].value.teethnewarr.length){
          this.containData[index].contain[num].value.teethnewarr.forEach(item=> {
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
        if (this.containData[index].contain[num].value.teetharrs.length){
          this.containData[index].contain[num].value.teetharrs.forEach(item=> {
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
        if (this.containData[index].contain[num].value.teethnewarrs.length){
          this.containData[index].contain[num].value.teethnewarrs.forEach(item=> {
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
        // console.log(this.teethmonth,this.teethmonthtwo,this.teethmonththree,this.teethmonthfour,'jjjjj')
        this.showDialogtooth = true;
        // this.clearthee();
        // this.cleartooth();
        this.contain.forEach(value => {
          value.flag = false
        })
      },
      addvisit() {
        this.ifshow = true
      },
      closeIndex(index) {
        this.contain[index].flag = false
      },
      addentry(indexs, index, newindex) {
        this.contain[indexs].fz += this.newlist[index].data[newindex].name
      },
      newvisit() {
        this.ifshow = true;
        // this.contain[index].flag=false; 
      },
      visit(index) {
        this.ifshow = true;
        this.contain.forEach(value => {
          value.flag = false;
        })
        this.contain[index].flag = true
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      handleNodeClick() {
  
      },
      closeRoomDialog() {
        this.showDialog = false;
      },
      electemplate() {
        this.showDialog = true;
        this.deptOptions = [];
        this.$api.caseTemplateInfo.caseTemplateClassifyTree({ classifyId: 0, deptId: this.deptId }).then(res => {
          if (res) {
            // this.pagination.classifyId = res.rows[0].classifyId
            res.rows.forEach(item => {
              var obj = {};
              var child = [];
              obj.id = item.classifyId
              obj.label = item.classifyName
  
              if (item.children !== null) {
                item.children.forEach(x => {
                  var obje = {};
                  obje.id = x.classifyId
                  obje.label = x.classifyName
                  child.push(obje)
                })
              }
              obj.children = child
              this.deptOptions.push(obj)
            })
          }
        })
      },
      detail(item,val) {
        console.log(this.list,item.dentalInspectList,'item.dentalInspectList')
        this.list[val].dentalInspectList=item.dentalInspectList
        this.list[val].disposeDataList=item.disposeList
        this.list[val].doctorAdviceList=item.doctorAdviceList
        if (this.list[val].flag) {
          this.list[val].flag = false;
          this.list[val].newflag = true
          this.list[val].height = 'auto'
        } else {
          this.list[val].flag = true;
          this.list[val].newflag = false;
          this.list[val].height = 'auto'
        }

      },
      handleleft1(val){
        let arr=[];
        if(val==undefined){
        }else{
          val.forEach(item=>{
            if (item.sort==1){
              if (item.flag==0){
                arr.push(item)
              }else {
                arr.push(item)
              }
            }
          })
        }
        return arr
      },
      handleright2(val){
        let newarr=[];
        if(val==undefined){
        }else{
          val.forEach(item=>{
            if (item.sort==2){
              if (item.flag==0){
                newarr.push(item)
              }else {
                newarr.push(item)
              }
            }
          })
        }
        return newarr
      },
      handleright4(val){
        let arrs=[];
        if(val==undefined){
        }else{
          val.forEach(item=>{
            if (item.sort==4){
              if (item.flag==0){
                arrs.push(item)
              }else {
                arrs.push(item)
              }
            }
          })
        }
        return arrs
      },
      handlerightright3(val){
        let newarrs=[];
        if(val==undefined){
        }else{
          val.forEach(item=>{
            if (item.sort==3){
              if (item.flag==0){
                newarrs.push(item)
              }else {
                newarrs.push(item)
              }
            }
          })
        }
        return newarrs
      },
      addelec() {
        this.newdoctor=''
        this.newyizhu=''
        this.value1=''
        this.flag = false
        this.editFlag=0
        this.containData[0].contain=[{
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
        },]
        this.containData[1].contain=[{
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
        },]
        this.containData[2].contain=[{
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
        },]
      },
    }
  }
  </script>
  
  <style scoped>
  .teeth_top {
    width: 54px;
    height: 150px;
    cursor: pointer;
    border: 1px solid transparent;
  }
  
  .teeth_top:hover {
    border: 1px solid #409eff;
  }
  
  .teethWidth {
    width: 450px;
    height: 150px;
  
  }
  
  .teeth_contain {
    width: 90%;
    height: 300px;
    /* border: 1px solid black; */
    margin: 0 auto;
    margin-top: 20px;
  
  }
  
  * {
    box-sizing: border-box;
  }
  
  .Height_contain_left {
    width: 118px;
    height: 40px;
    padding-left: 16px;
    padding-top: 16px;
  
  }
  
  .Height_contain_right {
    width: calc(100% - 118px);
    /* border: 2px solid #eee; */
    height: 40px;
  }
  
  .Height_contain {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
  
  }
  
  .Height_bottom {
    width: 95%;
    height: 200px;
    position: absolute;
    top: 53px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    z-index: 10000;
    /* position: relative; */
  
  
  }
  
  .Height_children {
    width: 98%;
    height: 50px;
    position: relative;
    /*display: flex;*/
    /* border: 1px solid #eee; */
  }
  
  .Height {
    width: 94%;
    height: 70px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .history {
    min-height: 30px;
    padding-left: 16px;
    margin-top: 20px;
  }
  
  .newplate_top_left {
    width: 250px;
    height: 550px;
    /* border: 1px solid black; */
  }
  
  .newplate_top_right {
    width: calc(100% - 250px);
    height: 550px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    /* border: 1px solid black; */
  }
  
  .newplate_top {
    width: 100%;
    height: 550px;
    /* border: 1px solid red; */
    display: flex;
  }
  
  .newplate {
    width: 100%;
    height: 600px;
    /* border: 1px solid black; */
    position: relative;
  }
  
  .plate {
    width: 99%;
    height: 30px;
    border: 1px solid #409eff;
    border-radius: 10px;
    text-align: center;
    line-height: 20px;
    margin-top: 10px;
  
  }
  
  .yc {
    visibility: hidden;
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
  
  .glnews {
    border: 1px solid #fff !important;
    border-right-color: #666 !important;
    background-color: #fff;
  }
  
  .glnew {
    border: 1px solid #fff !important;
  }
  
  .News {
    background-color: #fff !important;
  }
  
  .newmerage:nth-of-type(1) {
    width: 1080px;
    height: 60px;
  }
  
  .newmerage:nth-of-type(2) {
    width: 145px;
  }
  
  .merages {
    background-color: aqua;
  }
  
  .merages:nth-of-type(1) {
    width: 1050px;
    padding-left: 20px;
    border: 1px solid #666;
    border-right-color: transparent;
  }
  
  .merages:nth-of-type(2) {
    width: 50px;
  }
  
  .merages:nth-of-type(3) {
    width: 150px;
  }
  
  .elect_right_top {
    width: 100%;
    /*height: 80px;*/
    /* border: 1px solid red; */
  }
  
  .merge {
    width: 75px;
    height: 88px;
    border: 1px solid #409eff;
    border-left-color: transparent;
  
  }
  
  .merge:nth-of-type(2) {
    border-right-color: transparent;
  }
  
  .elect_left_top {
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #409eff;
  }
  
  * {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif !important;
    font-size: 14px;
  }
  
  .elect_top {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
  }
  
  .Left {
    margin-left: 40px
  }
  
  .Border {
    border: 1px solid #666;
    border-top-color: transparent;
    border-left-color: transparent;
    border-bottom-color: transparent;
    width: 30px;
    height: 10px;
  
  }
  
  .Bordertwo {
    border: 1px solid transparent;
  
  }
  
  .elect_contain {
    width: 100%;
    /*height: 150px;*/
    /* border: 1px solid black; */
    display: flex;
  }
  
  .elect_left {
    width: 130px;
    /*height: 150px;*/
    border: 1px solid #409eff;
    border-left-color: transparent;
    border-right-color: transparent;
    background-color: #fff;
  
  
  }
  
  .elect_right {
    width: calc(100% - 130px);
    /*height: 150px;*/
    border: 1px solid transparent;
    margin-left: 10px;
  }
  .addstyle{
    background: #fff;
    text-align: end;
    margin-top: -23px;
    margin-right: 10px;
    color: #3cbfa8;
  }
  </style>