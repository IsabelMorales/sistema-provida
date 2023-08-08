<template>
  <q-page class="flex flex-center">
    <q-dialog v-model="inicioSesion" persistent>
      <q-card>
        <q-form @submit="onSubmit">
          <q-card-section>
            <div class="row">
              <div class="col-12 text-center">
                <div class="text-subtitle1">BIENVENIDO</div>
              </div>
            </div>

            <div class="row justify-center q-mt-md q-mx-md">
              <div class="col-9 q-mb-md">
                <q-input
                  v-model="usuario"
                  label="USUARIO"
                  class="text-uppercase"
                  autofocus
                />
                <!---<q-select
                  emit-value
                  map-options
                  option-value="usuario_username"
                  option-label="usuario_username"
                  v-model="usuario"
                  :options="usuariosData"
                  label="USUARIO"
                  autofocus
                />-->
              </div>
              <div class="col-9">
                <q-input
                  v-model="contrasena"
                  label="CONTRASEÑA"
                  :type="isPwd ? 'password' : 'text'"
                  @keydown.tab.prevent="onSubmit()"
                  @keyup.enter="onSubmit()"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-actions align="center" class="q-mb-sm">
            <!-- INICIAR SESION -->
            <q-btn
              unelevated
              label="Iniciar sesion"
              color="primary"
              class="q-mr-md"
              @click="onSubmit()"
            >
            </q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="noExiste" persistent>
      <q-card>
        <q-card-section>
          <div class="row justify-center">
            <div class="col-9 text-center q-px-md">
              <div class="text-h6">
                EL USUARIO O LA CONTRASEÑA NO SON VALIDOS
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-mb-sm">
          <q-btn
            unelevated
            label="Ok"
            color="primary"
            class="q-mr-md"
            v-close-popup
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "PageIndex",

  data() {
    let inicioSesion = ref(true);
    let noExiste = ref(false);
    let usuario = ref(null);
    let contrasena = ref(null);
    let usuariosData = ref(null);

    const ip = process.env.BASE_URL;

    return {
      inicioSesion,
      ip,
      usuario,
      contrasena,
      noExiste,
      isPwd: ref(true),
      id: 0,
      usuariosData,
    };
  },

  methods: {
    async onSubmit() {
      let usuario = {
        usuario_username: this.usuario,
        usuario_password: this.contrasena,
      };

      let datos = await axios.post(this.ip + "login", usuario);
      console.log(datos.data);

      if (datos.data == 0) {
        this.noExiste = true;
      } else {
        localStorage.name = datos.data.usuario_username;
        localStorage.id = datos.data.id_usuario;
        localStorage.rol = datos.data.id_rol;
        localStorage.token = datos.data.token;
        this.id = localStorage.id;

        console.log(localStorage);
        this.inicioSesion = false;
      }
    },

    async verificador() {
      let token = {
        token: localStorage.token,
      };

      console.log(token);

      let datos = await axios.post(this.ip + "verificarToken", token);
      console.log(datos.data);

      if (datos.data == "x") {
        localStorage.clear();
        this.$router.go();
      }
    },

    getUsuarios() {
      axios.get(this.ip + "usuarios").then((response) => {
        this.usuariosData = response.data;
        console.log("EL ROW.VALUES", this.usuariosData);
      });
    },
  },

  created() {
    this.getUsuarios();
    console.log(localStorage);
    this.verificador();

    if (localStorage.token) {
      this.inicioSesion = false;
    }
  },
});
</script>
