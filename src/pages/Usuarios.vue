<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE USUARIOS HABILITADOS-->
          <q-table
            v-show="tablaHabilitados"
            title="Usuarios"
            :rows="rows_habilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="cedula_rif"
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

              <!-- BOTON CREAR EXAMEN -->
              <router-link
                :to="{
                  name: 'UsuariosModificacion',
                  params: { create: true },
                }"
              >
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Crear nuevo usuario"
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
                <!-- BOTON MODIFICAR USUARIO -->
                <router-link
                  :to="{
                    name: 'UsuariosModificacion',
                    params: { id: props.row.id_usuario, create: false },
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
                  @click="confirmInhabilitar(props.row.id_usuario)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <!-- TABLA DISPLAY DE USUARIOS INHABILITADOS-->
          <q-table
            v-show="tablaInhabilitados"
            title="Usuarios"
            :rows="rows_inhabilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="cedula_rif"
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
                <!-- BOTON MODIFICAR USUARIO -->
                <router-link
                  :to="{
                    name: 'UsuariosModificacion',
                    params: { id: props.row.id_usuario, create: false },
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
                  @click="confirmHabilitar(props.row.id_usuario)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMACION ELIMINAR UN USUARIO -->
    <q-dialog v-model="inhabilitarUsuarioModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea inhabilitar este usuario?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR ANULAR USUARIO -->
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
            label="Anular"
            color="primary"
            class="q-mr-md"
            @click="inhabilitarUsuario(this.id_usuario)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL CONFIRMACION ELIMINAR UN USUARIO -->
    <q-dialog v-model="habilitarUsuarioModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              ¿Seguro que desea habilitar este usuario?
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR ANULAR USUARIO -->
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
            label="Anular"
            color="primary"
            class="q-mr-md"
            @click="habilitarUsuario(this.id_usuario)"
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
    let inhabilitarUsuarioModal = ref(false);
    let habilitarUsuarioModal = ref(false);
    let tablaHabilitados = ref(true);
    let tablaInhabilitados = ref(false);
    let id_usuario = "";
    let confirm = ref(false);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "usuario_cedula",
        align: "left",
        label: "Cédula",
        field: "usuario_cedula",
        sortable: true,
      },
      {
        name: "usuario_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.usuario_nombre + " " + row.usuario_apellido,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "usuario_username",
        align: "left",
        label: "Nombre de Usuario",
        field: "usuario_username",
        sortable: true,
      },
      {
        name: "usuario_telefono",
        align: "left",
        label: "Telefono",
        field: "usuario_telefono",
        sortable: true,
      },
      {
        name: "usuario_correo",
        align: "left",
        label: "Correo",
        field: "usuario_correo",
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // LLAMADO A LOS USUARIOS //
    axios
      .get(ip + "usuarios")
      .then((response) => {
        rows_habilitados.value = response.data;
        console.log("EL ROW.VALUES", rows_habilitados.value);
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
      inhabilitarUsuarioModal,
      habilitarUsuarioModal,
      tablaHabilitados,
      tablaInhabilitados,
      loading,
      $q,
      id_usuario,
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
      this.habilitarUsuarioModal = true;
      this.id_usuario = id;
    },

    confirmInhabilitar(id) {
      this.inhabilitarUsuarioModal = true;
      this.id_usuario = id;
    },

    habilitarUsuario(id) {},

    // ANULAR USUARIO //
    inhabilitarUsuario(id) {
      let anular = {
        num: 3,
        id_usuario: id,
        estatus: 0,
      };

      console.log("id usuario" + id);
      console.log("El anular" + anular);

      axios
        .post(this.ip + "configUsuario", anular)
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
        id_rol: localStorage.rol,
        id_tarea: 68,
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
