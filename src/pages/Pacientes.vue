<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE PACIENTES HABILITADOS-->
          <q-table
            v-show="tablaHabilitados"
            title="Pacientes habilitados"
            :rows="rows_habilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="cedula"
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

              <!-- BOTON CREAR PACIENTE -->
              <router-link
                :to="{
                  name: 'PacientesModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nuevo paciente"
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
                <!-- BOTON MODIFICAR PACIENTE -->
                <router-link
                  :to="{
                    name: 'PacientesModificacion',
                    params: { id: props.row.id_paciente, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit">
                  </q-btn>
                </router-link>

                <!-- BOTON ELIMINAR PACIENTE -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmInhabilitar(props.row.id_paciente)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <!-- TABLA INHABILITADOS -->
          <q-table
            v-show="tablaInhabilitados"
            title="Pacientes inhabilitados"
            :rows="rows_inhabilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="cedula"
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

              <!-- BOTON CREAR PACIENTE -->
              <router-link
                :to="{
                  name: 'PacientesModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nuevo paciente"
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
                <!-- BOTON MODIFICAR PACIENTE -->
                <router-link
                  :to="{
                    name: 'PacientesModificacion',
                    params: { id: props.row.id_paciente, create: false },
                  }"
                >
                  <q-btn dense round flat padding="md" color="grey" icon="edit">
                  </q-btn>
                </router-link>

                <!-- BOTON ELIMINAR PACIENTE -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmHabilitar(props.row.id_paciente)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMACION ANULAR PACIENTE -->
    <q-dialog v-model="inhabilitarPacienteModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea inhabilitar este paciente?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR ELIMINAR EXAMEN -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- ANULAR USUARIO -->
          <q-btn
            unelevated
            label="Inhabilitar"
            color="primary"
            class="q-mr-md"
            @click="inhabilitarPaciente(id_paciente)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL CONFIRMACION HABILITAR PACIENTE -->
    <q-dialog v-model="habilitarPacienteModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea habilitar este paciente?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR ELIMINAR EXAMEN -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- HABILITAR USUARIO -->
          <q-btn
            unelevated
            label="Habilitar"
            color="primary"
            class="q-mr-md"
            @click="habilitarPaciente(id_paciente)"
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
  setup() {
    const $q = useQuasar();
    const loading = ref(true);
    let rows_habilitados = ref([]);
    let rows_inhabilitados = ref([]);
    let inhabilitarPacienteModal = ref(false);
    let habilitarPacienteModal = ref(false);
    let tablaHabilitados = ref(true);
    let tablaInhabilitados = ref(false);
    let id_paciente = "";
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "paciente_cedula",
        required: true,
        label: "Cédula",
        align: "left",
        field: (row) => row.paciente_cedula,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "paciente_nombre",
        align: "left",
        label: "Nombre",
        field: (row) => row.paciente_nombre + " " + row.paciente_apellido,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // LLAMADO A LOS CLIENTES HABILITADOS//
    axios
      .get(ip + "pacientes")
      .then((response) => {
        rows_habilitados.value = response.data;
        console.log("EL ROW.VALUES", rows_habilitados.value);
      })
      .finally(() => {
        loading.value = false;
      });

    // LLAMADO A LOS CLIENTES INHABILITADOS//
    axios
      .get(ip + "pacientesAnulados")
      .then((response) => {
        rows_inhabilitados.value = response.data;
        console.log("EL ROW.VALUES", rows_inhabilitados.value);
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
      habilitarPacienteModal,
      inhabilitarPacienteModal,
      tablaHabilitados,
      tablaInhabilitados,
      loading,
      $q,
      id_paciente,
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

    confirmInhabilitar(id) {
      this.inhabilitarPacienteModal = true;
      this.id_cliente = id;
    },

    confirmHabilitar(id) {
      this.habilitarPacienteModal = true;
      this.id_cliente = id;
    },

    habilitarPaciente(id) {
      let anular = {
        num: 4,
        id_paciente: id,
      };
      console.log("id paciente" + id);
      console.log("El anular" + anular);

      axios
        .post(this.ip + "configPaciente", anular)
        .then((response) => {
          console.log(response.data);
          console.log("es es el response");
          if (response.data === "ANULADO!") {
            console.log("ENTRO");
            this.$router.go();
          }
        })
        .catch((err) => console.log(err.message));
    },

    // ANULAR CLIENTE //
    inhabilitarPaciente(id) {
      this.noti();
      let anular = {
        num: 3,
        id_paciente: id,
      };
      console.log("id paciente" + id);
      console.log("El anular" + anular);

      axios
        .post(this.ip + "configPaciente", anular)
        .then((response) => {
          console.log(response.data);
          console.log("es es el response");
          if (response.data === "ANULADO!") {
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
        id_tarea: 48,
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
