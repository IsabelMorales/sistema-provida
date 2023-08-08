<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD DE PRESUPUESTO -->
        <q-card flat bordered class="cards">
          <q-card-section>
            <div class="text-h6">PRESUPUESTO DE RESULTADOS</div>
          </q-card-section>

          <q-separator />
          <q-card-section>
            <!-- LOS EXAMENES Y CULTIVOS DEL PACIENTE -->
            <div class="row q-mt-sm justify-center">
              <div class="col-12">
                <q-table
                  title="Examenes y cultivos"
                  :rows="rows"
                  :columns="columns"
                  :pagination="initialPagination2"
                  no-data-label="No hay data disponible"
                  row-key="prueba_nombre"
                >
                  <template v-slot:top-right>
                    <!-- BARRA DE BUSQUEDA -->
                    <q-input
                      debounce="300"
                      v-model="buscar"
                      placeholder="Buscar"
                      @keydown.enter.prevent="buscarExamenCultivo"
                      class="q-mr-xl"
                      outlined
                      dense
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>

                    <!-- BOTON AGREGAR EXAMEN -->
                    <q-btn
                      class="q-ml-md"
                      color="secondary"
                      text-color="accent"
                      label="Examen"
                      @click="agregarExamen()"
                      icon="add"
                    />

                    <!-- BOTON AGREGAR CULTIVO -->
                    <q-btn
                      class="q-mx-md"
                      color="secondary"
                      text-color="accent"
                      label="Cultivo"
                      @click="agregarCultivo()"
                      icon="add"
                    />

                    <!-- BOTON AGREGAR PERFIL -->
                    <q-btn
                      color="secondary"
                      text-color="accent"
                      label="Perfil"
                      @click="agregarPerfil()"
                      icon="add"
                    />
                  </template>

                  <!-- SECCION BOTONES OPCIONES -->
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <!-- BOTON ELIMINAR EXAMEN O CULTIVO -->
                      <q-btn
                        padding="md"
                        dense
                        round
                        flat
                        color="grey"
                        icon="delete"
                        @click="deletePrueba(props.row.codigo)"
                      >
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
            <div class="row q-mt-lg justify-center">
              <div class="col-12">
                <q-card class="my-card">
                  <div class="row q-py-sm q-pl-sm">
                    <div class="col-4 text-h6">Total Bs.: {{ subtotalBs }}</div>
                    <div class="col-4 text-h6">
                      Total Pesos: {{ subtotalPesos }}
                    </div>
                    <div class="col-4 text-h6">
                      Total Dolares: {{ subtotalDolares }}
                    </div>
                  </div>
                </q-card>
              </div>

              <q-space />
              <div class="col-3 q-gutter-x-md text-right">
                <!-- BOTON CANCELAR -->
                <!--<q-btn
                  label="Cancelar"
                  @click="cancelar()"
                  color="grey-9"
                  flat
                />

                 BOTON FINALIZAR FACTURACION 
                <q-btn
                  label="Finalizar"
                  @click="onFinalizar()"
                  color="primary"
                />-->
              </div>
            </div>
          </q-card-section>

          <!-- MODAL AGREGAR EXAMEN -->
          <q-dialog v-model="modalExamenes" full-width>
            <q-card>
              <q-card-section class="q-pb-sm">
                <!-- TABLA QUE MUESTRA TODAS LAS PRUEBAS -->
                <q-table
                  title="Agregar examen"
                  :rows="rows_examenes"
                  :columns="columns_examenes"
                  :pagination="initialPagination"
                  :loading="carga"
                  row-key="examen_codigo"
                  selection="multiple"
                  v-model:selected="selected"
                  :filter="filterExamenes"
                >
                  <template v-slot:top-right>
                    <!-- BARRA DE BUSQUEDA -->
                    <q-input
                      dense
                      debounce="300"
                      v-model="filterExamenes"
                      placeholder="Buscar"
                      class="q-mr-xl"
                      outlined
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
                        @click="
                          addExamen(
                            opt.row.id_examen,
                            opt.row.examen_codigo,
                            opt.row.examen_nombre,
                            opt.row.examen_precio
                          )
                        "
                        icon="done"
                      >
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>

              <q-card-section class="q-pt-none q-pb-sm">
                <div class="row justify-end">
                  <div class="col-1">
                    <!-- BOTON GUARDAR -->
                    <q-btn
                      label="Guardar"
                      @click="addExamenes(selected)"
                      color="primary"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>

          <!-- MODAL AGREGAR CULTIVO -->
          <q-dialog v-model="modalCultivos" full-width>
            <q-card>
              <q-card-section class="q-pb-sm">
                <!-- TABLA QUE MUESTRA TODAS LAS PRUEBAS -->
                <q-table
                  title="Agregar cultivo"
                  :rows="rows_cultivos"
                  :columns="columns_cultivos"
                  :pagination="initialPagination"
                  :loading="carga"
                  row-key="cultivo_nombre"
                  selection="multiple"
                  v-model:selected="selected"
                  :filter="filterCultivos"
                >
                  <template v-slot:top-right>
                    <!-- BARRA DE BUSQUEDA -->
                    <q-input
                      outlined
                      dense
                      debounce="300"
                      v-model="filterCultivos"
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
                        @click="
                          addCultivo(
                            opt.row.id_cultivo,
                            opt.row.cultivo_nombre,
                            opt.row.cultivo_precio,
                            opt.row.cultivo_codigo
                          )
                        "
                        icon="done"
                      >
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>

              <q-card-section class="q-pt-none q-pb-sm">
                <div class="row justify-end">
                  <div class="col-1">
                    <!-- BOTON GUARDAR -->
                    <q-btn
                      label="Guardar"
                      @click="addCultivos(selected)"
                      color="primary"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>

          <!-- MODAL AGREGAR PERFIL -->
          <q-dialog v-model="modalPerfiles" full-width>
            <q-card>
              <q-card-section class="q-pb-sm">
                <!-- TABLA QUE MUESTRA TODAS LAS PRUEBAS -->
                <q-table
                  title="Agregar perfil"
                  :rows="rows_perfiles"
                  :columns="columns_perfiles"
                  :pagination="initialPagination"
                  :loading="carga"
                  row-key="perfil_nombre"
                  selection="multiple"
                  v-model:selected="selected"
                  :filter="filterPerfiles"
                >
                  <template v-slot:top-right>
                    <!-- BARRA DE BUSQUEDA -->
                    <q-input
                      outlined
                      dense
                      debounce="300"
                      v-model="filterPerfiles"
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
                        @click="addPerfil(opt.row.id_perfil)"
                        icon="done"
                      >
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </q-dialog>
        </q-card>
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
import axios from "axios";
import { ref } from "vue";

