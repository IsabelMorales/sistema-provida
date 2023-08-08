<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- MODAL TIPO DE FACTURA -->
        <q-dialog v-model="convenios" persistent>
          <q-table
            title="Seleccione un convenio"
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="cedula_RIF"
            :filter="filter"
            style="width: 70vw; max-width: 90vw"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                outlined
                dense
                debounce="300"
                v-model="filter"
                placeholder="Buscar"
                class="q-mr-xl"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <!-- SECCION BOTONES OPCIONES -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <!-- BOTON MODIFICAR EXAMEN -->
                <q-btn
                  dense
                  round
                  flat
                  padding="md"
                  color="grey"
                  icon="visibility"
                  @click="
                    facturarConvenio(
                      props.row.id_cliente,
                      props.row.descuento_fijo,
                      props.row
                    )
                  "
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-dialog>
      </div>
    </div>

    <!-- MODAL QUE MUESTRA LOS REGISTROS -->
    <CrearReciboRegistroConvenio
      v-if="facturacion"
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

  <q-page padding v-else> </q-page>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import CrearReciboRegistroConvenio from "../components/ModalRegistrosConvenio.vue";
import ModalPagos from "../components/ModalPagos.vue";
import PdfReciboRC from "../components/PdfReciboRC.vue";

export default {
  components: {
    CrearReciboRegistroConvenio,
    ModalPagos,
    PdfReciboRC,
  },

  data() {
    let convenios = ref(true);
    let facturacion = ref(false);
    let pagos = ref(false);
    const loading = ref(true);
    let rows = ref([]);
    let id = ref(null);
    let total_dolares = 0;
    let total_bolivares = 0;
    let total_pesos = 0;
    let cambio_pesos = 0;
    let cambio_bs = 0;
    let descuento = 0;
    let registros_convenios = ref([]);
    let recibo = ref(null);
    let detallesRecibo = ref(null);
    let convenios_aux = ref([]);
    let acceso = ref(null);
    let cliente = ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "cedula_RIF",
        required: true,
        label: "Cédula/RIF",
        align: "left",
        field: (row) => row.cedula_RIF,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "examen_nombre",
        align: "left",
        label: "Nombre",
        field: (row) => {
          if (row.cliente_apellido == "null" || row.cliente_apellido == null) {
            return row.cliente_nombre;
          } else {
            return row.cliente_nombre + " " + row.cliente_apellido;
          }
        },
        sortable: true,
      },
      {
        name: "estatus",
        align: "left",
        label: "Nombre",
        field: (row) => {
          if (row.estatus == 1) {
            return "ACTIVO";
          } else if (row.estatus == 0) {
            return "MOROSO";
          }
        },
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // SE TRAE LOS CONVENIOS //
    axios
      .get(ip + "clientesConvenios")
      .then((response) => {
        console.log(response.data);
        rows.value = response.data;
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      filter: ref(""),
      convenios,
      loading,
      rows,
      columns,
      facturacion,
      id,
      pagos,
      total_dolares,
      total_bolivares,
      total_pesos,
      cambio_pesos,
      cambio_bs,
      registros_convenios,
      ip,
      descuento,
      pdf: false,
      recibo,
      detallesRecibo,
      convenios_aux,
      acceso,
      cliente,
      countDown: 5,
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

    facturarConvenio(id_cliente, descuento_cliente, cliente) {
      this.id = id_cliente;
      this.descuento = descuento_cliente;
      this.cliente = cliente;
      console.log("el id", this.id, this.descuento);
      this.convenios = false;
      this.facturacion = true;
    },

    cancelarFacturacion(e) {
      console.log("el otro cancelar");
      console.log(e);
      this.convenios = true;
      this.facturacion = false;
      this.id = 0;
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
        Math.round(this.total_dolares * this.cambio_pesos_arreglado + "e+2") + "e-2"
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

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 75,
        token: localStorage.token,
      };

      console.log(usuario);

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
  },
};
</script>
