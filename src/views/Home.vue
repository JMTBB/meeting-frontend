<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link @click="toDialog">
          <v-list-item-action>
            <v-icon>{{curIcons[0]}}</v-icon>
            <!-- mdi-view-dashboard-outline -->
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{curItems[0]}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="toTable">
          <v-list-item-action>
            <v-icon>{{curIcons[1]}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{curItems[1]}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>会议管理系统</v-toolbar-title>
      <v-spacer />

      <v-menu bottom origin="center center" transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon>
            <v-icon v-on="on">mdi-settings-outline</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>退出登录</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>


<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
    drawerItems: ["我的会议", "可参加会议"],
    drawerItemIcons: ["mdi-book-open-outline", "mdi-checkbook"],
    curItems: [],
    curIcons: [],
    drawerItemsAdmin: ["会议管理", "用户管理"],
    drawerItemIconsAdmin: [
      "mdi-view-dashboard-outline",
      "mdi-account-multiple-outline"
    ]
  }),
  methods: {
    toDialog() {
      if(JSON.parse(window.localStorage.getItem("admin"))) {
        this.$router.push("/home/admin")
      }

      this.$router.push("/home/crud");
    },
    toTable() {
      this.$router.push("/home/join");
    }
  },
  created() {
    this.$vuetify.theme.dark = false;
    if (this.$route.params.admin) {
      this.curItems = this.drawerItemsAdmin;
      this.curIcons = this.drawerItemIconsAdmin;
      this.$router.push("/home/admin");
    } else {
      this.curItems = this.drawerItems;
      this.curIcons = this.drawerItemIcons;
    }
  }
};
</script>