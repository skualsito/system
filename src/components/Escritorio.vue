<template>
  <v-app>
    <!-- <ticket ref="ticket" :user="user"></ticket>
    <reciboSueldo ref="reciboSueldo" :user="user"></reciboSueldo>
    <licencias ref="licenciasform" :user="user"></licencias>
    <inasistencias ref="inasistenciasform" :user="user"></inasistencias>-->
    
    <contrasenia ref="contraform"></contrasenia>
    <perfil ref="perfilForm"></perfil> 
    <v-snackbar
            v-model="snackbar"
          >
            {{ alertMsj }}
            <v-btn
              text
              @click="snackbar = false"
            >
              Cerrar
            </v-btn>
          </v-snackbar>
    <v-main
      class="contenedor-todo"
      :style="{ background: 'url(' + images.bgLaCosta + ')' }"
    >
      <!-- <img :src="images.logoLaCosta" alt="logo" class="logobg" /> -->
      <v-container fluid>
        <!-- :layout="tilesEscritorio"
          :colWidth="100"
          :row-height="100"
          :is-draggable="true"
          :is-resizable="false"
          :is-mirrored="false"
          :vertical-compact="true"
          :use-css-transforms="true"
          :responsive="true"
          :prevent-collision="true" -->
        <grid-layout
          

          :layout.sync="tilesEscritorio"
          :row-height="100"
          :is-resizable="false"
          :is-mirrored="false"
          :vertical-compact="false"
          :use-css-transforms="false"
          :responsive="true"
          :prevent-collision="true"
          :maxRows="5"
        >
          <!-- <div class="btn-desktop">
            <MetroTile
              
              :width="100"
              :height="100"
              class="btn-metro-tile"
              @click="abrirPerfil"
            >
              <template>
                
                <div slot="front">
                  <div class="tile-label">
                    Perfil
                  </div>
                  <v-icon class="tile-icon">mdi-account</v-icon>
                </div>
              </template>
            </MetroTile>
          </div> -->
          <grid-item
            v-for="item in tilesEscritorio"
            :x="item.x"
            :y="item.y"
            :w="1"
            minW="100"
            minH="100"
            :h="1"
            :i="item.i"
            :key="item.i"
            :preserveAspectRatio="true"
            @moved="movedEvent(item.x, item.y, item.pktile)"
          >
            <div class="btn-desktop" @mouseover="trashVer = item.i" @mouseleave="trashVer = null">
              <v-tooltip top v-if="trashVer === item.i">
                <template v-slot:activator="{ on }">
                  <div class="btn-start-shortcut" v-on="on" @click="shortCutDelete(item.pktile)"><v-icon>far fa-trash-alt</v-icon></div>
                </template>
                <span>Borrar acceso directo</span>
              </v-tooltip>
              <MetroTile
                :faceStyle="item.estilo.fondo"
                :width="item.estilo.width"
                :height="item.estilo.height"
                class="btn-metro-tile"
                @click="abrirVentana(item)"
              >
                <template>
                  
                  <div slot="front">
                    <div class="tile-label">
                      {{ item.nombre }}
                    </div>
                    <v-icon class="tile-icon">{{ item.icon }}</v-icon>
                  </div>
                </template>
              </MetroTile>
            </div>
          </grid-item>
        </grid-layout>
      </v-container>
      <div class="nav-barra" >

        <!-- start -->
        <v-btn class="btn-start" @click="navop = !navop; navopnoti = false; navopperfil = false;" :disabled="(user.datoscompletos) ? user.datoscompletos.fkestado==2 : '' ">
          <!-- <v-btn class="btn-start" @click="navop = !navop; navopnoti = false; navopperfil = false;" > -->
          <v-icon>fas fa-bars</v-icon>
        </v-btn>
        
        <div class="barra-tareas">
          <template v-for="(ventana, i) in ventanas">
            <v-btn
              v-bind:key="i"
              class="btn-ventanas"
              @click="minimizarVentana(ventana)"
              v-if="!ventana.cerrada"
              text
              :style="ventana.color"
              :class="{ 'barra-activa': ventana.activa }"
            >
              <v-icon>{{ ventana.icono }}</v-icon>
              <span>{{ ventana.nombre }}</span>
            </v-btn>
          </template>
        </div>

        <div class="contenedor-botones-start" :class="{ 'nav-open': navop }">
          <perfect-scrollbar>
            <!-- <div
              class="btn-startlist"
            >            
              <MetroTile
                :faceStyle="{ 'background-color': '#994b9b' }"
                :width="100"
                :height="100"
                class="btn-metro-tile"
                @click="tickets"
                title="Tickets"
              >
              
                <template>
                  <div slot="front">
                    <div class="tile-label">
                      Tickets
                    </div>
                    <v-icon class="tile-icon">mdi-ticket-account</v-icon>
                  </div>
                </template>
              </MetroTile>
            </div>
            <div
              class="btn-startlist"
            >            
              <MetroTile
                :faceStyle="{ 'background-color': '#3e5f9a' }"
                :width="100"
                :height="100"
                class="btn-metro-tile"
                title="Recibo de sueldo"
                @click="recibosDeSueldo"
              >
              
                <template>
                  <div slot="front">
                    <div class="tile-label">
                      Recibo de sueldo
                    </div>
                    <v-icon class="tile-icon">mdi-file-document-multiple-outline</v-icon>
                  </div>
                </template>
              </MetroTile>
            </div>
            <div
              class="btn-startlist"
            >            
              <MetroTile
                :faceStyle="{ 'background-color': '#6c62bb' }"
                :width="100"
                :height="100"
                class="btn-metro-tile"
                title="Licencias"
                @click="licencias"
              >
              
                <template>
                  <div slot="front">
                    <div class="tile-label">
                      Licencias
                    </div>
                    <v-icon class="tile-icon">mdi-file-account-outline</v-icon>
                  </div>
                </template>
              </MetroTile>
            </div>
            <div
              class="btn-startlist"
            >            
              <MetroTile
                :faceStyle="{ 'background-color': '#3e899a' }"
                :width="100"
                :height="100"
                class="btn-metro-tile"
                title="Inasistencias"
                @click="inasistencias"
              >
              
                <template>
                  <div slot="front">
                    <div class="tile-label">
                      Inasistencias
                    </div>
                    <v-icon class="tile-icon">mdi-file-alert-outline</v-icon>
                  </div>
                </template>
              </MetroTile>
            </div>
            
            <div
              class="btn-startlist"
              v-for="(tile, index) in tiles"
              :key="index"
            >
              <v-tooltip top v-if="!tile.pktile">
                <template v-slot:activator="{ on }">
                  <div class="btn-start-shortcut" v-on="on" @click="shortCut(tile)"><v-icon>fas fa-external-link-alt</v-icon></div>
                </template>
                <span>Crear acceso directo</span>
              </v-tooltip>
            
              <MetroTile
                :faceStyle="tiles[index].estilo.fondo"
                :width="tiles[index].estilo.width"
                :height="tiles[index].estilo.height"
                class="btn-metro-tile"
                :title="tiles[index].nombre"
                @click="abrirVentana(tile)"
              >
                <template>
                  <div slot="front">
                    <div class="tile-label">
                      {{ tiles[index].nombre }}
                    </div>
                    <v-icon class="tile-icon">{{ tiles[index].icon }}</v-icon>
                  </div>
                </template>
              </MetroTile>
            </div> -->
            

            <div
              class="btn-menulist"
            >
              <div class="btn-menulist-item" 
                @click="tickets"
                title="Tickets">
                <div class="btn-menulist-color" :style="{ 'background-color': '#994b9b' }"></div>
                <v-icon class="btn-menulist-icon">mdi-ticket-account</v-icon>
                <div class="btn-menulist-label">
                    Tickets
                </div>
              </div>
            </div>

            <div
              class="btn-menulist"
            >
              <div class="btn-menulist-item" 
                @click="recibosDeSueldo"
                title="Recibo de sueldo">
                <div class="btn-menulist-color" :style="{ 'background-color': '#3e5f9a' }"></div>
                <v-icon class="btn-menulist-icon">mdi-ticket-account</v-icon>
                <div class="btn-menulist-label">
                    Recibo de sueldo
                </div>
              </div>
            </div>

            <div
              class="btn-menulist"
            >
              <div class="btn-menulist-item" 
                @click="licencias"
                title="Licencias">
                <div class="btn-menulist-color" :style="{ 'background-color': '#6c62bb' }"></div>
                <v-icon class="btn-menulist-icon">mdi-file-account-outline</v-icon>
                <div class="btn-menulist-label">
                    Licencias
                </div>
              </div>
            </div>

            <div
              class="btn-menulist"
            >
              <div class="btn-menulist-item" 
                @click="inasistencias"
                title="Inasistencias">
                <div class="btn-menulist-color" :style="{ 'background-color': '#3e899a' }"></div>
                <v-icon class="btn-menulist-icon">mdi-file-alert-outline</v-icon>
                <div class="btn-menulist-label">
                    Inasistencias
                </div>
              </div>
            </div>

            <div
              class="btn-menulist"
              v-for="(tile, index) in tiles"
              :key="index"
            >
              <v-tooltip top v-if="!tile.pktile">
                <template v-slot:activator="{ on }">
                  <div class="btn-start-shortcut" v-on="on" @click="shortCut(tile)"><v-icon>fas fa-external-link-alt</v-icon></div>
                </template>
                <span>Crear acceso directo</span>
              </v-tooltip>

              <div class="btn-menulist-item" 
                :title="tiles[index].nombre"
                @click="abrirVentana(tile)">
                <div class="btn-menulist-color" :style="tiles[index].estilo.fondo"></div>
                <v-icon class="btn-menulist-icon">{{ tiles[index].icon }}</v-icon>
                <div class="btn-menulist-label">
                    {{ tiles[index].nombre }}
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>

        <!-- fin start -->

        <!-- avatar -->
        
        <v-btn
          class="btn-avatar"
          color="primary"
          fab
          x-small
          @click="navopperfil = !navopperfil; navopnoti = false; navop = false;"
          :disabled="(user.datoscompletos) ? user.datoscompletos.fkestado==2 : '' "
        >
          <img
            :src="
              user.imagen
                ? user.imagen
                : require('@/assets/img/profile-placeholder.png')
            "
            alt="perfil"
          />
        </v-btn>
        <div
          class="contenedor-menu-avatar"
          :class="{ 'nav-open': navopperfil }"
        >
          <h1>{{ user.nombre }}</h1>
          <ul class="botonera-menu-avatar">
            <li @click="abrirPerfil">Perfil</li>
            <li @click="cambiarContra">Cambiar contraseña</li>
            <li @click="recibosDeSueldo">Recibo de sueldo</li>
            <li @click="licencias">Licencias</li>
            <li @click="inasistencias">Inasistencias</li>
            <li @click="cerrarSesion">Cerrar sesión</li>
          </ul>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <div class="img-perfil-contenedor" v-on="on">
                  <v-file-input
                    class="input-subirimage"
                    :rules="[value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!']"
                    accept="image/png, image/jpeg, image/bmp"
                  ></v-file-input>
                  <img
                    :src="
                      user.imagen
                        ? user.imagen
                        : require('@/assets/img/profile-placeholder.png')
                    "
                    alt="perfil-foto"
                  />
                </div>
            </template>
            <span>Cambiar imágen</span>
          </v-tooltip>
          
        </div>
        <!-- fin avatar -->

        <!-- Notificaciones -->
        <v-btn
          class="btn-notificacion"
          text
          icon
          color="white"
          @click="navopnoti = !navopnoti; navop = false; navopperfil = false;"
          :disabled="(user.datoscompletos) ? user.datoscompletos.fkestado==2 : '' "
        >
          <div class="not-num" v-if="this.totalNoti > 0">{{this.totalNoti}}</div>
          <v-icon>fas fa-bell</v-icon>
        </v-btn>
        <v-btn
          class="btn-ticket"
          icon
          color="white"
          @click="tickets"
          :disabled="(user.datoscompletos) ? user.datoscompletos.fkestado==2 : '' "
        >
          <v-icon>mdi-ticket-account</v-icon>
        </v-btn>
        <div
          class="contenedor-menu-notificaciones"
          :class="{ 'nav-open': navopnoti }"
        >
        <v-container class="fill-height" v-if="this.notificaciones.length <= 0"><div class="text-center" align="center" justify="center" style="width: 100%; opacity: 0.5;">No hay notificaciones nuevas.</div></v-container>
          <div
            class="not-contenedor"
            v-for="(item, index) in notificaciones"
            :key="index"
          >
            <div class="not-titulo">
              <div class="not-icono" :class="{ 'nuevos': !item.leido }">
                <v-icon>{{ item.icono }}</v-icon>
              </div>
              <h1>{{ item.sistema }}</h1>
            </div>
            <div
              class="not-texto"
              v-for="(value, i) in item.notificaciones"
              @mouseleave="leerNotificacion(value)"
              :key="i"
            >
              <h1>{{ value.titulo }}</h1>
              <p>{{ value.texto }}</p>
            </div>
          </div>
        </div>
        <!-- Fin Notificaciones -->
      </div>

    </v-main>
    <template v-for="(ventana, i) in ventanas">
      <win
        :windowId="ventana.windowId"
        :active="true"
        :title="ventana.nombre"
        :key="i"
        :width="ventana.width"
        :height="ventana.height"
        :ventana="ventana"
        :ventanas.sync="ventanas"
        :class="{ 'ventana-oculta': !ventana.isOpen }"
        v-on:cerrarVentana="cerrarVentana($event)"
        v-on:focusChange="focusChange($event)"
        v-on:minimizarVentana="minimizarVentana($event)"
        v-if="!ventana.cerrada"
      >
        <div
          v-on:click="focusChange(ventana.windowId)"
          style="width: 100%;height:calc(100% - 40px);box-sizing: border-box; border-style: none;"
        >
          <iframe
            allow="camera;microphone"
            v-on:click="focusChange(ventana.windowId)"
            :style="{ 'pointer-events': ventana.activa ? '' : 'none' }"
            :src="ventana.url"
            style="width: 100%; height: 100%; box-sizing: border-box; border-style: none;border-radius: 0% 0% 26px 0%;"
          />
        </div>
      </win>
    </template>
  </v-app>
