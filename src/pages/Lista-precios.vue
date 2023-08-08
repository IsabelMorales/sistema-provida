<template>
  <q-page padding v-if="this.acceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <div class="q-pa-md">
          <div class="row q-mb-md">
            <div class="col-5">
              <q-card class="my-card">
                <q-card-section>
                  <div class="q-gutter-md">
                    <q-checkbox
                      dense
                      v-model="this.dolaresVisibles"
                      label="Dolares"
                    />
                    <q-checkbox
                      dense
                      v-model="this.pesosVisibles"
                      label="Pesos"
                    />
                    <q-checkbox
                      dense
                      v-model="this.bolivaresVisibles"
                      label="Bolivares"
                    />
                    <q-btn
                      label="Generar pdf"
                      @click="finalizar"
                      color="primary"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <!-- TABLA DISPLAY DE EXAMENES ACTIVOS -->
              <q-table
                v-show="tablaHabilitados"
                title="Lista de precios"
                :rows="rows_habilitados"
                :columns="columns"
                :loading="loading"
                :pagination="initialPagination"
                row-key="nombre"
                :filter="filter"
                no-data-label="No hay data disponible"
                id="pdf"
                hide-bottom
              >
                <!-- BARRA DE BUSQUEDA -->
                <!--<template v-slot:top-right>
                  
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
                </template>-->
              </q-table>
            </div>
          </div>
        </div>
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
import { useQuasar } from "quasar";
import axios from "axios";
import { ref } from "vue";
import { jsPDF } from "jspdf";

export default {
  data() {
    const $q = useQuasar();
    const loading = ref(true);
    let rows_habilitados = ref([]);
    let rows_inhabilitados = ref([]);
    let id_examen = "";
    let inhabilitarExamenModal = ref(false);
    let habilitarExamenModal = ref(false);
    let tablaHabilitados = ref(true);
    let tablaInhabilitados = ref(false);
    let acceso = ref(null);
    let cambio_pesos = 0;
    let cambio_bs = 0;
    let dolaresVisibles = true;
    let pesosVisibles = true;
    let bolivaresVisibles = true;
    let headerDolares = "";

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
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
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "nombre",
        align: "left",
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
        name: "precio_dolares",
        align: "right",
        label: "",
        field: (row) => {
          if (row.examen_precio) {
            return row.examen_precio + "$";
          } else {
            return row.cultivo_precio + "$";
          }
        },
        sortable: true,
        style: (row) => {
          if (this.dolaresVisibles == false) {
            //this.headerDolares="display:none; width:0px";
            return "display:none; width:0px";
          }
        },
      },
      {
        name: "precio_pesos",
        align: "right",
        label: "",
        field: (row) => {
          if (row.examen_precio) {
            return row.examen_precio * this.cambio_pesos + " COP";
          } else {
            return row.cultivo_precio * this.cambio_pesos + " COP";
          }
        },
        sortable: true,
        style: (row) => {
          if (this.pesosVisibles == false) {
            //this.headerDolares="display:none; width:0px";
            return "display:none; width:0px";
          }
        },
      },
      {
        name: "precio_bs",
        align: "right",
        label: "",
        field: (row) => {
          if (row.examen_precio) {
            //return (row.examen_precio * this.cambio_bs).toLocaleString("de-DE");
            return (
              Number(
                Math.round(row.examen_precio * this.cambio_bs + "e+2") + "e-2"
              ).toLocaleString("de-DE") + " Bs."
            );
          } else {
            return (
              Number(
                Math.round(row.cultivo_precio * this.cambio_bs + "e+2") + "e-2"
              ).toLocaleString("de-DE") + " Bs."
            );
          }
        },
        sortable: true,
        style: (row) => {
          if (this.bolivaresVisibles == false) {
            //this.headerDolares="display:none; width:0px";
            return "display:none; width:0px";
          }
        },
      },
    ];

    // LLAMADO A LOS EXAMENES HABILITADOS//
    axios
      .get(ip + "examenes")
      .then((response) => {
        //rows_habilitados.value = response.data;
        for (let i = 0; i < response.data.length; i++) {
          rows_habilitados.value = [
            ...rows_habilitados.value,
            response.data[i],
          ];
        }
        console.log(response.data);
        console.log(rows_habilitados.value);
      })
      .finally(() => {
        loading.value = false;
      });

    axios
      .get(ip + "cultivos")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          rows_habilitados.value = [
            ...rows_habilitados.value,
            response.data[i],
          ];
        }
        console.log(rows_habilitados.value);
      })
      .finally(() => {
        loading.value = false;
      });

    return {
      initialPagination: {
        sortBy: "nombre",
        descending: false,
        page: 1,
        rowsPerPage: 0,
        // rowsNumber: xx if getting data from a server
      },
      noti: () => {},
      columns,
      rows_habilitados,
      rows_inhabilitados,
      loading,
      $q,
      habilitarExamenModal,
      inhabilitarExamenModal,
      id_examen,
      filter: ref(""),
      ip,
      tablaHabilitados,
      tablaInhabilitados,
      acceso,
      cambio_pesos,
      cambio_bs,
      dolaresVisibles,
      pesosVisibles,
      bolivaresVisibles,
      headerDolares,
    };
  },

  methods: {
    finalizar() {
      console.log("CREACION DE LOS RESULTADOS DE EXAMENES COMPA!!!");

      console.log("el paciente", this.paciente);
      console.log("lafecha", this.fecha);
      this.impresion = true;

      var doc = new jsPDF("p", "pt", "a5");
      doc.html(document.getElementById("pdf"), {
        //margin: [0, 0, 0, 0],
        callback: function (doc) {
          doc.autoPrint();
          doc.output("dataurlnewwindow");
        },
        windowWidth: 1000,
        width: 410,
        x: 3,
      });
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

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 80,
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
  },
};
</script>
