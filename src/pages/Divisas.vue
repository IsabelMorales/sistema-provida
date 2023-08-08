<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <q-card flat bordered class="my-card">
          <div class="row q-ml-md q-my-lg">
            <div class="col-12 text-h6">DIVISAS</div>
          </div>

          <div class="row q-mx-md q-mb-md">
            <!-- PESOS -->
            <div class="col-6">
              <div class="row">
                <div class="col-5 text-subtitle1 text-weight-medium">
                  Pesos: {{ this.tasaPesos }} por dolar
                </div>
                <div class="col-6 text-right">
                  <q-btn
                    class="q-ml-xl"
                    color="primary"
                    label="Modificar tasa"
                    @click="modalTasaNueva(1, 'PESOS')"
                    v-if="this.rol == 5 || this.rol == 6 || this.rol == 20"
                  />
                </div>
              </div>

              <q-separator class="q-my-md" />

              <div class="row">
                <div class="col-11">
                  <q-table
                    title="Historial"
                    :rows="rows_pesos"
                    :columns="columns"
                    :loading="loading"
                    :pagination="initialPaginationPesos"
                    row-key="fecha"
                    :filter="filter_pesos"
                    no-data-label="No hay data disponible"
                  >
                    <template v-slot:top-right>
                      <!-- BARRA DE BUSQUEDA -->
                      <q-input
                        outlined
                        dense
                        debounce="300"
                        v-model="filter_pesos"
                        placeholder="Buscar"
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
                  </q-table>
                </div>
              </div>
            </div>

            <!-- BOLIVARES -->
            <div class="col-6">
              <div class="row">
                <div class="col-5 text-subtitle1 text-weight-medium">
                  Bolivares: {{ this.tasaBolivares }} por dolar
                </div>
                <div class="col-6 text-right">
                  <q-btn
                    class="q-ml-xl"
                    color="primary"
                    label="Modificar tasa"
                    @click="modalTasaNueva(3, 'BOLIVARES')"
                    v-if="this.rol == 5 || this.rol == 6|| this.rol == 20"
                  />
                </div>
              </div>

              <q-separator class="q-my-md" />

              <div class="row">
                <div class="col-11">
                  <q-table
                    title="Historial"
                    :rows="rows_bolivares"
                    :columns="columns"
                    :loading="loading"
                    :pagination="initialPaginationBs"
                    row-key="fecha"
                    :filter="filter_bs"
                    no-data-label="No hay data disponible"
                  >
                    <template v-slot:top-right>
                      <!-- BARRA DE BUSQUEDA -->
                      <q-input
                        outlined
                        dense
                        debounce="300"
                        v-model="filter_bs"
                        placeholder="Buscar"
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
                  </q-table>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- MODAL AGREGAR TASA NUEVA -->
    <q-dialog v-model="tasaNuevaModal">
      <q-card>
        <q-card-section class="row q-mx-lg">
          <div class="col text-center">
            <div class="text-subtitle1 text-weight-medium">
              NUEVA TASA {{ this.nombreDivisaCambio }}
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="tasaNueva"
            type="text"
            class="q-mx-lg"
            outlined
            dense
            hint="Los montos enteros no llevan punto. Si desea decimales por favor use punto en vez de coma."
          />
        </q-card-section>

        <q-card-actions align="center" class="q-mt-lg q-mb-md">
          <!-- CANCELAR ELIMINAR CULTIVO -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- ELIMINAR CULTIVO -->
          <q-btn
            unelevated
            label="Cambiar"
            color="primary"
            @click="addTasaDivisa()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL CREACION DIVISA -->
    <q-dialog v-model="divisaNuevaModal">
      <q-card>
        <q-card-section class="row q-mx-lg">
          <div class="col text-center">
            <div class="text-subtitle1 text-weight-medium">NUEVA DIVISA</div>
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="divisaNueva"
            type="text"
            class="q-mx-lg text-uppercase"
            outlined
            dense
            label="Nombre"
          />
        </q-card-section>

        <!--<q-card-section>
          <q-input
            v-model="tasaNueva"
            type="text"
            class="q-mx-lg"
            label="Tasa"
            outlined
            dense
            hint="Los montos enteros no llevan punto. Si desea decimales por favor use punto en vez de coma."
          />
        </q-card-section>-->

        <q-card-actions align="center" class="q-mt-lg q-mb-md">
          <!-- CANCELAR ELIMINAR CULTIVO -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- ELIMINAR CULTIVO -->
          <q-btn
            unelevated
            label="Cambiar"
            color="primary"
            @click="addDivisa()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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

