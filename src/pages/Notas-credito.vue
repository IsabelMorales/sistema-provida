<template>
    <q-page padding v-if="getAcceso == 1">
      <div class="fit row justify-center">
        <div class="col-12">
          <div class="q-pa-md">
            <!-- TABLA DISPLAY DE FACTURAS -->
            <q-table
              v-show="tablaHabilitados"
              title="Notas a credito"
              :rows="rows_habilitados"
              :columns="columns"
              :loading="loading"
              :pagination="initialPagination"
              row-key="nota_credito_numero"
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
                  <!-- BOTON ANULAR FACTURA -->
                  <q-btn
                    padding="md"
                    dense
                    round
                    flat
                    color="grey"
                    @click="
                      imprimir(props.row.id_factura, props.row.id_nota_credito)
                    "
                    icon="print"
                  >
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
  
      <PdfNotaCredito v-if="pdf_nc" :recibo="this.recibo"></PdfNotaCredito>
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
  import PdfNotaCredito from "../components/PdfNotaCredito.vue";
  
  export default {
    components: {
      PdfNotaCredito,
    },
  
    setup() {
      const $q = useQuasar();
      const loading = ref(true);
      let motivo = ref(null);
      let inhabilitarFacturaModal = ref(false);
      let habilitarFacturaModal = ref(false);
      let tablaHabilitados = ref(true);
      let tablaInhabilitados = ref(false);
      let rows_habilitados = ref([]);
      let rows_inhabilitados = ref([]);
      let id_factura = ref(null);
      let acceso = ref(null);
      let recibo = ref(null);
      let pdf_nc = ref(false);
  
      const ip = process.env.BASE_URL;
  
      //  COLUMNAS DE LA TABLA //
      const columns = [
        {
          name: "fecha_emision",
          align: "left",
          label: "Fecha",
          field: "fecha_emision",
          sortable: true,
        },
        {
          name: "nota_credito_numero",
          required: true,
          label: "Numero de nota",
          align: "left",
          field: (row) => row.nota_credito_numero,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: "cedula_RIF",
          align: "left",
          label: "Cédula/RIF del cliente",
          field: "cedula_RIF",
          sortable: true,
        },
        {
          name: "nombre_cliente",
          align: "left",
          label: "Nombre del cliente",
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
          name: "numero_factura",
          required: true,
          label: "Numero de factura",
          align: "left",
          field: (row) => row.numero_factura,
          format: (val) => `${val}`,
          sortable: true,
        },
        { name: "actions", label: "Opciones", field: "", align: "center" },
      ];
  
      // LLAMADO A LAS FACTURAS ACTIVAS //
      axios
        .get(ip + "notasCredito")
        .then((response) => {
          rows_habilitados.value = response.data;
          console.log(response.data);
        })
        .finally(() => {
          loading.value = false;
        });
  
      /*// LLAMADO A LAS FACTURAS ANULADAS //
      axios
        .get(ip + "facturasAnuladas")
        .then((response) => {
          rows_inhabilitados.value = response.data;
          console.log(response.data);
        })
        .finally(() => {
          loading.value = false;
        });*/
  
      return {
        initialPagination: {
          sortBy: "nota_credito_numero",
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
        rows_habilitados,
        rows_inhabilitados,
        habilitarFacturaModal,
        inhabilitarFacturaModal,
        tablaHabilitados,
        tablaInhabilitados,
        id_factura,
        acceso,
        recibo,
        pdf_nc,
        countDown: 5,
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
  
      imprimir(id_factura, id_nota) {
        axios
          .get(this.ip + "imprimirNotaCredito/" + id_factura + "/" + id_nota)
          .then((response) => {
            console.log(response.data);
            this.recibo = response.data;
          })
          .catch((err) => console.log(err.message))
          .finally(() => {
            this.pdf_nc = true;
            this.countDownTimer();
          });
      },
      /*inhabilitados() {
        this.tablaHabilitados = false;
        this.tablaInhabilitados = true;
      },
  
      habilitados() {
        this.tablaHabilitados = true;
        this.tablaInhabilitados = false;
      },
  
      confirmHabilitar(id) {
        this.habilitarFacturaModal = true;
        this.id_factura = id;
      },
  
      confirmInhabilitar(id) {
        this.inhabilitarFacturaModal = true;
        this.id_factura = id;
      },
  
      habilitarFactura(id) {},
  
      // ANULACION DE FACTURA //
      inhabilitarFactura(id) {
        this.noti();
  
        let eliminar = {
          id_factura: this.id_factura,
          anulacion_motivo: this.motivo.toUpperCase(),
        };
  
        console.log("id factura", id);
        console.log("El eliminar", eliminar);
  
        axios
          .post(this.ip + "anulacionFactura", eliminar)
          .then((response) => {
            console.log(response.data);
            console.log("es es el response");
            this.motivo = "";
            if (response.data === 1) {
              console.log("ENTRO");
              this.$router.go();
            }
          })
          .catch((err) => console.log(err.message));
      },*/
  
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
    },
  
    computed: {
      getAcceso() {
        console.log("ela", this.acceso);
        return this.acceso;
      },
    },
  };
  </script>
  