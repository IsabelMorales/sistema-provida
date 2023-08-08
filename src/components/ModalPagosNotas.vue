<template>
  <q-page padding>
    <div class="fit row justify-center">
      <div class="col-12">
        <!-- CARD DE FACTURACION -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">FORMAS DE PAGO</div>
          </q-card-section>

          <q-card-section>
            <div class="row text-grey-7">
              <!-- TOTAL A PAGAR -->
              <div class="col-12 text-h6">Total de la factura</div>
              <div class="col-4">
                <div class="text-h6">
                  Bolivares:
                  {{ getBsFijo }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-h6">Pesos: {{ getPesosFijo }}</div>
              </div>
              <div class="col-3">
                <div class="text-h6">
                  Dolares:
                  {{ totalDolares }}
                </div>
              </div>
            </div>
            <div class="row">
              <!-- TOTAL A PAGAR -->
              <div class="col-12 text-h6">Total de la devolucion</div>
              <div class="col-4">
                <div class="text-h6">
                  Bolivares:
                  {{ getBolivaresDevolucion }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-h6">Pesos: {{ getPesosDevolucion }}</div>
              </div>
              <div class="col-3">
                <div class="text-h6">
                  Dolares:
                  {{ getDolaresDevolucion }}
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row">
              <div class="col-12 text-subtitle1 q-mb-md">
                Tipo de devolucion:
                <q-radio v-model="tipoDevolucion" val="0" label="Parcial" />
                <q-radio v-model="tipoDevolucion" val="1" label="Total" />
              </div>
              <div class="col-12">
                <q-table
                  title="Examenes y cultivos"
                  :rows="examCultArray"
                  :columns="columns"
                  row-key="id_detalle_factura_paciente"
                  selection="multiple"
                  v-model:selected="selected"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row justify-end q-mb-lg">
              <q-space />
              <div class="col-3 text-right">
                <q-btn
                  label="Agregar metodo de pago"
                  @click="addMetodoDePago"
                  color="primary"
                />
              </div>
            </div>

            <div v-for="(pago, index) in pagos" :key="index">
              <div class="row">
                <div class="col-1">
                  <q-input
                    v-model.number="pago.monto"
                    label="Monto"
                    type="number"
                  />
                </div>
                <div class="col-1">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_registro_divisa"
                    option-label="divisa_nombre"
                    v-model="pago.id_registro_divisa"
                    :options="divisasDatos"
                    label="Divisa"
                    class="q-ml-lg"
                  />
                </div>
                <div class="col-2">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_tipo_pago"
                    option-label="tipo_pago_nombre"
                    v-model="pago.id_tipo_pago"
                    :options="tiposDePagoDatos"
                    label="Tipo de pago"
                    class="q-ml-lg"
                  />
                </div>
                <div class="col-2">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_banco"
                    option-label="banco_nombre"
                    v-model="pago.id_banco"
                    :options="bancosDatos"
                    label="Banco"
                    class="q-ml-lg"
                    v-show="pago.id_tipo_pago != 2 && pago.id_tipo_pago != null"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    v-model="pago.numero_referencia"
                    label="# de referencia"
                    class="q-ml-lg"
                    v-show="pago.id_tipo_pago == 1"
                  />
                </div>
              </div>
            </div>

            <div class="row q-mt-xl">
              <q-space />
              <div class="col-3 text-right q-pt-md">
                <q-btn
                  label="Finalizar"
                  @click="finalizar"
                  color="primary"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  props: [
    "totalDolares",
    "cambioBs",
    "idFactura",
    "cambioPesosArreglado",
    "examCultArray",
  ],

  data() {
    // VARIABLES
    let divisasDatos = ref(null);
    let bancosDatos = ref(null);
    let tiposDePagoDatos = ref(null);
    let divisa = ref(null);
    let id_dolares = ref(null);
    let id_pesos = ref(null);
    let id_bolivares = ref(null);
    let id_registro_dolares = ref(null);
    let id_registro_pesos = ref(null);
    let id_registro_bolivares = ref(null);
    let tipoDevolucion = ref(null);
    const aux_total = ref([]);
    let total_dolares = this.totalDolares;
    let sumDol = 0;
    let sumPesos = 0;
    let sumBs = 0;
    const selected = ref([]);
    let comprobacion = ref(false);

    const ip = process.env.BASE_URL;

    let pagos = ref([]);
    const columns = [
      {
        name: "codigo",
        required: true,
        label: "Codigo",
        align: "left",
        field: (row) => {
          if (row.examen_codigo) {
            return row.examen_codigo;
          } else {
            return row.cultivo_codigo;
          }
        },
        sortable: true,
      },
      {
        name: "examen_nombre",
        align: "center",
        label: "Nombre",
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
        label: "Precio ($)",
        align: "left",
        field: (row) => {
          if (row.examen_precio) {
            return row.examen_precio;
          } else {
            return row.cultivo_precio;
          }
        },
        sortable: true,
      },
      {
        name: "nombre",
        required: true,
        label: "Paciente",
        align: "left",
        field: (row) => row.paciente_nombre + " " + row.paciente_apellido,
        sortable: true,
      },
      {
        name: "paciente_cedula",
        required: true,
        label: "Cedula",
        align: "left",
        field: (row) => row.paciente_cedula,
        sortable: true,
      },
    ];

    return {
      comprobacion,
      divisasDatos,
      bancosDatos,
      tiposDePagoDatos,
      divisa,
      pagos,
      id_dolares,
      id_pesos,
      id_bolivares,
      id_registro_dolares,
      id_registro_pesos,
      id_registro_bolivares,
      aux_total,
      ip,
      total_dolares,
      sumDol,
      sumPesos,
      sumBs,
      columns,
      selected,
      tipoDevolucion,
    };
  },

  methods: {
    addMetodoDePago() {
      this.pagos.push({
        monto: 0,
        id_registro_divisa: null,
        id_divisa: null,
        id_tipo_pago: null,
        id_banco: null,
        numero_referencia: null,
        agregado: "0",
      });
    },

    finalizar() {
      this.comprobacion = true;
      let total = 0;
      let pesos = 0;
      console.log("los pagos", this.pagos);
      for (let i = 0; i < this.pagos.length; i++) {
        if (this.pagos[i].id_registro_divisa == this.id_registro_dolares) {
          this.sumDol += parseFloat(this.pagos[i].monto);
        } else if (this.pagos[i].id_registro_divisa == this.id_registro_pesos) {
          this.sumPesos += parseFloat(this.pagos[i].monto);
        } else if (
          this.pagos[i].id_registro_divisa == this.id_registro_bolivares
        ) {
          this.sumBs += parseFloat(this.pagos[i].monto);
        }
      }
      console.log("las sum", this.sumDol, this.sumPesos, this.sumBs);
      this.sumPesos = this.sumPesos / this.cambioPesosArreglado;
      this.sumBs = this.sumBs / this.cambioBs;
      total = this.sumDol + this.sumPesos + this.sumBs;
      total = Number(Math.round(total + "e+2") + "e-2");
      console.log("el total", total);

      pesos = total * this.cambioPesosArreglado;
      var digits = pesos.toString().split("");
      console.log("los pesos string!!", digits);
      var i = digits.length;
      if (digits[i - 3] == ".") {
        digits.splice(i - 3, 3);
        var realDigits = digits.map(Number);
        pesos = realDigits.join("");
      }

      this.aux_total.push({
        pagos: this.pagos,
        monto_bolivares: Number(
          Math.round(total * this.cambioBs + "e+2") + "e-2"
        ),
        monto_pesos: parseInt(pesos),
        monto_dolares: Number(Math.round(total + "e+2") + "e-2"),
        num: parseInt(this.tipoDevolucion),
        detalles_factura_paciente: this.selected,
      });

      console.log("LOS PAGOS", this.aux_total);
      this.$emit("finalizarPagos", this.aux_total);
    },

    async getDivisas() {
      let datos = await axios.get(this.ip + "registroDivisas");
      console.log("LAS DIVISAS", datos.data.registroDivisas);
      this.divisasDatos = datos.data.registroDivisas;

      for (let i = 0; i < this.divisasDatos.length; i++) {
        if (this.divisasDatos[i].divisa_nombre == "DOLARES") {
          this.id_registro_dolares = this.divisasDatos[i].id_registro_divisa;
          this.id_dolares = this.divisasDatos[i].id_divisa;
        }
        if (this.divisasDatos[i].divisa_nombre == "PESOS") {
          this.id_registro_pesos = this.divisasDatos[i].id_registro_divisa;
          this.id_pesos = this.divisasDatos[i].id_divisa;
        }
        if (this.divisasDatos[i].divisa_nombre == "BOLIVARES") {
          this.id_registro_bolivares = this.divisasDatos[i].id_registro_divisa;
          this.id_bolivares = this.divisasDatos[i].id_divisa;
        }
      }
    },

    async getBancos() {
      let datos = await axios.get(this.ip + "bancos");
      console.log("LOS BANCOS", datos.data);
      this.bancosDatos = datos.data;
      console.log("EL SUPER ARRAY", this.examCultArray);
    },

    async getTiposDePago() {
      let datos = await axios.get(this.ip + "tiposDePago");
      console.log("LOS TIPOS DE PAGO", datos.data);
      this.tiposDePagoDatos = datos.data;
    },

    // CANCELAR EL PROCESO DE PAGOS
    onCancel() {
      this.comprobacion = false;
      this.$emit("cancelarPagosNotas", false);
    },
  },

  created() {
    this.getDivisas();
    this.getBancos();
    this.getTiposDePago();
  },

  computed: {
    // MUESTRA EL TOTAL A PAGAR EN PESOS
    getPesosFijo() {
      let pesos;
      pesos = this.total_dolares * this.cambioPesosArreglado;
      console.log("los dolares y los pesos", this.total_dolares, pesos);
      pesos = pesos.toFixed(20);
      pesos = Number(Math.round(pesos + "e+2") + "e-2");
      var digits = pesos.toString().split("");
      console.log("los pesos string!!", digits);
      var i = digits.length;
      if (digits[i - 3] == ".") {
        digits.splice(i - 3, 3);
        var realDigits = digits.map(Number);
        pesos = realDigits.join("");
      }
      return pesos;
    },

    // MUESTRA EL MONTO TOTAL A PAGAR EN BS
    getBsFijo() {
      return Number(
        Math.round(this.totalDolares * this.cambioBs + "e+2") + "e-2"
      );
    },

    //MUESTRA EL TOTAL DE DOLARES A DEVOLVER
    getDolaresDevolucion() {
      let dol = 0;

      if (this.tipoDevolucion == "1") {
        return this.total_dolares;
      } else {
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i].examen_precio) {
            dol += this.selected[i].examen_precio;
          } else {
            dol += this.selected[i].cultivo_precio;
          }
        }
        return dol;
      }
    },

    //MUESTRA EL TOTAL DE PESOS A DEVOLVER
    getPesosDevolucion() {
      let pesos = 0;

      if (this.tipoDevolucion == "1") {
        pesos = this.total_dolares * this.cambioPesosArreglado;
        console.log("los dolares y los pesos", this.total_dolares, pesos);
        pesos = pesos.toFixed(20);
        pesos = Number(Math.round(pesos + "e+2") + "e-2");
        var digits = pesos.toString().split("");
        console.log("los pesos string!!", digits);
        var i = digits.length;
        if (digits[i - 3] == ".") {
          digits.splice(i - 3, 3);
          var realDigits = digits.map(Number);
          pesos = realDigits.join("");
        }
        return pesos;
      } else {
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i].examen_precio) {
            pesos += this.selected[i].examen_precio * this.cambioPesosArreglado;
          } else {
            pesos +=
              this.selected[i].cultivo_precio * this.cambioPesosArreglado;
          }
        }
        pesos = pesos.toFixed(20);
        pesos = Number(Math.round(pesos + "e+2") + "e-2");
        var digits = pesos.toString().split("");
        console.log("los pesos string!!", digits);
        var i = digits.length;
        if (digits[i - 3] == ".") {
          digits.splice(i - 3, 3);
          var realDigits = digits.map(Number);
          pesos = realDigits.join("");
        }
        return pesos;
      }
    },

    //MUESTRA EL TOTAL DE BS A DEVOLVER
    getBolivaresDevolucion() {
      let bs = 0;

      if (this.tipoDevolucion == "1") {
        return Number(
          Math.round(this.totalDolares * this.cambioBs + "e+2") + "e-2"
        );
      } else {
        for (let i = 0; i < this.selected.length; i++) {
          if (this.selected[i].examen_precio) {
            bs += this.selected[i].examen_precio * this.cambioBs;
          } else {
            bs += this.selected[i].cultivo_precio * this.cambioBs;
          }
        }
        return Number(Math.round(bs + "e+2") + "e-2");
      }
    },
  },
};
</script>
