<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-11 q-pa-md">
        <q-card flat bordered class="cards">
          <div class="row">
            <div class="col-12">
              <h6 class="q-my-md q-ml-md">Carpeta de paciente</h6>
            </div>
          </div>

          <div class="row q-mb-xl">
            <div class="col-3">
              <q-btn
                label="Generar pdf"
                @click="finalizar"
                color="primary"
                class="q-mt-sm"
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- !!!!!!!! EL PDF DE CARPETA PACIENTE !!!!!!!!!!-->
    <template>
      <div class="q-mt-sm" v-show="impresion" id="pdf" style="border: 1px solid #000">
        <div class="row">
          <div class="col-3">
            <img
              src="../assets/logo.png"
              style="width: 170px; height: 110px"
              alt=""
            />
          </div>
          <div class="col-9 text-right q-pr-sm">
            <div class="row">
              <div class="col-12">
                <div class="text-h6">LABORATORIO CLINICO PROVIDA C.A.</div>
              </div>
              <div class="col-12">
                <div class="text-subtitle1">J-305148929</div>
              </div>
              <div class="col-12">
                <div class="text-subtitle2">
                  Provida 1: Av. Lucio Oquendo, Qta. Saimi, La Concordia.
                  Tel: 0276-3465389
                </div>
              </div>
              <div class="col-12">
                <div class="text-subtitle2">
                  Provida 2: Calle Albarico con Av. Francisco Cardenas, Barrio
                  Obrero sector El Cafetal. Tel: 0414-0757356
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="row text-center"
          style="margin-top: 80px; margin-bottom: 80px"
        >
          <div class="col-12">
            <div class="text-h4 text-weight-bold">RESULTADOS</div>
          </div>
        </div>
      </div>
    </template>
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
import { jsPDF } from "jspdf";

export default {
  props: ["id"],

  data() {
    let pacientesData = ref(null);
    let id_paciente = ref(null);
    let paciente = ref(null);
    let confirm = ref(false);
    let acceso = ref(null);
    let impresion = ref(false);
    var today = new Date();
    let fecha =
      today.getDate() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getFullYear();

    const columns_pacientes = [
      {
        name: "paciente_cedula",
        align: "left",
        label: "Cédula",
        field: "paciente_cedula",
        sortable: true,
      },
      {
        name: "paciente_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => {
          return row.paciente_nombre + " " + row.paciente_apellido;
        },
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const ip = process.env.BASE_URL;

    // AGREGA EL CLIENTE //
    const addPaciente = (
      id_paciente,
      nombre_paciente,
      apellido_paciente,
      cedula_paciente
    ) => {
      this.paciente =
        cedula_paciente + " " + nombre_paciente + " " + apellido_paciente;
      this.id_paciente = id_paciente;
      this.filterPaciente = "";
      this.confirm = false;
    };

    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        // rowsNumber: xx if getting data from a server
      },
      ip,
      pacientesData,
      id_paciente,
      paciente,
      addPaciente,
      filterPaciente: "",
      columns_pacientes,
      confirm,
      acceso,
      impresion,
      fecha,
      today,
    };
  },

  methods: {
    buscarPaciente() {
      this.confirm = true;
    },

    finalizar() {
      console.log("CREACION DE LOS RESULTADOS DE EXAMENES COMPA!!!");

      console.log("el paciente", this.paciente);
      console.log("lafecha", this.fecha);
      this.impresion = true;

      var doc = new jsPDF("p", "pt", "a5");
      doc.html(document.getElementById("pdf"), {
        //margin: [0, 0, 0, 0],
        callback: function (doc) {
          doc.autoPrint();
          doc.output("dataurlnewwindow");
        },
        windowWidth: 1000,
        width: 410,
        x: 3,
      });
    },

    async getPacientes() {
      axios.get(this.ip + "pacientes").then((response) => {
        this.pacientesData = response.data;
        console.log("los pacientes", this.pacientesData);
      });
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 77,
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

  mounted() {
    this.getPacientes();
  },

  created() {
    this.validar();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