export default {
  data() {
    let tasaPesos = ref(null);
    let tasaBolivares = ref(null);
    let rows_bolivares = ref([]);
    let rows_pesos = ref([]);
    let nombreDivisaCambio = ref(null);
    let idDivisaCambio = ref(null);
    let tasaNueva = ref(null);
    let tasaNuevaModal = ref(false);
    let divisaNuevaModal = ref(false);
    let loading = ref(true);
    let divisaNueva = ref(null);
    let rol = parseInt(localStorage.rol);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    let pesos = {
      id_divisa: 1,
    };

    let bolivares = {
      id_divisa: 3,
    };

    let columns = [
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
        name: "tasa_actual",
        align: "center",
        label: "Tasa",
        field: "tasa_actual",
        sortable: true,
      },
    ];

    // SE TRAE LAS DIVISAS CON SUS TASAS //
    axios.get(ip + "registroDivisas").then((response) => {
      console.log(response.data.registroDivisas);
      let divisas = response.data.registroDivisas;

      for (let i = 0; i < divisas.length; i++) {
        if (divisas[i].id_divisa == 1) {
          tasaPesos.value = divisas[i].tasa_actual;
        } else if (divisas[i].id_divisa == 3) {
          tasaBolivares.value = divisas[i].tasa_actual;
        }
      }
    });

    // SE TRAE EL HISTORIAL DE PESOS //
    axios.post(ip + "historialDivisas", pesos).then((response) => {
      console.log("EL HISTORIAL PESOS", response.data);

      this.rows_pesos = response.data;
      this.loading = false;
    });

    // SE TRAE EL HISTORIAL DE PESOS //
    axios.post(ip + "historialDivisas", bolivares).then((response) => {
      console.log("EL HISTORIAL BS", response.data);

      this.rows_bolivares = response.data;
      this.loading = false;
    });

    return {
      initialPaginationBs: {
        sortBy: "fecha",
        descending: true,
        page: 1,
        rowsPerPage: 5,
        // rowsNumber: xx if getting data from a server
      },
      initialPaginationPesos: {
        sortBy: "fecha",
        descending: true,
        page: 1,
        rowsPerPage: 5,
        // rowsNumber: xx if getting data from a server
      },
      ip,
      tasaPesos,
      tasaBolivares,
      rows_bolivares,
      rows_pesos,
      nombreDivisaCambio,
      idDivisaCambio,
      tasaNueva,
      tasaNuevaModal,
      columns,
      loading,
      filter_bs: ref(""),
      filter_pesos: ref(""),
      divisaNueva,
      divisaNuevaModal,
      rol,
      acceso,
    };
  },

  methods: {
    modalTasaNueva(divi_id, divi_nombre) {
      this.nombreDivisaCambio = divi_nombre;
      this.idDivisaCambio = divi_id;
      this.tasaNuevaModal = true;
    },

    async addDivisa() {
      let divisa={
        divisa_nombre: this.divisaNueva
      }

      let datos = await axios.post(this.ip + "agregarDivisa", divisa);

      console.log("El response", datos);
    },

    deleteDivisa() {},

    async addTasaDivisa() {
      let tasa = {
        id_divisa: this.idDivisaCambio,
        tasa_actual: this.tasaNueva,
      };

      let datos = await axios.post(this.ip + "agregarTasaDivisa", tasa);

      console.log("El response", datos.data);

      if (datos.data == 1) {
        this.$router.go();
      }
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 53,
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
      return this.acceso;
    },
  },
};
</script>
