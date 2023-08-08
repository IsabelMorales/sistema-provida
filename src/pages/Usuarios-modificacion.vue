<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE USUARIO -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              usuarios
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
                <!-- CEDULA O RIF DEL CLIENTE -->
                <div class="col-4">
                  <q-input
                    v-model="usuario"
                    type="text"
                    label="Usuario"
                    class="q-mr-xl text-uppercase"
                  />
                </div>

                <!-- CORREO DEL CLIENTE -->
                <div class="col-4">
                  <q-input
                    v-model="password"
                    type="text"
                    label="Contraseña"
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
                  <q-select
                    v-model="rol"
                    :options="rolesData"
                    label="Rol"
                    class="q-ml-xl text-uppercase"
                    emit-value
                    map-options
                    option-value="id_rol"
                    option-label="nombre_rol"
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
    let cedulaRIF = ref(null);
    let correo = ref(null);
    let telefono = ref(null);
    let usuario = ref(null);
    let password = ref(null);
    let tipoDocumento = ref(null);
    let tipoDocumentoData = ref([]);
    let rolesData = ref([]);
    let rol = ref(null);
    let acceso = ref(null);

    const ip = process.env.BASE_URL;

    return {
      nombre,
      apellido,
      cedulaRIF,
      correo,
      telefono,
      tipoDocumento,
      tipoDocumentoData,
      rolesData,
      rol,
      usuario,
      password,
      ip,
      acceso,
    };
  },

  methods: {
    // SE TRAE EL USUARIO A MODIFICAR //
    async getUsuario() {
      console.log(this.id);
      let idUsuario = {
        id_usuario: parseInt(this.id),
      };

      let datos = await axios.post(this.ip + "buscarUsuario", idUsuario);

      console.log(datos.data);
      console.log(datos.data[0]);
      this.nombre = datos.data[0].usuario_nombre;
      this.apellido = datos.data[0].usuario_apellido;
      //this.cedulaRIF = datos.data.usuario_cedula;
      this.correo = datos.data[0].usuario_correo;
      this.telefono = datos.data[0].usuario_telefono;
      this.usuario = datos.data[0].usuario_username;
      this.password = datos.data[0].usuario_password;

      let documento = datos.data[0].usuario_cedula.split("-");
      this.tipoDocumento = documento[0] + "-";
      this.cedulaRIF = documento[1];
      this.rol = datos.data[0].id_rol;

      console.log(this.cedula_RIF);
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

      let usuario = {
        num,
        id_usuario: this.id,
        usuario_nombre: this.nombre.toUpperCase(),
        usuario_apellido: this.apellido.toUpperCase(),
        usuario_cedula: this.tipoDocumento + this.cedulaRIF,
        usuario_correo: this.correo,
        usuario_telefono: this.telefono,
        usuario_username: this.usuario.toUpperCase(),
        usuario_password: this.password,
        id_rol: this.rol,
      };

      console.log(usuario);
      console.log("ENVIADITTO");

      axios
        .post(this.ip + "configUsuario", usuario)
        .then((response) => {
          console.log(response);
          if (response.data === 1) {
            this.$router.push({ name: "Usuarios" });
          }
        })
        .catch((err) => console.log(err.message));
    },

    // SE TRAE LOS TIPOS DE DOCUMENTOS
    async getDocumentos() {
      let datos = await axios.get(this.ip + "documentos");
      console.log("LOS DOCUMENTOS en facturacion", datos.data);
      this.tipoDocumentoData = datos.data;
    },

    // SE TRAE LAS OPCIONES DE LOS ROLES
    async getRoles() {
      let datos = await axios.get(this.ip + "roles");
      console.log("LOS ROLES", datos.data);
      this.rolesData = datos.data;
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Usuarios");
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: localStorage.rol,
          id_tarea: 17,
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
          id_tarea: 34,
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

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },

  created() {
    this.validar();
    this.getDocumentos();
    this.getRoles();

    if (this.create === "false") {
      this.getUsuario();
    }
  },
};
</script>
