<template>
  <q-dialog persistent transition-show="scale" transition-hide="scale">
    <!-- CARD CREACION DE PACIENTE -->
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Creación de paciente</div>
      </q-card-section>
      <q-separator />

      <q-card-section>
        <q-form
          @submit="onSubmit"
          @reset="onCancel"
          class="q-gutter-sm q-ml-lg"
        >
          <div class="row">
            <!-- NOMBRE DEL PACIENTE -->
            <div class="col-5">
              <q-input
                v-model="nombre"
                type="text"
                label="Nombre"
                class="q-mr-xl text-uppercase"
              />
            </div>
            <!-- APELLIDO DEL PACIENTE -->
            <div class="col-5">
              <q-input
                v-model="apellido"
                type="text"
                label="Apellido"
                class="q-mr-xl text-uppercase"
              />
            </div>
          </div>

          <div class="row">
            <!-- CEDULA DEL PACIENTE -->
            <div class="col-2">
              <q-select
                emit-value
                map-options
                option-value="documento_nombre"
                option-label="documento_nombre"
                v-model="this.tipoDocumento"
                :options="tipoDocumentoData"
                label="Tipo"
                class="q-mr-md text-uppercase text-center"
              />
            </div>
            <div class="col-3">
              <q-input
                v-model="this.cedula"
                type="text"
                label="Cedula"
                class="q-mr-xl text-uppercase"
              />
            </div>

            <!-- EDAD DEL PACIENTE -->
            <div class="col-4">
              <q-input v-model="this.date" type="text" label="FECHA DE NACIMIENTO" />
            </div>
          </div>

          <div class="row">
            <!-- GENERO DEL PACIENTE -->
            <div class="col-5">
              <q-select
                emit-value
                map-options
                option-value="id_genero"
                option-label="genero_nombre"
                v-model="genero"
                :options="generosData"
                label="Genero"
                class="q-mr-xl text-uppercase"
              />
            </div>

            <!-- PESO DEL PACIENTE -->
            <div class="col-5">
              <q-input
                v-model="peso"
                type="text"
                label="Observaciones"
                class="q-mr-xl text-uppercase"
              />
            </div>
          </div>

          <div class="row">
            <!-- MEDICAMENTOS DEL PACIENTE -->
            <div class="col-5">
              <q-input
                v-model="medicamentos"
                type="text"
                label="Medicamentos"
                class="q-mr-xl text-uppercase"
                autogrow
              />
            </div>
            <!-- PATOLOGIAS DEL PACIENTE -->
            <div class="col-5">
              <q-input
                v-model="patologias"
                type="text"
                label="Patologias"
                class="q-mr-xl text-uppercase"
                autogrow
              />
            </div>
          </div>

          <div class="row">
            <!-- TELEFONO DEL PACIENTE -->
            <div class="col-5">
              <q-input
                v-model="telefono"
                type="text"
                label="TELEFONO"
                class="q-mr-xl text-uppercase"
                autogrow
              />
            </div>
          </div>

          <q-card-actions align="right" class="q-mt-lg">
            <!-- BOTON CANCELAR -->
            <q-btn
              label="Cancelar"
              type="reset"
              color="grey-9"
              flat
              class="q-ml-sm"
              @click="onCancel()"
            />

            <!-- BOTON CREAR -->
            <q-btn label="Crear" type="submit" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  props: ["cedula_paciente", "tipo_documento", "from", "paciente"],

  data() {
    let nombre = ref(null);
    let apellido = ref(null);
    let cedula = ref(this.cedula_paciente);
    let tipoDocumento = ref(this.tipo_documento);
    let tipoDocumentoData = ref([]);
    let date = ref(null);
    let genero = ref(null);
    let telefono = ref(null);
    let generosData;
    let peso = ref(null);
    let medicamentos = ref(null);
    let patologias = ref(null);
    let id = ref(null);
    let elPaciente = ref(null);
    let id_rol = parseInt(localStorage.rol);

    const ip = process.env.BASE_URL;

    return {
      nombre,
      apellido,
      cedula,
      date,
      genero,
      generosData,
      peso,
      telefono,
      medicamentos,
      patologias,
      confirm,
      ip,
      tipoDocumento,
      tipoDocumentoData,
      id,
      elPaciente,
      id_rol,
    };
  },

  methods: {
    closeDialog() {
      this.$refs.qDateProxy.close();
    },

    // ENVIAR PACIENTE //
    onSubmit() {
      let elPeso;
      if (this.peso != null) {
        elPeso = this.peso.toUpperCase();
      } else {
        elPeso = this.peso;
      }

      let paciente = {
        num: 2,
        id_paciente: this.id,
        paciente_nombre: this.nombre.toUpperCase(),
        paciente_apellido: this.apellido.toUpperCase(),
        paciente_cedula: this.tipoDocumento + this.cedula,
        paciente_telefono: this.telefono,
        edad: this.date,
        genero: this.genero,
        peso: elPeso,
        medicamentos: this.medicamentos,
        patologias: this.patologias,
      };

      console.log(paciente);
      console.log(this.from);
      console.log("ENVIADITTO");
      if (this.from == 1) {
        axios
          .post(this.ip + "crearYEnviarPaciente", paciente)
          .then((response) => {
            console.log(response);
            if (response == "ERROR EN AGREGAR PACIENTE!") {
            } else {
              this.$emit("crearPaciente", response.data);
            }
          })
          .catch((err) => console.log(err.message));
      } else {
        axios
          .post(this.ip + "configPaciente", paciente)
          .then((response) => {
            console.log(response.data);
            if (response.data === "paciente modificado!") {
              this.$emit("crearPaciente", paciente);
            }
          })
          .catch((err) => console.log(err.message));
      }
    },

    // SE TRAE LOS GENEROS
    async getGeneros() {
      let datos = await axios.get(this.ip + "generos");
      console.log("LOS GENEROS", datos.data);
      this.generosData = datos.data;
    },

    // SE TRAE LOS TIPOS DE DOCUMENTOS
    async getDocumentos() {
      let datos = await axios.get(this.ip + "documentos");
      console.log("LOS DOCUMENTOS en facturacion", datos.data);
      this.tipoDocumentoData = datos.data;
    },

    getPaciente() {
      let aux;
      this.elPaciente = JSON.parse(this.paciente);
      console.log("el paciente", this.elPaciente);
      this.date = this.elPaciente.edad;
      this.genero = this.elPaciente.genero;
      this.telefono = this.elPaciente.paciente_telefono;
      this.medicamentos = this.elPaciente.medicamentos;
      this.nombre = this.elPaciente.paciente_nombre;
      this.apellido = this.elPaciente.paciente_apellido;

      aux = this.elPaciente.paciente_cedula.split("-");
      console.log("el aux", aux);
      this.cedula = aux[1];
      this.tipoDocumento = aux[0] + "-";

      this.patologias = this.elPaciente.patologias;
      this.peso = this.elPaciente.peso;
      this.id = this.elPaciente.id_paciente;
    },

    onCancel() {
      this.$emit("cancelarPaciente", false);
    },
  },

  created() {
    this.getGeneros();
    this.getDocumentos();
    if (this.from == 2 || this.from == 3) {
      this.getPaciente();
    }
  },

  unmounted() {
    console.log("SE ESCALABRO!!!");
  },

  computed: {
    /*getCedula() {
      return this.cedula_paciente;
    },

    getDocumento() {
      return this.tipo_documento;
    },*/
  },
};
</script>