</template>

<script>
import MetroTile from "vue-metro-tile";
import { GridLayout, GridItem } from "vue-grid-layout"

import win from "@/components/Window";

import contrasenia from "./contrasenia";
import perfil from "./perfil";
import reciboSueldo from "./recibodesueldo";
import licencias from "./licencias";
import inasistencias from "./inasistencias";
import ticket from "./ticket";
import { logoutUser } from "../service/user"

export default {
  beforeCreate() {
    let dm = localStorage.getItem("dm");
    this.$vuetify.theme.dark = (dm == 1) ? true : false;
  },
  created() {
    //this.traerTodo();


    //  window.addEventListener('message', function (msg) {
    //   if(msg.origin.startsWith(this.$rutahttp) || msg.origin.startsWith(this.$ruta)){
    //     let d = JSON.parse(msg.data);
    //     // console.log(d);
    //     switch(d.tipo){
    //       case "pdf":
    //           fetch(d.data)
    //           .then(res => res.blob())
    //           .then((blob)=>{
    //             let urlPdf =  window.URL.createObjectURL(blob);
    //             window.open(urlPdf);
    //           })

    //         break;
    //     }
    //   }
    // });


  },
  props: {
    source: String
  },
  sockets: {
        // connect: function () {
        //     console.log('socket connected');
        //     let obj = this;
        //     obj.$socket.emit('login', {dni: obj.user.dni, oficina: obj.user.oficina}, function(data){
        //       obj.user.socket = data;
        //     });
        // },
        // notificado: function (data) {
        //   this.msjNotif(data.descripcion);
        //   this.traerNotificaciones();
        // }
  },
  methods: {
    abrirVentana: function(w) {
      this.navopnoti = false; this.navop = false; this.navopperfil = false;
      if (!w.url) return;

      var env = this.ventanas;
      let t = localStorage.getItem("token");
      let dm = localStorage.getItem("dm");


      var nuevaVentana = {
        windowId: (function() {
          const one = Math.floor(Math.random() * 1000000 + 1) + "";
          const two = Math.floor(Math.random() * 1000000 + 1) + "";
          const three = Math.floor(Math.random() * 1000000 + 1) + "";
          return one + two + three;
        })(),
        nombre: w.nombre,
        url: w.url+ "?t=" + t + "&dm=" + dm,
        icono: w.icon,
        height: "600px",
        width: "400px",
        isOpen: true,
        fullScreen: true,
        color: w.estilo.fondo,
        handler: () => {
          return env;
        },
        cerrada: false,
        activa: false
      };

      this.ventanas.push(nuevaVentana);
    },
    cerrarVentana(e) {
      this.ventanas[
        this.ventanas.findIndex(v => v.windowId == e)
      ].cerrada = true;
    },
    focusChange(id) {
      this.navopnoti = false; this.navop = false; this.navopperfil = false;
      this.ventanas.map(val => {
        if (val.windowId != id || !val.isOpen) {
          val.activa = false;
        } else {
          val.activa = true;
          // this.$emit("sendWindowToHighest");
        }
      });
    },
    minimizarVentana(v) {
      if (v.isOpen && !v.activa) {
        this.focusChange(v.windowId);
      } else if (!v.isOpen && !v.activa) {
        v.isOpen = true;
        this.focusChange(v.windowId);
      } else {
        v.isOpen = false;
        v.activa = false;
      }
    },
    shortCut: function(t) {
      let pksistema = t.i;
      var obj = this;
      this.$http
      .post(`${this.$api}escritorio/addDesktop`, {pksistema: pksistema})
      .then(function(response) {
        if(response.data.estado)
          obj.traerTodo();

      })
      .catch(function(error) {
        this.msg = error;
      });
    },
    traerTodo(){
    var obj = this;
    

    this.$http
      .post(`${this.$api}escritorio/traerSistemas`, {})
      .then(function(response) {
        
        obj.tiles = [];
        response.data.map(datos => {
          let url = obj.$sistemas + datos.url + "/";

          obj.tiles.push({
            i: datos.pksistema,
            nombre: datos.nombre,
            url: url,
            x: datos.x,
            y: datos.y,
            pktile: datos.pktile,
            w: 1,
            h: 1,
            icon: datos.icono,
            estilo: {
              width: 100,
              height: 100,
              fondo: { "background-color": datos.color }
            }
          });

          // alert(JSON.stringify(obj.tiles))
        });
        obj.traerUsuario(obj);
      })
      .catch(function(error) {
        obj.msg = error;
      });
    },
    movedEvent(newX, newY, pktile){
      var obj = this;
      this.$http
          .post(`${this.$api}escritorio/changeDesktop`, {x:newX, y: newY, pktile: pktile})
          .then(function(response) {
            if(!response.data.estado){
              obj.msjNotif("Error al cambiar el icono, intente nuevamente.");
            }

          })
          .catch(function(error) {
            this.msg = error;
          });
    },
    cambiarContra(){
      this.$refs['contraform'].dialog = !this.$refs['contraform'].dialog;
    },
    abrirPerfil(){
      this.$refs['perfilForm'].dialog = !this.$refs['perfilForm'].dialog;
      this.navopperfil=false;
    },
    tickets(){
      this.$refs['ticket'].dialogticket = !this.$refs['ticket'].dialogticket;
    },
    recibosDeSueldo(){
      this.$refs['reciboSueldo'].dialog = !this.$refs['reciboSueldo'].dialog;
    },
    licencias(){
      this.$refs['licenciasform'].dialog = !this.$refs['licenciasform'].dialog;
    },
    inasistencias(){
      this.$refs['inasistenciasform'].dialoginasistencias = !this.$refs['inasistenciasform'].dialoginasistencias;
      this.navopperfil=false;
      this.$refs['inasistenciasform'].listadoInasistencias();
    },
    msjNotif(msj){
      this.alertMsj = msj;
      this.snackbar = true;
    },
    cerrarSesion(){
      logoutUser();
      this.$router.push("/")
    }
  },
  components: {
    /* eslint-disable vue/no-unused-components */
    GridLayout,
    GridItem,
    MetroTile,
    //PerfectScrollbar,
    win,
    contrasenia,
    perfil,
    licencias,
    reciboSueldo,
    inasistencias,
    ticket
  },
  data() {
    return {
      msj: "",
      snackbar: false,
      trashVer: null,
      ventanas: [],
      user: {
        nombre: "",
        dni: 0,
        datoscompletos: {
          fkestado: 0,
          fechanacimiento: "1970-01-01"
        }
      },
      notificaciones: [
        /* {
          sistema: "Personal",
          icono: "far fa-chart-bar",
          notificaciones: [
            {
              titulo: "Te echamo",
              texto: "Esta todo mal y fuiste"
            }
          ]
        },
        {
          sistema: "Ordenamiento Urbano",
          icono: "fab fa-accessible-icon",
          notificaciones: [
            {
              titulo: "Tu auto esta mal estacionado",
              texto: "Arre"
            },
            {
              titulo: "Multado",
              texto: "jhJAHDHJASDkljhaskjdhkjashd HS JHkjahkjs dhkasj"
            }
          ]
        } */
      ],
      images: {
        bgLaCosta: require("@/assets/fondos/bg1.jpg"),
        // bgLaCosta: require("@/assets/img/fondo.jpg"),
        logoLaCosta: require("@/assets/img/logo.png")
      },
      navop: false,
      navopperfil: false,
      navopnoti: false,
      tiles: [],
      alertMsj:"",
      totalNotificaciones: 0
    };
  },
  computed: {
    tilesEscritorio: function() {
      return this.tiles.filter(function(u) {
        return u.pktile;
      });
    },
    totalNoti: function() {
      let totalNotificaciones = 0;
      this.notificaciones.map((v)=>{
        if(!v.leido) 
          totalNotificaciones++
      });
      return totalNotificaciones;
       
    }
  },
  watch: {
    
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Lato:300,400,400i,700,900&display=swap");
html {
  overflow: auto !important;
}
.v-application {
  font-family: "Lato", sans-serif !important;
}
.tile-label {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  position: absolute;
  width: 100%;
  bottom: 5px;
  text-align: center;
  line-height: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding: 5px;
}
.nav-barra {
  height: 40px;
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: #1b1b1b;
  z-index: 9999997;
}

.btn-start {
  position: relative;
  min-width: 40px !important;
  height: 100% !important;
  float: left;
  background-color: #1b1b1b !important;
  cursor: pointer;
  border-radius: 0 !important;
}
.btn-start:hover {
  box-shadow: inset 0 0 60px rgba(255, 255, 255, 0.3);
}
.btn-ventanas {
  position: relative;
  min-width: 40px !important;
  height: 100% !important;
  float: left;
  cursor: pointer;
}
.btn-start i.v-icon {
  color: #fff !important;
  line-height: 40px;
  text-align: center;
  width: 100%;
}

.contenedor-botones-start {
  position: absolute;
  bottom: 40px;
  left: 0;
  min-width: fit-content;
  /* max-width: 341px; */
  min-height: fit-content;
  /* max-height: 400px; */
  /* overflow: auto; */
  /* background-color: #0a4665; */
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.6px);
  -webkit-backdrop-filter: blur(8.6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px;
  display: none;
  color: #fff;
}

.btn-startlist {
  margin: 5px;
  float: left;
  position: relative;
}
.btn-metro-tile:hover::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 2px solid rgba(255, 255, 255, 0.6);
  z-index: 1;
}
.tile-icon {
  color: #fff !important;
  font-size: 30px !important;
  line-height: 70px !important;
  width: 100%;
}
.contenedor-botones-start.nav-open,
.contenedor-menu-avatar.nav-open,
.contenedor-menu-notificaciones.nav-open {
  display: block;
}
.contenedor-todo {
  background-size: cover !important;
}
.contenedor-todo:before {
    content: " ";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgb(0 0 0 / 55%);
    z-index: 0;
}
.logobg {
  /* width: 500px;
  left: calc(50% - 250px);
  top: calc(50% - 160px); */
  width: 250px;
  position: fixed;
  left: calc(50% - 125px);
  top: calc(50% - 83.305px);
}
.btn-ticket {
  margin: 4px;
  float: right;
}
.btn-avatar {
  float: right;
  margin: 6px;
  box-shadow: none !important;
  overflow: hidden;
}
.btn-avatar .v-btn__content {
  width: 32px;
}
.btn-avatar img {
  width: 100%;
}
.contenedor-menu-avatar {
  position: absolute;
  bottom: 40px;
  width: 350px;
  right: 0;
  height: 170px;
  overflow: auto;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.6px);
  -webkit-backdrop-filter: blur(8.6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 15px 0px 0px 15px;
  color: #fff;
  display: none;
  z-index: 2;
}
.contenedor-menu-avatar h1 {
  font-size: 18px;
}

.botonera-menu-avatar {
  list-style: none;
  padding: 0 !important;
  margin-top: 10px;
  font-size: 14px;
  line-height: 18px;
  font-weight: 100;
}
.botonera-menu-avatar li {
  cursor: pointer;
  width: fit-content;
}
.botonera-menu-avatar li:hover {
  color: #3472a5;
}
.img-perfil-contenedor {
  position: absolute;
  right: 0;
  height: 100%;
  top: 0;
  width: fit-content;
  max-width: 150px;
  overflow: hidden;
}
.img-perfil-contenedor img {
  height: 100%;
}
.btn-notificacion {
  margin: 4px;
  float: right;
}

.btn-notificacion i {
  font-size: 20px !important;
}
.not-num {
  position: absolute;
  top: -2px;
  right: 1px;
  background-color: #1a9296;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  font-size: 10px;
  line-height: 15px;
  text-align: center;
}
.contenedor-menu-notificaciones {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.6px);
  -webkit-backdrop-filter: blur(8.6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  height: calc(100% - 40px);
  overflow: auto;
  display: none;
}
.btn-notificacion {
  margin: 4px;
  float: right;
}

.btn-notificacion i {
  font-size: 20px !important;
}

.not-num {
  position: absolute;
  top: -2px;
  right: 1px;
  background-color: #1a9296;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  font-size: 10px;
  line-height: 15px;
  text-align: center;
}



.not-icono {
  text-align: center;
  width: 50px;
  height: 50px;
  background-color: #3b7c9e;
  float: left;
  position: relative;
}
.not-icono.nuevos:after {
    content: " ";
    background: #ff9800;
    width: 10px;
    height: 10px;
    position: absolute;
    border-radius: 50%;
    top: 10px;
    right: 10px;
}

.not-icono i {
  color: #fff !important;
  line-height: 50px !important;
}

.not-contenedor {
  padding: 20px;
  overflow: hidden;
}

.not-titulo h1 {
  font-size: 16px;
  float: left;
  line-height: 50px;
  margin-left: 10px;
  font-weight: 200;
}

.not-titulo {
  margin-bottom: 10px;
  overflow: hidden;
}

.not-texto {
  float: left;
  width: 100%;
  margin-top: 5px;
  cursor: pointer;
  padding: 5px 10px;
}
.not-texto:hover {
    background: rgb(255 255 255 / 0.1);
}
.not-texto h1 {
  font-size: 16px;
}

.not-texto p {
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 0 !important;
}
/* .img-perfil-contenedor:after {
    content: " ";
    position: absolute;
    bottom: 0;
    width: 100%;
    right: 0;
    top: 0;
    height: 100%;
    background: rgb(10,70,101);
    background: linear-gradient(90deg, rgba(10,70,101,1) 0%, rgba(10,70,101,0) 100%);
} */
.vue-grid-item.vue-grid-placeholder {
  display: none;
}
.vue-grid-layout {
  height: 89vh !important;
  overflow: hidden;
}

.barra-tareas {
  float: left;
  overflow: hidden;
  max-width: calc(100% - 150px);
}
.barra-tareas .btn-start {
  margin-left: 20px;
}
.btn-ventanas {
  position: relative;
  height: 45px !important;
  margin-left: 10px;
  color: rgba(255, 255, 255, 0.5) !important;
  padding: 0 0 0 10px !important;
  border-radius: 0 !important;
  box-shadow: inset 0 0 0px 500px rgba(0, 0, 0, 0.5);
  
}

.btn-ventanas span {
  font-size: 12px;
  font-weight: 300;
  padding: 0 10px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 1;
}
.ventana-oculta {
  display: none !important;
}
.btn-ventanas.barra-activa {
  /* background-color: rgba(255, 255, 255, 0.5) !important;
  color: #0a4665 !important; */
  color: #fff !important;
  box-shadow: inset 0 0 0px 500px rgba(0, 0, 0, 0.2);
}
.btn-ventanas.barra-activa span {
  font-weight: 500;
}
.btn-start-shortcut {
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  width: 24px;
  height: 24px;
  text-align: center;
  line-height: 19px;
  background-color: rgba(255, 255, 255, 0.50);
  cursor: pointer;
}
.btn-start-shortcut i {
  color: rgb(0, 0, 0)!important;
  font-size: 12px!important;
}
.v-snack {
  z-index: 9999998!important;
}
.btn-desktop {
    position: relative;
    width: 100px;
    height: 100px;
}
.input-subirimage {
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.input-subirimage .v-icon.v-icon.v-icon--link {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.input-subirimage .v-input__control {
    display: none;
}
.v-overlay--active {
  backdrop-filter: blur(5px);
}
.v-overlay__scrim {
  backdrop-filter: blur(1px);
}
.window-icon {
  font-size: 1.2em!important;
  margin: 0 5px;
}

.btn-menulist {
    position: relative;
    height: 40px;
    margin-bottom: 5px;
    width: 330px;
    cursor: pointer;
    transition: all 0.15s ease-in-out
}

.btn-menulist-color {
    width: 10px;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #fff;
}

.btn-menulist-color icon {
  font-size: 30px !important;
  line-height: 70px !important;
  width: 100%;
}

.btn-menulist-item i {
    float: left;
    width: 35px;
    height: 40px;
    font-size: 20px!important;
    margin-left: 10px;
}
.btn-menulist-item .v-icon {
    color: #fff;
}

.btn-menulist-label {
    float: left;
    margin: 7px 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 250px;
}

.btn-menulist:hover {
    background: rgb(255 255 255 / 25%);
}

.btn-menulist:before {
    content: " ";
    width: 100%;
    height: 1px;
    top: -3px;
    background: rgb(255,255,255);
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%);
    left: 0;
    position: absolute;
}
.btn-ventanas:after {
    content: "";
    width: 100%;
    height: calc(100% - 4px);
    position: absolute;
    top: 0px;
    left: 0;
    background-color: rgb(10 70 101);
    z-index: 0;
}

.btn-menulist-item {
    display: block;
    position: relative;
    height: 100%;
}
</style>
