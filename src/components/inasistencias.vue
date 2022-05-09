<template>

    <v-dialog
        v-model="dialoginasistencias"
        persistent
        class="desktop-dialog"
        
        @input="listadoInasistencias"
        >
        <!-- <v-toolbar dark color="primary">
            <v-toolbar-title>INASISTENCIAS</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs"
                        v-on="on" @click="cerrarInasistencias">
                        <v-icon>mdi-export</v-icon>
                        </v-btn>
                    </template>
                    <span>Cerrar Inasistencias</span>
                </v-tooltip>
            </v-toolbar-items>
        </v-toolbar> -->
        
        <v-card>
            <v-card-title>
                <span class="headline">Inasistencias</span>
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="buscarinasistencias"
                    append-icon="mdi-magnify"
                    label="Buscar"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-card-text>
                <v-container fluid>
                    <v-row>
                        <v-data-table
                        :headers="tablainasistencias"
                        :search="buscarinasistencias"
                        :items="inasistencias"
                        sort-by="periodo"
                        :itemsPerPage="5"
                        style="width: 100%;"
                        >

                            <template
                                v-slot:[`item.actions`]="{ item }"
                            >
                                <v-tooltip bottom>
                                    <template
                                        v-slot:activator="{ on, attrs }"
                                    >
                                        <v-icon
                                        v-bind="attrs"
                                        v-on="on"
                                        @click="CargarReclamo(item)"
                                        v-if="!item.motivo && !item.fkinasistencia"
                                        >
                                        mdi-bullhorn-outline
                                        </v-icon>
                                    </template>
                                    <span>Cargar Reclamo</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                    <template
                                        v-slot:activator="{ on, attrs }"
                                    >
                                        <v-btn
                                        v-bind="attrs"
                                        v-on="on"
                                        color="primary"
                                        small
                                        v-if="item.fkinasistencia && item.motivo "
                                        @click="Motivo(item)"
                                        >
                                        Motivo
                                        </v-btn>
                                    </template>
                                    <span>Ver Motivo</span>
                                </v-tooltip>
                            </template>
                            
                            <template v-slot:[`item.fecha_linda_inicio`]="{ item }">{{ item.fecha_inicio | moment("DD/MM/YYYY")}}</template>
                            <template v-slot:[`item.fecha_linda_fin`]="{ item }">{{ item.fecha_fin | moment("DD/MM/YYYY")}}</template>
                            <template v-slot:no-data>
                                <v-btn color="primary" @click="initialize"
                                >Cargar</v-btn
                                >
                            </template>
                        </v-data-table>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cerrarInasistencias">Cerrar</v-btn>
            </v-card-actions>
            <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="dialoginasistencias = false"
                >Cerrar</v-btn
            >
            </v-card-actions> -->
        </v-card>

        <v-dialog
        v-model="dialogvermotivo"
        persistent
        max-width="320"
        >
        <v-card>
            <v-card-title class="headline">
            Motivo
            </v-card-title>
            <v-card-text>
                {{this.vermotivo}}
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="green darken-1"
                text
                @click="dialogvermotivo = false"
            >
                Aceptar
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
        
        <v-dialog
        v-model="dialogreclamo"
        persistent
        max-width="600px"
        >
        <v-card>
            <v-card-title>
            <span class="headline">Reclamo de inasistencia</span>
            </v-card-title>
            <v-card-text>
                <v-form
                    ref="form"
                    v-model="validInasistencia"
                    lazy-validation
                >
                    <v-container>
                        <v-row>
                            <v-col
                                cols="12"
                                sm="6"
                                md="6"
                            >
                                <v-text-field
                                label="Teléfono"
                                v-model="reclamo.telefono"
                                :rules="[
                                    (v) =>
                                    !!v ||
                                    'Escriba el teléfono',
                                ]"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="6"
                                md="6"
                            >
                                <v-text-field
                                label="Email"
                                v-model="reclamo.mail"
                                :rules="[
                                    (v) =>
                                    !!v ||
                                    'Escriba el mail',
                                ]"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="6"
                                md="6"
                            >
                                <v-text-field
                                label="Localidad"
                                v-model="reclamo.localidad"
                                :rules="[
                                    (v) =>
                                    !!v ||
                                    'Escriba la localidad',
                                ]"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="6"
                                md="6"
                            >
                                <v-text-field
                                label="Calle"
                                v-model="reclamo.calle"
                                :rules="[
                                    (v) =>
                                    !!v ||
                                    'Escriba la calle',
                                ]"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="4"
                                md="4"
                            >
                                <v-text-field
                                label="Numero"
                                v-model="reclamo.numero"
                                :rules="[
                                    (v) =>
                                    !!v ||
                                    'Escriba el numero de calle',
                                ]"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="4"
                                md="4"
                            >
                                <v-text-field
                                label="Piso"
                                v-model="reclamo.piso"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col
                                cols="12"
                                sm="4"
                                md="4"
                            >
                                <v-text-field
                                label="Depto"
                                v-model="reclamo.depto"
                                required
                                ></v-text-field>
                            </v-col>
                            <v-col
                                md="12"
                            >
                                <v-textarea
                                placeholder="Escriba su descargo"
                                rows="1"
                                label="Descargo"
                                :rules="[
                                    (v) =>
                                    !!v ||
                                    'Escriba su descargo',
                                ]"
                                v-model="reclamo.descargo"
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="dialogreclamo = false"
            >
                Cerrar
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="GuardarReclamo()"
            >
                Guardar
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

    
</template>

