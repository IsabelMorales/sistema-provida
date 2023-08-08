<template>
  <q-page padding>
    <!-- ---------LA FACTURA------------ -->
    <q-card class="card-factura text-caption" id="impresion">
      <div class="row">
        <div class="col-6 q-pr-lg">
          <q-card-section>
            <div class="row">
              <div class="col-8">
                <div class="text-weight-bold">
                  Comprobante Nº: {{ this.numero_rc }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                Nombre y apellido o razón social: {{ this.nombre_cliente }}
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                RIF/C.I/Pasaporte N°: {{ this.cedulaRIF }}
              </div>
              <div class="col-6 text-right">Teléfono: {{ this.telefono }}</div>
            </div>
            <div class="row q-mt-xs">
              <div class="col-12">
                <q-table
                  :rows="rows_tabla"
                  :columns="columns_tabla"
                  row-key="nombre"
                  :hide-pagination="true"
                  class="tabla-factura"
                  dense
                  :pagination="initialPagination"
                >
                </q-table>
              </div>
            </div>
            <div class="row">
              <div
                class="col-3"
                style="border: 1px solid #000; border-right: none"
              >
                Total Examenes: {{ this.total_items }}
              </div>
              <div class="col-9" style="border: 1px solid #000">
                <div class="row">
                  <div class="col-1">NI:</div>
                  <div
                    class="col-2"
                    v-for="orden in ordenes"
                    :key="orden.numero_orden"
                  >
                    {{ orden.numero_orden }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-4">
                Total excento US$: {{ this.totalDolares }}
              </div>
            </div>
          </q-card-section>
        </div>
        <!-- LA COPIA DE LA FACTURA -->
        <div class="col-6 q-pl-lg">
          <q-card-section>
            <div class="row">
              <div class="col-8">
                <div class="text-weight-bold">
                  Comprobante Nº: {{ this.numero_rc }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                Nombre y apellido o razón social: {{ this.nombre_cliente }}
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                RIF/C.I/Pasaporte N°: {{ this.cedulaRIF }}
              </div>
              <div class="col-6 text-right">Teléfono: {{ this.telefono }}</div>
            </div>
            <div class="row q-mt-xs">
              <div class="col-12">
                <q-table
                  :rows="rows_tabla"
                  :columns="columns_tabla"
                  row-key="nombre"
                  :hide-pagination="true"
                  class="tabla-factura"
                  dense
                  :pagination="initialPagination"
                >
                </q-table>
              </div>
            </div>
            <div class="row">
              <div
                class="col-3"
                style="border: 1px solid #000; border-right: none"
              >
                Total Examenes: {{ this.total_items }}
              </div>
              <div class="col-9" style="border: 1px solid #000">
                <div class="row">
                  <div class="col-1">NI:</div>
                  <div
                    class="col-2"
                    v-for="orden in ordenes"
                    :key="orden.numero_orden"
                  >
                    {{ orden.numero_orden }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-4">
                Total excento US$: {{ this.totalDolares }}
              </div>
            </div>
          </q-card-section>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { jsPDF } from "jspdf";

export default {
  props: ["cliente", "factura", "totalDolares"],

  data() {
    let fecha;
    let numero_rc = 0;
    let rows_tabla = ref([]);
    let ordenes = ref([]);
    let nombre_cliente;
    let cedulaRIF;
    let telefono;
    let total_items = 0;

    const columns_tabla = [
      {
        name: "contador",
        required: true,
        label: "Cantidad",
        align: "left",
        field: (row) => row.item.contador,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "nombre",
        align: "center",
        label: "Descripcion",
        field: (row) => row.item.nombre,
        sortable: true,
      },
      {
        name: "precio",
        align: "center",
        label: "Precio $",
        field: (row) => row.item.precio,
        sortable: true,
      },
      {
        name: "subtotal",
        align: "center",
        label: "Total $",
        field: (row) => row.item.subtotal,
        sortable: true,
      },
    ];

    return {
      initialPagination: {
        page: 1,
        rowsPerPage: 0,
        // rowsNumber: xx if getting data from a server
      },
      fecha,
      numero_rc,
      rows_tabla,
      ordenes,
      total_items,
      columns_tabla,
      nombre_cliente,
      cedulaRIF,
      telefono,
      countDown: 1,
    };
  },

  methods: {
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 100);
      }
      if (this.countDown == 0) {
        this.crearFactura();
      }
    },

    crearFactura() {
      console.log("CREACION DEL COMPROBANTE COMPA");
      console.log("!!!", this.factura, this.cliente);
      this.numero_rc = this.factura[0].numero_registro_convenio;
      this.fecha = this.factura[0].fecha_creacion;
      this.total_items = this.factura[2].cantidad_items;
      this.rows_tabla = this.factura[2].items;
      this.ordenes = this.factura[2].ordenes;
      this.cedulaRIF = this.cliente.cedula_RIF;

      if (
        this.cliente.cliente_apellido == null ||
        this.cliente.cliente_apellido == "null"
      ) {
        this.nombre_cliente = this.cliente.cliente_nombre;
      } else {
        this.nombre_cliente =
          this.cliente.cliente_nombre + " " + this.cliente.cliente_apellido;
      }

      this.telefono = this.cliente.telefono;

      var doc = new jsPDF("p", "pt", "a5");
      doc.html(document.getElementById("impresion"), {
        //margin: [0, 0, 0, 0],
        callback: function (doc) {
          doc.autoPrint();
          doc.output("dataurlnewwindow");
        },
        windowWidth: 1000,
        width: 410,
        y: 50,
        x: 3,
      });
    },
  },

  created() {
    this.countDownTimer();
  },
};
</script>
