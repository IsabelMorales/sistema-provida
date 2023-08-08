<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE CLIENTE -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              clientes
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
                <!-- NOMBRE DEL CLIENTE -->
                <div class="col-4">
                  <q-input
                    v-model="nombre"
                    type="text"
                    label="Nombre"
                    class="q-mr-xl text-uppercase"
                  />
                </div>
                <!-- APELLIDO DEL CLIENTE -->
                <div class="col-4">
                  <q-input
                    v-model="apellido"
                    type="text"
                    label="Apellido"
                    class="q-ml-xl text-uppercase"
                  />
                </div>
              </div>

              <div class="row">
                <!-- CEDULA O RIF DEL CLIENTE -->
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
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-model="cedulaRIF"
                    type="text"
                    label="Cedula/RIF"
                    class="q-mr-xl text-uppercase"
                  />
                </div>
                <!-- CORREO DEL CLIENTE -->
                <div class="col-4">
                  <q-input
                    v-model="correo"
                    type="text"
                    label="Correo"
                    class="q-ml-xl text-uppercase"
                  />
                </div>
              </div>

              <div class="row">
                <!-- TELEFONO DEL CLIENTE -->
                <div class="col-4">
                  <q-input
                    v-model="telefono"
                    type="text"
                    label="Telefono"
                    class="q-mr-xl text-uppercase"
                  />
                </div>
                <div class="col-4">
                  <q-checkbox
                    v-model="convenio"
                    label="CONVENIO"
                    class="q-ml-xl q-mt-md"
                  />
                </div>
              </div>
              <div class="row" v-if="convenio == true">
                <div class="col-4">
                  <q-input
                    v-model="contacto"
                    type="text"
                    label="Persona de contacto"
                    class="q-mr-xl text-uppercase"
                  />
                </div>
                <div class="col-4">
                  <q-input
                    v-model="descuento"
                    type="text"
                    label="Descuento"
                    class="q-ml-xl text-uppercase"
                  >
                    <template v-slot:append> % </template>
                  </q-input>
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
    let cedulaRIF = ref(null);
    let correo = ref(null);
    let telefono = ref(null);
    let convenio = ref(false);
    let tipoDocumentoData = ref([]);
    let tipoDocumento = ref(null);
    let contacto = ref(null);
    let descuento = ref(null);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    return {
      nombre,
      apellido,
      cedulaRIF,
      correo,
      telefono,
      ip,
      convenio,
      tipoDocumentoData,
      tipoDocumento,
      contacto,
      descuento,
      acceso,
    };
  },

  methods: {
    // SE TRAE EL CLIENTE A MODIFICAR //
    async getCliente() {
      let idCliente = {
        id_cliente: this.id,
      };
      let aux;

      let datos = await axios.post(this.ip + "buscarCliente", idCliente);

      console.log(datos.data);
      this.nombre = datos.data[0].cliente_nombre;
      if (datos.data[0].cliente_apellido == "null") {
        this.apellido = null;
      } else {
        this.apellido = datos.data[0].cliente_apellido;
      }

      aux = datos.data[0].cedula_RIF.split("-");
      console.log(aux);
      this.tipoDocumento = aux[0] + "-";
      for (let i = 1; i < aux.length; i++) {
        console.log(i);
        console.log(aux.length);
        if (i == 1 && i == aux.length - 1) {
          console.log("entro en cero");
          this.cedulaRIF = aux[i];
        } else if (i == 1) {
          console.log("entro en primero");
          this.cedulaRIF = aux[i] + "-";
        } else if (i == aux.length - 1) {
          console.log("entro en segundo");
          this.cedulaRIF = this.cedulaRIF + aux[i];
        } else {
          console.log("entro en tercero");
          this.cedulaRIF = this.cedulaRIF + aux[i] + "-";
        }
      }
      //this.cedulaRIF = aux[1] + "-" + aux[2];
      this.correo = datos.data[0].correo;
      this.telefono = datos.data[0].telefono;
      this.descuento = datos.data[0].descuento_fijo;
      console.log(datos.data[0].id_tipo_cliente);
      if (datos.data[0].id_tipo_cliente == 2) {
        this.convenio = true;
      } else {
        this.convenio = false;
      }
      console.log("convi", this.convenio);
      console.log(this.tipoDocumento);
      console.log(this.cedulaRIF);
    },

    // ENVIAR CLIENTE //
    onSubmit() {
      let num;
      let tipo_cliente;
      let cedula;
      if (this.create === "true") {
        num = 1;
      } else {
        num = 2;
      }

      console.log("elnum " + num);

      if (this.convenio == true) {
        tipo_cliente = 2;
      } else {
        tipo_cliente = 1;
      }

      cedula = this.tipoDocumento + this.cedulaRIF;
      if (this.apellido != null) {
        this.apellido = this.apellido.toUpperCase();
      }

      let cliente = {
        num,
        id_cliente: this.id,
        cliente_nombre: this.nombre.toUpperCase(),
        cliente_apellido: this.apellido,
        cedula_RIF: cedula,
        correo: this.correo,
        telefono: this.telefono,
        id_tipo_cliente: tipo_cliente,
        descuento_fijo: parseInt(this.descuento),
        contacto_persona_convenio: this.contacto,
      };

      console.log(cliente);
      console.log("ENVIADITTO");
      axios
        .post(this.ip + "configCliente", cliente)
        .then((response) => {
          console.log(response);
          if (response.data === 1) {
            this.$router.push({ name: "Clientes" });
          }
        })
        .catch((err) => console.log(err.message));
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Clientes");
    },

    // SE TRAE LOS TIPOS DE DOCUMENTOS
    async getDocumentos() {
      let datos = await axios.get(this.ip + "documentos");
      console.log("LOS DOCUMENTOS en facturacion", datos.data);
      this.tipoDocumentoData = datos.data;
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 2,
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
          id_tarea: 20,
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
    this.getCliente();
    this.getDocumentos();
  },

  computed: {
    getAcceso() {
      return this.acceso;
    },
  },
};
</script>
