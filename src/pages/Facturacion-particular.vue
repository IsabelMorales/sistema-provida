<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- MODAL TIPO DE FACTURA -->
        <q-dialog v-model="tipoFactura">
          <q-card>
            <q-card-section>
              <div class="text-h6 text-center">FACTURACION PARTICULARES</div>
            </q-card-section>
            <q-card-section class="q-mx-md q-pb-sm" v-if="this.usuario!=128">
              <div class="row">
                <div class="col-12 text-center">
                  <div class="text-subtitle2 text-weight-bold">Facturación</div>
                </div>
              </div>
              <q-card-actions align="center" class="q-mb-sm">
                <!-- FACTURA A CONTADO -->
                <q-btn unelevated label="Factura a contado" color="primary" @click="onFacturaContado()" />

                <!-- FACTURA A CREDITO -->
                <q-btn unelevated label="Factura a crédito" color="primary" @click="onFacturaCredito()" />
              </q-card-actions>
            </q-card-section>

            <q-separator color="grey-6" />

            <q-card-section class="q-mx-lg q-pb-none" v-if="this.usuario!=128">
              <div class="row">
                <div class="col-12 text-center">
                  <div class="text-subtitle2 text-weight-bold">Otro tipo</div>
                </div>
              </div>
              <q-card-actions align="center" class="q-mb-md">
                <!-- ORDEN DE TRABAJO -->
                <q-btn
                  unelevated
                  label="OT a contado"
                  color="negative"
                  @click="onOrdenTrabajoContado()"
                />

                <q-btn
                  unelevated
                  label="OT a credito"
                  color="accent"
                  @click="onOrdenTrabajoCredito()"
                />
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- MODAL CLIENTE NO EXISTE -->
        <q-dialog v-model="clienteNoExiste" persistent>
          <q-card>
            <q-card-section class="row items-center q-ma-md">
              <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
              <span class="q-ml-sm">
                <div class="text-subtitle1">El cliente no existe</div>
              </span>
            </q-card-section>

            <q-card-actions align="center" class="q-mb-md">
              <!-- CANCELAR -->
              <q-btn unelevated label="Cancelar" color="grey-9" flat @click="onCancelar()" class="q-mr-md" />

              <!-- CREAR CLIENTE -->
              <q-btn unelevated label="Crear" color="primary" @click="onCrearCliente()" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- MODAL CLIENTE NO PARTICULAR -->
        <q-dialog v-model="clienteNoParticular" persistent>
          <q-card>
            <q-card-section class="row items-center q-ma-md">
              <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
              <span class="q-ml-sm">
                <div class="text-subtitle1">
                  El cliente no es un particular.
                </div>
              </span>
            </q-card-section>

            <q-card-actions align="center" class="q-mb-md">
              <!-- CANCELAR -->
              <q-btn label="Aceptar" color="primary" @click="onCancelarNoParticular()" class="q-mr-md" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- MODAL VERIFICACION CLIENTE -->
        <q-dialog v-model="clienteExistente" persistent transition-show="scale" transition-hide="scale">
          <q-card style="width: 400px; max-width: 80vw">
            <q-card-section>
              <div class="text-h6 text-center">
                Ingrese cédula o RIF del cliente
              </div>
            </q-card-section>
            <q-card-section>
              <q-form @submit="onComprobarCliente">
                <div class="row justify-center">
                  <!-- CEDULA O RIF DEL CLIENTE -->
                  <div class="col-3">
                    <q-select emit-value map-options option-value="documento_nombre" option-label="documento_nombre"
                      v-model="tipoDocumento" :options="tipoDocumentoData" label="Tipo"
                      class="q-mr-md text-uppercase text-center" />
                  </div>
                  <div class="col-7">
                    <q-input v-model="cedulaRIF" focus="clienteExistente" type="text" ref="cedulaRIF"
                      label="CEDULA O RIF" class="text-uppercase" />
                  </div>
                </div>

                <!-- BOTON DE SUBMIT -->
                <q-card-actions align="center" class="q-mt-lg">
                  <q-btn label="Comprobar" color="primary" type="submit" />
                </q-card-actions>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>

    <!-- MODAL DE CLIENTE NUEVO -->
    <ClienteNuevo v-model="clienteNuevo" :tipo="this.tipoDocumento" :cedula="this.cedulaRIF"
      @agregarCliente="onAgregarCliente" @cancelarCliente="onCancelarCliente"></ClienteNuevo>

    <!-- MODAL PARA AGREGAR LOS PACIENTES Y LOS EXAMENES/CULTIVOS -->
    <ModalExamenesParticulares v-show="facturacion" :nombreCliente="this.nombre_cliente" :cedulaRIF="this.cedulaRIF"
      :tipoFactura="this.tipo_factura" :cambioBs="this.cambio_bs" :cambioPesos="this.cambio_pesos"
      @finalizarPacientes="onAgregarPacientes"></ModalExamenesParticulares>

    <!-- MODAL DE PAGOS -->
    <!-- CUANDO EL FROM ES 1 PROVIENE DE FACTURACION -->
    <!-- CUANDO EL FROM ES 2 PROVIENE DE MODIFICACION DE PAGOS -->
    <!-- CUANDO EL FROM ES 3 PROVIENE DE AÑADIR PAGO -->
    <ModalPagos v-if="pagos" :totalDolares="this.total_dolares" :cambioPesosActual="this.cambio_pesos"
      :cambioBs="this.cambio_bs" :idTipoFactura="this.tipo_factura" :descuento_fijo="this.descuento_fijo" :from="1" :ifCancel="1"
      @finalizarPagos="onAgregarPagos" @cancelarPagos="onCancelarPagos"></ModalPagos>

    <!-- MODAL DE ORDEN DE TRABAJO -->
    <factura-orden-trabajo v-if="pdfOrdenTrabajo" :factura="this.factura" :tipo_factura="this.tipo_factura"
      :cambio_bs="this.cambio_bs" :subtotal_dolares="this.total_dolares" :subtotal_bs="this.total_bs"
      :descuento_dolares="this.descuento_dolares" :descuento_bs="this.descuento_bolivares"
      :total_dolares="this.total_dolares_descuento" :total_bs="this.total_bolivares_descuento" :cliente="this.cliente">
    </factura-orden-trabajo>

    <!-- MODAL DE FACTURA SERIE A -->
    <factura-serie-a v-if="pdfSerieA" :factura="this.factura" :tipo_factura="this.tipo_factura"
      :cambio_bs="this.cambio_bs" :total_dolares="this.total_dolares" :total_bs="this.total_bs"
      :descuento_dolares="this.descuento_dolares" :descuento_bs="this.descuento_bolivares"
      :total_descuento_dolares="this.total_dolares_descuento" :total_descuento_bs="this.total_bolivares_descuento"
      :cliente="this.cliente">
    </factura-serie-a>

    <!-- MODAL DE FACTURA PARA SEGURO -->
    <factura-seguro v-if="pdfSeguro" :factura="this.factura" :tipo_factura="this.tipo_factura"
      :cambio_bs="this.cambio_bs" :total_dolares="this.total_dolares" :total_bs="this.total_bs" :cliente="this.cliente"
      :paciente="this.pacientes">
    </factura-seguro>
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
import ModalExamenesParticulares from "../components/ModalExamenesParticulares.vue";
import ClienteNuevo from "../components/ClienteModalCreacion.vue";
import ModalPagos from "../components/ModalPagos.vue";
import FacturaOrdenTrabajo from "../components/PdfOrdenTrabajo.vue";
import FacturaSerieA from "../components/PdfFacturacionSerieA.vue";
import FacturaSeguro from "../components/PdfFacturacionSeguro.vue";

