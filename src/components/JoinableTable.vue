<template>
  <v-data-table :headers="tableHeader" :items="tableContent" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>可参加会议</v-toolbar-title>
        <v-btn text @click="getData()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon @click="editItem(item)">mdi-playlist-plus</v-icon>

      <v-dialog v-model="dialog" persistent max-width="600px">
        <!-- <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
        </template>-->
        <v-card :loading="loading">
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
          <v-card-title>参加会议</v-card-title>
          <v-form lazy-validation v-model="valid" ref="form">
            <v-list-item>
              <v-row>
                <v-col cols="12" sm="12" md="4" v-if="editingItem.name">
                  <v-text-field
                    label="姓名"
                    prepend-icon="mdi-account-arrow-right-outline"
                    v-model="infoCollector.name"
                    :rules="[v => !!v || '请填写姓名']"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="4" v-if="editingItem.number">
                  <v-text-field
                    label="电话"
                    prepend-icon="mdi-phone-outline"
                    v-model="infoCollector.number"
                    :rules="[v => !!v || '请填写电话']"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="12" md="4" v-if="editingItem.org">
                  <v-text-field
                    label="单位"
                    prepend-icon="mdi-domain"
                    v-model="infoCollector.org"
                    :rules="[v => !!v || '请填写工作单位']"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-list-item>
            <v-list-item>
              <v-row>
                <v-col cols="12" sm="12" md="6" v-if="editingItem.fullId">
                  <v-text-field
                    label="身份证号"
                    prepend-icon="mdi-id-card"
                    v-model="infoCollector.fullId"
                    :rules="[ 
                            v => !!v || '请填写身份证号',
                            v => v && /\d{16}(\d(\d|\w))?/.test(v) || '身份证号格式有误'
                          ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3" v-if="editingItem.gender">
                  <v-select
                    :items="genderItem"
                    v-model="infoCollector.gender"
                    prepend-icon="mdi-gender-male-female"
                    label="您的性别"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="3" v-if="editingItem.needRoom">
                  <v-switch
                    v-model="infoCollector.needRoom"
                    :label="`房间：${infoCollector.needRoom?'是': '否'}`"
                  ></v-switch>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6" v-if="editingItem.ptime">
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
                        label="参会日期"
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
                <v-col cols="12" sm="6" md="6" v-if="editingItem.ptime">
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
                        label="参会时间"
                        prepend-icon="mdi-clock-outline"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker v-model="timeStart" format="24hr" scrollable></v-time-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-list-item>
          </v-form>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="dialog = false">取消</v-btn>
            <v-btn :disabled="!valid" color="deep-purple accent-4" text @click="handleJoin()">参加</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-icon>mdi-playlist-remove</v-icon>
    </template>
  </v-data-table>
</template>
<script>
import { getJoinableMeeting } from "@/api/api";
import { addEntry } from "@/api/api";

export default {
  data: () => ({
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
    editedIndex: -1,
    genderItem: ["男", "女"],

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
    },
    //保存用户提交的信息
    infoCollector: {
      ploginId: 0,
      pmeetingId: 0,
      name: "",
      number: "",
      gender: "",
      org: "",
      fullId: "",
      needRoom: "",
      ptime: ""
    },
    infoInit: {
      ploginId: 0,
      pmeetingId: 0,
      name: "",
      number: "",
      gender: "",
      org: "",
      fullId: "",
      needRoom: "",
      ptime: ""
    },
    //参加会议弹出框
    dialog: false,
    loading: false,
    valid: false,
    //时间选择
    menuDateStart: false,
    dateStart: new Date().toISOString().substr(0, 10),
    menuTimeStart: false,
    timeStart: "10:00"
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
  methods: {
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
    getData: function() {
      getJoinableMeeting(window.localStorage.getItem("user")).then(dataBack => {
        let { message, code, data } = dataBack;

        if (code != 232) {
          console.log(message);
          this.errorMessage = message;
          this.snackbar = true;
          this.loading = false;
        } else {
          // Object.assign(this.tableContent, data)
          this.tableContent = data;
          this.loading = false;
          // window.localStorage.setItem("user", JSON.stringify(data));
        }
      });
    },

    editItem(item) {
      this.editedIndex = this.tableContent.indexOf(item);
      this.editingItem = item; //Object.assign({}, item);
      this.infoCollector.pmeetingId = parseInt(item.meetingId);
      this.dialog = true;
    },
    handleJoin() {
      this.infoCollector.ploginId = parseInt(
        JSON.parse(window.localStorage.getItem("user"))
      );
      this.infoCollector.ptime = this.dateStart + " " + this.timeStart + ":00";
      console.log(JSON.stringify(this.infoCollector));
      addEntry(this.infoCollector).then(dataBack => {
        let { message, code, data } = dataBack;
        this.dialog = false;
        console.log(message);
        console.log(data);
        console.log(code);
      });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>