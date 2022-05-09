<template>
<!-- <v-app> -->
  <v-dialog
    v-model="dialogticket"
    class="desktop-dialog"
    persistent
    width="900"
  >
    <v-card>
        <v-data-table
        :headers="headerstickets"
        :items="tickets"
        :search="buscartickets"
        sort-by="periodo"
        class="elevation-1"
        :itemsPerPage="5"
        >
            <template v-slot:top>
                <v-toolbar>
                    <v-toolbar-title
                        class="subheading font-weight-bold"
                        >TICKETS</v-toolbar-title
                    >
                    <v-text-field
                        style="margin-left: 222px;"
                        v-model="buscartickets"
                        append-icon="mdi-magnify"
                        label="Buscar"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-divider
                        class="mx-4"
                        inset
                        vertical
                    ></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="teal" @click="TraerAreas(),DialogNuevoTicket=true" rounded dark>Nuevo Ticket</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:[`item.estado`]="{ item }">
                <v-chip :color="colorcito(item.fkestado)">{{item.estado}}</v-chip>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="HistorialTicket(item)"
                        >
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </template>
                    <span>Ver Historial</span>
                </v-tooltip>
            </template>
        </v-data-table>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="dialogticket = false"
                >Cerrar</v-btn
            >
        </v-card-actions>
    </v-card>
    
    <v-dialog v-model="DialogNuevoTicket" width="700" persistent>
        <v-card>
        
            <v-card-title class="headline grey lighten-2">
                Nuevo Ticket
            </v-card-title>

            <v-card-text>
                <v-form ref="formticket" v-model="validformticket" lazy-validation>
                    <v-row>
                        <v-col cols="6">
                            <v-text-field
                                v-model="titulo"
                                label="Título"
                                :rules="[
                                (v) =>
                                !!v ||
                                'Falta el Título',
                                ]"
                                placeholder="-"
                                style="margin-top:10px;"
                                outlined
                                dense
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-autocomplete
                                v-model="area"
                                :items="areas"
                                placeholder="Seleccione un area"
                                item-text="area"
                                item-value="pkarea"
                                style="margin-top:10px;"
                                outlined
                                label="Area"
                                required
                                :rules="[
                                (v) =>
                                !!v ||
                                'Falta el area',
                                ]"
                            ></v-autocomplete> 
                        </v-col>
                        <v-col cols="12" style="margin-top: -30px;">
                            <v-textarea
                            outlined
                            v-model="descripcion"
                            label="Descripción"
                            :rules="[
                            (v) =>
                            !!v ||
                            'Falta la descripción',
                            ]"
                            placeholder="-"
                            required
                            ></v-textarea>
                        </v-col>
                        <v-col cols="6" style="margin-top: -30px;">
                            <v-file-input
                                label="Seleccione un archivo"
                                v-model="adjunto_archivo"
                                outlined
                                dense
                                @change="GuardarArchivo"
                                show-size
                                accept="image/png, image/jpeg, image/bmp, application/pdf,application/vnd.ms-excel"
                            ></v-file-input>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                color="primary"
                text
                @click="DialogNuevoTicket = false"
                >
                Cancelar
                </v-btn>
                <v-btn
                color="primary"
                @click="GuardarTicket()"
                >
                Guardar
                </v-btn>
            </v-card-actions>
        
        </v-card>
    </v-dialog>

    <v-dialog
        v-model="DialogDatosTicket"
        width="900"
        >
        <v-card>
            <v-card-title class="text-h5 grey">
            Datos Ticket
            </v-card-title>

            <v-card-text>
            <v-data-table
                fixed-header
                :headers="headersmovimientos"
                :items="movimientos"
                max-height= 300px
            >
            <template v-slot:[`item.usuario`]="{ item }">{{ item.apellido}} {{ item.nombre}}</template>
            <template v-slot:[`item.fecha_creacion`]="{ item }">{{ item.fecha_creacion | moment("DD/MM/YYYY")}}</template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom v-if="item.adjunto!=''">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                        icon
                        style="margin-left: 17px;"
                        v-bind="attrs"
                        v-on="on"
                        target="_blank"
                        @click="VerAdjunto(item)"
                        >
                            <v-icon>
                            mdi-file-document
                            </v-icon>
                        </v-btn>
                    </template>
                    <span>Ver Adjunto</span>
                </v-tooltip>
            </template>
            </v-data-table>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="DialogDatosTicket = false"
            >
                Cerrar
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

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
          Close
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
        this.initialize();
    },
    data: () => ({
        snackbar:false,
        msj:"",
        timeout:3000,
        dialogticket: false,
        headerstickets: [
            { text: 'Titulo', value: 'titulo' },
            { text: 'Descripcion', value: 'descripcion' },
            { text: 'Area', value: 'area' },
            { text: 'Estado', value: 'estado' },
            { text: 'Opciones', value: 'actions' }
            // { text: 'Estado', value: 'otorgadas' },
            // { text: 'Acciones', value: 'acciones' },
            ],
        tickets: [],
        buscartickets:"",
        DialogNuevoTicket:false,
        validformticket:true,
        areas:[],
        adjunto_archivo:[],
        titulo:"",
        descripcion:"",
        area:"",

        DialogDatosTicket:false,
        movimientos:[],
        headersmovimientos:[
            { text: 'Fecha', value: 'fecha_creacion' },
            { text: 'Usuario', value: 'usuario' },
            { text: 'Descripcion', value: 'descripcion' },
            { text: 'Estado', value: 'estado' },
            { text: 'Adjunto', value: 'actions' },
        ],
    }),
    methods: {
        initialize() {
            this.traerTickets();
        },
        traerTickets(){
            var obj = this;
            this.$http
            .post(`${this.$escritorio}traerTickets`, {dni: obj.$props.user.dni,usuario:true})
            .then(function(response) {
                obj.tickets = response.data;
                console.log("tickets", response);
            })
            .catch(function(error) {
                console.log(error);
            });
        },
        TraerAreas(){
            var obj = this;
            this.$http
            .post(`${this.$escritorio}traerAreas`)
            .then(function(response) {
                obj.areas = response.data;
                console.log("areas", response);
            })
            .catch(function(error) {
                console.log(error);
            });
        },
        GuardarArchivo(e){
            var reader = new FileReader()
            reader.readAsDataURL(e)
            reader.onload = ()=> {
            this.adjunto_archivo=reader.result;
            console.log("adjunto",this.adjunto_archivo);
            // this.GuardarPrueba();
            };
            
        },

        // GuardarPrueba(){
        //     this.$http
        //         .post(`${this.$escritorio}excel`,{adjunto:this.adjunto_archivo})
        //         .then(function(response) {
        //             console.log("guardar prueba", response);
        //         })
        //         .catch(function(error) {
        //             console.log(error);
        //         });
        // },
        GuardarTicket(){
            var obj = this;
            if (this.$refs.formticket.validate()) {
                this.$http
                .post(`${this.$escritorio}insertarTicket`,{titulo:this.titulo, descripcion:this.descripcion, area:this.area, adjunto:this.adjunto_archivo})
                .then(function(response) {
                    console.log("guardar ticket", response);
                    obj.msj="Ticket cargado con exito!!!";
                    obj.snackbar=true;
                    obj.traerTickets();
                    obj.DialogNuevoTicket=false;
                    obj.$refs.formticket.reset();
                })
                .catch(function(error) {
                    console.log(error);
                });
            }else{
                alert("Completar campos");
            }
        },

        HistorialTicket(item){
            var obj = this;
            this.$http
            .post(`${this.$escritorio}historialTicket`, {
                pkticket:item.pkticket
            })
            .then(function(response) {
            console.log("movimientos", response);
            obj.movimientos=response.data;
            obj.DialogDatosTicket=true;
            })
            .catch(function(error) {
            obj.msj = error;
            });
        },

        VerAdjunto(item) {
            var obj = this;
            let pdfWindow = window.open("")
            this.$http
                .post(`${this.$escritorio}verAdjunto`,{nombre_archivo:item.adjunto, pkticket:item.fkticket})
                .then(function(response) {
                console.log("ver pdf", response.data);
                var pdfResult = response.data.archivo;
                    pdfWindow.document.write("<iframe width='100%' height='100%' src='data:"+response.data.tipoarchivo+";base64, " + encodeURI(pdfResult) + "'></iframe>")
                })
                .catch(function(error) {
                obj.msj = error;
            });
        },

        colorcito(item){
            var colores = {
                1: "red lighten-4",
                2: 'yellow lighten-4',
                3: 'green lighten-4'
            }
            return colores[item]
        }
        
        
    },
    computed: {
      
    },
    watch: {
      dialogticket(){
        if(this.dialogticket){
          this.traerTickets();
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