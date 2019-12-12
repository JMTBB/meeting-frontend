<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>注册</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" lazy-validation>
                  <v-text-field
                    label="输入用户名"
                    prepend-icon="mdi-face-profile"
                    type="text"
                    v-model="info.name"
                    :rules="nameRules"
                  />

                  <v-text-field
                    label="输入账号"
                    prepend-icon="person"
                    type="text"
                    v-model="info.id"
                    :rules="accountRules"
                  />

                  <v-text-field
                    label="输入密码"
                    prepend-icon="lock"
                    type="password"
                    v-model="info.password"
                    :rules="passwordRules"
                  />
                  <v-text-field
                    label="确认密码"
                    prepend-icon="lock"
                    type="password"
                    v-model="info.passwordConfirm"
                    :rules="passwordConfirmRules"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <router-link to="/">
                  <small>返回登录</small>
                </router-link>
                <v-spacer />
                <v-btn color="primary" :disabled="!valid" @click="handleRegister">注册</v-btn>
              </v-card-actions>
              <v-progress-linear
                :active="loading"
                :indeterminate="loading"
                absolute
                bottom
                color="light-blue"
              ></v-progress-linear>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar v-model="snackbar" color="error">
        {{ errorMessage }}
        <v-btn color="black" text @click="snackbar = false">关闭</v-btn>
      </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import { addUser } from "@/api/api";
export default {
  data: () => ({
    info: {
      name: "",
      id: "",
      password: "",
      passwordConfirm: ""
    },
    valid: true,
    nameRules: [v => !!v || "请输入用户名"],
    accountRules: [
      v => !!v || "请输入账号",
      v => (v && /\d{3,10}/.test(v)) || "账号为3-10位的数字"
    ],
    passwordRules: [v => !!v || "请输入密码"],

    loading: false,
    snackbar: false,
    errorMessage: ""
  }),
  methods: {
    handleRegister() {
      this.loading = true;
      var regInfo = {
        loginId: this.info.id,
        loginPassword: this.info.password,
        loginName: this.info.name,
        isAdmin: false
      };
      addUser(regInfo).then(dataBack => {
        let { message, code, data } = dataBack;
        this.loading = false;
        if (code != 210) {
          this.errorMessage = message;
          this.snackbar = true;
          console.log("注册异常");
        } else {
          data.length;
          // window.localStorage.setItem("user", JSON.stringify(data));
          this.$router.push({ path: "/" });
        }
      });
    }
  },
  props: {
    source: String
  },
  computed: {
    passwordConfirmRules() {
      return [
        () =>
          this.info.password === this.info.passwordConfirm ||
          "输入的两次密码不一致"
      ];
    }
  }
};
</script>