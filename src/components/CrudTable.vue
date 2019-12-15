<template>
  <v-data-table :headers="tableHeader" :items="tableContent" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-tabs>
          <v-tab>发起的会议</v-tab>
          <v-tab>参加的会议</v-tab>
        </v-tabs>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on">新建会议</v-btn>
          </template>
          <v-card>
            <v-form lazy-validation v-model="valid" ref="form">
              <v-progress-linear
                :active="loading"
                :indeterminate="loading"
                absolute
                bottom
                color="light-blue"
              ></v-progress-linear>
              <v-card-title>
                <span class="headline">创建会议</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="会议名称"
                        prepend-icon="mdi-bookmark-outline"
                        required
                        v-model="meeting.meetingName"
                        :rules="[v => !!v || '请输入会议名']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="描述"
                        prepend-icon="mdi-book-open-outline"
                        required
                        v-model="meeting.meetingDescription"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        v-model="menuDateStart"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="dateStart"
                            label="开始日期"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dateStart"
                          @input="menu2 = false"
                          locale="zh-cn"
                          scrollable
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        v-model="menuTimeStart"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="timeStart"
                            label="开始时间"
                            prepend-icon="mdi-clock-outline"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker v-model="timeStart" format="24hr" scrollable></v-time-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        v-model="menuDateEnd"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="dateEnd"
                            label="结束日期"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="dateEnd"
                          @input="menu2 = false"
                          locale="zh-cn"
                          scrollable
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu
                        v-model="menuTimeEnd"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="time"
                            label="结束时间"
                            prepend-icon="mdi-clock-outline"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-time-picker v-model="time" format="24hr" scrollable></v-time-picker>
                      </v-menu>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="参会人员"
                        prepend-icon="mdi-account-multiple-outline"
                        required
                        v-model="meeting.meetingHosts"
                        :rules="[v => !!v || '请输入与会人员']"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        label="会议地点"
                        prepend-icon="mdi-map-marker-outline"
                        required
                        v-model="meeting.meetingLocation"
                        :rules="[v => !!v || '请输入会议地点']"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-divider></v-divider>
                      <small>报名参加会议的人员所需填写的信息：</small>
                    </v-col>

                    <v-col cols="12" sm="4" md="4">
                      <v-checkbox v-model="meeting.name" label="姓名" color="red" hide-details></v-checkbox>
                      <v-checkbox
                        v-model="meeting.org"
                        label="工作单位"
                        color="red darken-3"
                        hide-details
                      ></v-checkbox>
                      <v-checkbox
                        v-model="meeting.needRoom"
                        label="是否需要安排房间"
                        color="black"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-checkbox v-model="meeting.number" label="电话" color="indigo" hide-details></v-checkbox>
                      <v-checkbox
                        v-model="meeting.fullId"
                        label="身份证号"
                        color="indigo darken-3"
                        hide-details
                      ></v-checkbox>
                      <v-text-field
                        label="宾馆名称"
                        prepend-icon="mdi-domain"
                        required
                        v-if="meeting.needRoom"
                        v-model="meeting.meetingHotel"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-checkbox v-model="meeting.gender" label="性别" color="orange" hide-details></v-checkbox>
                      <v-checkbox
                        v-model="meeting.ptime"
                        label="参会时间"
                        color="orange darken-3"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="dialog = false;resetValidation()">取消</v-btn>
                <v-btn color="blue darken-1" text @click="handleCreate" :disabled="!valid">创建</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialog2" width="600px">
          <v-card>
            <!-- <v-card-title class="headline grey lighten-2" primary-title>扫码参加会议</v-card-title> -->
            <v-card-title>基本信息</v-card-title>

            <v-card-title>
              会议名：
              {{editingItem.meetingName}}
            </v-card-title>
            <v-card-text>
              <div>
                <small>会议概述：</small>
                {{editingItem.meetingDescription}}
              </div>
            </v-card-text>

            <v-card-text>
              <v-sheet elevation="2">
                <v-list-item>
                  <v-list-item-subtitle>
                    发起人：
                    {{editingItem.sponsorId}}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item>
                  <v-list-item-subtitle>
                    会议地点：
                    {{editingItem.meetingLocation}}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>
                    主要参会人：
                    {{editingItem.meetingHosts}}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="editingItem.needRoom">
                  <v-list-item-subtitle>
                    宾馆：
                    {{editingItem.meetingHotel}}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>
                    参会信息要求：
                    {{editingItem.name ? '姓名': ''}}
                    {{editingItem.number ? '电话': ''}}
                    {{editingItem.gender ? '性别': ''}}
                    {{editingItem.org ? '工作单位': ''}}
                    {{editingItem.fullId ? '身份证号': ''}}
                    {{editingItem.ptime ? '参会时间': ''}}
                    {{editingItem.needRoom ? '是否需要安排房间': ''}}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-sheet>
              <!-- <div class="my-4 subtitle-1 black--text"></div> -->
            </v-card-text>

            <v-card-text>
              <v-chip-group active-class="deep-purple accent-4 white--text" column>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-chip v-on="on">
                      <v-icon left>mdi-history</v-icon>
                      {{editingItem.beginTime}}
                    </v-chip>
                  </template>
                  <span>开始时间</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-chip v-on="on">
                      <v-icon left>mdi-update</v-icon>
                      {{editingItem.endTime}}
                    </v-chip>
                  </template>
                  <span>结束时间</span>
                </v-tooltip>
              </v-chip-group>
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
            <v-card-text align="center" justify="center" v-if="editingItem.pass">
              <v-divider></v-divider>

              <div class id="qrcode" ref="qrcode"></div>
            </v-card-text>
            <v-card-text v-else>会议审核中，无法生成二维码</v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click="dialog2 = false;closeCode(editingItem.pass)"
              >I accept</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-snackbar v-model="snackbar" :color="snackbarColor">
        {{ promptMessage }}
        <v-btn color="black" text @click="snackbar = false">关闭</v-btn>
      </v-snackbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="handleQR(item)">mdi-qrcode</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete-outline</v-icon>
    </template>
    <template v-slot:item.pass="{ item }">
      <v-chip :color="item.pass ? 'green' : 'orange'" dark>{{item.pass ? '已上线' : '审核中'}}</v-chip>
    </template>
    <!-- editItem(item) -->
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>-->
  </v-data-table>
