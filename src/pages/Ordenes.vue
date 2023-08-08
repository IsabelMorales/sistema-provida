<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-12 q-pa-md">
        <q-card flat bordered class="my-card">
          <div class="row q-ma-md">
            <!-- SELECCION DEL TIPO DE BUSQUEDA -->
            <div class="col-3">
              <q-select
                emit-value
                map-options
                option-value="id_tipo_busqueda_ordenes"
                option-label="nombre_busqueda"
                v-model="tipoBusqueda"
                :options="tipoBusquedaData"
                label="Tipo de busqueda"
                class="q-mr-lg text-uppercase"
              />
            </div>

            <!-- VALOR DE LA BUSQUEDA -->
            <div class="col-3">
              <q-input
                v-model="busqueda"
                label="Busqueda"
                class="text-uppercase"
                @keyup.enter="finalizar"
              />
            </div>

            <!-- SELECCION DE FECHA -->
            <!-- DESDE -->
            <div class="col-2 q-ml-lg">
              <q-input v-model="from" label="Desde" class="text-uppercase" />
            </div>

            <!-- HASTA -->
            <div class="col-2 q-ml-lg">
              <q-input v-model="to" label="Hasta" class="text-uppercase" />
            </div>

            <div class="col-1 q-ml-lg">
              <q-btn
                label="Buscar"
                @click="finalizar"
                color="primary"
                class="q-mt-sm"
              />
            </div>
          </div>

          <div class="row q-ma-md">
            <div class="col-12">
              <q-btn
                label="Escanear codigo"
                @click="modalEscaner = true"
                color="primary"
                class="q-mt-sm"
              />
            </div>
          </div>

          <div class="row justify-center q-mt-xl">
            <div class="col-12">
              <q-table
                title="Resultados de la busqueda"
                :rows="rows"
                :columns="columns"
                :pagination="initialPagination"
                row-key="examen_codigo"
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
                    <!-- BOTON A LOS RESULTADOS - SUEROS -->
                    <router-link
                      :to="{
                        name: 'Resultados',
                        params: {
                          idOrden: props.row.id_orden,
                          idFactura: props.row.id_factura,
                          idRC: props.row.id_registro_convenio,
                          orden: props.row.numero_orden,
                          fecha: props.row.fecha_orden,
                        },
                      }"
                    >
                      <q-btn
                        dense
                        round
                        flat
                        padding="md"
                        color="grey"
                        icon="visibility"
                        v-if="this.id_usuario == 2"
                      >
                      </q-btn>
                    </router-link>

                    <!-- BOTON A LOS RESULTADOS - BIOANALISTAS -->
                    <router-link
                      :to="{
                        name: 'Resultados',
                        params: {
                          idOrden: props.row.id_orden,
                          idFactura: props.row.id_factura,
                          idRC:props.row.id_registro_convenio,
                          orden: props.row.numero_orden,
                          fecha: props.row.fecha_orden,
                        },
                      }"
                    >
                      <q-btn
                        dense
                        round
                        flat
                        padding="md"
                        color="grey"
                        icon="edit"
                        v-if="
                          this.id_usuario == 3 ||
                          this.id_usuario == 6 ||
                          this.id_usuario == 17 ||
                          this.id_usuario == 21 ||
                          this.id_usuario == 18|| 
                          this.id_usuario == 1 ||
                          this.id_usuario == 8||
                          this.id_usuario == 22||
                          this.id_usuario == 5||
                          this.id_usuario == 24
                        "
                      >
                      </q-btn>
                    </router-link>
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- SI NO ENCUENTRA RESULTADOS -->
    <q-dialog
      v-model="modalNoEncontro"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">No se encontraron ordenes.</div>
          </span>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- ACEPTAR -->
          <q-btn
            unelevated
            label="Aceptar"
            color="primary"
            class="q-mr-md"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="modalEscaner"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              Por favor escanee el codigo de barras
            </div>
          </span>
        </q-card-section>

        <q-card-section>
          <span class="q-mx-lg">
            <q-input
              v-model="codigo"
              label="Codigo de barras"
              class="text-uppercase"
              v-on:keyup.enter="escanear"
              type="password"
            />
          </span>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- ACEPTAR -->
          <q-btn
            unelevated
            label="Cancelar"
            color="primary"
            class="q-mr-md"
            v-close-popup
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
    var today = new Date();
    let to = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    //let from = new Date().toJSON().slice(0, 10).replace(/-/g, "-");
    let from =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      "01";
    let tipoBusqueda = 1;
    let tipoBusquedaData = ref(null);
    let busqueda = ref(null);
    let rows = ref([]);
    let modalNoEncontro = ref(false);
    let codigo = ref(null);
    let modalEscaner = ref(false);
    let acceso = ref(null);
    let id_usuario = parseInt(localStorage.rol);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "fecha",
        required: true,
        label: "Fecha",
        align: "left",
        field: (row) => row.fecha_orden,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "numero",
        required: true,
        label: "Factura / Orden trabajo / Registro convenio",
        align: "left",
        field: (row) => {
          if (row.numero_factura != null) {
            return row.numero_factura + " F";
          } else if(row.numero_factura == null && row.orden_trabajo!=null){
            return row.orden_trabajo + " OT";
          }else{
            return row.numero_registro_convenio + " RC"
          }
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "cedula_RIF",
        align: "left",
        label: "Cedula del cliente",
        field: (row) => row.cedula_RIF,
        sortable: true,
      },
      {
        name: "cliente_nombre",
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
        name: "numero_orden",
        align: "left",
        label: "Orden",
        field: (row) => row.numero_orden,
        sortable: true,
      },
      {
        name: "paciente_cedula",
        align: "left",
        label: "Cedula del paciente",
        field: (row) => row.paciente_cedula,
        sortable: true,
      },
      {
        name: "paciente_nombre",
        align: "left",
        label: "Nombre del paciente",
        field: (row) => row.paciente_nombre + " " + row.paciente_apellido,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    return {
      initialPagination: {
        sortBy: "numero_orden",
        descending: true,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      ip,
      to,
      from,
      tipoBusqueda,
      tipoBusquedaData,
      busqueda,
      columns,
      rows,
      filter: ref(""),
      modalNoEncontro,
      modalEscaner,
      codigo,
      acceso,
      id_usuario,
    };
  },

  methods: {
    escanear() {
      let aux;
      let orden;
      let factura;

      console.log("entro", this.codigo);
      aux = this.codigo.split(" ");
      console.log(aux);
      orden = parseInt(aux[0]);
      factura = parseInt(aux[1]);

      this.$router.push({
        name: "Resultados",
        params: { idOrden: orden, idFactura: factura },
      });
    },

    finalizar() {
      console.log("la busqueda", this.busqueda);
      if (this.tipoBusqueda == 2 || this.tipoBusqueda == 4|| this.tipoBusqueda == 8) {
        this.busqueda = this.busqueda.toUpperCase();
      } else if (this.tipoBusqueda == 5) {
        this.busqueda = "-";
      } else {
        this.busqueda = parseInt(this.busqueda);
      }

      let orden = {
        from: this.from,
        to: this.to,
        tipoBusqueda: this.tipoBusqueda,
        busqueda: this.busqueda,
      };

      console.log(orden);

      axios.post(this.ip + "ordenes", orden).then((response) => {
        console.log("EL RESPONSE", response.data);
        if (response.data.length == 0) {
          this.modalNoEncontro = true;
        } else {
          this.rows = response.data;
        }
      });
    },

    async getTipoBusqueda() {
      let datos = await axios.get(this.ip + "enviarTipoBusquedaOrdenes");
      console.log("LOS TIPOS DE BUSQUEDA", datos.data);
      this.tipoBusquedaData = datos.data;
      console.log(localStorage.id);
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 73,
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
    this.getTipoBusqueda();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
