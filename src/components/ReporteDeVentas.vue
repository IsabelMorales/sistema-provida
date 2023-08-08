<template>
  <q-page padding v-if="this.acceso == 1">
    <div class="fit row justify-center">
      <div class="col-12 q-py-md">
        <q-card flat bordered class="cards" id="impresion">
          <div class="row">
            <div class="col-10">
              <h6 class="q-my-md q-ml-md">REPORTE DE VENTAS</h6>
            </div>
            <div class="col-2 text-right">
              <q-btn
                color="primary"
                class="q-mt-md q-mr-md"
                label="Imprimir"
                v-show="imprimirBtn"
                @click="imprimir"
              />
            </div>
          </div>

          <q-separator class="q-mb-md" />

          <div
            class="row justify-center q-mb-lg"
            v-if="this.from == 1 || this.from == 3"
          >
            <div class="col-11">
              <!-- TABLA DE FACTURAS -->
              <q-table
                title="Facturas"
                :rows="facturas"
                :columns="columns_facturas"
                :pagination="initialPagination"
                :hide-pagination="true"
                row-key="fecha_creacion_factura"
              >
              </q-table>
            </div>
          </div>

          <div
            class="row justify-center q-mb-lg"
            v-if="this.from == 2 || this.from == 3"
          >
            <div class="col-11">
              <!-- TABLA DE ORDENES DE TRABAJO -->
              <q-table
                title="Ordenes de trabajo"
                :rows="ordenes_trabajo"
                :columns="columns_ordenes"
                :pagination="initialPagination"
                :hide-pagination="true"
                row-key="fecha_creacion_orden_trabajo"
              >
              </q-table>
            </div>
          </div>

          <div
            class="row justify-center q-mb-lg"
            v-if="this.from == 1 || this.from == 3"
          >
            <div class="col-11">
              <!-- TABLA DE NOTAS A CREDITO -->
              <q-table
                title="Notas a crédito"
                :rows="notas_credito_agrupado"
                :columns="columns_notas_credito"
                :pagination="initialPagination"
                :hide-pagination="true"
                row-key="fecha_emision"
              >
              </q-table>
            </div>
          </div>

          <div class="row text-subtitle1 justify-center text-bold q-mb-lg">
            <div class="col-11" v-if="this.from == 3">
              Total del periodo:
              {{ this.total_periodo_consolidado }}
              Bs
            </div>
            <div class="col-11" v-if="this.from == 1">
              Total del periodo:
              {{ this.total_facturas.total_bolivares.toLocaleString("de-DE") }}
              Bs
            </div>
            <div class="col-11" v-if="this.from == 2">
              Total del periodo:
              {{ this.total_facturas.total_bolivares.toLocaleString("de-DE") }}
              Bs
            </div>
            <div class="col-11">
              Total anulados:
              {{
                this.total_facturas_anuladas.total_bolivares.toLocaleString(
                  "de-DE"
                )
              }}
              Bs
            </div>
            <div class="col-11">
              Total notas a crédito:
              {{ this.total_notas_credito.total_bolivares }} Bs
            </div>
          </div>

          <div class="row justify-center q-mb-lg">
            <div class="col-11">
              <!-- TABLA DE FACTURAS ANULADAS -->
              <q-table
                title="Detalle facturas anuladas"
                :rows="facturas_anuladas"
                :columns="columns_facturas_anuladas"
                :pagination="initialPagination"
                :hide-pagination="true"
                row-key="fecha_emision"
              >
              </q-table>
            </div>
          </div>

          <div class="row justify-center q-mb-lg">
            <div class="col-11">
              <!-- TABLA DE FACTURAS ANULADAS -->
              <q-table
                title="Detalles notas a crédito"
                :rows="notas_credito"
                :columns="columns_notas_credito_detallado"
                :pagination="initialPagination"
                :hide-pagination="true"
                row-key="fecha_emision"
              >
              </q-table>
            </div>
          </div>
        </q-card>
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
import { jsPDF } from "jspdf";

