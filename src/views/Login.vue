<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>登录</v-toolbar-title>
                <v-spacer />

                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :href="source"
                      icon
                      large
                      target="_blank"
                      v-on="on"
                    >
                      <v-icon>mdi-code-tags</v-icon>
                    </v-btn>
                  </template>
                  <span>Source</span>
                </v-tooltip>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      large
                      href="https://codepen.io/johnjleider/pen/pMvGQO"
                      target="_blank"
                      v-on="on"
                    >
                      <v-icon>mdi-codepen</v-icon>
                    </v-btn>
                  </template>
                  <span>Codepen</span>
                </v-tooltip>-->
              </v-toolbar>
              <v-card-text>
                <v-form ref="info" lazy-validation v-model="valid">
                  <v-text-field
                    label="输入账号"
                    v-model="info.account"
                    prepend-icon="person"
                    type="text"
                    required
                    :rules="accountRules"
                  />

                  <v-text-field
                    v-model="info.password"
                    label="输入密码"
                    prepend-icon="lock"
                    type="password"
                    required
                    :rules="passwordRules"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <router-link to="/register">
                  <small>还没有账号？注册一个</small>
                </router-link>
                <v-spacer />
                <v-btn :disabled="!valid" color="primary" @click="handleSubmit">登录</v-btn>
              </v-card-actions>
              <v-progress-linear
                :active="loading"
                :indeterminate="loading"
                absolute
                bottom
                color="deep-purple accent-4"
              ></v-progress-linear>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { requestLogin } from "@/api/api";

export default {
  data: () => ({
    info: {
      account: "",
      password: ""
    },
    valid: true,
    accountRules: [
      v => !!v || "请输入账号",
      v => (v && v.length <= 10) || "账号小于10位"
    ],
    passwordRules: [v => !!v || "请输入密码"],
    loading: false
  }),
  props: {
    source: String
  },
  methods: {
    handleSubmit() {
      this.loading = true;
      var subInfo = {
        loginId: this.info.account,
        loginPassword: this.info.password,
        loginName: "",
        isAdmin: false
      };
      requestLogin(subInfo).then(dataBack => {
        let {message, code, data } = dataBack;
        if(code != 200) {
          message.length;
          console.log("ttt");
        }else {
          data.length;
          // window.localStorage.setItem("user", JSON.stringify(data)); 
          this.loading = false;
          this.$router.push({path: '/home/table'});
        }
      })
    }
  },
  watch: {
    // loading(val) {
    //   if (!val) return;
    //   setTimeout(() => (this.loading = false), 3000);
    // }
  }
};
</script>