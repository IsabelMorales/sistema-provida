<template>
  <q-page padding v-if="this.acceso == 1">
    <div class="fit row justify-center">
      <div class="col-12 q-py-md">
        <q-card flat bordered class="cards" id="impresion">
          <div class="row">
            <div class="col-10">
              <h6 class="q-my-md q-ml-md">RELACION PACIENTES PRUEBAS</h6>
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
            class="row q-mb-md text-subtitle1"
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
            <div class="col-12 q-pl-md">
              <div
                class="row text-subtitle2"
                v-for="factura in cliente.detalles_factura"
                :key="factura.id_factura"
              >
                <div
                  class="col-12 text-subtitle1"
                  v-if="factura.numero_factura != null"
                >
                  <q-separator color="grey-5" />
                  <span class="text-bold">Factura: </span>
                  {{
                    getFactura(factura.numero_factura, cliente.cliente_nombre)
                  }}
                  <q-separator color="grey-5" />
                </div>
                <div class="col-12 text-subtitle1" v-else>
                  <q-separator color="grey-5" />
                  <span class="text-bold">Orden de trabajo: </span>
                  {{
                    getFactura(factura.orden_trabajo, cliente.cliente_nombre)
                  }}
                  <q-separator color="grey-5" />
                </div>
                <div class="col-12 q-mt-sm">
                  <div
                    class="row"
                    v-for="paciente in factura.pacientes"
                    :key="paciente.paciente_cedula"
                  >
                    <div class="col-2">
                      <span class="text-bold">Orden: </span>
                      {{ paciente.numero_orden }}
                    </div>
                    <div class="col-2">
                      {{ paciente.paciente_cedula }}
                    </div>
                    <div class="col-7">
                      {{ paciente.paciente_nombre }}
                      {{ paciente.paciente_apellido }}
                    </div>
                    <div class="col-12 text-bold">Examenes</div>
                    <div class="col-12">
                      <div
                        class="row"
                        v-for="examenes in paciente.detalles_examen_cultivo"
                        :key="examenes.examen_codigo"
                      >
                        <template v-if="examenes.examen_nombre">
                          <div class="col-2">
                            {{ examenes.examen_codigo }}
                          </div>
                          <div class="col-5">
                            {{ examenes.examen_nombre }}
                          </div>
                          <div class="col-1 text-right">
                            {{ examenes.examen_precio }}$
                          </div>
                        </template>
                        <template v-else>
                          <div class="col-2">
                            {{ examenes.cultivo_codigo }}
                          </div>
                          <div class="col-5">
                            {{ examenes.cultivo_nombre }}
                          </div>
                          <div class="col-1 text-right">
                            {{ examenes.cultivo_precio }}$
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="col-12 q-mb-sm">
                      <q-separator />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12">
              <q-separator color="grey-7" size="0.1rem" />
            </div>
          </div>
          <div class="row text-subtitle2 text-bold q-ml-md q-mb-md">
            <div class="col-2">Total de facturas: {{ this.totales }}$</div>
          </div>

          <!--<div class="row text-subtitle1 q-ml-md">
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
          </div>-->
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
import { ref } from "vue";
import axios from "axios";
import { jsPDF } from "jspdf";

export default {
  props: ["info"],

  data() {
    let imprimirBtn = ref(true);
    let clientes = this.info.clientes_factura;
    let totales = this.info.total_dolares;
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

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
      totales,
      acceso,
    };
  },

  methods: {
    getFactura(numero, nombre) {
      console.log("el numero", numero, nombre);
      var digits = numero.toString().split("");
      var realDigits = digits.map(Number);
      var numeroFact = [];
      var largo = 8 - realDigits.length;
      for (let i = 0; i < largo; i++) {
        numeroFact.push(0);
      }
      for (let i = 0; i < realDigits.length; i++) {
        numeroFact.push(realDigits[i]);
      }
      return numeroFact.join("");
    },

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
        id_tarea: 65,
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
