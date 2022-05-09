<template>
  <v-app>
    <v-main>

        <v-container fluid class="login-container">
          <v-row style="align-items: center;">
            <v-container class="login-login">
              <v-col>
                <v-row>
                  <h1>Login</h1>
                </v-row>
                <v-row>
                  <v-text-field
                    dark
                    prepend-icon="mdi-account"
                    label="User"
                    v-model="user"
                  >
                  </v-text-field>
                </v-row>
                <v-row>
                  <v-text-field
                    dark
                    prepend-icon="mdi-lock"
                    label="Password"
                    type="password"
                    v-model="pass"
                  >
                  </v-text-field>
                </v-row>
                <v-row>
                  <v-checkbox
                    dark
                    label="Recordarme"
                  ></v-checkbox>
                </v-row>
                <v-row>
                  <v-btn
                    block
                    elevation="2"
                    color="primary"
                    @click="login"
                  >Login</v-btn>
                  <v-btn
                    block
                    elevation="2"
                    color="primary"
                    @click="register()"
                  >reg</v-btn>
                </v-row>
              </v-col>
            </v-container>
          </v-row>
        </v-container>
      </v-main>
  </v-app>
</template>

<script>
  import { user } from '../gun';
  import { setCurrentUser } from "../store/users"
  import { handleAuthResponse } from "../utils/gun-utils"
  import { createUser } from "../service/user"
  export default {
    mounted() {
      if (user.is) {
        this.$router.push('/escritorio');
      }
    },
    methods: {
     login() {
      user.auth(this.user, this.pass, async (response) => {
        const res = handleAuthResponse(response);
        if (res !== "error") {
          setCurrentUser();
          this.$router.push('/escritorio');

        }
      })
       
     },
     register(){
        user.create(this.user, this.pass, (response) => {
          const res = handleAuthResponse(response);
          if (res !== "error") {
            createUser(this.user);
            this.$router.push('/escritorio');
          }
        })
     }
    },
    data() {
      return {
        user: "",
        pass: ""
      }
    },

  }
</script>

<style>
.login-container {
  background: url("../assets/fondos/bg1.jpg");
  background-attachment: fixed;
  background-size: cover;
  height: 100%;
  width: 100%;
  display: flex;
}
.login-container:before {
    content: " ";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgb(0 0 0 / 55%);
    z-index: 0;
}
.login-login {
  width: 400px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.6px);
  -webkit-backdrop-filter: blur(8.6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 20px 40px 20px;
  color: #fff;
}
.login-login h1 {
  font-size: 1.5em;
}
</style>