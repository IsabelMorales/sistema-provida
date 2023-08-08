<template>
  <q-page padding>
    <!-- ---------LA FACTURA------------ -->
    <q-card
      class="card-factura text-caption"
      id="impresionSeguro"
      v-show="pdfSeguro"
    >
      <div class="row">
        <div class="col-6 q-pr-lg">
          <q-card-section>
            <div class="row">
              <div class="col-2">
                <div>Serie A</div>
              </div>
              <div class="col-3">
                <div class="text-weight-bold">
                  Factura N°: {{ this.numero_factura }}
                </div>
              </div>
              <div class="col-3">
                <div>
                  Condición:
                  {{ this.tipo_factura == 1 ? "Contado" : "Crédito" }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 low-height">
                Nombre y apellido o razón social: {{ this.nombre_cliente }}
              </div>
            </div>
            <div class="row">
              <div class="col-8 low-height">
                RIF, cédula de identidad o pasaporte N°: {{ this.cedulaRIF }}
              </div>
              <div class="col-4 text-right low-height">Teléfono: {{ this.telefono }}</div>
            </div>
            <div class="row">
              <div class="col-8 low-height">Paciente: {{ this.nombre_paciente }}</div>
              <div class="col-4 low-height text-right">
                C.I. N°: {{ this.cedula }}
              </div>
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
              <div class="col-3" style="border: 1px solid #000">
                <div class="row">
                  <div class="col-1 q-mr-xs">NI:</div>
                  <div
                    class="col-1 q-mr-md"
                    v-for="orden in ordenes"
                    :key="orden.orden_numero"
                  >
                    {{ orden.orden_numero }}
                  </div>
                </div>
              </div>
              <div
                class="col-6"
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
                  <div class="col-12 low-height">
                    Subtotal $: {{ this.subtotalDolares }}
                  </div>
                  <div class="col-12 low-height">
                    Descuento $: {{ this.descuentoDolares }}
                  </div>
                  <div class="col-12 low-height">
                    Valor total de la venta $: {{ this.valorTotalVentaDolares }}
                  </div>
                  <div class="col-12 low-height">
                    Base imponible IGTF 3% $: {{ this.baseImponibleDolares }}
                  </div>
                  <div class="col-12 low-height">
                    IGTF percibido 3% $: {{ this.igtfDolares }}
                  </div>
                  <div class="col-12 low-height">
                    Total a pagar $: {{ this.totalPagarDolares }}
                  </div>
                </div>
              </div>
              <div class="col-5">
                <div class="col-12 low-height">
                  Subtotal Bs: {{ this.subtotalBs }}
                </div>
                <div class="col-12 low-height">
                  Descuento Bs: {{ this.descuentoBs }}
                </div>
                <div class="col-12 low-height">
                  Valor total de la venta Bs: {{ this.valorTotalVentaBs }}
                </div>
                <div class="col-12 low-height">
                  Base imponible IGTF 3% Bs: {{ this.baseImponibleBs }}
                </div>
                <div class="col-12 low-height">
                  IGTF percibido 3% Bs: {{ this.igtfBs }}
                </div>
                <div class="col-12 low-height">
                  Total a pagar Bs: {{ this.totalPagarBs }}
                </div>
              </div>
              <div class="col-3 text-center">
                <qrcode-vue :value="this.qr" size="80" level="H" />
              </div>
            </div>
          </q-card-section>
        </div>
        <!-- LA COPIA DE LA FACTURA -->
        <div class="col-6 q-pl-lg">
          <q-card-section>
            <div class="row">
              <div class="col-2">
                <div>Serie A</div>
              </div>
              <div class="col-3">
                <div class="text-weight-bold">
                  Factura N°: {{ this.numero_factura }}
                </div>
              </div>
              <div class="col-3">
                <div>
                  Condición:
                  {{ this.tipo_factura == 1 ? "Contado" : "Crédito" }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 low-height">
                Nombre y apellido o razón social: {{ this.nombre_cliente }}
              </div>
            </div>
            <div class="row">
              <div class="col-8 low-height">
                RIF, cédula de identidad o pasaporte N°: {{ this.cedulaRIF }}
              </div>
              <div class="col-4 text-right low-height">Teléfono: {{ this.telefono }}</div>
            </div>
            <div class="row">
              <div class="col-8 low-height">Paciente: {{ this.nombre_paciente }}</div>
              <div class="col-4 low-height text-right">
                C.I. N°: {{ this.cedula }}
              </div>
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
              <div class="col-3" style="border: 1px solid #000">
                <div class="row">
                  <div class="col-1 q-mr-xs">NI:</div>
                  <div
                    class="col-1 q-mr-md"
                    v-for="orden in ordenes"
                    :key="orden.orden_numero"
                  >
                    {{ orden.orden_numero }}
                  </div>
                </div>
              </div>
              <div
                class="col-6"
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
                  <div class="col-12 low-height">
                    Subtotal $: {{ this.subtotalDolares }}
                  </div>
                  <div class="col-12 low-height">
                    Descuento $: {{ this.descuentoDolares }}
                  </div>
                  <div class="col-12 low-height">
                    Valor total de la venta $: {{ this.valorTotalVentaDolares }}
                  </div>
                  <div class="col-12 low-height">
                    Base imponible IGTF 3% $: {{ this.baseImponibleDolares }}
                  </div>
                  <div class="col-12 low-height">
                    IGTF percibido 3% $: {{ this.igtfDolares }}
                  </div>
                  <div class="col-12 low-height">
                    Total a pagar $: {{ this.totalPagarDolares }}
                  </div>
                </div>
              </div>
              <div class="col-5">
                <div class="col-12 low-height">
                  Subtotal Bs: {{ this.subtotalBs }}
                </div>
                <div class="col-12 low-height">
                  Descuento Bs: {{ this.descuentoBs }}
                </div>
                <div class="col-12 low-height">
                  Valor total de la venta Bs: {{ this.valorTotalVentaBs }}
                </div>
                <div class="col-12 low-height">
                  Base imponible IGTF 3% Bs: {{ this.baseImponibleBs }}
                </div>
                <div class="col-12 low-height">
                  IGTF percibido 3% Bs: {{ this.igtfBs }}
                </div>
                <div class="col-12 low-height">
                  Total a pagar Bs: {{ this.totalPagarBs }}
                </div>
              </div>
              <div class="col-3 text-center">
                <qrcode-vue :value="this.qr" size="80" level="H" />
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
  props: [
    "factura",
    "tipo_factura",
    "cambio_bs",
    "subtotal_dolares",
    "subtotal_bs",
    "total_dolares",
    "total_bs",
    "descuento_dolares",
    "descuento_bs",
    "cliente",
    "paciente",
  ],

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
    let nombre_paciente;
    let cedula;
    let subtotalDolares;
    let subtotalBs;
    let descuentoDolares;
    let descuentoBs;
    let valorTotalVentaDolares;
    let valorTotalVentaBs;
    let baseImponibleDolares;
    let baseImponibleBs;
    let igtfDolares;
    let igtfBs;
    let totalPagarDolares;
    let totalPagarBs;
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
        label: "Descripción de la venta o prestación de servicio",
        field: (row) => row.item.nombre,
        sortable: true,
      },
      {
        name: "precio",
        align: "right",
        label: "Precio unitario Bs.",
        field: (row) =>
          Number(Math.round(row.item.precio * this.cambio_bs + "e+2") + "e-2"),
        sortable: true,
      },
      {
        name: "subtotal",
        align: "right",
        label: "Monto",
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
      nombre_paciente,
      cedula,
      telefono,
      pdfSeguro: false,
      countDown: 1,
      subtotalDolares,
      subtotalBs,
      descuentoDolares,
      descuentoBs,
      valorTotalVentaDolares,
      valorTotalVentaBs,
      baseImponibleDolares,
      baseImponibleBs,
      igtfDolares,
      igtfBs,
      totalPagarDolares,
      totalPagarBs,
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
      console.log("CREACION DE LA FACTURA COMPA");
      console.log("!!!", this.factura);
      console.log("el cliente", this.cliente);
      console.log("el paciente", this.paciente[0]);
      console.log(this.cliente.id_tipo_cliente);

      this.fecha = this.factura[0].fecha_creacion;
      //this.numero_factura = this.factura[0].numero_factura;
      var digits = this.factura[0].numero_factura.toString().split("");
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
      this.nombre_paciente = this.paciente[0].nombre_paciente;
      this.cedula = this.paciente[0].cedula_paciente;

      this.subtotalDolares =
        this.factura[0].descuento_dolares +
        this.factura[0].valor_total_venta_dolares;
      this.subtotalBs =
        this.factura[0].descuento_bolivares +
        this.factura[0].valor_total_venta_bolivares;
      this.descuentoDolares = this.factura[0].descuento_dolares;
      this.descuentoBs = this.factura[0].descuento_bolivares;
      this.valorTotalVentaDolares = this.factura[0].valor_total_venta_dolares;
      this.valorTotalVentaBs = this.factura[0].valor_total_venta_bolivares;
      this.baseImponibleDolares = this.factura[0].base_imponible_dolares;
      this.baseImponibleBs = this.factura[0].base_imponible_bolivares;
      this.igtfDolares = this.factura[0].IGTF_dolares;
      this.igtfBs = this.factura[0].IGTF_bolivares;
      this.totalPagarDolares = this.factura[0].total_pagar_dolares;
      this.totalPagarBs = this.factura[0].total_pagar_bolivares;
      this.ordenes = this.factura[2].ordenes;
      this.qr = this.factura[0].factura_qr;

      if (this.cliente.cliente_apellido == null ||
        this.cliente.cliente_apellido == "null") {
        this.nombre_cliente = this.cliente.cliente_nombre;
      } else {
        console.log("no es convenio");
        this.nombre_cliente =
          this.cliente.cliente_nombre + " " + this.cliente.cliente_apellido;
      }

      this.telefono = this.cliente.telefono;
      console.log(this.tipos_pagos);
      console.log(this.ordenes);

      this.pdfSeguro = true;
      var doc = new jsPDF("p", "pt", "a5");
      doc.html(document.getElementById("impresionSeguro"), {
        //margin: [0, 0, 0, 0],
        callback: function (doc) {
          doc.autoPrint();
          doc.output("dataurlnewwindow");
        },
        windowWidth: 1100,
        width: 410,
        y: 50,
      });
    },
  },

  created() {
    this.countDownTimer();
  },
};
</script>
