<template>
  <q-page padding v-if="this.acceso == 1">
    <div class="fit row justify-center">
      <div class="col-12 q-py-md">
        <q-card flat bordered class="cards" id="impresion">
          <div class="row">
            <div class="col-10">
              <h6 class="q-my-md q-ml-md">RELACION DE NOTAS A CREDITO</h6>
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

          <div class="row justify-center q-mb-lg">
            <div class="col-11">
              <!-- TABLA DE FACTURAS -->
              <q-table
                :rows="facturas"
                :columns="columns_facturas"
                :pagination="initialPagination"
                :hide-pagination="true"
                row-key="fecha_creacion_factura"
              >
              </q-table>
            </div>
          </div>

          <div class="row text-subtitle1 justify-center text-bold q-mb-lg">
            <div class="col-11 text-right">
              Total del periodo:
              {{ this.total_facturas.toLocaleString("de-DE") }}
              Bs
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
    let facturas = this.info.notas_credito;
    let total_facturas = this.info.total_bolivares;
    let total_periodo_consolidado;
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    const columns_facturas = [
      {
        name: "fecha_emision",
        required: true,
        label: "Fecha de emisión",
        align: "left",
        field: (row) => row.fecha_emision,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "nota_credito_numero",
        required: true,
        label: "Nota de crédito #",
        align: "left",
        field: (row) => row.nota_credito_numero,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "cliente",
        required: true,
        label: "Cliente",
        align: "left",
        field: (row) => {
          return (
            row.cliente_nombre +
            " " +
            row.cliente_apellido
          );
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "status",
        required: true,
        label: "Status",
        align: "left",
        field: (row) => {
          return "Por aplicar";
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero_factura",
        required: true,
        label: "Factura afectada",
        align: "left",
        field: (row) => {
          return row.numero_factura;
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "monto_bolivares",
        required: true,
        label: "Monto en BsF.",
        align: "left",
        field: (row) => row.monto_bolivares.toLocaleString("de-DE"),
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    return {
      initialPagination: {
        sortBy: "fecha_emision",
        descending: false,
        page: 1,
        rowsPerPage: 0,
        // rowsNumber: xx if getting data from a server
      },
      ip,
      imprimirBtn,
      facturas,
      total_facturas,
      columns_facturas,
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

    consolidado() {},

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 64,
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
