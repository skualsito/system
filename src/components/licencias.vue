<template>
<!-- <v-app> -->
  <v-dialog
    v-model="dialog"
    class="desktop-dialog"
    persistent
    
  >
    <v-card>
      <!-- <v-toolbar dark color="primary">
        <v-toolbar-title>LICENCIAS</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs"
                    v-on="on" @click="cerrarLicencias">
                    <v-icon>mdi-export</v-icon>
                    </v-btn>
                </template>
                <span>Cerrar Licencias</span>
            </v-tooltip>
        </v-toolbar-items>
        
      </v-toolbar> -->
      <v-card-title>
        <span class="headline">Licencias</span>
        <v-spacer></v-spacer>

        
          <!-- <template
            v-slot:activator="{ on, attrs }"
          > -->
            <v-btn @click="NuevaLicencia()" outlined 
              >Nueva licencia</v-btn
            >
          <!-- </template> -->
        <v-dialog v-model="dialogNl" width="500">
          <v-card>
            <v-card-title>
              Solicitud de Licencia 
            </v-card-title>

            <v-card-text>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-select
                  v-model="sTlicencia"
                  :items="itemsTipo"
                  item-text="tipo"
                  item-value="pktipo"
                  :rules="[
                    (v) =>
                      !!v ||
                      'Seleccione un Tipo de Licencia',
                  ]"
                  label="Tipo Licencia"
                  required
                  @change="cantidad=0, sClicencia=0, adjunto_archivo=null"
                ></v-select>
                <v-file-input
                    v-if="sTlicencia==7"
                    style="margin-top: 17px;"
                    label="Seleccione un archivo"
                    v-model="adjunto_archivo"
                    outlined
                    dense
                ></v-file-input>
                <v-menu
                  v-model="menuFilicencia"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template
                    v-slot:activator="{ on, attrs }"
                  >
                    <v-text-field
                      v-model="computediFilicencia"
                      label="Fecha de Inicio de la Licencia"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[
                        (v) =>
                          !!v ||
                          'Seleccione Fecha inicio',
                      ]"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="iFilicencia"
                    @input="menuFilicencia = false"
                    locale="es-ES"
                  ></v-date-picker>
                </v-menu>

                <v-select
                  v-if="sTlicencia==1"
                  v-model="sClicencia"
                  :items="itemsCantidad"
                  :rules="[
                    (v) =>
                      !!v ||
                      'Seleccione cantidad de dias',
                  ]"
                  label="Cantidad de dias"
                  required
                ></v-select>

                <v-text-field
                  v-if="sTlicencia!=1"
                  type= "number"
                  v-model="cantidad"
                  label="Cantidad de dias"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="iFflicencia"
                  label="Fecha de Fin de la Licencia"
                  required
                  disabled
                ></v-text-field>

                <v-file-input
                  show-size
                  v-if="sTlicencia!=1"
                  v-model="adjunto"
                  label="Adjuntar archivo"
                ></v-file-input>
              </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="danger"
                text
                @click="dialogNl = false"
              >
                Cerrar
              </v-btn>
              <v-btn
                color="success"
                text
                @click="guardarLicencia()"
              >
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-dialog
            v-model="dialogconfirmarlicencia"
            persistent
            max-width="435"
          >
            <v-card>
              <v-card-title class="headline">
                <div>
                <p>Sujeto a aprobacion.</p>
                <p>Se informará en las proximas 48 hs.</p>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="green darken-1"
                  text
                  @click="dialogconfirmarlicencia = false"
                >
                  ACEPTAR
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> 
        </v-dialog>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <!-- <div cols="12"> -->
            <v-row>
              <v-col md="6" >
                <v-card outlined >
                  <v-card-title>
                    Historial de Licencias
                  </v-card-title>
                  <v-card-text>
                    <v-container fluid>
                      <v-row>
                        <v-data-table
                          :headers="headershistorial"
                          :items="historial"
                          :items-per-page="5"
                          style="width: 100%;"
                        >
                          <template
                            v-slot:[`item.otorgadas`]="{
                              item,
                            }"
                          >
                            <span
                              :class="
                                item.otorgadas == 'O'
                                  ? 'green--text'
                                  : 'orange--text'
                              "
                              >{{
                                item.otorgadas == "O"
                                  ? "Otorgado"
                                  : "Pendiente"
                              }}</span
                            >
                          </template>
                          <template
                            v-slot:[`item.periodo`]="{
                              item,
                            }"
                          >
                            <span
                              >{{
                                fechitaLinda(
                                  item.fecha_desde
                                )
                              }}
                              hasta
                              {{
                                fechitaLinda(
                                  item.fecha_hasta
                                )
                              }}</span
                            >
                          </template>
                          <template
                            v-slot:[`item.fecha_solicitud`]="{
                              item,
                            }"
                          >
                            <span>{{
                              fechitaLinda(
                                item.fecha_solicitud
                              )
                            }}</span>
                          </template>

                          <template
                            v-slot:[`item.acciones`]="{
                              item,
                            }"
                          >
                            <v-tooltip
                              top
                              v-if="item.otorgadas == 'P'"
                            >
                              <template
                                v-slot:activator="{
                                  on,
                                  attrs,
                                }"
                              >
                                <v-icon
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="pdfLicencia(item)"
                                >
                                  mdi-printer
                                </v-icon>
                              </template>
                              <span>Imprimir</span>
                            </v-tooltip>
                          </template>
                        </v-data-table>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                md="6"
              >
                <v-card outlined >
                  <v-card-title>
                    Vacaciones Pendientes
                  </v-card-title>
                  <v-card-text>
                    <v-container fluid>
                      <v-row>
                        <v-data-table
                          :headers="headerspendientes"
                          :items="pendientes"
                          :items-per-page="5"
                          style="width: 100%;"
                        >
                          <template
                            v-slot:[`item.anio_vencimiento`]="{
                              item,
                            }"
                          >
                            <span
                              >31/12/{{
                                item.anio_vencimiento
                              }}</span
                            >
                          </template>
                        </v-data-table>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          <!-- </div> -->
        </v-container>
      </v-card-text>
      <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrarLicencias">Cerrar</v-btn>
      </v-card-actions>
      <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="cerrarLicencias"
          >Cerrar</v-btn
        >
      </v-card-actions> -->
    </v-card>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
    >
      {{ msj }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-dialog>

  

<!-- </v-app> -->
</template>

<script>
  export default {
    props:{
          user:Object,
    },
    mounted() {

    },
    data: () => ({
      adjunto_archivo:null,
      cantidad:0,
      dialogconfirmarlicencia: false,
      timeout:3000,
      snackbar:false,
      msj:"",
      dialog: false,
      dialogNl: false,
      menuFilicencia: false,
      valid: true,
      sTlicencia: null,
      iFilicencia: new Date().toISOString().substr(0, 10),
      sClicencia: 0,
      adjunto:"",
      itemsTipo: [],
      itemsCantidad: [
        '7',
        '14',
        '21'
      ],
      headershistorial: [
          { text: 'Fecha', value: 'fecha_solicitud' },
          { text: 'Tipo', value: 'tipo' },
          { text: 'Período', value: 'periodo' },
          { text: 'Estado', value: 'otorgadas' },
          { text: 'Acciones', value: 'acciones' },
        ],
      historial: [
          
      ],
      headerspendientes: [
        { text: 'Período', value: 'periodo' },
        { text: 'Días', value: 'dias' },
        { text: 'Vencimiento', value: 'anio_vencimiento' },
      ],
      pendientes: [
        
      ],
    }),
    methods: {
        formatDate (date) {
          if (!date) return null

          const [year, month, day] = date.split('-')
          return `${day}/${month}/${year}`
        },
        fechitaLinda(date) {
          if (!date) return null
          date = new Date(date);
          return date.toLocaleDateString();
        },
        guardarLicencia() {
          var obj = this;
          let formData = new FormData();
          formData.append("archivo", this.adjunto_archivo)
          formData.append("dni", this.user.dni)
          formData.append("tipo", this.sTlicencia)
          formData.append("fechadesde", this.computediFilicencia)
          formData.append("fechahasta", this.iFflicencia)
          console.log("formdataaaa", formData)
          // console.log("adjunto",this.adjunto)
          if (this.$refs.form.validate()) {
            if(this.adjunto_archivo){
              this.$http
              .post(`${this.$rrhh}guardarLicenciaMedicinaLaboral`,formData, {headers:{"Content-Type":"multipart/form-data"}})
              .then(function(response) {
                console.log("guardar licencia con archivo", response);
                obj.msj="Licencia guardada con exito!!!";
                obj.snackbar=true;
                obj.traerLicencias();
                obj.dialogNl=false;
                obj.dialogconfirmarlicencia=true;
              })
              .catch(function(error) {
                obj.snackbar=true;
                obj.msj= error;
              });
              // console.log("archivo lleno",this.adjunto_archivo);
            }else{
              this.$http
              .post(`${this.$rrhh}guardarLicencia`, {dni: this.user.dni, tipo: this.sTlicencia, fechadesde: this.computediFilicencia, fechahasta: this.iFflicencia})
              .then(function(response) {
                if(response.data){
                  console.log("guardar licencia", response);
                  obj.msj="Licencia cargada con exito!!!";
                  obj.snackbar=true;
                  obj.traerLicencias();
                  obj.dialogNl=false;
                  obj.dialogconfirmarlicencia=true;
                }else{
                  obj.msj="Error en la carga, comunicarse con personal.";
                  obj.snackbar=true;
                  obj.dialogNl=false;
                }
                
              })
              .catch(function(error) {
                obj.snackbar=true;
                obj.msj= error;
              });
              // alert("archivo vacio"+this.adjunto_archivo);
            }
          }
        },

        NuevaLicencia(){
          this.dialogNl=true;
          this.TraerTiposLicencias();
        },

        TraerTiposLicencias(){
          console.log("la concha de tu madre");
          var obj = this;
            this.$http
            .post(`${this.$rrhh}tiposLicencias`)
            .then(function(response) {
              console.log("Tipos de licencia" , response);
              obj.itemsTipo = response.data;
            })
            .catch(function(error) {
              obj.msg = error;
            });
        },
        cerrarLicencias(){
          this.dialog = false;
        },
        traerLicencias(){
            var obj = this;
            console.log("dni traer licencias", obj.$props.user.dni);
            this.$http
            .post(`${this.$rrhh}listadoLicencias`, {dni: obj.$props.user.dni})
            .then(function(response) {
                console.log(response);
                obj.historial = response.data;
                obj.$http
                .post(`${obj.$rrhh}listadoVacacionesPendientes`, {dni: obj.$props.user.dni})
                .then(function(response) {
                    obj.pendientes = response.data;

                })
                .catch(function(error) {
                    console.log(error);
                });

            })
            .catch(function(error) {
                console.log(error);
            });
        },

        pdfLicencia(item){

          console.log("pdf licencia", item)
          this.$http({
              url:
              this.$api +
              "pdf/imprimir_licencia.php?pk=" +
              item.pksolicitud +
              "&designado=ADMIN", // download url
              method: "post",
              headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              mode: "no-cors",
              },
              responseType: "blob", //QUEREMOS QUE NOS DEVUELVA UN BLOB (ARCHIVO CRUDO)
          })
              .then((response) => response)
              .then((response) => {
              var reader = new FileReader(); //CREAMOS UN LECTOR DE ARCHIVOS

              reader.onload = function() {
                  // ESTA FUNCION SE VA A EJECUTAR CUANDO EL LECTOR LEA UN ARCHIVO
                  var dataUrl = reader.result; //ACA TENEMOS EL BLOB EN base64
                  let msg = { tipo: "pdf", data: dataUrl }; //CREAMOS EL MENSAJE, DE TIPO pdf Y LE ADJUNTAMOS EL b64

                  window.parent.postMessage(JSON.stringify(msg), "*"); //ENVIAMOS EL MENSAJE AL ESCRITORIO
              };
              window.open(window.URL.createObjectURL(response.data))//PARA QUE FUNCIONE EN EL DE PRUEBA
              // reader.readAsDataURL(response.data); //LE DECIMOS QUE LEA EL BLOB
              });
        },
        
    },
    computed: {
      computediFilicencia () {
        return this.formatDate(this.iFilicencia)
      },
      iFflicencia () {
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        var date = new Date(this.iFilicencia);
        
        var dFinal = date.addDays(parseInt((this.sClicencia != '') ? this.sClicencia : this.cantidad)-1);
        // var dFinal2 = date.addDays(parseInt(this.cantidad)-1);
        return this.formatDate(dFinal.toISOString().substr(0, 10));
      },
      
    },
    watch: {
      dialog(){
        if(this.dialog){
          this.traerLicencias();
        }
      }
    }
}
</script>
<style>
.desktop-dialog{
    z-index: 9999999!important;
}
</style>