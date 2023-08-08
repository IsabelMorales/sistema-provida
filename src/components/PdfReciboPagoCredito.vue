<template>
  <q-page padding>
    <!-- ---------LA FACTURA------------ -->
    <q-card class="card-factura text-caption" id="imprimir">
      <q-card-section>
        <div class="row" style="border-style: solid">
          <div class="col-4">
            <img
              src="../assets/logo.png"
              style="width: 100px; height: 60px"
              alt=""
            />
          </div>
          <div class="col-8 self-center">
            <div class="row">
              <div class="col-12 text-subtitle1">
                LABORATORIO CLINICO PROVIDA C.A.
              </div>
            </div>
            <div class="row">
              <div class="col-12 text-subtitle2">
                Rif: J-30514892-2 Sucursal: La Concordia
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-center">
            <h5 class="text-bold">Recibo de cobro</h5>
          </div>
        </div>
        <div class="row q-mx-md text-subtitle1">
          <div class="col-3">
            <p>Numero de recibo:{{ this.numero_recibo }}</p>
          </div>
          <div class="col-5">
            <p v-if="this.esFactura==true">
              De la factura:
              {{ this.numero_factura }}
            </p>
            <p v-else>
              De la orden de trabajo:
              {{ this.numero_factura }}
            </p>
          </div>
          <div class="col-4">
            <p>Fecha: {{ this.fecha_creacion }}</p>
          </div>
          <div class="col-8">Cliente: {{ this.nombre_cliente }}</div>
          <div class="col-4">RIF/C.I./Pasaporte: {{ this.cedula_RIF }}</div>
          <div class="col-2 text-bold">Monto total:</div>
          <div class="col-3">{{ this.monto_bs }} Bs.</div>
          <div class="col-3">{{ this.monto_pesos }} COP</div>
          <div class="col-3">{{ this.monto_dolares }} $</div>

          <div class="col-2 text-bold">IGTF 3%:</div>
          <div class="col-3">{{ this.IGTF_bs }} Bs.</div>
          <div class="col-3">{{ this.IGTF_pesos }} COP</div>
          <div class="col-3">{{ this.IGTF_dolares }} $</div>
        </div>
        <div class="row q-mt-sm q-mx-md text-subtitle1">
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
      </q-card-section>
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
    let numero_recibo;
    let fecha_creacion;
    let cedula_RIF;
    let monto_pesos = 0;
    let monto_bs = 0;
    let monto_dolares = 0;
    let IGTF_bs=0;
    let IGTF_pesos=0;
    let IGTF_dolares=0;

    const columns_tabla = [
      {
        name: "monto",
        required: true,
        label: "Monto",
        align: "left",
        field: (row) => row.monto,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "divisa_nombre",
        align: "left",
        label: "Divisa",
        field: (row) => row.divisa_nombre,
        sortable: true,
      },
      {
        name: "tipo_pago_nombre",
        align: "left",
        label: "Metodo",
        field: (row) => row.tipo_pago_nombre,
        sortable: true,
      },
      {
        name: "banco_nombre",
        align: "left",
        label: "Banco",
        field: (row) => row.banco_nombre,
        sortable: true,
      },
      {
        name: "numero_referencia",
        align: "center",
        label: "# Referencia",
        field: (row) => row.numero_referencia,
        sortable: true,
      },
      {
        name: "igtf_pago",
        align: "left",
        label: "IGTF",
        field: (row) => {
          if (row.igtf_pago == "1") {
            return "SI";
          } else {
            return "NO";
          }
        },
        sortable: true,
      },
      {
        name: "tipo_registro",
        align: "left",
        label: "Vueltos",
        field: (row) => {
          if (row.tipo_registro == "1") {
            return "SI";
          } else {
            return "NO";
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
      numero_recibo,
      fecha_creacion,
      cedula_RIF,
      monto_bs,
      monto_dolares,
      monto_pesos,
      IGTF_dolares,
      IGTF_pesos,
      IGTF_bs,
      countDown: 1,
      esFactura:false
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

      this.rows_tabla = this.recibo.detallesRecibo;
      this.cedula_RIF = this.recibo.recibo[0].cedula_RIF;
      if (
        this.recibo.recibo[0].cliente_apellido == null ||
        this.recibo.recibo[0].cliente_apellido == "null"
      ) {
        this.nombre_cliente = this.recibo.recibo[0].cliente_nombre;
      } else {
        this.nombre_cliente =
          this.recibo.recibo[0].cliente_nombre +
          " " +
          this.recibo.recibo[0].cliente_apellido;
      }

      this.fecha_creacion = this.recibo.recibo[0].fecha_creacion;
      this.IGTF_bs=this.recibo.recibo[0].IGTF_bolivares;
      this.IGTF_pesos=this.recibo.recibo[0].IGTF_pesos;
      this.IGTF_dolares=this.recibo.recibo[0].IGTF_dolares;

      if(this.recibo.recibo[0].numero_factura==null){
        var digits = this.recibo.recibo[0].orden_trabajo.toString().split("");
      }else{
        var digits = this.recibo.recibo[0].numero_factura.toString().split("");
        this.esFactura=true;
      }
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

      // this.numero_recibo = this.recibo.recibo[0].numero_recibo;
      var digits = this.recibo.recibo[0].numero_recibo.toString().split("");
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
      this.numero_recibo = numeroFact.join("");

      this.monto_bs = this.recibo.recibo[0].monto_bolivares;
      this.monto_pesos = this.recibo.recibo[0].monto_pesos;
      var digits = this.recibo.recibo[0].monto_pesos.toString().split("");
      console.log("los pesos string!!", digits);
      var i = digits.length;
      if (digits[i - 3] == ".") {
        digits.splice(i - 3, 3);
        var realDigits = digits.map(Number);
        this.monto_pesos = realDigits.join("");
      } else if (digits[i - 2] == ".") {
        digits.splice(i - 2, 2);
        var realDigits = digits.map(Number);
        this.monto_pesos = realDigits.join("");
      }
      this.monto_dolares = this.recibo.recibo[0].monto_dolares;
      console.log("ta listo");

      var doc = new jsPDF("p", "pt", "a5");
      doc.html(document.getElementById("imprimir"), {
        //margin: [0, 0, 0, 0],
        callback: function (doc) {
          doc.autoPrint();
          doc.output("dataurlnewwindow");
        },
        windowWidth: 1000,
        width: 410,
        y: 5,
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
