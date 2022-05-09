<template>
    <v-dialog v-model="dialog" persistent max-width="600px" class="desktop-dialog">
      <v-card>
        <v-card-title>
          <span class="headline">Cambiar Contraseña</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
            >
                <v-row>
                    
                        <v-col cols="12">   
                            <v-text-field 
                              label="Contraseña actual" 
                              v-model="passactu" 
                              :rules="[v => !!v || 'Contraseña actual requerida']" 
                              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                              @click:append="show1 = !show1"
                              :type="show1 ? 'text' : 'password'" 
                              required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field 
                            label="Contraseña nueva" 
                            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="show2 = !show2"
                            :type="show2 ? 'text' : 'password'"  
                            v-model="passnueva1" 
                            :rules="passRules" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field label="Repetir nueva contraseña" 
                            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                            @click:append="show3 = !show3"
                            :type="show3 ? 'text' : 'password'"  
                            v-model="passnueva2" 
                            :rules="passRules" required></v-text-field>
                        </v-col>
                </v-row>
            </v-form>

          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrarContra">Cerrar</v-btn>
          <v-btn color="blue darken-1" text @click="guardarContra">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
  export default {
    data: () => ({
      dialog: false,
      valid: true,
      passactu: '',
      passnueva1: '',
      passnueva2: '',
      show1: false,
      show2: false,
      show3: false,

    }),
    methods: {
        guardarContra(){
          console.log("eso");
        },
        cerrarContra(){
          this.$refs.form.reset(); 
          this.$refs.form.resetValidation();
          this.dialog = false;
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
  }
}
</script>
<style>
.desktop-dialog{
    z-index: 9999999!important;
}
</style>