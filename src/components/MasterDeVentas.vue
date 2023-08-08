<template>
  <q-page padding v-if="this.acceso == 1">
    <div class="fit row justify-center">
      <div class="col-12 q-py-md">
        <q-card flat bordered class="cards" id="impresion">
          <div class="row">
            <div class="col-10">
              <h6 class="q-my-md q-ml-md">MASTER DE VENTAS</h6>
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
            class="row q-mb-lg text-subtitle1"
            v-for="cliente in clientes"
            :key="cliente.id_cliente"
          >
            <div class="col-2 q-ml-md text-bold">
              {{ cliente.cedula_RIF }}
            </div>
            <div
              class="col-9 text-bold"
              v-if="
                cliente.cliente_apellido == null ||
                cliente.cliente_apellido == 'null'
              "
            >
              {{ cliente.cliente_nombre }}
            </div>
            <div class="col-9 text-bold" v-else>
              {{ cliente.cliente_nombre }} {{ cliente.cliente_apellido }}
            </div>
            <div class="col-12 q-px-md q-mt-sm">
              <q-table
                :dense="$q.screen.lt.xl"
                :rows="cliente.detalles_factura"
                :columns="columns"
                :pagination="initialPagination"
                row-key="id_factura"
                hide-bottom
              />
            </div>
            <div class="col-12 q-px-md q-mt-md">
              <div class="row text-bold">
                <div class="col-2">Subtotales</div>
                <div class="col-2">Total</div>
                <div class="col-2">Abonos</div>
                <div class="col-2">Saldo</div>
                <div class="col-2">IGTF</div>
                <div class="col-2">Base imponible</div>
              </div>
              <div class="row">
                <div class="col-2"></div>
                <div class="col-2">
                  {{ cliente.sub_total_bolivares }}
                </div>
                <div class="col-2">
                  {{ cliente.abono_sub_total }}
                </div>
                <div class="col-2">
                  {{ cliente.debe_bolivares_sub_total }}
                </div>
                <div class="col-2">
                  {{ cliente.sub_total_IGTF_bolivares }}
                </div>
                <div class="col-2">
                  {{ cliente.sub_total_base_imponible_bolivares }}
                </div>
              </div>
              <q-separator />
            </div>
          </div>

          <div class="row text-subtitle1 text-bold q-ml-md">
            <div class="col-2">Totales:</div>
            <div class="col-2">Total</div>
            <div class="col-2">Abonos</div>
            <div class="col-2">Saldo</div>
            <div class="col-2">IGTF</div>
            <div class="col-2">Base imponible</div>
          </div>
          <div class="row text-subtitle1 q-ml-md">
            <div class="col-2"></div>
            <div class="col-2">
              {{ totales.total_bolivares }}
            </div>
            <div class="col-2">
              {{ totales.abono_total }}
            </div>
            <div class="col-2">
              {{ totales.total_debe_bolivares }}
            </div>
            <div class="col-2">
              {{ totales.IGTF_bolivares_total }}
            </div>
            <div class="col-2">
              {{ totales.bolivares_imponible_total }}
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
  props: ["info"],

  data() {
    let imprimirBtn = ref(true);
    let clientes = this.info[1].clientes_factura;
    let totales = this.info[0];
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    const columns = [
      {
        name: "fecha",
        required: true,
        label: "Fecha",
        align: "left",
        field: (row) => {
          if (
            row.fecha_creacion_factura == null ||
            row.fecha_creacion_factura == "null"
          ) {
            return row.fecha_creacion_orden_trabajo;
          } else {
            return row.fecha_creacion_factura;
          }
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "tipo",
        required: true,
        label: "Tipo",
        align: "left",
        field: (row) => {
          if (
            row.fecha_creacion_factura == null ||
            row.fecha_creacion_factura == "null"
          ) {
            return "ORDEN TRABAJO";
          } else {
            return "FACTURA";
          }
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero",
        required: true,
        label: "Número",
        align: "left",
        field: (row) => {
          if (
            row.fecha_creacion_factura == null ||
            row.fecha_creacion_factura == "null"
          ) {
            return row.orden_trabajo;
          } else {
            return row.numero_factura;
          }
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "venta",
        required: true,
        label: "Venta",
        align: "left",
        field: (row) => row.total_bolivares,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "descuento_bolivares",
        required: true,
        label: "Descuento",
        align: "left",
        field: (row) => row.descuento_bolivares,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "total",
        required: true,
        label: "Total",
        align: "left",
        field: (row) => row.total_bolivares - row.descuento_bolivares,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "id_tipo_factura",
        required: true,
        label: "Condición",
        align: "left",
        field: (row) => {
          if (row.id_tipo_factura == 1 || row.id_tipo_factura == 3) {
            return "CONTADO";
          } else if (row.id_tipo_factura == 2) {
            return "CREDITO";
          }
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "base_imponible_bolivares",
        required: true,
        label: "B.I. IGTF 3%",
        align: "left",
        field: (row) => row.base_imponible_bolivares,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "IGTF_bolivares",
        required: true,
        label: "IGTF Perc. 3%",
        align: "left",
        field: (row) => row.IGTF_bolivares,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "abono_factura",
        required: true,
        label: "Abono",
        align: "left",
        field: (row) => row.abono_factura,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "debe_bolivares",
        required: true,
        label: "Saldo",
        align: "left",
        field: (row) => row.debe_bolivares,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "id_estado_factura",
        required: true,
        label: "Status",
        align: "left",
        field: (row) => {
          if (row.id_estado_factura == 1) {
            return "COBRADA";
          } else if (row.id_estado_factura == 2) {
            return "POR COBRAR";
          } else {
            return "ANULADA";
          }
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
      clientes,
      columns,
      totales,
      acceso,
    };
  },

  methods: {
    creado() {
      console.log(this.data);
      this.imprimirBtn = true;
    },

    imprimir() {
      //this.imprimirBtn = false;

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

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 62,
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
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
