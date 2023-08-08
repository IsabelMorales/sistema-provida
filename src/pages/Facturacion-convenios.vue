<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- MODAL TIPO DE FACTURA -->
        <q-dialog v-model="tipoFactura">
          <q-card>
            <q-card-section>
              <div class="text-h6 text-center">FACTURACION CONVENIOS</div>
            </q-card-section>
            <q-card-section class="q-mx-md q-pb-sm" v-if="this.usuario!=128">
              <div class="row">
                <div class="col-12 text-center">
                  <div class="text-subtitle2 text-weight-bold">Facturación</div>
                </div>
              </div>
              <q-card-actions align="center" class="q-mb-sm">
                <!-- FACTURA A CONTADO -->
                <q-btn
                  unelevated
                  label="Factura a contado"
                  color="primary"
                  @click="onFacturaContado()"
                />

                <!-- FACTURA A CREDITO -->
                <q-btn
                  unelevated
                  label="Factura a crédito"
                  color="primary"
                  @click="onFacturaCredito()"
                />
              </q-card-actions>
            </q-card-section>

            <q-separator color="grey-6" />

            <q-card-section class="q-mx-lg q-pb-none">
              <div class="row">
                <div class="col-12 text-center">
                  <div class="text-subtitle2 text-weight-bold">Otro tipo</div>
                </div>
              </div>
              <q-card-actions align="center" class="q-mb-md">
                <!-- ORDEN DE TRABAJO -->
                <q-btn
                  unelevated
                  label="Orden de trabajo"
                  color="negative"
                  @click="onOrdenTrabajo()"
                  v-if="this.usuario!=128"

                />

                <!-- REGISTRO CONVENIO -->
                <q-btn
                  unelevated
                  label="Registro convenio"
                  color="accent"
                  @click="onRegistroConvenio()"
                />
              </q-card-actions>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- MODAL CLIENTE NO PARTICULAR -->
        <q-dialog v-model="clienteNoConvenio" persistent>
          <q-card>
            <q-card-section class="row items-center q-ma-md">
              <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
              <span class="q-ml-sm">
                <div class="text-subtitle1">El cliente no es un convenio.</div>
              </span>
            </q-card-section>

            <q-card-actions align="center" class="q-mb-md">
              <!-- CANCELAR -->
              <q-btn
                label="Aceptar"
                color="primary"
                @click="onCancelarNoConvenio()"
                class="q-mr-md"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- MODAL CLIENTE NO EXISTE -->
        <q-dialog v-model="clienteNoExiste" persistent>
          <q-card>
            <q-card-section class="row items-center q-ma-md">
              <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
              <span class="q-ml-sm">
                <div class="text-subtitle1">El convenio no existe</div>
              </span>
            </q-card-section>

            <q-card-actions align="center" class="q-mb-md">
              <!-- CANCELAR -->
              <q-btn
                unelevated
                label="Aceptar"
                color="primary"
                @click="onCancelar()"
                class="q-mr-md"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!-- MODAL VERIFICACION CLIENTE -->
        <q-dialog
          v-model="clienteExistente"
          persistent
          transition-show="scale"
          transition-hide="scale"
        >
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
                    <q-select
                      emit-value
                      map-options
                      option-value="documento_nombre"
                      option-label="documento_nombre"
                      v-model="tipoDocumento"
                      :options="tipoDocumentoData"
                      label="Tipo"
                      class="q-mr-md text-uppercase text-center"
                    />
                  </div>
                  <div class="col-7">
                    <q-input
                      v-model="cedulaRIF"
                      focus="clienteExistente"
                      type="text"
                      ref="cedulaRIF"
                      label="CEDULA O RIF"
                      class="text-uppercase"
                    />
                  </div>
                </div>

                <!-- BOTON DE SUBMIT -->
                <q-card-actions align="center" class="q-mt-lg">
                  <q-btn label="Comprobar" color="primary" type="submit" />
                </q-card-actions>
              </q-form>
            </q-card-section>
            <q-card-actions align="center" class="q-mb-md">
              <q-btn
                label="Buscar cliente por nombre"
                color="primary"
                @click="onBuscarCliente()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>

    <!-- MODAL SELECCIONAR CLIENTE -->
    <q-dialog v-model="modalBuscarCliente" full-width>
      <q-card>
        <q-card-section class="q-pb-sm">
          <!-- TABLA QUE MUESTRA TODAS LAS PRUEBAS -->
          <q-table
            title="Seleccionar cliente"
            :rows="clientesData"
            :columns="columns_clientes"
            :pagination="initialPagination"
            row-key="id_cliente"
            :filter="filterClientes"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                outlined
                dense
                debounce="300"
                v-model="filterClientes"
                placeholder="Buscar"
                class="q-mr-xl"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <!-- BOTON CIERRE MODAL -->
              <q-btn
                class="q-ml-xl"
                icon="close"
                flat
                round
                dense
                v-close-popup
              />
            </template>

            <!--SECCION BOTONES OPCIONES -->
            <template v-slot:body-cell-actions="opt">
              <q-td :props="opt">
                <!--BOTON AGREGAR PRUEBA AL EXAMEN -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="onSeleccionarCliente(opt.row)"
                  icon="done"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- MODAL DE CLIENTE NUEVO -->
    <ClienteNuevo
      v-model="clienteNuevo"
      :cedula="this.cedulaRIF"
      :tipo="this.tipoDocumento"
      @agregarCliente="onAgregarCliente"
      @cancelarCliente="onCancelarCliente"
    ></ClienteNuevo>

    <!-- MODAL PARA AGREGAR LOS PACIENTES Y LOS EXAMENES/CULTIVOS -->
    <ModalExamenesConvenios
      v-show="facturacion"
      :nombreCliente="this.nombre_cliente"
      :cedulaRIF="this.cedulaRIF"
      :tipoFactura="this.tipo_factura"
      :cambioBs="this.cambio_bs"
      :cambioPesos="this.cambio_pesos"
      @finalizarPacientes="onAgregarPacientes"
    ></ModalExamenesConvenios>

    <!-- MODAL DE PAGOS -->
    <!-- CUANDO EL FROM ES 1 PROVIENE DE FACTURACION -->
    <!-- CUANDO EL FROM ES 2 PROVIENE DE MODIFICACION DE PAGOS -->
    <!-- CUANDO EL FROM ES 3 PROVIENE DE AÑADIR PAGO -->
    <ModalPagos
      v-if="pagos"
      :totalDolares="this.total_dolares"
      :cambioPesosActual="this.cambio_pesos"
      :cambioBs="this.cambio_bs"
      :idTipoFactura="this.tipo_factura"
      :descuento_fijo="this.descuento_fijo"
      :from="1"
      :ifCancel="0"
      @finalizarPagos="onAgregarPagos"
      @cancelarPagos="onCancelarPagos"
    ></ModalPagos>

    <!-- MODAL DE FACTURA SERIE A -->
    <FacturaSerieA
      v-if="pdf"
      :factura="this.factura"
      :tipo_factura="this.tipo_factura"
      :cambio_bs="this.cambio_bs"
      :total_dolares="this.total_dolares"
      :total_bs="this.total_bs"
      :descuento_dolares="this.descuento_dolares"
      :descuento_bs="this.descuento_bolivares"
      :total_descuento_dolares="this.total_dolares_descuento"
      :total_descuento_bs="this.total_bolivares_descuento"
      :cliente="this.cliente"
      ref="facturaSerieA"
    >
    </FacturaSerieA>

    <!-- MODAL DE ORDEN DE TRABAJO -->
    <factura-orden-trabajo
      v-if="pdfOrdenTrabajo"
      :factura="this.factura"
      :tipo_factura="this.tipo_factura"
      :cambio_bs="this.cambio_bs"
      :subtotal_dolares="this.total_dolares"
      :subtotal_bs="this.total_bs"
      :descuento_dolares="this.descuento_dolares"
      :descuento_bs="this.descuento_bolivares"
      :total_dolares="this.total_dolares_descuento"
      :total_bs="this.total_bolivares_descuento"
      :cliente="this.cliente"
    >
    </factura-orden-trabajo>

    <!-- MODAL COMPROBANTE REGISTRO CONVENIO-->
    <ComprobanteRegistroConvenio
      v-if="pdfRC"
      :cliente="this.cliente"
      :factura="this.factura"
      :totalDolares="this.total_dolares"
    ></ComprobanteRegistroConvenio>
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
import ModalExamenesConvenios from "../components/ModalExamenesConvenios.vue";
import ClienteNuevo from "../components/ClienteModalCreacion.vue";
import ModalPagos from "../components/ModalPagos.vue";
import FacturaSerieA from "../components/PdfFacturacionSerieA.vue";
import FacturaOrdenTrabajo from "../components/PdfOrdenTrabajo.vue";
import ComprobanteRegistroConvenio from "../components/PdfComprobanteRC.vue";

