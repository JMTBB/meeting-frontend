<template>
  <v-app id="inspire">
    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>注册</v-toolbar-title>
                <v-spacer />

  
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="输入用户名"
                    name="login"
                    prepend-icon="person"
                    type="text"
                  />

                  <v-text-field
                    label="输入账号"
                    name="login"
                    prepend-icon="person"
                    type="text"
                  />

                  <v-text-field
                    id="password"
                    label="输入密码"
                    name="password1"
                    prepend-icon="lock"
                    type="password"
                  />
                  <v-text-field
                    id="password2"
                    label="确认密码"
                    name="password"
                    prepend-icon="lock"
                    type="password"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <router-link to="/">返回登录</router-link>
                <v-spacer />
                <v-btn color="primary">注册</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String,
    },
  }
</script>