</template>

<script>
import { addMeeting } from "@/api/api";
import { getMeetingByUserId } from "@/api/api";
import QRCode from "qrcodejs2";
export default {
  data: () => ({
    qrCode: null,
    valid: false,

    dialog: false,
    dialog2: false,
    loading: false,
    search: "",

    snackbar: false,
    promptMessage: "",
    snackbarColor: "error",

    timeStart: "9:00",
    time: "12:00",
    dateStart: new Date().toISOString().substr(0, 10),
    dateEnd: new Date().toISOString().substr(0, 10),
    menuDateStart: false,
    menuTimeStart: false,
    menuDateEnd: false,
    menuTimeEnd: false,
    picker: null,

    meetBack: {
      meetingDescription: "",
      meetingName: "",
      sponsorId: "",
      beginTime: "",
      endTime: "",
      meetingLocation: "",
      meetingHosts: "",
      meetingHotel: "",
      name: false,
      number: false,
      gender: false,
      org: false,
      fullId: false,
      ptime: false,
      needRoom: false
    },
    meeting: {
      meetingDescription: "",
      meetingName: "",
      sponsorId: "",
      beginTime: "", //计算属性
      endTime: "", //计算属性
      meetingLocation: "",
      meetingHosts: "",
      meetingHotel: "",
      name: false,
      number: false,
      gender: false,
      org: false,
      fullId: false,
      ptime: false,
      needRoom: false
    },

    tableHeader: [
      { text: "编号", value: "meetingId" },
      { text: "会议主题", value: "meetingName" },
      { text: "会议描述", value: "meetingDescription" },
      { text: "开始时间", value: "beginTime" },
      { text: "结束时间", value: "endTime" },
      { text: "会议地点", value: "meetingLocation" },
      { text: "状态", value: "pass" },
      { text: "操作", value: "action", sortable: false }
    ],
    tableContent: [
      {
        meetingId: 0,
        meetingName: null,
        meetingDescription: null,
        beginTime: null,
        endTime: null,
        pass: false,
        meetingLocation: null
      }
    ],

    headers: [
      {
        text: "Dessert (100g serving)",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Calories", value: "calories" },
      { text: "Fat (g)", value: "fat" },
      { text: "Carbs (g)", value: "carbs" },
      { text: "Protein (g)", value: "protein" },
      { text: "Actions", value: "action", sortable: false }
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    defaultItem: {
      name: "",
      calories: 0,
      fat: 0,
      carbs: 0,
      protein: 0
    },
    //弹出参加框上方数据 和用户所需填写数据
    editingItem: {
      meetingId: 0,
      meetingDescription: "",
      meetingName: "",
      sponsorId: 0,
      beginTime: "",
      endTime: "",
      meetingLocation: "",
      meetingHosts: "",
      meetingHotel: "",
      name: false,
      number: false,
      gender: false,
      org: false,
      fullId: false,
      needRoom: false,
      ptime: false,
      pass: false
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {},
  methods: {
    handleCreate() {
      this.loading = true;
      this.meeting.beginTime = this.dateStart + " " + this.timeStart + ":00";
      this.meeting.endTime = this.dateEnd + " " + this.time + ":00";
      this.meeting.sponsorId = parseInt(
        JSON.parse(window.localStorage.getItem("user"))
      );
      addMeeting(this.meeting).then(dataBack => {
        let { message, code, data } = dataBack;
        this.dialog = false;
        this.loading = false;
        this.promptMessage = message;
        this.snackbarColor = code == 220 ? "success" : "error";
        this.snackbar = true;
        data.length;
        Object.assign(this.meeting, this.meetBack);
        this.$refs.form.resetValidation();
        this.getMeetingInfo();
      });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    close() {
      setTimeout(() => {
        this.editedIndex = -1;
      }, 300);
    },
    getMeetingInfo: function() {
      getMeetingByUserId(window.localStorage.getItem("user")).then(dataBack => {
        let { message, code, data } = dataBack;
        if (code != 231) {
          console.log(message);
          this.errorMessage = message;
          this.snackbar = true;
          this.loading = false;
        } else {
          this.tableContent = data;
          this.loading = false;
          // window.localStorage.setItem("user", JSON.stringify(data));
        }
      });
    },

    // 展示二维码
    payOrder() {
      this.innerVisible = true;
      // 二维码内容,一般是由后台返回的跳转链接,这里是写死的一个链接
      this.qrcode = "https://yuchengkai.cn/docs/frontend/#typeof";
      // 使用$nextTick确保数据渲染
      this.$nextTick(() => {
        this.crateQrcode();
      });
    },
    // 生成二维码
    crateQrcode() {
      this.qr = new QRCode("qrcode", {
        width: 150,
        height: 150, // 高度
        text: this.qrcode // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
      });
      // console.log(this.qrcode)
    },
    // 关闭弹框,清除已经生成的二维码
    closeCode(pass) {
      if (pass) {
        this.$refs.qrcode.innerHTML = "";
      }
    },
    handleQR(item) {
      this.editingItem = item;
      if (item.pass) {
        this.payOrder();
      } else {
        this.promptMessage = "会议审核中，无法生成二维码";
        console.log(this.promptMessage);
        this.snackbar = true;
      }
      this.dialog2 = true;
    }

    // editItem(item) {
    //   this.editedIndex = this.desserts.indexOf(item);
    //   this.editedItem = Object.assign({}, item);
    //   this.dialog = true;
    // },
    // deleteItem(item) {
    //   const index = this.desserts.indexOf(item);
    //   confirm("Are you sure you want to delete this item?") &&
    //     this.desserts.splice(index, 1);
    // },
    // close() {
    //   this.dialog = false;
    //   setTimeout(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem);
    //     this.editedIndex = -1;
    //   }, 300);
    // },
    // save() {
    //   if (this.editedIndex > -1) {
    //     Object.assign(this.desserts[this.editedIndex], this.editedItem);
    //   } else {
    //     this.desserts.push(this.editedItem);
    //   }
    //   this.close();
    // }
  },
  mounted: function() {
    this.getMeetingInfo();
  }
};
</script>
<style scoped>
#qrcode {
  margin-top: 20px;
}
</style>