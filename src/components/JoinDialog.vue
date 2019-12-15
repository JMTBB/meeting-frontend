<template>
  <v-card justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
      </template>
      <v-card :loading="loading">
        <v-card-title>基本信息</v-card-title>

        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-card-title v-on="on" class="text-center">{{meetingInfo.meetingName}}</v-card-title>
          </template>
          <span>会议名称</span>
        </v-tooltip>

        <v-card-text>
          <div class="my-4 subtitle-1 black--text">{{meetingInfo.meetingHosts}}</div>

          <div>{{meetingInfo.meetingDescription}}</div>
        </v-card-text>

        <v-card-text>
          <v-chip-group v-model="selection" active-class="deep-purple accent-4 white--text" column>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip v-on="on">
                  <v-icon left>mdi-history</v-icon>
                  {{meetingInfo.beginTime}}
                </v-chip>
              </template>
              <span>开始时间</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip v-on="on">
                  <v-icon left>mdi-update</v-icon>
                  {{meetingInfo.endTime}}
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
              <v-col cols="12" sm="12" md="4" v-if="infoFilter.name">
                <v-text-field
                  label="姓名"
                  prepend-icon="mdi-account-arrow-right-outline"
                  v-model="infoCollector.name"
                  :rules="[v => !!v || '请填写姓名']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4" v-if="infoFilter.number">
                <v-text-field
                  label="电话"
                  prepend-icon="mdi-phone-outline"
                  v-model="infoCollector.number"
                  :rules="[v => !!v || '请填写电话']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="12" md="4" v-if="infoFilter.org">
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
              <v-col cols="12" sm="12" md="6" v-if="infoFilter.fullId">
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
              <v-col cols="12" sm="6" md="3" v-if="infoFilter.gender">
                <v-select
                  :items="genderItem"
                  v-model="infoCollector.gender"
                  prepend-icon="mdi-gender-male-female"
                  label="您的性别"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="3" v-if="infoFilter.needRoom">
                <v-switch
                  v-model="infoCollector.needRoom"
                  :label="`房间：${infoCollector.needRoom?'是': '否'}`"
                ></v-switch>
              </v-col>
            </v-row>
          </v-list-item>
        </v-form>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialog = false">取消</v-btn>
          <v-btn :disabled="!valid" color="deep-purple accent-4" text @click="reserve">Reserve</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    valid: false,
    dialog: false,
    loading: false,
    selection: 1,
    meetingInfo: {
      meetingName: "11",
      meetingLocation: "会议地点",
      sponsorId: "发起人",
      meetingDescription: "会议描述",
      beginTime: "2019-12-12 09:00:00",
      endTime: "2019-12-12 09:00:00",
      meetingHosts: "主要参会人员",
      meetingHotel: "前湖宾馆"
    },
    infoFilter: {
      name: true,
      number: true,
      gender: true,
      org: true,
      fullId: true,
      needRoom: true,
      ptime: true
    },
    infoCollector: {
      name: "",
      number: "",
      gender: "",
      org: "",
      fullId: "",
      needRoom: "",
      ptime: ""
    },
    genderItem: ["男", "女"],
    editingItem: {
      meetingId: 0,
      meetingDescription: "",
      meetingName: "",
      sponsorId: 0,
      beginTime: "2019-12-14 10:00:00",
      endTime: "2019-12-14 13:00:00",
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
  methods: {
    reserve() {
      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
      setTimeout(() => (this.dialog = false), 2000);
    }
  }
};
</script>