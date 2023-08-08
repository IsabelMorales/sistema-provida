<template>
  <q-page padding v-if="this.acceso == 1">
    <div class="fit row justify-end">
      <div class="col-9 q-pl-xl">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-left">
              <div class="row q-mb-lg">
                <!-- NOMBRE DEL CULTIVO -->
                <div class="col-6">
                  <div
                    class="text-h6 q-ml-md"
                    v-if="elCultivo.cultivo_nombre_especifico != null"
                  >
                    {{ elCultivo.cultivo_nombre_especifico }}
                  </div>
                  <div
                    class="text-h6 q-ml-md"
                    v-else
                  >
                    {{ elCultivo.cultivo_nombre }}
                  </div>
                </div>

                <!-- CHECK DE FIRMADO -->
                <div
                  class="col-4 text-right text-body1 q-pr-md"
                  v-if="this.rol == 18 || this.rol == 6 || this.rol == 21"
                >
                  <q-checkbox
                    left-label
                    v-if="elCultivo.id_usuario == null"
                    v-model="elCultivo.check"
                    label="Firmar"
                    @update:model-value="addUsuario(elCultivo)"
                  />
                  <q-checkbox
                    left-label
                    v-else-if="
                      elCultivo.id_usuario != null &&
                      (this.rol == 21 || this.rol == 6)
                    "
                    v-model="elCultivo.check"
                    label="Firmar"
                    @update:model-value="addUsuario(elCultivo)"
                  />
                  <q-checkbox
                    left-label
                    v-else
                    v-model="elCultivo.check"
                    label="Firmar"
                    disable
                  />
                </div>
              </div>

              <!-- FOR DE LAS BACTERIAS -->
              <div v-for="(bacteria, index) in bacterias" :key="index">
                <div class="row q-mb-md">
                  <div class="col-8">
                    <!-- SELECCIONADOR DE LA BACTERIA -->
                    <q-select
                      emit-value
                      map-options
                      option-label="bacteria_nombre"
                      v-if="elCultivo.id_usuario == null"
                      v-model="bacteria.bacteriaItem"
                      :options="elCultivo.bacterias"
                      label="BACTERIA"
                      class="q-ml-lg"
                    />
                    <q-select
                      emit-value
                      map-options
                      option-label="bacteria_nombre"
                      v-else-if="
                        elCultivo.id_usuario != null &&
                        (this.rol == 21 || this.rol == 6)
                      "
                      v-model="bacteria.bacteriaItem"
                      :options="elCultivo.bacterias"
                      label="BACTERIA"
                      class="q-ml-lg"
                    />
                    <q-select
                      emit-value
                      map-options
                      option-label="bacteria_nombre"
                      v-else
                      v-model="bacteria.bacteriaItem"
                      :options="elCultivo.bacterias"
                      label="BACTERIA"
                      class="q-ml-lg"
                      disable
                    />
                  </div>
                  <div class="col-2">
                    <q-btn
                      icon="delete"
                      @click="eliminarBacteria(index)"
                      color="primary"
                      class="q-ml-lg q-mt-md"
                      v-if="elCultivo.id_usuario == null"
                    />
                    <q-btn
                      icon="delete"
                      @click="eliminarBacteria(index)"
                      color="primary"
                      class="q-ml-lg q-mt-md"
                      v-else-if="
                        elCultivo.id_usuario != null &&
                        (this.rol == 21 || this.rol == 6)
                      "
                    />
                  </div>
                </div>

                <!-- FOR DE LOS ANTIBIOTICOS DE LA BACTERIA -->
                <div v-for="(antibiotico, index) in bacteria" :key="index">
                  <!--<pre>{{ antibiotico.antibioticos }}</pre>-->
                  <div class="row">
                    <!-- SELECT PARA PONER EL MISMO VALOR DE RESULTADO PARA TODOS LOS ANTIBIOTICOS -->
                    <div class="col-12 text-right">
                      <q-option-group
                        v-if="elCultivo.id_usuario == null"
                        v-model="antibiotico.opcionTodos"
                        :options="options"
                        color="primary"
                        inline
                        @update:model-value="
                          changeOpciones(
                            antibiotico.antibioticos,
                            antibiotico.opcionTodos
                          )
                        "
                      />
                      <q-option-group
                        v-else-if="
                          elCultivo.id_usuario != null &&
                          (this.rol == 21 || this.rol == 6)
                        "
                        v-model="antibiotico.opcionTodos"
                        :options="options"
                        color="primary"
                        inline
                        @update:model-value="
                          changeOpciones(
                            antibiotico.antibioticos,
                            antibiotico.opcionTodos
                          )
                        "
                      />
                      <q-option-group
                        v-else
                        v-model="antibiotico.opcionTodos"
                        :options="options"
                        color="primary"
                        inline
                        disable
                      />
                    </div>
                  </div>
                  <div
                    v-for="result in antibiotico.antibioticos"
                    :key="result"
                    class="row items-center"
                  >
                    <!-- NOMBRE DEL ANTIBIOTICO -->
                    <div class="col-8 text-subtitle1">
                      {{ result.antibiotico_nombre }}
                    </div>
                    <!-- SELECT DEL RESULTADO DEL ANTIBIOTICO -->
                    <div class="col-4">
                      <q-select
                        emit-value
                        map-options
                        option-value="resultado_nombre"
                        option-label="resultado_nombre"
                        v-if="elCultivo.id_usuario == null"
                        v-model="result.resultado"
                        :options="resultadoData"
                        label="RESULTADO"
                        class="q-ml-lg"
                      />
                      <q-select
                        emit-value
                        map-options
                        option-value="resultado_nombre"
                        option-label="resultado_nombre"
                        v-else-if="
                          elCultivo.id_usuario != null &&
                          (this.rol == 21 || this.rol == 6)
                        "
                        v-model="result.resultado"
                        :options="resultadoData"
                        label="RESULTADO"
                        class="q-ml-lg"
                      />
                      <q-select
                        emit-value
                        map-options
                        option-value="resultado_nombre"
                        option-label="resultado_nombre"
                        v-else
                        v-model="result.resultado"
                        :options="resultadoData"
                        label="RESULTADO"
                        class="q-ml-lg"
                        disable
                      />
                    </div>
                    <div class="col-12">
                      <q-separator />
                    </div>
                  </div>
                </div>
              </div>

              <!-- BOTON PARA AGREGAR UNA NUEVA BACTERIA -->
              <div class="row q-my-lg">
                <div class="col-12">
                  <q-btn
                    v-if="elCultivo.id_usuario == null"
                    label="Agregar bacteria"
                    @click="addBacteria"
                    color="primary"
                  />
                  <q-btn
                    v-else-if="
                      elCultivo.id_usuario != null &&
                      (this.rol == 21 || this.rol == 6)
                    "
                    label="Agregar bacteria"
                    @click="addBacteria"
                    color="primary"
                  />
                  <q-btn
                    v-else
                    label="Agregar bacteria"
                    @click="addBacteria"
                    color="primary"
                    disable
                  />
                </div>
              </div>

              <!-- COMENTARIO DEL CULTIVO -->
              <div class="row">
                <div class="col-8">
                  <p class="text-weight-bold q-mb-none">Observacion:</p>
                  <q-input
                    outlined
                    v-model="elCultivo.comentario"
                    type="textarea"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div class="row q-mt-md">
          <div class="col-12 text-right">
            <!-- BOTON PARA IMPRIMIR LOS RESULTADOS DEL CULTIVO -->
            <q-btn
              v-if="this.rol == 21 || this.rol == 18 || this.rol == 6"
              label="Visualizar impresion"
              @click="imprimirResultados"
              color="primary"
              :loading="this.carga"
              class="q-mr-md"
            />

            <q-btn
              v-if="
                elCultivo.check &&
                (this.rol == 8 ||
                  this.rol == 21 ||
                  this.rol == 18 ||
                  this.rol == 17 ||
                  this.rol == 6 ||
                  this.rol == 1 ||
                  this.rol == 5)
              "
              label="Imprimir resultados"
              @click="imprimirResultados"
              color="primary"
              :loading="this.carga"
            />

            <q-btn
              v-else
              label="Imprimir resultados"
              @click="imprimirResultados"
              color="primary"
              :loading="this.carga"
              disable
            />

            <!-- BOTON PARA ENVIAR LOS RESULTADOS DEL CULTIVO -->
            <q-btn
              label="Guardar resultados"
              @click="enviarResultados"
              color="primary"
              class="q-ml-md"
              :loading="this.carga"
              v-if="this.rol != 8 && this.rol != 1 && this.rol != 5"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- INFORMACION DEL PACIENTE -->
    <q-page-sticky position="left">
      <q-card style="width: 350px" class="cards">
        <q-card-section>
          <div class="row">
            <div class="col">
              <div class="text-h6">
                {{ this.elPaciente.paciente_nombre }}
                {{ this.elPaciente.paciente_apellido }}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="text-subtitle2">Orden: {{ this.numeroOrden }}</div>
            </div>
            <div class="col-12">
              <div class="text-subtitle2">Fecha: {{ this.detalles.fecha }}</div>
            </div>
            <div class="col-12">
              <div class="text-subtitle2">
                {{ this.elPaciente.paciente_cedula }}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <div class="text-subtitle2">
                {{ this.elPaciente.edad }},
                {{ this.elPaciente.genero === 2 ? "Masculino" : "Femenino" }}
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
                this.elPaciente.patologias == null
                  ? "No posee."
                  : this.elPaciente.patologias
              }}
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-12 text-subtitle2">Medicamentos</div>
            <div class="col-12">
              {{
                this.elPaciente.medicamentos == null
                  ? "No posee."
                  : this.elPaciente.medicamentos
              }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-page-sticky>

    <!-- MODAL FALTA CHECK -->
    <q-dialog v-model="faltaConfirmacion">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              Falta uno o varios examenes por firmar, por favor verifique.
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <q-btn
            flat
            label="Aceptar"
            color="primary"
            class="q-mr-lg"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <ImpresionCultivo
      v-show="pdf"
      :impresion="this.elCultivo"
      :paciente="this.paciente"
      :numeroOrden="numeroOrden"
      :fecha="this.fecha"
      :qr="this.qr"
      ref="impresionCultivo"
    >
    </ImpresionCultivo>
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
import ImpresionCultivo from "../components/PdfResultadosCultivos.vue";

export default {
  props: [
    "id_cultivo",
    "id_orden",
    "id_factura",
    "numeroOrden",
    "fecha",
    "detalles_orden",
    "from",
    "qr",
    "cultivo",
    "paciente",
  ],

  components: {
    ImpresionCultivo,
  },

  data() {
    //let bacteriasData = this.rows.bacterias;
    let elCultivo = ref(null);
    let elPaciente = ref(null);
    let faltaConfirmacion = ref(false);
    let carga = ref(false);
    let bacterias = [];
    let id_usuario = localStorage.id;
    let pdf = ref(null);
    let rol = parseInt(localStorage.rol);
    let acceso = ref(null);
    let eliminadas = ref([]);

    let resultadoData = [
      {
        id_resultado: 0,
        resultado_nombre: null,
      },
      {
        id_resultado: 1,
        resultado_nombre: "SENSIBLE",
      },
      {
        id_resultado: 2,
        resultado_nombre: "INTERMEDIO",
      },
      {
        id_resultado: 3,
        resultado_nombre: "RESISTENTE",
      },
    ];

    const ip = process.env.BASE_URL;

    return {
      ip,
      bacterias,
      elCultivo,
      elPaciente,
      resultadoData,
      faltaConfirmacion,
      group: ref(null),
      id_usuario,
      carga,
      pdf,
      rol,
      acceso,
      detalles: ref(null),
      eliminadas,

      options: [
        {
          label: "-",
          value: "0",
        },
        {
          label: "SENSIBLE",
          value: "1",
        },
        {
          label: "INTERMEDIO",
          value: "2",
        },
        {
          label: "RESISTENTE",
          value: "3",
        },
      ],
    };
  },

  methods: {
    addBacteria() {
      this.bacterias.push({});
      console.log("se añadio una bacteria", this.bacterias);
    },

    eliminarBacteria(index) {
      var prueba = this.bacterias.splice(index, 1);
      this.eliminadas.push(prueba[0]);
      console.log("LA ELIMINADA", this.eliminadas, prueba);
    },

    changeOpciones(antibioticos, opcion) {
      console.log(opcion);

      for (let i = 0; i < antibioticos.length; i++) {
        if (opcion == 0) {
          antibioticos[i].resultado = null;
        } else if (opcion == 1) {
          antibioticos[i].resultado = "SENSIBLE";
        } else if (opcion == 2) {
          antibioticos[i].resultado = "INTERMEDIO";
        } else if (opcion == 3) {
          antibioticos[i].resultado = "RESISTENTE";
        }
      }

      console.log(antibioticos);
    },

    addUsuario(cultivo) {
      cultivo.id_usuario = parseInt(localStorage.id);
    },

    imprimirResultados() {
      let sensible = [];
      let intermedio = [];
      let resistente = [];

      // revisa todas las bacterias del cultivo
      for (let i = 0; i < this.elCultivo.bacteriasRes.length; i++) {
        // que no sean nulas
        if (Object.keys(this.elCultivo.bacteriasRes[i]).toString() != "nulo") {
          // revisa todos los antibioticos de cada bacteria
          for (
            let j = 0;
            j < this.elCultivo.bacteriasRes[i].antibioticos.length;
            j++
          ) {
            // si el resultado es sensisble y lo agrega al array de sensible
            if (
              this.elCultivo.bacteriasRes[i].antibioticos[j].resultado ==
              "SENSIBLE"
            ) {
              sensible.push(this.elCultivo.bacteriasRes[i].antibioticos[j]);

              //si es intermedio y lo agrega al de intermedio
            } else if (
              this.elCultivo.bacteriasRes[i].antibioticos[j].resultado ==
              "INTERMEDIO"
            ) {
              intermedio.push(this.elCultivo.bacteriasRes[i].antibioticos[j]);

              //o resistente y lo agrega al de resistente
            } else if (
              this.elCultivo.bacteriasRes[i].antibioticos[j].resultado ==
              "RESISTENTE"
            ) {
              resistente.push(this.elCultivo.bacteriasRes[i].antibioticos[j]);
            }
          }

          this.elCultivo.bacteriasRes[i].sensible = sensible;
          this.elCultivo.bacteriasRes[i].intermedio = intermedio;
          this.elCultivo.bacteriasRes[i].resistente = resistente;

          sensible = [];
          resistente = [];
          intermedio = [];
          console.log("el res de la bacteria", this.elCultivo.bacteriasRes[i]);
        }
      }

      console.log("el cultivo", this.elCultivo);

      this.$refs.impresionCultivo.crearResultados();
      this.pdf = true;
    },

    enviarResultados() {
      this.carga = true;
      console.log(this.bacterias, this.bacteriasRes);
      console.log(this.elCultivo);

      let sensible = [];
      let intermedio = [];
      let resistente = [];

      // revisa todas las bacterias del cultivo
      for (let i = 0; i < this.bacterias.length; i++) {
        // que no sean nulas
        //if (Object.keys(this.elCultivo.bacterias[i]).toString() != "nulo") {
        // revisa todos los antibioticos de cada bacteria
        for (
          let j = 0;
          j < this.bacterias[i].bacteriaItem.antibioticos.length;
          j++
        ) {
          // si el resultado es sensisble y lo agrega al array de sensible
          if (
            this.bacterias[i].bacteriaItem.antibioticos[j].resultado ==
            "SENSIBLE"
          ) {
            sensible.push(this.bacterias[i].bacteriaItem.antibioticos[j]);

            //si es intermedio y lo agrega al de intermedio
          } else if (
            this.bacterias[i].bacteriaItem.antibioticos[j].resultado ==
            "INTERMEDIO"
          ) {
            intermedio.push(this.bacterias[i].bacteriaItem.antibioticos[j]);

            //o resistente y lo agrega al de resistente
          } else if (
            this.bacterias[i].bacteriaItem.antibioticos[j].resultado ==
            "RESISTENTE"
          ) {
            resistente.push(this.bacterias[i].bacteriaItem.antibioticos[j]);
          }
        }

        this.bacterias[i].bacteriaItem.sensible = sensible;
        this.bacterias[i].bacteriaItem.intermedio = intermedio;
        this.bacterias[i].bacteriaItem.resistente = resistente;

        sensible = [];
        resistente = [];
        intermedio = [];
        console.log("el res de la bacteria", this.bacterias[i]);
        //}
      }
      console.log("LAS BACTERIASSSS", this.bacterias);

      //if (this.elCultivo.check == true) {
      let req = {
        id_usuario: this.elCultivo.id_usuario,
        id_usuario_modificado: this.elCultivo.id_usuario_modificado,
        id_detalle_orden: this.elCultivo.id_detalle_orden,
        comentario: this.elCultivo.comentario,
        bacterias: this.bacterias,
        cultivo_nombre: this.elCultivo.cultivo_nombre,
        id_cultivo: this.elCultivo.id_cultivo,
        eliminados: this.eliminadas,
      };

      console.log(req);

      axios
        .post(this.ip + "checkDetallesOrdenesCultivos", req)
        .then((response) => {
          console.log(response);
          this.carga = false;
          if (response.data === 1) {
            this.$router.push({
              name: "Resultados",
              params: {
                idOrden: this.id_orden,
                idFactura: this.id_factura,
                orden: this.numeroOrden,
                fecha: this.fecha,
                from: this.from,
              },
            });
          }
        });
      /*} else {
        this.faltaConfirmacion = true;
        this.carga = false;
      }*/
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 12,
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
    console.log(JSON.parse(this.paciente));
    console.log("EL QRRR", this.qr);
    this.detalles = JSON.parse(this.detalles_orden);
    this.elPaciente = JSON.parse(this.paciente);
    this.elCultivo = JSON.parse(this.cultivo);
    for (let i = 0; i < this.elCultivo.bacteriasRes.length; i++) {
      //console.log(this.elCultivo.bacteriasRes[i]);
      if (Object.keys(this.elCultivo.bacteriasRes[i]).toString() != "nulo") {
        this.bacterias.push({
          bacteriaItem: this.elCultivo.bacteriasRes[i],
        });
        this.elCultivo.bacteriasRes[i].sensible = [];
        this.elCultivo.bacteriasRes[i].intermedio = [];
        this.elCultivo.bacteriasRes[i].resistente = [];
      }
    }
    console.log(this.elCultivo);
    console.log("el array de bacterias", this.bacterias);
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso, this.qr);
      return this.acceso;
    },
  },
};
</script>
