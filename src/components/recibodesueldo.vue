<template>
    <v-dialog v-model="dialog" persistent class="desktop-dialog">
      <v-card>
        <v-card-title>
          <span class="headline">Recibos de Sueldo</span>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
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
                :search="search"
                :headers="headers"
                :items="recibos"
                :items-per-page="5"
                :sort-by="['Periodo']"
                :sort-desc="[true]"
                style="width: 100%;"
              >
              <template v-slot:[`item.neto`]="{ item }">
                $ {{formatPrice(item.neto)}}
              </template>
              <template v-slot:[`item.haberes`]="{ item }">
                $ {{formatPrice(item.haberes)}}
              </template>
              <template v-slot:[`item.descuentos`]="{ item }">
                $ {{formatPrice(item.descuentos)}}
              </template>
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      @click="abrirRecibo(item)"
                    >
                      mdi-eye
                    </v-icon>
                  </template>
                  <span>Ver</span>
                </v-tooltip>
              </template>
              </v-data-table>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrarRecibo">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
  export default {
    props:{
          user:Object,
    },
    created() {
    },
    data: () => ({
      dialog: false,
      search: '',
      headers: [
          { text: 'Período', value: 'Periodo' },
          { text: 'Categoría', value: 'categoria' },
          { text: 'Dependencia', value: 'dependencia' },
          { text: 'Haberes', value: 'haberes' },
          { text: 'Descuentos', value: 'descuentos' },
          { text: 'Neto', value: 'neto' },
          { text: 'Acciones', value: 'acciones' },
        ],
        recibos: [
          {
          },
          
        ],

    }),
    methods: {
        traerSueldos(){
            var obj = this;
            this.$http
                .post(`${this.$rrhh}listadoRecibosSueldo`, {dni: obj.$props.user.dni})
                .then(function(response) {
                    obj.recibos = response.data;
                    console.log("recibos", response);
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        abrirRecibo(item){
            this.$http
                .post(`${this.$pdf}imprimir_recibo.php?pk=${item.CtrlRecibo}`,{},{responseType: "blob", headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          mode: "no-cors",
        }})
                .then(function(response) {
                    let urlPdf =  window.URL.createObjectURL(response.data);
                    window.open(urlPdf);

                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        cerrarRecibo(){
          this.dialog = false;
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        
    },
    computed: {
      passRules () {
        const rules = [v => !!v || 'Contraseña nueva requerida'];

        if (this.passnueva1 && this.passnueva2) {
          const rule =
            this.passnueva1 === this.passnueva2 ||
              'Las contraseñas no coinciden'

          rules.push(rule)
        }

        return rules
      }
    },
    watch: {
      dialog(){
        if(this.dialog){
          this.traerSueldos();
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