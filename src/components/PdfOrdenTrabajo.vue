<template>
  <q-page padding>
    <!-- ---------LA FACTURA------------ -->
    <q-card class="card-factura text-caption" id="impresion">
      <div class="row">
        <div class="col-6 q-pr-lg">
          <q-card-section>
            <div class="row">
              <div class="col-4">
                <img
                  src="../assets/logo.png"
                  style="width: 120px; height: 70px"
                  alt=""
                />
              </div>
              <div class="col-8">
                <div class="row text-center q-mt-sm">
                  <div class="col-12 text-subtitle2 text-weight-bold">
                    LABORATORIO CLINICO PROVIDA C.A.
                  </div>
                  <div class="col-12" style="line-height: 0.7rem">
                    RIF J-30514892-9
                    <br />
                    Sucursal La Concordia
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-5">
                <div class="text-weight-bold">
                  Orden de trabajo Nº: {{ this.numero_factura }}
                </div>
              </div>
              <div class="col-3">
                <div>
                  Condición:
                  {{ this.tipo_factura == 3 ? "Contado" : "Crédito" }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">Cliente: {{ this.nombre_cliente }}</div>
              <div class="col-6 text-right">
                RIF/C.I/Pasaporte N°: {{ this.cedulaRIF }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">Teléfono: {{ this.telefono }}</div>
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
                Total examenes: {{ this.total_items }}
              </div>
              <div class="col-4" style="border: 1px solid #000">
                <div class="row">
                  <div class="col-1">NI:</div>
                  <div
                    class="col-2"
                    v-for="orden in ordenes"
                    :key="orden.orden_numero"
                  >
                    {{ orden.orden_numero }}
                  </div>
                </div>
              </div>
              <div
                class="col-5"
                style="border: 1px solid #000; border-left: none"
              >
                <div class="row">
                  <div
                    class="col"
                    v-for="pago in tipos_pagos"
                    :key="pago.nombre"
                  >
                    {{ pago.nombre }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 low-height q-pb-xs">
                Este documento se emite en cumplimiento a lo establecido en la
                ley IVA, art. 51 y LBCV art. 129. Tipo de cambio BCV s/fecha
                Bs.: {{ this.cambio_bs }}
              </div>
            </div>
            <q-separator />
            <div class="row">
              <div class="col-4">
                <div class="row">
                  <div class="col-12">
                    Total excento $: {{ this.subtotalDolares }}
                  </div>
                  <div class="col-12">
                    Total descuento $: {{ this.descuento_dolares }}
                  </div>
                  <div class="col-12">
                    Valor total de la venta $: {{ this.valorTotalVentaDolares }}
                  </div>
                </div>
              </div>
              <div class="col-5">
                <div class="col-12">Subtotal Bs: {{ this.subtotalBs }}</div>
                <div class="col-12">
                  Total descuento Bs: {{ this.descuento_bs }}
                </div>
                <div class="col-12">
                  Valor total de la venta Bs: {{ this.valorTotalVentaBs }}
                </div>
              </div>
              <div class="col-3 text-center">
                <qrcode-vue :value="this.qr" size="80" level="H" />
              </div>
            </div>
          </q-card-section>
        </div>
        <!-- LA COPIA DE LA FACTURA -->
        <div class="col-6 q-pL-lg">
          <q-card-section>
            <div class="row">
              <div class="col-4">
                <img
                  src="../assets/logo.png"
                  style="width: 120px; height: 70px"
                  alt=""
                />
              </div>
              <div class="col-8">
                <div class="row text-center q-mt-sm">
                  <div class="col-12 text-subtitle2 text-weight-bold">
                    LABORATORIO CLINICO PROVIDA C.A.
                  </div>
                  <div class="col-12" style="line-height: 0.7rem">
                    RIF J-30514892-9
                    <br />
                    Sucursal La Concordia
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-5">
                <div class="text-weight-bold">
                  Orden de trabajo Nº: {{ this.numero_factura }}
                </div>
              </div>
              <div class="col-3">
                <div>
                  Condición:
                  {{ this.tipo_factura == 3 ? "Contado" : "Crédito" }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">Cliente: {{ this.nombre_cliente }}</div>
              <div class="col-6 text-right">
                RIF/C.I/Pasaporte N°: {{ this.cedulaRIF }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">Teléfono: {{ this.telefono }}</div>
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
                Total examenes: {{ this.total_items }}
              </div>
              <div class="col-4" style="border: 1px solid #000">
                <div class="row">
                  <div class="col-1">NI:</div>
                  <div
                    class="col-2"
                    v-for="orden in ordenes"
                    :key="orden.orden_numero"
                  >
                    {{ orden.orden_numero }}
                  </div>
                </div>
              </div>
              <div
                class="col-5"
                style="border: 1px solid #000; border-left: none"
              >
                <div class="row">
                  <div
                    class="col"
                    v-for="pago in tipos_pagos"
                    :key="pago.nombre"
                  >
                    {{ pago.nombre }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 low-height q-pb-xs">
                Este documento se emite en cumplimiento a lo establecido en la
                ley IVA, art. 51 y LBCV art. 129. Tipo de cambio BCV s/fecha
                Bs.: {{ this.cambio_bs }}
              </div>
            </div>
            <q-separator />
            <div class="row">
              <div class="col-4">
                <div class="row">
                  <div class="col-12">
                    Total excento $: {{ this.subtotalDolares }}
                  </div>
                  <div class="col-12">
                    Total descuento $: {{ this.descuento_dolares }}
                  </div>
                  <div class="col-12">
                    Valor total de la venta $: {{ this.valorTotalVentaDolares }}
                  </div>
                </div>
              </div>
              <div class="col-5">
                <div class="col-12">Subtotal Bs: {{ this.subtotalBs }}</div>
                <div class="col-12">
                  Total descuento Bs: {{ this.descuento_bs }}
                </div>
                <div class="col-12">
                  Valor total de la venta Bs: {{ this.valorTotalVentaBs }}
                </div>
              </div>
              <div class="col-3 text-center"></div>
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
import QrcodeVue from "qrcode.vue";

export default {
  props: [
    "factura",
    "tipo_factura",
    "cambio_bs",
    "subtotal_dolares",
    "subtotal_bs",
    "total_bs",
    "total_dolares",
    "descuento_dolares",
    "descuento_bs",
    "cliente",
    "convenio",
  ],

  components: {
    QrcodeVue,
  },

  data() {
    let fecha;
    let numero_factura = 0;
    let rows_tabla = ref([]);
    let total_items = 0;
    let ordenes = ref([]);
    let tipos_pagos = ref([]);
    let nombre_cliente;
    let cedulaRIF;
    let telefono;
    let laFactura;
    let subtotalBs = 0;
    let subtotalDolares = 0;
    let valorTotalVentaDolares = 0;
    let valorTotalVentaBs = 0;
    let qr;

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
        align: "left",
        label: "Descripción",
        field: (row) => row.item.nombre,
        sortable: true,
      },
      {
        name: "precio",
        align: "right",
        label: "Precio Bs.",
        field: (row) =>
          Number(Math.round(row.item.precio * this.cambio_bs + "e+2") + "e-2"),
        sortable: true,
      },
      {
        name: "subtotal",
        align: "right",
        label: "Total Bs.",
        field: (row) =>
          Number(
            Math.round(row.item.subtotal * this.cambio_bs + "e+2") + "e-2"
          ),
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
      numero_factura,
      rows_tabla,
      total_items,
      ordenes,
      tipos_pagos,
      columns_tabla,
      nombre_cliente,
      cedulaRIF,
      telefono,
      pdfOrdenTrabajo: false,
      laFactura,
      countDown: 1,
      subtotalBs,
      subtotalDolares,
      valorTotalVentaDolares,
      valorTotalVentaBs,
      qr,
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
      console.log("CREACION DE LA ORDEN TRABAJO COMPA");
      console.log("!!!", this.factura);
      console.log("aaaaaa", this.total_dolares);
      //console.log(JSON.parse(this.factura))
      console.log("el cliente", this.cliente);
      console.log(this.cliente.id_tipo_cliente);
      //this.laFactura=JSON.parse(this.factura);

      this.fecha = this.factura[0].fecha_creacion;
      this.qr = this.factura[0].factura_qr;
      console.log("EL QR", this.qr);
      //this.numero_factura = this.factura[0].orden_trabajo;
      var digits = this.factura[0].orden_trabajo.toString().split("");
      var realDigits = digits.map(Number);
      var numeroFact = [];

      console.log("digits", digits);
      console.log("realdigits", realDigits, realDigits.length);
      var largo = 8 - realDigits.length;
      for (let i = 0; i < largo; i++) {
        numeroFact.push(0);
      }
      for (let i = 0; i < realDigits.length; i++) {
        numeroFact.push(realDigits[i]);
      }
      console.log("el numero arreglado", numeroFact, numeroFact.join(""));
      this.numero_factura = numeroFact.join("");

      this.rows_tabla = this.factura[2].items;
      this.total_items = this.factura[2].cantidad_items;
      this.tipos_pagos = this.factura[1].pagos;
      this.cedulaRIF = this.cliente.cedula_RIF;
      this.valorTotalVentaDolares = this.factura[0].valor_total_venta_dolares;
      this.valorTotalVentaBs = this.factura[0].valor_total_venta_bolivares;

      this.subtotalBs =
        this.factura[0].descuento_bolivares +
        this.factura[0].valor_total_venta_bolivares;

      this.subtotalDolares =
        this.factura[0].descuento_dolares +
        this.factura[0].valor_total_venta_dolares;

      this.ordenes = this.factura[2].ordenes;

      if (
        this.cliente.cliente_apellido == null ||
        this.cliente.cliente_apellido == "null"
      ) {
        this.nombre_cliente = this.cliente.cliente_nombre;
      } else {
        console.log("no es convenio");
        this.nombre_cliente =
          this.cliente.cliente_nombre + " " + this.cliente.cliente_apellido;
      }

      this.telefono = this.cliente.telefono;
      console.log(this.tipos_pagos);
      console.log(this.ordenes);

      var doc = new jsPDF("p", "pt", "a5");
      doc.html(document.getElementById("impresion"), {
        //margin: [0, 0, 0, 0],
        callback: function (doc) {
          doc.autoPrint();
          doc.output("dataurlnewwindow");
        },
        windowWidth: 1000,
        width: 410,
        x: 3,
      });
    },
  },

  created() {
    this.countDownTimer();
    console.log("LAS VERGAS", this.total_bs, this.total_dolares);
  },
};
</script>