export default {
  props: ["info", "from"],

  data() {
    let imprimirBtn = ref(true);
    let facturas = this.info.facturas;
    let facturas_anuladas = this.info.facturas_anuladas;
    let notas_credito = this.info.notas_credito;
    let notas_credito_agrupado = this.info.notas_credito_agrupado;
    let ordenes_trabajo = this.info.ordenes_trabajo;
    let total_facturas = this.info.total_facturas;
    let total_facturas_anuladas = this.info.total_facturas_anuladas;
    let total_notas_credito = this.info.total_notas_credito;
    let total_ordenes_trabajo = this.info.total_ordenes_trabajo;
    let total_periodo_consolidado;
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    const columns_facturas = [
      {
        name: "fecha_creacion_factura",
        required: true,
        label: "Emision",
        align: "left",
        field: (row) => row.fecha_creacion_factura,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "factura",
        required: true,
        label: "Tipo",
        align: "left",
        field: (row) => "FACTURA",
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero",
        required: true,
        label: "Primera factura",
        align: "left",
        field: (row) => {
          return row.facturas[0].numero_factura;
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero",
        required: true,
        label: "Ultima factura",
        align: "left",
        field: (row) => {
          let largo = row.facturas.length;
          return row.facturas[largo - 1].numero_factura;
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "totalBolivares",
        required: true,
        label: "Monto excento Bs.",
        align: "left",
        field: (row) => {
          return row.totalBolivares.toLocaleString("de-DE");
          //return row.totalBolivares
        },
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    const columns_ordenes = [
      {
        name: "fecha_creacion_orden_trabajo",
        required: true,
        label: "Emision",
        align: "left",
        field: (row) => row.fecha_creacion_orden_trabajo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "orden",
        required: true,
        label: "Tipo",
        align: "left",
        field: (row) => "ORDEN DE TRABAJO",
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero",
        required: true,
        label: "Primera orden de trabajo",
        align: "left",
        field: (row) => {
          return row.ordenes_de_trabajo[0].orden_trabajo;
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero",
        required: true,
        label: "Ultima orden de trabajo",
        align: "left",
        field: (row) => {
          let largo = row.ordenes_de_trabajo.length;
          return row.ordenes_de_trabajo[largo - 1].orden_trabajo;
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "totalBolivares",
        required: true,
        label: "Monto excento Bs.",
        align: "left",
        field: (row) => {
          return row.totalBolivares.toLocaleString("de-DE");
          //return row.totalBolivares
        },
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    const columns_notas_credito = [
      {
        name: "fecha_emision",
        required: true,
        label: "Emision",
        align: "left",
        field: (row) => row.fecha_emision,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "nota",
        required: true,
        label: "Tipo",
        align: "left",
        field: (row) => "NOTA A CREDITO",
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero",
        required: true,
        label: "Primera nota",
        align: "left",
        field: (row) => {
          return row.notas_credito[0].nota_credito_numero;
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero",
        required: true,
        label: "Ultima nota",
        align: "left",
        field: (row) => {
          let largo = row.notas_credito.length;
          return row.notas_credito[largo - 1].nota_credito_numero;
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "totalBolivares",
        required: true,
        label: "Monto excento Bs.",
        align: "left",
        field: (row) => {
          return row.totalBolivares.toLocaleString("de-DE");
          //return row.totalBolivares
        },
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    const columns_facturas_anuladas = [
      {
        name: "fecha_creacion_factura",
        required: true,
        label: "Emision",
        align: "left",
        field: (row) => row.fecha_creacion_factura,
        format: (val) => `${val}`,
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
        name: "total_bolivares",
        required: true,
        label: "Monto Bs.",
        align: "left",
        field: (row) => {
          return row.total_bolivares.toLocaleString("de-DE");
          //return row.totalBolivares
        },
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    const columns_notas_credito_detallado = [
      {
        name: "fecha_emision",
        required: true,
        label: "Emision",
        align: "left",
        field: (row) => row.fecha_emision,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "nota_credito_numero",
        required: true,
        label: "Numero nota a crédito",
        align: "left",
        field: (row) => row.nota_credito_numero,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero_factura",
        required: true,
        label: "Numero factura",
        align: "left",
        field: (row) => row.numero_factura,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "monto_bolivares",
        required: true,
        label: "Monto Bs.",
        align: "left",
        field: (row) => {
          return row.monto_bolivares.toLocaleString("de-DE");
          //return row.totalBolivares
        },
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    return {
      initialPagination: {
        sortBy: "fecha",
        descending: true,
        page: 1,
        rowsPerPage: 0,
        // rowsNumber: xx if getting data from a server
      },
      ip,
      imprimirBtn,
      facturas,
      facturas_anuladas,
      notas_credito,
      notas_credito_agrupado,
      ordenes_trabajo,
      total_facturas,
      total_facturas_anuladas,
      total_notas_credito,
      total_ordenes_trabajo,
      columns_facturas,
      columns_ordenes,
      columns_notas_credito,
      columns_facturas_anuladas,
      columns_notas_credito_detallado,
      total_periodo_consolidado,
      acceso,
    };
  },

  methods: {
    creado() {
      this.imprimirBtn = true;
    },

    imprimir() {
      this.imprimirBtn = false;

      var doc = new jsPDF("p", "pt", "a5");
      doc.html(document.getElementById("impresion"), {
        //margin: [0, 0, 0, 0],
        callback: function (doc) {
          doc.autoPrint();
          doc.output("dataurlnewwindow");
          doc.save("autoprint.pdf");
        },
        windowWidth: 1500,
        width: 410,
        y: 3,
        x: 3,
      });
    },

    consolidado() {
      console.log(
        "los totales",
        this.total_facturas.total_bolivares,
        this.total_ordenes_trabajo.total_bolivares
      );
      this.total_periodo_consolidado =
        this.total_facturas.total_bolivares +
        this.total_ordenes_trabajo.total_bolivares;

      console.log(this.total_periodo_consolidado);

      this.total_periodo_consolidado =
        this.total_periodo_consolidado.toLocaleString("de-DE");
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 67,
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
    this.creado();
    this.consolidado();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
