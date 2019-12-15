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
      <v-snackbar 
      v-model="snackbar"
      color="error"
      >
        {{ errorMessage }}
        <v-btn color="black" text @click="snackbar = false">关闭</v-btn>
      </v-snackbar>
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
      v => v && /\d{3,10}/.test(v) || "账号为3-10位的数字"
    ],
    passwordRules: [v => !!v || "请输入密码"],
    loading: false,
    snackbar: false,
    errorMessage: ""
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
        let { message, code, data } = dataBack;
        if (code == 200) {
          data.length;
          window.localStorage.removeItem("user");
          window.localStorage.setItem("user", JSON.stringify(data));
          this.loading = false;
          this.$router.push({ path: "/home/crud" });
        }else if(code == 201){
          window.localStorage.setItem("user", JSON.stringify(data));
          window.localStorage.setItem("admin",true);
          this.$router.push({
            name: 'Home',
            params:{ admin : true, }
          })
        } 
        else {
          this.errorMessage = message;
          this.snackbar = true;
          this.loading = false;
          console.log("登录异常");






        }
      });
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