<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE ORDENES DE TRABAJO -->
          <q-table
            title="Ordenes en cola dep. bioquimica"
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
                    name: 'Resultados',
                    params: {
                      idOrden: props.row.id_orden,
                      idFactura: props.row.id_factura,
                      orden: props.row.numero_orden,
                      fecha: props.row.fecha,
                      from: 2,
                    },
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
import axios from "axios";
import { ref } from "vue";

export default {
  setup() {
    const loading = ref(true);
    let motivo = ref(null);
    let rows = ref([]);
    let id_factura = ref(null);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "fecha",
        required: true,
        label: "Fecha",
        align: "left",
        field: (row) => row.fecha,
        format: (val) => `${val}`,
      },
      {
        name: "numero_orden",
        align: "left",
        label: "Orden",
        field: (row) => row.numero_orden,
        sortable: true,
      },
      {
        name: "paciente_cedula",
        align: "left",
        label: "Cedula del paciente",
        field: (row) => row.paciente_cedula,
        sortable: true,
      },
      {
        name: "paciente_nombre",
        align: "left",
        label: "Nombre del paciente",
        field: (row) => row.paciente_nombre + " " + row.paciente_apellido,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // SE TRAE LAS ORDENES PARA TOMA DE MUESTRA
    axios
      .get(ip + "buscarOrdenDepEspeciales")
      .then((response) => {
        rows.value = response.data;
        console.log("EL RRESPONSEE",response.data);
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      initialPagination: {
        sortBy: "fecha",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      noti: () => {},
      ip,
      columns,
      loading,
      filter: ref(""),
      motivo,
      rows,
      id_factura,
      counter: 0,
      acceso,
    };
  },

  methods: {
    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 73,
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
