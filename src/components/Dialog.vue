<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
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
                  <v-checkbox v-model="meeting.org" label="工作单位" color="red darken-3" hide-details></v-checkbox>
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
            <v-btn color="red darken-1" text @click="dialog = false;reset()">取消</v-btn>
            <v-btn color="blue darken-1" text @click="handleCreate" :disabled="!valid">创建</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ promptMessage }}
      <v-btn color="black" text @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
import { addMeeting } from "@/api/api";
export default {
  data: () => ({
    valid: false,
    dialog: false,
    loading: false,
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
    }
  }),
  computed: {
    startT: () => this.dateStart + " " + this.timeStart + ":00",
    endT: () => this.dateEnd + " " + this.timeStart + ":00"
    //计算属性无法直接在method中调用
  },
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
      });
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>