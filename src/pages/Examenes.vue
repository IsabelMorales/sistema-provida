<template>
  <q-page padding v-if="this.acceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE EXAMENES ACTIVOS -->
          <q-table
            v-show="tablaHabilitados"
            title="Examenes habilitados"
            :rows="rows_habilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="examen_codigo"
            :filter="filter"
            no-data-label="No hay data disponible"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Buscar"
                class="q-mr-xl"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <!-- BOTON CREAR EXAMEN -->
              <router-link
                :to="{
                  name: 'ExamenesModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nuevo examen"
                >
                </q-btn>
              </router-link>

              <q-btn
                outline
                class="q-ml-xl"
                color="primary"
                label="Ver inhabilitados"
                @click="inhabilitados"
              >
              </q-btn>
            </template>

            <!-- SECCION BOTONES OPCIONES -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <!-- BOTON MODIFICAR EXAMEN -->
                <router-link
                  :to="{
                    name: 'ExamenesModificacion',
                    params: { id: props.row.id_examen, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit">
                  </q-btn>
                </router-link>

                <!-- BOTON ELIMINAR EXAMEN -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmInhabilitar(props.row.id_examen)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <!-- TABLA DISPLAY DE EXAMENES -->
          <q-table
            v-show="tablaInhabilitados"
            title="Examenes inhabilitados"
            :rows="rows_inhabilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="examen_codigo"
            :filter="filter"
            no-data-label="No hay data disponible"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Buscar"
                class="q-mr-xl"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <!-- BOTON CREAR EXAMEN -->
              <router-link
                :to="{
                  name: 'ExamenesModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nuevo examen"
                >
                </q-btn>
              </router-link>

              <q-btn
                outline
                class="q-ml-xl"
                color="primary"
                label="Ver habilitados"
                @click="habilitados"
              >
              </q-btn>
            </template>

            <!-- SECCION BOTONES OPCIONES -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <!-- BOTON MODIFICAR EXAMEN -->
                <router-link
                  :to="{
                    name: 'ExamenesModificacion',
                    params: { id: props.row.id_examen, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit">
                  </q-btn>
                </router-link>

                <!-- BOTON HABILITAR EXAMEN -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmHabilitar(props.row.id_examen)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMACION ANULACION EXAMEN -->
    <q-dialog v-model="inhabilitarExamenModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea inhabilitar este examen?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR INHABILITAR EXAMEN -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- INHABILITAR EXAMEN -->
          <q-btn
            unelevated
            label="Inhabilitar"
            color="primary"
            class="q-mr-md"
            @click="inhabilitarExamen(id_examen)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL CONFIRMACION ACTIVACION EXAMEN -->
    <q-dialog v-model="habilitarExamenModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea habilitar este examen?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR HABILITAR EXAMEN -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- HABILITAR EXAMEN -->
          <q-btn
            unelevated
            label="Habilitar"
            color="primary"
            class="q-mr-md"
            @click="habilitarExamen(id_examen)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
import { useQuasar } from "quasar";
import axios from "axios";
import { ref } from "vue";

export default {
  data() {
    const $q = useQuasar();
    const loading = ref(true);
    let rows_habilitados = ref([]);
    let rows_inhabilitados = ref([]);
    let id_examen = "";
    let inhabilitarExamenModal = ref(false);
    let habilitarExamenModal = ref(false);
    let tablaHabilitados = ref(true);
    let tablaInhabilitados = ref(false);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "examen_codigo",
        required: true,
        label: "Codigo",
        align: "left",
        field: (row) => row.examen_codigo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "examen_nombre",
        align: "left",
        label: "Nombre",
        field: "examen_nombre",
        sortable: true,
      },
      {
        name: "departamento_nombre",
        align: "left",
        label: "Departamento",
        field: "departamento_nombre",
        sortable: true,
      },
      {
        name: "examen_precio",
        align: "left",
        label: "Precio $",
        field: "examen_precio",
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // LLAMADO A LOS EXAMENES HABILITADOS//
    axios
      .get(ip + "examenes")
      .then((response) => {
        rows_habilitados.value = response.data;
        console.log(response.data);
      })
      .finally(() => {
        loading.value = false;
      });

    // LLAMADO A LOS EXAMENES INHABILITADOS//
    axios
      .get(ip + "examenesAnulados")
      .then((response) => {
        rows_inhabilitados.value = response.data;
        console.log(response.data);
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      initialPagination: {
        sortBy: "examen_nombre",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      noti: () => {},
      columns,
      rows_habilitados,
      rows_inhabilitados,
      loading,
      $q,
      habilitarExamenModal,
      inhabilitarExamenModal,
      id_examen,
      filter: ref(""),
      ip,
      tablaHabilitados,
      tablaInhabilitados,
      acceso,
    };
  },

  methods: {
    inhabilitados() {
      this.tablaHabilitados = false;
      this.tablaInhabilitados = true;
    },

    habilitados() {
      this.tablaHabilitados = true;
      this.tablaInhabilitados = false;
    },

    confirmHabilitar(id) {
      this.habilitarExamenModal = true;
      this.id_examen = id;
    },

    confirmInhabilitar(id) {
      this.inhabilitarExamenModal = true;
      this.id_examen = id;
    },

    habilitarExamen(id) {
      let eliminar = {
        num: 4,
        id_examen: id,
      };

      console.log("id examen" + id);
      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configExamenes", eliminar)
        .then((response) => {
          console.log(response.data);
          console.log("es es el response");
          if (response.data === 1) {
            console.log("ENTRO");
            this.$router.go();
          }
        })
        .catch((err) => console.log(err.message));
    },

    // ELIMINACION DE EXAMEN //
    inhabilitarExamen(id) {
      this.noti();

      let eliminar = {
        num: 3,
        id_examen: id,
      };

      console.log("id examen" + id);
      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configExamenes", eliminar)
        .then((response) => {
          console.log(response.data);
          console.log("es es el response");
          if (response.data === 1) {
            console.log("ENTRO");
            this.$router.go();
          }
        })
        .catch((err) => console.log(err.message));
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 55,
        token: localStorage.token,
      };

      axios.post(this.ip + "accesoAControladores", usuario).then((response) => {
        console.log("EL RESPONSE", response.data);

        if (response.data == "x") {
          localStorage.clear();
          window.location = "/";
        } else {
          this.acceso = response.data;
        }
      });
    },
  },

  created() {
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