<script>
  export default {
    props:{
        user:Object,
    },
    // mounted() {
    //     this.initialize();
    // },

    
    data: () => ({
        buscarinasistencias: "",
        dialogvermotivo:false,
        vermotivo:"",
        dialogreclamo: false,
        timeout:3000,
        snackbar:false,
        msj:"",
        dialoginasistencias: false,
        inasistencia:[],
        reclamo:{telefono:"", mail:"",localidad:"", calle:"", numero:"", piso:"", depto:"", descargo:""},

        validInasistencia: true,

        tablainasistencias: [
        { text: "FECHA/INICIO", align: "start", value: "fecha_linda_inicio" },
        { text: "FECHA/FIN", value: "fecha_linda_fin" },
        { text: "CAUSA", value: "causa" },
        { text: "OBSERVACIONES", value: "observaciones" },
        { text: "OPCIONES", value: "actions" },
        ],
        inasistencias: [],
        motivonuevo: "",
    }),

    methods: {

        initialize() {
            this.listadoInasistencias();
        },

        cerrarInasistencias(){
          this.dialoginasistencias = false;
        },

        listadoInasistencias() {
            
            console.log("dni", this.$props.user.dni)
            var obj = this;
            this.$http
            .post(`${this.$rrhh}listadoInasistenciasIndividual`, {dni: obj.$props.user.dni})
            .then(function(response) {
            console.log("listado inasistencias", response);
            obj.inasistencias = response.data;
            })
            .catch(function(error) {
            obj.msg = error;
            });
            
        },
        Motivo(item){
            this.vermotivo=item.motivo;
            this.dialogvermotivo=true;
        },

        CargarReclamo(item){
            this.inasistencia=item
            console.log(this.inasistencia);
            this.dialogreclamo=true;
        },

        GuardarReclamo(){
            // console.log("guardar reclamo",this.inasistencia);
            if (this.$refs.form.validate()) {
                var obj = this;
                this.$http
                .post(`${this.$rrhh}guardarReclamoInasistencia`, {pkreclamo: obj.inasistencia.pkinasistencia, reclamo: obj.reclamo})
                .then(function(response) {
                console.log("guardar reclamo", response);
                // obj.$emit("abrirsnack", "Licencia guardada con exito!!!")
                obj.msj="Reclamo guardado con exito!!!";
                obj.snackbar=true;
                obj.dialogreclamo=false;
                obj.reclamo={};
                })
                .catch(function(error) {
                obj.snackbar=true;
                obj.msj= error;
                });
            }
        }

        
    },
    computed: {
      
      
    },
    watch: {
      dialoginasistencias(){
        if(this.dialoginasistencias){
          this.listadoInasistencias();
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