export default {
  components: {
    ModalExamenesConvenios,
    ComprobanteRegistroConvenio,
    ClienteNuevo,
    ModalPagos,
    FacturaSerieA,
    FacturaOrdenTrabajo,
  },

  data() {
    // MODALES
    let tipoFactura = ref(true);
    let clienteNuevo = ref(false);
    let clienteExistente = ref(false);
    let facturacion = ref(false);
    let pagos = ref(false);
    let clienteNoExiste = ref(false);
    let clienteNoConvenio = ref(false);
    let modalBuscarCliente = ref(false);
    // VARIABLES
    let nombre = ref(null);
    let nombre_cliente = ref(null);
    let apellido = ref(null);
    let cedulaRIF = ref(null);
    const idCliente = ref(null);
    let correo = ref(null);
    let telefono = ref(null);
    let tipoCliente = ref(null);
    let detallesExamenes = ref(null);
    let tipo_factura = ref(null);
    let fecha = ref(null);
    let numero_factura = ref(null);
    let total_items = ref(null);
    let tipoDocumento = ref(null);
    let descuento_fijo = 0;
    let total_dolares = 0;
    let total_bs = 0;
    let cambio_pesos = 0;
    let cambio_bs = 0;
    let total_dolares_descuento = 0;
    let total_bolivares_descuento = 0;
    let descuento_bolivares = 0;
    let descuento_dolares = 0;
    let rows_tabla = ref([]);
    let ordenes = ref([]);
    let tipos_pagos = ref([]);
    let tipoDocumentoData = ref([]);
    let factura;
    let cliente = ref(null);
    let acceso = ref(null);
    let pdfOrdenTrabajo = ref(false);
    let clientesData = ref(null);
    let usuario=parseInt(localStorage.id);

    const ip = process.env.BASE_URL;

    const columns_clientes = [
      {
        name: "cedula_RIF",
        align: "left",
        label: "Cedula/Rif",
        field: "cedula_RIF",
        sortable: true,
      },
      {
        name: "cliente_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => {
          if (row.cliente_apellido != null && row.cliente_apellido != "null") {
            return row.cliente_nombre + " " + row.cliente_apellido;
          } else {
            return row.cliente_nombre;
          }
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    return {
      initialPagination: {
        page: 1,
        rowsPerPage: 0,
      },
      filterClientes: "",
      ip,
      columns_clientes,
      clienteNuevo,
      clienteExistente,
      modalBuscarCliente,
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
      cambio_pesos,
      cambio_bs,
      detallesExamenes,
      tipoFactura,
      tipo_factura,
      clienteNoExiste,
      pdf: false,
      pdfRC: false,
      pdfOrdenTrabajo,
      fecha,
      total_items,
      rows_tabla,
      numero_factura,
      ordenes,
      tipos_pagos,
      total_bs,
      tipoDocumento,
      tipoDocumentoData,
      factura,
      cliente,
      descuento_fijo,
      total_dolares_descuento,
      total_bolivares_descuento,
      descuento_bolivares,
      descuento_dolares,
      acceso,
      clienteNoConvenio,
      clientesData,
      countDown: 5,
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
      this.tipo_factura = 2; //4
      this.tipoFactura = false;
      this.clienteExistente = true;
    },

    onOrdenTrabajo() {
      this.tipo_factura = 3; //2
      this.tipoFactura = false;
      this.clienteExistente = true;
    },

    onRegistroConvenio() {
      this.tipo_factura = 4; //3
      this.tipoFactura = false;
      this.clienteExistente = true;
    },

    onBuscarCliente() {
      this.clienteExistente = false;
      this.modalBuscarCliente = true;
    },

    onSeleccionarCliente(cliente) {
      this.cliente = cliente;
      this.idCliente = cliente.id_cliente;
      this.cedulaRIF = cliente.cedula_RIF;
      this.descuento_fijo = cliente.descuento_fijo;
      if (
        cliente.cliente_apellido == null ||
        cliente.cliente_apellido == "null"
      ) {
        this.nombre_cliente = cliente.cliente_nombre;
      } else {
        this.nombre_cliente =
          cliente.cliente_nombre + " " + cliente.cliente_apellido;
      }
      this.modalBuscarCliente = false;
      this.facturacion = true;
    },

    onCancelarNoConvenio() {
      this.cedulaRIF = "";
      this.clienteNoConvenio = false;
      this.clienteExistente = true;
    },

    onAgregarCliente(e) {
      console.log("LO QUE SE TRAE DEL CLIENTE NUEVO", e);

      this.cedulaRIF = e[0].cedula_RIF;
      this.descuento_fijo = e[0].descuento_fijo;
      if (e[0].cliente_apellido == null) {
        this.nombre_cliente = e[0].cliente_nombre;
      } else {
        this.nombre_cliente = e[0].cliente_nombre + " " + e[0].cliente_apellido;
      }

      this.clienteNuevo = false;
      this.facturacion = true;
    },

    onCancelarCliente(e) {
      console.log("el response de cancelar cliente", e);
      this.cedulaRIF = "";
      this.tipoDocumento = "";
      this.clienteNuevo = false;
      this.clienteExistente = true;
    },

    onCancelar() {
      this.cedulaRIF = "";
      this.tipoDocumento = "";
      this.clienteNoExiste = false;
      this.clienteExistente = true;
    },

    onCrearCliente() {
      this.clienteNoExiste = false;
      this.clienteNuevo = true;
    },

    // SE TRAE LOS PACIENTES Y LOS EXAMENES DEL MODULO MODAL EXAMENES
    // TAMBIEN SE TRAE EL TOTAL DE DOLARES
    onAgregarPacientes(e) {
      this.total_dolares = e[0].total_dolares;
      console.log(this.total_dolares);
      console.log("la vaina de pacientes", e[0].detallesExamenes);
      this.detallesExamenes = e[0].detallesExamenes;
      this.facturacion = false;

      if (this.tipo_factura == 4) {
        console.log("madre se hizo el registro convenio");
        let totalBs = Number(
          Math.round(this.total_dolares * this.cambio_bs + "e+2") + "e-2"
        );

        let totalPesos = this.total_dolares * this.cambio_pesos;

        console.log("LOS CAMBIOS", totalBs + " " + totalPesos);
        let usuario = parseInt(localStorage.id);

        let factura = {
          id_usuario: usuario,
          id_cliente: this.idCliente,
          total_bolivares: totalBs,
          total_dolares: this.total_dolares,
          total_pesos: totalPesos,
          id_tipo_factura: this.tipo_factura,
          detallesExamenes: this.detallesExamenes,
        };

        console.log("el registro convenio", factura);

        axios
          .post(this.ip + "crearFacturaOrdenTrabajoConvenios", factura)
          .then((response) => {
            console.log("EL RESPONSE del final de fact", response.data);

            this.factura = response.data;
            console.log(this.factura);
            //this.$router.go();
          })
          .catch((err) => console.log(err.message))
          .finally(() => {
            this.pdfRC = true;
            this.countDownTimer();
          });
      } else {
        this.pagos = true;
      }
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
      let usuario = parseInt(localStorage.id);

      let factura = {
        id_usuario: usuario,
        id_cliente: this.idCliente,
        total_bolivares: e[0].total_bolivares_descuento,
        total_dolares: e[0].total_dolares_descuento,
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
        detallesExamenes: this.detallesExamenes,
        pagos: e[0].pagos,
      };

      console.log("LA FACTURA", factura);

      axios
        .post(this.ip + "crearFacturaOrdenTrabajoConvenios", factura)
        .then((response) => {
          console.log("EL RESPONSE del final de fact", response.data);

          this.factura = response.data;
          console.log(this.factura);
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
          if (this.tipo_factura != 4) {
            if (this.tipo_factura == 1 || this.tipo_factura == 2) {
              this.pdf = true;
            } else if (this.tipo_factura == 3) {
              this.pdfOrdenTrabajo = true;
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

      let datos = await axios.post(this.ip + "buscarConvenio", cliente);
      console.log("lo que retorna", datos.data);

      if (datos.data == "0") {
        console.log("EL CLIENTE NO EXISTE");

        this.clienteExistente = false;
        this.clienteNoExiste = true;
      } else {
        console.log("EL CLIENTE EXISTE");

        if (datos.data[0].estatus == 1) {
          if (datos.data[0].id_tipo_cliente == 2) {
            this.cliente = datos.data[0];
            this.idCliente = datos.data[0].id_cliente;

            if (
              datos.data[0].cliente_apellido == null ||
              datos.data[0].cliente_apellido == "null"
            ) {
              this.nombre_cliente = datos.data[0].cliente_nombre;
            } else {
              this.nombre_cliente =
                datos.data[0].cliente_nombre +
                " " +
                datos.data[0].cliente_apellido;
            }

            this.cedulaRIF = datos.data[0].cedula_RIF;
            this.telefono = datos.data[0].telefono;
            this.descuento_fijo = datos.data[0].descuento_fijo;
            console.log(this.nombre_cliente);
            console.log(this.cedulaRIF);
            console.log("el cliente", this.cliente);

            this.clienteNuevo = false;
            this.clienteExistente = false;
            this.facturacion = true;
          } else {
            this.clienteExistente = false;
            this.clienteNoConvenio = true;
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

    async getClientes() {
      let datos = await axios.get(this.ip + "clientesConvenios");
      console.log("LOS CLIENTES en facturacion", datos.data);
      this.clientesData = datos.data;
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 4,
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
    this.getDocumentos();
    this.getClientes();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