export default {
  components: {
    ModalExamenesParticulares,
    ClienteNuevo,
    ModalPagos,
    FacturaSeguro,
    FacturaOrdenTrabajo,
    FacturaSerieA,
  },

  data() {
    // MODALES
    let tipoFactura = ref(true);
    let clienteNuevo = ref(false);
    let clienteExistente = ref(false);
    let facturacion = ref(false);
    let pagos = ref(false);
    let clienteNoExiste = ref(false);
    let clienteNoParticular = ref(false);
    // VARIABLES
    let nombre = ref(null);
    let nombre_cliente = ref(null);
    let apellido = ref(null);
    let cedulaRIF = ref(null);
    const idCliente = ref(null);
    let correo = ref(null);
    let telefono = ref(null);
    let tipoCliente = ref(null);
    let pacientes = ref(null);
    let tipo_factura = ref(null);
    let fecha = ref(null);
    let numero_factura = ref(null);
    let total_items = ref(null);
    let tipoDocumento = ref(null);
    let total_dolares = 0;
    let total_bs = 0;
    let total_dolares_descuento = 0;
    let total_bolivares_descuento = 0;
    let cambio_pesos = 0;
    let cambio_bs = 0;
    let descuento_bolivares = 0;
    let descuento_dolares = 0;
    let rows_tabla = ref([]);
    let ordenes = ref([]);
    let tipos_pagos = ref([]);
    let tipoDocumentoData = ref([]);
    let factura;
    let cliente = ref(null);
    let seguro = ref(false);
    let numeroFactura = ref(null);
    let acceso = ref(null);
    let descuento_fijo=ref(null)
    let usuario=parseInt(localStorage.id);

    const ip = process.env.BASE_URL;

    return {
      ip,
      clienteNuevo,
      clienteExistente,
      nombre,
      apellido,
      cedulaRIF,
      idCliente,
      correo,
      telefono,
      tipoCliente,
      nombre_cliente,
      facturacion,
      pagos,
      total_dolares,
      total_bs,
      total_dolares_descuento,
      total_bolivares_descuento,
      descuento_bolivares,
      descuento_dolares,
      cambio_pesos,
      cambio_bs,
      pacientes,
      tipoFactura,
      tipo_factura,
      clienteNoExiste,
      pdfSerieA: false,
      pdfSeguro: false,
      pdfOrdenTrabajo: false,
      fecha,
      total_items,
      rows_tabla,
      numero_factura,
      ordenes,
      tipos_pagos,
      tipoDocumento,
      tipoDocumentoData,
      factura,
      cliente,
      seguro,
      countDown: 5,
      numeroFactura,
      acceso,
      clienteNoParticular,
      descuento_fijo,
      usuario
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

    onFacturaContado() {
      this.tipo_factura = 1;
      this.tipoFactura = false;
      this.clienteExistente = true;
    },

    onFacturaCredito() {
      this.tipo_factura = 2;
      this.tipoFactura = false;
      this.clienteExistente = true;
    },

    onOrdenTrabajoContado() {
      this.tipo_factura = 3;
      this.tipoFactura = false;
      this.clienteExistente = true;
    },

    onOrdenTrabajoCredito() {
      this.tipo_factura = 5;
      this.tipoFactura = false;
      this.clienteExistente = true;
    },

    onAgregarCliente(e) {
      console.log("LO QUE SE TRAE DEL CLIENTE NUEVO", e);

      this.cedulaRIF = e[0].cedula_RIF;
      this.nombre_cliente = e[0].cliente_nombre + " " + e[0].cliente_apellido;
      this.idCliente = e[0].id_cliente;
      this.cliente = e[0];
      this.clienteNuevo = false;
      this.facturacion = true;
    },

    onCancelarCliente(e) {
      console.log("el response de cancelar cliente", e);
      this.cedulaRIF = "";
      this.clienteNuevo = false;
      this.clienteExistente = true;
    },

    onCancelar() {
      this.cedulaRIF = "";
      this.clienteNoExiste = false;
      this.clienteExistente = true;
    },

    onCancelarNoParticular() {
      this.cedulaRIF = "";
      this.clienteNoParticular = false;
      this.clienteExistente = true;
    },

    onCrearCliente() {
      this.clienteNoExiste = false;
      this.clienteNuevo = true;
    },

    // SE TRAE LOS PACIENTES Y LOS EXAMENES DEL MODULO MODAL EXAMENES
    // TAMBIEN SE TRAE EL TOTAL DE DOLARES
    onAgregarPacientes(e) {
      console.log(e);
      this.seguro = e[0].seguro;
      this.total_dolares = e[0].total_dolares;
      console.log(this.total_dolares);
      console.log("la vaina de pacientes", e[0].pacientes);
      this.pacientes = e[0].pacientes;
      this.facturacion = false;
      this.pagos = true;
    },

    onCancelarPagos() {
      this.pagos = false;
      this.facturacion = true;
    },

    // SE TRAE EL TOTAL DE BOLIVARES Y PESOS TAMBIEN LAS FORMAS DE PAGO
    // Y SE ENVIA A LA API EL OBJETO FINAL
    onAgregarPagos(e) {
      console.log("la vaina de los pagos", e);
      this.pagos = e[0].pagos;
      this.total_bs = e[0].total_bolivares;
      this.total_bolivares_descuento = e[0].total_bolivares_descuento;
      this.total_dolares_descuento = e[0].total_dolares_descuento;
      this.descuento_bolivares = e[0].descuento_bolivares;
      this.descuento_dolares = e[0].descuento_dolares;

      console.log(
        "los totales total",
        this.total_bolivares_descuento,
        this.total_dolares_descuento
      );

      let usuario = parseInt(localStorage.id);

      let factura = {
        id_usuario: usuario,
        id_cliente: this.idCliente,
        total_bolivares: e[0].total_bolivares_descuento,
        total_dolares: this.total_dolares_descuento,
        total_pesos: e[0].total_pesos_descuento,
        id_tipo_factura: this.tipo_factura,
        IGTF_bolivares: e[0].igtf_bs,
        IGTF_dolares: e[0].igtf_dolares,
        IGTF_pesos: e[0].igtf_pesos,
        descuento_bolivares: e[0].descuento_bolivares,
        descuento_dolares: e[0].descuento_dolares,
        descuento_pesos: e[0].descuento_pesos,
        tasa_pesos_dia: e[0].cambio_pesos_arreglado,
        tasa_bolivar_dia: this.cambio_bs,
        pacientes: this.pacientes,
        pagos: e[0].pagos,
      };

      console.log("LA FACTURA", factura);
      console.log("EL SEGURO 🐶", this.seguro);

      axios
        .post(this.ip + "crearFacturaOrdenTrabajo", factura)
        .then((response) => {
          console.log("EL RESPONSE del final de fact", response.data);

          this.factura = response.data;
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
          if (this.factura == "ERROR EN AGREGAR FACTURA!") {
          } else {
            if (this.tipo_factura == 3|| this.tipo_factura == 5) {
              console.log("EL RESULT DE LA ORDEN DE TRABAJO", this.factura);

              this.pdfOrdenTrabajo = true;
            } else {
              if (this.seguro == false) {
                console.log("NO ES SEGURO");
                this.pdfSerieA = true;
              } else {
                console.log("SI ES SEGURO");
                this.pdfSeguro = true;
              }
            }

            this.countDownTimer();
          }
        });
    },

    // COMPROBAR Y RETORNAR CLIENTE //
    async onComprobarCliente() {
      let cliente = {
        cedula_RIF: this.tipoDocumento + this.cedulaRIF,
      };
      console.log("lo que envia", cliente);

      let datos = await axios.post(this.ip + "buscarClientePorCedula", cliente);
      console.log("lo que retorna", datos.data);

      if (datos.data == "0") {
        console.log("EL CLIENTE NO EXISTE");

        this.clienteExistente = false;
        this.clienteNoExiste = true;
      } else {
        console.log("EL CLIENTE EXISTE");

        if (datos.data[0].estatus == 1) {
          if (datos.data[0].id_tipo_cliente == 1) {
            this.cliente = datos.data[0];
            this.idCliente = datos.data[0].id_cliente;
            this.nombre_cliente =
              datos.data[0].cliente_nombre +
              " " +
              datos.data[0].cliente_apellido;
            this.cedulaRIF = datos.data[0].cedula_RIF;
            this.telefono = datos.data[0].telefono;
            this.descuento_fijo = datos.data[0].descuento_fijo;
            if (this.descuento_fijo == null) {
              this.descuento_fijo = 0;
            }

            console.log(this.nombre_cliente);
            console.log(this.cedulaRIF);
            console.log("EL CLIENTE", this.cliente);

            this.clienteNuevo = false;
            this.clienteExistente = false;
            this.facturacion = true;
          } else {
            this.clienteExistente = false;
            this.clienteNoParticular = true;
          }
        } else {
          console.log("CLIENTE MOROSO");
        }
      }
    },

    // SE TRAE LAS DIVISAS CON LAS TASAS DE CAMBIO
    async getDivisas() {
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

    // SE TRAE LOS TIPOS DE DOCUMENTOS
    async getDocumentos() {
      let datos = await axios.get(this.ip + "documentos");
      console.log("LOS DOCUMENTOS en facturacion", datos.data);
      this.tipoDocumentoData = datos.data;
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 4,
        token: localStorage.token,
      };

      console.log(usuario)

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
  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },

  created() {
    this.validar();
    this.getDivisas();
    this.getDocumentos();
  },
};
</script>