export default {
  data() {
    //MODULOS
    let modalExamenes = ref(false);
    let modalCultivos = ref(false);
    let modalPerfiles = ref(false);
    //VARIABLES
    let buscar = ref(null);
    const rows = ref([]);
    let rows_examenes = ref([]);
    let rows_cultivos = ref([]);
    let rows_perfiles = ref([]);
    const selected = ref([]);
    const aux_examenes = ref([]);
    const aux_total = ref([]);
    let aux_examenes_cultivos = ref([]);
    const carga = ref(true);
    let totalDolares = 0;
    let desde = 0;
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    const columns = [
      {
        name: "codigo",
        required: true,
        label: "Codigo",
        align: "left",
        field: (row) => row.codigo,
        sortable: true,
      },
      {
        name: "nombre",
        align: "left",
        label: "Nombre",
        field: "nombre",
        sortable: true,
      },
      {
        name: "precio",
        required: true,
        label: "Precio (Bs.)",
        align: "left",
        field: (row) =>
          Number(Math.round(row.precio * this.cambioBs + "e+2") + "e-2"),
        sortable: true,
      },
      {
        name: "precio",
        required: true,
        label: "Precio (COP)",
        align: "left",
        field: (row) =>
          Number(Math.round(row.precio * this.cambioPesos + "e+2") + "e-2"),
        sortable: true,
      },
      {
        name: "precio",
        required: true,
        label: "Precio (USD)",
        align: "left",
        field: (row) => Number(Math.round(row.precio + "e+2") + "e-2"),
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const columns_examenes = [
      {
        name: "examen_codigo",
        required: true,
        label: "Codigo de examen",
        align: "left",
        field: (row) => row.examen_codigo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "examen_nombre",
        align: "left",
        label: "Nombre de examen",
        field: "examen_nombre",
        sortable: true,
      },
      {
        name: "examen_precio",
        align: "center",
        label: "Precio del examen $",
        field: (row) => Number(Math.round(row.examen_precio + "e+2") + "e-2"),
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const columns_cultivos = [
      {
        name: "cultivo_codigo",
        required: true,
        label: "Codigo de cultivo",
        align: "left",
        field: (row) => row.cultivo_codigo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "cultivo_nombre",
        align: "left",
        label: "Nombre de cultivo",
        field: "cultivo_nombre",
        sortable: true,
      },
      {
        name: "cultivo_precio",
        align: "center",
        label: "Precio del cultivo $",
        field: (row) => Number(Math.round(row.cultivo_precio + "e+2") + "e-2"),
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const columns_perfiles = [
      {
        name: "perfil_nombre",
        align: "left",
        label: "Nombre de perfil",
        field: "perfil_nombre",
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    // SE TRAE LA LISTA DE EXAMENES //
    axios
      .get(ip + "examenes")
      .then((response) => {
        rows_examenes.value = response.data;
        for (let i = 0; i < response.data.length; i++) {
          aux_examenes_cultivos.value = [
            ...aux_examenes_cultivos.value,
            response.data[i],
          ];
        }
        console.log(
          "EL AUX DE EXAMENES Y CULTIVOS",
          aux_examenes_cultivos.value
        );
        console.log("LOS EXAMENES", rows_examenes.value);
      })
      .finally(() => {
        carga.value = false;
      });

    // SE TRAE LA LISTA DE CULTIVOS //
    axios
      .get(ip + "cultivos")
      .then((response) => {
        rows_cultivos.value = response.data;
        for (let i = 0; i < response.data.length; i++) {
          aux_examenes_cultivos.value = [
            ...aux_examenes_cultivos.value,
            response.data[i],
          ];
        }

        console.log(
          "EL AUX DE EXAMENES Y CULTIVOS",
          aux_examenes_cultivos.value
        );
        console.log("LOS CULTIVOS", rows_cultivos.value);
      })
      .finally(() => {
        carga.value = false;
      });

    // SE TRAE LA LISTA DE PERFILES //
    axios
      .get(ip + "perfiles")
      .then((response) => {
        rows_perfiles.value = response.data;
        console.log("LOS PERFILES", rows_perfiles.value);
      })
      .finally(() => {
        carga.value = false;
      });

    // BUSCA UN EXAMEN O UN CULTIVO EN EL AUXILIAR Y LO AGREGA A LA TABLA
    const buscarExamenCultivo = () => {
      console.log(
        "EL CODIGO A BUSCAR EN MAYUSCULAS",
        buscar.value.toUpperCase()
      );
      for (let i = 0; i < aux_examenes_cultivos.value.length; i++) {
        if (
          aux_examenes_cultivos.value[i].examen_codigo ==
          buscar.value.toUpperCase()
        ) {
          console.log("ENCONTRO UN EXAMEN");
          rows.value = [
            ...rows.value,
            {
              id_examen: aux_examenes_cultivos.value[i].id_examen,
              codigo: aux_examenes_cultivos.value[i].examen_codigo,
              nombre: aux_examenes_cultivos.value[i].examen_nombre,
              precio: aux_examenes_cultivos.value[i].examen_precio,
            },
          ];
          this.buscar = "";
          break;
        } else if (
          aux_examenes_cultivos.value[i].cultivo_codigo ==
          buscar.value.toUpperCase()
        ) {
          console.log("ENCONTRO UN CULTIVO");
          rows.value = [
            ...rows.value,
            {
              id_cultivo: aux_examenes_cultivos.value[i].id_cultivo,
              codigo: aux_examenes_cultivos.value[i].cultivo_codigo,
              nombre: aux_examenes_cultivos.value[i].cultivo_nombre,
              precio: aux_examenes_cultivos.value[i].cultivo_precio,
            },
          ];
          this.buscar = "";
          break;
        } else {
          console.log("NO ENCONTRO UN TOCHE");
        }
      }
    };

    // AGREGA UN SOLO EXAMEN A LA LISTA DE EXAMENES Y CULTIVOS //
    const addExamen = (
      examen_id,
      codigo_examen,
      nombre_examen,
      precio_examen
    ) => {
      rows.value = [
        ...rows.value,
        {
          id_examen: examen_id,
          codigo: codigo_examen,
          nombre: nombre_examen,
          precio: precio_examen,
        },
      ];
      this.selected = [];
      this.filterExamenes = "";
      this.modalExamenes = false;
    };

    // AGREGA VARIOS EXAMENES A LA LISTA DE EXAMENES Y CULTIVOS //
    const addExamenes = (selected) => {
      console.log("el selected", selected[0].id_examen);
      for (let i = 0; i < selected.length; i++) {
        rows.value = [
          ...rows.value,
          {
            id_examen: selected[i].id_examen,
            codigo: selected[i].examen_codigo,
            nombre: selected[i].examen_nombre,
            precio: selected[i].examen_precio,
          },
        ];
      }
      this.filterExamenes = "";
      this.selected = [];
      this.modalExamenes = false;
    };

    // AGREGA UN SOLO CULTIVO A LA LISTA DE EXMANES Y CULTIVOS //
    const addCultivo = (
      cultivo_id,
      nombre_cultivo,
      precio_cultivo,
      codigo_cultivo
    ) => {
      rows.value = [
        ...rows.value,
        {
          id_cultivo: cultivo_id,
          codigo: codigo_cultivo,
          nombre: nombre_cultivo,
          precio: precio_cultivo,
        },
      ];
      this.filterCultivos = "";
      this.selected = [];
      this.modalCultivos = false;
    };

    // AGREGA VARIOS CULTIVOS A LA LISTA DE EXAMENES Y CULTIVOS //
    const addCultivos = (selected) => {
      console.log("el selected", selected[0].id_cultivo);
      for (let i = 0; i < selected.length; i++) {
        rows.value = [
          ...rows.value,
          {
            id_cultivo: selected[i].id_cultivo,
            nombre: selected[i].cultivo_nombre,
            precio: selected[i].cultivo_precio,
          },
        ];
      }
      this.filterCultivos = "";
      this.selected = [];
      this.modalCultivos = false;
    };

    // ELIMINAR UNA PRUEBA DEL EXAMEN //
    const deletePrueba = (codigo) => {
      let tamano = rows.value.length;
      for (let i = 0; i < tamano; i++) {
        console.log("entro al for");
        if (rows.value[i].codigo == codigo) {
          var prueba = this.rows.splice(i, 1);
          console.log("LA ELIMINADA", prueba);
          break;
        }
      }
    };

    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
        // rowsNumber: xx if getting data from a server
      },
      initialPagination2: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 0,
        // rowsNumber: xx if getting data from a server
      },
      ip,
      rows,
      rows_examenes,
      rows_cultivos,
      rows_perfiles,
      columns,
      columns_examenes,
      columns_cultivos,
      columns_perfiles,
      carga,
      selected,
      filterExamenes: ref(""),
      filterCultivos: ref(""),
      filterPerfiles: ref(""),
      addExamen,
      addExamenes,
      addCultivo,
      addCultivos,
      buscarExamenCultivo,
      modalExamenes,
      modalCultivos,
      modalPerfiles,
      aux_examenes,
      totalDolares,
      aux_examenes_cultivos,
      buscar,
      deletePrueba,
      dense: ref(true),
      existe: 0,
      subtotal: 0,
      desde,
      cambioBs: 0,
      cambioPesos: 0,
      acceso,
    };
  },

  methods: {
    cancelar() {
      this.$router.go();
    },

    // ACTIVA EL MODAL DE EXAMENES
    agregarExamen() {
      this.modalExamenes = true;
    },

    // ACTIVA EL MODAL DE CULTIVOS
    agregarCultivo() {
      this.modalCultivos = true;
    },

    agregarPerfil() {
      this.modalPerfiles = true;
    },

    // AGREGA UN SOLO EXAMEN A LA LISTA DE EXAMENES Y CULTIVOS //
    async addPerfil(perfil_id) {
      let perfil = {
        id_perfil: perfil_id,
      };
      console.log(perfil);
      let examenes = await axios.post(this.ip + "perfilExamenes", perfil);
      console.log("los examenes del perfil", examenes);

      //this.rows = [...this.rows, ...examenes.data];

      for (let i = 0; i < examenes.data.length; i++) {
        this.rows = [
          ...this.rows,
          {
            id_examen: examenes.data[i].id_examen,
            codigo: examenes.data[i].examen_codigo,
            nombre: examenes.data[i].examen_nombre,
            precio: examenes.data[i].examen_precio,
          },
        ];
      }

      this.selected = [];
      this.filterPerfiles = "";
      this.modalPerfiles = false;
    },

    // SE TRAE LAS DIVISAS CON LAS TASAS DE CAMBIO
    async getDivisas() {
      let datos = await axios.get(this.ip + "registroDivisas");
      console.log("LAS DIVISAS en facturacion", datos.data.registroDivisas);

      for (let i = 0; i < datos.data.registroDivisas.length; i++) {
        if (datos.data.registroDivisas[i].id_divisa == 1) {
          this.cambioPesos = datos.data.registroDivisas[i].tasa_actual;
        } else if (datos.data.registroDivisas[i].id_divisa == 3) {
          this.cambioBs = datos.data.registroDivisas[i].tasa_actual;
          this.cambioBs = Number(Math.round(this.cambioBs + "e+2") + "e-2");
        }
      }

      console.log("LOS PESOS", this.cambioPesos);
      console.log("LOS BS", this.cambioBs);
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 70,
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

    // ENVIA LOS PACIENTES, SUS EXAMENES/CULTIVOS Y LOS TOTALES AL PADRE
    /*onFinalizar() {
      if (
        (this.cedulaPaciente != null && this.rows.length != 0) ||
        this.aux_pacientes.length != 0
      ) {
        // REVISA SI EL PACIENTE EXISTE EN LA LISTA DE PACIENTES 
        for (let i = 0; i < this.aux_pacientes.length; i++) {
          // SI EXISTE LO MODIFICA
          if (this.idP == this.aux_pacientes[i].id_paciente) {
            console.log("el paciente existe en la lista");
            this.existe = 1;
            this.aux_pacientes[i].id_paciente = this.idP;
            this.aux_pacientes[i].cedula_paciente = this.cedulaPaciente;
            this.aux_pacientes[i].nombre_paciente = this.nombrePaciente;
            this.aux_pacientes[i].examenes = this.rows;
          }
        }

        // SI NO EXISTE LO AÑADE A LA LISTA
        if (this.existe == 0) {
          console.log("envia", this.cedulaPaciente + " " + this.rows.length);
          for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].id_examen) {
              this.aux_examenes.push({
                id_examen: this.rows[i].id_examen,
                codigo: this.rows[i].codigo,
                nombre: this.rows[i].nombre,
                precio: this.rows[i].precio,
              });
            } else {
              this.aux_examenes.push({
                id_cultivo: this.rows[i].id_cultivo,
                codigo: this.rows[i].codigo,
                nombre: this.rows[i].nombre,
                precio: this.rows[i].precio,
              });
            }

            this.totalDolares += this.rows[i].precio;
          }

          this.aux_pacientes.push({
            id_paciente: this.idP,
            nombre_paciente: this.nombrePaciente,
            cedula_paciente: this.cedulaPaciente,
            examenes: this.aux_examenes,
          });
        }

        this.aux_total.push({
          total_dolares: this.totalDolares,
          pacientes: this.aux_pacientes,
          seguro: this.seguro,
        });

        console.log("este es el aux_total", this.aux_total);
        this.$emit("finalizarPacientes", this.aux_total);

        this.aux_examenes = [];
        this.nombrePaciente = null;
        this.cedulaPaciente = null;
        this.buscarCedula = null;
        this.rows = [];
      } else {
        console.log("PACIENTE NULO");
      }
    },*/
  },

  created() {
    this.getDivisas();
    this.validar();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },

    subtotalBs() {
      let total = 0;

      for (let i = 0; i < this.rows.length; i++) {
        total += this.rows[i].precio;
      }

      return Number(
        Math.round(total * this.cambioBs + "e+2") + "e-2"
      ).toLocaleString("de-DE");
    },

    subtotalPesos() {
      let total = 0;
      let igtf = 0;

      for (let i = 0; i < this.rows.length; i++) {
        total += this.rows[i].precio;
      }

      total = Number(Math.round(total * this.cambioPesos + "e+2") + "e-2");

      var digits = total.toString().split("");
      var realDigits = digits.map(Number);
      var i = realDigits.length;
      console.log(realDigits[i - 3]);

      if (
        realDigits[i - 3] != 0 ||
        realDigits[i - 2] != 0 ||
        realDigits[i - 1] != 0
      ) {
        realDigits[i - 1] = 0;
        realDigits[i - 2] = 0;
        realDigits[i - 3] = 0;
        realDigits[i - 4] = realDigits[i - 4] + 1;
        if (realDigits[i - 4] > 9) {
          realDigits[i - 4] = 0;
          realDigits[i - 5] = realDigits[i - 5] + 1;

          if (realDigits[i - 5] > 9) {
            realDigits[i - 5] = 0;
            realDigits[i - 6] = realDigits[i - 6] + 1;

            if (realDigits[i - 6] > 9) {
              realDigits[i - 6] = 0;
              realDigits[i - 7] = realDigits[i - 7] + 1;
            }
          }
        }
      }

      console.log(realDigits);
      total = realDigits.join("");
      total = parseInt(total);
      console.log("el tttotal", total);

      igtf = total * 0.03;
      total = total + igtf;

      return total.toLocaleString("de-DE");
    },

    subtotalDolares() {
      let total = 0;
      let igtf = 0;

      for (let i = 0; i < this.rows.length; i++) {
        total += this.rows[i].precio;
      }

      igtf = total * 0.03;
      total = total + igtf;

      return Number(Math.round(total + "e+2") + "e-2").toLocaleString("de-DE");
    },

    subtotalTablaDolares() {
      let total = 0;

      for (let i = 0; i < this.rows.length; i++) {
        total += this.rows[i].precio;
      }

      return Number(Math.round(total + "e+2") + "e-2");
    },

    subtotalTablaBs() {
      let total = 0;

      for (let i = 0; i < this.rows.length; i++) {
        total += this.rows[i].precio;
      }

      return Number(Math.round(total * this.cambioBs + "e+2") + "e-2");
    },

    subtotalTablaPesos() {
      let total = 0;

      for (let i = 0; i < this.rows.length; i++) {
        total += this.rows[i].precio;
      }

      return Number(Math.round(total * this.cambioPesos + "e+2") + "e-2");
    },
  },
};
</script>
