<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE BACTERIA -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              bacterias
            </div>
          </q-card-section>
          <q-separator />

          <q-card-section>
            <q-form
              @submit="onSubmit"
              @reset="onCancel"
              class="q-gutter-sm q-ml-lg"
            >
              <div class="row">
                <!-- NOMBRE DE LA BACTERIA -->
                <div class="col-4">
                  <q-input
                    v-model="nombre"
                    type="text"
                    label="Nombre"
                    class="q-ml-xl"
                  />
                </div>
              </div>

              <div class="row justify-end">
                <div class="col-3 q-gutter-x-xl q-mt-lg">
                  <!-- BOTON CANCELAR -->
                  <q-btn
                    label="Cancelar"
                    type="reset"
                    color="grey-9"
                    flat
                    class="q-ml-sm"
                    @click="onCancel()"
                  />

                  <!-- BOTON GUARDAR -->
                  <q-btn
                    v-if="this.create === 'false'"
                    label="Guardar"
                    type="submit"
                    color="primary"
                  />

                  <!-- BOTON CREAR -->
                  <q-btn
                    v-if="this.create === 'true'"
                    label="Crear"
                    type="submit"
                    color="primary"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>

  <q-page padding v-else-if="this.getAcceso == 0">
    <div class="fit row justify-center text-center">
      <div class="col-5">
        <div class="q-pa-md">
          <q-card>
            <q-card-section class="row items-center justify-center q-ma-md">
              <div class="col-12">
                <q-avatar icon="close" color="red-14" text-color="white" />
              </div>
              <div class="col-12 q-mt-sm">
                <div class="text-h5">¡ADVERTENCIA!</div>
              </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h6 q-mb-md">
                No tiene permitido entrar a esta seccion.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>

  <q-page padding v-else> </q-page>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  props: ["id", "create"],

  data() {
    let bacteria;
    let nombre = ref(null);
    let bacteria_id = {
      id_bacteria: this.id,
    };
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    return {
      bacteria,
      nombre,
      ip,
      bacteria_id,
      acceso,
    };
  },

  methods: {
    // SE TRAE LA BACTERIA A MODIFICAR //
    async getBacteria() {
      console.log("el id", this.id);
      let bacteria = {
        id_bacteria: parseInt(this.id),
      };

      let datos = await axios.post(this.ip + "buscarBacteria", bacteria);

      console.log("la bacteria", datos.data);
      this.nombre = datos.data[0].bacteria_nombre;
    },

    // ENVIAR BACTERIA //
    onSubmit() {
      let num;
      if (this.create === "true") {
        num = 1;
      } else {
        num = 2;
      }
      console.log("elnum " + num);

      let bacteria = {
        num,
        id_bacteria: this.id,
        bacteria_nombre: this.nombre,
      };

      console.log(bacteria);
      console.log("ENVIADITTO");
      axios
        .post(this.ip + "configBacterias", bacteria)
        .then((response) => {
          console.log(response);
          if (response.data === 1) {
            this.$router.push({ name: "Bacterias" });
          }
        })
        .catch((err) => console.log(err.message));
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Bacterias");
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 9,
          token: localStorage.token,
        };

        axios
          .post(this.ip + "accesoAControladores", usuario)
          .then((response) => {
            console.log("EL RESPONSE", response.data);

            if (response.data == "x") {
              localStorage.clear();
              window.location = "/";
            } else {
              this.acceso = response.data;
            }
          });
      } else {
        //VERIFICACION DE MODIFICACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 29,
          token: localStorage.token,
        };

        axios
          .post(this.ip + "accesoAControladores", usuario)
          .then((response) => {
            console.log("EL RESPONSE", response.data);

            if (response.data == "x") {
              localStorage.clear();
              window.location = "/";
            } else {
              this.acceso = response.data;
            }
          });
      }
    },
  },

  created() {
    if (this.create === "false") {
      this.getBacteria();
    }
    this.validar();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
