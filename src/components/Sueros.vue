<template>
  <q-tab-panel class="q-pa-none">
    <div class="fit row justify-end" v-if="this.getAcceso == 1">
      <div class="col-12">
        <q-table
          :rows="rows"
          :columns="columns"
          row-key="departamento_nombre"
          :loading="loading"
          :pagination="initialPagination"
          hide-bottom
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
                />
              </q-td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <div
                    class="row q-mb-md"
                    v-for="examn in props.row.examenes"
                    :key="examn.id_examen"
                  >
                    <div class="col-8 text-subtitle1">
                      {{ examn.examen.examen_nombre }}
                    </div>
                    <div class="col-10">
                      <q-separator />
                    </div>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <div
      class="fit row justify-center text-center"
      v-else-if="this.getAcceso == 0"
    >
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

    <div class="row" padding v-else></div>
  </q-tab-panel>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  props: ["rows", "loading"],

  data() {
    let carga = ref(false);
    let faltaConfirmacion = ref(false);
    let id_usuario = parseInt(localStorage.id);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "departamento_nombre",
        required: true,
        label: "DEPARTAMENTOS",
        align: "left",
        field: (row) => row.departamento_nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
    ];

    return {
      initialPagination: {
        page: 1,
        rowsPerPage: 0,
        // rowsNumber: xx if getting data from a server
      },
      ip,
      columns,
      carga,
      faltaConfirmacion,
      id_usuario,
      acceso,
    };
  },

  methods: {
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
  },

  computed: {
    getAcceso() {
      return this.acceso;
    },
  },
};
</script>
