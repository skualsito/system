import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';

import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
require('moment/locale/es')

Vue.use(VueMoment, {
  moment,
});


import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar)

import routes from './router';
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

import * as VueWindow from '@hscmap/vue-window'

// import VueSocketIO from 'vue-socket.io'
// Vue.use(new VueSocketIO({
//   //debug: true,
//   //connection: 'http://localhost:5005',
//   connection: 'https://notificaciones.sim.lacosta.gob.ar',
//   options: { secure: true, transports: ['polling'] }  
// }))
Vue.use(VueRouter, VueWindow, VueAxios, axios);

const router = new VueRouter({routes});

// axios.defaults.headers.common = {'Authorization': `Bearer ${localStorage.getItem("token")}`}


const service = axios.create({
  timeout: 20000 // request timeout
});

// request interceptor

service.interceptors.request.use(
  config => {
    // Do something before request is sent

    config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  function(response) { return response;}, 
  function(error) {
      // handle error
      if (error.response.status==403) {
          location.href = "/";

          //alert(JSON.stringify(error.response.status));
      }
      

  });


Vue.prototype.$http = service;


Vue.prototype.$ruta = "https://frontend.sim.lacosta.gob.ar/";
Vue.prototype.$rutahttp = "https://frontend.sim.lacosta.gob.ar/";
Vue.prototype.$api = "https://backend.sim.lacosta.gob.ar/";
// Vue.prototype.$api = "https://11.11.15.8:5000/";
Vue.prototype.$rrhh = "https://backend.sim.lacosta.gob.ar/rrhh/";
Vue.prototype.$escritorio = "https://backend.sim.lacosta.gob.ar/escritorio/";
Vue.prototype.$pdf = "https://backend.sim.lacosta.gob.ar/pdf/";
Vue.prototype.$sistemas = "https://frontend.sim.lacosta.gob.ar/";
// Vue.prototype.$rrhh = "http://11.11.15.8:5003/";



new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
