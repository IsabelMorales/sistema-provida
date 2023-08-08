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
                <div class="text-h6">Paciente</div>
              </div>
            </div>

            <q-form @submit="buscarPaciente">
              <div class="row">
                <!-- CEDULA DEL PACIENTE -->
                <div class="col-1">
                  <q-select
                    emit-value
                    map-options
                    option-value="documento_nombre"
                    option-label="documento_nombre"
                    v-model="tipoDocumento"
                    :options="tipoDocumentoData"
                    label="Tipo"
                    class="q-mr-md text-uppercase text-center"
                    outlined
                    :dense="dense"
                    bg-color="white"
                    autofocus
                  />
                </div>
                <div class="col-2">
                  <q-input
                    v-model="buscarCedula"
                    type="text"
                    label="cedula del paciente"
                    class="text-uppercase"
                    @keydown.tab.prevent="buscarPaciente()"
                    outlined
                    :dense="dense"
                    bg-color="white"
                  />
                </div>
                <div class="col-1 q-ml-sm">
                  <q-btn label="Buscar" type="submit" color="primary" />
                </div>
                <div class="col-2 q-ml-sm">
                  <q-btn
                    label="Buscar por nombre"
                    @click="agregarPaciente()"
                    color="primary"
                  />
                </div>
                <div class="col-2">
                  <q-checkbox v-model="seguro" label="Factura para seguro" />
                </div>
                <q-space />
                <div class="col-3 text-right">
                  <!-- BOTON AGREGAR PACIENTE -->
                  <q-btn
                    label="Agregar nuevo paciente"
                    @click="onAgregar()"
                    color="primary"
                    v-if="!seguro"
                  />
                  <q-btn
                    label="Agregar nuevo paciente"
                    color="primary"
                    v-else
                    disable
                  />
                </div>
              </div>
            </q-form>

            <div class="row q-mt-md">
              <div class="col-12">
                <q-chip>
                  <q-avatar icon="person" color="primary" text-color="white" />
                  {{ this.cedulaPaciente }} {{ this.nombrePaciente }}
                </q-chip>
                <q-btn
                  label="Modificar paciente"
                  @click="onModificarPaciente"
                  color="primary"
                  v-if="this.nombrePaciente == null"
                  disable
                />
                <q-btn
                  label="Modificar paciente"
                  @click="onModificarPaciente"
                  color="primary"
                  v-else
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
                    <q-tr colspan="100%">
                      <q-td class="text-right">
                        Subtotal del paciente Bs.: {{ subtotalTablaBs }}
                      </q-td>
                      <q-td class="text-right">
                        Subtotal del paciente COP: {{ subtotalTablaPesos }}
                      </q-td>
                      <q-td class="text-right">
                        Subtotal del paciente $: {{ subtotalTablaDolares }}
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
                  row-key="cedulaPaciente"
                  no-data-label="No hay data disponible"
                >
                  <!-- SECCION BOTONES OPCIONES -->
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <!-- BOTON MODIFICAR PACIENTE -->
                      <q-btn
                        padding="md"
                        dense
                        round
                        flat
                        color="grey"
                        icon="edit"
                        @click="modificarPaciente(props.row.id_paciente)"
                      >
                      </q-btn>

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
                  @click="addPaciente(opt.row)"
                  icon="done"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
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

    <!-- MODAL FALTA TIPO DOCUMENTO -->
    <q-dialog
      v-model="faltaTipoDocumento"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">Falta el tipo de documento.</div>
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

    <!-- MODAL EXAMEN/CULTIVO YA EXISTE -->
    <q-dialog
      v-model="modalExiste"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row justify-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <div class="text-subtitle1 text-center q-px-xl">
            El examen o cultivo que desea agregar ya existe en la lista de
            examenes de este paciente
          </div>
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
      v-model="modalFaltaPaciente"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row justify-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">Recuerde agregar un paciente</div>
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

    <CrearPaciente
      v-if="modalPaciente"
      v-model="crear_paciente"
      :from="this.desde"
      :tipo_documento="this.tipoDocumento"
      :cedula_paciente="this.buscarCedula"
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
    let modalPaciente = ref(false);
    let pacienteNoExiste = ref(false);
    let pacienteYaExiste = ref(false);
    let examenNoExiste = ref(false);
    let modalExamenes = ref(false);
    let modalCultivos = ref(false);
    let modalPerfiles = ref(false);
    let modalPacientes = ref(false);
    let faltaTipoDocumento = ref(false);
    let modalExiste = ref(false);
    let modalFaltaPaciente = ref(false);
    //VARIABLES
    let nombre = ref(this.nombreCliente);
    let nombrePaciente = ref(null);
    let buscarCedula = ref(null);
    let cedulaPaciente = ref(null);
    let idP = ref(null);
    let buscar = ref(null);
    let tipoDocumento = ref(null);
    const rows = ref([]);
    let rows_examenes = ref([]);
    let rows_cultivos = ref([]);
    let rows_perfiles = ref([]);
    let rows_pacientes = ref([]);
    const selected = ref([]);
    const aux_pacientes = ref([]);
    const aux_examenes = ref([]);
    const aux_total = ref([]);
    let aux_examenes_cultivos = ref([]);
    let tipoDocumentoData = ref([]);
    const carga = ref(true);
    let totalDolares = 0;
    let seguro = ref(false);
    let desde = 0;
    let paciente = ref(null);
    let max_examenes = 0;
    let aux_cant_examenes = ref([]);

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
        align: "center",
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
        align: "center",
        label: "Nombre de perfil",
        field: "perfil_nombre",
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const columns_aux_pacientes = [
      {
        name: "cedula_paciente",
        required: true,
        label: "Cédula",
        align: "left",
        field: (row) => row.cedula_paciente,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "nombre_paciente",
        align: "center",
        label: "Nombre",
        field: "nombre_paciente",
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
      let esta = 0;

      console.log(
        "EL CODIGO A BUSCAR EN MAYUSCULAS",
        buscar.value.toUpperCase()
      );

      // ----!!!!!!!!! BUSCA EN EL AUX QUE TIENE TODOS LOS EXAMENES Y CULTIVOS !!!!!!!!----
      for (let i = 0; i < aux_examenes_cultivos.value.length; i++) {
        // BUSCA SI EL CODIGO QUE INGRESARON EXISTE
        if (
          aux_examenes_cultivos.value[i].examen_codigo ==
          buscar.value.toUpperCase()
        ) {
          console.log("ENCONTRO UN EXAMEN");

          // REVISA EN EL AUX DE EXAMENES REPETIDOS SI ESTA VACIO
          if (aux_cant_examenes.value.length == 0) {
            // SI ESTA VACIO ENTRA
            console.log("no tiene length");

            //AGREGA EL EXAMEN AL ARRAY DEL PACIENTE
            rows.value = [
              ...rows.value,
              {
                id_examen: aux_examenes_cultivos.value[i].id_examen,
                codigo: aux_examenes_cultivos.value[i].examen_codigo,
                nombre: aux_examenes_cultivos.value[i].examen_nombre,
                precio: aux_examenes_cultivos.value[i].examen_precio,
              },
            ];

            //AGREGA EL CODIGO DEL EXAMEN AL ARRAY QUE CUENTA CUANTOS EXAMENES
            //UNICOS HAY EN GENERAL Y PONE LA CANT EN 1 PORQUE ES EL PRIMERO QUE ENTRA
            aux_cant_examenes.value = [
              ...aux_cant_examenes.value,
              {
                id_examen: aux_examenes_cultivos.value[i].id_examen,
                codigo: aux_examenes_cultivos.value[i].examen_codigo,
                cant: 1,
              },
            ];

            console.log("la cant de ese examen ", aux_cant_examenes.value);
          } else {
            // EL AUX DE EXAMENES NO ESTA VACIO
            console.log("si tiene length", aux_cant_examenes.value.length);

            // REVISA EL AUX DE EXAMENES
            for (let j = 0; j < aux_cant_examenes.value.length; j++) {
              // REVISA SI EL EXAMEN QUE ESTAN METIENDO YA ESTA EN EL AUX DE EXAMENES
              if (
                aux_cant_examenes.value[j].id_examen ==
                aux_examenes_cultivos.value[i].id_examen
              ) {
                //if(aux_cant_examenes.valu)

                // SI ESTA PONE LA BANDERA EN 1
                console.log("esta en el array");
                esta = 1;

                // REVISA EL ARRAY DE EXAMENES DEL PACIENTE ACTUAL
                for (let k = 0; k < rows.value.length; k++) {
                  console.log(
                    "entro al for que revisa paciente examen",
                    aux_cant_examenes.value[j].id_examen,
                    rows.value[k].id_examen
                  );
                  // SI EL EXAMEN QUE QUIEREN METER YA EXISTE EN EL ARRAY
                  // DEL PACIENTE AVISA PORSI
                  if (
                    aux_cant_examenes.value[j].id_examen ==
                    rows.value[k].id_examen
                  ) {
                    console.log("entro al repetido");
                    this.modalExiste = true;

                    // Y LE SUMA UNO A LA CANT QUE HAY EN EL AUX DE EXAMENES UNICOS
                    aux_cant_examenes.value[j].cant =
                      aux_cant_examenes.value[j].cant + 1;

                    console.log(
                      "la cant de ese examen",
                      aux_cant_examenes.value[j]
                    );
                    break;
                  }
                }

                // AGREGA EL EXAMEN AL ARRAY DEL PACIENTE PERO NO LO CUENTA
                // EN EL AUX DE EXAMENES UNICOS
                rows.value = [
                  ...rows.value,
                  {
                    id_examen: aux_examenes_cultivos.value[i].id_examen,
                    codigo: aux_examenes_cultivos.value[i].examen_codigo,
                    nombre: aux_examenes_cultivos.value[i].examen_nombre,
                    precio: aux_examenes_cultivos.value[i].examen_precio,
                  },
                ];
              }
            }

            // REVISA SI NO ESTA EN EL AUX DE EXAMENES Y HAY MENOS DE 18
            // EXAMENES UNICOS
            if (esta == 0 && aux_cant_examenes.value.length < 18) {
              console.log("no esta en el array");

              // SI ES ASI LO AGREGA AL ARRAY DE EXAMENES DEL PACIENTE
              rows.value = [
                ...rows.value,
                {
                  id_examen: aux_examenes_cultivos.value[i].id_examen,
                  codigo: aux_examenes_cultivos.value[i].examen_codigo,
                  nombre: aux_examenes_cultivos.value[i].examen_nombre,
                  precio: aux_examenes_cultivos.value[i].examen_precio,
                },
              ];

              // LO METE EN EL AUX DE EXAMENES UNICOS Y LE PONE LA CANT EN 1
              aux_cant_examenes.value = [
                ...aux_cant_examenes.value,
                {
                  id_examen: aux_examenes_cultivos.value[i].id_examen,
                  codigo: aux_examenes_cultivos.value[i].examen_codigo,
                  cant: 1,
                },
              ];

              console.log("la cant de ese examen", aux_cant_examenes.value);
            }
          }

          // LA BARRA DE BUSQUEDA LO DEJA VACIO
          this.buscar = "";
          // Y CHAO
          break;

          ////////////////////////////////////////////////
        } else if (
          aux_examenes_cultivos.value[i].cultivo_codigo ==
          buscar.value.toUpperCase()
        ) {
          // REVISA EN EL AUX DE EXAMENES REPETIDOS SI ESTA VACIO
          if (aux_cant_examenes.value.length == 0) {
            // SI ESTA VACIO ENTRA
            console.log("no tiene length");

            //AGREGA EL EXAMEN AL ARRAY DEL PACIENTE
            rows.value = [
              ...rows.value,
              {
                id_cultivo: aux_examenes_cultivos.value[i].id_cultivo,
                codigo: aux_examenes_cultivos.value[i].cultivo_codigo,
                nombre: aux_examenes_cultivos.value[i].cultivo_nombre,
                precio: aux_examenes_cultivos.value[i].cultivo_precio,
              },
            ];

            //AGREGA EL CODIGO DEL EXAMEN AL ARRAY QUE CUENTA CUANTOS EXAMENES
            //UNICOS HAY EN GENERAL Y PONE LA CANT EN 1 PORQUE ES EL PRIMERO QUE ENTRA
            aux_cant_examenes.value = [
              ...aux_cant_examenes.value,
              {
                id_cultivo: aux_examenes_cultivos.value[i].id_cultivo,
                codigo: aux_examenes_cultivos.value[i].cultivo_codigo,
                cant: 1,
              },
            ];

            console.log("la cant de ese cultivo", aux_cant_examenes.value);
          } else {
            // EL AUX DE EXAMENES NO ESTA VACIO
            console.log("si tiene length", aux_cant_examenes.value.length);

            // REVISA EL AUX DE EXAMENES
            for (let j = 0; j < aux_cant_examenes.value.length; j++) {
              // REVISA SI EL CULTIVO QUE ESTAN METIENDO YA ESTA EN EL AUX DE EXAMENES
              if (
                aux_cant_examenes.value[j].id_cultivo ==
                aux_examenes_cultivos.value[i].id_cultivo
              ) {
                // SI ESTA PONE LA BANDERA EN 1
                console.log("esta en el array");
                esta = 1;

                // REVISA EL ARRAY DE EXAMENES DEL PACIENTE ACTUAL
                for (let k = 0; k < rows.value.length; k++) {
                  console.log(
                    "entro al for que revisa paciente cultivo",
                    aux_cant_examenes.value[j].id_cultivo,
                    rows.value[k].id_cultivo
                  );
                  // SI EL CULTIVO QUE QUIEREN METER YA EXISTE EN EL ARRAY
                  // DEL PACIENTE AVISA PORSI
                  if (
                    aux_cant_examenes.value[j].id_cultivo ==
                    rows.value[k].id_cultivo
                  ) {
                    console.log("entro al repetido");
                    this.modalExiste = true;

                    // Y LE SUMA UNO A LA CANT QUE HAY EN EL AUX DE EXAMENES UNICOS
                    aux_cant_examenes.value[j].cant =
                      aux_cant_examenes.value[j].cant + 1;

                    console.log(
                      "la cant de ese cultivo",
                      aux_cant_examenes.value[j]
                    );
                    break;
                  }
                }

                // AGREGA EL CULTIVO AL ARRAY DEL PACIENTE PERO NO LO CUENTA
                // EN EL AUX DE EXAMENES UNICOS
                rows.value = [
                  ...rows.value,
                  {
                    id_cultivo: aux_examenes_cultivos.value[i].id_cultivo,
                    codigo: aux_examenes_cultivos.value[i].cultivo_codigo,
                    nombre: aux_examenes_cultivos.value[i].cultivo_nombre,
                    precio: aux_examenes_cultivos.value[i].cultivo_precio,
                  },
                ];
              }
            }

            // REVISA SI NO ESTA EN EL AUX DE EXAMENES Y HAY MENOS DE 18
            // EXAMENES UNICOS
            if (esta == 0 && aux_cant_examenes.value.length < 18) {
              console.log("no esta en el array");

              // SI ES ASI LO AGREGA AL ARRAY DE EXAMENES DEL PACIENTE
              rows.value = [
                ...rows.value,
                {
                  id_cultivo: aux_examenes_cultivos.value[i].id_cultivo,
                  codigo: aux_examenes_cultivos.value[i].cultivo_codigo,
                  nombre: aux_examenes_cultivos.value[i].cultivo_nombre,
                  precio: aux_examenes_cultivos.value[i].cultivo_precio,
                },
              ];

              // LO METE EN EL AUX DE EXAMENES UNICOS Y LE PONE LA CANT EN 1
              aux_cant_examenes.value = [
                ...aux_cant_examenes.value,
                {
                  id_cultivo: aux_examenes_cultivos.value[i].id_cultivo,
                  codigo: aux_examenes_cultivos.value[i].cultivo_codigo,
                  cant: 1,
                },
              ];

              console.log("la cant de ese cultivo", aux_cant_examenes.value);
            }
          }

          // LA BARRA DE BUSQUEDA LO DEJA VACIO
          this.buscar = "";
          // Y CHAO
          break;

          ////////////////////////////////////////////////
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
      console.log(aux_cant_examenes.value);
      console.log("el lenght del aux", aux_cant_examenes.value.length);
      let esta = 0;

      // REVISA EN EL AUX DE EXAMENES REPETIDOS SI ESTA VACIO
      if (aux_cant_examenes.value.length == 0) {
        // SI ESTA VACIO ENTRA
        console.log("no tiene length");

        //AGREGA EL EXAMEN AL ARRAY DEL PACIENTE
        rows.value = [
          ...rows.value,
          {
            id_examen: examen_id,
            codigo: codigo_examen,
            nombre: nombre_examen,
            precio: precio_examen,
          },
        ];

        //AGREGA EL CODIGO DEL EXAMEN AL ARRAY QUE CUENTA CUANTOS EXAMENES
        //UNICOS HAY EN GENERAL Y PONE LA CANT EN 1 PORQUE ES EL PRIMERO QUE ENTRA
        aux_cant_examenes.value = [
          ...aux_cant_examenes.value,
          {
            id_examen: examen_id,
            codigo: codigo_examen,
            cant: 1,
          },
        ];

        console.log("la cant de ese examen", aux_cant_examenes.value);
      } else {
        // EL AUX DE EXAMENES NO ESTA VACIO
        console.log("si tiene length", aux_cant_examenes.value.length);

        // REVISA EL AUX DE EXAMENES
        for (let j = 0; j < aux_cant_examenes.value.length; j++) {
          // REVISA SI EL EXAMEN QUE ESTAN METIENDO YA ESTA EN EL AUX DE EXAMENES
          if (aux_cant_examenes.value[j].id_examen == examen_id) {
            //if(aux_cant_examenes.valu)

            // SI ESTA PONE LA BANDERA EN 1
            console.log("esta en el array");
            esta = 1;

            // REVISA EL ARRAY DE EXAMENES DEL PACIENTE ACTUAL
            for (let k = 0; k < rows.value.length; k++) {
              console.log(
                "entro al for que revisa paciente examen",
                aux_cant_examenes.value[j].id_examen,
                rows.value[k].id_examen
              );
              // SI EL EXAMEN QUE QUIEREN METER YA EXISTE EN EL ARRAY
              // DEL PACIENTE AVISA PORSI
              if (
                aux_cant_examenes.value[j].id_examen == rows.value[k].id_examen
              ) {
                console.log("entro al repetido");
                this.modalExiste = true;

                // Y LE SUMA UNO A LA CANT QUE HAY EN EL AUX DE EXAMENES UNICOS
                aux_cant_examenes.value[j].cant =
                  aux_cant_examenes.value[j].cant + 1;

                console.log(
                  "la cant de ese examen",
                  aux_cant_examenes.value[j]
                );
                break;
              }
            }

            // AGREGA EL EXAMEN AL ARRAY DEL PACIENTE PERO NO LO CUENTA
            // EN EL AUX DE EXAMENES UNICOS
            rows.value = [
              ...rows.value,
              {
                id_examen: examen_id,
                codigo: codigo_examen,
                nombre: nombre_examen,
                precio: precio_examen,
              },
            ];
          }
        }

        // REVISA SI NO ESTA EN EL AUX DE EXAMENES Y HAY MENOS DE 18
        // EXAMENES UNICOS
        if (esta == 0 && aux_cant_examenes.value.length < 18) {
          console.log("no esta en el array");

          // SI ES ASI LO AGREGA AL ARRAY DE EXAMENES DEL PACIENTE
          rows.value = [
            ...rows.value,
            {
              id_examen: examen_id,
              codigo: codigo_examen,
              nombre: nombre_examen,
              precio: precio_examen,
            },
          ];

          // LO METE EN EL AUX DE EXAMENES UNICOS Y LE PONE LA CANT EN 1
          aux_cant_examenes.value = [
            ...aux_cant_examenes.value,
            {
              id_examen: examen_id,
              codigo: codigo_examen,
              cant: 1,
            },
          ];

          console.log("la cant de ese examen", aux_cant_examenes.value);
        }
      }

      this.selected = [];
      this.filterExamenes = "";
      this.modalExamenes = false;
    };

    // AGREGA VARIOS EXAMENES A LA LISTA DE EXAMENES Y CULTIVOS //
    const addExamenes = (selected) => {
      console.log(aux_cant_examenes.value);
      console.log("el lenght del aux", aux_cant_examenes.value.length);
      let esta;

      for (let i = 0; i < selected.length; i++) {
        esta = 0;
        // REVISA EN EL AUX DE EXAMENES REPETIDOS SI ESTA VACIO
        if (aux_cant_examenes.value.length == 0) {
          // SI ESTA VACIO ENTRA
          console.log("no tiene length");

          //AGREGA EL EXAMEN AL ARRAY DEL PACIENTE
          rows.value = [
            ...rows.value,
            {
              id_examen: selected[i].id_examen,
              codigo: selected[i].examen_codigo,
              nombre: selected[i].examen_nombre,
              precio: selected[i].examen_precio,
            },
          ];

          //AGREGA EL CODIGO DEL EXAMEN AL ARRAY QUE CUENTA CUANTOS EXAMENES
          //UNICOS HAY EN GENERAL Y PONE LA CANT EN 1 PORQUE ES EL PRIMERO QUE ENTRA
          aux_cant_examenes.value = [
            ...aux_cant_examenes.value,
            {
              id_examen: selected[i].id_examen,
              codigo: selected[i].examen_codigo,
              cant: 1,
            },
          ];

          console.log("la cant de ese examen", aux_cant_examenes.value);
        } else {
          // EL AUX DE EXAMENES NO ESTA VACIO
          console.log("si tiene length", aux_cant_examenes.value.length);

          // REVISA EL AUX DE EXAMENES
          for (let j = 0; j < aux_cant_examenes.value.length; j++) {
            // REVISA SI EL EXAMEN QUE ESTAN METIENDO YA ESTA EN EL AUX DE EXAMENES
            if (aux_cant_examenes.value[j].id_examen == selected[i].id_examen) {
              //if(aux_cant_examenes.valu)

              // SI ESTA PONE LA BANDERA EN 1
              console.log("esta en el array");
              esta = 1;

              // REVISA EL ARRAY DE EXAMENES DEL PACIENTE ACTUAL
              for (let k = 0; k < rows.value.length; k++) {
                console.log(
                  "entro al for que revisa paciente examen",
                  aux_cant_examenes.value[j].id_examen,
                  rows.value[k].id_examen
                );
                // SI EL EXAMEN QUE QUIEREN METER YA EXISTE EN EL ARRAY
                // DEL PACIENTE AVISA PORSI
                if (
                  aux_cant_examenes.value[j].id_examen ==
                  rows.value[k].id_examen
                ) {
                  console.log("entro al repetido");
                  this.modalExiste = true;

                  // Y LE SUMA UNO A LA CANT QUE HAY EN EL AUX DE EXAMENES UNICOS
                  aux_cant_examenes.value[j].cant =
                    aux_cant_examenes.value[j].cant + 1;

                  console.log(
                    "la cant de ese examen",
                    aux_cant_examenes.value[j]
                  );
                  break;
                }
              }

              // AGREGA EL EXAMEN AL ARRAY DEL PACIENTE PERO NO LO CUENTA
              // EN EL AUX DE EXAMENES UNICOS
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
          }

          // REVISA SI NO ESTA EN EL AUX DE EXAMENES Y HAY MENOS DE 18
          // EXAMENES UNICOS
          if (esta == 0 && aux_cant_examenes.value.length < 18) {
            console.log("no esta en el array");

            // SI ES ASI LO AGREGA AL ARRAY DE EXAMENES DEL PACIENTE
            rows.value = [
              ...rows.value,
              {
                id_examen: selected[i].id_examen,
                codigo: selected[i].examen_codigo,
                nombre: selected[i].examen_nombre,
                precio: selected[i].examen_precio,
              },
            ];

            // LO METE EN EL AUX DE EXAMENES UNICOS Y LE PONE LA CANT EN 1
            aux_cant_examenes.value = [
              ...aux_cant_examenes.value,
              {
                id_examen: selected[i].id_examen,
                codigo: selected[i].examen_codigo,
                cant: 1,
              },
            ];

            console.log("la cant de ese examen", aux_cant_examenes.value);
          }
        }
      }

      this.selected = [];
      this.filterExamenes = "";
      this.modalExamenes = false;
    };

    // AGREGA UN SOLO CULTIVO A LA LISTA DE EXMANES Y CULTIVOS //
    const addCultivo = (
      cultivo_id,
      nombre_cultivo,
      precio_cultivo,
      codigo_cultivo
    ) => {
      console.log(aux_cant_examenes.value);
      console.log("el lenght del aux", aux_cant_examenes.value.length);
      let esta = 0;

      // REVISA EN EL AUX DE EXAMENES REPETIDOS SI ESTA VACIO
      if (aux_cant_examenes.value.length == 0) {
        // SI ESTA VACIO ENTRA
        console.log("no tiene length");

        //AGREGA EL EXAMEN AL ARRAY DEL PACIENTE
        rows.value = [
          ...rows.value,
          {
            id_cultivo: cultivo_id,
            codigo: codigo_cultivo,
            nombre: nombre_cultivo,
            precio: precio_cultivo,
          },
        ];

        //AGREGA EL CODIGO DEL EXAMEN AL ARRAY QUE CUENTA CUANTOS EXAMENES
        //UNICOS HAY EN GENERAL Y PONE LA CANT EN 1 PORQUE ES EL PRIMERO QUE ENTRA
        aux_cant_examenes.value = [
          ...aux_cant_examenes.value,
          {
            id_cultivo: cultivo_id,
            codigo: codigo_cultivo,
            cant: 1,
          },
        ];

        console.log("la cant de ese cultivo", aux_cant_examenes.value);
      } else {
        // EL AUX DE EXAMENES NO ESTA VACIO
        console.log("si tiene length", aux_cant_examenes.value.length);

        // REVISA EL AUX DE EXAMENES
        for (let j = 0; j < aux_cant_examenes.value.length; j++) {
          // REVISA SI EL EXAMEN QUE ESTAN METIENDO YA ESTA EN EL AUX DE EXAMENES
          if (aux_cant_examenes.value[j].id_cultivo == cultivo_id) {
            //if(aux_cant_examenes.valu)

            // SI ESTA PONE LA BANDERA EN 1
            console.log("esta en el array");
            esta = 1;

            // REVISA EL ARRAY DE EXAMENES DEL PACIENTE ACTUAL
            for (let k = 0; k < rows.value.length; k++) {
              console.log(
                "entro al for que revisa paciente examen",
                aux_cant_examenes.value[j].id_cultivo,
                rows.value[k].id_cultivo
              );
              // SI EL EXAMEN QUE QUIEREN METER YA EXISTE EN EL ARRAY
              // DEL PACIENTE AVISA PORSI
              if (
                aux_cant_examenes.value[j].id_cultivo ==
                rows.value[k].id_cultivo
              ) {
                console.log("entro al repetido");
                this.modalExiste = true;

                // Y LE SUMA UNO A LA CANT QUE HAY EN EL AUX DE EXAMENES UNICOS
                aux_cant_examenes.value[j].cant =
                  aux_cant_examenes.value[j].cant + 1;

                console.log(
                  "la cant de ese cultivo",
                  aux_cant_examenes.value[j]
                );
                break;
              }
            }

            // AGREGA EL EXAMEN AL ARRAY DEL PACIENTE PERO NO LO CUENTA
            // EN EL AUX DE EXAMENES UNICOS
            rows.value = [
              ...rows.value,
              {
                id_cultivo: cultivo_id,
                codigo: codigo_cultivo,
                nombre: nombre_cultivo,
                precio: precio_cultivo,
              },
            ];
          }
        }

        // REVISA SI NO ESTA EN EL AUX DE EXAMENES Y HAY MENOS DE 18
        // EXAMENES UNICOS
        if (esta == 0 && aux_cant_examenes.value.length < 18) {
          console.log("no esta en el array");

          // SI ES ASI LO AGREGA AL ARRAY DE EXAMENES DEL PACIENTE
          rows.value = [
            ...rows.value,
            {
              id_cultivo: cultivo_id,
              codigo: codigo_cultivo,
              nombre: nombre_cultivo,
              precio: precio_cultivo,
            },
          ];

          // LO METE EN EL AUX DE EXAMENES UNICOS Y LE PONE LA CANT EN 1
          aux_cant_examenes.value = [
            ...aux_cant_examenes.value,
            {
              id_cultivo: cultivo_id,
              codigo: codigo_cultivo,
              cant: 1,
            },
          ];

          console.log("la cant de ese cultivo", aux_cant_examenes.value);
        }
      }

      this.filterCultivos = "";
      this.selected = [];
      this.modalCultivos = false;
    };

    // AGREGA VARIOS CULTIVOS A LA LISTA DE EXAMENES Y CULTIVOS //
    const addCultivos = (selected) => {
      console.log(aux_cant_examenes.value);
      console.log("el lenght del aux", aux_cant_examenes.value.length);
      let esta;

      for (let i = 0; i < selected.length; i++) {
        esta = 0;
        // REVISA EN EL AUX DE EXAMENES REPETIDOS SI ESTA VACIO
        if (aux_cant_examenes.value.length == 0) {
          // SI ESTA VACIO ENTRA
          console.log("no tiene length");

          //AGREGA EL EXAMEN AL ARRAY DEL PACIENTE
          rows.value = [
            ...rows.value,
            {
              id_cultivo: selected[i].id_cultivo,
              codigo: selected[i].cultivo_codigo,
              nombre: selected[i].cultivo_nombre,
              precio: selected[i].cultivo_precio,
            },
          ];

          //AGREGA EL CODIGO DEL EXAMEN AL ARRAY QUE CUENTA CUANTOS EXAMENES
          //UNICOS HAY EN GENERAL Y PONE LA CANT EN 1 PORQUE ES EL PRIMERO QUE ENTRA
          aux_cant_examenes.value = [
            ...aux_cant_examenes.value,
            {
              id_cultivo: selected[i].id_cultivo,
              codigo: selected[i].cultivo_codigo,
              cant: 1,
            },
          ];

          console.log("la cant de ese cultivo", aux_cant_examenes.value);
        } else {
          // EL AUX DE EXAMENES NO ESTA VACIO
          console.log("si tiene length", aux_cant_examenes.value.length);

          // REVISA EL AUX DE EXAMENES
          for (let j = 0; j < aux_cant_examenes.value.length; j++) {
            // REVISA SI EL EXAMEN QUE ESTAN METIENDO YA ESTA EN EL AUX DE EXAMENES
            if (
              aux_cant_examenes.value[j].id_cultivo == selected[i].id_cultivo
            ) {
              //if(aux_cant_examenes.valu)

              // SI ESTA PONE LA BANDERA EN 1
              console.log("esta en el array");
              esta = 1;

              // REVISA EL ARRAY DE EXAMENES DEL PACIENTE ACTUAL
              for (let k = 0; k < rows.value.length; k++) {
                console.log(
                  "entro al for que revisa paciente cultivo",
                  aux_cant_examenes.value[j].id_cultivo,
                  rows.value[k].id_cultivo
                );
                // SI EL EXAMEN QUE QUIEREN METER YA EXISTE EN EL ARRAY
                // DEL PACIENTE AVISA PORSI
                if (
                  aux_cant_examenes.value[j].id_cultivo ==
                  rows.value[k].id_cultivo
                ) {
                  console.log("entro al repetido");
                  this.modalExiste = true;

                  // Y LE SUMA UNO A LA CANT QUE HAY EN EL AUX DE EXAMENES UNICOS
                  aux_cant_examenes.value[j].cant =
                    aux_cant_examenes.value[j].cant + 1;

                  console.log(
                    "la cant de ese cultivo",
                    aux_cant_examenes.value[j]
                  );
                  break;
                }
              }

              // AGREGA EL EXAMEN AL ARRAY DEL PACIENTE PERO NO LO CUENTA
              // EN EL AUX DE EXAMENES UNICOS
              rows.value = [
                ...rows.value,
                {
                  id_cultivo: selected[i].id_cultivo,
                  codigo: selected[i].cultivo_codigo,
                  nombre: selected[i].cultivo_nombre,
                  precio: selected[i].cultivo_precio,
                },
              ];
            }
          }

          // REVISA SI NO ESTA EN EL AUX DE EXAMENES Y HAY MENOS DE 18
          // EXAMENES UNICOS
          if (esta == 0 && aux_cant_examenes.value.length < 18) {
            console.log("no esta en el array");

            // SI ES ASI LO AGREGA AL ARRAY DE EXAMENES DEL PACIENTE
            rows.value = [
              ...rows.value,
              {
                id_cultivo: selected[i].id_cultivo,
                codigo: selected[i].cultivo_codigo,
                nombre: selected[i].cultivo_nombre,
                precio: selected[i].cultivo_precio,
              },
            ];

            // LO METE EN EL AUX DE EXAMENES UNICOS Y LE PONE LA CANT EN 1
            aux_cant_examenes.value = [
              ...aux_cant_examenes.value,
              {
                id_cultivo: selected[i].id_cultivo,
                codigo: selected[i].cultivo_codigo,
                cant: 1,
              },
            ];

            console.log("la cant de ese cultivo", aux_cant_examenes.value);
          }
        }
      }

      this.filterCultivos = "";
      this.selected = [];
      this.modalCultivos = false;
    };

    // ELIMINAR UN EXAMEN O CULTIVO//
    const deletePrueba = (codigo) => {
      let tamano = rows.value.length;
      for (let i = 0; i < tamano; i++) {
        console.log("entro al for de rows");
        if (rows.value[i].codigo == codigo) {
          var prueba = this.rows.splice(i, 1);
          console.log("LA ELIMINADA", prueba);
          break;
        }
      }

      for (let i = 0; i < aux_cant_examenes.value.length; i++) {
        console.log("entro al for de aux cant");
        if (codigo == aux_cant_examenes.value[i].codigo) {
          if (aux_cant_examenes.value[i].cant > 0) {
            aux_cant_examenes.value[i].cant =
              aux_cant_examenes.value[i].cant - 1;
            console.log("Como va?", aux_cant_examenes.value);
          }

          if (aux_cant_examenes.value[i].cant == 0) {
            var prueba = this.aux_cant_examenes.splice(i, 1);
            console.log("LA ELIMINADA", prueba);
            console.log("Como va?", aux_cant_examenes.value);
          }
          break;
        }
      }
    };

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
      rows_perfiles,
      rows_pacientes,
      columns,
      columns_examenes,
      columns_cultivos,
      columns_perfiles,
      columns_pacientes,
      columns_aux_pacientes,
      carga,
      selected,
      filterExamenes: ref(""),
      filterCultivos: ref(""),
      filterPerfiles: ref(""),
      filterPacientes: ref(""),
      addExamen,
      addExamenes,
      addCultivo,
      addCultivos,
      buscarExamenCultivo,
      modalExamenes,
      modalCultivos,
      modalPerfiles,
      modalPacientes,
      modalExiste,
      modalFaltaPaciente,
      aux_pacientes,
      aux_examenes,
      totalDolares,
      aux_total,
      crear_paciente,
      aux_examenes_cultivos,
      buscar,
      examenNoExiste,
      deletePrueba,
      dense: ref(true),
      existe: 0,
      tipoDocumento,
      tipoDocumentoData,
      subtotal: 0,
      totalTabla: 0,
      faltaTipoDocumento,
      seguro,
      desde,
      paciente,
      modalPaciente,
      getPacientes,
      max_examenes,
      aux_cant_examenes,
      yaPaso: 0,
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

    agregarPaciente() {
      this.modalPacientes = true;
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
      console.log("agrega", this.cedulaPaciente + " " + this.rows.length);
      if (this.cedulaPaciente != null && this.rows.length != 0) {
        /* REVISA SI EL PACIENTE EXISTE EN LA LISTA DE PACIENTES */
        for (let i = 0; i < this.aux_pacientes.length; i++) {
          // SI EXISTE LO MODIFICA
          if (this.idP == this.aux_pacientes[i].id_paciente) {
            console.log("el paciente existe en la lista");
            this.existe = 1;
            this.aux_pacientes[i].id_paciente = this.idP;
            this.aux_pacientes[i].cedula_paciente = this.cedulaPaciente;
            this.aux_pacientes[i].nombre_paciente = this.nombrePaciente;
            this.aux_pacientes[i].examenes = this.rows;
            this.totalDolares -= this.aux_pacientes[i].subtotal;

            for (let j = 0; j < this.rows.length; j++) {
              this.subtotal += this.rows[j].precio;
            }
            console.log(
              "el subtotal del paciente y el total",
              this.subtotal,
              this.totalDolares
            );
            this.aux_pacientes[i].subtotal = this.subtotal;
            this.totalDolares += this.aux_pacientes[i].subtotal;
            this.subtotal = 0;
          }
        }

        // SI NO EXISTE LO AÑADE A LA LISTA
        if (this.existe == 0) {
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
            this.subtotal += this.rows[i].precio;
            this.totalDolares += this.rows[i].precio;
          }

          this.aux_pacientes.push({
            id_paciente: this.idP,
            nombre_paciente: this.nombrePaciente,
            cedula_paciente: this.cedulaPaciente,
            examenes: this.aux_examenes,
            subtotal: this.subtotal,
          });
        }

        console.log(this.subtotal);

        // VACIA LOS DATOS DEL PACIENTE
        this.existe = 0;
        this.aux_examenes = [];
        this.nombrePaciente = null;
        this.cedulaPaciente = null;
        this.buscarCedula = null;
        this.rows = [];
        this.subtotal = 0;

        console.log(this.aux_pacientes);
        console.log(this.totalDolares);
      } else {
        console.log("PACIENTE NULO");
      }
    },

    // ELIMINAR UN PACIENTE DE LA LISTA //
    deletePaciente(id) {
      for (let i = 0; i < this.aux_pacientes.length; i++) {
        if (this.aux_pacientes[i].id_paciente == id) {
          this.totalDolares -= this.aux_pacientes[i].subtotal;
          let paciente = this.aux_pacientes.splice(i, 1);
          console.log("LA ELIMINADA", paciente);
          console.log(this.aux_pacientes);
          break;
        }
      }
    },

    modificarPaciente(pacienteId) {
      console.log("el id del paciente a sacar", pacienteId, this.idP);
      // SIEMPRE Y CUANDO EL PACIENTE EXISTA
      if (this.cedulaPaciente != null) {
        // REVISA SI EL PACIENTE A GUARDAR YA EXISTE EN LA LISTA
        for (let i = 0; i < this.aux_pacientes.length; i++) {
          // Y SI LO ENCUENTRA LO MODIFICA
          if (this.idP == this.aux_pacientes[i].id_paciente) {
            console.log("el paciente existe en la lista");
            this.existe = 1;
            this.aux_pacientes[i].id_paciente = this.idP;
            this.aux_pacientes[i].cedula_paciente = this.cedulaPaciente;
            this.aux_pacientes[i].nombre_paciente = this.nombrePaciente;
            this.aux_pacientes[i].examenes = this.rows;
            this.totalDolares -= this.aux_pacientes[i].subtotal;

            for (let j = 0; j < this.rows.length; j++) {
              this.subtotal += this.rows[j].precio;
            }
            this.aux_pacientes[i].subtotal = this.subtotal;
            this.totalDolares += this.aux_pacientes[i].subtotal;
            this.subtotal = 0;
          }
        }

        if (this.existe == 0) {
          console.log("el paciente no existe en la lista");
          // SI NO LO ENCUENTRA LO AÑADE A LA LISTA
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

            this.subtotal += this.rows[i].precio;
            this.totalDolares += this.rows[i].precio;
          }

          this.aux_pacientes.push({
            id_paciente: this.idP,
            nombre_paciente: this.nombrePaciente,
            cedula_paciente: this.cedulaPaciente,
            examenes: this.aux_examenes,
            subtotal: this.subtotal,
          });
        }
      }

      // REVISA EN EL VECTOR DE LOS PACIENTES SI EL ID QUE ESTOY BUSCANDO EXISTE
      // Y LO PASA AL OTRO LADO A MODIFICAR
      for (let i = 0; i < this.aux_pacientes.length; i++) {
        if (pacienteId == this.aux_pacientes[i].id_paciente) {
          console.log("el id del paciente a sacar", pacienteId);
          console.log("PASO EL PACIENTE DE LA LISTA");
          this.idP = this.aux_pacientes[i].id_paciente;
          this.cedulaPaciente = this.aux_pacientes[i].cedula_paciente;
          this.nombrePaciente = this.aux_pacientes[i].nombre_paciente;
          this.rows = this.aux_pacientes[i].examenes;
        }
      }

      this.existe = 0;
      this.subtotal = 0;
    },

    crearPaciente() {
      this.crear_paciente = true;
      this.modalPaciente = true;
      this.desde = 1;
    },

    // SE TRAE LA INFORMACION DEL PACIENTE NUEVO DESDE EL MODAL Y LO ASIGNA A LOS CAMPOS DE LA VISTA
    onCrearPaciente(e) {
      console.log("LO QUE SE TRAE DEL PACIENTE NUEVO", e);
      this.paciente = e;
      this.idP = e.id_paciente;
      this.nombrePaciente = e.paciente_nombre + " " + e.paciente_apellido;
      this.cedulaPaciente = e.paciente_cedula;
      this.tipoDocumento = "";
      this.buscarCedula = "";
      this.pacienteNoExiste = false;
      this.crear_paciente = false;
      this.modalPaciente = false;
    },

    onModificarPaciente() {
      this.crear_paciente = true;
      this.modalPaciente = true;
      this.desde = 2;
    },

    onCancelarPaciente(e) {
      console.log("el response de cancelar paciente", e);
      this.pacienteNoExiste = false;
      this.crear_paciente = false;
    },

    // ENVIA LOS PACIENTES, SUS EXAMENES/CULTIVOS Y LOS TOTALES AL PADRE
    onFinalizar() {
      if (
        (this.cedulaPaciente != null && this.rows.length != 0) ||
        this.aux_pacientes.length != 0
      ) {
        console.log("el total", this.totalDolares);
        /* REVISA SI EL PACIENTE QUE TIENE EN EL MODAL EXISTE EN LA LISTA DE PACIENTES */
        for (let i = 0; i < this.aux_pacientes.length; i++) {
          // SI EXISTE LO MODIFICA
          if (this.idP == this.aux_pacientes[i].id_paciente) {
            if (this.cedulaPaciente != null) {
              this.aux_pacientes[i].id_paciente = this.idP;
              this.aux_pacientes[i].cedula_paciente = this.cedulaPaciente;
              this.aux_pacientes[i].nombre_paciente = this.nombrePaciente;
              this.aux_pacientes[i].examenes = this.rows;
            }
            console.log("el paciente existe en la lista");
            this.existe = 1;
          }
        }
        console.log("el aux_paciente", this.aux_pacientes, this.existe);

        // SI NO EXISTE LO AÑADE A LA LISTA
        if (this.existe == 0) {
          console.log("envia", this.cedulaPaciente + " " + this.rows.length);
          for (let i = 0; i < this.rows.length; i++) {
            console.log("el total", this.totalDolares);
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

            //this.totalDolares += this.rows[i].precio;
          }

          this.aux_pacientes.push({
            id_paciente: this.idP,
            nombre_paciente: this.nombrePaciente,
            cedula_paciente: this.cedulaPaciente,
            examenes: this.aux_examenes,
          });
        }

        this.totalDolares = 0;
        for (let i = 0; i < this.aux_pacientes.length; i++) {
          let actual = this.aux_pacientes[i];
          for (let j = 0; j < actual.examenes.length; j++) {
            this.totalDolares = this.totalDolares + actual.examenes[j].precio;
          }
        }
        console.log("EL TOTAL DOLARES FINAL", this.totalDolares);

        if (this.yaPaso == 0) {
          this.yaPaso = 1;
          this.aux_total.push({
            total_dolares: this.totalDolares,
            pacientes: this.aux_pacientes,
            seguro: this.seguro,
            agregado: 1,
          });
        } else if (this.yaPaso == 1) {
          this.aux_total = [];
          this.aux_total.push({
            total_dolares: this.totalDolares,
            pacientes: this.aux_pacientes,
            seguro: this.seguro,
            agregado: 1,
          });
        }

        console.log("este es el aux_total", this.aux_total);
        this.$emit("finalizarPacientes", this.aux_total);

        this.aux_examenes = [];
        this.nombrePaciente = null;
        this.cedulaPaciente = null;
        this.buscarCedula = null;
        this.rows = [];
      } else {
        console.log("PACIENTE NULO");
        this.modalFaltaPaciente = true;
      }
    },

    async addPaciente(paciente) {
      console.log("el pacienteee", paciente);
      let cedula = paciente.paciente_cedula;
      //ESTO DEBERIA HACERLO SOLO LA PRIMERA VEZ QUE ENTRA //
      if (this.aux_pacientes.length == 0) {
        console.log("ENTRO LA PRIMERA VEZ");

        console.log(paciente);

        console.log("EL PACIENTE EXISTE");
        this.paciente = paciente;
        console.log("el pasadito paciente", this.paciente);
        this.nombrePaciente =
          this.paciente.paciente_nombre + " " + this.paciente.paciente_apellido;
        this.cedulaPaciente = this.paciente.paciente_cedula;
        this.idP = this.paciente.id_paciente;
        this.buscarCedula = null;
        this.tipoDocumento = null;
        this.modalPacientes = false;
        console.log(this.nombrePaciente);
        console.log(this.cedulaPaciente);
      }

      // PASA POR TODOS LOS PACIENTES AGREGADOS //
      for (let i = 0; i < this.aux_pacientes.length; i++) {
        console.log("entro al for");

        // COMPRUEBA SI EL PACIENTE YA FUE AGREGADO //
        if (
          this.aux_pacientes[i].cedula_paciente ==
          this.tipoDocumento + this.buscarCedula
        ) {
          // YA FUE AGREGADO //
          console.log("PACIENTE ESTA REPETIDO");
          this.pacienteYaExiste = true;
          break;
        } else {
          console.log("no ta repetido", cedula);

          // NO HA SIDO AGREGADO //
          let paciente = {
            paciente_cedula: cedula,
          };

          let datos = await axios.post(
            this.ip + "buscarPacientePorCedula",
            paciente
          );

          console.log(datos);
          console.log(datos.data);

          if (datos.data == "0") {
            console.log("EL PACIENTE NO EXISTE");
            this.pacienteNoExiste = true;
          } else {
            console.log("EL PACIENTE EXISTE");
            this.paciente = datos.data[0];
            console.log("el pasadito paciente", this.paciente);
            this.nombrePaciente =
              this.paciente.paciente_nombre +
              " " +
              this.paciente.paciente_apellido;
            this.cedulaPaciente = this.paciente.paciente_cedula;
            this.idP = this.paciente.id_paciente;
            this.buscarCedula = null;
            this.tipoDocumento = null;
            this.modalPacientes = false;
            console.log(this.nombrePaciente);
            console.log(this.cedulaPaciente);
          }
          break;
        }
      }
    },

    // COMPROBAR Y RETORNAR PACIENTE //
    async buscarPaciente() {
      console.log("entro a buscar paciente");
      console.log(this.aux_pacientes);
      console.log(this.tipoDocumento);
      console.log(this.buscarCedula);

      if (this.tipoDocumento == null) {
        this.faltaTipoDocumento = true;
      } else {
        //ESTO DEBERIA HACERLO SOLO LA PRIMERA VEZ QUE ENTRA //
        if (this.aux_pacientes.length == 0) {
          console.log("ENTRO LA PRIMERA VEZ");

          let paciente = {
            paciente_cedula: this.tipoDocumento + this.buscarCedula,
          };

          console.log(paciente);

          let datos = await axios.post(
            this.ip + "buscarPacientePorCedula",
            paciente
          );

          console.log(datos);
          console.log(datos.data);

          if (datos.data == "0") {
            console.log("EL PACIENTE NO EXISTE");
            this.pacienteNoExiste = true;
          } else {
            console.log("EL PACIENTE EXISTE");
            this.paciente = datos.data[0];
            console.log("el pasadito paciente", this.paciente);
            this.nombrePaciente =
              datos.data[0].paciente_nombre +
              " " +
              datos.data[0].paciente_apellido;
            this.cedulaPaciente = datos.data[0].paciente_cedula;
            this.idP = datos.data[0].id_paciente;
            this.buscarCedula = null;
            this.tipoDocumento = null;
            console.log(this.nombrePaciente);
            console.log(this.cedulaPaciente);
          }
        }

        // PASA POR TODOS LOS PACIENTES AGREGADOS //
        for (let i = 0; i < this.aux_pacientes.length; i++) {
          console.log("entro al for");

          // COMPRUEBA SI EL PACIENTE YA FUE AGREGADO //
          if (
            this.aux_pacientes[i].cedula_paciente ==
            this.tipoDocumento + this.buscarCedula
          ) {
            // YA FUE AGREGADO //
            console.log("PACIENTE ESTA REPETIDO");
            this.pacienteYaExiste = true;
            break;
          } else {
            console.log("no ta repetido");
            // NO HA SIDO AGREGADO //
            let paciente = {
              paciente_cedula: this.tipoDocumento + this.buscarCedula,
            };

            let datos = await axios.post(
              this.ip + "buscarPacientePorCedula",
              paciente
            );

            console.log(datos);
            console.log(datos.data);

            if (datos.data == "0") {
              console.log("EL PACIENTE NO EXISTE");
              this.pacienteNoExiste = true;
            } else {
              console.log("EL PACIENTE EXISTE");
              this.paciente = datos.data[0];
              console.log("el pasadito paciente", this.paciente);
              this.nombrePaciente =
                datos.data[0].paciente_nombre +
                " " +
                datos.data[0].paciente_apellido;
              this.cedulaPaciente = datos.data[0].paciente_cedula;
              this.idP = datos.data[0].id_paciente;
              this.buscarCedula = null;
              this.tipoDocumento = null;
              console.log(this.nombrePaciente);
              console.log(this.cedulaPaciente);
            }
            break;
          }
        }
      }
    },

    // SE TRAE LOS TIPOS DE DOCUMENTOS
    async getDocumentos() {
      let datos = await axios.get(this.ip + "documentos");
      console.log("LOS DOCUMENTOS en facturacion", datos.data);
      this.tipoDocumentoData = datos.data;
    },
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
      } else {
        return "ORDEN DE TRABAJO";
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

  created() {
    this.getDocumentos();
    this.getPacientes();
  },
};
</script>
