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
                  Recibo Nº: {{ this.numero_recibo }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">Cliente: {{ this.cliente_nombre }}</div>
              
            </div>
            <div class="row">
              <div class="col-6">
                RIF/C.I/Pasaporte N°: {{ this.cedula }}
              </div>
              <div class="col-4 text-right">Teléfono: {{ this.telefono }}</div>
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
              ></div>
              <div class="col-4" style="border: 1px solid #000">
                <div class="row"></div>
              </div>
              <div
                class="col-5"
                style="border: 1px solid #000; border-left: none"
              >
                <div class="row">
                  <div
                    class="col"
                    v-for="pago in tipos_pagos"
                    :key="pago.tipo_pago_nombre"
                  >
                    {{ pago.tipo_pago_nombre }}/
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-4">Total $: {{ this.total_dolares }}</div>
              <div class="col-4">Total COP: {{ this.total_pesos }}</div>
              <div class="col-4">Total Bs.: {{ this.total_bs }}</div>
            </div>
          </q-card-section>
        </div>
        <!-- LA COPIA DE LA FACTURA -->
        <div class="col-6 q-pl-lg">
          <q-card-section>
            <div class="row">
              <div class="col-8">
                <div class="text-weight-bold">
                  Recibo Nº: {{ this.numero_recibo }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">Cliente: {{ this.cliente_nombre }}</div>
              
            </div>
            <div class="row">
              <div class="col-6">
                RIF/C.I/Pasaporte N°: {{ this.cedula }}
              </div>
              <div class="col-4 text-right">Teléfono: {{ this.telefono }}</div>
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
              ></div>
              <div class="col-4" style="border: 1px solid #000">
                <div class="row"></div>
              </div>
              <div
                class="col-5"
                style="border: 1px solid #000; border-left: none"
              >
                <div class="row">
                  <div
                    class="col"
                    v-for="pago in tipos_pagos"
                    :key="pago.tipo_pago_nombre"
                  >
                    {{ pago.tipo_pago_nombre }}/
                  </div>
                </div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-4">Total $: {{ this.total_dolares }}</div>
              <div class="col-4">Total COP: {{ this.total_pesos }}</div>
              <div class="col-4">Total Bs.: {{ this.total_bs }}</div>
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
  props: ["recibo", "detallesRecibo", "convenios"],

  data() {
    let fecha;
    let numero_recibo = 0;
    let rows_tabla = ref([]);
    let tipos_pagos = ref([]);
    let cliente_nombre;
    let cedula;
    let telefono;
    let total_bs = 0;
    let total_pesos = 0;
    let total_dolares = 0;

    const columns_tabla = [
      {
        name: "fecha",
        required: true,
        label: "Fecha",
        align: "left",
        field: (row) => row.fecha,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero_registro_convenio",
        align: "center",
        label: "Numero de registro",
        field: (row) => row.numero_registro_convenio,
        sortable: true,
      },
      {
        name: "total_dolares",
        align: "center",
        label: "Total $",
        field: (row) => row.total_dolares,
        sortable: true,
      },
    ];

    return {
      initialPagination: {
        page: 1,
        rowsPerPage: 0,
      },
      fecha,
      numero_recibo,
      rows_tabla,
      tipos_pagos,
      columns_tabla,
      cliente_nombre,
      cedula,
      telefono,
      total_bs,
      total_pesos,
      total_dolares,
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
      console.log("CREACION DEL RECIBO COMPA");
      console.log(
        "!!!!!!!",
        this.recibo,
        this.detallesRecibo,
        this.convenios
      );

      this.cedula = this.recibo.cedula_RIF;
      if (this.recibo.cliente_apellido == null || this.recibo.cliente_apellido == "null") {
        this.cliente_nombre = this.recibo.cliente_nombre;
      } else {
        this.cliente_nombre =
          this.recibo.cliente_nombre + " " + this.recibo.cliente_apellido;
      }

      console.log("el nombre", this.cliente_nombre);

      this.fecha = this.recibo.fecha_creacion;
      this.total_bs = this.recibo.monto_bolivares;
      this.total_pesos = this.recibo.monto_pesos;
      this.total_dolares = this.recibo.monto_dolares;
      this.telefono = this.recibo.telefono;
      this.tipos_pagos = this.detallesRecibo;
      this.rows_tabla = this.convenios;
      this.numero_recibo = this.recibo.numero_recibo;

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
