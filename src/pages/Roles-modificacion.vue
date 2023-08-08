<template>
  <q-page padding v-if="this.acceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE PERFIL -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              roles
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
                <!-- NOMBRE DEL PERFIL -->
                <div class="col-4">
                  <q-input
                    v-model="nombre"
                    type="text"
                    label="Nombre"
                    class="q-ml-xl text-uppercase"
                  />
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <!-- TABLA DE EXAMENES PERTENECIENTES AL PERFIL -->

              <div class="row">
                <div class="col-12">
                  <div class="text-h6 q-ml-sm q-mb-sm">Tareas</div>
                </div>
                <div
                  class="col-4"
                  v-for="tarea in tareas"
                  :key="tarea.id_tarea"
                >
                  <q-checkbox
                    v-model="selection"
                    :val="tarea"
                    :label="tarea.tarea_nombre"
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
    let nombre = ref(null);
    const loading = ref(true);
    const carga = ref(true);
    let confirm = ref(false);
    let tareas = ref([]);
    let selection = ref([]);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    // SE TRAE LA LISTA DE EXAMENES //
    axios
      .get(ip + "tareas")
      .then((response) => {
        console.log("las tareas", response.data, this.create);
        tareas.value = response.data;
        /*rows_examenes.value = response.data;
        console.log(rows_examenes.value);*/
      })
      .finally(() => {
        carga.value = false;
      });

    // SE TRAE LAS PERTENECIENTES AL ROL //
    /*axios
      .post(ip + "perfilExamenes", id)
      .then((response) => {
        rows.value = response.data;
        console.log(rows.value);
      })
      .finally(() => {
        loading.value = false;
      });*/

    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      nombre,
      ip,
      loading,
      confirm,
      carga,
      tareas,
      selection,
      acceso,
    };
  },

  methods: {
    // ENVIAR PERFIL //
    onSubmit() {
      let num = 1;

      console.log("elnum ", num);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.rows[0].id_examen);
      for (let i = 0; i < this.rows.length; i++) {
        this.idExamen.push({
          idExamen: this.rows[i].id_examen,
        });
      }

      let perfil = {
        num,
        id_perfil: this.id,
        perfil_nombre: this.nombre.toUpperCase(),
        examenes: this.idExamen,
      };

      console.log(perfil);
      console.log("EL ID EXAMEN EN JSONS", this.idExamen);
      console.log("ENVIADITTO");
      if (this.create === "true") {
        axios
          .post(this.ip + "configPerfiles", perfil)
          .then((response) => {
            console.log("el response", response.data);
            if (response.data === "MODIFICO!" || response.data === "AGREGO!") {
              this.$router.push({ name: "Perfiles" });
            }
          })
          .catch((err) => console.log(err.message));
      } else {
        axios
          .post(this.ip + "configPerfilExamenes", perfil)
          .then((response) => {
            console.log("el response", response.data);
            if (response.data === "MODIFICO!" || response.data === "AGREGO!") {
              this.$router.push({ name: "Perfiles" });
            }
          })
          .catch((err) => console.log(err.message));
      }
    },

    getTareas() {
      let usuario = {
        id_rol: this.id,
      };

      axios
        .post(this.ip + "getTareasRolUsuario", usuario)
        .then((response) => {
          console.log("el response", response.data);
          this.selection = response.data;
        })
        .catch((err) => console.log(err.message));
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Roles");
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 18,
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
          id_tarea: 35,
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
      this.getTareas();
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
