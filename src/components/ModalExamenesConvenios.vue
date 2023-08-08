<template>
  <q-page padding>
    <div class="fit row justify-center">
      <div class="col-12">
        <!-- CARD DE FACTURACION -->
        <q-card flat bordered class="cards">
          <q-card-section>
            <div class="text-h6">FACTURACION {{ getTipoFactura }}</div>
          </q-card-section>

          <q-card-section>
            <div class="row">
              <div class="col-12">
                <div class="text-h6">Cliente</div>
              </div>
            </div>

            <div class="row">
              <!-- CEDULA O RIF DEL CLIENTE -->
              <div class="col-2">
                <q-input
                  type="text"
                  label="Cedula/rif"
                  v-model="getCedulaRif"
                  class="text-uppercase"
                  readonly
                  outlined
                  :dense="dense"
                  bg-color="white"
                />
              </div>
              <!-- NOMBRE DEL CLIENTE -->
              <div class="col-4 q-ml-md">
                <q-input
                  type="text"
                  label="Nombre del cliente"
                  v-model="getNombreCliente"
                  class="text-uppercase"
                  readonly
                  outlined
                  :dense="dense"
                  bg-color="white"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row">
              <div class="col-12">
                <div class="text-h6">Pacientes</div>
              </div>
            </div>

            <div class="row q-mt-md justify-end">
              <div class="col-2 text-right">
                <!-- BOTON AGREGAR PACIENTES -->
                <q-btn
                  label="Seleccionar pacientes"
                  @click="modalPacientes = true"
                  color="primary"
                />
              </div>
              <div class="col-3 text-right">
                <!-- BOTON AGREGAR NUEVO GRUPO DE PACIENTES -->
                <q-btn
                  label="Nuevo grupo de pacientes"
                  @click="onAgregar()"
                  color="primary"
                />
              </div>
            </div>

            <!-- LOS EXAMENES Y CULTIVOS DEL PACIENTE -->
            <div class="row q-mt-sm">
              <div class="col-7">
                <q-table
                  title="Examenes y cultivos"
                  :rows="rows"
                  :columns="columns"
                  :pagination="initialPagination"
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

                    <!-- BOTON AGREGAR NUEVO EXAMEN -->
                    <q-btn
                      class="q-ml-lg"
                      color="secondary"
                      text-color="accent"
                      label="Agregar examen"
                      @click="agregarExamen()"
                      icon="add"
                    />

                    <!-- BOTON AGREGAR NUEVO CULTIVO -->
                    <q-btn
                      class="q-ml-md"
                      color="secondary"
                      text-color="accent"
                      label="Agregar cultivo"
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
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="codigo" :props="props">{{
                        props.row.codigo
                      }}</q-td>
                      <q-td key="nombre" :props="props">
                        {{ props.row.nombre }}
                        <q-popup-edit
                          v-model="props.row.nombre"
                          title="Modificar nombre"
                          buttons
                          v-slot="scope"
                        >
                          <q-input
                            type="text"
                            v-model="scope.value"
                            dense
                            autofocus
                          />
                        </q-popup-edit>
                      </q-td>
                      <q-td key="precio" :props="props">{{
                        props.row.precio
                      }}</q-td>
                      <q-td key="actions" :props="props">
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
                    </q-tr>
                  </template>
                  <template v-slot:bottom-row>
                    <q-tr>
                      <q-td class="text-right">
                        Subtotal de los pacientes Bs: {{ subtotalTablaBs }}
                      </q-td>
                      <q-td class="text-right">
                        Subtotal de los pacientes COP: {{ subtotalTablaPesos }}
                      </q-td>
                      <q-td class="text-right">
                        Subtotal de los pacientes $: {{ subtotalTablaDolares }}
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <div class="col-5 q-pl-md">
                <q-table
                  title="Pacientes"
                  :rows="aux_pacientes"
                  :columns="columns_aux_pacientes"
                  row-key="cedula"
                  no-data-label="No hay data disponible"
                >
                  <!-- SECCION BOTONES OPCIONES -->
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <!-- BOTON ELIMINAR PACIENTE -->
                      <q-btn
                        padding="md"
                        dense
                        round
                        flat
                        color="grey"
                        icon="delete"
                        @click="deletePaciente(props.row.id_paciente)"
                      >
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </div>
            </div>
            <div class="row q-mt-lg">
              <div class="col-7">
                <q-card class="my-card">
                  <div class="row q-py-sm q-pl-sm">
                    <div class="col-4">Subtotal Bs.: {{ subtotalBs }}</div>
                    <div class="col-4">Subtotal Pesos: {{ subtotalPesos }}</div>
                    <div class="col-4">
                      Subtotal Dolares: {{ this.totalDolares }}
                    </div>
                  </div>
                </q-card>
              </div>

              <q-space />
              <div class="col-3 q-gutter-x-md text-right">
                <!-- BOTON CANCELAR -->
                <q-btn
                  label="Cancelar"
                  @click="cancelar()"
                  color="grey-9"
                  flat
                />

                <!-- BOTON FINALIZAR FACTURACION -->
                <q-btn
                  label="Finalizar"
                  @click="onFinalizar()"
                  color="primary"
                />
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
        </q-card>
      </div>
    </div>

    <!-- MODAL VERIFICACION PACIENTE -->
    <q-dialog
      v-model="pacienteNoExiste"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">El paciente no existe.</div>
          </span>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- CANCELAR -->
          <q-btn
            unelevated
            label="Cancelar"
            color="primary"
            class="q-mr-md"
            v-close-popup
          />

          <!-- CREAR -->
          <q-btn
            unelevated
            label="Crear"
            color="primary"
            @click="crearPaciente"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL VERIFICACION PACIENTE -->
    <q-dialog
      v-model="pacienteYaExiste"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">El paciente ya fue agregado</div>
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

    <!-- MODAL AGREGAR PACIENTES -->
    <q-dialog v-model="modalPacientes" full-width>
      <q-card>
        <q-card-section class="q-pb-sm">
          <!-- TABLA QUE MUESTRA TODOS LOS PACIENTES -->
          <q-table
            title="Agregar pacientes"
            :rows="rows_pacientes"
            :columns="columns_pacientes"
            :pagination="initialPagination"
            :loading="carga"
            row-key="id_paciente"
            selection="multiple"
            v-model:selected="selected"
            :filter="filterPacientes"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                dense
                debounce="300"
                v-model="filterPacientes"
                placeholder="Buscar"
                class="q-mr-xl"
                outlined
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <!-- BOTON CREAR PACIENTE -->
              <q-btn
                class="q-ml-xl"
                color="primary"
                label="Crear paciente"
                @click="crearPaciente"
              />

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
                    addPaciente(
                      opt.row.id_paciente,
                      opt.row.paciente_cedula,
                      opt.row.paciente_nombre,
                      opt.row.paciente_apellido
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
                @click="addPacientes(selected)"
                color="primary"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="modalFaltaExamen"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 300px">
        <q-card-section class="row items-center q-ma-md">
          <div class="col-12 text-center q-mb-md">
            <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          </div>
          <div class="col-12 text-center">
            <div class="text-subtitle1">
              Por favor agregue examenes o cultivos al lote de pacientes actual.
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- ACEPTAR -->
          <q-btn unelevated label="Aceptar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="errorEnPaciente"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 300px">
        <q-card-section class="row items-center q-ma-md">
          <div class="col-12 text-center q-mb-md">
            <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          </div>
          <div class="col-12 text-center">
            <div class="text-subtitle1">
              La cedula ya existe, intentelo de nuevo.
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- ACEPTAR -->
          <q-btn unelevated label="Aceptar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <CrearPaciente
      v-if="modalPaciente"
      v-model="crear_paciente"
      :from="this.desde"
      :tipo_documento="null"
      :cedula_paciente="null"
      :paciente="JSON.stringify(this.paciente)"
      @crearPaciente="onCrearPaciente"
      @cancelarPaciente="onCancelarPaciente"
    ></CrearPaciente>
  </q-page>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import CrearPaciente from "./CrearPacienteFacturacion.vue";

export default {
  props: [
    "nombreCliente",
    "cedulaRIF",
    "tipoFactura",
    "cambioBs",
    "cambioPesos",
  ],

  components: {
    CrearPaciente,
  },

  data() {
    //MODULOS
    let crear_paciente = ref(false);
    let pacienteNoExiste = ref(false);
    let modalPaciente = ref(false);
    let pacienteYaExiste = ref(false);
    let examenNoExiste = ref(false);
    let modalExamenes = ref(false);
    let modalCultivos = ref(false);
    let modalPacientes = ref(false);
    //VARIABLES
    let nombre = ref(this.nombreCliente);
    let nombrePaciente = ref(null);
    let buscarCedula = ref(null);
    let cedulaPaciente = ref(null);
    let idP = ref(null);
    let buscar = ref(null);
    const rows = ref([]);
    let rows_examenes = ref([]);
    let rows_cultivos = ref([]);
    let rows_pacientes = ref([]);
    const selected = ref([]);
    const aux_pacientes = ref([]);
    const aux_examenes = ref([]);
    const aux_total = ref([]);
    let aux_examenes_cultivos = ref([]);
    let aux_items = ref([]);
    const carga = ref(true);
    let totalDolares = 0;
    let desde = 0;
    let paciente = ref(null);

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
        align: "center",
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
        align: "center",
        label: "Nombre de examen",
        field: "examen_nombre",
        sortable: true,
      },
      {
        name: "examen_precio",
        align: "center",
        label: "Precio del examen (Bs.)",
        field: (row) =>
          Number(Math.round(row.examen_precio * this.cambioBs + "e+2") + "e-2"),
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
        align: "center",
        label: "Nombre de cultivo",
        field: "cultivo_nombre",
        sortable: true,
      },
      {
        name: "cultivo_precio",
        align: "center",
        label: "Precio del cultivo (Bs.)",
        field: (row) =>
          Number(
            Math.round(row.cultivo_precio * this.cambioBs + "e+2") + "e-2"
          ),
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const columns_pacientes = [
      {
        name: "paciente_cedula",
        required: true,
        label: "Cédula",
        align: "left",
        field: (row) => row.paciente_cedula,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "paciente_nombre",
        align: "center",
        label: "Nombre",
        field: (row) => row.paciente_nombre + " " + row.paciente_apellido,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const columns_aux_pacientes = [
      {
        name: "cedula",
        required: true,
        label: "Cédula",
        align: "left",
        field: (row) => row.cedula,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "nombre",
        align: "center",
        label: "Nombre",
        field: (row) => row.nombre,
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

    // SE TRAE LA LISTA DE PACIENTES //
    const getPacientes = () => {
      axios
        .get(ip + "pacientes")
        .then((response) => {
          rows_pacientes.value = response.data;
          console.log("LOS PACIENTES", rows_pacientes.value);
        })
        .finally(() => {
          carga.value = false;
        });
    };

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
    const addPaciente = (
      paciente_id,
      cedula_paciente,
      nombre_paciente,
      apellido_paciente
    ) => {
      aux_pacientes.value = [
        ...aux_pacientes.value,
        {
          id_paciente: paciente_id,
          cedula: cedula_paciente,
          nombre: nombre_paciente + " " + apellido_paciente,
        },
      ];
      this.selected = [];
      this.filterPacientes = "";
      this.modalPacientes = false;
    };

    // AGREGA VARIOS EXAMENES A LA LISTA DE EXAMENES Y CULTIVOS //
    const addPacientes = (selected) => {
      console.log("el selected", selected[0].id_paciente);
      for (let i = 0; i < selected.length; i++) {
        aux_pacientes.value = [
          ...aux_pacientes.value,
          {
            id_paciente: selected[i].id_paciente,
            cedula: selected[i].paciente_cedula,
            nombre:
              selected[i].paciente_nombre + " " + selected[i].paciente_apellido,
          },
        ];
      }
      this.selected = [];
      this.filterPacientes = "";
      this.modalPacientes = false;
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
      nombre,
      cedula: this.cedulaRIF,
      nombrePaciente,
      cedulaPaciente,
      buscarCedula,
      idP,
      pacienteNoExiste,
      pacienteYaExiste,
      ip,
      rows,
      rows_examenes,
      rows_cultivos,
      rows_pacientes,
      columns,
      columns_examenes,
      columns_cultivos,
      columns_pacientes,
      columns_aux_pacientes,
      carga,
      selected,
      filterExamenes: ref(""),
      filterCultivos: ref(""),
      filterPacientes: ref(""),
      addExamen,
      addExamenes,
      addCultivo,
      addCultivos,
      addPaciente,
      addPacientes,
      buscarExamenCultivo,
      modalExamenes,
      modalCultivos,
      aux_pacientes,
      aux_examenes,
      aux_items,
      totalDolares,
      aux_total,
      crear_paciente,
      aux_examenes_cultivos,
      buscar,
      examenNoExiste,
      deletePrueba,
      dense: ref(true),
      existe: 0,
      subtotal: 0,
      totalTabla: 0,
      modalPacientes,
      modalFaltaExamen: false,
      errorEnPaciente: false,
      desde,
      modalPaciente,
      paciente,
      getPacientes,
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

    crearPaciente() {
      this.crear_paciente = true;
      this.modalPaciente = true;
      this.desde = 1;
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

    // AGREGA UN PACIENTE Y SUS EXAMENES/CULTIVOS AL ARREGLO AUXILIAR
    onAgregar() {
      console.log(this.rows);
      if (this.aux_pacientes.length != 0 && this.rows.length != 0) {
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i].id_examen) {
            this.aux_examenes.push({
              id_examen: this.rows[i].id_examen,
              nombre:  this.rows[i].nombre,
            });
            this.totalDolares =
              this.totalDolares +
              this.rows[i].precio * this.aux_pacientes.length;
          } else {
            this.aux_examenes.push({
              id_cultivo: this.rows[i].id_cultivo,
              nombre:  this.rows[i].nombre,
            });
            this.totalDolares +=
              this.totalDolares +
              this.rows[i].precio * this.aux_pacientes.length;
          }
        }
        console.log(this.aux_examenes);
        this.aux_items.push({
          items: this.aux_examenes,
          pacientes: this.aux_pacientes,
        });

        console.log(this.aux_items);

        // VACIA LOS DATOS DEL PACIENTE
        this.aux_examenes = [];
        this.aux_pacientes = [];
        this.rows = [];
        this.subtotal = 0;

        console.log(this.aux_pacientes);
        console.log(this.totalDolares);
      } else {
        console.log("PACIENTE NULO");
        this.modalFaltaExamen = true;
      }
    },

    // ELIMINAR UN PACIENTE DE LA LISTA //
    deletePaciente(id) {
      for (let i = 0; i < this.aux_pacientes.length; i++) {
        if (this.aux_pacientes[i].id_paciente == id) {
          let paciente = this.aux_pacientes.splice(i, 1);
          console.log("LA ELIMINADA", paciente);
          console.log(this.aux_pacientes);
          break;
        }
      }
    },

    // SE TRAE LA INFORMACION DEL PACIENTE NUEVO DESDE EL MODAL Y LO ASIGNA A LOS CAMPOS DE LA VISTA
    onCrearPaciente(e) {
      console.log("LO QUE SE TRAE DEL PACIENTE NUEVO", e);
      if (e == "ERROR EN AGREGAR PACIENTE!") {
        this.errorEnPaciente = true;
      } else {
        console.log("entro aqui")
        this.paciente = e;
        this.nombrePaciente =
          e.paciente_nombre + " " + e.paciente_apellido;
        this.pacienteNoExiste = false;
        this.crear_paciente = false;
        this.modalPaciente = false;
        this.getPacientes();
      }
    },

    onCancelarPaciente(e) {
      console.log("el response de cancelar paciente", e);
      this.crear_paciente = false;
    },

    // ENVIA LOS PACIENTES, SUS EXAMENES/CULTIVOS Y LOS TOTALES AL PADRE
    onFinalizar() {
      if (
        (this.cedulaPaciente != null && this.rows.length != 0) ||
        this.aux_pacientes.length != 0
      ) {
        for (let i = 0; i < this.rows.length; i++) {
          if (this.rows[i].id_examen) {
            this.aux_examenes.push({
              id_examen: this.rows[i].id_examen,
              nombre:  this.rows[i].nombre,
            });
            this.totalDolares =
              this.totalDolares +
              this.rows[i].precio * this.aux_pacientes.length;
          } else {
            this.aux_examenes.push({
              id_cultivo: this.rows[i].id_cultivo,
              nombre:  this.rows[i].nombre,
            });
            this.totalDolares =
              this.totalDolares +
              this.rows[i].precio * this.aux_pacientes.length;
          }
        }
        console.log(this.aux_examenes);
        this.aux_items.push({
          items: this.aux_examenes,
          pacientes: this.aux_pacientes,
        });

        console.log(this.aux_items);

        console.log(this.aux_pacientes);
        console.log(this.totalDolares);

        this.aux_total.push({
          total_dolares: this.totalDolares,
          detallesExamenes: this.aux_items,
        });

        // VACIA LOS DATOS DEL PACIENTE
        this.aux_examenes = [];
        this.aux_pacientes = [];
        this.rows = [];
        this.subtotal = 0;

        console.log("este es el aux_total", this.aux_total);
        this.$emit("finalizarPacientes", this.aux_total);
      } else {
        console.log("PACIENTE NULO");
      }
    },
  },

  created() {
    this.getPacientes();
  },

  computed: {
    // MANEJA EL NOMBRE DEL CLIENTE
    getNombreCliente() {
      return this.nombreCliente;
    },

    // MANEJA LA CEDULA DEL CLIENTE
    getCedulaRif() {
      return this.cedulaRIF;
    },

    getTipoFactura() {
      if (this.tipoFactura == 1) {
        return "A CONTADO";
      } else if (this.tipoFactura == 2) {
        return "A CREDITO";
      } else if (this.tipoFactura == 3) {
        return "ORDEN DE TRABAJO";
      } else {
        return "REGISTRO CONVENIO";
      }
    },

    subtotalBs() {
      return Number(
        Math.round(this.totalDolares * this.cambioBs + "e+2") + "e-2"
      );
    },

    subtotalPesos() {
      return this.totalDolares * this.cambioPesos;
    },

    subtotalTablaDolares() {
      let total = 0;

      for (let i = 0; i < this.rows.length; i++) {
        total += this.rows[i].precio * this.aux_pacientes.length;
      }

      return Number(Math.round(total + "e+2") + "e-2");
    },

    subtotalTablaBs() {
      let total = 0;

      for (let i = 0; i < this.rows.length; i++) {
        total += this.rows[i].precio * this.aux_pacientes.length;
      }

      return Number(Math.round(total * this.cambioBs + "e+2") + "e-2");
    },

    subtotalTablaPesos() {
      let total = 0;

      for (let i = 0; i < this.rows.length; i++) {
        total += this.rows[i].precio * this.aux_pacientes.length;
      }

      return Number(Math.round(total * this.cambioPesos + "e+2") + "e-2");
    },
  },
};
</script>
