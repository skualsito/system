<template>

      <v-dialog v-model="dialog"
      class="desktop-dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      >

      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog=false, modificarperfil=0">
            <v-icon>mdi-export</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
            <v-row>
              <v-col cols="3">
                <v-card style="height: 339px;">
                  <v-card-title class="blue-grey" style="height: 70px; padding: 5px;">
                    <v-list-item>
                      <v-list-item-content style="padding: 0">
                        <v-list-item-title class="title" style="margin-left: 0px; color:white;">Juan Almada</v-list-item-title>
                        <v-list-item-subtitle style="color:white;">Atr o no</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card-title>
                  <v-card-text>
                    <v-row justify="center">
                      <v-col cols="9">
                      <v-avatar
                        class="profile"
                        color="grey"
                        size="164"
                        width="100%"
                        tile
                      >
                        <v-img :src="require('@/assets/img/profile-placeholder.png')"></v-img>
                      </v-avatar>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-switch
                      style="margin-left:10px;"
                      v-model="$vuetify.theme.dark"
                      label="Modo oscuro"
                      @change="cambiarTema"
                    ></v-switch>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="9">
                <v-card>
                <v-form
                  ref="form"
                  v-model="validPerfil"
                  lazy-validation
                >
                  <v-card-title class="blue-grey" style="height: 70px; padding: 5px;">

                    <span class="headline" style="margin-left: 0px; color:white;">Datos Personales</span>
                    <v-spacer></v-spacer>
                  </v-card-title>

                  <v-card-text style="min-height:133px;">
                    <v-row style="margin-top: 10px;">
                      <v-col
                          md="3"
                      >
                          <v-text-field
                          label="DNI"
                          type="number"
                          onkeyup="(this.value.length < 8) ? this.value : this.value = this.value.slice(0, 8);"
                          readonly
                          outlined
                          ></v-text-field>
                      </v-col>
                      <v-col
                          md="3"
                      >
                          <v-text-field
                          label="Email"
                          placeholder="-"
                          outlined
                          ></v-text-field>
                      </v-col>
                      <v-col
                          md="3"
                          style="margin-top: -10px;"
                      >
                          <v-menu
                            ref="menu2"
                            v-model="menu2"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                label="Fecha Nacimiento"
                                prepend-icon="mdi-calendar"
                                v-bind="attrs"
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              ref="picker"
                              :max="new Date().toISOString().substr(0, 10)"
                              min="1950-01-01"
                            ></v-date-picker>
                          </v-menu>


                      </v-col>
                      <v-col
                          md="3"
                          style="margin-top: -8px;"
                      >
                          <b>Estado Civil</b>
                          <v-autocomplete
                            autocomplete="off"
                            style="margin-top: -20px;"
                            item-text="estadocivil"
                            item-value="pkestadocivil"
                            placeholder="Seleccione el estado civil"
                          ></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-row style="margin-top: -30px;">
                      <v-col
                          md="3"
                      >
                          <v-text-field
                          label="Nacionalidad"
                          placeholder="-"
                          outlined
                          ></v-text-field>
                      </v-col>
                      <v-col
                          md="3"
                      >
                          <v-text-field
                          label="Localidad"
                          placeholder="-"
                          outlined
                          ></v-text-field>
                      </v-col>
                      <v-col
                          md="2"
                      >
                          <v-text-field
                          label="Calle"
                          placeholder="-"
                          outlined
                          ></v-text-field>
                      </v-col>
                      <v-col
                          md="2"
                      >
                          <v-text-field
                          label="Numero"
                          placeholder="-"
                          outlined
                          ></v-text-field>
                      </v-col>
                      <v-col
                          md="1"
                      >
                          <v-text-field
                          label="Piso"
                          placeholder="-"
                          outlined
                          ></v-text-field>
                      </v-col>
                      <v-col
                          md="1"
                      >
                          <v-text-field
                          label="Depto"
                          placeholder="-"
                          outlined
                          ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row style="margin-top: -40px;">
                      <v-col
                          md="3"
                      >
                          <b>Nivel Educacional</b>
                          <v-autocomplete
                            autocomplete="off"
                            style="margin-top: -10px;"
                            item-text="niveleducacional"
                            item-value="pkniveleducacional"
                            placeholder="Seleccione el nivel educacional"
                          ></v-autocomplete>
                      </v-col>
                      <v-col
                          md="4"
                      > 
                      <b>Telefono</b>
                        <v-row>
                          <v-col
                            md="4"
                          > 
                          <v-text-field
                          label="Prefijo"
                          placeholder="-"
                          outlined
                          ></v-text-field>
                          </v-col>
                          <v-col
                            md="8"
                          > 
                          <v-text-field
                          label="Numero"
                          placeholder="-"
                          outlined
                          ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>

                      <v-col
                          md="4"
                      >
                          <b>Celular</b>
                          <v-row>
                            <v-col
                              md="4"
                            > 
                            <v-text-field
                            label="Prefijo"
                            placeholder="-"
                            outlined
                            ></v-text-field>
                            </v-col>
                            <v-col
                              md="8"
                            > 
                            <v-text-field
                            label="Numero"
                            placeholder="-"
                            outlined
                            ></v-text-field>
                            </v-col>
                          </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  </v-form>
                </v-card>
              </v-col>
              

            </v-row>



          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary">Guardar</v-btn>
          </v-card-actions>

          
        </v-card-text>
        
        <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
        top
        >
        {{ msj }}

          <template v-slot:action="{ attrs }">
              <v-btn
              color="blue"
              text
              v-bind="attrs"
              @click="snackbar = false"
              >
              Close
              </v-btn>
          </template>
        </v-snackbar>

      </v-card>
    </v-dialog>
</template>
<script>
  import moment from 'moment'
  export default {
    
    props:{
      user:Object,
    },

    data: () => ({
      dialog: false,
      snackbar:false,
      menu2:"",
      timeout: 3000,
      validPerfil: true,
      msj: ""
    }),

    methods: {

      cambiarTema(){
        let v = this.$vuetify.theme.dark;
        localStorage.setItem("dm", (v) ? 1 : 0);
      },
      cerrarPerfil(){
        this.dialog = false;
      },


      moment:function(){
        return moment();
      }
        
    },


    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
      menu2 (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },

}
</script>
<style>
.desktop-dialog{
    z-index: 9999999!important;
}
.v-text-field--outlined > .v-input__control > .v-input__slot{
    min-height: 35px;
}
.v-dialog--persistent{
  margin-top:-20px;
}
</style>