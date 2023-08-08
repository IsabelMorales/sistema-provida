<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE ANTIBIOTICOs HABILITADOS -->
          <q-table
            v-show="tablaHabilitados"
            title="Antibioticos habilitados"
            :rows="rows_habilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="antibiotico_nombre"
            :filter="filter"
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

              <!-- BOTON CREAR ANTIBIOTICO -->
              <router-link
                :to="{
                  name: 'AntibioticosModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nuevo antibiotico"
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
                <!-- BOTON MODIFICAR ANTIBIOTICO -->
                <router-link
                  :to="{
                    name: 'AntibioticosModificacion',
                    params: { id: props.row.id_antibiotico, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit" v-if="this.id_rol!=18">
                  </q-btn>
                </router-link>

                <!-- BOTON INHABILITAR ANTIBIOTICO -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmInhabilitar(props.row.id_antibiotico)"
                  icon="delete"
                  v-if="this.id_rol!=18"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <!-- TABLA DISPLAY DE ANTIBIOTICOS INHABILITADOS -->
          <q-table
            v-show="tablaInhabilitados"
            title="Antibioticos inhabilitados"
            :rows="rows_inhabilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="antibiotico_nombre"
            :filter="filter"
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

              <!-- BOTON CREAR ANTIBIOTICO -->
              <router-link
                :to="{
                  name: 'AntibioticosModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nuevo antibiotico"
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
                <!-- BOTON MODIFICAR ANTIBIOTICO -->
                <router-link
                  :to="{
                    name: 'AntibioticosModificacion',
                    params: { id: props.row.id_antibiotico, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit" v-if="this.id_rol!=18">
                  </q-btn>
                </router-link>

                <!-- BOTON INHABILITAR ANTIBIOTICO -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmHabilitar(props.row.id_antibiotico)"
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

    <!-- MODAL CONFIRMACION INHABILITAR ANTIBIOTICO -->
    <q-dialog v-model="inhabilitarAntibioticoModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea inhabilitar este antibiotico?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR INHABILITAR ANTIBIOTICO -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- INHABILITAR ANTIBIOTICO -->
          <q-btn
            unelevated
            label="Inhabilitar"
            color="primary"
            class="q-mr-md"
            @click="inhabilitarAntibiotico(this.id_antibiotico)"
            v-if="this.id_rol!=18"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL CONFIRMACION HABILITAR ANTIBIOTICO -->
    <q-dialog v-model="habilitarAntibioticoModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea habilitar este antibiotico?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR ACTIVAR ANTIBIOTICO -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- ACTIVAR ANTIBIOTICO -->
          <q-btn
            unelevated
            label="Habilitar"
            color="primary"
            class="q-mr-md"
            @click="habilitarAntibiotico(this.id_antibiotico)"
            v-if="this.id_rol!=18"
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
  props: ["id", "create"],

  data() {
    const $q = useQuasar();
    const loading = ref(true);
    let rows_habilitados = ref([]);
    let rows_inhabilitados = ref([]);
    let inhabilitarAntibioticoModal = ref(false);
    let habilitarAntibioticoModal = ref(false);
    let tablaHabilitados = ref(true);
    let tablaInhabilitados = ref(false);
    let id_antibiotico = "";
    let acceso = ref(null);
    let id_rol=parseInt(localStorage.rol)

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "antibiotico_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.antibiotico_nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // LLAMADO A LOS PERFILES HABILITADOS//
    axios
      .get(ip + "antibioticos")
      .then((response) => {
        console.log(response.data);
        rows_habilitados.value = response.data;
      })
      .finally(() => {
        loading.value = false;
      });

    // LLAMADO A LOS PERFILES INHABILITADOS//
    axios
      .get(ip + "antibioticosAnulados")
      .then((response) => {
        console.log(response.data);
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
      },
      noti: () => {},
      columns,
      rows_habilitados,
      rows_inhabilitados,
      loading,
      $q,
      inhabilitarAntibioticoModal,
      habilitarAntibioticoModal,
      tablaHabilitados,
      tablaInhabilitados,
      id_antibiotico,
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
      this.inhabilitarAntibioticoModal = true;
      this.id_antibiotico = id;
    },

    confirmHabilitar(id) {
      this.habilitarAntibioticoModal = true;
      this.id_antibiotico = id;
    },

    // HABILITAR ANTIBIOTICO //
    habilitarAntibiotico(id) {
      let eliminar = {
        num: 4,
        id_antibiotico: id,
      };

      console.log("id antibiotico", id);
      console.log("El eliminar", eliminar);

      axios
        .post(this.ip + "configAntibioticos", eliminar)
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

    // ANULACION DEL ANTIBIOTICO //
    inhabilitarAntibiotico(id) {
      let eliminar = {
        num: 3,
        id_antibiotico: id,
      };

      console.log("id antibiotico", id);
      console.log("El eliminar", eliminar);

      axios
        .post(this.ip + "configAntibioticos", eliminar)
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
        id_tarea: 59,
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
