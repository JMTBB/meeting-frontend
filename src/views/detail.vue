<template>
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
                            v => !!v || '请填写身份证号'
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
              <v-date-picker v-model="dateStart" @input="menu2 = false" locale="zh-cn" scrollable></v-date-picker>
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
      <v-btn :disabled="!valid" @click="handleJoin" color="deep-purple accent-4" text>参加</v-btn>
      <v-snackbar v-model="snackbar" color="error">
        {{ prompt }}
        <v-btn color="black" text @click="snackbar = false">关闭</v-btn>
      </v-snackbar>
    </v-card-actions>
  </v-card>
</template>

<script>
import { addEntry } from "@/api/api";

import { getSingleMeetingById } from "@/api/api";
export default {
  data: () => ({
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
    genderItem: ["男", "女"],

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
    id: 5,
    loading: false,
    snackbar: false,
    prompt: "",
    valid: false,
    menuDateStart: false,
    dateStart: new Date().toISOString().substr(0, 10),
    menuTimeStart: false,
    timeStart: "10:00"
  }),
  methods: {
    getdata() {
      getSingleMeetingById(this.id).then(dataBack => {
        let { message, code, data } = dataBack;
        if (code != 236) {
          console.log(message);
          this.prompt = message;
          this.snackbar = true;
          this.loading = false;
        } else {
          this.editingItem = data;
          this.loading = false;
          // window.localStorage.setItem("user", JSON.stringify(data));
        }
      });
    },
    handleJoin() {
      this.infoCollector.ploginId = parseInt(
        JSON.parse(window.localStorage.getItem("user"))
      );
      this.infoCollector.pmeetingId = this.editingItem.meetingId;
      this.infoCollector.ptime = this.dateStart + " " + this.timeStart + ":00";
      console.log(this.infoCollector);
      addEntry(this.infoCollector).then(dataBack => {
        let { message, code, data } = dataBack;
        console.log(message);
        console.log(data);
        console.log(code);
      });

      setTimeout(() => {
        this.$router.push({ path: "/home/crud" });
      }, 1000);
      console.log("刷新");
    }
  },
  created: function() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      if (!JSON.parse(window.localStorage.getItem("user"))) {
        this.prompt = "未登录";
        this.snackbar = true;
        let id = this.id;
        setTimeout(this.$router.push({ path: `/?id=${id}` }), 1000);
      }
    } else {
      this.prompt = "参数获取失败";
      this.snackbar = true;
      setTimeout(this.$router.push({ path: "/" }), 1000);
    }
    this.getdata();
  }
};
</script>