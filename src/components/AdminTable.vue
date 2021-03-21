<template>
  <v-card>
    <v-snackbar v-model="snackbar" :color="snackbarColor">
      {{ prompt }}
      <v-btn color="black" text @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
    <v-toolbar elevation="2">
      <v-card-title>
        所有会议
        <v-btn text @click="getAllData">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-dialog persistent v-model="simpleDialog" max-width="300px">
        <v-card>
          <v-card-title>{{simpleTitle}}</v-card-title>
          <v-card-text>{{simpleMessage}}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="simpleDialog = false">取消</v-btn>
            <v-btn color="blue darken-1" text @click="simpleDialog = false;simpleDialogAction()">确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- //编辑弹窗 -->
      <v-dialog v-model="dialog" persistent max-width="600px">
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
              <span class="headline">修改会议</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      label="会议名称"
                      prepend-icon="mdi-bookmark-outline"
                      required
                      v-model="editingItem.meetingName"
                      :rules="[v => !!v || '请输入会议名']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      label="描述"
                      prepend-icon="mdi-book-open-outline"
                      required
                      v-model="editingItem.meetingDescription"
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
                      v-model="editingItem.meetingHosts"
                      :rules="[v => !!v || '请输入与会人员']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      label="会议地点"
                      prepend-icon="mdi-map-marker-outline"
                      required
                      v-model="editingItem.meetingLocation"
                      :rules="[v => !!v || '请输入会议地点']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-divider></v-divider>
                    <small>报名参加会议的人员所需填写的信息：</small>
                  </v-col>

                  <v-col cols="12" sm="4" md="4">
                    <v-checkbox v-model="editingItem.name" label="姓名" color="red" hide-details></v-checkbox>
                    <v-checkbox
                      v-model="editingItem.org"
                      label="工作单位"
                      color="red darken-3"
                      hide-details
                    ></v-checkbox>
                    <v-checkbox
                      v-model="editingItem.needRoom"
                      label="是否需要安排房间"
                      color="black"
                      hide-details
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-checkbox v-model="editingItem.number" label="电话" color="indigo" hide-details></v-checkbox>
                    <v-checkbox
                      v-model="editingItem.fullId"
                      label="身份证号"
                      color="indigo darken-3"
                      hide-details
                    ></v-checkbox>
                    <v-text-field
                      label="宾馆名称"
                      prepend-icon="mdi-domain"
                      required
                      v-if="editingItem.needRoom"
                      v-model="editingItem.meetingHotel"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-checkbox v-model="editingItem.gender" label="性别" color="orange" hide-details></v-checkbox>
                    <v-checkbox
                      v-model="editingItem.ptime"
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
              <v-btn color="blue darken-1" text :disabled="!valid">创建</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table :headers="tableHeader" :items="tableContent" class="elevation-1">
      <template v-slot:item.action="{ item }">
        <v-icon @click="handlePass(item)">mdi-check-outline</v-icon>
        <v-icon @click="handleEdit(item)">mdi-pencil-outline</v-icon>
        <v-icon @click="handleDelete(item)">mdi-delete-outline</v-icon>
      </template>
      <template v-slot:item.pass="{ item }">
        <v-chip :color="item.pass ? 'green' : 'orange'" dark>{{item.pass ? '已上线' : '待审核'}}</v-chip>
      </template>
      <!-- editItem(item) -->
      <!-- <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>-->
    </v-data-table>
  </v-card>
</template>
<script>
import { getMeeting } from "@/api/api";
import { passMeeting } from "@/api/api";
import { deleteMeeting } from "@/api/api";
export default {
  data: () => ({
    tab: null,

    //弹窗1
    simpleDialog: false,
    simpleMessage: "",
    simpleTitle: "",
    
    //弹窗2
    dialog: false,
    timeStart: "",
    time: "",
    dateStart: "",
    dateEnd: "",
    menuDateStart: false,
    menuTimeStart: false,
    menuDateEnd: false,
    menuTimeEnd: false,
    valid: false,
    loading: false,

    //提示小弹窗
    snackbar: false,
    snackbarColor: "error",
    prompt: "",

    tableHeader: [
      { text: "编号", value: "meetingId" },
      { text: "发起人ID", value: "sponsorId" },
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
        sponsorId: 0,
        meetingName: null,
        meetingDescription: null,
        beginTime: null,
        endTime: null,
        pass: false,
        meetingLocation: null
      }
    ],
    editingItem: {
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
    }
  }),
  methods: {
    getAllData() {
      getMeeting().then(dataBack => {
        let { message, code, data } = dataBack;
        this.prompt = message;
        if (code == 130) {
          this.snackbar = true;
        }
        this.tableContent = data;
      });
    },
    passItem() {
      passMeeting(this.editingItem.meetingId).then(dataBack => {
        let { message, code, data } = dataBack;
        this.prompt = message;
        if (code == 134) {
          this.snackbar = true;
        }
        data.length;
        this.getAllData();
      });
    },
    handlePass(item) {
      this.editingItem = item;
      this.simpleTitle = "通过";
      this.simpleMessage = "会议通过后即可被参加";
      this.simpleDialogAction = this.passItem;
      this.simpleDialog = true;
      console.log(this.simpleDialog);
    },
    handleEdit(item) {
      this.editingItem = item;
      this.dateStart = item.beginTime.substr(0, 10);
      this.dateEnd = item.endTime.substr(0, 10);
      this.timeStart = item.beginTime.substr(12, 5);
      this.time = item.endTime.substr(11, 5);
      this.dialog = true;
    },
    deleteItem() {
      deleteMeeting(this.editingItem.meetingId).then(dataBack => {
        let { message, code, data } = dataBack;
        this.prompt = message;
        if (code == 135) {
          this.snackbar = true;
        }
        data.length;
        this.getAllData();
      });
    },
    handleDelete(item) {
      this.editingItem = item;
      this.simpleTitle = "删除";
      this.simpleMessage = "会议及参会记录均会被删除";
      this.simpleDialogAction = this.deleteItem;

      this.simpleDialog = true;
      console.log(this.simpleDialogAction);
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    simpleDialogAction(){

    }
  },
  mounted() {
    this.getAllData();
  }
};
</script>