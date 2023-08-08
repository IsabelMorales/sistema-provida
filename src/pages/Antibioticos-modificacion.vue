<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE ANTIBIOTICO -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              antibioticos
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
                <!-- NOMBRE DEL ANTIBIOTICO -->
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
    let codigo = ref(null);
    let nombre = ref(null);
    let antibiotico_id = {
      id_antibiotico: this.id,
    };
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    return {
      codigo,
      nombre,
      ip,
      antibiotico_id,
      acceso,
    };
  },

  methods: {
    // SE TRAE EL EXAMEN A MODIFICAR //
    async getAntibiotico() {
      let antibiotico = {
        id_antibiotico: this.id,
      };

      let datos = await axios.post(this.ip + "buscarAntibiotico", antibiotico);

      console.log(datos.data);
      this.nombre = datos.data[0].antibiotico_nombre;
    },

    // ENVIAR ANTIBIOTICO //
    onSubmit() {
      let num;
      if (this.create === "true") {
        num = 1;
      } else {
        num = 2;
      }

      console.log("elnum " + num);

      let antibiotico = {
        num,
        id_antibiotico: this.id,
        antibiotico_nombre: this.nombre,
      };

      console.log(antibiotico);
      console.log("ENVIADITTO");
      axios
        .post(this.ip + "configAntibioticos", antibiotico)
        .then((response) => {
          console.log(response);
          if (response.data === "MODIFICO!" || response.data === "AGREGO!") {
            this.$router.push({ name: "Antibioticos" });
          }
        })
        .catch((err) => console.log(err.message));
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Antibioticos");
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 10,
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
          id_tarea: 30,
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
    this.validar();
    if (this.create === "false") {
      this.getAntibiotico();
    }
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
