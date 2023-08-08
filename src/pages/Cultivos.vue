<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE CULTIVOS HABILITADOS -->
          <q-table
            v-show="tablaHabilitados"
            title="Cultivos habilitados"
            :rows="rows_habilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="cultivo_nombre"
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

              <!-- BOTON CREAR CULTIVO -->
              <router-link
                :to="{
                  name: 'CultivosModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nuevo cultivo"
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
                <!-- BOTON MODIFICAR CULTIVO -->
                <router-link
                  :to="{
                    name: 'CultivosModificacion',
                    params: { id: props.row.id_cultivo, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit">
                  </q-btn>
                </router-link>

                <!-- BOTON ELIMINAR CULTIVO -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmInhabilitar(props.row.id_cultivo)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <!-- TABLA DISPLAY DE CULTIVOS HABILITADOS -->
          <q-table
            v-show="tablaInhabilitados"
            title="Cultivos inhabilitados"
            :rows="rows_inhabilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="cultivo_nombre"
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

              <!-- BOTON CREAR CULTIVO -->
              <router-link
                :to="{
                  name: 'CultivosModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nuevo cultivo"
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
                <!-- BOTON MODIFICAR CULTIVO -->
                <router-link
                  :to="{
                    name: 'CultivosModificacion',
                    params: { id: props.row.id_cultivo, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit">
                  </q-btn>
                </router-link>

                <!-- BOTON ELIMINAR CULTIVO -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmInhabilitar(props.row.id_cultivo)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMACION ELIMINAR CULTIVO -->
    <q-dialog v-model="inhabilitarCultivoModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea inhabilitar este cultivo?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR ELIMINAR CULTIVO -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- ELIMINAR CULTIVO -->
          <q-btn
            unelevated
            label="Inhabilitar"
            color="primary"
            class="q-mr-md"
            @click="inhabilitarCultivo(id_cultivo)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL CONFIRMACION ELIMINAR CULTIVO -->
    <q-dialog v-model="habilitarCultivoModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea habilitar este cultivo?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR ELIMINAR CULTIVO -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- ELIMINAR CULTIVO -->
          <q-btn
            unelevated
            label="Habilitar"
            color="primary"
            class="q-mr-md"
            @click="habilitarCultivo(id_cultivo)"
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

  <q-page padding v-else> </q-page>>
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
    let inhabilitarCultivoModal = ref(false);
    let habilitarCultivoModal = ref(false);
    let tablaHabilitados = ref(true);
    let tablaInhabilitados = ref(false);
    let id_cultivo = "";
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
    {
        name: "cultivo_codigo",
        required: true,
        label: "Codigo",
        align: "left",
        field: (row) => row.cultivo_codigo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "cultivo_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.cultivo_nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "departamento_nombre",
        required: true,
        label: "Departamento",
        align: "left",
        field: (row) => row.departamento_nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "cultivo_precio",
        required: true,
        label: "Precio $",
        align: "left",
        field: (row) => row.cultivo_precio,
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // LLAMADO A LOS CULTIVOS HABILITADOS//
    axios
      .get(ip + "cultivos")
      .then((response) => {
        rows_habilitados.value = response.data;
        console.log("activos", rows_habilitados.value)
      })
      .finally(() => {
        loading.value = false;
      });

    // LLAMADO A LOS CULTIVOS INHABILITADOS//
    axios
      .get(ip + "cultivosAnulados")
      .then((response) => {
        rows_inhabilitados.value = response.data;
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      initialPagination: {
        sortBy: "cultivo_nombre",
        descending: false,
        page: 1,
        rowsPerPage: 15,
        // rowsNumber: xx if getting data from a server
      },
      noti: () => {},
      columns,
      rows_habilitados,
      rows_inhabilitados,
      habilitarCultivoModal,
      inhabilitarCultivoModal,
      tablaHabilitados,
      tablaInhabilitados,
      loading,
      $q,
      id_cultivo,
      filter: ref(""),
      ip,
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
      this.habilitarCultivoModal = true;
      this.id_cultivo = id;
    },

    confirmInhabilitar(id) {
      this.inhabilitarCultivoModal = true;
      this.id_cultivo = id;
    },

    habilitarCultivo(id) {
      let eliminar = {
        num: 4,
        id_cultivo: id,
      };
      console.log("id cultivo" + id);
      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configCultivos", eliminar)
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

    // ELIMINACION DE CULTIVO //
    inhabilitarCultivo(id) {
      this.noti();
      let eliminar = {
        num: 3,
        id_cultivo: id,
      };
      console.log("id cultivo" + id);
      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configCultivos", eliminar)
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
        id_tarea: 56,
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
