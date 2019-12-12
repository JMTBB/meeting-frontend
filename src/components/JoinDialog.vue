<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">参加会议</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-text-field label="会议名称" required></v-text-field>
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
                      prepend-icon="event"
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
                  <v-date-picker v-model="dateEnd" @input="menu2 = false" locale="zh-cn" scrollable></v-date-picker>
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
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker v-model="time" format="24hr" scrollable></v-time-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="参会人员" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="会议地点" required></v-text-field>
              </v-col>

              <v-col cols="12" sm="4" md="4">
                <v-checkbox v-model="infocollector.name" label="姓名" color="red" hide-details></v-checkbox>
                <v-checkbox
                  v-model="infocollector.org"
                  label="工作单位"
                  color="red darken-3"
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  v-model="infocollector.needRoom"
                  label="是否需要安排房间"
                  color="black"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox v-model="infocollector.number" label="电话" color="indigo" hide-details></v-checkbox>
                <v-checkbox
                  v-model="infocollector.fullId"
                  label="身份证号"
                  color="indigo darken-3"
                  hide-details
                ></v-checkbox>
                <v-text-field label="宾馆名称" required v-if="infocollector.needRoom"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-checkbox v-model="infocollector.gender" label="性别" color="orange" hide-details></v-checkbox>
                <v-checkbox
                  v-model="infocollector.pTime"
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
          <v-btn color="red darken-1" text @click="dialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    curDate: new Date(),
    timeStart: this.curDate
      .setHours(
        this.curDate.getHours(),
        this.curDate.getMinutes() - curDate.getTimezoneOffset()
      )
      .toISOString()
      .substr(11, 5),
    time: this.curDate
      .setHours(
        this.curDate.getHours(),
        this.curDate.getMinutes() - curDate.getTimezoneOffset() + 240
      )
      .toISOString()
      .substr(11, 5),
    dateStart: new Date().toISOString().substr(0, 10),
    dateEnd: new Date().toISOString().substr(0, 10),
    menuDateStart: false,
    menuTimeStart: false,
    menuDateEnd: false,
    menuTimeEnd: false,
    picker: null,
    // time: new Date().toISOString().substr(11, 5),

    infocollector: {
      name: false,
      number: false,
      gender: false,
      org: false,
      fullId: false,
      pTime: false,
      needRoom: false
    }
  })
};
</script>