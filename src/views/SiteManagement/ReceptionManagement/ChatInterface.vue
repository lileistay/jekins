<template>
  <div class="content">

    <div class="box1">
      <div @click="listempsel(index)"
        :style="{ width: '100%', height: '30px', background: item.back, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }"
        v-for="(item, index) in listemp">
        {{ item.name }}
      </div>
      <!-- <div>
        <el-tooltip placement="bottom" effect="light" popper-class="tip">
          <div slot="content">
            <div class="tip"><span></span>在线</div>
            <br />
            <div class="tip"><span></span>离线</div>
          </div>
          <span>在线</span>
        </el-tooltip>
      </div> -->
      <!-- <div @click="getlistgk" :style="{ backgroundColor: Backgroun, color: Color }">顾客</div>
      <div @click="getlistemp" :style="{ backgroundColor: Backgrouns, color: Colors }">员工</div>
      <div @click="quit">快捷回复管理</div> -->
    </div>
    <div v-if="!quitflag" style="width:96%;">
      <div style="display: flex;width: 100%;">
        <div style="width: 200px;">
          <div
            style="width: 100%;height: 30px;text-align: center;line-height: 30px;background-color: #eee;cursor: pointer;">
            快捷回复设置
          </div>
        </div>
        <div style="width: calc(100% - 200px);">
          <SgTable :pagination="pagination" :table-data="tableData" :columns="columns" index="序号" border size="mini">
            <div slot="searchBar" class="searchBar">
              <div class="title" style="font-size: 14px;">查询快捷回复:
                <el-input type="text" size="mini" style="width: 250px;" placeholder="请输入快捷回复" v-model="messageContent"
                  clearable>
                </el-input>
                分组名称：
                <el-select size="mini" v-model="messageTypeId">
                  <el-option :value="item.value" :label="item.label" v-for="item in listType"></el-option>
                </el-select>
                <el-button type="primary" size="mini" style="margin-left: 30px;" @click="search">查询</el-button>
              </div>
            </div>
            <div slot="header" style="width: 100%;">
              <el-button v-has-permi="['Appointment:modification']" size="mini" type="success" plain icon="el-icon-plus"
                class="headerBarBtn" @click.stop.native="appointmentAddition">添加快捷回复
              </el-button>
              <el-button v-has-permi="['Appointment:modification']" size="mini" type="success" plain icon="el-icon-plus"
                class="headerBarBtn" @click.stop.native="appointmentAdditionel">新增分组
              </el-button>
              <!-- <el-button v-has-permi="['sysManger:dept:label']" size="mini" type="primary" plain
                icon="el-icon-edit-outline" class="headerBarBtn" @click.stop="customerLabelEdit">批量删除
              </el-button> -->
            </div>
            <template #custom="data">
              <div v-if="data.props === 'names'">
                <el-button type="text" @click="edit(data.custom)">编辑</el-button>
                <el-button type="text" @click="deletesel(data.custom)">删除</el-button>
              </div>
            </template>
          </SgTable>
        </div>

      </div>

      <div>
        <SgDialog title="新增分组" :dialog="groupping" @handleClose="groupping = false" size="650px">
          <div slot="out">
            <div style="width: 100%;height: 40px;display: flex;">
              <span style="color: red;">*</span>分组名称
              <div style="width: 500px;height: 500px;margin-left: 20px;">
                <el-input placeholder="请输入分组名称" v-model="textareagrouop" style="width:250px;" size="mini" clearable>
                </el-input>
                <el-button size="mini" style="margin-left:20px" type="primary" @click="addTo">添加</el-button>
              </div>

            </div>
            <div style="width:100%;height:300px;" class="tabledata">
              <el-table :data="tableDatanew" style="width: 100%" height="300" border>
                <el-table-column label="分组" align="center">
                  <template slot-scope="scope">
                    <div v-if="scope.row.flag">
                      {{ scope.row.typeName }}
                    </div>
                    <div v-else>
                      <el-input type="mini" style="width:120px" v-model="scope.row.typeName" size="mini" clearable>

                      </el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="date" label="操作" align="center">
                  <template slot-scope="scope">
                    <div>
                      <el-button type="text" @click="editflag(scope.row)" v-if="scope.row.flag">编辑</el-button>
                      <el-button type="text" @click="saveflag(scope.row)" v-if="!scope.row.flag">保存</el-button>
                      <el-button type="text" style="color:red" @click="deletesave(scope.row)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="height:50px">

            </div>
            <div class=""
              style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
              <div style="width: 160px;height: 40px;">
                <el-button type="primary" size="mini" @click="okping" style="visibility:hidden">确定</el-button>
                <el-button @click="groupping = false" size="mini">取消</el-button>
              </div>
            </div>
          </div>
        </SgDialog>
        <SgDialog title="新增快捷回复" :dialog="customLabelDialog" @handleClose="customLabelDialog = false" size="650px">
          <div slot="out">
            <div style="height:40px">
              <span style="color: red;">*</span>分组名称
              <el-select size="mini" v-model="groupmessagelistmore" style="margin-left:18px">
                <el-option :value="item.value" :label="item.label" v-for="item in listType"></el-option>
              </el-select>
            </div>
            <div style="width: 100%;height: 230px;display: flex;">
              <span style="color: red;">*</span>回复内容
              <div style="width: 500px;height: 500px;margin-left: 20px;">
                <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="textarea">
                </el-input>
              </div>
            </div>
            <div class=""
              style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
              <div style="width: 160px;height: 40px;">
                <el-button type="primary" size="mini" @click="ok">确定</el-button>
                <el-button @click="customLabelDialog = false" size="mini">取消</el-button>
              </div>
            </div>
          </div>
        </SgDialog>
      </div>

      <SgDialog title="编辑快捷回复" :dialog="newcustomLabelDialog" @handleClose="newcustomLabelDialog = false" size="650px">
        <div slot="out">
          <div style="height:40px">
            <span style="color: red;">*</span>分组名称
            <el-select size="mini" v-model="groupmessagelistmorel" style="margin-left:18px" disabled>
              <el-option :value="item.value" :label="item.label" v-for="item in listType"></el-option>
            </el-select>
          </div>
          <div style="width: 100%;height: 230px;display: flex;">
            <span style="color: red;">*</span>回复内容
            <div style="width: 500px;height: 500px;margin-left: 20px;">
              <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="newtextarea">
              </el-input>
            </div>
          </div>
          <div class=""
            style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
            <div style="width: 160px;height: 40px;">
              <el-button type="primary" size="mini" @click="newok">确定</el-button>
              <el-button @click="newcustomLabelDialog = false" size="mini">取消</el-button>
            </div>
          </div>
        </div>
      </SgDialog>
    </div>

    <div class="box2" v-if="quitflag" @click="clearFlag">
      <div class="text" style="">
        <span class="text1" @click="listcusel(index)" :style="{color:item.color,borderBottom:item.bottom}" v-for="(item,index) in listcustom">{{ item.name }}</span>
        <!-- <span class="text1" style="margin-left:20px">员工</span> -->
        <!-- <span v-for="(item, index) in listcustom"
          :style="{ color: item.color, cursor: 'pointer', marginLeft: index == 0 ? '20px' : '' }"
          @click="listcusel(index)">
          {{ item.name }} <span v-if="index == 0">/</span>
        </span> -->
        <!-- 顾客/员工 -->
      </div>
      
      <div class="store">全部门店</div>

      <div style="height: 80%;overflow: auto;position: relative;">
        <div class="list" v-for="(item, index) in datalist" :key="index" :class="index == addcolor ? 'listcolor' : ''"
          @click="clickList(item, index)" style="position: relative;">
          <div><img :src="item.imgurl" style="width: 26px;border-radius: 50%;height: 26px;"></div>
          <!--          <div style="" class="circle" v-if="item.fillType !== undefined">-->
          <!--            {{ item.fillType }}-->
          <!--          </div>-->
          <div style="margin: 0px 10px;">
            <div class="title" style="color: #999;">{{ item.customerName }}</div>
            <div class="cont" :style="{ color: item.online == '1' ? 'orange' : '#999' }">{{ item.online == '1' ? "在线" :
              '离线' }}
            </div>
          </div>
          <div class="time">{{ item.time }}</div>
          <!-- <div class="message" :style="{ color: item.fillType ? 'orange' : '#999' }">
            {{ item.fillType ? '未读' : '已读' }}
          </div> -->
        </div>
        <div
          style="display: flex;flex-wrap: wrap;margin-top: 30px;position: absolute;bottom: 35px;width: 100%;height: 50px;display: flex;align-items: center;justify-content: center;background-color: #fff;z-index: 1000;">
          <el-pagination small :pager-count="5" background layout="prev, pager, next" :total="total"
            @current-change="currentChange">
          </el-pagination>
        </div>

      </div>

    </div>
    <div class="box3" v-if="quitflag">

      <div style="height: 450px;position: relative;overflow: hidden;" @click="clearFlag">
        <div class="title" style="position: absolute;width: 100%;background-color: #fff;top: 0;z-index: 100;">
          <div>兰州时光整形美容医院(西关店)</div>
        </div>
        <div :style="{ bottom: newbottom, transition: transition }" class="dialogk">
          <div style="margin-left: 20px;font-weight: 700;margin-top: 10px;">
            快捷回复
          </div>
          <div style="width: 100%;height: 260px;margin-top: 10px;display: flex;border: 1px solid #eee;">
            <div style="width: 100px;height: 250px;">
              <div :style="{ color: item.color, background: item.back }" class="allcolor"
                v-for="(item, index) in listType" @click="dataALL(index)">
                {{ item.label }}
              </div>
            </div>
            <div style="width: calc(100% - 120px);height: 250px;overflow-y: scroll;">
              <div
                style="width: 100%;height: 30px;border-bottom: 1px solid #eee;display: flex;align-items: center;color: #666;"
                v-for="item in tableDatalist">
                <div style="width: 85%;height: 30px;line-height: 30px;padding-left: 10px;white-space:nowrap;overflow: hidden;text-overflow: ellipsis;cursor: pointer;" :title="item.messageContent">
                  {{ item.messageContent }}
                </div>
                <el-button type="text" style="margin-left: 50px;" @click="copy(item.messageContent)">
                  复制
                </el-button>
                <el-button type="text" @click="methodssend(item.messageContent)">
                  一键发送
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="contentbox" style="position: relative;">

          <div class="overfloemessage" style="margin-top: 50px;position: relative;">
            <div v-for="(item, index) in contactlistone" :key="index"
              :style="{ display: 'flex', flexWrap: 'wrap', flexDirection: item.senderId == userId ? 'column' : '' }">
              <div style="width: 100%;height: 30px;display: flex;align-items: center;justify-content: center;"
                v-show="isFlag(item, index)">
                {{ nesTime(item.senderTime) }}
              </div>
              <div style="margin: 10px 10px 47px;" v-if="item.senderId == userId">
                <div style="display: flex;float: right;">
                  <div style="margin-right: 20px">
                    <div style="text-align: right;font-size: 12px;color: #999;">{{ item.createBy }}</div>
                    <div class="neurong">
                      <div v-if="item.sendType == 3" @click="priview(item)">
                        <div class="product" style="display: flex">
                          <div><img :src="item.sendContent.imgurl" style="width: 67px;margin: 10px 0px;height: 67px;">
                          </div>
                          <div class="project">
                            <div>{{ item.sendContent.projectName }}</div>
                            <div v-if="item.sendContent.productSpecInfo">
                              <span>价格￥{{ item.sendContent.productSpecInfo[0].sellingPrice }}</span><span
                                style="margin-left: 20px;font-size: 13px;color: #979797;">规格：{{
                                  item.sendContent.productSpecInfo[0].specs
                                }}</span>
                            </div>
                          </div>

                        </div>
                      </div>
                      <div v-else v-html="item.sendContent"
                        style="display: flex;align-items: center;justify-content: center;padding: 0;"></div>
                    </div>
                  </div>
                  <div><img :src="item.imgurl" style="width: 45px;border-radius: 50%;"></div>
                </div>
              </div>
              <div style="margin: 10px 10px 47px;" v-else>
                <div style="display: flex;float: right;">
                  <div><img :src="item.imgurl" style="width: 45px;margin-right: 20px;border-radius: 50%;"></div>
                  <div style="margin-right: 20px">
                    <div style="text-align: left;font-size: 12px;color: #999;">{{ item.createBy }}</div>
                    <div class="neurong" @click="priview(item)">
                      <div v-if="item.sendType == 3">
                        <div class="product" style="display: flex">
                          <div><img :src="item.sendContent.imgurl" style="width: 67px;margin: 10px 0px;height: 67px;">
                          </div>
                          <div class="project">
                            <div>{{ item.sendContent.projectName }}</div>
                            <div v-if="item.sendContent.productSpecInfo">
                              <span>价格￥{{ item.sendContent.productSpecInfo[0].sellingPrice }}</span><span
                                style="margin-left: 20px;font-size: 13px;color: #979797;">规格：{{
                                  item.sendContent.productSpecInfo[0].specs
                                }}</span>
                            </div>
                          </div>

                        </div>
                      </div>
                      <div v-else v-html="item.sendContent"
                        style="display: flex;align-items: center;justify-content: center;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

      <!-- 输入框     -->
      <div class="box" style="position: relative;" v-if="quitflag">
        <div class="emoji" style="position: absolute;z-index: 10000;left: 15px;top:9px" @click="showemoji">
          <el-tooltip effect="dark" content="表情回复" placement="top">
            <img src="@/assets/emoji.png" mode="" class="Img" style="width: 24px;height: 24px;" />
          </el-tooltip>
        </div>
        <div class="emoji" style="position: absolute;z-index: 10000;left: 42px;top:11px" @click="quitrecord">
          <el-tooltip effect="dark" content="快捷回复" placement="top">
            <img src="@/assets/images/quitrecord.png" class="Img" style="width: 20px;height: 20px;margin-left: 15px;"
              alt="">
          </el-tooltip>
        </div>

        <div style="" class="Emoji" v-show="emojiFlag">
          <div v-for="item in emojData" style="margin-top: 10px;margin-left: 10px;cursor: pointer;"
            @click="selectemoji(item)">
            {{ item }}
          </div>
        </div>
        <!-- <div class="bottomemoji" style="" v-show="show">
          <div class="emojichildren" style="">
            <div class="childrens" v-for="item in emojData" @click="selectEmoji(item)">
              {{ item }}
            </div>
          </div>
        </div> -->
        <!-- <div ref="editor" style="width: 100%;height: 100%;background: none;    margin-top: -1px;"></div> -->
        <wangeditor @catchData="catchData" :content="listedit"></wangeditor>
        <div
          style="text-align: right;background: #f7f7f7;margin-top: -31px;position: absolute;right: 10px;bottom: -50px;">
          <span @click="send" class="butt" style="">发送</span>
        </div>
      </div>
    </div>
    <div class="box4" v-if="quitflag">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="顾客" name="first">
          <div class="costomer">
            <div><img :src="RightImg" style="width: 26px;height: 26px;border-radius: 50%;"></div>
            <div style="margin-left: 10px;width: 55%;">
              <div class="title1">{{ listtitle }}</div>
              <div class="cont1" :style="{ color: ifOrangeflag == true ? 'orange' : '#999' }">{{ ifOrangeflag == true ?
                '在线' : '离线' }}
              </div>
            </div>
            <div>
              <span class="butt" @click="changeValue" v-if="xflag == 1"><img src="@/assets/hand.png" />购买信息</span>
              <span class="butt" @click="changeValue" v-else><img src="@/assets/hand.png" />基本信息</span>
            </div>
          </div>
          <div class="basic" v-if="xflag == 1">
            <div>客户姓名：{{ customdata.customerName }}</div>
            <div>客户年龄：{{ customdata.customAge }}</div>
            <div>会员级别：{{ customdata.gradeName }}</div>
            <div>性别：<span v-if="customdata.customSex == 1">男</span><span v-if="customdata.customSex == 0">女</span></div>
            <div>年龄：{{ customdata.customAge }}</div>
            <div>手机号：{{ customdata.customPhone }}</div>
            <div>客户卡号：{{ customdata.customCardNumber }}</div>
            <div>项目类型：{{ customdata.bookingPeojectName }}</div>
            <div>美学顾问：{{ customdata.rdName }}</div>
            <div>媒介：{{ customdata.channelName }}</div>
            <div>关注问题:{{ customdata.concerns }}</div>
            <div>公司名称：{{ customdata.deptName }}</div>
            <div>所在省份：{{ customdata.province }}</div>
            <div>所在城市：{{ customdata.city }}</div>
            <div>所在县/区：{{ customdata.area }}</div>
          </div>
          <div class="basic" v-else style="min-height: 700px;">
            <div
              style="position: absolute;bottom: 0px;display: flex;align-items: center;justify-content: center;width: 100%;height: 50px;">
              <el-pagination small :pager-count="5" background layout="prev, pager, next" :total="totalnew"
                @current-change="currentChangenew"></el-pagination>
            </div>

            <el-tabs v-model="activeName2" type="card" @tab-click="handleClick2" style="margin-top: 20px;">
              <el-tab-pane name="1" label="购买商品信息">
                <div class="product" style="display: flex" v-for="item in listpay">
                  <div><img :src="item.imgurl" style="width: 67px;margin: 10px 0px;height: 67px;"></div>
                  <div class="project">
                    <div>{{ item.projectName }}</div>
                    <div>下单时间：{{ item.createTime }}</div>
                    <div><span>价格：￥{{ item.actualPayment }}</span><span
                        style="margin-left: 20px;font-size: 13px;color: #979797;">规格：{{ item.productSpecInfo[0].specs
                        }}</span>
                      <div>
                        <span style="color: red;">{{ newtype(item.orderState) }}</span>
                      </div>

                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane name="2" label="购买拼团信息">
                <div class="product" style="display: flex" v-for="item in grouplist">
                  <div><img src="@/assets/avatar.jpg" style="width: 67px;margin: 10px 0px;"></div>
                  <div class="project">
                    <div>{{ item.projectName }}</div>
                    <div>下单时间：{{ item.createTime }}</div>
                    <div><span>价格：￥{{ item.amountPayable }}</span><span
                        style="margin-left: 20px;font-size: 13px;color: #979797;">规格：{{ item.specs }}</span>
                      <div style="color: red;">
                        <show-dict-data :options="dict.type.pinggroup_status" :value="item.payStatus" />
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>

            </el-tabs>

          </div>
        </el-tab-pane>
        <el-tab-pane label="商品" name="second">
          <el-tabs v-model="activeName1" type="card" @tab-click="handleClick1">
            <el-tab-pane name="1" label="服务类">
              <div class="product" style="display: flex" v-for="item in listproject">
                <div><img :src="item.imgurl" style="width: 67px;margin: 10px 0px;height: 67px;"></div>
                <div class="project">
                  <div>{{ item.projectName }}</div>
                  <div><span>价格￥{{ item.productSpecInfo[0].sellingPrice }}</span><span
                      style="margin-left: 20px;font-size: 13px;color: #979797;">规格：{{ item.productSpecInfo[0].specs
                      }}</span>
                  </div>
                  <div style="text-align: right;position: absolute;right: 0;"><span
                      style="font-size: 14px;color: #2db9ff;cursor: pointer;" @click="senditem(item)">发送链接</span></div>
                </div>

              </div>
              <!-- <div class="product" style="display: flex">
                <div><img src="@/assets/avatar.jpg" style="width: 67px;margin: 10px 0px;"></div>
                <div class="project">
                  <div>商品名称</div>
                  <div><span>价格：￥100</span><span style="margin-left: 20px;font-size: 13px;color: #979797;">规格：10ml</span>
                  </div>
                  <div style="text-align: right"><span style="font-size: 14px;color: #2db9ff;">发送链接</span></div>
                </div>
              </div> -->
            </el-tab-pane>
            <el-tab-pane name="2" label="实物类">
              <div class="product" style="display: flex" v-for="item in listproject">
                <div><img :src="item.imgurl" style="width: 67px;margin: 10px 0px;height: 67px;"></div>
                <div class="project">
                  <div>{{ item.projectName }}</div>
                  <div><span>价格￥{{ item.productSpecInfo[0].sellingPrice }}</span><span
                      style="margin-left: 20px;font-size: 13px;color: #979797;">规格：{{ item.productSpecInfo[0].specs
                      }}</span>
                  </div>
                  <div style="text-align: right;position: absolute;right: 0;"><span
                      style="font-size: 14px;color: #2db9ff;cursor: pointer;" @click="senditem(item)">发送链接</span></div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <sg-dialog title="商品信息" :dialog="showproject" out-top="50px" @handleClose="showproject = false" size="400px"
        v-if="quitflag">
        <div slot="out">
          <div style="" class="labelproject">
            <span>商品名称：</span>
            <span style="margin-left: 20px;">{{ itemproject.projectName }}</span>
          </div>
          <div style="" class="labelproject">
            <span>服务类型：</span>
            <span style="margin-left: 20px;">{{ itemproject.makeType == 1 ? "付费预约" : "免费预约" }}</span>
          </div>
          <div style="" class="labelproject">
            <span>商品类型：</span>
            <span style="margin-left: 20px;">{{ itemproject.productType == '1' ? "实物" : '服务' }}</span>
          </div>
          <div style="" class="labelproject">
            <span>实际销量：</span>
            <span style="margin-left: 20px;">{{ sumadd(itemproject.productSpecInfo) }}</span>
          </div>
          <div style="" class="labelproject">
            <span>上/下架时间：</span>
            <span style="">{{ itemproject.shelfTime }}</span>
          </div>
          <div style="" class="labelproject">
            <span>上架状态：</span>
            <span style="margin-left: 20px;">{{ itemproject.shelfFlag == '0' ? "上架" : '下架' }}</span>
          </div>
          <div style="flex-wrap: wrap;" class="labelproject">
            <span>商品规格：</span>
            <span style="margin-left: 20px;" v-for="newitem in itemproject.productSpecInfo">{{ newitem.specs }}
              <span style="color: red;">价格：￥{{ newitem.sellingPrice }}</span>
            </span>
          </div>
        </div>
      </sg-dialog>
    </div>

  </div>
