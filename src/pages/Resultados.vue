<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-end">
      <div class="col-9 q-pl-xl">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey-7 cards"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="examenes" label="Examenes" />
            <template v-if="this.rows_cultivos.length == 0">
              <q-tab
                name="cultivos"
                label="Cultivos"
                v-if="
                  id_usuario == 21 ||
                  id_usuario == 6 ||
                  id_usuario == 17 ||
                  id_usuario == 18 ||
                  id_usuario == 1 ||
                  id_usuario == 8 ||
                  id_usuario == 5 ||
                  id_usuario == 22 ||
                  id_usuario == 2 ||
                  id_usuario == 3||
                  id_usuario == 24
                "
              />
            </template>
            <template v-else>
              <q-tab
                name="cultivos"
                label="Cultivos"
                style="background-color: red; color: white"
                v-if="
                  id_usuario == 21 ||
                  id_usuario == 6 ||
                  id_usuario == 17 ||
                  id_usuario == 18 ||
                  id_usuario == 1 ||
                  id_usuario == 8 ||
                  id_usuario == 5 ||
                  id_usuario == 22 ||
                  id_usuario == 2 ||
                  id_usuario == 3||
                  id_usuario == 24
                "
              />
            </template>
          </q-tabs>
        </q-card>

        <q-separator />

        <q-tab-panels v-model="tab" animated class="cards">
          <!-- MODAL EXAMENES RESULTADOS -->
          <ResultadosExamenes
            v-if="
              id_usuario == 3 ||
              id_usuario == 6 ||
              id_usuario == 17 ||
              id_usuario == 21 ||
              id_usuario == 1 ||
              id_usuario == 8 ||
              id_usuario == 22 ||
              id_usuario == 5 ||
              id_usuario == 24
            "
            name="examenes"
            :rows="this.rows_examenes"
            :paciente="this.paciente"
            :numeroOrden="this.orden_numero"
            :fecha="this.fecha_orden"
            :qr="this.qr"
            :loading="loading"
          >
          </ResultadosExamenes>

          <!-- MODAL SUEROS -->
          <Sueros
            v-if="id_usuario == 2"
            name="examenes"
            :rows="this.rows_examenes"
            :loading="loading"
          >
          </Sueros>

          <q-tab-panel name="cultivos" class="q-pa-none">
            <div class="col-12">
              <q-table
                :rows="rows_cultivos"
                :columns="columns_cultivos"
                row-key="cultivo_nombre"
                :loading="loading"
                :pagination="initialPagination"
                hide-bottom
              >
                <!-- SECCION BOTONES OPCIONES -->
                <template
                  v-slot:body-cell-actions="props"
                  v-if="
                    id_usuario == 6 ||
                    id_usuario == 17 ||
                    id_usuario == 18 ||
                    id_usuario == 21 ||
                    id_usuario == 1 ||
                    id_usuario == 8 ||
                    id_usuario == 5
                  "
                >
                  <q-td :props="props">
                    <!-- BOTON MODIFICAR EXAMEN -->
                    <router-link
                      :to="{
                        name: 'ResultadosCultivos',
                        params: {
                          id_cultivo: props.row.id_cultivo,
                          id_orden: this.idOrden,
                          id_factura: this.idFactura,
                          numeroOrden: this.orden_numero,
                          fecha: this.fecha_orden,
                          detalles_orden: JSON.stringify(this.detalles_orden),
                          from: this.from,
                          cultivo: JSON.stringify(props.row),
                          paciente: JSON.stringify(this.paciente),
                          qr: this.qr,
                        },
                      }"
                    >
                      <q-btn
                        dense
                        class="q-px-sm"
                        color="primary"
                        label="Agregar resultados"
                      >
                      </q-btn>
                    </router-link>
                    <q-btn
                      dense
                      class="q-px-sm q-ml-md"
                      color="grey"
                      label="Montar cultivo"
                      @click="onMontarCultivo(props.row.id_detalle_orden)"
                      v-if="props.row.cultivo_montado == 0"
                    >
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <q-page-sticky position="top-left" class="q-mt-md">
      <q-card style="width: 28vw" class="cards">
        <q-card-section>
          <div class="row">
            <div class="col">
              <div class="text-h6">
                {{ this.paciente.paciente_nombre }}
                {{ this.paciente.paciente_apellido }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="text-subtitle2">
                Orden: {{ this.detalles_orden.numero_orden }}
              </div>
            </div>
            <div class="col-12">
              <div class="text-subtitle2">
                Fecha: {{ this.detalles_orden.fecha }}
              </div>
            </div>
            <div class="col-12">
              <div class="text-subtitle2">
                {{ this.paciente.paciente_cedula }}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="text-subtitle2">
                {{ this.paciente.edad }},
                {{ this.paciente.genero === 2 ? "Masculino" : "Femenino" }}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="text-subtitle2">
                Telf:
                <span
                  v-if="
                    this.paciente.paciente_telefono == 'null' ||
                    this.paciente.paciente_telefono == null
                  "
                >
                  No posee
                </span>
                <span v-else>{{ this.paciente.paciente_telefono }}</span>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 text-subtitle2">Patologias</div>
            <div class="col-12">
              {{
                this.paciente.patologias == null
                  ? "No posee"
                  : this.paciente.patologias
              }}
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 text-subtitle2">Observaciones</div>
            <div class="col-12">
              {{ this.paciente.peso == null ? "No posee" : this.paciente.peso }}
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 text-subtitle2">Medicamentos</div>
            <div class="col-12">
              {{
                this.paciente.medicamentos == null
                  ? "No posee"
                  : this.paciente.medicamentos
              }}
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row">
        <div class="col-11 q-ml-xs text-right">
          <q-btn
            unelevated
            label="Volver"
            color="primary"
            class="q-mt-md"
            @click="volver()"
          />
          <q-btn
            unelevated
            label="Verificar"
            color="primary"
            class="q-mt-md q-ml-md"
            @click="checkOrden()"
            v-if="this.id_usuario == 2"
          />
        </div>

        <div
          class="col-11 q-ml-xs text-right"
          v-if="
            this.id_usuario == 2 ||
            this.id_usuario == 6 ||
            this.id_usuario == 17 ||
            this.id_usuario == 1 ||
            this.id_usuario == 5
          "
        >
          <q-btn
            unelevated
            label="Imprimir etiquetas"
            color="primary"
            class="q-mt-md"
            @click="this.modalImpresion = true"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-11 q-ml-xs text-right">
          <q-btn
            unelevated
            label="Modificar paciente"
            color="primary"
            class="q-mt-md q-ml-md"
            @click="onModificarPaciente()"
          />
        </div>
      </div>
    </q-page-sticky>

    <!-- MODAL DE IMPRESION DE ETIQUETAS -->
    <q-dialog
      v-model="modalImpresion"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <div class="col-12 text-subtitle1 text-center">
            ¿Cuantas etiquetas desea imprimir?
            <q-input
              v-model="cantOrdenes"
              label="Cant. de etiquetas"
              class="q-mt-sm"
            />
          </div>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- CANCELAR -->
          <q-btn
            unelevated
            label="Cancelar"
            flat
            color="grey-9"
            class="q-mr-md"
            v-close-popup
          />
          <!-- ENVIAR -->
          <q-btn
            label="Imprimir"
            color="primary"
            class="q-mr-md"
            @click="imprimirEtiquetas()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="modalError"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <div class="col-12 text-subtitle1 text-center">Ocurrio un error</div>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- CANCELAR -->
          <q-btn
            unelevated
            label="Cancelar"
            flat
            color="grey-9"
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
      :tipo_documento="this.tipo_documento"
      :cedula_paciente="this.cedula_paciente"
      :paciente="JSON.stringify(this.paciente)"
      @crearPaciente="onCrearPaciente"
      @cancelarPaciente="onCancelarPaciente"
    >
    </CrearPaciente>
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
import ResultadosExamenes from "../components/ResultadosExamenes.vue";
import Sueros from "../components/Sueros.vue";
import CrearPaciente from "../components/CrearPacienteFacturacion.vue";

export default {
  props: ["idOrden", "idFactura", "idRC", "orden", "fecha", "from"],

  components: {
    ResultadosExamenes,
    Sueros,
    CrearPaciente,
  },

  data() {
    let rows_examenes = ref([]);
    let rows_cultivos = ref([]);
    let paciente = ref([]);
    let loading = ref(true);
    let id_usuario = parseInt(localStorage.rol);
    let resultados_cultivos = ref([]);
    let modalImpresion = ref(false);
    let modalError = ref(false);
    let modalPaciente = ref(false);
    let crear_paciente = ref(false);
    let cantOrdenes = 0;
    let rol = parseInt(localStorage.rol);
    let acceso = ref(null);
    let detalles_orden = ref({});
    let fecha_orden = ref(null);
    let orden_numero = ref(null);
    let qr = ref(null);
    let desde = 3;
    let tipo_documento = ref(null);
    let cedula_paciente = ref(null);

    const ip = process.env.BASE_URL;

    let columns_cultivos = [
      {
        name: "cultivo_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => {
          if(row.cultivo_nombre_especifico==null){
            return row.cultivo_nombre
          }else{
            return row.cultivo_nombre_especifico
          }
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    return {
      initialPagination: {
        page: 1,
        rowsPerPage: 0,
        // rowsNumber: xx if getting data from a server
      },
      ip,
      rows_examenes,
      rows_cultivos,
      columns_cultivos,
      paciente,
      loading,
      tab: ref("examenes"),
      id_usuario,
      resultados_cultivos,
      modalImpresion,
      modalPaciente,
      cantOrdenes,
      rol,
      acceso,
      modalError,
      detalles_orden,
      fecha_orden,
      orden_numero,
      qr,
      desde,
      tipo_documento,
      cedula_paciente,
      crear_paciente,
    };
  },

  methods: {
    onModificarPaciente() {
      this.crear_paciente = true;
      this.modalPaciente = true;
    },

    onCrearPaciente(e) {
      console.log("LO QUE SE TRAE DEL PACIENTE NUEVO", e);
      this.paciente = e;
      this.crear_paciente = false;
      this.modalPaciente = false;
    },

    onCancelarPaciente(e) {
      console.log("el response de cancelar paciente", e);
      this.crear_paciente = false;
      this.modalPaciente = false;
    },

    onMontarCultivo(id) {
      let enviar = {
        id_detalle_orden: id,
      };

      axios
        .post(this.ip + "habilitarCultivoMontado", enviar)
        .then((response) => {
          console.log("EL RESPONSE", response.data);
          this.$router.go();
        });
    },

    imprimirEtiquetas() {
      console.log(this.orden);
      let impresion = {
        id_orden: parseInt(this.idOrden),
        id_factura: parseInt(this.idFactura),
        id_registro_convenio: parseInt(this.idRC),
        orden_numero: parseInt(this.detalles_orden.numero_orden),
        paciente_nombre:
          this.paciente.paciente_nombre + " " + this.paciente.paciente_apellido,
        paciente_cedula: this.paciente.paciente_cedula,
        paciente_edad: this.paciente.edad,
        copias: parseInt(this.cantOrdenes),
      };

      console.log(impresion);

      axios.post(this.ip + "impresionDeOrdenes", impresion).then((response) => {
        console.log("EL RESPONSE", response.data);
        if (response.data == 1) {
          this.modalImpresion = false;
          this.cantOrdenes = 0;
        } else {
          this.modalError = true;
          this.cantOrdenes = 0;
        }
      });
    },

    getCampos() {
      console.log("se fue a buscar la orden", this.idOrden);
      console.log(this.id_usuario);

      let orden = {
        id_orden: parseInt(this.idOrden),
        id_factura: parseInt(this.idFactura),
      };

      console.log(orden);

      axios.post(this.ip + "buscarOrden", orden).then((response) => {
        console.log("EL RESPONSE!!!", response.data);
        //console.log("EL RESPONSE departamentos", response.data.departamentos);
        this.rows_examenes = response.data.departamentos;
        this.rows_cultivos = response.data.cultivos;
        this.paciente = response.data.paciente[0];

        let cedula = this.paciente.paciente_cedula.split("-");
        console.log("la celula", cedula);
        this.tipo_documento = cedula[0];
        this.cedula_paciente = cedula[1];
        this.resultados_cultivos = response.data.cultivosRes;
        this.detalles_orden = response.data.detalle_orden;
        this.fecha_orden = response.data.detalle_orden.fecha;
        this.orden_numero = response.data.detalle_orden.numero_orden;
        this.qr = response.data.detalle_orden.orden_qr_nube;
        this.loading = false;
        let depas = this.rows_examenes;
        let cultivos = this.rows_cultivos;
        let exameness;
        let pruebass;
        console.log(this.rows_cultivos);

        for (let i = 0; i < depas.length; i++) {
          //console.log("LA CUENTA DE DEPAS");
          exameness = depas[i].examenes;
          for (let j = 0; j < exameness.length; j++) {
            //console.log("LOS EXAMENES DEL DEPA");
            pruebass = exameness[j].examen.pruebas;

            // GENERA EL CHECK DE IMPRESION, SIEMPRE FALSO
            this.rows_examenes[i].examenes[j].examen["imprimir"] = false;

            // GENERA EL CHECK DE LA FIRMA DE USUARIO
            if (exameness[j].examen.id_usuario == null) {
              this.rows_examenes[i].examenes[j].examen["check"] = false;
            } else {
              this.rows_examenes[i].examenes[j].examen["check"] = true;
            }
          }
        }

        for (let i = 0; i < cultivos.length; i++) {
          if (cultivos[i].id_usuario == null) {
            this.rows_cultivos[i]["check"] = false;
          } else {
            this.rows_cultivos[i]["check"] = true;
          }
        }

        console.log(this.rows_examenes);
      });
    },

    volver() {
      this.$router.back();
    },

    checkOrden() {
      let orden = {
        id_orden: this.idOrden,
      };
      console.log("la orden", orden);
      //1 VERIFICAR DESDE TOMA DE MUESTRA
      //2 VERIFICAR DESDE SUEROS
      if (this.from == 1) {
        axios
          .post(this.ip + "verificarTomaMuestra", orden)
          .then((response) => {
            console.log("EL RESPONSE", response.data);
          })
          .finally(() => {
            this.$router.back();
          });
      } else if (this.from == 2) {
        axios
          .post(this.ip + "verificarSueros", orden)
          .then((response) => {
            console.log("EL RESPONSE", response.data);
          })
          .finally(() => {
            this.$router.back();
          });
      }
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 11,
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
    this.getCampos();
    console.log(this.id_usuario);
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
