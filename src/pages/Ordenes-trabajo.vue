<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-12">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE ORDENES DE TRABAJO -->
          <q-table
            title="Ordenes de trabajo"
            :rows="rows"
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
            </template>

            <!-- SECCION BOTONES OPCIONES -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <router-link
                  :to="{
                    name: 'OrdenesTrabajoDetalle',
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
    let rows = ref([]);
    let id_factura = ref(null);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;
    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "fecha_creacion_orden_trabajo",
        align: "left",
        label: "Fecha",
        field: "fecha_creacion_orden_trabajo",
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
        name: "orden_trabajo",
        required: true,
        label: "Numero OT",
        align: "left",
        field: (row) => row.orden_trabajo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "id_tipo_factura",
        align: "left",
        label: "Tipo",
        field: (row) => {
          if (row.id_tipo_factura == 3) {
            return "CONTADO";
          } else if (row.id_tipo_factura == 5) {
            return "CREDITO";
          }else if (row.id_tipo_factura == 1) {
            return "FACTURADA";
          } 
        },
        sortable: true,
      },
      {
        name: "id_estado_factura",
        align: "left",
        label: "Condicion",
        field: (row) => {
          if (row.numero_factura == null && row.id_estado_factura == 1) {
            return "NO FACTURADA";
          } else if (row.numero_factura == null && row.id_estado_factura == 2) {
            return "POR PAGAR";
          }else if (row.numero_factura != null && row.id_estado_factura == 1) {
            return "FACTURADA";
          } else if (row.id_estado_factura == 3) {
            return "ANULADA";
          }
        },
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
      .get(ip + "ordenesDeTrabajo")
      .then((response) => {
        rows.value = response.data;
        console.log(response.data);
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      initialPagination: {
        sortBy: "orden_trabajo",
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
      rows,
      id_factura,
      acceso,
    };
  },

  methods: {
    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 51,
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
