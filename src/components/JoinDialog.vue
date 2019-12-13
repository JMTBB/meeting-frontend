<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
      </template>
      <v-card :loading="loading">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
           <v-card-title v-on="on" class="text-center">{{meetingInfo.meetingName}}</v-card-title>
          </template>
          <span>会议名称</span>
        </v-tooltip>
        

        <v-card-text>
          <v-row align="center" class="mx-0">
            <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>

            <div class="grey--text ml-4">4.5 (413)</div>
          </v-row>

          <div class="my-4 subtitle-1 black--text">$ • Italian, Cafe</div>

          <div>Small plates, salads & sandwiches an inteimate setting with 12 indoor seats plus patio seating.</div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-title>会议时间</v-card-title>

        <v-card-text>
          <v-chip-group v-model="selection" active-class="deep-purple accent-4 white--text" column>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                 <v-chip v-on="on"><v-icon left>mdi-history</v-icon>{{meetingInfo.beginTime}}</v-chip>
              </template>
              <span>开始时间</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip v-on="on"><v-icon left>mdi-update</v-icon>{{meetingInfo.endTime}}</v-chip>
              </template>
              <span>结束时间</span>
            </v-tooltip>
          </v-chip-group>
        </v-card-text>

        <v-card-actions>
          <v-btn color="deep-purple accent-4" text @click="reserve">Reserve</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
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