<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE PRUEBAS -->
        <q-card flat bordered class="cards" v-if="this.cuentas">
          <q-card-section>
            <div class="row">
              <div class="col-4">
                <p class="text-h6 q-mb-none q-mt-xs">Cuentas por cobrar</p>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row">
              <div class="col-6">
                <div class="row">
                  <div class="col-12 text-subtitle1">
                    Nombre del cliente: {{ this.cliente.cliente_nombre }}
                    {{ this.cliente.cliente_apellido }}
                  </div>
                  <div class="col-6 text-subtitle1">
                    Cédula/RIF: {{ this.cliente.cedula_RIF }}
                  </div>
                  <div class="col-6 text-subtitle1">
                    Telefono: {{ this.cliente.telefono }}
                  </div>
                  <div class="col-12 text-subtitle1">
                    Saldo pendiente:
                    <span class="text-red text-weight-bold">
                      {{ this.debe_total }} $
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <!-- TABLA QUE MUESTRA TODOS LOS EXAMENES -->
            <q-table
              title="Pendientes por pagar"
              :rows="facturas"
              :columns="columns"
              :pagination="initialPagination"
              no-data-label="No hay facturas disponibles"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <!-- BOTON DETALLE FACTURA -->
                  <template v-if="props.row.fecha_creacion_factura">
                    <router-link
                      :to="{
                        name: 'FacturasDetalle',
                        params: { id: props.row.id_factura },
                      }"
                    >
                      <q-btn
                        dense
                        round
                        flat
                        padding="md"
                        color="grey"
                        icon="visibility"
                      >
                      </q-btn>
                    </router-link>
                  </template>

                  <!-- BOTON DETALLE REGISTRO -->
                  <template v-if="props.row.id_registro_convenio">
                    <q-btn
                      dense
                      round
                      flat
                      padding="md"
                      color="grey"
                      icon="visibility"
                      @click="facturarConvenio()"
                    >
                    </q-btn>
                  </template>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
          <q-card-section>
            <div class="row">
              <q-space />
              <div class="col-2 text-right">
                <q-btn
                  label="Volver"
                  @click="onCancel"
                  color="primary"
                  class="q-mt-sm"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- MODAL QUE MUESTRA LOS REGISTROS -->
    <CrearReciboRegistroConvenio
      v-if="this.facturacion"
      :id="this.id"
      :cliente="this.cliente"
      @onCancelar="cancelarFacturacion"
      @onFacturar="facturar"
    >
    </CrearReciboRegistroConvenio>

    <!-- MODAL DE PAGOS -->
    <!-- CUANDO EL FROM ES 1 SE FACTURA -->
    <ModalPagos
      v-if="pagos"
      :totalDolares="this.total_dolares"
      :cambioPesosActual="this.cambio_pesos"
      :cambioBs="this.cambio_bs"
      :descuento_fijo="this.descuento"
      :idTipoFactura="3"
      :from="1"
      @finalizarPagos="onAgregarPagos"
    ></ModalPagos>

    <!-- CREACION DE PDF DEL RECIBO -->
    <PdfReciboRC
      v-if="this.pdf"
      :detallesRecibo="this.detallesRecibo"
      :recibo="this.recibo"
      :convenios="this.convenios_aux"
    ></PdfReciboRC>
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

  <q-page padding v-else></q-page>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import CrearReciboRegistroConvenio from "./ModalRegistrosConvenio.vue";
import ModalPagos from "../components/ModalPagos.vue";
import PdfReciboRC from "../components/PdfReciboRC.vue";

