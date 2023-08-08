<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE BACTERIAS ACTIVAS-->
          <q-table
            v-show="tablaHabilitados"
            title="Bacterias habilitadas"
            :rows="rows_habilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="bacteria_nombre"
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

              <!-- BOTON CREAR BACTERIA -->
              <router-link
                :to="{
                  name: 'BacteriasModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nueva bacteria"
                  v-if="this.id_rol!=18"
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
                <!-- BOTON MODIFICAR BACTERIA -->
                <router-link
                  :to="{
                    name: 'BacteriasModificacion',
                    params: { id: props.row.id_bacteria, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit" v-if="this.id_rol!=18">
                  </q-btn>
                </router-link>

                <!-- BOTON INHABILITAR BACTERIA -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmInhabilitar(props.row.id_bacteria)"
                  icon="delete"
                  v-if="this.id_rol!=18"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <!-- TABLA DISPLAY DE BACTERIAS INACTIVAS-->
          <q-table
            v-show="tablaInhabilitados"
            title="Bacterias inhabilitadas"
            :rows="rows_inhabilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="bacteria_nombre"
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

              <!-- BOTON CREAR BACTERIA -->
              <router-link
                :to="{
                  name: 'BacteriasModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nueva bacteria"
                  v-if="this.id_rol!=18"
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
                <!-- BOTON MODIFICAR BACTERIA -->
                <router-link
                  :to="{
                    name: 'BacteriasModificacion',
                    params: { id: props.row.id_bacteria, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit" v-if="this.id_rol!=18">
                  </q-btn>
                </router-link>

                <!-- BOTON INHABILITAR BACTERIA -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmHabilitar(props.row.id_bacteria)"
                  icon="delete"
                  v-if="this.id_rol!=18"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMACION DESHABILITAR BACTERIA -->
    <q-dialog v-model="inhabilitarBacteriaModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea inhabilitar esta bacteria?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR ELIMINAR BACTERIA -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- ELIMINAR BACTERIA -->
          <q-btn
            unelevated
            label="Inhabilitar"
            color="primary"
            class="q-mr-md"
            @click="inhabilitarBacteria(id_bacteria)"
            v-if="this.id_rol!=18"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL CONFIRMACION HABILITAR BACTERIA -->
    <q-dialog v-model="habilitarBacteriaModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea habilitar esta bacteria?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR ELIMINAR BACTERIA -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- ELIMINAR BACTERIA -->
          <q-btn
            unelevated
            label="Habilitar"
            color="primary"
            class="q-mr-md"
            @click="habilitarBacteria(id_bacteria)"
            v-if="this.id_rol!=18"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>

  <q-page padding v-else-if="getAcceso == 0">
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
  setup() {
    const $q = useQuasar();
    const loading = ref(true);
    let rows_habilitados = ref([]);
    let rows_inhabilitados = ref([]);
    let inhabilitarBacteriaModal = ref(false);
    let habilitarBacteriaModal = ref(false);
    let tablaHabilitados = ref(true);
    let tablaInhabilitados = ref(false);
    let id_bacteria = "";
    let confirm = ref(false);
    let acceso = ref(null);
    let id_rol=parseInt(localStorage.rol)

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "bacteria_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.bacteria_nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // LLAMADO A LAS BACTERIAS HABILITADAS//
    axios
      .get(ip + "bacterias")
      .then((response) => {
        rows_habilitados.value = response.data;
      })
      .finally(() => {
        loading.value = false;
      });

    // LLAMADO A LAS BACTERIAS INHABILITADAS//
    axios
      .get(ip + "bacteriasAnuladas")
      .then((response) => {
        rows_inhabilitados.value = response.data;
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      initialPagination: {
        sortBy: "desc",
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
      inhabilitarBacteriaModal,
      habilitarBacteriaModal,
      tablaHabilitados,
      tablaInhabilitados,
      id_bacteria,
      filter: ref(""),
      ip,
      acceso,
      id_rol
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

    confirmInhabilitar(id) {
      this.inhabilitarBacteriaModal = true;
      this.id_bacteria = id;
    },

    confirmHabilitar(id) {
      this.habilitarBacteriaModal = true;
      this.id_bacteria = id;
    },

    habilitarBacteria(id) {
      let eliminar = {
        num: 4,
        id_bacteria: id,
      };

      console.log("id bacteria" + id);
      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configBacterias", eliminar)
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

    // ELIMINACION DE BACTERIA //
    inhabilitarBacteria(id) {
      this.noti();

      let eliminar = {
        num: 3,
        id_bacteria: id,
      };

      console.log("id bacteria" + id);
      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configBacterias", eliminar)
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
        id_tarea: 57,
        token:localStorage.token,
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
      return this.acceso;
    },
  },
};
</script>
