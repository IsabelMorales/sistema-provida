<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center" v-show="modalReportes">
      <div class="col-11 q-pa-md">
        <q-card flat bordered class="cards">
          <div class="row">
            <div class="col-12">
              <h6 class="q-my-md q-ml-md">{{ getTitle }}</h6>
            </div>
          </div>

          <div class="row q-mb-xl">
            <!-- SELECCION DE FECHA -->
            <!-- DESDE -->
            <div class="col-2 q-ml-md" v-if="this.id != 7">
              <q-input v-model="from" label="Desde" class="text-uppercase" />
            </div>

            <!-- HASTA -->
            <div class="col-2 q-ml-lg" v-if="this.id != 7">
              <q-input v-model="to" label="Hasta" class="text-uppercase" />
            </div>

            <!-- SELECCION DEL TIPO DE CIERRE DE CAJA -->
            <div
              class="col-3 q-mx-lg"
              v-if="(this.id == 1 || this.id == 5) && this.rol == 6"
            >
              <q-select
                emit-value
                map-options
                option-value="id"
                option-label="nombre"
                v-model="tipoReporte"
                :options="tipoReporteData"
                label="Tipo de reporte"
                class="text-uppercase"
              />
            </div>

            <div
              class="col-3 q-mx-lg"
              v-if="(this.id == 1 || this.id == 5) && this.rol == 20"
            >
              <q-select
                emit-value
                map-options
                option-value="id"
                option-label="nombre"
                v-model="tipoReporte"
                :options="tipoReporteContador"
                label="Tipo de reporte"
                class="text-uppercase"
              />
            </div>

            <!-- SELECCION DEL TIPO DE CIERRE DE CAJA -->
            <div class="col-4 q-mx-lg" v-if="this.id == 4 || this.id == 7">
              <q-input
                v-model="cliente"
                label="Cliente"
                class="text-uppercase"
                readonly
              />
            </div>
            <div class="col-2" v-if="this.id == 4 || this.id == 7">
              <q-btn
                label="Seleccionar cliente"
                @click="buscarCliente"
                color="primary"
                class="q-mt-sm"
              />
            </div>

            <div class="col-1">
              <q-btn
                label="Buscar"
                @click="finalizar"
                color="primary"
                class="q-mt-sm"
              />
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-11 q-pa-md">
        <q-table
          v-show="this.id == 7"
          title="Facturas habilitadas"
          :rows="rows_porPagar"
          :columns="columns"
          :pagination="initialPagination"
          row-key="id_factura"
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
              <!-- BOTON DETALLE FACTURA -->
              <template v-if="props.row.fecha_creacion_factura">
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
              </template>

              <template v-if="props.row.id_registro_convenio">
                <q-btn
                  dense
                  round
                  flat
                  padding="md"
                  color="grey"
                  icon="visibility"
                  @click="buscarRegistrosConvenio(props.row.id_cliente)"
                >
                </q-btn>
              </template>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <!-- MODAL AGREGAR PRUEBA -->
    <q-dialog v-model="confirm" full-width>
      <q-card>
        <q-card-section class="q-pb-sm">
          <!-- TABLA QUE MUESTRA TODOS LOS CLIENTES -->
          <q-table
            title="Clientes"
            :rows="clientesData"
            :columns="columns_clientes"
            :pagination="initialPagination"
            row-key="prueba_nombre"
            :filter="filterCliente"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                outlined
                dense
                debounce="300"
                v-model="filterCliente"
                placeholder="Buscar"
                class="q-mr-xl"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <!-- BOTON CIERRE MODAL -->
              <q-btn
                class="q-ml-xl"
                icon="close"
                flat
                round
                dense
                v-close-popup
              />
            </template>

            <!--SECCION BOTONES OPCIONES -->
            <template v-slot:body-cell-actions="opt">
              <q-td :props="opt">
                <!--BOTON AGREGAR PRUEBA AL EXAMEN -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="
                    addCliente(
                      opt.row.id_cliente,
                      opt.row.cliente_nombre,
                      opt.row.cliente_apellido,
                      opt.row.cedula_RIF
                    )
                  "
                  icon="done"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <MasterDeVentas
      v-if="modalMasterVentas"
      :info="this.masterVentasData"
    ></MasterDeVentas>

    <RelacionIGTF
      v-if="modalRelacionIGTF"
      :info="this.relacionIGTFData"
    ></RelacionIGTF>

    <RelacionNotasCredito
      v-if="modalRelacionNotasCredito"
      :info="this.relacionNotasCreditoData"
    ></RelacionNotasCredito>

    <RelacionPacientesPruebas
      v-if="modalPacientesPruebas"
      :info="this.pacientesPruebasData"
    ></RelacionPacientesPruebas>

    <EstadisticaExamenes
      v-if="modalEstadisticaExamenes"
      :info="this.estadisticaExamenesData"
    ></EstadisticaExamenes>

    <ReporteDeVentas
      v-if="modalReporteDeVentas"
      :info="this.reporteVentasData"
      :from="this.tipoReporte"
    ></ReporteDeVentas>

    <CuentasPorCobrar
      v-if="modalCuentasPorCobrar"
      :from="this.fromPorCobrar"
      :id_cliente="this.cuentasPorCobrarData"
    ></CuentasPorCobrar>
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
import MasterDeVentas from "../components/MasterDeVentas.vue";
import RelacionPacientesPruebas from "../components/RelacionPacientesPruebas.vue";
import ReporteDeVentas from "../components/ReporteDeVentas.vue";
import RelacionIGTF from "../components/RelacionIGTF.vue";
import RelacionNotasCredito from "../components/RelacionNotasCredito.vue";
import EstadisticaExamenes from "../components/EstadisticaExamenes.vue";
import CuentasPorCobrar from "../components/CuentasPorCobrar.vue";

