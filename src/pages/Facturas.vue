<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-12">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE FACTURAS -->
          <q-table
            v-show="tablaHabilitados"
            title="Facturas habilitadas"
            :rows="rows_habilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="numero_factura"
            :filter="filter"
            no-data-label="No hay data disponible"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                dense
                outlined
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
                label="Ver anuladas"
                @click="inhabilitados"
              >
              </q-btn>
            </template>

            <!-- SECCION BOTONES OPCIONES -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <!-- BOTON DETALLE FACTURA -->
                <router-link
                  :to="{
                    name: 'FacturasDetalle',
                    params: { id: props.row.id_factura },
                  }"
                >
                  <q-btn
                    dense
                    round
                    flat
                    padding="md"
                    color="grey"
                    icon="visibility"
                  >
                  </q-btn>
                </router-link>

                <!-- BOTON ANULAR FACTURA -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmInhabilitar(props.row.id_factura)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>

          <!-- TABLA DE ANULADOS -->
          <q-table
            v-show="tablaInhabilitados"
            title="Facturas anuladas"
            :rows="rows_inhabilitados"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="numero_factura"
            :filter="filter"
            no-data-label="No hay data disponible"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                dense
                outlined
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
                label="Ver aprobadas"
                @click="habilitados"
              >
              </q-btn>
            </template>

            <!-- SECCION BOTONES OPCIONES -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <!-- BOTON DETALLE FACTURA -->
                <router-link
                  :to="{
                    name: 'FacturasDetalle',
                    params: { id: props.row.id_factura },
                  }"
                >
                  <q-btn
                    dense
                    round
                    flat
                    padding="md"
                    color="grey"
                    icon="visibility"
                  >
                  </q-btn>
                </router-link>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMACION ANULACION FACTURA -->
    <q-dialog v-model="inhabilitarFacturaModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">Ingrese la razón de la anulación.</div>
            <q-input v-model="motivo" label="Motivo" class="text-uppercase" />
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
            @click="inhabilitarFactura(id_factura)"
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
    let motivo = ref(null);
    let inhabilitarFacturaModal = ref(false);
    let habilitarFacturaModal = ref(false);
    let tablaHabilitados = ref(true);
    let tablaInhabilitados = ref(false);
    let rows_habilitados = ref([]);
    let rows_inhabilitados = ref([]);
    let id_factura = ref(null);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "fecha_creacion_factura",
        align: "left",
        label: "Fecha",
        field: "fecha_creacion_factura",
        sortable: true,
      },
      {
        name: "numero_factura",
        required: true,
        label: "Numero de factura",
        align: "left",
        field: (row) => row.numero_factura,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "cedula_RIF",
        align: "left",
        label: "Cédula/RIF del cliente",
        field: "cedula_RIF",
        sortable: true,
      },
      {
        name: "nombre_cliente",
        align: "left",
        label: "Nombre del cliente",
        field: (row) => {
          if (row.cliente_apellido == null || row.cliente_apellido == "null") {
            return row.cliente_nombre;
          } else {
            return row.cliente_nombre + " " + row.cliente_apellido;
          }
        },
        sortable: true,
      },
      {
        name: "tipo_factura_nombre",
        align: "left",
        label: "Tipo de factura",
        field: "tipo_factura_nombre",
        sortable: true,
      },
      {
        name: "nombre",
        align: "left",
        label: "Status",
        field: "nombre",
        sortable: true,
      },
      {
        name: "nombre_usuario",
        align: "left",
        label: "Usuario",
        field: (row) => {
          if (row.usuario_apellido == null || row.usuario_apellido == "null") {
            return row.usuario_nombre;
          } else {
            return row.usuario_nombre + " " + row.usuario_apellido;
          }
        },
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // LLAMADO A LAS FACTURAS ACTIVAS //
    axios
      .get(ip + "facturas")
      .then((response) => {
        rows_habilitados.value = response.data;
        console.log(response.data);
      })
      .finally(() => {
        loading.value = false;
      });

    // LLAMADO A LAS FACTURAS ANULADAS //
    axios
      .get(ip + "facturasAnuladas")
      .then((response) => {
        rows_inhabilitados.value = response.data;
        console.log(response.data);
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      initialPagination: {
        sortBy: "numero_factura",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      noti: () => {},
      ip,
      columns,
      loading,
      $q,
      filter: ref(""),
      motivo,
      rows_habilitados,
      rows_inhabilitados,
      habilitarFacturaModal,
      inhabilitarFacturaModal,
      tablaHabilitados,
      tablaInhabilitados,
      id_factura,
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
      this.habilitarFacturaModal = true;
      this.id_factura = id;
    },

    confirmInhabilitar(id) {
      this.inhabilitarFacturaModal = true;
      this.id_factura = id;
    },

    habilitarFactura(id) {},

    // ANULACION DE FACTURA //
    inhabilitarFactura(id) {
      this.noti();

      let eliminar = {
        id_factura: this.id_factura,
        anulacion_motivo: this.motivo.toUpperCase(),
      };

      console.log("id factura", id);
      console.log("El eliminar", eliminar);

      axios
        .post(this.ip + "anulacionFactura", eliminar)
        .then((response) => {
          console.log(response.data);
          console.log("es es el response");
          this.motivo = "";
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
        id_tarea: 50,
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
