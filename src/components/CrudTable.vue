<template>
  <v-data-table :headers="tableHeader" :items="tableContent" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>我的会议</v-toolbar-title>
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
                        v-model="meeting.pTime"
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
        <v-dialog v-model="dialog2" width="300">
          <v-card>
            <v-card-title class="headline grey lighten-2" primary-title>扫码参加会议</v-card-title>

            <v-card-text><div class="" id="qrCode"></div></v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog2 = false">I accept</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>-->
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="dialog2 = true;">mdi-qrcode</v-icon>
      <v-icon small @click="deleteItem(item)">mdi-delete-outline</v-icon>
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
import QRCode from 'qrcodejs2';
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
      pTime: false,
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
      pTime: false,
      needRoom: false
    },

    tableHeader: [
      { text: "编号", value: "meetingId" },
      { text: "会议主题", value: "meetingName" },
      { text: "会议描述", value: "meetingDescription" },
      { text: "开始时间", value: "beginTime" },
      { text: "结束时间", value: "endTime" },
      { text: "会议地点", value: "meetingLocation" },
      { text: "操作", value: "action", sortable: false }
    ],
    tableContent: [
      {
        meetingId: 0,
        meetingName: null,
        meetingDescription: null,
        beginTime: null,
        endTime: null,
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
    getQRCode() {
      setTimeout(() => {
        this.bindQRCode();
      }, 400);
    },
    bindQRCode: function() {
      this.qrCode = new QRCode(this.$refs.qrCodeDiv, {
        text: "https://www.baidu.com",
        width: 200,
        height: 200,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
        correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
      });
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