export default {
  props: ["id_cliente", "from"],

  components: {
    CrearReciboRegistroConvenio,
    ModalPagos,
    PdfReciboRC,
  },

  data() {
    let info = ref({});
    let cliente = ref({});
    let id;
    let debe_total;
    let descuento;
    let facturas = ref([]);
    let acceso = ref(null);
    let facturacion = ref(false);
    let cuentas = ref(true);
    let cambio_bs = 0;
    let cambio_pesos = 0;
    let detallesRecibo = ref(null);
    let total_dolares = 0;
    let pagos = ref(false);
    let pdf = ref(false);
    let recibo = ref(null);
    let convenios_aux = ref([]);
    let enviar = {
      id_cliente: this.id_cliente,
    };

    const ip = process.env.BASE_URL;

    const columns = [
      {
        name: "fecha",
        required: true,
        label: "Fecha",
        align: "left",
        field: (row) => {
          if (row.fecha) {
            return row.fecha;
          } else if (row.fecha_creacion_factura) {
            return row.fecha_creacion_factura;
          }
        },
        sortable: true,
      },
      {
        name: "numero",
        align: "left",
        label: "Numero",
        field: (row) => {
          if (row.numero_factura == null) {
            return row.numero_registro_convenio;
          } else {
            return row.numero_factura;
          }
        },
        sortable: true,
      },
      {
        name: "debe",
        align: "left",
        label: "Debe",
        field: (row) => {
          if (row.debe_dolares) {
            return row.debe_dolares;
          } else {
            return row.total_dolares;
          }
        },
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      ip,
      cliente,
      debe_total,
      facturas,
      columns,
      acceso,
      id,
      facturacion,
      cuentas,
      descuento,
      cambio_bs,
      cambio_pesos,
      detallesRecibo,
      total_dolares,
      pagos,
      pdf,
      recibo,
      convenios_aux,
      countDown: 5,
      info,
      enviar,
    };
  },

  methods: {
    buscarCuentasPorCobrar() {
      this.facturas = [];

      axios.post(this.ip + "cuentasPorCobrar", this.enviar).then((response) => {
        this.info = response.data;
        console.log(
          "EL RESPONSE de cuentas por cobrar",
          this.info,
          this.id_cliente
        );

        this.cliente = this.info.cliente;
        this.id = this.info.cliente.id_cliente;
        this.debe_total = this.info.debe_dolares;
        this.descuento = this.info.cliente.descuento_fijo;

        for (let i = 0; i < this.info.facturas.length; i++) {
          this.facturas = [...this.facturas, this.info.facturas[i]];
        }
        for (let i = 0; i < this.info.registros_convenios.length; i++) {
          this.facturas = [...this.facturas, this.info.registros_convenios[i]];
        }

        console.log("el from", this.from);
        if (this.from == 2) {
          console.log("entro al from");
          this.facturarConvenio();
        }
      });
    },

    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }

      if (this.countDown == 0) {
        this.buscarCuentasPorCobrar();
        this.cuentas = true;
        this.pagos = false;
        this.pdf = false;
      }
    },

    cancelarFacturacion() {
      this.cuentas = true;
      this.facturacion = false;
    },

    facturar(e) {
      console.log("lo que se trae de facturar", e);
      this.total_dolares = e.total_dolares;
      //this.total_bolivares = e.total_bolivares;
      //this.total_pesos = e.total_pesos;
      this.registros_convenios = e.registros_convenios;
      this.convenios_aux = e.convenios;
      this.facturacion = false;
      this.pagos = true;
    },

    onAgregarPagos(e) {
      console.log("response de modal pagos", e);
      this.total_bolivares = Number(
        Math.round(this.total_dolares * this.cambio_bs + "e+2") + "e-2"
      );
      this.total_pesos = Number(
        Math.round(this.total_dolares * e[0].cambio_pesos_arreglado + "e+2") +
          "e-2"
      );

      console.log("total bs", this.total_bolivares, this.cambio_bs);
      let usuario = parseInt(localStorage.id);

      let factura = {
        id_usuario: usuario,
        monto_bolivares: this.total_bolivares,
        monto_pesos: this.total_pesos,
        monto_dolares: this.total_dolares,
        descuento_bolivares: e[0].descuento_bolivares,
        descuento_pesos: e[0].descuento_pesos,
        descuento_dolares: e[0].descuento_dolares,
        IGTF_bolivares: e[0].igtf_bs,
        IGTF_dolares: e[0].igtf_dolares,
        IGTF_pesos: e[0].igtf_pesos,
        tasa_pesos_dia: e[0].cambio_pesos_arreglado,
        tasa_bolivar_dia: this.cambio_bs,
        registros_convenio: this.registros_convenios,
        pagos: e[0].pagos,
      };

      console.log("EL JSON DE LA FACTURA", factura);

      axios
        .post(this.ip + "crearReciboRegistroConvenio", factura)
        .then((response) => {
          console.log(
            "EL RESPONSE del final de REGISTROS CONVENIO",
            response.data
          );

          this.recibo = response.data.recibo[0];
          this.detallesRecibo = response.data.detallesRecibo;
          console.log(this.recibo);
          console.log(this.detallesRecibo);

          this.pdf = true;
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
          this.countDownTimer();
        });
    },

    facturarConvenio() {
      this.cuentas = false;
      this.facturacion = true;
    },

    // CANCELAR //
    onCancel() {
      this.$router.go();
    },

    // SE TRAE LAS TASAS DEL DIA
    async getDivisas() {
      console.log("EL MASHUP", this.facturas);
      let datos = await axios.get(this.ip + "registroDivisas");
      console.log("LAS DIVISAS en facturacion", datos.data.registroDivisas);

      for (let i = 0; i < datos.data.registroDivisas.length; i++) {
        if (datos.data.registroDivisas[i].id_divisa == 1) {
          this.cambio_pesos = datos.data.registroDivisas[i].tasa_actual;
        } else if (datos.data.registroDivisas[i].id_divisa == 3) {
          this.cambio_bs = datos.data.registroDivisas[i].tasa_actual;
        }
      }

      console.log("LOS PESOS", this.cambio_pesos);
      console.log("LOS BS", this.cambio_bs);
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 50,
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
    this.buscarCuentasPorCobrar();
    this.getDivisas();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
