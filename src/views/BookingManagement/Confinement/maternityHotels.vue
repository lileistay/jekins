<template>
  <div class="headertable">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!---------------- 全部  --------------->
      <el-tab-pane label="全部" name="firs">
        <div class="header">
          <slideSearch :options="options" :style="{ height: height }">
            <div slot="btnBar">
              <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="getData" @keydown.enter.native="getData">查询
              </el-button>
            </div>
            <div class="right">
              <div class="titmed">
                <span class="color-block-default" /> 已入住：{{ checkedIn }}
                <!--<span class="color-block-success" /> 已预约：{{ appointment }}-->
                <span class="color-block-free" /> 空闲：{{ free }}
                <span /> 入住率：{{ occupancy }}%
              </div>
              <!--房间-->
              <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextMenu">
                <li v-if="showCheck" @click="customerRoom()">入住</li>
                <li v-if="showOther" @click="swipeCard()">划卡</li>
                <li v-if="showOther" @click="editCard()">修改</li>
                <!--<li v-if="showOther" @click="continued()">续住</li>-->
                <!--<li v-if="showOther" @click="exchangeHouses()">换房</li>-->
                <li v-if="showOther" @click="pauseDeduction()" v-has-permi="['share:roomInfo:roomInfoList:pauseDeduction']">{{ roomForm.pauseDeduction === '0' ? '暂停划扣' : '开始划扣' }}
                </li>
                <li v-if="showOther" @click="assist()" v-has-permi="['share:roomInfo:roomInfoList:assist']">开辅助治疗</li>
                <li v-if="showOther" @click="checker()" v-has-permi="['share:roomInfo:roomInfoList:bill']">检验开单</li>
                <li v-if="showOther" @click="nurmalchecker()" v-has-permi="['share:roomInfo:roomInfoList:normal']">正常开单</li>
                <li v-if="showOther" @click="radiationBilling()"  v-has-permi="['share:roomInfo:roomInfoList:radiation']">放射开单</li>
                <li v-if="showOther" @click="exchangeprinthispital" v-has-permi="['share:roomInfo:roomInfoList:hispital']">交住院押金</li>
                <li v-if="showOther" @click="delay" v-has-permi="['share:roomInfo:roomInfoList:delay']">延期续住</li>
                <li v-if="showOther" @click="checkOut()" v-has-permi="['share:roomInfo:roomInfoList:checkOut']">{{ roomForm.checkStatus === '1' ? '退预约' : '退房结算' }}</li>
                <li v-if="showOther" @click="exchange" v-has-permi="['share:roomInfo:roomInfoList:exchange']">换房</li>
                <li v-if="showOther" @click="cancleExchange" v-has-permi="['share:roomInfo:roomInfoList:canclehispital']">取消住院</li>
                <li v-if="showOther" @click="exchangeprint" >打印清单</li>
                <li @click="cancel">取消</li>
              </ul>
              <div style="margin: 0 10px">
                <el-card v-for="(item, index) in roomlist" :key="index" :class="roomCardClass(item)">
                  <div slot="header" :class="headerClass(item)" @contextmenu.prevent="openMenu($event, item)">
                    <div class="header" style="display: flex;align-items: center;position: relative">
                      <div class="room" @click="information($event, item)" >
                        <div class="header" >
                          <div style="width: 20%;">
                            <img v-if="item.checkStatus === '2'" src="../../../assets/images/room1.png" width="18"
                              height="19">
                            <!--                            <img v-if="item.checkStatus === '1'" src="../../../assets/images/room2.png" width="18" height="19">-->
                            <img v-if="item.checkStatus === '0' || item.checkStatus === '1'"
                              src="../../../assets/images/room3.png" width="17" height="18">
                          </div>
                          <div style="width: 76%; padding-top: 2px">
                            {{ item.roomType }}&nbsp;{{ item.roomNumber }}
                          </div>

                        </div>

                      </div>
                      <span style="font-size: 12px;margin-top: 3px;color: #ffffff;position: absolute;margin-left: 130px">住院押金：{{ item.deposit }}</span>
                      <div v-if="item.checkStatus === '2'" class="horn">
                        <div class="ticks">
                          <img class="imgtick" src="../../../assets/images/tick.png" width="18" height="19">
                        </div>
                      </div>
                      <!--                      <div v-if="item.checkStatus === '1'" class="endhorn">-->
                      <!--                        <div class="ticks">-->
                      <!--                          <img class="imgtick" src="../../../assets/images/surface.png" width="18" height="19">-->
                      <!--                        </div>-->
                      <!--                      </div>-->
                      <div v-if="item.checkStatus === '0' || item.checkStatus === '1'" class="nothorn">
                        <div class="ticks">
                          <!-- <img class="imgtick" src="../../../assets/images/empty.png" width="18" height="19">-->
                        </div>
                      </div>
                    </div>
                    <div v-if="item.checkStatus === '2'" class="header mation">
                      <div style="margin-left: 15px">
                        <p class="titme"><i class="el-icon-user-solid" />&nbsp;{{ item.customerName }}</p>
                        <div class="header">
                          <div style="width: 20%"><img src="../../../assets/images/surface2.png" width="14" height="15">
                          </div>
                          <div style="font-size: 12px;color: #ffffff; margin-top: 2px">&nbsp;{{ item.customAge }}岁</div>
                        </div>
                      </div>
                      <div style="margin-right: 15px">
                        <p class="titme" style="margin-left: 25px">民族：{{ nationName(item.nation) }}</p>
                        <p class="titme">距离退房：{{ item.remainingDays }}天</p>
                      </div>
                    </div>
                    <div v-if="item.checkStatus === '1'" class="header mation">
                      <div style="margin-left: 15px">
                        <p class="titme"><i class="el-icon-user-solid" />&nbsp;{{ item.customerName }}</p>
                        <div class="header">
                          <div style="width: 20%"><img src="../../../assets/images/surface2.png" width="14" height="15">
                          </div>
                          <div style="font-size: 12px;color: #ffffff; margin-top: 2px; margin-left: -20px">&nbsp;{{
                            item.customAge }}岁</div>
                        </div>
                      </div>
                      <div style="margin-right: 15px">
                        <p class="titme" style="margin-left: 25px">民族：{{ nationName(item.nation) }}</p>
                        <p class="titme">&nbsp;</p>
                      </div>
                    </div>
                    <div v-if="item.checkStatus === '0'" class="header mation">
                      <div style="margin-left: 15px">
                        <p class="titme"><i class="el-icon-user-solid" />&nbsp;__________</p>
                        <div class="header">
                          <div style="width: 20%"><img src="../../../assets/images/surface2.png" width="14" height="15">
                          </div>
                          <div style="font-size: 12px;color: #ffffff; margin-top: 2px; margin-left: -20px">__________
                          </div>
                        </div>
                      </div>
                      <div style="margin-right: 15px">
                        <p class="titme" style="margin-left: 25px">民族：__________</p>
                        <p class="titme">距离退房：__________</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.checkStatus === '2'" class="header">
                    <div class="statrs">
                      <el-tooltip v-if="item.acName !== undefined && item.acName.length > 4" effect="dark"
                        :content="item.acName" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          现场咨询：{{ item.acName === undefined ? '' : item.acName.substring(0, 4) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme line" style="color: #333333">现场咨询：{{ item.acName }}</p>
                      <p class="titme line" style="color: #333333">状态：{{ roomStatus(item.checkStatus) }}</p>
                      <el-tooltip v-if="item.tabooRemarks !== undefined && item.tabooRemarks.length > 7" effect="dark"
                        :content="item.tabooRemarks" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          忌口：{{ item.tabooRemarks === undefined ? '' : item.tabooRemarks.substring(0, 7) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme line" style="color: #333333">
                        忌口：{{ item.tabooRemarks === undefined ? '' : item.tabooRemarks }}
                      </p>
                    </div>
                    <div class="statrs">
                      <el-tooltip v-if="item.maternityMatronName !== undefined && item.maternityMatronName.length > 4"
                        effect="dark" :content="item.maternityMatronName" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          责任月嫂：{{ item.maternityMatronName === undefined ? '' : item.maternityMatronName.substring(0, 4)
                          }}
                        </p>
                      </el-tooltip>

                      <p v-else class="titme line" style="color: #333333">责任月嫂：{{ item.maternityMatronName }}</p>
                      <el-tooltip v-if="item.maternityMatronName !== undefined && item.maternityMatronName.length > 4"
                        effect="dark" :content="item.maternityMatronName" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          责任护士：{{ item.maternityMatronName === undefined ? '' : item.nurseName.substring(0, 4) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme line" style="color: #333333">责任护士：{{ item.nurseName }}</p>
                      <el-tooltip v-if="item.chanKangShiName !== undefined && item.chanKangShiName.length > 4"
                        effect="dark" :content="item.chanKangShiName" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          产康师：{{ item.chanKangShiName === undefined ? '' : item.chanKangShiName.substring(0, 4) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme line" style="color: #333333">产康师：{{ item.chanKangShiName }}</p>
                    </div>
                  </div>
                  <div v-if="item.checkStatus === '1'" class="header">
                    <div class="statrs">
                      <el-tooltip v-if="item.acName !== undefined && item.acName.length > 4" effect="dark"
                        :content="item.acName" placement="bottom">
                        <p class="titme notLine" style="color: #333333">
                          现场咨询：{{ item.acName === undefined ? '' : item.acName.substring(0, 4) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme notLine" style="color: #333333">现场咨询：{{ item.acName }}</p>
                      <p class="titme notLine" style="color: #333333">状态：{{ roomStatus(item.checkStatus) }}</p>
                      <el-tooltip v-if="item.tabooRemarks !== undefined && item.tabooRemarks.length > 7" effect="dark"
                        :content="item.tabooRemarks" placement="bottom">
                        <p class="titme notLine" style="color: #333333">
                          忌口：{{ item.tabooRemarks === undefined ? '' : item.tabooRemarks.substring(0, 7) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme notLine" style="color: #333333">
                        忌口：{{ item.tabooRemarks === undefined ? '' : item.tabooRemarks }}
                      </p>
                    </div>
                    <div class="statrs">
                      <p class="titme notLine" style="color: #333333">责任月嫂：</p>
                      <p class="titme notLine" style="color: #333333">责任护士：</p>
                      <p class="titme notLine" style="color: #333333">产康师：</p>
                    </div>
                  </div>
                  <div v-if="item.checkStatus === '0'" class="header">
                    <div class="statrs">
                      <p class="titme notLine" style="color: #333333">现场咨询：</p>
                      <p class="titme notLine" style="color: #333333">状态：</p>
                      <p class="titme notLine" style="color: #333333">忌口：</p>
                    </div>
                    <div class="statrs">
                      <p class="titme notLine" style="color: #333333">责任月嫂：</p>
                      <p class="titme notLine" style="color: #333333">责任护士：</p>
                      <p class="titme notLine" style="color: #333333">产康师：</p>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </slideSearch>
        </div>
      </el-tab-pane>
      <!------------------楼层--------------------->
      <el-tab-pane v-for="item in list" :key="item.floorId" :label="item.floorNumber" :name="'room' + item.floorId">
        <div class="header">
          <slideSearch :options="options" :style="{ height: height }">
            <div slot="btnBar">
              <el-button size="mini" icon="el-icon-search" type="primary" plain @click.stop="getData">查询
              </el-button>
            </div>
            <div class="right">
              <div class="titmed">
                <span class="color-block-default" /> 已入住：{{ checkedIn }}
                <!--<span class="color-block-success" /> 已预约：{{ appointment }}-->
                <span class="color-block-free" /> 空闲：{{ free }}
                <span /> 入住率：{{ occupancy }}%
              </div>
              <!--房间-->
              <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextMenu">
                <li v-if="showCheck" @click="customerRoom()">入住</li>
                <li v-if="showOther" @click="swipeCard()">划卡</li>
<!--                <li v-if="showOther">暂停</li>-->
                <li v-if="showOther" @click="editCard()">修改</li>
                <!--<li v-if="showOther" @click="continued()">续住</li>-->
                <!--<li v-if="showOther" @click="exchangeHouses()">换房</li>-->
                <li v-if="showOther" @click="pauseDeduction()" v-has-permi="['share:roomInfo:roomInfoList:pauseDeduction']">{{ roomForm.pauseDeduction === '0' ? '暂停划扣' : '开始划扣' }}
                </li>
                <li v-if="showOther" @click="assist()" v-has-permi="['share:roomInfo:roomInfoList:assist']">开辅助治疗</li>
                <li v-if="showOther" @click="checker()" v-has-permi="['share:roomInfo:roomInfoList:bill']">检验开单</li>
                <li v-if="showOther" @click="radiationBilling()" >放射开单</li>
                <li v-if="showOther" @click="nurmalchecker()" v-has-permi="['share:roomInfo:roomInfoList:normal']">正常开单</li>
                <li v-if="showOther" @click="exchangeprinthispital" v-has-permi="['share:roomInfo:roomInfoList:hispital']">交住院押金</li>
                <li v-if="showOther" @click="delay" v-has-permi="['share:roomInfo:roomInfoList:delay']">延期续住</li>
                <li v-if="showOther" @click="checkOut()" v-has-permi="['share:roomInfo:roomInfoList:checkOut']">{{ roomForm.checkStatus === '1' ? '退预约' : '退房结算' }}</li>
                <li v-if="showOther" @click="exchange" v-has-permi="['share:roomInfo:roomInfoList:exchange']">换房</li>
                <li v-if="showOther" @click="cancleExchange" v-has-permi="['share:roomInfo:roomInfoList:canclehispital']">取消住院</li>
                <li v-if="showOther" @click="exchangeprint" >打印清单</li>
                <!--<li v-if="showOther" @click="continued()">续住</li>-->
                <!--<li v-if="showOther" @click="exchangeHouses()">换房</li>-->
<!--                <li v-if="showOther" @click="checkOut()" v-has-permi="['share:roomInfo:roomInfoList:checkOut']">{{ roomForm.checkStatus === '1' ? '退预约' : '退房' }}</li>-->
                <li @click="cancel">取消</li>
              </ul>
              <div style="margin: 0 10px">
                <el-card v-for="(item, index) in roomlist" :key="index" :class="roomCardClass(item)">
                  <div slot="header" :class="headerClass(item)" @contextmenu.prevent="openMenu($event, item)">
                    <div class="header">
                      <div class="room" @click="information($event, item)">
                        <div class="header">
                          <div style="width: 20%;">
                            <img v-if="item.checkStatus === '2'" src="../../../assets/images/room1.png" width="18"
                              height="19">
                            <!--                            <img v-if="item.checkStatus === '1'" src="../../../assets/images/room2.png" width="18" height="19">-->
                            <img v-if="item.checkStatus === '0' || item.checkStatus === '1'"
                              src="../../../assets/images/room3.png" width="17" height="18">
                          </div>
                          <div style="width: 76%; padding-top: 2px">
                            {{ item.roomType }}&nbsp;{{ item.roomNumber }}
                          </div>
                        </div>
                      </div>
                      <span style="font-size: 12px;margin-top: 3px;color: #ffffff;position: absolute;margin-left: 130px">住院押金：{{ item.deposit }}</span>
                      <div v-if="item.checkStatus === '2'" class="horn">
                        <div class="ticks">
                          <img class="imgtick" src="../../../assets/images/tick.png" width="18" height="19">
                        </div>
                      </div>
                      <!--                      <div v-if="item.checkStatus === '1'" class="endhorn">-->
                      <!--                        <div class="ticks">-->
                      <!--                          <img class="imgtick" src="../../../assets/images/surface.png" width="18" height="19">-->
                      <!--                        </div>-->
                      <!--                      </div>-->
                      <div v-if="item.checkStatus === '0' || item.checkStatus === '1'" class="nothorn">
                        <div class="ticks">
                          <!--                          <img class="imgtick" src="../../../assets/images/empty.png" width="18" height="19">-->
                        </div>
                      </div>
                    </div>
                    <div v-if="item.checkStatus === '2'" class="header mation">
                      <div style="margin-left: 15px">
                        <p class="titme"><i class="el-icon-user-solid" />&nbsp;{{ item.customerName }}</p>
                        <div class="header">
                          <div style="width: 20%"><img src="../../../assets/images/surface2.png" width="14" height="15">
                          </div>
                          <div style="font-size: 12px;color: #ffffff; margin-top: 2px">&nbsp;{{ item.customAge }}岁</div>
                        </div>
                      </div>
                      <div style="margin-right: 15px">
                        <p class="titme" style="margin-left: 25px">民族：{{ nationName(item.nation) }}</p>
                        <p class="titme">距离退房：{{ item.remainingDays }}天</p>
                      </div>
                    </div>
                    <div v-if="item.checkStatus === '1'" class="header mation">
                      <div style="margin-left: 15px">
                        <p class="titme"><i class="el-icon-user-solid" />&nbsp;{{ item.customerName }}</p>
                        <div class="header">
                          <div style="width: 20%"><img src="../../../assets/images/surface2.png" width="14" height="15">
                          </div>
                          <div style="font-size: 12px;color: #ffffff; margin-top: 2px; margin-left: -20px">&nbsp;{{
                            item.customAge }}岁</div>
                        </div>
                      </div>
                      <div style="margin-right: 15px">
                        <p class="titme" style="margin-left: 25px">民族：{{ nationName(item.nation) }}</p>
                        <p class="titme">&nbsp;</p>
                      </div>
                    </div>
                    <div v-if="item.checkStatus === '0'" class="header mation">
                      <div style="margin-left: 15px">
                        <p class="titme"><i class="el-icon-user-solid" />&nbsp;__________</p>
                        <div class="header">
                          <div style="width: 20%"><img src="../../../assets/images/surface2.png" width="14" height="15">
                          </div>
                          <div style="font-size: 12px;color: #ffffff; margin-top: 2px; margin-left: -20px">__________
                          </div>
                        </div>
                      </div>
                      <div style="margin-right: 15px">
                        <p class="titme" style="margin-left: 25px">民族：__________</p>
                        <p class="titme">距离退房：__________</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="item.checkStatus === '2'" class="header">
                    <div class="statrs">
                      <el-tooltip v-if="item.acName !== undefined && item.acName.length > 4" effect="dark"
                        :content="item.acName" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          现场咨询：{{ item.acName === undefined ? '' : item.acName.substring(0, 4) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme line" style="color: #333333">现场咨询：{{ item.acName }}</p>
                      <p class="titme line" style="color: #333333">状态：{{ roomStatus(item.checkStatus) }}</p>
                      <el-tooltip v-if="item.tabooRemarks !== undefined && item.tabooRemarks.length > 7" effect="dark"
                        :content="item.tabooRemarks" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          忌口：{{ item.tabooRemarks === undefined ? '' : item.tabooRemarks.substring(0, 7) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme line" style="color: #333333">
                        忌口：{{ item.tabooRemarks === undefined ? '' : item.tabooRemarks }}
                      </p>
                    </div>
                    <div class="statrs">
                      <el-tooltip v-if="item.maternityMatronName !== undefined && item.maternityMatronName.length > 4"
                        effect="dark" :content="item.maternityMatronName" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          责任月嫂：{{ item.maternityMatronName === undefined ? '' : item.maternityMatronName.substring(0, 4)
                          }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme line" style="color: #333333">责任月嫂：{{ item.maternityMatronName }}</p>
                      <el-tooltip v-if="item.maternityMatronName !== undefined && item.maternityMatronName.length > 4"
                        effect="dark" :content="item.maternityMatronName" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          责任护士：{{ item.maternityMatronName === undefined ? '' : item.nurseName.substring(0, 4) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme line" style="color: #333333">责任护士：{{ item.nurseName }}</p>
                      <el-tooltip v-if="item.chanKangShiName !== undefined && item.chanKangShiName.length > 4"
                        effect="dark" :content="item.chanKangShiName" placement="bottom">
                        <p class="titme line" style="color: #333333">
                          产康师：{{ item.chanKangShiName === undefined ? '' : item.chanKangShiName.substring(0, 4) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme line" style="color: #333333">产康师：{{ item.chanKangShiName }}</p>
                    </div>
                  </div>
                  <div v-if="item.checkStatus === '1'" class="header">
                    <div class="statrs">
                      <el-tooltip v-if="item.acName !== undefined && item.acName.length > 4" effect="dark"
                        :content="item.acName" placement="bottom">
                        <p class="titme notLine" style="color: #333333">
                          现场咨询：{{ item.acName === undefined ? '' : item.acName.substring(0, 4) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme notLine" style="color: #333333">现场咨询：{{ item.acName }}</p>
                      <p class="titme notLine" style="color: #333333">状态：{{ roomStatus(item.checkStatus) }}</p>
                      <el-tooltip v-if="item.tabooRemarks !== undefined && item.tabooRemarks.length > 7" effect="dark"
                        :content="item.tabooRemarks" placement="bottom">
                        <p class="titme notLine" style="color: #333333">
                          忌口：{{ item.tabooRemarks === undefined ? '' : item.tabooRemarks.substring(0, 7) }}
                        </p>
                      </el-tooltip>
                      <p v-else class="titme notLine" style="color: #333333">
                        忌口：{{ item.tabooRemarks === undefined ? '' : item.tabooRemarks }}
                      </p>
                    </div>
                    <div class="statrs">
                      <p class="titme notLine" style="color: #333333">责任月嫂：</p>
                      <p class="titme notLine" style="color: #333333">责任护士：</p>
                      <p class="titme notLine" style="color: #333333">产康师：</p>
                    </div>
                  </div>
                  <div v-if="item.checkStatus === '0'" class="header">
                    <div class="statrs">
                      <p class="titme notLine" style="color: #333333">现场咨询：</p>
                      <p class="titme notLine" style="color: #333333">状态：</p>
                      <p class="titme notLine" style="color: #333333">忌口：</p>
                    </div>
                    <div class="statrs">
                      <p class="titme notLine" style="color: #333333">责任月嫂：</p>
                      <p class="titme notLine" style="color: #333333">责任护士：</p>
                      <p class="titme notLine" style="color: #333333">产康师：</p>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </slideSearch>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--弹框-->
    <sgDialog title="顾客详细信息" size="560px" :dialog="dialogVisible" @handleClose="closeDialog">
      <div slot="out">
        <el-form ref="form" :model="form" size="mini" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名：">
                <span style="width: 140px;">{{ form.customerName }}</span>
              </el-form-item>
              <el-form-item label="民族：">
                <span style="width: 140px;">{{ nationName(form.nation) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄：">
                <span style="width: 140px;">{{ form.customAge }}岁</span>
              </el-form-item>
              <el-form-item label="预约/入住时间：">
                <span style="width: 140px;">{{ form.checkTime }}</span>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="饮食禁忌：">
                <span style="width: 400px;">{{ form.tabooRemarks === undefined ? '' : form.tabooRemarks }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sgDialog>
    <sgDialog title="顾客入住" size="85%" out-top="2%" :dialog="showDialog" @handleClose="closeRoomDialog">
      <div slot="out">
        <el-row>
          <el-col :span="14">
            <el-button size="mini" :class="{ bg: time == 3 }" @click="Arrived(0)">已预约顾客入住</el-button>
            <el-button size="mini" :class="{ bg: increase == 4 }" @click="notArrived(1)">未预约顾客入住</el-button>
            <span style="margin-left: 20px" v-if="time == 3">是否默认房间</span>
            <el-switch
              v-model="valueRoom"
              active-color="#13ce66"
              inactive-color="#ff4949" style="margin-left: 20px" v-if="time == 3">
            </el-switch>
            <el-card  style="height: 707px" v-if="number==0">
              <sg-table ref="table" :sg-ref="'multipleTable'" :table-data="customerData" :pagination="pagination"
                :columns="columns" index="序号" selection size="mini" max-height="606" @size-change="sizeChange"
                @current-change="change" @row-click="rowClick" @selection-change="handleSelectionChange" :row-class-name="rowClassName">
                <div slot="searchBar">
                  <el-form ref="searchForm" :model="searchBar" size="mini">
                    <el-row>
                      <el-col :span="5">
                        <el-form-item label="姓名" prop="customerName" label-width="45px">
                          <el-input v-model="searchBar.customerName" clearable placeholder="请输入姓名" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item label="卡号" prop="customCardNumber" label-width="45px">
                          <el-input v-model="searchBar.customCardNumber" clearable placeholder="请输入卡号"
                            style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item label="电话" prop="customPhone" label-width="45px">
                          <el-input v-model="searchBar.customPhone" clearable placeholder="请输入电话" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="预计入住时间" clearable prop="checkReservationTime" label-width="100px">
                          <el-date-picker v-model="searchBar.checkReservationTime" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%"
                            :clearable="false" :picker-options="pickerOptions" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="2" style="margin-left: 20px">
                        <el-form-item>
                          <el-button icon="el-icon-search" size="mini" type="primary" :disabled="btnDisabled"
                            @click.stop="getCustomerInfo()">搜索</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </sg-table>
            </el-card>
            <el-card  style="height: 707px" v-if="number==1">
              <sg-table ref="table" :sg-ref="'multipleTable'" :table-data="customerDatas" :pagination="pagination"
                :columns="columnss" index="序号" selection size="mini" max-height="606" @size-change="sizeChange"
                @current-change="change" @row-click="rowClick" @selection-change="handleSelectionChange" :row-class-name="rowClassNames">
                <div slot="searchBar">
                  <el-form ref="searchForm" :model="formNot" size="mini">
                    <el-row>
                      <el-col :span="5">
                        <el-form-item label="姓名" prop="customerName" label-width="45px">
                          <el-input v-model="formNot.customerName" clearable placeholder="请输入姓名" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item label="电话" prop="customPhone" label-width="45px">
                          <el-input v-model="formNot.customPhone" clearable placeholder="请输入电话" style="width: 100%" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item label="现场咨询" prop="aestheticConsultant" label-width="80px">
                          <el-select filterable v-model="formNot.aestheticConsultant" clearable label-width="45px"
                            placeholder="请选择现场咨询">
                            <el-option v-for="item in sysUserList" :key="item.value" :label="item.label"
                              :value="item.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2" style="margin-left: 20px">
                        <el-form-item>
                          <el-button icon="el-icon-search" size="mini" type="primary" :disabled="btnDisabled"
                            @click.stop="notgetCustomerInfo()">搜索</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </sg-table>
            </el-card>
          </el-col>
          <el-col :span="10" style="padding-left: 20px">
            <el-card style="height: 735px">
              <el-form ref="roomForm" :model="roomForm" :rules="roomFormRules" size="mini" label-width="110px">
                <span style="font-size: 15px; font-weight: 600; padding-left: 20px">月子房间信息</span>
                <el-row style="margin-top: 20px">
                  <el-col :span="12">
                    <el-form-item label="楼层">
                      <el-input v-model="roomForm.floorNumber" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="房间类型">
                      <el-input v-model="roomForm.roomType" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="房间编号">
                      <el-input v-model="roomForm.roomNumber" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="房间名称">
                      <el-input v-model="roomForm.roomName" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="默认天数">
                      <el-input v-model="roomForm.defaultDays" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="默认费用">
                      <el-input v-model="roomForm.defaultCharge" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <span style="font-size: 15px; font-weight: 600; padding-left: 20px">
                  客户信息
                  <span style="font-size: 14px;font-weight: 400;color: #1fa087">(点击左侧客户选择)</span>
                </span>
                <el-row style="margin-top: 20px">
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="customerName">
                      <el-input v-model="roomForm.customerName" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="电话" prop="customPhone">
                      <el-input v-model="roomForm.customPhone" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="卡号" prop="customCardNumber">
                      <el-input v-model="roomForm.customCardNumber" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="年龄" prop="customAge">
                      <el-input v-model="roomForm.customAge" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-show="roomForm.roomReservationId !== undefined">
                  <el-col :span="12">
                    <el-form-item label="预计入住时间" prop="checkReservationTime">
                      <el-input v-model="roomForm.checkReservationTime" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="预约天数" prop="roomDays">
                      <el-input v-model="roomForm.roomDays" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <span style="font-size: 15px; font-weight: 600; padding-left: 20px">入住信息</span>
                <el-row style="margin-top: 20px">
                  <el-col :span="12">
                    <el-form-item label="现场咨询" prop="aestheticConsultant">
                      <el-select filterable v-model="roomForm.aestheticConsultant" placeholder="请选择" style="width: 100%" :filter-method="may">
                        <el-option v-for="item in sysUserList" :key="item.userId" :label="item.nickName"
                          :value="item.userId" />

                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="责任护士" prop="nurse">
                      <el-select filterable v-model="roomForm.nurse" placeholder="请选择" style="width: 100%" :filter-method="mays">
                        <el-option v-for="item in zerennurse" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="责任月嫂" prop="maternityMatron">
                      <el-select filterable v-model="roomForm.maternityMatron" placeholder="请选择" style="width: 100%" :filter-method="newmay">
                        <el-option v-for="item in yuesao" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="产康师" prop="chanKangShi">
                      <el-select filterable v-model="roomForm.chanKangShi" placeholder="请选择" style="width: 100%" :filter-method="newmays">
                        <el-option v-for="item in chks" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="入住时间" prop="checkReservationTime">
                      <el-date-picker v-model="roomForm.checkReservationTime" format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd" type="date" placeholder="选择日期" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="入住天数" prop="roomDays">
                      <el-input-number v-model="roomForm.roomDays" disabled controls-position="right" :min="0"
                        style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="宝宝信息" prop="baby">
                      <el-date-picker v-model="roomForm.babyOutTime" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"
                        type="date" placeholder="选择日期" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="宝宝性别">
                      <el-radio-group v-model="roomForm.babysex">
                        <el-radio label="男" value="0" />
                        <el-radio label="女" value="1" />
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="客户禁忌" prop="remark">
                      <el-input v-model="roomForm.remark" size="mini" type="textarea" :rows="4" style="width: 99.5%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item>
                  <el-button type="primary" :loading="loadingSubmit" @click.stop="submitRoomForm">确定</el-button>
                  <!--                  <el-button type="primary" :loading="loadingSubmit" @click.stop="submitRoomFormBilling">确定并开单</el-button>-->
                  <el-button @click="closeRoomDialog">取消</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </sgDialog>
    <sgDialog title="顾客换房" size="85%" out-top="2%" :dialog="showChangeDialog" @handleClose="closeChangeDialog">
      <div slot="out">
        <el-row>
          <el-col :span="14">
            <el-card style="height: 735px">
              <sg-table ref="changeTable" :sg-ref="'multipleTable'" :table-data="roomData" :pagination="roomPagination"
                :columns="roomColumns" index="序号" selection size="mini" max-height="600" @size-change="changeSizeChange"
                @current-change="changeCurrentChange" @row-click="changeRowClick"
                @selection-change="handleChangeSelectionChange">
                <div slot="searchBar">
                  <div style="width: 100%;min-height: 50px;display: flex;flex-wrap: wrap;align-items: center" class="Topheight">
                       <div style="width: 280px;margin-bottom: 10px">
                          <span>房间名称：</span> <el-input v-model="changeRoom.roomName" clearable placeholder="房间名称" size="mini" style="width: 180px" />
                       </div>
                    <div style="width: 250px;margin-bottom: 10px">
                      <span>楼层：</span>
                      <el-select filterable v-model="changeRoom.floorId" clearable placeholder="请选择楼层" style="width: 180px;" size="mini">
                        <el-option v-for="item in floorList" :key="item.floorId" :label="item.floorNumber"
                                   :value="item.floorId" />
                      </el-select>
                    </div>
                    <div style="width: 260px;margin-bottom: 10px">
                      <span>房间类型：</span>
                      <el-select filterable v-model="changeRoom.roomTypeId" clearable placeholder="请选择房间类型" size="mini" style="width: 180px;margin-left: 4px" >
                        <el-option v-for="item in roomTypeList" :key="item.roomTypeId" :label="item.roomType"
                                   :value="item.roomTypeId" />
                      </el-select>
<!--                      <el-select filterable v-model="changeRoom.floorId" clearable placeholder="请选择楼层" style="width: 200px;" size="mini">-->
<!--                        <el-option v-for="item in floorList" :key="item.floorId" :label="item.floorNumber"-->
<!--                                   :value="item.floorId" />-->
<!--                      </el-select>-->
                    </div>
<!--                    <div style="width: 280px;">-->
<!--                      <span>房间类型：</span>-->
<!--                      <el-select filterable v-model="changeRoom.roomTypeId" clearable placeholder="请选择房间类型" size="mini" style="width: 200px;margin-left: 4px" >-->
<!--                        <el-option v-for="item in roomTypeList" :key="item.roomTypeId" :label="item.roomType"-->
<!--                                   :value="item.roomTypeId" />-->
<!--                      </el-select>-->
<!--                    </div>-->
                    <div style="width: 40px;margin-bottom: 10px">
                      <el-button icon="el-icon-search" type="primary" :disabled="btnDisabled"
                                 @click.stop="getRoomList()" size="mini" style="margin-left: 20px">搜索</el-button>
                      <!--                      <el-select filterable v-model="changeRoom.floorId" clearable placeholder="请选择楼层" style="width: 200px;" size="mini">-->
                      <!--                        <el-option v-for="item in floorList" :key="item.floorId" :label="item.floorNumber"-->
                      <!--                                   :value="item.floorId" />-->
                      <!--                      </el-select>-->
                    </div>
                  </div>
<!--                  <el-form ref="changeRoom" :model="changeRoom" :inline="true" size="mini" :show-message="false">-->
<!--                    <el-form-item label="房间名称" prop="roomName">-->
<!--                      <el-input v-model="changeRoom.roomName" clearable placeholder="房间名称" />-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="楼层" prop="floorId">-->
<!--                      <el-select filterable v-model="changeRoom.floorId" clearable placeholder="请选择楼层">-->
<!--                        <el-option v-for="item in floorList" :key="item.floorId" :label="item.floorNumber"-->
<!--                          :value="item.floorId" />-->
<!--                      </el-select>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="房间类型" prop="roomTypeId">-->
<!--                      <el-select filterable v-model="changeRoom.roomTypeId" clearable placeholder="请选择房间类型">-->
<!--                        <el-option v-for="item in roomTypeList" :key="item.roomTypeId" :label="item.roomType"-->
<!--                          :value="item.roomTypeId" />-->
<!--                      </el-select>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item>-->
<!--                      <el-button icon="el-icon-search" type="primary" :disabled="btnDisabled"-->
<!--                        @click.stop="getRoomList()">搜索</el-button>-->
<!--                    </el-form-item>-->
<!--                  </el-form>-->
                </div>
              </sg-table>
            </el-card>
          </el-col>
          <el-col :span="10" style="padding-left: 20px">
            <el-card style="height: 735px">
              <el-form ref="roomForm" :model="changeForm" :rules="changeFormRules" size="mini" label-width="110px">
                <span style="font-size: 15px; font-weight: 600; padding-left: 20px">
                  客户信息
                </span>
                <el-row style="margin-top: 20px">
                  <el-col :span="12">
                    <el-form-item label="姓名" prop="customerName">
                      <el-input v-model="changeForm.customerName" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="电话" prop="customPhone">
                      <el-input v-model="changeForm.customPhone" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="卡号" prop="customCardNumber">
                      <el-input v-model="changeForm.customCardNumber" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="年龄" prop="customAge">
                      <el-input v-model="changeForm.customAge" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="当前入住房间" prop="oldRoomName">
                      <el-input v-model="changeForm.oldRoomName" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="剩余天数" prop="roomDays">
                      <el-input v-model="changeForm.roomDays" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <span style="font-size: 15px; font-weight: 600; padding-left: 20px">
                  月子房间信息
                  <span style="font-size: 14px;font-weight: 400;color: #1fa087">(点击左侧房间选择)</span>
                </span>
                <el-row style="margin-top: 20px">
                  <el-col :span="12">
                    <el-form-item label="楼层" prop="floorNumber">
                      <el-input v-model="changeForm.floorNumber" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="房间类型" prop="roomType">
                      <el-input v-model="changeForm.roomType" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="房间编号" prop="roomNumber">
                      <el-input v-model="changeForm.roomNumber" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="房间名称" prop="roomName">
                      <el-input v-model="changeForm.roomName" disabled size="mini" style="width: 100%" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- <el-row>-->
                <!--   <el-col :span="12">-->
                <!--     <el-form-item label="默认天数">-->
                <!--       <el-input v-model="changeForm.defaultDays" disabled size="mini" style="width: 100%" />-->
                <!--     </el-form-item>-->
                <!--   </el-col>-->
                <!--   <el-col :span="12">-->
                <!--     <el-form-item label="默认费用">-->
                <!--       <el-input v-model="changeForm.defaultCharge" disabled size="mini" style="width: 100%" />-->
                <!--     </el-form-item>-->
                <!--   </el-col>-->
                <!-- </el-row>-->
                <el-form-item>
                  <div class="notbutt">
                    <div class="butt">
                      <el-button type="primary" :loading="loadingSubmit" @click.stop="submitChangeForm">确定</el-button>
                      <el-button @click="closeChangeDialog">取消</el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </sgDialog>
    <sgDialog title="顾客修改" size="20%" out-top="2%" :dialog="editChangeDialog" @handleClose="editcloseChangeDialog">
      <div slot="out">
        <div>责任月嫂： <el-select filterable v-model="zerenvalue" placeholder="请选择" style="margin-top: 10px;" size="mini">
            <el-option v-for="item in yuesao" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select></div>
        <div>责任护士： <el-select filterable v-model="zerendoctor" placeholder="请选择" style="margin-top: 10px;" size="mini">
            <el-option v-for="item in zerennurse" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select></div>
        <div>产康师： <el-select filterable v-model="obstetric" placeholder="请选择" style="margin-top: 10px;margin-left: 15px;" size="mini">
            <el-option v-for="item in chks" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select></div>
        <div
          style="width: 100%;height: 50px; position: relative;display: flex;align-items: center;justify-content: center;">
          <div style="position: absolute;width: 160px;height: 30px;">
            <el-button type="primary" @click.stop="editsubmitChangeForm" size="mini">确定</el-button>
            <el-button @click="editcloseChangeDialog" size="mini">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
    <vue-easy-print ref="orderDetailsPrintfy">
      <div style="position: relative">
        <div class="order_detail">
          <h1>{{newmessage}}费用结算清单</h1>
        </div>
        <div class="order_detail_basic" style="margin-top: 20px">
          <div  class="Width">
            姓名:{{ form.customerName }}
          </div>
          <div  class="Width">
            年龄:{{ form.customAge }}
          </div>
          <div  class="Width">
            性别:{{ form.customSex == '0' ? '男' : "女" }}
          </div>
        </div>
        <div class="order_detail_basic">
          <div class="Width">
            房号:{{ hosiptalData.bedNumber }}
          </div>
          <div  class="Width">
            住院天数:{{ hosiptalData.days }}天
          </div>
          <div  class="Width">
            医疗付款:{{ hosiptalData.fyzffs }}
          </div>
        </div>
        <div class="order_detail_basic" >
          <div class="Width">
            金额:{{ strlist }}
          </div>
          <div  class="Width">
            预交押金:{{ hosiptalData.deposit }}
          </div>
          <div  class="Width" >
            医生:{{ hosiptalData.doctorName }}
          </div>
        </div>
        <div class="order_detail_basic" style="justify-content: space-between">
          <div style="width: 50%">
            <span >入院时间:</span>
            {{ hosiptalData.hospitalTime }}
          </div>
          <div style="width: 45%">
            <span >入住时间:</span>
            {{ hosiptalData.hospitalTime }}
          </div>
        </div>

        <div >
          <div style="width:700px" class="tablist">
            <el-table
              :data="tableDataaccount"
              border
              :height="tableDataaccount.length==0?200:''"
            >
              <el-table-column
                prop="itemName"
                label="项目名称"
                align="center"
                width="100"


              >
              </el-table-column>
              <el-table-column
                prop="amount"
                label="数量"
                align="center"
                width="50"

              >
              </el-table-column>
              <el-table-column
                prop="materialSpec"
                label="规格"
                align="center"


              ></el-table-column>
              <el-table-column
                prop="doseUnit"
                label="单位"
                align="center"


              ></el-table-column>
              <el-table-column
                prop="unitPrice"
                label="单价"
                align="center"


              ></el-table-column>
              <el-table-column
                prop="discountAmount"
                label="优惠"
                align="center"


              />
              <el-table-column
                prop="pricingTime"
                label="审核时间"
                align="center"
                width="145"

              />
              <el-table-column
                prop="amountReceived"
                label="金额"
                align="center"
                width="80"


              >
              </el-table-column>
            </el-table>
          </div>

        </div>
        <div class="order_detail_basic" style="display: flex;justify-content: space-between">
          <div style="position: relative;width: 100%;display: flex;justify-content: space-between" >

            <div style="">
              <span>合计:<span style="margin-left:20px;"> {{ strlist }}</span></span>
            </div>
            <div>
              <span>时间: <span style="margin-left:20px;"> {{ timeFmt('YYYY-mm-dd HH:MM:SS', new Date()) }}</span></span>
            </div>
          </div>

        </div>
      </div>
    </vue-easy-print>
    <sgDialog title="修改天数" size="400px" out-top="2%" :dialog="delays" @handleClose="delays=false">
      <div slot="out">
        <el-form :model="ruleFormdely" :rules="rulesdely" ref="ruleFormdely" label-width="100px" class="demo-ruleForm">
          <el-form-item label="续住天数" prop="delayDays">
            <el-input-number v-model="ruleFormdely.delayDays" size="mini" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="续住备注" prop="notes">
            <el-input v-model="ruleFormdely.notes" type="textarea" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <div style="height:40px"></div>
        <div class=""
             style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="ok">确定</el-button>
            <el-button @click="delays=false" size="mini">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
    <sgDialog title="开单延期" size="900px" out-top="2%" :dialog="newdelay" @handleClose="newdelay=false">
      <div slot="out">
        <sg-table ref="table" :sg-ref="'multipleTable'" :table-data="customerDatasdely" :pagination="paginationdely"
                  :columns="columnss" index="序号" selection size="mini" max-height="606" @size-change="sizeChange"
                  @current-change="change" @row-click="rowClick" @selection-change="handleSelectionChange">
          <div slot="searchBar">
            <el-form ref="searchForm" :model="formNot" size="mini">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="姓名" prop="customerName" label-width="45px">
                    <el-input v-model="formNot.customerName" clearable placeholder="请输入姓名" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="电话" prop="customPhone" label-width="45px">
                    <el-input v-model="formNot.customPhone" clearable placeholder="请输入电话" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="现场咨询" prop="aestheticConsultant" label-width="80px">
                    <el-select filterable v-model="formNot.aestheticConsultant" clearable label-width="45px"
                               placeholder="请选择现场咨询">
                      <el-option v-for="item in sysUserList" :key="item.value" :label="item.label"
                                 :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="margin-left: 20px">
                  <el-form-item>
                    <el-button icon="el-icon-search" size="mini" type="primary" :disabled="btnDisabled"
                               @click.stop="notgetCustomerInfo()">搜索</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </sg-table>
        <div style="height: 50px"></div>
        <div class=""
             style="position: absolute;width: 100%;height: 60px;bottom: 0;display: flex;align-items: center;justify-content: center;">
          <div style="width: 160px;height: 40px;">
            <el-button type="primary" size="mini" @click="okdely">确定</el-button>
            <el-button @click="newdelay=false" size="mini">取消</el-button>
          </div>
        </div>
      </div>
    </sgDialog>
  </div>
</template>

<script>
import SgTable from '@/components/Table'
import sgDialog from '@/components/Dialog/index'
import slideSearch from '@/components/SlideSearchBar/index'
import moment from 'moment'
import { math } from '@/utils/math'
import PinyinMatch from "pinyin-match";
import vueEasyPrint from 'vue-easy-print'

export default {
  name: 'RoomAvailable',
  dicts: ['Room_status', 'nation_list'],
  components: { sgDialog, slideSearch, SgTable,vueEasyPrint },
  data() {
    return {
      newdelay:false,
      ruleFormdely:{
        delayDays:'',
        notes:'',
      },
      rulesdely:{
        delayDays:[
          { required: true, message: '请输入活动名称', trigger: 'blur' },

        ]
      },
      newmessage:"",
      delays:false,
      valueRoom:true,
      hosiptalData:"",
      strlist:"",
      tableDataaccount:[],
      departmentId: 0,
      roomReservationIdnews:0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      // 换房搜索
      changeRoom: {
        roomName: '',
        floorId: '',
        roomTypeId: ''
      },
      zerenvalue: "",
      zerendoctor: "",
      obstetric: "",

      editChangeDialog: false,//顾客修改
      time: 3, // 按钮样式
      increase: 0, // 按钮样式
      number: 0,
      checkedIn: 0,
      free: 0,
      appointment: 0,
      occupancy: 0,
      height: 0,
      changeForm: {
        id: 0,
        customerName: undefined,
        customPhone: undefined,
        customCardNumber: undefined,
        customAge: undefined,
        oldRoomId: undefined,
        oldRoomName: undefined,
        roomDays: undefined,
        waitId: undefined,
        roomId: undefined,
        floorNumber: undefined,
        roomType: undefined,
        roomNumber: undefined,
        roomName: undefined,
        defaultDays: undefined,
        defaultCharge: undefined
      },
      changeFormRules: {
        floorNumber: [{ required: true, message: '请选择楼层', trigger: 'change' }],
        roomType: [{ required: true, message: '请选择房间类型', trigger: 'change' }],
        roomNumber: [{ required: true, message: '请选择房间编号', trigger: 'change' }],
        roomName: [{ required: true, message: '请选择房间名称', trigger: 'change' }]
      },
      roomSearchBar: {},
      roomData: [],
      roomColumns: [
        {
          lab: '房间名称',
          val: 'roomName'
        },
        {
          lab: '楼层',
          val: 'floorNumber'
        },
        {
          lab: '房间号',
          val: 'roomNumber'
        },
        {
          lab: '房间类型',
          val: 'roomType'
        }
        // {
        //   lab: '默认天数',
        //   val: 'defaultDays'
        // },
        // {
        //   lab: '默认费用',
        //   val: 'defaultCharge'
        // },
        // {
        //   lab: '备注',
        //   val: 'remark'
        // }
      ],
      roomPagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      changeSelectionData: [],
      rechargeableCard: [],
      showChangeDialog: false,
      loadingData: false,
      btnDisabled: false,
      checkDisabled: false,
      showDataDialog: false,
      loadingSubmit: false,
      customerData: [],
      columns: [
        {
          lab: '预约时间',
          val: 'checkReservationTime',
          width: 140
        },
        {
          lab: '姓名',
          val: 'customerName'
        },
        {
          lab: '客户卡号',
          val: 'customCardNumber',
          width: 165
        },
        {
          lab: '电话',
          val: 'customPhone'
        },
        {
          lab: '现场咨询',
          val: 'acName',
          width: 90
        },
        {
          lab: '科室',
          val: 'departmentName'
        }
      ],
      // 未预约
      columnss: [
        {
          lab: '姓名',
          val: 'customerName'
        },
        {
          lab: '产品',
          val: 'company'
        },
        {
          lab: '电话',
          val: 'customPhone'
        },
        {
          lab: '现场咨询',
          val: 'acName',

        },
        {
          lab: '项目',
          val: 'projectName'
        },
        {
          lab: '剩余次数',
          val: 'surplusQuantity'
        }
      ],
      // 未预约搜索
      formNot: {
        customPhone: '',
        customerName: '',
        aestheticConsultant: ''
      },
      // 未预约列表
      customerDatas: [],
      pagination: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      roomForm: {
        id: 0,
        roomId: 0,
        floorNumber: '',
        roomType: '',
        roomNumber: '',
        roomName: '',
        defaultDays: '',
        defaultCharge: '',
        customerName: '',
        customPhone: '',
        customCardNumber: '',
        customAge: '',
        checkStatus: '',
        aestheticConsultant: '',
        nurse: '',
        pauseDeduction: '',
        maternityMatron: '',
        chanKangShi: '',
        checkReservationTime: this.getTodayData(),
        roomDays: '0',
        checkOutTime: '',
        remark: '',
        deposit: 0,
        customerStatus: '',
        onlineUserId: 0,
        isSecondary: ''
      },
      roomFormRules: {
        customerName: [
          { required: true, message: '请在左侧选择客户', trigger: 'blur' }
        ],
        customPhone: [
          { required: true, message: '请在左侧选择客户', trigger: 'blur' }
        ],
        aestheticConsultant: [
          { required: true, message: '请选择现场咨询', trigger: 'change' }
        ],
        nurse: [
          { required: true, message: '请选择责任护士', trigger: 'change' }
        ],
        maternityMatron: [
          { required: true, message: '请选择责任月嫂', trigger: 'change' }
        ],
        chanKangShi: [
          { required: true, message: '请选择产康师', trigger: 'change' }
        ],
        checkReservationTime: [
          { required: true, message: '请选择入住时间', trigger: 'blur' }
        ],
        roomDays: [
          { required: true, message: '请输入入住天数', trigger: 'blur' }
        ]
      },
      searchBar: {
        customerName: '',
        customPhone: '',
        customCardNumber: '',
        checkReservationTime: this.getTodayData()
      },
      selectionData: [],
      sysUserList: [],
      newsysUserList:[],
      zerennurse: [],
      yuesao: [],
      chks: [],
      newzerennurse: [],
      newyuesao: [],
      newchks: [],
      showDialog: false,
      showBillDialog: false,
      activeName: 'firs',
      floorId: 0,
      roomType: [],
      list: [],
      nation: [],
      // 鼠标
      showOther: false,
      showCheck: true,
      visible: false,
      top: 0,
      left: 0,
      roomlist: [], // 房间
      dialogVisible: false, // 弹框
      form: {
        customerName: '',
        customSex: '',
        customAge: ''
      },
      // 查询列表
      options: {
        customerName: {
          type: 'input',
          label: '客户姓名'
        },
        customPhone: {
          type: 'input',
          label: '手机号'
        },
        // customCardNumber: {
        //   type: 'input',
        //   label: '卡号'
        // },
        nation: {
          type: 'select',
          label: '民族',
          clearable: true,
          options: []
        },
        checkStatus: {
          type: 'select',
          label: '房间状态',
          clearable: true,
          options: []
        }
      },
      paginationdely: {
        pageSize: 20, // 每页显示的条数
        total: 0, // 总条数
        pageNum: 1,
        show: true
      },
      todayData: '',
      customerDatasdely:[],
      floorList: [],
      roomTypeList: [],
      isAppointment: 1
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
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    deptId(val) {
      this.deptId = val
      this.getData()
      this.getUserList(val)
      this.getCustomerInfo()
      this.gettable()
    }
  },
  mounted() {
    const height = document.documentElement.clientHeight - 210
    if (height < 400) {
      this.height = 400 + 'px'
    } else {
      this.height = height + 'px'
    }
  },
  created() {
    this.deptId = this.$store.getters.departmentId
    this.departmentId = this.$route.query.departmentId
    this.getUserList(this.deptId)
    this.options.checkStatus.options = this.dict.type.Room_status
    this.options.nation.options = this.dict.type.nation_list;
    sessionStorage.setItem('iSnurse', 'false')
    this.gettable()
    this.getData()
    const this_ = this
    // 点击回车后事件
    document.onkeydown = function(e) {
      if (e.keyCode === 13) {
        this_.getData()
      }
    }
  },
  methods: {
    rowClassName({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    rowClassNames({row,rowIndex}){
      if(rowIndex%2==0){
        return 'normal-row'
      }
    },
    notgetCustomerInfodely() {
      var data = {
        deptId: this.deptId,
        customPhone: this.formNot.customPhone,
        customerName: this.formNot.customerName,
        aestheticConsultant: this.formNot.aestheticConsultant,
        id:this.form.id,
      }
      data = Object.assign(data, this.paginationdely)
      this.$api.billingList.roomBill(data).then(res => {
        if (res) {
          this.customerDatasdely = res.rows
          this.paginationdely.total = res.total
        }
      })
    },
    okdely(){
      if(this.selectionData.length==0||this.selectionData.length>1){
        this.$message.warning('请选择一条数据进行开单延期');
        return;
      }
      let data={
        delayDays:this.selectionData[0].roomDays,
        checkTime:this.form.checkTime,
        delayType:1,
        deptId:this.form.deptId,
        id:this.form.id,
        oldWaitId:this.form.waitId,
        waitId:this.selectionData[0].waitId,
        roomReservationId:this.form.roomReservationId,
        delayMoney:this.selectionData[0].totalPayment

      }
      // let data=Object.assign(this.form,this.selectionData[0])
      this.$api.confinementRoom.delay(data).then(res=>{
        if(res.code==200){
          this.$message.success(res.msg)
          this.newdelay=false;
          this.getData()
        }
      })

    },
    ok(){
      let data={
        delayDays:this.ruleFormdely.delayDays,
        checkTime:this.form.checkTime,
        delayType:0,
        deptId:this.form.deptId,
        id:this.form.id,
        waitId:this.form.waitId,
        roomReservationId:this.form.roomReservationId,
        notes:this.ruleFormdely.notes,
      }
    this.$api.confinementRoom.delay(data).then(res=>{
       if(res.code==200){
         this.$message.success(res.msg)
         this.delays=false;
         this.getData()
       }
    })
    },
    delay(){
      this.$confirm('请选择延期类型', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '修改天数',
        cancelButtonText: '开单延期',
        type: 'warning'
      }).then((res) => {
        this.delays=true;
        this.ruleFormdely.delayDays=1;
        this.ruleFormdely.notes='';
      }).catch(res=>{
        this.newdelay=true;
        this.notgetCustomerInfodely();
      })
    },
    nurmalchecker(){
      this.$api.modules.billingList.BillingManagementlist({jdxxId:this.form.jdxxId}).then(res => {
        if(res.code==200){
          const query={
            billing:JSON.stringify(res.rows[0])
          }
          sessionStorage.setItem('BillId',res.rows[0].id)
          sessionStorage.setItem('customerBillingitem',JSON.stringify(query))
          this.$router.push({path: 'customerBilling'})
        }

      })

    },
    //取消住院
    cancleExchange(){
      let data={
        roomReservationId:this.form.roomReservationId,
        waitId:this.form.waitId,
        jdxxId:this.form.jdxxId
      }
      this.$confirm('确认取消住院吗，是否继续？', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.$api.confinementRoom.exitTheRoom(data).then(res=>{
          if(res.code==200){

            this.$message.success('取消成功')
            this.getData();

          }
        })

      })

    },
    exchangeprinthispital(){
      this.$router.push({
        path: 'hospitalizationDeposit'
      })
      const query={
        content:JSON.stringify(this.form),
        id: this.form.id
      }
      sessionStorage.setItem('hospitalizationDeposititem',JSON.stringify(query))
    },
    exchangeprint(){
      let that=this;
      this.$api.finance.getCustomerWforservice({ jdxxId: this.form.jdxxId,checkStatus:'2' }).then(res => {
        if (res) {
          this.strlist=0;
          this.hosiptalData=res.data;
          this.tableDataaccount=res.rows;
          res.rows.forEach(value=>{
            this.strlist+=value.amountReceived
          })
          let str=document.querySelector('.el-dropdown-selfdefine').innerHTML;
          let newstr=str.split('<')[0]
          this.newmessage=newstr;
          setTimeout((function () {
            that.$refs.orderDetailsPrintfy.print();
          }), 300)

        }
      })
    },
    timeFmt(fmt, time) {
      if (!time) {
        return ''
      } else {
        if (!fmt) {
          fmt = 'YYYY-mm-dd HH:MM:SS'
        }
        let ret
        var date = new Date(time)
        const opt = {
          'Y+': date.getFullYear().toString(), // 年
          'm+': (date.getMonth() + 1).toString(), // 月
          'd+': date.getDate().toString(), // 日
          'H+': date.getHours().toString(), // 时
          'M+': date.getMinutes().toString(), // 分
          'S+': date.getSeconds().toString() // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        }
        for (const k in opt) {
          ret = new RegExp('(' + k + ')').exec(fmt)
          if (ret) {
            fmt = fmt.replace(
              ret[1],
              ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
            )
          }
        }
        return fmt
      }
    },
    mays(val){
      if (val) {
        this.zerennurse = this.newzerennurse.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.zerennurse = this.newzerennurse
      }
    },
    newmays(val){
      if (val) {
        this.chks = this.newchks.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.chks = this.newchks
      }
    },
    newmay(val){
      if (val) {
        this.yuesao = this.newyuesao.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.yuesao = this.newyuesao
      }
    },
    may(val){
      if (val) {
        this.sysUserList = this.newsysUserList.filter((item) => {
          if (item.label.toUpperCase().indexOf(val.toUpperCase()) !== -1) {
            return true
          }
          return PinyinMatch.match(item.label, val)
        })
      } else {
        this.sysUserList = this.newsysUserList
      }

  },
    //取消
    editcloseChangeDialog() {
      this.editChangeDialog=false;
    },
    //确定
    editsubmitChangeForm() {
//       maternity_matron 责任月嫂
// nurse 责任护士
// chan_kang_shi 产康师
// roomReservationId
      let data = {
        roomReservationId:this.form.roomReservationId,
        maternityMatron:this.zerenvalue,
        nurse:this.zerendoctor,
        chanKangShi:this.obstetric

        // this.zerenvalue,
        // this.zerendoctor,
        // this.obstetric,
      }
      this.$api.confinementRoom.roomReservationStatus(data).then(res => {
        if (res.code == 200) {
          this.$message.success('修改成功')
          this.getData();
          this.editChangeDialog = false

        }
      })

    },
    //修改信息
    editCard() {
      this.editChangeDialog = true;
      // res.data.forEach(item => {
      //       if (item.postCode == 'chks') {
      //         this.chks.push(item)
      //       }
      //     }) // 产康师
      //     res.data.forEach(item => {
      //       if (item.postCode == 'zerennurse') {
      //         this.zerennurse.push(item)
      //       }
      //     }) // 责任护士
      //     res.data.forEach(item => {
      //       if (item.postCode == 'yuesao') {
      //         this.yuesao.push(item)
      //       }
      //     }) // 月嫂
      // maternityMatronName
      // nurseName
      //                 chanKangShiName
      this.zerenvalue =this.form.maternityMatronName,
      this.zerendoctor = this.form.nurseName,
      this.obstetric = this.form.chanKangShiName;
      this.chks.forEach(value=>{
          if(value.label==this.form.chanKangShiName){
             this.obstetric=value.value
          }
      })
      this.zerennurse.forEach(value=>{
        console.log(value)
        if(value.label==this.form.nurseName){
             this.zerendoctor=value.value
          }
      })
      this.yuesao.forEach(value=>{
        if(value.label==this.form.maternityMatronName){
             this.zerenvalue=value.value
          }
      })

    },
    /**
     * @author Nevin
     * @date 2022/8/18
     * @Description: 获取房间类型
    */
    getRoomTypeList() {
      const data = {
        deptId: this.pagination.deptId,
        state: '0'
      }
      this.$api.confinementRoom.roomTypeInfoList(data).then(res => {
        if (res) {
          this.roomTypeList = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/8/18
     * @Description: 获取房间列表
    */
    getFloorList() {
      const data = {
        deptId: this.pagination.deptId,
        state: '0'
      }
      this.$api.confinementRoom.floorInfoList(data).then(res => {
        if (res) {
          this.floorList = res.rows
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/7/4
     * @Description: 房子卡片class
    */
    roomCardClass(item) {
      if (item.checkStatus === '2') {
        return 'card'
      }
      if (item.checkStatus === '0' || item.checkStatus === '1') {
        return 'noCard'
      }
    },
    /**
     * @author Nevin
     * @date 2022/7/4
     * @Description:
    */
    headerClass(item) {
      if (item.checkStatus === '2') {
        return 'cardHeader'
      }
      if (item.checkStatus === '0' || item.checkStatus === '1') {
        return 'notCardHeader'
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/13
     * @Description: 房间状态
    */
    roomStatus(str) {
      const obj = this.dict.type.Room_status.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    /**
     * @author Nevin
     * @date 2022/6/13
     * @Description: 民族
     */
    nationName(str) {
      const obj = this.dict.type.nation_list.find(item => item.value === str)
      return obj ? obj.label : ''
    },
    /**
     * @author Nevin
     * @date 2022/7/1
     * @Description: 获取房间搜索
    */
    getRoomList() {
      this.loadingData = true
      var data = {
        deptId: this.deptId,
        day: this.changeForm.roomDays,
        roomName: this.changeRoom.roomName,
        floorId: this.changeRoom.floorId,
        roomTypeId: this.changeRoom.roomTypeId,
        pageNum:this.roomPagination.pageNum,
        pageSize:this.roomPagination.pageSize
      }
      this.$api.confinementRoom.selectRoommodify(data).then(res => {
        if (res) {
          this.roomData = res.rows
          this.roomPagination.total = res.total
        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    /**
     * @author Nevin
     * @date 2022/7/11
     * @Description: 暂停划扣
    */
    pauseDeduction() {
      this.$api.billingList.updateRoomStart({
        'roomReservationId': this.roomForm.roomReservationId,
        'waitId': this.roomForm.waitId,
        'pauseDeduction': this.roomForm.pauseDeduction
      }).then(res => {
        if (res) {
          this.$message.success(res.msg)
          this.getData()
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/7/1
     * @Description: 换房提交
    */
    submitChangeForm() {
      this.$refs.roomForm.validate((valid) => {
        if (valid) {
          // this.loadingSubmit = true
          var data = {
            roomReservationId: this.roomForm.roomReservationId,
            roomId: this.changeSelectionData[0].roomId,
            day: this.form.remainingDays,
            pauseDeduction: '0'
          }
          this.$api.confinementRoom.insertRoommodify(data).then(res => {
            if (res) {
              this.$message({
                message: '换房成功',
                type: 'success'
              })
              this.getData()
              this.loadingSubmit = false
              this.showChangeDialog = false
            }
          })
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/22
     * @Description: 划卡
    */
    swipeCard() {
      if (this.roomForm.checkStatus !== '2') {
        this.$message.warning('这个房间还是空的，不能去划卡(●ˇ∀ˇ●)')
      } else {
        this.$router.push({ path: 'birthRegistrationconfinement', query: { departmentId: this.departmentId, id: this.roomForm.id } })
      }
    },
    // 开辅助治疗
    assist() {
      this.$router.push({ path: 'adjuvantBillingTherapy'})
      const query= {
        xFlag:1,jdxxId:this.roomForm.jdxxId
      }
      sessionStorage.setItem('adjuvantBillingTherapyitem',JSON.stringify(query))
    },
    // 开检验
    checker(){
      this.$router.push({path: 'inspectionBilling'})
      const query= {
        billing: JSON.stringify(this.roomForm)
      }
      sessionStorage.setItem('inspectionBillingitem',JSON.stringify(query))
    },
    // 放射开单
    radiationBilling() {
      this.$router.push({path: 'radiationBilling'})
      const query= {
        billing: JSON.stringify(this.roomForm)
      }
      sessionStorage.setItem('radiationBillingitem',JSON.stringify(query))
    },
    /**
     * @author Nevin
     * @date 2022/6/22
     * @Description: 续住
    */
    continued() {

    },
    /**
     * @author Nevin
     * @date 2022/6/22
     * @Description: 退房/退预约
    */
    checkOut() {
      if (this.roomForm.checkStatus === '1') {
        this.$confirm('真的要取消这个预约嘛＞﹏＜？', '警告', {
          confirmButtonText: '是的',
          cancelButtonText: '再想想',
          type: 'warning'
        }).then(async () => {
          this.$api.confinementRoom.editRoomReservation({
            roomReservationId: this.roomForm.roomReservationId,
            checkStatus: '4'
          }).then(res => {
            if (res) {
              this.getData()
              this.$message.success(res.msg)

            }
          })
        })
      } else if (this.roomForm.checkStatus === '2') {
        this.$confirm('真的要退房嘛＞﹏＜？', '警告', {
          confirmButtonText: '是的',
          cancelButtonText: '再想想',
          type: 'warning'
        }).then(async () => {
          this.submitCustomCard(this.roomForm)
          // this.$api.confinementRoom.editRoomReservation({
          //   roomReservationId: this.roomForm.roomReservationId,
          //   checkStatus: '3'
          // })
          //   .then(res => {
          //   if (res) {
          //     this.getData();
          //     this.submitCustomCard(this.roomForm)
          //     this.$message.success(res.msg)
          //   }
          // })
        })
      } else {
        this.$message.warning("这个房间没有入住/预约信息，不需要操作(●'◡'●)~")
      }
    },

    /**
     * @author wsj
     * @Description: 住院押金
     */
    submitCustomCard(e) {
      var data = {}
      if (e.deposit <= 0) {
        this.$api.confinementRoom.isCheckout(e.jdxxId).then(res => {
              if(res.code==200){
                data = {
                  // onlineUserId: this.roomlist.onlineUserId,
                  aestheticConsultant: e.aestheticConsultant,
                  customerRepresentative: e.customerRepresentative, // 客戶代表
                  deptId: this.deptId,
                  departmentId: this.departmentId,
                  dsingleUser: this.$store.getters.user.userId,
                  id: e.id,
                  jdxxId: e.jdxxId,
                  amountPayable: -e.deposit,
                  billType: '10',
                  billingRemarks: '住院出院',
                  totalExpenses: -e.deposit,
                  customerStatus: e.customerStatus, // 客户状态
                  onlineUserId: e.onlineUserId,
                  isSecondary: e.isSecondary,
                  roomReservationId: this.roomForm.roomReservationId
                }
                this.$api.billingList.addOrderInfo({
                  'orderInfo': data
                }).then(res => {
                  if (res.code==200) {
                    this.submitLoading = false
                    this.$api.confinementRoom.editRoomReservation({
                      roomReservationId: this.roomForm.roomReservationId,
                      checkStatus: '3'
                    })
                      .then(res => {
                        if (res) {
                          this.getData();
                          // this.submitCustomCard(this.roomForm)
                          this.$message.success(res.msg)
                        }
                      })
                  }
                })
              }
        })

      } else if(e.deposit > 0){
        this.$api.confinementRoom.isCheckout(e.jdxxId).then(res => {
           if(res.code==200){
             data = {
               'deptId': this.deptId, // 部门ID
               'id': e.id, // 部门ID
               'billType': '17', // 开单类型
               'departmentId': this.departmentId, // 科室ID
               'dsingleUser': this.$store.getters.user.userId, // 下单人
               'customerRepresentative': e.customerRepresentative, // 客戶代表
               // 'chargeSheetId': this.departmentId,
               'totalExpenses': e.deposit,
               'oldBillType': '10',
               'jdxxId': e.jdxxId,
               'amountPayable': e.deposit,
               'aestheticConsultant': e.aestheticConsultant,
               'customerStatus': e.customerStatus, // 客户状态
               'onlineUserId': e.onlineUserId,
               'isSecondary': e.isSecondary,
               'roomReservationId': this.roomForm.roomReservationId

               // 'orderNumber': this.data.orderNumber,
               // 'rechargeCardId': this.tableData[0].hospitalizationId,
               // 'secondRecommender': this.data.secondRecommender
             }
             this.$api.billingList.addOrderInfo({
               'orderInfo': data
             }).then(res => {
               if (res.code==200) {
                 this.submitLoading = false
                 this.$api.confinementRoom.editRoomReservation({
                   roomReservationId: this.roomForm.roomReservationId,
                   checkStatus: '3'
                 })
                   .then(res => {
                     if (res) {
                       this.getData();
                       // this.submitCustomCard(this.roomForm)
                       this.$message.success(res.msg)
                     }
                   })
               }
             })
           }

        })

      }

    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 顾客入住
    */
    customerRoom() {
      this.number=0;
      this.time=3;
      this.increase=5;
      if (this.roomForm.id !== 0) {
        if (this.roomForm.checkStatus === '2') {
          this.$message.warning('这个房间已经有人住啦(❁´◡`❁)！')
        } else if (this.roomForm.checkStatus === '1') {
          this.getCustomerInfo()
          this.showDialog = true
        } else {
          this.getCustomerInfo()
          this.Arrived(0)
          this.roomForm.id = 0
          this.roomForm.checkStatus = '1'
          this.roomForm.roomReservationId = undefined
          this.roomForm.customerName = undefined
          this.roomForm.customPhone = undefined
          this.roomForm.customCardNumber = undefined
          this.roomForm.customAge = undefined
          this.searchBar.checkReservationTime = this.getTodayData()
          this.roomForm.checkReservationTime = this.getTodayData()
          this.showDialog = true
        }
      } else {
        this.getCustomerInfo()
        this.showDialog = true
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 关闭开单弹窗
    */
    closeRoomDialog() {
      this.roomForm.customerName = ''
      this.roomForm.customPhone = ''
      this.roomForm.customCardNumber = ''
      this.roomForm.customAge = ''
      this.roomForm.checkStatus = ''
      this.roomForm.aestheticConsultant = ''
      this.roomForm.nurse = ''
      this.roomForm.maternityMatron = ''
      this.roomForm.chanKangShi = ''
      this.roomForm.checkReservationTime = this.getTodayData()
      this.roomForm.roomDays = ''
      this.roomForm.checkOutTime = ''
      this.roomForm.remark = ''
      this.searchBar = {
        customerName: '',
        customPhone: '',
        customCardNumber: ''
      }
      this.formNot.customerName = ''
      this.formNot.customPhone = ''
      this.formNot.aestheticConsultant = ''
      this.selectionData = []
      this.customerDatas = []
      this.showDialog = false
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 入住提交 弹框顾客入住
    */
    submitRoomForm() {
      // 获取当前时间 未预约顾客住院使用当前时间

      const yy = new Date().getFullYear()
      const mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
      const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      const today = yy + '-' + mm + '-' + dd
      // 表单校验
      this.$refs['roomForm'].validate(valid => {
        if (valid) {
          // 入住日期加入住天数 计算退房时间
          let date = new Date(this.roomForm.checkReservationTime) // 入住日期
          date = date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' + // 这里加1是因为getMonth()的返回值是为0~11
            date.getDate()
          date = Date.parse(new Date(date)) / 1000 // 转换成时间戳，返回值是ms，除1000后转化成秒
          date += math.multiply((86400), this.roomForm.roomDays) // 一天是86400秒 入住天数
          const newDate = new Date(parseInt(date) * 1000) // 把时间戳转换成日期
          const time = newDate.getFullYear() + '-' + // 计算的值
            (newDate.getMonth() + 1) + '-' +
            newDate.getDate()
          // 拿到数据 id
          this.sysUserList.forEach(res => {
            if (this.roomForm.aestheticConsultant === res.label) {
              this.roomForm.aestheticConsultant = res.value
            }
          })
          if (this.isAppointment === 1) {
            this.loadingSubmit = true
            var dataPost = {
              id: this.roomForm.id === undefined ? this.selectionData[0].id : this.roomForm.id,
              roomId: this.roomForm.roomId,
              roomReservationId: this.roomReservationIdnews,
              aestheticConsultant: this.roomForm.aestheticConsultant,
              chanKangShi: this.roomForm.chanKangShi,
              nurse: this.roomForm.nurse,
              maternityMatron: this.roomForm.maternityMatron,
              checkOutTime: time,
              checkStatus: '2',
              pauseDeduction: '0',
              departmenId: this.selectionData[0].departmenId,
              waitId: this.selectionData[0].waitId,
              jdxxId: this.selectionData[0].jdxxId,
              roomAmount: this.selectionData[0].totalPayment, // 金额
              remainingAmount: this.selectionData[0].totalPayment, // 金额
              subscribeTime: this.selectionData[0].checkReservationTime === undefined ? today : this.selectionData[0].checkReservationTime,
              checkTime: this.roomForm.checkReservationTime,
              roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remark: this.roomForm.remark,
              departmentId: this.roomForm.departmentId,
              deptId: this.selectionData[0].deptId,
              checkReservationTime:this.selectionData[0].checkReservationTime === undefined ? today : this.selectionData[0].checkReservationTime,
            }
            this.$api.confinementRoom.editRoomReservation(dataPost).then(res => {
              if (res) {
                this.getData()
                this.$message.success(res.msg)
                this.showDialog = false
                this.resetForm()
                this.Arrived()
                // 清空 顾客入住信息
                this.roomForm.customerName = ''
                this.roomForm.customPhone = ''
                this.roomForm.customCardNumber = ''
                this.roomForm.customAge = ''
                this.roomForm.checkStatus = ''
                this.roomForm.aestheticConsultant = ''
                this.roomForm.nurse = ''
                this.roomForm.maternityMatron = ''
                this.roomForm.chanKangShi = ''
                this.roomForm.checkReservationTime = this.getTodayData()
                this.roomForm.roomDays = ''
                this.roomForm.checkOutTime = ''
                this.roomForm.remark = ''
                this.searchBar = {
                  customerName: '',
                  customPhone: '',
                  customCardNumber: ''
                }
                this.formNot.customerName = ''
                this.formNot.customPhone = ''
                this.formNot.aestheticConsultant = ''
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          } else {
            this.loadingSubmit = true
            var dataput = {
              id: this.roomForm.id === undefined ? this.roomForm.id : this.selectionData[0].id,
              roomId: this.roomForm.roomId,
              roomReservationId:this.roomReservationIdnews,
              aestheticConsultant: this.roomForm.aestheticConsultant,
              chanKangShi: this.roomForm.chanKangShi,
              nurse: this.roomForm.nurse,
              maternityMatron: this.roomForm.maternityMatron,
              checkOutTime: time,
              checkStatus: '2',
              pauseDeduction: '0',
              totalAmount: this.roomForm.totalAmount,
              departmenId: this.selectionData[0].departmenId,
              waitId: this.selectionData[0].waitId,
              jdxxId: this.selectionData[0].jdxxId,
              roomAmount: this.roomForm.totalAmount, // 金额
              remainingAmount: this.roomForm.totalAmount, // 金额
              subscribeTime: this.selectionData[0].checkReservationTime === undefined ? today : this.selectionData[0].checkReservationTime,
              checkTime: this.roomForm.checkReservationTime,
              roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remark: this.roomForm.remark,
              departmentId: this.roomForm.departmentId,
              deptId: this.selectionData[0].deptId,
              checkReservationTime:this.selectionData[0].checkReservationTime === undefined ? today : this.selectionData[0].checkReservationTime,
            }
            this.$api.confinementRoom.addRoomReservation(dataput).then(res => {
              if (res) {
                this.getData()
                this.roomForm.checkReservationTime = ''
                this.$message.success(res.msg)
                this.showDialog = false
                this.resetForm()
                this.Arrived()
                // 清空 顾客入住信息
                this.roomForm.customerName = ''
                this.roomForm.customPhone = ''
                this.roomForm.customCardNumber = ''
                this.roomForm.customAge = ''
                this.roomForm.checkStatus = ''
                this.roomForm.aestheticConsultant = ''
                this.roomForm.nurse = ''
                this.roomForm.maternityMatron = ''
                this.roomForm.chanKangShi = ''
                this.roomForm.roomDays = ''
                this.roomForm.checkOutTime = ''
                this.roomForm.remark = ''
                this.searchBar = {
                  customerName: '',
                  customPhone: '',
                  customCardNumber: ''
                }
                this.formNot.customerName = ''
                this.formNot.customPhone = ''
                this.formNot.aestheticConsultant = ''
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          }
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/13
     * @Description: 确定并开单
    */
    submitRoomFormBilling() {
      this.$refs['roomForm'].validate(valid => {
        if (valid) {
          if (this.roomForm.roomReservationId !== undefined) {
            this.loadingSubmit = true
            this.$api.confinementRoom.editRoomReservation({
              id: this.roomForm.id,
              roomId: this.roomForm.roomId,
              roomReservationId: this.roomForm.roomReservationId,
              aestheticConsultant: this.roomForm.aestheticConsultant,
              chanKangShi: this.roomForm.chanKangShi,
              nurse: this.roomForm.nurse,
              maternityMatron: this.roomForm.maternityMatron,
              checkOutTime: this.roomForm.checkOutTime,
              checkStatus: '2',
              checkReservationTime: this.roomForm.checkReservationTime,
              roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remark: this.roomForm.remark,
              departmentId: this.roomForm.departmentId
            }).then(res => {
              if (res) {
                this.getData()
                this.$message.success(res.msg)
                this.showDialog = false
                this.$router.push({ path: 'confinementBilling', query: { billing: JSON.stringify(this.roomForm) } })
                this.resetForm()
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          } else {
            this.loadingSubmit = true
            this.$api.confinementRoom.addRoomReservation({
              id: this.roomForm.id,
              roomId: this.roomForm.roomId,
              aestheticConsultant: this.roomForm.aestheticConsultant,
              chanKangShi: this.roomForm.chanKangShi,
              nurse: this.roomForm.nurse,
              maternityMatron: this.roomForm.maternityMatron,
              checkOutTime: this.roomForm.checkOutTime,
              checkStatus: '2',
              checkReservationTime: this.roomForm.checkReservationTime,
              roomDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remainingDays: this.roomForm.roomDays === 0 ? this.roomForm.defaultDays : this.roomForm.roomDays,
              remark: this.roomForm.remark,
              departmentId: this.roomForm.departmentId
            }).then(res => {
              if (res) {
                this.getData()
                this.$message.success(res.msg)
                this.showDialog = false
                this.$router.push({ path: 'confinementBilling', query: { billing: JSON.stringify(this.roomForm) } })
                this.resetForm()
                this.notgetCustomerInfo()
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          }
        }
      })
    },

    /**
     * @author Nevin
     * @date 2022/6/15
     * @Description: 关闭换房弹窗
    */
    closeChangeDialog() {
      this.showChangeDialog = false
      this.changeForm = {
        id: 0,
        customerName: undefined,
        customPhone: undefined,
        customCardNumber: undefined,
        customAge: undefined,
        oldRoomId: undefined,
        oldRoomName: undefined,
        roomDays: undefined,
        waitId: undefined,
        roomId: undefined,
        floorNumber: undefined,
        roomType: undefined,
        roomNumber: undefined,
        roomName: undefined,
        defaultDays: undefined,
        defaultCharge: undefined
      }
      this.changeSelectionData = []
    },
    /**
     * @author Nevin
     * @date 2022/6/15
     * @Description: 储值选择
    */
    selectData(e) {
      this.rechargeableCard.forEach(item => {
        if (item.rechargeCardId === e) {
          this.form.rechargeAmount = item.rechargeAmount
          this.form.giftAmount = item.giftAmount
          this.form.totaAmount = math.add(item.rechargeAmount, item.giftAmount)
          this.form.paidAmount = item.rechargeAmount
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/7/11
     * @Description: 获取今天日期
    */
    getTodayData() {
      var time = new Date()
      var day = ('0' + time.getDate()).slice(-2)
      var month = ('0' + (time.getMonth() + 1)).slice(-2)
      this.todayData = time.getFullYear() + '-' + month + '-' + day
      return this.todayData
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 获取预约用户
    */
    getCustomerInfo() {
      this.$set(this.searchBar, 'deptId', this.deptId)
      if(this.valueRoom){
        this.$set(this.searchBar, 'roomId', this.roomForm.roomId)
      }else{
        delete this.searchBar.roomId
      }
      this.$set(this.searchBar, 'checkStatus', '1')
      this.$api.billingList.selectRoomAppointment({
        ...this.pagination,
        ...this.searchBar
      }).then(res => {
        if (res) {
          this.customerData = res.rows
          this.pagination.total = res.total
        }
      })
    },
    // 未预约顾客入住
    notgetCustomerInfo() {
      var data = {
        deptId: this.deptId,
        customPhone: this.formNot.customPhone,
        customerName: this.formNot.customerName,
        aestheticConsultant: this.formNot.aestheticConsultant
      }
      data = Object.assign(data, this.pagination)
      this.$api.billingList.roomBill(data).then(res => {
        if (res) {
          this.customerDatas = res.rows
          this.pagination.total = res.total
        }
      })
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 重置表单
    */
    resetForm() {
      this.roomForm = {
        id: 0,
        roomId: 0,
        floorNumber: '',
        roomType: '',
        roomNumber: '',
        roomName: '',
        defaultDays: '',
        defaultCharge: '',
        customerName: '',
        customPhone: '',
        customCardNumber: '',
        customAge: '',
        checkStatus: '',
        aestheticConsultant: '',
        nurse: '',
        maternityMatron: '',
        chanKangShi: '',
        checkTime: '',
        roomDays: '',
        subscribeTime: '',
        checkOutTime: '',
        remark: '',
        departmentId: 0
      }
      this.formNot = {
        customPhone: '',
        customerName: '',
        aestheticConsultant: ''
      }
      this.$forceUpdate()
    },
    handleClick(tab) {
      this.floorId = tab.name.substr(4, tab.name.length)
      this.getData()
    },
    gettable() {
      this.$api.confinementRoom.floorInfoList({ deptId: this.deptId, state: '0' }).then(res => {
        if (res) {
          this.list = res.rows
          // this.activeName = this.list[0].floorId
        }
      })
    },
    // ---------------
    // 鼠标右键事件
    openMenu(e, item) {
      this.roomForm.pauseDeduction = item.pauseDeduction
      this.form = item
      if (item.checkStatus === '2') {
        this.roomForm.id = item.id
        this.roomForm.checkStatus = item.checkStatus
        this.roomForm.roomReservationId = item.roomReservationId
        this.roomForm.customerName = item.customerName
        this.roomForm.customPhone = item.customPhone
        this.roomForm.customCardNumber = item.customCardNumber
        this.roomForm.customAge = item.customAge
        this.roomForm.checkReservationTime = item.checkReservationTime
        this.roomForm.roomId = item.roomId
        this.roomForm.floorNumber = item.floorNumber
        this.roomForm.roomType = item.roomType
        this.roomForm.roomNumber = item.roomNumber
        this.roomForm.roomName = item.roomName
        this.roomForm.roomDays = item.roomDays
        this.roomForm.defaultDays = item.defaultDays
        this.roomForm.defaultCharge = item.defaultCharge
        this.roomForm.departmentId = item.departmentId
        this.roomForm.waitId = item.waitId
        this.roomForm.jdxxId = item.jdxxId
        // 换房数据
        this.changeForm.id = item.id
        this.changeForm.customerName = item.customerName
        this.changeForm.customPhone = item.customPhone
        this.changeForm.customCardNumber = item.customCardNumber
        this.changeForm.customAge = item.customAge
        this.changeForm.oldRoomId = item.roomId
        this.changeForm.oldRoomName = item.roomName
        this.changeForm.roomDays = item.roomDays
        this.changeForm.waitId = item.waitId
        this.showOther = true
        this.showCheck = false
        this.roomForm.deposit = item.deposit
        this.roomForm.onlineUserId = item.onlineUserId
        this.roomForm.isSecondary = item.isSecondary
        this.roomForm.customerStatus = item.customerStatus
        this.roomForm.aestheticConsultant = item.aestheticConsultant
      } else if (item.checkStatus === '1') {
        this.roomForm.id = item.id
        this.roomForm.checkStatus = item.checkStatus
        this.roomForm.roomReservationId = item.roomReservationId
        this.roomForm.customerName = item.customerName
        this.roomForm.customPhone = item.customPhone
        this.roomForm.customCardNumber = item.customCardNumber
        this.roomForm.customAge = item.customAge
        this.roomForm.checkReservationTime = item.checkReservationTime
        this.roomForm.roomId = item.roomId
        this.roomForm.floorNumber = item.floorNumber
        this.roomForm.roomType = item.roomType
        this.roomForm.roomNumber = item.roomNumber
        this.roomForm.roomName = item.roomName
        this.roomForm.roomDays = item.roomDays
        this.roomForm.defaultDays = item.defaultDays
        this.roomForm.defaultCharge = item.defaultCharge
        this.roomForm.departmentId = item.departmentId
        this.roomForm.waitId = item.waitId
        this.roomForm.jdxxId = item.jdxxId
        this.showOther = false
        this.showCheck = true
      } else {
        this.roomForm.checkStatus = '0'
        this.roomForm.roomId = item.roomId
        this.roomForm.floorNumber = item.floorNumber
        this.roomForm.roomType = item.roomType
        this.roomForm.roomNumber = item.roomNumber
        this.roomForm.roomName = item.roomName
        this.roomForm.roomDays = item.roomDays
        this.roomForm.defaultDays = item.defaultDays
        this.roomForm.defaultCharge = item.defaultCharge
        this.roomForm.jdxxId = item.jdxxId
        this.showOther = false
        this.showCheck = true
      }
      const x = e.clientX
      const y = e.clientY
      this.top = y
      this.left = x
      this.visible = true
    },
    closeMenu() {
      this.visible = false
    },
    // 换房
    exchange() {
      this.getRoomList()
      this.getFloorList()
      this.getRoomTypeList()
      this.showChangeDialog = true;
      setTimeout(function (){
        document.querySelector('.sg-table-bar').style.height=(parseInt(window.getComputedStyle(document.querySelector('.Topheight'),this).height)+10)+'px'
      },500)


    },
    cancel() {
      this.visible = false
    },
    personal() {
      this.dialogVisible = true
    },
    getData() {
      this.loadingData = true
      if (this.activeName === 'firs') {
        this.floorId = null
      }
      const floorId = this.floorId
      const data = {}
      for (const k in this.options) {
        if (this.options[k].type === 'Tdatetime') {
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
        } else {
          if (this.options[k].values === '') {
            data[k] = undefined
          } else {
            data[k] = this.options[k].values
          }
        }
      }
      /**
       * @author Nevin
       * @date 2022/6/14
       * @Description: 传公司ID，后期可能要改
       */
      this.$api.confinementRoom.roomList({ ...data, floorId: floorId, deptId: this.deptId, state: '0' }).then(res => {
        if (res) {
          res.data.forEach(item => {
            if (item.checkStatus === undefined) {
              this.$set(item, 'checkStatus', '0')
            }
          })
          this.roomlist = res.data
          this.free = 0
          this.checkedIn = 0
          this.occupancy = 0
          this.roomlist.forEach(item => {
            if (item.checkStatus === '2') {
              this.checkedIn = this.checkedIn + 1
            } else {
              this.free = this.free + 1
            }
          })
          if(res.data.length==0){
            this.occupancy = 0;

          }else{
            this.occupancy = math.multiply(math.divide(this.checkedIn, this.roomlist.length), 100).toFixed(1)
          }

        }
      }).finally(() => {
        this.loadingData = false
      })
    },
    // 已预约顾客入住
    Arrived(index) {
      this.$forceUpdate()
      this.roomForm.checkReservationTime = this.getTodayData()
      this.searchBar.checkReservationTime = this.getTodayData()
      this.isAppointment = 1
      this.roomForm.customerName = ''
      this.roomForm.customPhone = ''
      this.roomForm.customCardNumber = ''
      this.roomForm.customAge = ''
      this.roomForm.checkStatus = ''
      this.roomForm.aestheticConsultant = ''
      this.roomForm.nurse = ''
      this.roomForm.maternityMatron = ''
      this.roomForm.chanKangShi = ''
      this.roomForm.roomDays = ''
      this.roomForm.checkOutTime = ''
      this.roomForm.remark = ''
      this.searchBar = {
        customerName: '',
        customPhone: '',
        customCardNumber: ''
      }

      this.formNot.customerName = ''
      this.formNot.customPhone = ''
      this.formNot.aestheticConsultant = ''
      this.number = index
      this.time = 3
      this.increase = 0
      this.getCustomerInfo()
    },
    // 未预约顾客入住
    notArrived(index) {
      this.notgetCustomerInfo()
      this.isAppointment = 2
      this.roomForm.checkReservationTime = this.getTodayData()
      this.roomForm.customerName = ''
      this.roomForm.customPhone = ''
      this.roomForm.customCardNumber = ''
      this.roomForm.customAge = ''
      this.roomForm.checkStatus = ''
      this.roomForm.aestheticConsultant = ''
      this.roomForm.nurse = ''
      this.roomForm.maternityMatron = ''
      this.roomForm.chanKangShi = ''
      this.roomForm.roomDays = ''
      this.roomForm.checkOutTime = ''
      this.roomForm.remark = ''
      this.searchBar = {
        customerName: '',
        customPhone: '',
        customCardNumber: ''
      }
      this.formNot.customerName = ''
      this.formNot.customPhone = ''
      this.formNot.aestheticConsultant = ''
      this.number = index
      this.time = 0
      this.increase = 4
    },
    information(val, item) {
      if (item.checkStatus !== '0') {
        this.dialogVisible = true
        this.form = item
      }
    },
    closeDialog() {
      this.dialogVisible = false
      this.form = {
        customerName: '',
        customSex: '',
        customAge: 0,
        createTime: '',
        nation: '汉',
        createBy: '',
        xiang: '',
        remark: ''
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 分页
    */
    change(e) {
      this.pagination.pageNum = e[1]
     if(this.isAppointment==2){
      this.notgetCustomerInfo()
     }else{
      this.getCustomerInfo() // 调用数据
     }

    },
    sizeChange(e) {
      this.pagination.pageSize = e[1]
      this.getCustomerInfo()
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 表格单选
     */
    handleSelectionChange(e) {
      this.selectionData = []
      if (e[1].length > 1) {
        this.$refs.table.$refs.multipleTable.clearSelection()
        this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.selectionData.push(e[1].pop())
      this.$delete(this.selectionData, 1)
      if (this.selectionData[0] !== undefined) {
        this.roomForm.roomDays = this.selectionData[0].roomDays
        this.roomForm.aestheticConsultant = this.selectionData[0].acName
        this.roomForm.id = this.selectionData[0].id
        this.roomForm.customerName = this.selectionData[0].customerName
        this.roomForm.customPhone = this.selectionData[0].customPhone
        this.roomForm.customCardNumber = this.selectionData[0].customCardNumber
        this.roomForm.customAge = this.selectionData[0].customAge
        this.roomForm.departmentId = this.selectionData[0].departmentId
        this.roomForm.totalAmount = this.selectionData[0].totalAmount
        this.$forceUpdate()
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 行内点击选中
     */
    rowClick(e) {
      this.$refs.table.$refs.multipleTable.clearSelection()
      this.$refs.table.$refs.multipleTable.toggleRowSelection(e[1])
      this.roomReservationIdnews=e[1].roomReservationId
    },

    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 分页
     */
    changeCurrentChange(e) {
      this.roomPagination.pageNum = e[1]
      this.getRoomList()
    },
    changeSizeChange(e) {
      this.roomPagination.pageSize = e[1]
      this.getRoomList()
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 表格单选
     */
    handleChangeSelectionChange(e) {
      this.changeSelectionData = []
      if (e[1].length > 1) {
        this.$refs.changeTable.$refs.multipleTable.clearSelection()
        this.$refs.changeTable.$refs.multipleTable.toggleRowSelection(e[1].pop())
      }
      this.changeSelectionData.push(e[1].pop())
      this.$delete(this.changeSelectionData, 1)
      if (this.changeSelectionData[0] !== undefined) {
        this.changeForm.floorNumber = this.changeSelectionData[0].floorNumber
        this.changeForm.roomId = this.changeSelectionData[0].roomId
        this.changeForm.roomType = this.changeSelectionData[0].roomType
        this.changeForm.roomNumber = this.changeSelectionData[0].roomNumber
        this.changeForm.roomName = this.changeSelectionData[0].roomName
        this.changeForm.defaultDays = this.changeSelectionData[0].defaultDays
        this.changeForm.defaultCharge = this.changeSelectionData[0].defaultCharge
        this.$forceUpdate()
      }
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 行内点击选中
     */
    changeRowClick(e) {
      this.$refs.changeTable.$refs.multipleTable.clearSelection()
      this.$refs.changeTable.$refs.multipleTable.toggleRowSelection(e[1])
    },
    /**
     * @author Nevin
     * @date 2022/6/11
     * @Description: 获取用户列表
    */
    getUserList(deptId) {
      // 人员添加公司Id  添加状态 添加岗位
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
          // 现场
          res.data.forEach(item => {
            if (item.postCode == 'xczxs') {
              this.sysUserList.push(item)
              this.newsysUserList.push(item)
            }
          })
          // ------- 岗位
          res.data.forEach(item => {
            if (item.postCode == 'chks') {
              this.chks.push(item)
              this.newchks.push(item)
            }
          }) // 产康师
          res.data.forEach(item => {
            if (item.postCode == 'zerennurse') {
              this.zerennurse.push(item)
              this.newzerennurse.push(item)
            }
          }) // 责任护士
          res.data.forEach(item => {
            if (item.postCode == 'huli') {
              this.yuesao.push(item)
              this.newyuesao.push(item)
            }
          }) // 月嫂
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.Width{
  width: 33%;
}
.tablist{
  margin-top: 10px;
}
::v-deep .tablist th {
  padding:  0 !important;
  font-size: 14px !important;
}
::v-deep .tablist tr td {
  padding:  0 !important;
  font-size: 14px !important;
}
.order_detail_basic {
  width: 98%;
  min-height: 30px;
  margin-top: 0px;
  font-size: 20px !important;
  color: black !important;
  display: flex;align-items: center;justify-content: space-evenly;
  font-size: 16px !important;
}

.order_detail {
  width: 100%;
  height: 30px;
  text-align: center;
  color: black !important;
}
::v-deep .sg-table-bar{
  min-height: 20px !important;
}
.bill {
  display: none;
  position: absolute;
}

.text:hover {
  display: inline-block;
}

.cardHeader {
  background-color: #56dbb8;
}

.endCardHeader {
  background-color: #f19739;
}

.notCardHeader {
  background-color: #333333;
}

::v-deep .el-card__header {
  padding: 0;
}

.cumAge {
  width: 65%;
  color: #ffffff;
  font-size: 12px;
  margin-top: 2px;
  padding-left: -5px
}

//鼠标右键弹出位置
.contextMenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);
  text-align: center;
  width: 5%;
}

.contextMenu li {
  margin: 8px;
  cursor: pointer;
}

.contextMenu li:hover {
  background-color: #F2F6FC;
}

.headertable {
  padding: 10px;
}

::v-deep .el-card__body {
  //background-color: #faa755;
  padding: 9px;
}

::v-deep .el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow {
  border-radius: 8px;
  //border: 1px solid #56dbb8;
}

.header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  /*background-color: #56dbb8;*/
  .right {
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    margin: 0 20px 40px 25px;
  }

  .titmed {
    margin: 0 15px 5px 15px;
  }
}

.horn {
  width: 0px;
  height: 0px;
  border-top: 22px solid #f19739;
  border-bottom: 14px solid #56dbb8;
  border-left: 35px solid #56dbb8;
  border-right: 23px solid #f19739;
  margin-top: -6px;
  margin-right: -1px;
}

.endhorn {
  width: 0px;
  height: 0px;
  border-top: 22px solid #ffffff;
  border-bottom: 14px solid #f19739;
  border-left: 35px solid #f19739;
  border-right: 23px solid #ffffff;
  margin-top: -6px;
  margin-right: -1px;
}

.nothorn {
  width: 0px;
  height: 0px;
  border-top: 22px solid #333333;
  border-bottom: 14px solid #333333;
  border-left: 35px solid #333333;
  border-right: 23px solid #333333;
  margin-top: -6px;
  margin-right: -1px;
}

.ticks {
  display: flex;

  .imgtick {
    margin-top: -17px;
  }
}

.imgticks {
  display: flex;
}

.mation {
  margin-top: 5px;
}

.card {
  width: 280px;
  display: inline-block;
  margin: 10px 20px;
  border: 1px solid #56dbb8;
}

.card:hover {
  transform: translate(0, -5px)
}

.endCard {
  width: 280px;
  display: inline-block;
  margin: 10px 20px;
  border: 1px solid #f19739;
}

.endCard:hover {
  transform: translate(0, -5px)
}

.noCard {
  width: 280px;
  display: inline-block;
  margin: 10px 20px;
  border: 1px solid #333333;
}

.noCard:hover {
  transform: translate(0, -5px)
}

.room {
  float: left;
  cursor: pointer;
  width: 122px;
  height: 20px;
  font-size: 12px;
  background-color: #ffffff;
  border-radius: 0 5px 5px 0;
  margin-top: 8px;
}

//.titme{
//  font-size: 14px;
//  margin-left: 15px;
//  margin-bottom: 15px
//}
.statrs {
  width: 50%;
  margin: 5px 0;
  padding: 0 3px;
}

.line {
  padding-bottom: 8px;
  border-bottom: 1px dashed #56dbb8;
}

.endLine {
  padding-bottom: 8px;
  border-bottom: 1px dashed #f19739;
}

.notLine {
  padding-bottom: 8px;
  border-bottom: 1px dashed #333333;
}

.titme {
  padding-top: 1px;
  margin-bottom: 20px;
  font-size: 12px;
  color: #ffffff;
}

.titmes {
  padding-top: 1px;
  margin-bottom: 4px;
  font-size: 12px;
}

/*小方块*/
.color-block-default {
  display: inline-block;
  width: 14px;
  height: 10px;
  background-color: #56dbb8;
  border-radius: 2px;
  border: 1px solid #56dbb8;
}

.color-block-success {
  display: inline-block;
  width: 14px;
  height: 10px;
  background-color: #fcbf64;
  border-radius: 2px;
  border: 1px solid #fcbf64;
}

.color-block-free {
  display: inline-block;
  width: 14px;
  height: 10px;
  background-color: #333333;
  border-radius: 2px;
  border: 1px solid #333333;
}

.bg {
  background-color: #3aa1ff;
  color: #fff;
}

::v-deep thead .el-table-column--selection .cell {
  display: none;
}

.active {
  display: none;
}

.notbutt {
  position: relative;
}

.butt {
  position: absolute;
  right: 0px;
  bottom: -400px;
}
</style>
