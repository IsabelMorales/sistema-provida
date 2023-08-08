<template>
  <q-tab-panel class="q-pa-none">
    <div class="fit row justify-end" v-if="this.acceso == 1">
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
                {{ col.label }} {{ this.getRows }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <template
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                <q-td
                  auto-width
                  v-if="this.glicosilada == true && col.value == 'HEMATOLOGIA'"
                  style="background-color: #02569c"
                >
                  <q-btn
                    size="sm"
                    color="primary"
                    round
                    dense
                    @click="props.expand = !props.expand"
                    :icon="props.expand ? 'remove' : 'add'"
                  />
                </q-td>
                <q-td auto-width v-else>
                  <q-btn
                    size="sm"
                    color="primary"
                    round
                    dense
                    @click="props.expand = !props.expand"
                    :icon="props.expand ? 'remove' : 'add'"
                  />
                </q-td>
                <q-td
                  v-if="this.glicosilada == true && col.value == 'HEMATOLOGIA'"
                  style="
                    background-color: #02569c;
                    color: white;
                    font-weight: 600;
                  "
                >
                  {{ col.value }}
                </q-td>
                <q-td v-else> {{ col.value }} </q-td>
              </template>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <div
                    class="row q-mb-md"
                    v-for="examn in props.row.examenes"
                    :key="examn.id_examen"
                  >
                    <div class="col-8 text-h5">
                      <q-checkbox
                        v-model="examn.examen.imprimir"
                        v-if="!examn.examen.check"
                        dense
                        disable
                      />
                      <q-checkbox
                        v-model="examn.examen.imprimir"
                        @update:model-value="
                          addExamenImpresion(
                            examn.examen,
                            examn.examen.id_examen,
                            props.row.departamento_nombre,
                            examn.examen.imprimir,
                            examn.examen.id_usuario
                          )
                        "
                        v-if="examn.examen.check"
                        dense
                      />

                      {{ examn.examen.examen_nombre }}
                    </div>
                    <div
                      class="col-4 text-right text-body1 q-pr-md"
                      v-if="
                        this.rol == 3 ||
                        this.rol == 6 ||
                        this.rol == 21 ||
                        this.rol == 24||
                        this.rol == 1||
                        this.rol == 8||
                        this.rol == 23
                      "
                    >
                      <q-checkbox
                        left-label
                        v-if="examn.examen.id_usuario != null"
                        v-model="examn.examen.check"
                        label="Firmar"
                        disable
                      />
                      <q-checkbox
                        left-label
                        v-else
                        v-model="examn.examen.check"
                        label="Firmar"
                        @update:model-value="addUsuario(examn.examen)"
                      />
                    </div>
                    <div class="col-12 q-mt-sm">
                      <div
                        class="row q-mb-md"
                        v-for="prueba in examn.examen.pruebas"
                        :key="prueba.id_detalle_examen_prueba"
                      >
                        <div class="col-6">
                          <p class="q-mb-none">
                            {{ prueba.prueba_nombre }}
                          </p>
                        </div>
                        <div class="col-2">
                          <q-input
                            outlined
                            v-model="prueba.resultado"
                            label="Resultado"
                            type="textarea"
                            :dense="true"
                            v-if="examn.examen.id_usuario == null"
                          />
                          <q-input
                            outlined
                            v-model="prueba.resultado"
                            label="Resultado"
                            type="textarea"
                            :dense="true"
                            v-else-if="
                              examn.examen.id_usuario != null &&
                              (examn.examen.id_usuario == this.id_usuario ||
                                this.rol == 6)
                            "
                          />
                          <q-input
                            outlined
                            v-model="prueba.resultado"
                            label="Resultado"
                            type="textarea"
                            :dense="true"
                            disable
                            v-else
                          />
                        </div>
                        <div class="col-1">
                          <p
                            class="q-mb-none"
                            v-html="prueba.unidad"
                            v-if="
                              prueba.unidad != null && prueba.unidad != 'null'
                            "
                          ></p>
                        </div>
                        <div class="col-3">
                          <p
                            class="q-mb-none"
                            v-html="prueba.valor_de_referencia"
                          ></p>
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <p class="text-weight-bold q-mb-none">Observacion:</p>
                      <q-input
                        outlined
                        v-model="examn.examen.comentario"
                        type="textarea"
                        v-if="examn.examen.id_usuario == null"
                      />
                      <q-input
                        outlined
                        v-model="examn.examen.comentario"
                        type="textarea"
                        v-else-if="
                          examn.examen.id_usuario != null &&
                          (examn.examen.id_usuario == this.id_usuario ||
                            this.rol == 6)
                        "
                      />
                      <q-input
                        outlined
                        v-model="examn.examen.comentario"
                        type="textarea"
                        v-else
                        disable
                      />
                    </div>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div class="row q-my-md">
          <div class="col-12 text-right">
            <q-btn
              unelevated
              label="Imprimir resultados"
              color="primary"
              class="q-mr-md"
              @click="imprimirResultados()"
              :loading="this.carga"
              v-if="
                this.rol == 8 ||
                this.rol == 6 ||
                this.rol == 1 ||
                this.rol == 17 ||
                this.rol == 3 ||
                this.rol == 21 ||
                this.rol == 1 ||
                this.rol == 24||
                this.rol==5
              "
            >
            </q-btn>

            <q-btn
              unelevated
              label="Grabar resultados"
              color="primary"
              class="q-mr-md"
              @click="enviarResultados()"
              :loading="this.carga"
              v-if="this.rows.length!=0"
            >
            </q-btn>
            <q-btn
              unelevated
              label="Grabar resultados"
              color="primary"
              class="q-mr-md"
              @click="enviarResultados()"
              :loading="this.carga"
              v-else
              disable
            >
            </q-btn>
          </div>
        </div>
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

    <div class="row" v-else></div>
  </q-tab-panel>

  <!-- MODAL FALTA CHECK -->
  <q-dialog v-model="faltaConfirmacion">
    <q-card>
      <q-card-section class="row items-center q-ma-md">
        <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
        <span class="q-ml-sm">
          <div class="text-subtitle1 text-center">
            Falta uno o varios examenes por firmar, <br />
            por favor verifique.
          </div>
        </span>
      </q-card-section>

      <q-card-actions align="center" class="q-mb-md">
        <q-btn label="Aceptar" color="primary" class="q-mr-lg" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <ImpresionExamenes
    v-show="pdf"
    :impresion="this.envio"
    :paciente="this.paciente"
    :numeroOrden="this.numeroOrden"
    :fecha="this.fecha"
    :qr="this.qr"
    ref="impresionExamenes"
  >
  </ImpresionExamenes>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import ImpresionExamenes from "../components/PdfResultadosExamenes.vue";

export default {
  props: ["rows", "paciente", "loading", "numeroOrden", "fecha", "qr"],

  components: {
    ImpresionExamenes,
  },

  data() {
    let carga = ref(false);
    let faltaConfirmacion = ref(false);
    let id_usuario = parseInt(localStorage.id);
    let pdf = ref(null);
    let impresion = ref([]);
    let aux_impresion = ref([]);
    let envio = ref([]);
    let rol = parseInt(localStorage.rol);
    let acceso = ref(null);
    let prueba = this.rows;

    const ip = process.env.BASE_URL;

    //  COLUMNAS DE LA TABLA //
    const columns = [
      {
        name: "departamento_nombre",
        required: true,
        label: "Departamento",
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
      impresion,
      aux_impresion,
      pdf,
      envio,
      rol,
      acceso,
      glicosilada: false,
      prueba,
    };
  },

  methods: {
    verificacionGlicosilada() {
      console.log("ENTRO A LA VERI GLICO", this.rows, this.prueba);
      let departamentos = this.rows;
      let examenes;
      console.log("el length", departamentos.length);

      for (let i = 0; i < departamentos.length; i++) {
        console.log("ENTRO AL CICLO DEPA");
        if (departamentos[i].departamento_nombre == "HEMATOLOGIA") {
          console.log("ENTRO A HEMA JEJE XD");

          examenes = departamentos[i].examenes;

          if(examenes.length>1){
            this.glicosilada=true;
          }else if(examenes.length==1){
            if (examenes[0].examen.id_examen != 232) {
              this.glicosilada = true;
              console.log("ENTRO AL GLICO JEJE XD", this.glicosilada);
            }
          }
          /*for (let j = 0; j < examenes.length; j++) {
            if (examenes[j].examen.id_examen != 232) {
              this.glicosilada = true;
              console.log("ENTRO AL GLICO JEJE XD", this.glicosilada);
            }
          }*/
        }
      }
    },

    // MANDA A HACER EL PDF DE IMPRESION DE RESULTADOS
    imprimirResultados() {
      console.log("pa imprimir", this.aux_impresion);
      //let depa=this.aux_impresion[0].departamento;
      //let cont = 0;
      let depa;
      let usuario;
      let aux_examenes = [];
      let aux_firmas = [];

      for (let i = 0; i < this.aux_impresion.length; i++) {
        console.log(
          "el departamento i ",
          this.aux_impresion[i].departamento,
          this.aux_impresion[i]
        );

        // AGRUPA LOS EXAMENES POR DEPARTAMENTO
        if (this.aux_impresion[i].departamento != null) {
          depa = this.aux_impresion[i].departamento;
          console.log("el depa ", depa);

          for (let j = 0; j < this.aux_impresion.length; j++) {
            if (depa == this.aux_impresion[j].departamento) {
              aux_examenes.push({
                examen: this.aux_impresion[j].examen,
              });

              this.aux_impresion[j].departamento = null;
            }
          }

          this.impresion = [
            ...this.impresion,
            {
              departamento_nombre: depa,
              examenes: aux_examenes,
            },
          ];

          aux_examenes = [];
        }

        // AGRUPA LAS FIRMAS DE LOS BIOANALISTAS
        if (this.aux_impresion[i].id_usuario != null) {
          usuario = this.aux_impresion[i].id_usuario;
          console.log("el usuario ", usuario);

          for (let j = 0; j < this.aux_impresion.length; j++) {
            if (usuario == this.aux_impresion[j].id_usuario) {
              this.aux_impresion[j].id_usuario = null;
            }
          }
          aux_firmas.push({
            id_usuario: usuario,
          });
        }
      }

      console.log("impresion es", this.impresion);
      this.envio.push({
        impresion: this.impresion,
        firmas: aux_firmas,
      });

      console.log("el envio", this.envio);
      this.$refs.impresionExamenes.crearResultados();
      this.pdf = true;

      console.log("impresion es", this.impresion);
    },

    // ENVIA LOS RESULTADOS A LA API
    enviarResultados() {
      this.carga = true;
      console.log(this.carga);

      let depas = this.rows;
      let exameness;
      let pruebass;
      let enviar = true;

      /*for (let i = 0; i < depas.length; i++) {
        //console.log("LA CUENTA DE DEPAS");
        exameness = depas[i].examenes;
        for (let j = 0; j < exameness.length; j++) {
          //console.log("LOS EXAMENES DEL DEPA");
          pruebass = exameness[j].examen.pruebas;
          for (let k = 0; k < pruebass.length; k++) {
            //console.log("LAS PRUEBAS DEL EXAMEN");
            if (
              this.rows[i].examenes[j].examen.pruebas[k].resultado != null &&
              this.rows[i].examenes[j].examen.check == false
            ) {
              enviar = false;
              this.carga = false;
              console.log("MAMY FALTA UN CHECK");
              break;
            }
          }
        }
      }*/

      //if (enviar == true) {
      console.log(this.rows);

      axios
        .post(this.ip + "checkDetallesOrdenesExamenes", this.rows)
        .then((response) => {
          console.log("el response del guardado", response.data);
          this.carga = false;

          if (response.data == 1) {
            this.$router.go();
          }
        });
      /*} else if (enviar == false) {
        this.faltaConfirmacion = true;
        this.carga = false;
      }*/
    },

    // AÑADE LA FIRMA DEL  USUARIO AL EXAMEN
    addUsuario(examen) {
      examen.id_usuario = parseInt(localStorage.id);
      console.log("añadio el usuario");
    },

    // AÑADE UN EXAMEN AL AUXILIAR DE IMPRESION
    addExamenImpresion(examen, examen_id, departamento, imprimir, id_usuario) {
      console.log("EL DEPARTAMENTO", departamento, imprimir);
      if (imprimir == true) {
        console.log("imprimir true");
        this.aux_impresion.push({
          id_usuario: id_usuario,
          departamento: departamento,
          examen: examen,
        });
      } else if (imprimir == false) {
        console.log("imprimir false");
        for (let i = 0; i < this.aux_impresion.length; i++) {
          console.log("entro for");
          console.log(this.aux_impresion[i].examen.id_examen);
          console.log(examen_id);
          if (this.aux_impresion[i].examen.id_examen == examen_id) {
            console.log("lo encontro");
            var prueba = this.aux_impresion.splice(i, 1);
            console.log("la prueba", prueba);
            break;
          }
        }
      }

      console.log("el aux impresion", this.aux_impresion);
      console.log(imprimir);
      console.log(examen_id);
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
  },

  computed: {
    getAcceso() {
      return this.acceso;
    },

    getRows() {
      if (this.rows.length != 0) {
        this.verificacionGlicosilada();
      }
      return "";
    },
  },
};
</script>
