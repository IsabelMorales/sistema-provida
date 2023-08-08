<template>
  <q-page padding>
    <!-- ---------LA FACTURA------------ -->
    <q-card class="card-factura text-caption" id="impresion">
      <div class="row">
        <div class="col-6 q-pr-lg">
          <q-card-section>
            <div class="row">
              <div class="col-4">
                <div class="text-weight-bold">
                  Nota crédito: {{ this.numero_nota }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold">
                  Factura N°: {{ this.numero_factura }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha_creacion }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                Nombre y apellido o razón social: {{ this.nombre_cliente }}
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                RIF, cédula de identidad o pasaporte N°: {{ this.cedula_RIF }}
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
              >
                Total examenes: {{ this.cantidad }}
              </div>
              <div class="col-3" style="border: 1px solid #000">
                <div class="row">
                  <div class="col-1 q-mr-xs">NI:</div>
                </div>
              </div>
              <div
                class="col-6"
                style="border: 1px solid #000; border-left: none"
              >
                <div class="row"></div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-4">Subtotal $: {{ this.totalPagarDolares }}</div>
              <div class="col-4">Descuento $: 0</div>
              <div class="col-4">
                Valor total del ajuste $: {{ this.totalPagarDolares }}
              </div>
              <div class="col-5">Base imponible IGTF 3% $: 0</div>
              <div class="col-4">IGTF percibido 3% $: 0</div>
              <div class="col-3">
                Total a pagar $: {{ this.totalPagarDolares }}
              </div>
            </div>
            <q-separator />
            <div class="row">
              <div class="col-4">Subtotal Bs: {{ this.totalPagarBs }}</div>
              <div class="col-4">Descuento Bs: 0</div>
              <div class="col-4">
                Valor total del ajuste Bs: {{ this.totalPagarBs }}
              </div>
              <div class="col-5">Base imponible IGTF 3% Bs: 0</div>
              <div class="col-4">IGTF percibido 3% Bs: 0</div>
              <div class="col-3">Total a pagar Bs: {{ this.totalPagarBs }}</div>
            </div>
          </q-card-section>
        </div>
        <!-- LA COPIA DE LA FACTURA -->
        <div class="col-6 q-pl-lg">
          <q-card-section>
            <div class="row">
              <div class="col-4">
                <div class="text-weight-bold">
                  Nota crédito: {{ this.numero_nota }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold">
                  Factura N°: {{ this.numero_factura }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-weight-bold text-right">
                  Fecha emisión: {{ this.fecha_creacion }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                Nombre y apellido o razón social: {{ this.nombre_cliente }}
              </div>
            </div>
            <div class="row">
              <div class="col-8">
                RIF, cédula de identidad o pasaporte N°: {{ this.cedula_RIF }}
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
              >
                Total examenes: {{ this.cantidad }}
              </div>
              <div class="col-3" style="border: 1px solid #000">
                <div class="row">
                  <div class="col-1 q-mr-xs">NI:</div>
                </div>
              </div>
              <div
                class="col-6"
                style="border: 1px solid #000; border-left: none"
              >
                <div class="row"></div>
              </div>
            </div>
            <div class="row q-mt-sm">
              <div class="col-4">Subtotal $: {{ this.totalPagarDolares }}</div>
              <div class="col-4">Descuento $: 0</div>
              <div class="col-4">
                Valor total del ajuste $: {{ this.totalPagarDolares }}
              </div>
              <div class="col-5">Base imponible IGTF 3% $: 0</div>
              <div class="col-4">IGTF percibido 3% $: 0</div>
              <div class="col-3">
                Total a pagar $: {{ this.totalPagarDolares }}
              </div>
            </div>
            <q-separator />
            <div class="row">
              <div class="col-4">Subtotal Bs: {{ this.totalPagarBs }}</div>
              <div class="col-4">Descuento Bs: 0</div>
              <div class="col-4">
                Valor total del ajuste Bs: {{ this.totalPagarBs }}
              </div>
              <div class="col-5">Base imponible IGTF 3% Bs: 0</div>
              <div class="col-4">IGTF percibido 3% Bs: 0</div>
              <div class="col-3">Total a pagar Bs: {{ this.totalPagarBs }}</div>
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
  props: ["recibo"],

  data() {
    let fecha;
    let numero_factura;
    let rows_tabla = ref([]);
    let nombre_cliente;
    let numero_nota;
    let fecha_creacion;
    let cedula_RIF;
    let monto_pesos = 0;
    let monto_bs = 0;
    let monto_dolares = 0;
    let concepto = ref(null);
    let telefono = ref(null);
    let totalPagarBs = 0;
    let totalPagarDolares = 0;
    let cantidad = 0;
    let cambioBs = 0;

    const columns_tabla = [
      {
        name: "cantidad",
        required: true,
        label: "Cantidad",
        align: "left",
        field: (row) => {
          return 1;
        },
        sortable: true,
      },
      {
        name: "examen_nombre",
        align: "left",
        label: "Descripción de la venta o prestación de servicio",
        field: (row) => {
          if (row.examen_nombre) {
            return row.examen_nombre;
          } else {
            return row.cultivo_nombre;
          }
        },
        sortable: true,
      },
      {
        name: "precio",
        required: true,
        label: "Precio unitario Bs.",
        align: "right",
        field: (row) => {
          if (row.examen_precio) {
            return Number(
              Math.round(row.examen_precio * this.cambioBs + "e+2") + "e-2"
            );
          } else {
            return Number(
              Math.round(row.cultivo_precio * this.cambioBs + "e+2") + "e-2"
            );
          }
        },
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
      columns_tabla,
      nombre_cliente,
      numero_nota,
      fecha_creacion,
      cedula_RIF,
      monto_bs,
      monto_dolares,
      monto_pesos,
      countDown: 1,
      concepto,
      telefono,
      totalPagarBs,
      totalPagarDolares,
      cantidad,
      cambioBs,
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
      console.log("CREACION DEL RECIBO DE PAGO COMPA");
      console.log("!!!", this.recibo);

      this.rows_tabla = this.recibo.items_devueltos;
      this.cedula_RIF = this.recibo.datos_factura.cedula_RIF;
      this.telefono = this.recibo.datos_factura.telefono;
      this.nombre_cliente =
        this.recibo.datos_factura.cliente_nombre +
        " " +
        this.recibo.datos_factura.cliente_apellido;
      this.fecha_creacion = this.recibo.datos_nota_credito.fecha_emision;
      //this.numero_factura = this.recibo.datos_factura.numero_factura;
      let digits = this.recibo.datos_factura.numero_factura.toString().split("");
      let realDigits = digits.map(Number);
      let numeroFact = [];

      console.log("digits", digits);
      console.log("realdigits", realDigits, realDigits.length);
      let largo = 8 - realDigits.length;
      for (let i = 0; i < largo; i++) {
        numeroFact.push(0);
      }
      for (let i = 0; i < realDigits.length; i++) {
        numeroFact.push(realDigits[i]);
      }
      console.log("el numero arreglado", numeroFact, numeroFact.join(""));
      this.numero_factura = numeroFact.join("");

      //this.numero_nota = this.recibo.datos_nota_credito.nota_credito_numero;
      digits = this.recibo.datos_nota_credito.nota_credito_numero
        .toString()
        .split("");
      realDigits = digits.map(Number);
      numeroFact = [];

      console.log("digits", digits);
      console.log("realdigits", realDigits, realDigits.length);
      largo = 8 - realDigits.length;
      for (let i = 0; i < largo; i++) {
        numeroFact.push(0);
      }
      for (let i = 0; i < realDigits.length; i++) {
        numeroFact.push(realDigits[i]);
      }
      console.log("el numero arreglado", numeroFact, numeroFact.join(""));
      this.numero_nota = numeroFact.join("");

      this.monto_bs = this.recibo.datos_nota_credito.monto_bolivares;
      this.monto_pesos = this.recibo.datos_nota_credito.monto_pesos;
      this.monto_dolares = this.recibo.datos_nota_credito.monto_dolares;
      this.concepto = this.recibo.datos_nota_credito.concepto;
      this.cantidad = this.recibo.items_devueltos.length;
      this.totalPagarBs = this.recibo.datos_nota_credito.monto_bolivares;
      this.totalPagarDolares = this.recibo.datos_nota_credito.monto_dolares;
      this.cambioBs = this.recibo.datos_factura.tasa_bolivar_dia;
      console.log("ta listo");
      console.log(this.cantidad);

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
    //this.crearFactura();
  },
};
</script>