</template>

<script>
import wangeditor from '@/components/wangeditor/index.vue'
import { unix } from 'dayjs';
import { forEach, index } from "mathjs";
const serverPath = process.env.VUE_APP_BASE_API + '/file'
import SgDialog from '@/components/Dialog'
import SgTable from '@/components/Table'

export default {
  dicts: ['pinggroup_status',],
  components: {
    wangeditor,
    SgDialog,
    SgTable
  },
  watch: {
    onlinelist(val) {

    },
    onlineuplist(val) {
      this.datalist.forEach(value => {
        if (value.id == val.val) {
          if (val.type == '1') {
            value.online = '1'
          } else {
            value.online = '0'
          }
        }
      })
    },
    deptId(val) {
      if (this.listflagproject) {
        this.getprojectlist('2')
      }
      if (this.listflagproject) {
        this.getprojectlist(this.selectprojectIndex)
      }
    },
    loadmessage(val) {
      this.newmessagelist = JSON.parse(val);
      if (this.newmessagelist.sendType == 3) {
        this.newmessagelist.sendContent = JSON.parse(this.newmessagelist.sendContent)
        this.contactlistone.push({
          createBy: this.newmessagelist.createBy,
          sendContent: this.newmessagelist.sendContent,
          sendType: 3,
          imgurl: this.headImage,
          senderTime: this.newgetHour() + hrmls[3]
        })

      } else {
        let hrmls = this.newmessagelist.senderTime.split(' ');
        this.contactlistone.push({
          createBy: this.newmessagelist.createBy,
          sendContent: this.newmessagelist.sendContent,
          imgurl: this.headImage,
          senderTime: this.newgetHour() + hrmls[3]

        })
      }
      setTimeout(() => {
        if (parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height) > 500) {
          document.querySelector('.contentbox').scrollTop = parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height)
        }
      }, 200)
      // console.log( this.contactlistone,'aaaaa')
      // this.contact[this.Index].push({
      //   name:localStorage.getItem('username'),
      //   content:this.newmessagelist.sendContent
      // })
    }
  },
  name: "ChatInterface",
  mounted() {
    this.loadmessage = this.$store.getters.loadmessage;
    let that = this;
    // this.listtitle = this.datalist[0].title;
    // if (this.datalist[0].fillType) {
    //   this.ifOrangeflag = true;
    // }
    let len = document.querySelectorAll('.w-e-menu');
    for (let i = 0; i < 11; i++) {
      len[i].style.display = 'none'
    }
    len[11].style.visibility = 'hidden';
    len[12].style.visibility = 'hidden';
    len[14].style.visibility = 'hidden';
    len[15].style.visibility = 'hidden';
    this.deptId = this.$store.getters.departmentId;
    document.querySelector('.contentbox').addEventListener('scroll', function (e) {
      let Top = e.target.scrollTop;
      if (Top == 0 && that.Topflag) {
        that.pageNumrecode++;
        that.getfathers(that.userId)
      }
      that.Topflag = true
      // if(e==0)
      // console.log(e.target.scrollTop,'dsadhasd')
    })
    document.onkeyup = function (e) {
      that.caflag = false
    }
    document.onkeydown = function (e) {
      var keyCode = e.keyCode || e.which || e.charCode;
      var ctrlKey = e.ctrlKey || e.metaKey;
      if (!that.caflag) {
        if (keyCode == 13) {
          if (that.listedit == '') {
            that.$message.warning('请输入内容进行发送');
            return;
          }
          that.send();
        }
      } else {
        if (keyCode == 13) {
          that.listedit += '<br />'
        }

      }
      if (keyCode == 17) {
        that.coutflag++
        if (that.coutflag > 1) {
          that.caflag = true
        }
      }
      // if (ctrlKey && keyCode == 13) {

      // } else {
      //   if (keyCode == 13) {
      //     if (that.listedit == '') {
      //       that.$message.warning('请输入内容进行发送');
      //       return;
      //     }
      //     that.send();
      //   }
      // }


    }



  },
  data() {
    return {
      messageContent: "",
      groupmessagelistmorel: "",
      newcolor:'',
      bottoms:"",
      tableDatalist:[],
      Id: "",
      messageTypeId: "",
      groupping: false,
      tableDatanews: [],
      listType: [{
        value: "",
        label: '全部'
      }],
      tableDatanew: [],
      textareagrouop: '',
      groupmessagelistmore: "",
      listcustom: [
        {
          name: "顾客",
          color: '#E6A23C',
          bottom:"2px solid #E6A23C",
        },
        {
          name: "员工",
          color: '',
          bottom:"",
        },
      ],
      listemp: [
        {
          name: "消息",
          back: "#fff",
          color: "#666"
        },
        {
          name: "设置",
          back: "",
          color: ""
        }
      ],
      customLabelDialog: false,
      newbottom: '-300px',
      transition: "",
      messagelist: [
        { message: '在吗？亲' },
        { message: '在的，亲' }
      ],
      dataAll: [
        {
          name: "全部",
          color: "#ffa88b",
          back: "#ffeae4",
        },
        {
          name: "售前话术",
          color: "",
          back: "",
        }
      ],
      transitionflag: false,
      newcustomLabelDialog: false,
      textarea: "",
      newtextarea: "",
      tableData: [],
      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
        currentPage: 1
      },
      columns: [
        {
          lab: '回复内容',
          val: 'messageContent',
          // width: 1520,
        },
        {
          lab: '操作',
          val: 'names',
          custom: 'names',
          width: 200
        }
      ],
      quitflag: true,
      activeName: 'first',
      RightImg: "",
      groupNum: 1,
      listpay: [],
      grouplist: [],
      totalnew: 0,
      itemproject: '',
      showproject: false,
      pageNumrecode: 1,
      userIdflag: "",
      getformlist: true,
      headImage: require('@/assets/avatar.jpg'),
      rightheadImage: require('@/assets/avatar.jpg'),
      Topflag: false,
      Backgroun: '#eee',
      Color: "black",
      Backgrouns: "black",
      Colors: "#fff",
      total: 0,
      coutflag: 0,
      caflag: false,
      pageNum: 1,
      listedit: '',
      contactlistone: "",
      newmessagelist: "",
      listflagproject: false,
      listflagprojects: false,
      selectprojectIndex: '',
      listproject: [],
      content: "",
      emojiFlag: false,
      listtitle: "",
      activeName1: '1',
      activeName2: '1',
      Index: 0,
      ifOrangeflag: false,
      textarea: '',
      datalist: [
        // { img: '@/assets/avatar.jpg', title: '万总', content: '你好,jfigj', time: '14:05', fillType: 1 },
        // { img: '@/assets/avatar.jpg', title: '王德忠', content: '你好,jfigj', time: '14:05', fillType: 2 },
        // { img: '@/assets/avatar.jpg', title: '吴明元', content: '你好,jfigj', time: '14:05' },
        // { img: '@/assets/avatar.jpg', title: '后鹏丽', content: '你好,jfigj', time: '14:05' },
        // { img: '@/assets/avatar.jpg', title: '李磊', content: '你好,jfigj', time: '14:05' },
        // { img: '@/assets/avatar.jpg', title: '喊下吕晶晶', content: '你好,jfigj', time: '14:05' },
        // { img: '@/assets/avatar.jpg', title: '喊下吕晶晶', content: '你好,jfigj', time: '14:05' },
        // { img: '@/assets/avatar.jpg', title: '喊下吕晶晶', content: '你好,jfigj', time: '14:05' },
        // { img: '@/assets/avatar.jpg', title: '喊下吕晶晶', content: '你好,jfigj', time: '14:05' },
      ],
      emojData: [
        '🤞', '👍', '👏', '❤', '😁', '🖐', '😀', '😃',
        '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
        '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗',
        '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨',
        '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞',
        '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩',
        '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',
        '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓',
        '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑',
        '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '😴',
        '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧',
        '😷', '🤒', '🤕', '🤑', '🤠', '👻', '🐧'
      ],
      xflag: 1,
      formList: {},
      info_: "",
      addcolor: 0,
      contactLeft: [
        [], [], [], [], [], [], [], [],
      ],
      contact: [
        [
          { name: localStorage.getItem('username'), content: '马上就要紧张了' }
        ],
        // [
        //   { name: localStorage.getItem('username'), content: '比较紧张，要生孩子了' }
        // ],
        // [
        //   { name: localStorage.getItem('username'), content: '老老实实' }
        // ],
        // [
        //   { name: localStorage.getItem('username'), content: '估计要转行了' }
        // ],
        // [
        //   { name: localStorage.getItem('username'), content: '很勤劳' }
        // ],
        // [
        //   { name: localStorage.getItem('username'), content: 'hZq839926635兰州痘你完专业祛痘旗舰店' }
        // ],
        // [
        //   { name: localStorage.getItem('username'), content: 'hZq839926635兰州痘你完专业祛痘旗舰店' }
        // ],
        // [
        //   { name: localStorage.getItem('username'), content: 'hZq839926635兰州痘你完专业祛痘旗舰店' }
        // ],
        // [
        //   { name: localStorage.getItem('username'), content: 'hZq839926635兰州痘你完专业祛痘旗舰店' }
        // ]
      ],
      queryContent: '',
      show: false,
      userId: '',
      customdata: {}
    }
  },
  computed: {
    deptId: {
      get() {
        return this.$store.getters.departmentId
      },
      set(val) {
        val = this.$store.getters.departmentId;
      }
    },
    loadmessage: {
      get() {
        return this.$store.getters.loadmessage
      },
      set(val) {
        val = this.$store.getters.loadmessage
      }
    },
    onlinelist: {
      get() {
        return this.$store.getters.onlinelist
      },
      set(val) {
        val = this.$store.getters.onlinelist
      }
    },
    onlineuplist: {
      get() {
        return this.$store.getters.onlineuplist
      },
      set(val) {
        val = this.$store.getters.onlineuplist
      }
    }
  },
  created() {
    this.userId = localStorage.getItem('userId');
    this.loadmessage = this.$store.getters.loadmessage;
    this.onlinelist = this.$store.getters.onlinelist;
    this.onlineuplist = this.$store.getters.onlineuplist
    this.getcustomlist();
    this.getlistType();
    // const senderId

  },
  methods: {
    search() {
      this.getdata()
    },
    deletesave(item) {
      this.$confirm('确认删除分组吗，是否继续？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.$api.confinementRoom.messageTypeIds(item.messageTypeId).then(newres => {
          if (newres.code == 200) {
            this.$message.success("删除成功");
            this.getlistType();
          }
        })
      }).catch(res => {

      })
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
    getlistType() {
      let data = {
        typeName: "",
        userId: localStorage.getItem('userId'),
      }

      this.$api.confinementRoom.listType().then(res => {
        res.rows.forEach((value, index) => {
          value.flag = true;
          value.label = value.typeName;
          value.value = value.messageTypeId
        })
        this.listType = this.deepClone(res.rows);
        this.listType.unshift({
          value: "",
          label: "全部"
        })
        this.listType.forEach((value, index) => {
          if (index == 0) {
            value.color = '#ffa88b'
            value.back = "#ffeae4"
          } else {
            value.color = ''
            value.back = ""
          }
        })
        this.tableDatanew = res.rows;
        this.tableDatanews = res.rows;
      })

    },
    saveflag(data) {
      let datas = {
        userId: localStorage.getItem("userId"),
        messageTypeId: this.messageTypeId,
        typeName: data.typeName
      }
      this.$api.confinementRoom.chatMessageTypeedit(datas).then(res => {
        if (res.code == 200) {
          this.$message.success('保存成功')
          this.getlistType();
        }
      })
      // this.tableDatanew.forEach(value => {
      //   if (value.id == data.id) {
      //     value.flag = true
      //   }
      // })
    },
    editflag(data) {
      this.messageTypeId = data.messageTypeId;
      let Index = 0;
      let Indexs = 0;

      this.tableDatanews.forEach((value, index) => {
        if (value.messageTypeId == data.messageTypeId) {
          value.flag = false;
          Index = value;
          Indexs = index
        }
      })
      this.$set(this.tableDatanew, Indexs, {
        createBy: Index.createBy,
        createTime: Index.createTime,
        delFlag: Index.delFlag,
        flag: false,
        messageTypeId: Index.messageTypeId,
        typeName: Index.typeName,
        userId: Index.userId,

      })
      // this.tableDatanew=this.tableDatanews
      //       this.$set(this.tableDatanew,Indexs,Index)
      //       this.tableDatanew.push({});
      // this.tableDatanew.pop();
      //       console.log(this.tableDatanew)
    },
    addTo() {
      if (this.textareagrouop == "" || this.textareagrouop == null) {
        this.$message.warning('请输入分组名称');
        return;
      }
      let data = {
        typeName: this.textareagrouop,
        userId: localStorage.getItem('userId'),

      }
      this.$api.confinementRoom.chatMessageType(data).then(res => {
        if (res.code == 200) {
          this.$message.success('添加成功');
          this.textareagrouop = '';
          this.getlistType();
        }
      })
      // this.tableDatanew.push({
      //   name: this.textareagrouop,
      //   flag:true,
      //   message:"",
      //   id:1,
      // })
    },
    getTYpelist() {

    },
    okping() {

    },
    appointmentAdditionel() {
      this.groupping = true;
      this.textareagrouop = '';
    },
    listcusel(index) {
      this.listcustom.forEach(value => {
        value.color = '';
        value.bottom="";
      })
      this.listcustom[index].color = '#E6A23C'
      this.listcustom[index].bottom='2px solid #E6A23C'
      if (index == 0) {
        this.getlistgk();
      } else {
        this.getlistemp();
      }
    },
    listempsel(index) {
      this.listemp.forEach(value => {
        value.color = '';
        value.back = ''
      })
      this.listemp[index].back = '#fff';
      this.listemp[index].color = '#666';
      if (index == 0) {
        this.getlistgk();
      }
      if (index == 1) {
        this.quit();
        this.getdata();
      }
    },
    clearFlag() {
      // this.newbottom = '-300px';
      // this.transition = 'all 0.5s';
      // this.transitionflag = false;
    },
    copy(item) {
      let oInput = document.createElement('input');
      // 将想要复制的值
      oInput.value = item;
      // 页面底部追加输入框
      document.body.appendChild(oInput);
      // 选中输入框
      oInput.select();
      // 执行浏览器复制命令
      document.execCommand('Copy');
      // 将输入框删除
      document.body.removeChild(oInput)
      // 弹出复制成功信息
      this.$message.success('复制成功');
    },
    methodssend(item) {
      this.sendmessagelist('1', item);
      this.newbottom = '-300px';
      this.transition = 'all 0.5s';
      this.transitionflag = false;
      setTimeout(() => {
        if (parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height) > 500) {
          document.querySelector('.contentbox').scrollTop = parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height)
        }
      }, 200)
      this.contactlistone.push({
        createBy: localStorage.getItem('username'),
        sendContent: item,
        senderId: this.userId,
        imgurl: this.headImage,
        senderTime: this.getHour()

      })
    },
    dataALL(index) {
      let list = this.listType[index];
      this.listType.forEach(value => {
        value.color = '';
        value.back = ''
      })
      this.$set(this.listType, index, {
        back: "#ffeae4",
        color: "#ffa88b",
        createBy: list.createBy,
        createTime: list.createTime,
        delFlag:list.delFlag,
        flag: true,
        label:list.label,
        messageTypeId: list.messageTypeId,
        typeName:list.typeName,
        userId: list.userId,
        value: list.value,
      })
      let data = {
        messageTypeId: list.value,
        userId: localStorage.getItem('userId')
      }
      this.$api.confinementRoom.listchat(data).then(res => {
        console.log(res,'asdasd')
        this.tableDatalist = res.rows;
      })
      // this.listType[index].color = '#ffa88b';
      // this.listType[index].back = '#ffeae4'
    },
    quitrecord() {
      this.transitionflag = !this.transitionflag;
      if (this.transitionflag) {
        this.newbottom = '0px';
        this.transition = 'all 1s'
        let data = {
        messageTypeId:'',
        userId: localStorage.getItem('userId')
      }
      this.$api.confinementRoom.listchat(data).then(res => {
        this.tableDatalist = res.rows;
      })
      } else {
        this.newbottom = '-300px';
        this.transition = 'all 1s'
      }

    },
    quit() {
      this.quitflag = false;
    },
    edit(data) {
      this.newcustomLabelDialog = true;
      this.newtextarea = data.messageContent;
      this.Id = data.messageBodyId
      this.groupmessagelistmorel = data.messageTypeId

    },
    deletesel(data) {
      this.$confirm('确认删除快捷回复吗，是否继续？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.$api.confinementRoom.messageBodyIds(data.messageBodyId).then(res => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.getdata();
          }
        })
        console.log(res)
      }).catch(res => {
        console.log(res)
      })
    },
    appointmentAddition() {
      this.customLabelDialog = true;
      this.groupmessagelistmore = "";

    },
    newok() {
      if (this.newtextarea == '' || this.newtextarea == null) {
        this.$message.warning('请输入回复内容');
        return;
      }
      let data = {
        messageContent: this.newtextarea,
        messageTypeId: this.groupmessagelistmorel,
        messageBodyId: this.Id,
      }
      this.$api.confinementRoom.chatMessageBodyedit(data).then(res => {
        if (res.code == 200) {
          this.$message.success('修改成功');
          this.newcustomLabelDialog = false;
          this.getdata();
        }
      })
    },
    getdata() {
      let data = {
        messageContent: this.messageContent,
        messageTypeId: this.messageTypeId,
        userId: localStorage.getItem('userId')
      }
      this.$api.confinementRoom.listchat(data).then(res => {
        this.tableData = res.rows;
      })
    },
    ok() {
      if (this.textarea == '' || this.textarea == null) {
        this.$message.warning('请输入回复内容');
        return;
      }
      let data = {
        messageContent: this.textarea,
        messageTypeId: this.groupmessagelistmore,
        userId: localStorage.getItem('userId')
      }
      this.$api.confinementRoom.chatMessageBody(data).then(res => {
        if (res.code == 200) {
          this.$message.success('添加成功')
          this.customLabelDialog = false;
          this.getdata();
        }
      })
      this.tableData.push({
        name: this.textarea,
      })
      this.customLabelDialog = false;
    },
    currentChangenew(e) {
      this.groupNum = e;
      if (!this.payFlag) {
        this.getpayproject();
      } else {
        this.activityOrdersList();
      }
    },
    newtype(id) {
      if (id == 0) {
        return '待支付'

      }
      if (id == 1) {
        if (newid == '0') {
          return '待发货'
        } else {
          return '待核销'
        }


      }
      if (id == 2) {
        return '已发货'

      }
      if (id == 3) {
        return '已完成'

      }
      if (id == 4) {
        return '退款中'

      }
      if (id == 5) {
        return '已退款'
      }
      if (id == 6) {
        return '已取消'

      }
    },
    newgetHour() {
      let now = new Date();
      let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      let months = month >= 10 ? month : '0' + month
      let day = now.getDate(); //获取当前日(1-31)
      let days = day >= 10 ? day : '0' + day
      let hour = now.getHours(); //获取当前小时数(0-23)
      let hours = hour >= 10 ? hour : '0' + hour
      let minute = now.getMinutes(); //获取当前分钟数(0-59)
      let minutes = minute >= 10 ? minute : '0' + minute
      let second = now.getSeconds(); //获取当前秒数(0-59)
      let seconds = second >= 10 ? second : '0' + second
      let time = year + '-' + months + '-' + days
      return time;
    },
    handleClick2(val) {
      if (val.index == '1') {
        this.activityOrdersList();
        this.payFlag = true;
      } else {
        this.getpayproject();
        this.payFlag = false;
      }
    },
    activityOrdersList() {
      let data = {
        id: this.userIdflag,
        pageSize: 5,
        pageNum: this.groupNum
      }
      this.$api.confinementRoom.activityOrdersList(data).then(res => {
        console.log(res, 'dsadasd')
        this.totalnew = res.total;
        this.grouplist = res.rows;
      })
    },

    priview(item) {
      this.showproject = true;
      this.itemproject = item.sendContent;
      console.log(item)
    },
    sumadd(val) {
      if (val) {
        let str = 0;
        val.forEach(value => {
          str += Number(value.virtualSales)
        })
        return str;
      }
    },
    isFlag(item, index) {
      if (index !== 0) {
        // console.log(item)
        if (this.getminutesl(this.contactlistone[index].senderTime, this.contactlistone[index - 1].senderTime) > 2) {
          return true
        }
      }


    },
    getminutesl(timestr, endtime) {
      let minute = '';
      var d1 = new Date(endtime); //已知时间戳
      var d2 = new Date(timestr); //当前时间戳
      minute = (parseInt(d2 - d1) / 1000 / 60)

      return minute
    },
    nesTime(item) {
      let newitem = item.split(' ')[1]
      let newitems = (newitem + '').split(':')
      return newitems[0] + ':' + newitems[1]
    },
    getlistgk() {
      this.Backgroun = '#eee';
      this.Color = "black";
      this.Backgrouns = 'black';
      this.Colors = "#fff";
      this.getcustomlist();
      this.getformlist = true
      this.quitflag = true;
      setTimeout(function () {
        let len = document.querySelectorAll('.w-e-menu');
        for (let i = 0; i < 11; i++) {
          len[i].style.display = 'none'
        }
        len[11].style.visibility = 'hidden';
        len[12].style.visibility = 'hidden';
        len[14].style.visibility = 'hidden';
        len[15].style.visibility = 'hidden';
      }, 500)


    },
    getlistemp() {
      this.Backgroun = 'black';
      this.Color = "#fff";
      this.Backgrouns = '#eee';
      this.Colors = "black";
      this.getemplist();
      this.getformlist = false;
      this.quitflag = true;
      setTimeout(function () {
        let len = document.querySelectorAll('.w-e-menu');
        for (let i = 0; i < 11; i++) {
          len[i].style.display = 'none'
        }
        len[11].style.visibility = 'hidden';
        len[12].style.visibility = 'hidden';
        len[14].style.visibility = 'hidden';
        len[15].style.visibility = 'hidden';
      }, 500)
    },
    currentChange(e) {
      this.pageNum = e;
      if (this.getformlist) {
        this.getcustomlist();
      } else {
        this.getemplist();
      }

    },
    //获取员工聊天列表
    getemplist() {
      const query = {
        // userId: this.userId,
        deptId: this.deptId,
        pageSize: 10,
        pageNum: this.pageNum,
      }
      this.$api.confinementRoom.getCustomerInfoByDeptIdeo(query).then(res => {
        // console.log(res.rows,'kkkkk')
        res.rows.forEach(value => {
          if (value.headImage == undefined || value.headImage == '') {
            value.imgurl = this.headImage
          } else {
            value.imgurl = serverPath + value.headImage
          }
        })
        this.datalist = res.rows;
        this.total = res.total;
        this.$api.customerCmt.getInfoById(this.datalist[0].id).then(res => {
          this.customdata = res.data
        })
      })

    },
    // 获取聊天列表
    getcustomlist() {
      const query = {
        // userId: this.userId,
        deptId: this.deptId,
        pageSize: 10,
        pageNum: this.pageNum,
      }
      this.$api.confinementRoom.getCustomerInfoByDeptId(query).then(res => {
        // console.log(res.rows,'kkkkk')
        res.rows.forEach(value => {
          value.online = '0';
          if (value.headImage == undefined || value.headImage == '') {
            value.imgurl = this.headImage
          } else {
            value.imgurl = serverPath + value.headImage
          }
        })
        let arr = []
        if (this.onlinelist.length > 0) {
          this.onlinelist.forEach(value => {
            res.rows.forEach((newvalue, index) => {
              if (newvalue.id == value) {
                newvalue.online = '1'
                arr.push(newvalue)
                res.rows.splice(index, 1)
              }
            })
          })
          let newlist = [...arr, ...res.rows]
          this.datalist = newlist;
        } else {
          this.datalist = res.rows;
        }

        if (res.rows.length > 0) {
          this.userIdflag = this.datalist[0].id
        }
        if (this.datalist[0].online == '1') {
          this.ifOrangeflag = true;
          if (this.datalist[0].headImage !== "" || this.datalist.headImage !== undefined) {
            this.RightImg = serverPath + this.datalist[0].headImage
          } else {
            this.RightImg = this.rightheadImage
          }
        } else {
          this.RightImg = this.rightheadImage
        }
        this.total = res.total;
        this.getfather(this.datalist[0].id)
        this.$api.customerCmt.getInfoById(this.datalist[0].id).then(res => {
          this.customdata = res.data
        })
      })

    },
    getfathers(id) {
      const query = {
        chatType: "2",
        deptId: this.deptId,
        recipientId: id,
        senderId: localStorage.getItem('userId'),
        pageNum: this.pageNumrecode,
        pageSize: 100,
      }
      this.$api.confinementRoom.chatHistoryInfoList(query).then(res => {
        // console.log(res.rows,'kkkkk')
        res.rows.forEach(item => {
          if (item.sendType == 3) {
            item.sendContent = JSON.parse(item.sendContent)
          }
          if (value.headImage == undefined) {
            value.imgurl = this.headImage;
          } else {
            value.imgurl = serverPath + value.headImage
          }
        })
        this.contactlistone = [...res.rows.reverse(), ...this.contactlistone]
      })
    },
    // 获取聊天内容
    getfather(id) {
      this.contactlistone = [];
      const query = {
        chatType: "2",
        deptId: this.deptId,
        recipientId: id,
        senderId: localStorage.getItem('userId'),
        // senderId: id,
        pageNum: this.pageNumrecode,
        pageSize: 100,
      }
      this.$api.confinementRoom.chatHistoryInfoList(query).then(res => {
        // console.log(res.rows,'kkkkk')

        res.rows.forEach(item => {
          if (item.sendType == 3) {
            item.sendContent = JSON.parse(item.sendContent)
          }
          if (item.headImage == undefined) {
            item.imgurl = this.headImage;
          } else {
            item.imgurl = serverPath + item.headImage
          }
        })
        this.contactlistone = res.rows.reverse()
        setTimeout(() => {
          if (parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height) > 500) {
            document.querySelector('.contentbox').scrollTop = parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height)
          }
        }, 200)
      })
    },
    senditem(item) {
      this.sendmessagelist(3, JSON.stringify(item))
      this.contactlistone.push({
        name: localStorage.getItem('username'),
        imgurl: this.headImage,
        senderId: this.userId,
        senderTime: this.getHour(),
        sendContent: `<div class="product" style="display: flex" v-for="item in listproject">
                <div><img src="${item.imgurl}" style="width: 67px;margin: 10px 0px;height: 67px;"></div>
                <div class="project">
                  <div style="margin-left:20px;margin-top:20px">${item.projectName}</div>
                  <div style="margin-left:20px;margin-top:10px"><span>价格￥${item.productSpecInfo[0].sellingPrice}</span><span style="margin-left: 20px;font-size: 13px;color: #979797;">规格：${item.productSpecInfo[0].specs}</span>
                  </div>
                </div>
              </div>`
      })
      setTimeout(function () {
        if (parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height) > 500) {
          document.querySelector('.contentbox').scrollTop = parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height)
        }
      }, 500)
      // this.listedit = '';

    },
    getprojectlist(index) {
      this.$api.confinementRoom.productInfo({
        deptId: this.deptId,
        productType: index
      }).then(res => {
        res.rows.forEach(value => {
          value.imgurl = serverPath + value.productPhoto[0].photoAddr
        })
        this.listproject = res.rows;
      })
    },
    catchData(e) {
      this.listedit = e;
      // if(this.listedit=='<p><br/></p>'){
      //   this.listedit=''
      // }
    },
    selectemoji(item) {
      this.emojiFlag = false;
      // console.log(item,this.listedit,'itemitem')
      this.listedit += item;
    },
    showemoji() {
      this.emojiFlag = !this.emojiFlag
      // this.show = !this.show;
      // this.sendAlls = false;
    },
    // selectEmoji() {
    //
    // },
    sendmessagelist(type, content) {
      let data = {
        chatType: "2",
        deptId: this.deptId,
        recipientId: this.userIdflag,
        senderId: localStorage.getItem('userId'),
        sendType: type,
        senderTime: this.getHour(),
        unread: '1',
        sendContent: content
      }
      this.$api.confinementRoom.sendmessge(data).then(res => {

      })
    },
    getHour() {
      let now = new Date();
      let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
      let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      let months = month >= 10 ? month : '0' + month
      let day = now.getDate(); //获取当前日(1-31)
      let days = day >= 10 ? day : '0' + day
      let hour = now.getHours(); //获取当前小时数(0-23)
      let hours = hour >= 10 ? hour : '0' + hour
      let minute = now.getMinutes(); //获取当前分钟数(0-59)
      let minutes = minute >= 10 ? minute : '0' + minute
      let second = now.getSeconds(); //获取当前秒数(0-59)
      let seconds = second >= 10 ? second : '0' + second
      let time = year + '-' + months + '-' + days + ' ' + hours + ':' + minutes + ':' + seconds
      return time;
    },
    send() {
      if (this.listedit == '') {
        this.$message.warning('请输入内容后进行发送');
        return;
      }
      // //说明是有图片的
      if (this.listedit.includes(serverPath)) {
        this.sendmessagelist('2', this.listedit)
        localStorage.setItem('isPhoto', true)
      }
      //说明是纯文字和表情
      else {
        this.sendmessagelist('1', this.listedit)
      }

      this.contactlistone.push({
        createBy: localStorage.getItem('username'),
        sendContent: this.listedit,
        senderId: this.userId,
        imgurl: this.headImage,
        senderTime: this.getHour()


      })

      setTimeout(function () {
        if (parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height) > 500) {
          document.querySelector('.contentbox').scrollTop = parseInt(window.getComputedStyle(document.querySelector('.overfloemessage'), this).height)
        }
      }, 500)
      this.content = '';
      this.listedit = ''
      console.log(this.content, 'vvv', this.listedit)
    },
    //编辑器的内容赋值
    // catchData(content) {
    //   let currentRange = window.getSelection().getRangeAt(0);
    //   this.rangenum = currentRange;
    //   // this.formList.content = content;
    //   this.queryContent = content;
    // },
    handleClick(val) {
      if (val.index == 1) {
        this.listflagproject = true;
        this.getprojectlist('2')
      } else {
        this.listflagproject = false;
        this.listflagprojects = false;
      }
    },
    handleClick1(val) {
      if (val.index == 0) {
        this.listflagprojects = true;
        this.selectprojectIndex = '2'
        this.getprojectlist('2')
      } else {
        this.selectprojectIndex = '1'
        this.getprojectlist('1')
      }
    },
    changeValue() {
      this.xflag = !this.xflag;
      if (!this.xflag) {
        this.getpayproject()
      }
    },
    getpayproject() {
      let data = {
        deptId: this.deptId,
        purchaser: this.userIdflag,
        pageSize: 5,
        pageNum: this.groupNum

      }
      this.$api.confinementRoom.onlineOrderInfo(data).then(res => {
        res.rows.forEach(value => {
          value.imgurl = serverPath + value.productPhoto[0].photoAddr;
        })
        this.totalnew = res.total;
        this.listpay = res.rows;
      })
    },
    clickList(val, index) {
      this.addcolor = index;
      this.Index = index;
      this.listtitle = this.datalist[index].title;
      if (this.datalist[index].online == '1') {
        this.ifOrangeflag = true
      } else {
        this.ifOrangeflag = false;
      }
      const id = val.id
      this.userId = localStorage.getItem('userId');
      this.userIdflag = id;
      this.Topflag = false;
      this.$api.customerCmt.getInfoById(id).then(res => {
        this.customdata = res.data
      })
      this.getfather(id);
      this.pageNumrecode = 1;
      this.getpayproject();
      if (val.headImage !== "" && val.headImage !== undefined) {
        this.RightImg = serverPath + val.headImage
      } else {
        this.RightImg = this.rightheadImage
      }
    }
    //

  }
}
</script>

