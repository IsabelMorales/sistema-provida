<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10" v-show="factura">
        <!-- CARD MODIFICACION DE PRUEBAS -->
        <q-card flat bordered class="cards">
          <q-card-section>
            <div class="row">
              <div class="col-4">
                <p class="text-h6 q-mb-none q-mt-xs">Detalles de factura</p>
              </div>
              <div class="col-8 text-right align-center">
                <q-btn
                  color="primary"
                  label="Nota a crédito"
                  @click="crearNotaCredito"
                  v-if="
                    (this.rol == 5 || this.rol == 6) && this.status != 'ANULADO'
                  "
                  class="q-mr-md"
                />
                <q-btn
                  color="primary"
                  label="Anular factura"
                  @click="modalAnular"
                  v-if="
                    (this.rol == 5 || this.rol == 6) && this.status != 'ANULADO'
                  "
                  class="q-mr-md"
                />
                <q-btn
                  color="primary"
                  label="Reimprimir factura"
                  @click="reimprimirFactura"
                  v-if="this.rol == 6 || this.rol==5"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row">
              <div class="col-6">
                <div class="row">
                  <div class="col-12 text-subtitle1">
                    Nombre del cliente: {{ this.nombre_cliente }}
                  </div>
                  <div class="col-12 text-subtitle1">
                    Cédula/RIF: {{ this.cedula_RIF }}
                  </div>
                  <div class="col-12 text-subtitle1">
                    Usuario de facturación: {{ this.nombre_usuario }}
                  </div>
                  <div
                    class="col-12 text-subtitle1"
                    v-if="motivo_anulacion != null"
                  >
                    Usuario de anulació: {{ this.usuario_anulacion }}
                  </div>
                  <div
                    class="col-12 text-subtitle1"
                    v-if="motivo_anulacion != null"
                  >
                    Motivo de anulación: {{ this.motivo_anulacion }}
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-12 text-subtitle1">
                    Numero de factura: {{ this.numero_factura }}
                  </div>
                  <div class="col-6 text-subtitle1">
                    Condición: {{ this.tipo }}
                  </div>
                  <div
                    class="col-6 text-subtitle1"
                    v-if="this.status == 'POR PAGAR'"
                  >
                    Estatus: <span class="text-red">{{ this.status }}</span>
                  </div>
                  <div class="col-6 text-subtitle1" v-else>
                    Estatus: {{ this.status }}
                  </div>
                  <div class="col-12 text-subtitle1">
                    Fecha de creación: {{ this.fecha_creacion }}
                  </div>
                  <div class="col-12 text-subtitle1">
                    Fecha de cancelacion: {{ this.fecha_cancelacion }}
                  </div>
                  <div class="col-12 text-subtitle1">
                    Orden de trabajo asociada: {{ this.orden_trabajo }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row text-subtitle1">
              Ordenes:
              <template v-for="orden in ordenes">
                {{ orden.numero_orden }} -
              </template>
            </div>
            <div class="row q-mt-md">
              <div class="col-4 text-subtitle1">
                Total en Bolivares: {{ getTotalBs }}
              </div>
              <div class="col-4 text-subtitle1">
                Total en Dolares: {{ this.totalDolares }}
              </div>
              <div class="col-4 text-subtitle1">
                Total en Pesos: {{ this.totalPesos }}
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <!-- TABLA QUE MUESTRA TODOS LOS EXAMENES -->
            <q-table
              title="Pagos"
              :rows="rows_pagos"
              :columns="columns_pagos"
              :pagination="initialPagination"
              :loading="carga"
              no-data-label="No hay pagos disponibles"
            >
              <template v-slot:top-right>
                <!-- BOTON MODIFICAR PAGOS -->
                <q-btn
                  class="q-ml-xl"
                  color="primary"
                  label="Modificar pagos"
                  @click="modificarPagos"
                  v-if="this.rol == 6 && this.rows_pagos.length!=0"
                >
                </q-btn>

                <!-- BOTON AGREGAR PAGO -->
                <q-btn
                  v-if="
                    this.tipo == 'CREDITO' && (this.rol == 5 || this.rol == 6)
                  "
                  class="q-ml-xl"
                  color="primary"
                  label="Agregar pago"
                  @click="agregarPagos"
                >
                </q-btn>
              </template>
            </q-table>
          </q-card-section>

          <q-card-section class="text-right">
            <q-btn
              class="q-ml-xl"
              color="primary"
              label="Volver"
              @click="onCancel"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- MODAL CONFIRMACION ANULACION FACTURA -->
    <q-dialog v-model="modalMotivo">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <span class="q-ml-sm">
            <div class="text-subtitle1">Ingrese el concepto.</div>
            <q-input v-model="motivo" label="concepto" class="text-uppercase" />
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR INHABILITAR FACTURA -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- INHABILITAR FACTURA -->
          <q-btn
            unelevated
            label="Siguiente"
            color="primary"
            class="q-mr-md"
            @click="crearNota()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <PdfReciboPagoCredito v-if="pdfPago" :recibo="this.recibo">
    </PdfReciboPagoCredito>

    <!-- MODAL DE PAGOS -->
    <!-- CUANDO ES 1 VA DESDE LA FACTURACION -->
    <!-- CUANDO EL FROM ES 2, MODIFICA LOS METODOS DE PAGO -->
    <!-- CUANDO EL FROM ES 3, AGREGA UN PAGO -->
    <ModalPagos
      v-if="modal_pagos"
      :from="this.desde"
      :totalDolares="this.totalDolares"
      :cambioPesosFactura="this.cambio_pesos_factura"
      :cambioBs="this.cambio_bs"
      :cambioPesosActual="this.cambio_pesos_actual"
      :idFactura="this.id"
      :idTipoFactura="this.tipo_id"
      :debeDolares="this.debe_dolares"
      :igtfDolares="this.igtf_dolares"
      :pagosFactura="JSON.stringify(this.rows_pagos)"
      :descuento_fijo="this.descuento_fijo"
      @abonoListo="onImprimirAbono"
      @cancelarPagos="onCancelarPagos"
    ></ModalPagos>

    <!-- MODAL DE PAGOS PARA CREAR UNA NOTA A CREDITO/DEBITO -->
    <ModalPagosNotas
      v-if="modal_pagos_notas"
      :totalDolares="this.totalDolares + this.igtf_dolares"
      :cambioPesosArreglado="this.cambio_pesos_factura"
      :cambioBs="this.cambio_bs"
      :idFactura="this.id"
      :examCultArray="this.examCultArray"
      @finalizarPagos="onAgregarPagos"
      @cancelarPagos="onCancelarPagosNotas"
    ></ModalPagosNotas>

    <PdfNotaCredito v-if="pdf_nc" :recibo="this.recibo"> </PdfNotaCredito>

    <!-- MODAL DE FACTURA SERIE A -->
    <factura-serie-a
      v-if="pdfSerieA"
      :factura="this.factura"
      :tipo_factura="this.tipo_factura"
      :cambio_bs="this.cambio_bs"
      :total_dolares="this.total_dolares"
      :total_bs="this.total_bs"
      :descuento_dolares="this.descuento_dolares"
      :descuento_bs="this.descuento_bs"
      :cliente="this.cliente"
    >
    </factura-serie-a>
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
import ModalPagos from "../components/ModalPagos.vue";
import ModalPagosNotas from "../components/ModalPagosNotas.vue";
import PdfReciboPagoCredito from "../components/PdfReciboPagoCredito.vue";
import PdfNotaCredito from "../components/PdfNotaCredito.vue";
import FacturaSerieA from "../components/PdfFacturacionSerieA.vue";

export default {
  props: ["id"],

  components: {
    ModalPagos,
    ModalPagosNotas,
    PdfReciboPagoCredito,
    PdfNotaCredito,
    FacturaSerieA,
  },

  data() {
    let fecha_creacion = ref(null);
    let fecha_cancelacion = ref(null);
    let numero_factura = ref(null);
    let orden_trabajo = ref(null);
    let tipo = ref(null);
    let status = ref(null);
    let nombre_usuario = ref(null);
    let nombre_cliente = ref(null);
    let cedula_RIF = ref(null);
    let carga = ref(true);
    let rows_pagos = ref([]);
    let totalDolares = ref(null);
    let totalPesos = ref(null);
    let totalBs = ref(null);
    let factura = ref(true);
    let modal_pagos = ref(false);
    let pdf_nc = ref(false);
    let cambio_bs_factura = ref(null);
    let cambio_pesos_factura = ref(null);
    let cambio_bs_actual = ref(null);
    let cambio_bs = ref(null);
    let cambio_pesos_actual = ref(null);
    let debe_dolares = ref(null);
    let igtf_dolares = 0;
    let igtf_pesos = 0;
    let igtf_bolivares = 0;
    let desde = 0;
    let modalMotivo = ref(false);
    let motivo = ref(null);
    let modal_pagos_notas = ref(false);
    let isNotaCredito = ref(null);
    let usuario_anulacion = ref(null);
    let motivo_anulacion = ref(null);
    let recibo = ref(null);
    let pdfPago = ref(false);
    let examCultArray = ref([]);
    let rol = parseInt(localStorage.rol);
    let acceso = ref(null);
    let pdfSerieA = ref(false);
    let tipo_factura = ref(null);
    let total_dolares = ref(null);
    let total_bs = ref(null);
    let descuento_dolares = ref(null);
    let descuento_bs = ref(null);
    let descuento_fijo = 0;
    let cliente = ref(null);
    let ordenes = ref(null);
    let tipo_id=ref(null);

    let idFactura = {
      id_factura: this.id,
    };

    const ip = process.env.BASE_URL;

    const columns_pagos = [
      {
        name: "monto",
        required: true,
        label: "Monto",
        align: "left",
        field: (row) => row.monto,
        sortable: true,
      },
      {
        name: "divisa_nombre",
        align: "left",
        label: "Divisa",
        field: "divisa_nombre",
        sortable: true,
      },
      {
        name: "tipo_pago_nombre",
        align: "left",
        label: "Modo de pago",
        field: "tipo_pago_nombre",
        sortable: true,
      },
      {
        name: "banco_nombre",
        align: "left",
        label: "Banco",
        field: "banco_nombre",
        sortable: true,
      },
      {
        name: "numero_referencia",
        align: "left",
        label: "Numero de referencia",
        field: "numero_referencia",
        sortable: true,
      },
      {
        name: "igtf_pago",
        align: "left",
        label: "Tipo de pago",
        field: (row) => {
          if (row.igtf_pago == "0") {
            if (row.tipo_registro == "1") {
              return "VUELTOS";
            } else {
              return "PAGO";
            }
          } else {
            return "IGTF";
          }
        },
        sortable: true,
      },
    ];

    // BUSCA TODOS LOS DATOS DE LA FACTURA
    axios
      .post(ip + "buscarFactura", idFactura)
      .then((response) => {
        console.log("el response", response.data);
        console.log("los examenes", response.data.examenes);

        this.fecha_creacion =
          response.data.detallesFiscales.fecha_creacion_factura;

        this.fecha_cancelacion =
          response.data.detallesFiscales.fecha_cancelacion;

        this.numero_factura = response.data.detallesFiscales.numero_factura;
        console.log(response.data.detallesFiscales.orden_trabajo);

        if (response.data.detallesFiscales.orden_trabajo == null) {
          this.orden_trabajo = "No posee";
        } else {
          this.orden_trabajo = response.data.detallesFiscales.orden_trabajo;
        }

        this.tipo = response.data.detallesFiscales.tipo_factura_nombre;
        this.tipo_id = response.data.detallesFiscales.id_tipo_factura;
        this.status = response.data.detallesFiscales.nombre;

        this.nombre_usuario =
          response.data.detallesFiscales.usuario_nombre +
          " " +
          response.data.detallesFiscales.usuario_apellido;

        if (
          response.data.detallesFiscales.cliente_apellido == null ||
          response.data.detallesFiscales.cliente_apellido == "null"
        ) {
          this.nombre_cliente = response.data.detallesFiscales.cliente_nombre;
        } else {
          this.nombre_cliente =
            response.data.detallesFiscales.cliente_nombre +
            " " +
            response.data.detallesFiscales.cliente_apellido;
        }

        this.cedula_RIF = response.data.detallesFiscales.cedula_RIF;

        this.rows_pagos = response.data.registroDePagos;

        this.totalDolares = response.data.detallesFiscales.total_dolares;

        this.totalPesos = response.data.detallesFiscales.total_pesos;

        this.totalBs = response.data.detallesFiscales.total_bolivares;

        this.cambio_bs_factura =
          response.data.detallesFiscales.tasa_bolivar_dia;

        this.cambio_pesos_factura =
          response.data.detallesFiscales.tasa_pesos_dia;

        this.debe_dolares = response.data.detallesFiscales.debe_dolares;

        this.igtf_dolares = response.data.detallesFiscales.IGTF_dolares;
        this.igtf_pesos = response.data.detallesFiscales.IGTF_pesos;
        this.igtf_bolivares = response.data.detallesFiscales.IGTF_bolivares;
        this.descuento_fijo = response.data.detallesFiscales.descuento_fijo;

        this.usuario_anulacion =
          response.data.detallesFiscales.usuario_nombre_anulacion +
          " " +
          response.data.detallesFiscales.usuario_apellido_anulacion;
        this.motivo_anulacion = response.data.detallesFiscales.anulacion_motivo;

        this.ordenes = response.data.ordenes;

        for (let i = 0; i < response.data.examenes.length; i++) {
          examCultArray.value = [
            ...examCultArray.value,
            response.data.examenes[i],
          ];
        }

        for (let i = 0; i < response.data.cultivos.length; i++) {
          examCultArray.value = [
            ...examCultArray.value,
            response.data.cultivos[i],
          ];
        }

        console.log("debe lolares", this.debe_dolares);
        console.log("el super array", examCultArray.value);

        console.log(response.data);
      })
      .finally(() => {
        carga.value = false;
      });

    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      ip,
      idFactura,
      fecha_creacion,
      fecha_cancelacion,
      numero_factura,
      orden_trabajo,
      tipo,
      status,
      nombre_usuario,
      nombre_cliente,
      cedula_RIF,
      columns_pagos,
      carga,
      rows_pagos,
      totalDolares,
      totalPesos,
      totalBs,
      factura,
      modal_pagos,
      cambio_bs_factura,
      cambio_pesos_factura,
      cambio_bs_actual,
      cambio_pesos_actual,
      cambio_bs,
      debe_dolares,
      igtf_dolares,
      igtf_pesos,
      igtf_bolivares,
      desde,
      modalMotivo,
      motivo,
      isNotaCredito,
      modal_pagos_notas,
      usuario_anulacion,
      motivo_anulacion,
      recibo,
      pdfPago,
      examCultArray,
      pdf_nc,
      rol,
      acceso,
      pdfSerieA,
      tipo_factura,
      total_dolares,
      total_bs,
      descuento_dolares,
      descuento_bs,
      descuento_fijo,
      cliente,
      ordenes,
      tipo_id,
      countDown:5
    };
  },

  methods: {
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
      if (this.countDown == 0) {
        this.$router.go();
      }
    },
    
    // CANCELAR //
    onCancel() {
      this.$router.push("/Facturas");
    },

    onCancelarPagos() {
      this.modal_pagos = false;
      this.factura = true;
    },

    onCancelarPagosNotas() {
      this.modal_pagos_notas = false;
      this.factura = true;
    },

    //ACTIVAR MODAL DE PAGOS PARA LA MODIFICACION DE LOS PAGOS
    modificarPagos() {
      this.factura = false;
      this.modal_pagos = true;
      this.desde = 2;
      this.cambio_bs = this.cambio_bs_factura;
    },

    // ACTIVAR MODAL DE PAGOS PARA AGREGAR UN PAGO NUEVO
    agregarPagos() {
      this.factura = false;
      this.modal_pagos = true;
      this.desde = 3;
      this.cambio_bs = this.cambio_bs_actual;
      //this.cambio_bs = this.cambio_bs_factura;
    },

    // ACTIVA EL MODAL DEL CONCEPTO POR NOTA A CREDITO
    crearNotaCredito() {
      this.modalMotivo = true;
      this.isNotaCredito = 1;
      this.cambio_bs = this.cambio_bs_factura;
    },

    // ANULAR LA FACTURA SIN NOTA A CREDITO
    modalAnular() {
      this.modalMotivo = true;
    },

    // ACTIVA EL MODAL DEL CONCEPTO POR NOTA A DEBITO
    crearNotaDebito() {
      this.modalMotivo = true;
      this.isNotaCredito = 0;
      this.cambio_bs = this.cambio_bs_actual;
    },

    // ACTIVA EL MODAL DE PAGOS DE LAS NOTAS O ENVIA LA ANULACION
    crearNota() {
      if (this.isNotaCredito == 1) {
        this.factura = false;
        this.modalMotivo = false;
        this.modal_pagos_notas = true;
      } else {
        this.factura = false;
        this.modalMotivo = false;
        let usuario = parseInt(localStorage.id);

        let anular = {
          anulacion_motivo: this.motivo.toUpperCase(),
          id_factura: this.id,
          id_usuario: usuario,
        };

        axios
          .post(this.ip + "anulacionFactura", anular)
          .then((response) => {
            console.log(response.data);
          })
          .catch((err) => console.log(err.message))
          .finally(() => {
            this.$router.go();
          });
      }
    },

    onImprimirAbono(e) {
      console.log("llego al imprimir!!!!!!!");
      this.pdfPago = true;
      this.recibo = e;
      this.countDownTimer();
    },

    onAgregarPagos(e) {
      console.log("el traido del modpagos", e);
      let pagos = e[0].pagos;
      let dolares = e[0].monto_dolares;
      let bs = e[0].monto_bolivares;
      let pesos = e[0].monto_pesos;
      let respuesta;
      let usuario = parseInt(localStorage.id);

      let nota = {
        id_usuario: usuario,
        num: e[0].num,
        id_factura: this.id,
        monto_bolivares: bs,
        monto_pesos: pesos,
        monto_dolares: dolares,
        concepto: this.motivo.toUpperCase(),
        pagos: pagos,
        detalles_factura_paciente: e[0].detalles_factura_paciente,
      };

      if (this.isNotaCredito == 1) {
        console.log("hizo nota credito", nota);
        axios
          .post(this.ip + "crearNotaCredito", nota)
          .then((response) => {
            console.log(response.data);
            this.recibo = response.data;
            this.respuesta = response.data;
          })
          .catch((err) => console.log(err.message))
          .finally(() => {
            if (respuesta != 1) {
              this.pdf_nc = true;
              this.countDownTimer();
            }
          });
      } else if (this.isNotaCredito == 0) {
        console.log("hizo nota debito");
        axios
          .post(this.ip + "crearNotaDebito", nota)
          .then((response) => {
            console.log(response);
            if (response.data === 1) {
              this.$router.go();
            }
          })
          .catch((err) => console.log(err.message));
      }
    },

    // SE TRAE LAS TASAS DEL DIA
    async getDivisas() {
      let datos = await axios.get(this.ip + "registroDivisas");
      console.log("LAS DIVISAS en facturacion", datos.data.registroDivisas);

      for (let i = 0; i < datos.data.registroDivisas.length; i++) {
        if (datos.data.registroDivisas[i].id_divisa == 1) {
          this.cambio_pesos_actual = datos.data.registroDivisas[i].tasa_actual;
        } else if (datos.data.registroDivisas[i].id_divisa == 3) {
          this.cambio_bs_actual = datos.data.registroDivisas[i].tasa_actual;
        }
      }

      console.log("LOS PESOS", this.cambio_pesos_atual);
      console.log("LOS BS", this.cambio_bs_actual);
    },

    async reimprimirFactura() {
      const res = await axios.get(
        this.ip + "imprimirFactura/" + this.id + "/" + this.tipo_id
      );
      console.log("la respuesta de imprimir", res.data);

      this.cliente = {
        cliente_nombre: res.data[0].cliente_nombre,
        cliente_apellido: res.data[0].cliente_apellido,
        telefono: res.data[0].telefono,
        cedula_RIF: res.data[0].cedula_RIF,
        id_tipo_cliente: 1,
      };

      this.factura = res.data;
      this.tipo_factura = this.tipo_id;
      this.cambio_bs = this.cambio_bs_factura;
      this.total_dolares = res.data[0].total_dolares;
      this.total_bs = res.data[0].total_bolivares;
      this.descuento_dolares = 0;
      this.descuento_bs = 0;

      this.pdfSerieA = true;
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
    this.getDivisas();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },

    getTotalBs() {
      return Number(Math.round(this.totalBs + "e+2") + "e-2");
    },
  },
};
</script>
