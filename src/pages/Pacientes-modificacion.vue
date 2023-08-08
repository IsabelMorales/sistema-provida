<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE PACIENTE -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              pacientes
            </div>
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
                    v-model="tipoDocumento"
                    :options="tipoDocumentoData"
                    label="Tipo"
                    class="q-mr-md text-uppercase text-center"
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-model="cedula"
                    type="text"
                    label="Cedula"
                    class="q-mr-xl text-uppercase"
                  />
                </div>

                <!-- EDAD DEL PACIENTE -->
                <div class="col-5">
                  <q-input
                    v-model="edad"
                    type="text"
                    label="FECHA DE NACIMIENTO"
                    class="q-mr-xl"
                  />
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
                    :options="generoData"
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

              <div class="row justify-end">
                <div class="col-3 q-gutter-x-xl">
                  <!-- BOTON CANCELAR -->
                  <q-btn
                    label="Cancelar"
                    type="reset"
                    color="grey-9"
                    flat
                    class="q-ml-sm"
                  />

                  <!-- BOTON GUARDAR -->
                  <q-btn
                    v-if="this.create === 'false'"
                    label="Guardar"
                    type="submit"
                    color="primary"
                  />

                  <!-- BOTON GUARDAR -->
                  <q-btn
                    v-if="this.create === 'true'"
                    label="Crear"
                    type="submit"
                    color="primary"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
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
  props: ["id", "create"],

  data() {
    let nombre = ref(null);
    let apellido = ref(null);
    let cedula = ref(null);
    let edad = ref(null);
    let peso = ref(null);
    let genero = ref(null);
    let telefono = ref(null);
    let generoData = ref([]);
    let medicamentos = ref(null);
    let patologias = ref(null);
    let tipoDocumento = ref(null);
    let tipoDocumentoData = ref([]);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    return {
      acceso,
      nombre,
      apellido,
      cedula,
      edad,
      peso,
      telefono,
      genero,
      generoData,
      medicamentos,
      patologias,
      tipoDocumento,
      tipoDocumentoData,
      ip,
    };
  },

  methods: {
    // SE TRAE EL CLIENTE A MODIFICAR //
    async getPaciente() {
      let idPaciente = {
        id_paciente: this.id,
      };
      console.log(this.id);

      let datos = await axios.post(this.ip + "buscarPacientePorId", idPaciente);

      console.log("EL PACIENTE", datos.data);
      this.nombre = datos.data[0].paciente_nombre;
      this.apellido = datos.data[0].paciente_apellido;
      this.peso = datos.data[0].peso;
      this.edad = datos.data[0].edad;
      this.genero = datos.data[0].genero;
      this.telefono = datos.data[0].paciente_telefono;
      if (datos.data[0].medicamentos == "null") {
        this.medicamentos = null;
      } else {
        this.medicamentos = datos.data[0].medicamentos;
      }

      if (datos.data[0].patologias == "null") {
        this.patologias = null;
      } else {
        this.patologias = datos.data[0].patologias;
      }

      let documento = datos.data[0].paciente_cedula.split("-");
      this.tipoDocumento = documento[0] + "-";
      this.cedula = documento[1];

      console.log(this.tipoDocumento);
    },

    // ENVIAR CLIENTE //
    onSubmit() {
      let num;

      if (this.create === "true") {
        num = 1;
      } else {
        num = 2;
      }

      console.log("elnum " + num);

      let paciente = {
        num,
        id_paciente: this.id,
        paciente_nombre: this.nombre.toUpperCase(),
        paciente_apellido: this.apellido.toUpperCase(),
        paciente_cedula: this.tipoDocumento + this.cedula,
        paciente_telefono: this.telefono,
        edad: this.edad,
        genero: this.genero,
        peso: this.peso,
        medicamentos: this.medicamentos,
        patologias: this.patologias,
      };

      console.log(this.medicamentos);
      console.log("ENVIADITTO");
      axios
        .post(this.ip + "configPaciente", paciente)
        .then((response) => {
          console.log(response.data);
          if (response.data === "paciente modificado!") {
            this.$router.push({ name: "Pacientes" });
          }
        })
        .catch((err) => console.log(err.message));
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Pacientes");
    },

    // SE TRAE LOS TIPOS DE DOCUMENTOS
    async getDocumentos() {
      let datos = await axios.get(this.ip + "documentos");
      console.log("LOS DOCUMENTOS en facturacion", datos.data);
      this.tipoDocumentoData = datos.data;
    },

    // SE TRAE LOS GENEROS
    async getGeneros() {
      let datos = await axios.get(this.ip + "generos");
      console.log("LOS GENEROS", datos.data);
      this.generoData = datos.data;
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 1,
          token: localStorage.token,
        };

        axios
          .post(this.ip + "accesoAControladores", usuario)
          .then((response) => {
            console.log("EL RESPONSE", response.data);

            if (response.data == "x") {
              localStorage.clear();
              window.location = "/";
            } else {
              this.acceso = response.data;
            }
          });
      } else {
        //VERIFICACION DE MODIFICACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 22,
          token: localStorage.token,
        };

        axios
          .post(this.ip + "accesoAControladores", usuario)
          .then((response) => {
            console.log("EL RESPONSE", response.data);

            if (response.data == "x") {
              localStorage.clear();
              window.location = "/";
            } else {
              this.acceso = response.data;
            }
          });
      }
    },
  },

  created() {
    this.validar();
    if (this.create === "false") {
      this.getPaciente();
    }
    this.getDocumentos();
    this.getGeneros();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