<style scoped lang="scss">
::v-deep .tabledata th {
  padding: 5px !important
}

::v-deep .tabledata tr td {
  padding: 0px !important;
  height: 20px !important;
}

::v-deep .tabledata tr {
  padding: 0px !important
}

.allcolor {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.dialogk {
  position: absolute;
  width: 100%;
  height: 300px;
  background-color: #fff;
  z-index: 10000;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.labelproject {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
}

.Emoji {
  width: 400px;
  height: 250px;
  position: absolute;
  z-index: 200000;
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.message {
  position: absolute;
  right: 8px;
  bottom: 12px;


}

.circle {
  position: absolute;
  background-color: red;
  border-radius: 50%;
  left: 3px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0 4px;
}

.content {
  display: flex;
  width: 100%;
  height: 100%;
  position: fixed;
  margin-top: 8px;

  .box1 {
    width: 4%;
    display: flex;
    flex-direction: column;
    background: #1a1c21;
    color: #fff;
    text-align: center;
    font-size: 11px;
    cursor: pointer;

    div {
      // margin: 10px;
      margin-top: 10px;
    }

    .tip {
      line-height: 20px;
      padding: 10px 0px;
    }
  }

  .box2 {
    width: 16%;
    //padding: 10px;
    font-size: 14px;
    background: #fff;

    .text {
      border-bottom: 1px solid #ccc;

      .text1 {
        // color: #E6A23C;
        // border-bottom: 2px solid #E6A23C;
        // padding-bottom: 10px;
        height:30px;
        display:inline-block;width:120px;text-align:center;
        line-height:30px
      }
    }

    .store {
      margin: 10px 10px;
    }

    .listcolor {
      display: flex;
      padding: 12px 0px;
      cursor: pointer;
      background: #e9e9e9;
    }

    .list {
      display: flex;
      padding: 12px 10px;
      cursor: pointer;

      img {
        margin-top: 9px;
      }

      .title {
        width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cont {
        width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #939393;
        margin-top: 4px;
      }

      .time {
        font-size: 12px;
        color: #bdbbbb;
        ;
      }

    }
  }

  .box3 {
    width: 70%;

    .title {
      text-align: center;
      padding: 10px;
    }

    .contentbox {
      height: 450px;
      overflow-y: scroll;

      .neurong {
        // width: 300px;
        max-width: 300px;
        word-break: break-all;
        background: #fff;
        padding: 5px;
        border-radius: 3px;
        font-size: 14px;
        margin-top: 5px;
      }
    }

    .box {
      height: 30%;
      border-top: 1px solid #ccc;

      .butt {
        font-size: 14px;
        padding: 3px 12px;
        background: #62a1f1;
        color: #fff;
        border-radius: 32px;
        cursor: pointer;
      }
    }
  }

  .box4 {
    width: 16%;
    background: #fff;
    padding: 10px 20px;

    .costomer {
      display: flex;

      img {
        margin-top: 10px;
      }

      .title1 {
        font-size: 12px;
        margin-top: 5px;
      }

      .cont1 {
        color: orange;
        margin-top: 4px;
        font-size: 12px;
      }

      .butt {
        font-size: 13px;
        color: #ff8f00;
        cursor: pointer;

        img {
          width: 20px;
          margin-right: 10px;
          vertical-align: sub;
        }
      }
    }

    ;

    .basic {
      font-size: 14px;
      line-height: 40px;
    }



    .product {
      border-bottom: 1px solid #ebebeb;
      padding: 0px 10px;
    }
  }
}

.project {
  line-height: 28px;
  margin-left: 10px;
  font-size: 15px;
  font-size: 12px;
}

::v-deep .w-e-text-container {
  overflow: hidden;
  height: 63% !important;
  border: none !important;
  background-color: #f7f7f7 !important;
  width: 90%;

}

::v-deep .w-e-toolbar {
  background-color: #f7f7f7 !important;
  border: none !important;

  border-top: 1px solid #ccc !important;

}

.bottomemoji {
  width: 750rpx;
  height: 300rpx;
  margin-top: 10rpx;
  background-color: #fff;

  .emojichildren {
    height: 260rpx;
    overflow-y: scroll;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;

    .childrens {
      width: 50rpx;
      height: 50rpx;
      margin-left: 30rpx;
      margin-bottom: 10rpx;
    }
  }
}
</style>