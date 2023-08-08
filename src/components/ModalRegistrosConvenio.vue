<template>
  <q-page padding v-if="this.acceso == 1">
    <div v-if="this.modalRegistro">
      <div class="fit row justify-center">
        <div class="col-12">
          <q-table
            :title="getNombre"
            :rows="rows"
            :columns="columns"
            :loading="loading"
            :pagination="initialPagination"
            row-key="numero_registro_convenio"
            :filter="filter"
            selection="multiple"
            v-model:selected="selected"
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
                  @click="verRegistro(props.row)"
                >
                </q-btn>
                <!-- BOTON ANULAR FACTURA -->
                <q-btn
                  padding="md"
                  dense
                  round
                  flat
                  color="grey"
                  @click="confirmInhabilitar(props.row.id_registro_convenio)"
                  icon="delete"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>

      <div class="row q-mt-md">
        <div class="col-12 text-right">
          <q-btn
            label="Volver"
            type="submit"
            color="primary"
            class="q-mr-md"
            @click="onCancelar"
          />
          <q-btn
            label="Pagar"
            type="submit"
            color="primary"
            @click="onFacturar"
          />
        </div>
      </div>
    </div>

    <!-- MODAL CONFIRMACION ANULACION FACTURA -->
    <q-dialog v-model="inhabilitarFacturaModal">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">Ingrese la razón de la anulación.</div>
            <q-input v-model="motivo" label="Motivo" class="text-uppercase" />
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR INHABILITAR EXAMEN -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- INHABILITAR EXAMEN -->
          <q-btn
            unelevated
            label="Anular"
            color="primary"
            class="q-mr-md"
            @click="inhabilitarFactura(id_factura)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <ModuloRegistro
      v-if="this.modalRegistroDetalle"
      :registro="this.registro"
      :cliente="this.cliente"
      @onCancelar="volver"
    ></ModuloRegistro>
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
import ModuloRegistro from "./RCDetalle.vue";

export default {
  props: ["id", "cliente"],

  components: {
    ModuloRegistro,
  },

  data() {
    let rows = ref([]);
    const loading = ref(true);
    const selected = ref([]);
    let acceso = ref(null);
    let registro = ref(null);
    let modalRegistro = ref(true);
    let inhabilitarFacturaModal = ref(false);
    let modalRegistroDetalle = ref(false);
    let motivo = ref(null);
    let id_factura = ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "fecha",
        required: true,
        label: "Fecha",
        align: "left",
        field: (row) => row.fecha,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero_registro_convenio",
        align: "left",
        label: "Numero de registro",
        field: (row) => row.numero_registro_convenio,
        sortable: true,
      },
      {
        name: "orden",
        align: "left",
        label: "Orden",
        field: (row) => {
          if (row.numero_de_ordenes == "1") {
            return row.ordenes[0].numero_orden;
          } else {
            return "+1";
          }
        },
        sortable: true,
      },
      {
        name: "total_dolares",
        align: "left",
        label: "Precio Dolares",
        field: (row) => row.total_dolares,
        sortable: true,
      },
      {
        name: "estatus",
        align: "left",
        label: "Estatus",
        field: (row) => {
          if (row.estatus == 0) {
            return "POR PAGAR";
          } else if (row.estatus == 1) {
            return "PAGADO";
          } else if (row.estatus == 2) {
            return "ANULADO";
          } else if (row.estatus == 3) {
            return "FACTURADO";
          }
        },
        sortable: true,
      },
      {
        name: "numero_factura",
        align: "left",
        label: "Factura asociada",
        field: (row) => row.numero_factura,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    return {
      initialPagination: {
        sortBy: "numero_registro_convenio",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      filter: ref(""),
      loading,
      rows,
      columns,
      ip,
      selected,
      acceso,
      registro,
      modalRegistro,
      modalRegistroDetalle,
      inhabilitarFacturaModal,
      motivo,
      id_factura,
    };
  },

  methods: {
    volver(e) {
      this.modalRegistro = true;
      this.modalRegistroDetalle = false;
    },

    verRegistro(registro) {
      console.log("registroto", registro);
      this.registro = registro;
      this.modalRegistro = false;
      this.modalRegistroDetalle = true;
    },

    confirmInhabilitar(id) {
      this.inhabilitarFacturaModal = true;
      this.id_factura = id;
    },

    // ANULACION DE FACTURA //
    inhabilitarFactura(id) {
      let eliminar = {
        id_registro_convenio: this.id_factura,
        id_usuario: parseInt(localStorage.id),
        anulacion_motivo: this.motivo.toUpperCase(),
      };

      console.log("id factura", id);
      console.log("El eliminar", eliminar);

      axios
        .post(this.ip + "anulacionRegistroConvenio", eliminar)
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
    },

    async traerRegistros() {
      console.log(this.id);
      let convenio = {
        id_cliente: this.id,
      };

      console.log(convenio);

      await axios
        .post(this.ip + "registrosConveniosCliente", convenio)
        .then((response) => {
          console.log(response.data);
          this.rows = response.data;
          console.log("es es el response");
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
          this.loading = false;
        });
    },

    onCancelar() {
      this.$emit("onCancelar", false);
    },

    onFacturar() {
      let ids_convenios = [];
      let totalBs = 0;
      let totalDolares = 0;
      let totalPesos = 0;

      // ESTE ES EL JSON NECESARIO PARA EL MODULO DE PAGOS
      // Y LUEGO MANDAR AL BACK
      console.log("los totales", totalBs, totalPesos, totalDolares);
      for (let i = 0; i < this.selected.length; i++) {
        // GUARDA TODOS LOS IDS DE LOS REGISTROS
        ids_convenios.push({
          id_registro_convenio: this.selected[i].id_registro_convenio,
        });

        totalDolares += this.selected[i].total_dolares;
        totalBs += this.selected[i].total_bolivares;
        totalPesos += this.selected[i].total_pesos;
        console.log("los totales", totalBs, totalPesos, totalDolares);
      }
      console.log("los totales final", totalBs, totalPesos, totalDolares);

      let registros = {
        total_bolivares: totalBs,
        total_pesos: totalPesos,
        total_dolares: totalDolares,
        registros_convenios: ids_convenios,
        convenios: this.selected,
      };

      this.$emit("onFacturar", registros);
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 54,
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

  mounted() {
    this.traerRegistros();
  },

  created() {
    this.validar();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },

    getNombre() {
      if (
        this.cliente.cliente_apellido == null ||
        this.cliente.cliente_apellido == "null"
      ) {
        return "Registros convenio de " + this.cliente.cliente_nombre;
      } else {
        return (
          "Registros convenio de " +
          this.cliente.cliente_nombre +
          " " +
          this.cliente.cliente_apellido
        );
      }
    },
  },
};
</script>