export default {
  components: {
    MasterDeVentas,
    RelacionPacientesPruebas,
    ReporteDeVentas,
    RelacionIGTF,
    RelacionNotasCredito,
    EstadisticaExamenes,
    CuentasPorCobrar,
  },

  props: ["id"],

  data() {
    var today = new Date();
    let from =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      "06:00:00";

    let to =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      "16:00:00";

    let tipoReporte = ref(null);
    let cierreData = ref(null);
    let modalReportes = ref(true);
    let modalMasterVentas = ref(false);
    let modalPacientesPruebas = ref(false);
    let modalReporteDeVentas = ref(false);
    let modalRelacionIGTF = ref(false);
    let modalRelacionNotasCredito = ref(false);
    let modalEstadisticaExamenes = ref(false);
    let modalCuentasPorCobrar = ref(false);
    let estadisticaExamenesData = ref(null);
    let relacionNotasCreditoData = ref(null);
    let masterVentasData = ref(null);
    let relacionIGTFData = ref(null);
    let pacientesPruebasData = ref(null);
    let reporteVentasData = ref(null);
    let cuentasPorCobrarData = ref(null);
    let clientesData = ref(null);
    let rows_porPagar = ref([]);
    let id_cliente = ref(null);
    let cliente = ref(null);
    let confirm = ref(false);
    let acceso = ref(null);
    let fromPorCobrar=1;
    let rol = parseInt(localStorage.rol);

    const tipoReporteData = [
      {
        nombre: "FISCAL",
        id: 1,
      },
      {
        nombre: "NO FISCAL",
        id: 2,
      },
      {
        nombre: "CONSOLIDADO",
        id: 3,
      },
    ];

    const columns = [
      {
        name: "fecha",
        required: true,
        label: "Fecha",
        align: "left",
        field: (row) => {
          if (row.fecha) {
            return row.fecha;
          } else if (row.fecha_creacion_factura) {
            return row.fecha_creacion_factura;
          }
        },
        sortable: true,
      },
      {
        name: "cedula_RIF",
        align: "left",
        label: "Cedula",
        field: "cedula_RIF",
        sortable: true,
      },
      {
        name: "nombre",
        align: "left",
        label: "Nombre cliente",
        field: (row) => {
          return row.cliente_nombre + " " + row.cliente_apellido;
        },
        sortable: true,
      },
      {
        name: "tipo",
        align: "left",
        label: "Tipo",
        field: (row) => {
          if (row.numero_factura == null) {
            return "RC";
          } else {
            return "Factura";
          }
        },
        sortable: true,
      },
      {
        name: "numero",
        align: "left",
        label: "Numero",
        field: (row) => {
          if (row.numero_factura == null) {
            return row.numero_registro_convenio;
          } else {
            return row.numero_factura;
          }
        },
        sortable: true,
      },
      {
        name: "debe",
        align: "left",
        label: "Debe",
        field: (row) => {
          if (row.debe_dolares) {
            return row.debe_dolares + " $";
          } else {
            return row.total_dolares + " $";
          }
        },
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const tipoReporteContador = [
      {
        nombre: "FISCAL",
        id: 1,
      },
    ];

    const columns_clientes = [
      {
        name: "cedula_RIF",
        align: "left",
        label: "Cedula/Rif",
        field: "cedula_RIF",
        sortable: true,
      },
      {
        name: "cliente_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => {
          if (row.cliente_apellido != null && row.cliente_apellido != "null") {
            return row.cliente_nombre + " " + row.cliente_apellido;
          } else {
            return row.cliente_nombre;
          }
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const ip = process.env.BASE_URL;

    // AGREGA EL CLIENTE //
    const addCliente = (
      id_cliente,
      nombre_cliente,
      apellido_cliente,
      cedula_cliente
    ) => {
      this.cliente =
        cedula_cliente + " " + nombre_cliente + " " + apellido_cliente;
      this.id_cliente = id_cliente;
      this.filterCliente = "";
      this.confirm = false;
    };

    return {
      initialPagination: {
        sortBy: "fecha",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      from,
      to,
      tipoReporte,
      tipoReporteData,
      tipoReporteContador,
      ip,
      cierreData,
      modalReportes,
      modalMasterVentas,
      modalPacientesPruebas,
      modalReporteDeVentas,
      modalRelacionIGTF,
      modalRelacionNotasCredito,
      modalEstadisticaExamenes,
      modalCuentasPorCobrar,
      cuentasPorCobrarData,
      estadisticaExamenesData,
      relacionNotasCreditoData,
      relacionIGTFData,
      masterVentasData,
      reporteVentasData,
      pacientesPruebasData,
      clientesData,
      id_cliente,
      cliente,
      addCliente,
      filterCliente: "",
      filter: ref(""),
      columns,
      columns_clientes,
      rows_porPagar,
      confirm,
      acceso,
      rol,
      fromPorCobrar
    };
  },

  methods: {
    buscarCliente() {
      this.confirm = true;
    },

    buscarRegistrosConvenio(id){
      console.log("entro en brc",id)
      this.id_cliente=id;
      this.fromPorCobrar=2;
      this.finalizar();
    },

    finalizar() {
      console.log("entro");
      let busqueda = {
        from: this.from,
        to: this.to,
        id_cliente: this.id_cliente,
      };

      console.log(busqueda);

      // -------- ES MASTER DE VENTAS --------- //
      if (this.id == 1) {
        console.log("Entro a master");
        if (this.tipoReporte == 1) {
          // FISCAL
          console.log("fiscal");
          axios
            .post(this.ip + "masterDeVentasFiscal", busqueda)
            .then((response) => {
              console.log("EL RESPONSE", response.data);
              this.masterVentasData = response.data;
              this.modalReportes = false;
              this.modalMasterVentas = true;
            });
        } else if (this.tipoReporte == 2) {
          //NO FISCAL
          console.log("no fiscal");
          axios
            .post(this.ip + "masterDeVentasNoFiscal", busqueda)
            .then((response) => {
              console.log("EL RESPONSE", response.data);
              this.masterVentasData = response.data;
              this.modalReportes = false;
              this.modalMasterVentas = true;
            });
        } else {
          // CONSOLIDADO
          console.log("consolidado");
          axios
            .post(this.ip + "masterDeVentasConsolidado", busqueda)
            .then((response) => {
              console.log("EL RESPONSE", response.data);
              this.masterVentasData = response.data;
              this.modalReportes = false;
              this.modalMasterVentas = true;
            });
        }
      } else if (this.id == 2) {
        // --------- RELACION IGTF ----------- //

        axios.post(this.ip + "relacionIGTF", busqueda).then((response) => {
          console.log("EL RESPONSE", response.data);
          this.relacionIGTFData = response.data;
          this.modalReportes = false;
          this.modalRelacionIGTF = true;
        });
      } else if (this.id == 3) {
        // --------- RELACION NOTAS A CREDITO ----------- //

        axios
          .post(this.ip + "reporteNotasCredito", busqueda)
          .then((response) => {
            console.log("EL RESPONSE", response.data);
            this.relacionNotasCreditoData = response.data;
            this.modalReportes = false;
            this.modalRelacionNotasCredito = true;
          });
      } else if (this.id == 4) {
        // --------- RELACION PACIENTES PRUEBAS ----------- //
        console.log("el id cliente", this.id_cliente);

        if (this.id_cliente == null) {
          // PARA TODOS LOS CLIENTES
          console.log("TODOS LOS CLIENTES");

          axios
            .post(this.ip + "relacionPacientePruebas", busqueda)
            .then((response) => {
              console.log("EL RESPONSE", response.data);
              this.pacientesPruebasData = response.data;
              this.modalReportes = false;
              this.modalPacientesPruebas = true;
            });
        } else {
          // PARA UN SOLO CLIENTE
          console.log("UN SOLO CLIENTE");

          axios
            .post(this.ip + "relacionPacientePruebasCliente", busqueda)
            .then((response) => {
              console.log("EL RESPONSE", response.data);
              this.pacientesPruebasData = response.data;
              this.modalReportes = false;
              this.modalPacientesPruebas = true;
            });
        }
      } else if (this.id == 5) {
        // --------- REPORTE DE VENTAS ----------- //
        axios
          .post(this.ip + "reporteDeVentasConsolidado", busqueda)
          .then((response) => {
            this.reporteVentasData = response.data;
            console.log("EL RESPONSE", this.reporteVentasData.facturas);
            this.modalReportes = false;
            this.modalReporteDeVentas = true;
          });
      } else if (this.id == 6) {
        // --------- ESTADISTICAS EXAMENES ----------- //
        axios
          .post(this.ip + "estadisticasExamenesCultivos", busqueda)
          .then((response) => {
            this.estadisticaExamenesData = response.data;
            console.log("EL RESPONSE", this.estadisticaExamenesData);
            this.modalReportes = false;
            this.modalEstadisticaExamenes = true;
          });
      } else if (this.id == 7) {
        // --------- CUENTAS POR COBRAR ----------- //
        //axios.post(this.ip + "cuentasPorCobrar", busqueda).then((response) => {
        this.cuentasPorCobrarData = this.id_cliente;
        console.log("EL RESPONSE", this.cuentasPorCobrarData);
        this.modalReportes = false;
        this.modalCuentasPorCobrar = true;
        //});
      }
    },

    async getClientes() {
      axios.get(this.ip + "clientes").then((response) => {
        this.clientesData = response.data;
        console.log("los clientes", this.clientesData);
      });

      axios.get(this.ip + "deudasConvenios").then((response) => {
        this.rows_porPagar = response.data;
        console.log("LO DE LA LISTA", this.rows_porPagar);
      });
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 65,
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

  mounted() {
    console.log("el id", this.id);
    this.getClientes();
  },

  created() {
    this.validar();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },

    getTitle() {
      if (this.id == 1) {
        return "Master de ventas";
      } else if (this.id == 2) {
        return "Relación IGTF";
      } else if (this.id == 3) {
        return "Relación de notas a crédito";
      } else if (this.id == 4) {
        return "Relación pacientes/pruebas";
      } else if (this.id == 5) {
        return "Reporte de ventas";
      } else if (this.id == 6) {
        return "Estadistica de examenes";
      } else if (this.id == 7) {
        return "Cuentas por cobrar";
      } else {
        return "ERROR";
      }
    },
  },
};
</script>
