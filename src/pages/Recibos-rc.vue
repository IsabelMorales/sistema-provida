<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-12">
        <div class="q-pa-md">
          <!-- TABLA DISPLAY DE ORDENES DE TRABAJO -->
          <q-table
            title="Recibos de registros convenio"
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="numero_factura"
            :filter="filter"
            no-data-label="No hay data disponible"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                dense
                outlined
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
                <q-btn
                  dense
                  round
                  flat
                  color="blue"
                  icon="print"
                  class="q-mr-md"
                  @click="onImprimir(props.row.id_recibo)"
                  v-if="this.rol == 6 || this.rol == 5"
                >
                </q-btn>
                <q-btn
                  dense
                  round
                  flat
                  color="grey"
                  icon="task"
                  @click="onFacturar(props.row.id_cliente, props.row.id_recibo)"
                  v-if="this.rol == 6 || this.rol == 5"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>

    <!-- MODAL DE FACTURA SERIE A -->
    <FacturaSerieA
      v-if="pdfSerieA"
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
    >
    </FacturaSerieA>

    <!-- CREACION DE PDF DEL RECIBO -->
    <PdfReciboRC
      v-if="this.pdf"
      :detallesRecibo="this.detallesRecibo"
      :recibo="this.recibo"
      :convenios="this.aux_convenios"
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
import { useQuasar } from "quasar";
import axios from "axios";
import { ref } from "vue";
import FacturaSerieA from "../components/PdfFacturacionSerieA.vue";
import PdfReciboRC from "../components/PdfReciboRC.vue";

export default {
  components: {
    FacturaSerieA,
    PdfReciboRC,
  },

  data() {
    const $q = useQuasar();
    const loading = ref(true);
    let motivo = ref(null);
    let rows = ref([]);
    let id_factura = ref(null);
    let factura;
    let tipo_factura = ref(null);
    let cambio_bs = 0;
    let total_dolares = 0;
    let total_bs = ref(null);
    let descuento_bolivares = 0;
    let descuento_dolares = 0;
    let total_dolares_descuento = 0;
    let total_bolivares_descuento = 0;
    let cliente = ref(null);
    let rol = parseInt(localStorage.rol);
    let acceso = ref(null);
    let divisas = ref(null);
    let recibo = ref(null);
    let detallesRecibo = ref(null);
    let pdf = ref(false);
    let aux_convenios=ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "fecha_creacion",
        required: true,
        label: "Fecha",
        align: "left",
        field: (row) => row.fecha_creacion,
        format: (val) => `${val}`,
      },
      {
        name: "cedula_RIF",
        align: "left",
        label: "Cedula",
        field: (row) => row.cedula_RIF,
        sortable: true,
      },
      {
        name: "nombre",
        align: "left",
        label: "Cliente",
        field: (row) => {
          if (row.cliente_apellido == null || row.cliente_apellido == "null") {
            return row.cliente_nombre;
          } else {
            return row.cliente_nombre + " " + row.cliente_apellido;
          }
        },
        sortable: true,
      },
      {
        name: "numero_recibo",
        align: "left",
        label: "Numero de recibo",
        field: (row) => row.numero_recibo,
        sortable: true,
      },
      {
        name: "monto_bolivares",
        align: "left",
        label: "Total bs.",
        field: (row) => row.monto_bolivares,
        sortable: true,
      },
      {
        name: "monto_pesos",
        align: "left",
        label: "Total pesos",
        field: (row) => row.monto_pesos,
        sortable: true,
      },
      {
        name: "monto_dolares",
        align: "left",
        label: "Total dolares",
        field: (row) => row.monto_dolares,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // SE TRAE LAS ORDENES PARA TOMA DE MUESTRA
    axios
      .get(ip + "recibosRegistroConvenio")
      .then((response) => {
        rows.value = response.data.recibos;
        divisas.value = response.data.divisas;
        console.log(cambio_bs);
        console.log(response.data);
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      initialPagination: {
        sortBy: "numero_recibo",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      noti: () => {},
      ip,
      columns,
      loading,
      $q,
      filter: ref(""),
      motivo,
      rows,
      id_factura,
      total_dolares_descuento,
      total_bolivares_descuento,
      descuento_bolivares,
      descuento_dolares,
      cambio_bs,
      tipo_factura,
      factura,
      cliente,
      total_dolares,
      total_bs,
      pdfSerieA: false,
      rol,
      acceso,
      divisas,
      recibo,
      detallesRecibo,
      pdf,
      countDown: 5,
      aux_convenios
    };
  },

  methods: {
    countDownTimer() {
      console.log("entro al contador");
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

    onImprimir(id_recibo) {
      axios
        .get(this.ip + "imprimirReciboRegistroConvenio/" + id_recibo)
        .then((response) => {
          console.log(response.data);
          this.recibo = response.data.recibo[0];
          this.detallesRecibo = response.data.detallesRecibo;
          this.aux_convenios=response.data.detalles_registro_convenio;
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
          this.pdf = true;
          //this.countDownTimer();
        });
    },

    onFacturar(id_cliente, id_recibo) {
      console.log(id_cliente);
      let usuario = parseInt(localStorage.id);

      let factura = {
        id_cliente: id_cliente,
        id_recibo: id_recibo,
        id_usuario: usuario,
      };

      console.log("la factu", factura);

      axios
        .post(this.ip + "facturarReciboRegistroConvenio", factura)
        .then((response) => {
          console.log("EL RESPONSE del final de fact", response.data);

          this.factura = response.data;
          console.log(this.factura);
          console.log("CAMBIO BS", this.cambio_bs);

          this.tipo_factura = 1;
          this.cambio_bs = this.divisas[2].tasa_actual;
          this.total_dolares =
            this.factura[0].descuento_dolares +
            this.factura[0].valor_total_venta_dolares;
          this.total_bs =
            this.factura[0].descuento_bolivares +
            this.factura[0].valor_total_venta_bolivares;
          this.descuento_dolares = this.factura[0].descuento_dolares;
          this.descuento_bolivares = this.factura[0].descuento_bolivares;
          this.total_dolares_descuento =
            this.factura[0].valor_total_venta_dolares;
          this.total_bolivares_descuento =
            this.factura[0].valor_total_venta_bolivares;
          this.cliente = {
            cedula_RIF: this.factura[0].cedula_RIF,
            telefono: this.factura[0].telefono,
            cliente_nombre: this.factura[0].cliente_nombre,
            cliente_apellido: this.factura[0].cliente_apellido,
            id_tipo_cliente: 2,
          };
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
          if (this.factura == "ERROR EN AGREGAR FACTURA!") {
          } else {
            this.pdfSerieA = true;
            console.log("NO ES SEGURO", this.pdfSerieA);
          }
        });
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 52,
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
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
