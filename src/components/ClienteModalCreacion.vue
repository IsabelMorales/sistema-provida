<template>
  <q-dialog persistent transition-show="scale" transition-hide="scale">
    <!-- CARD CREACION CLIENTE -->
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Creación de cliente</div>
      </q-card-section>

      <q-card-section>
        <q-form
          @submit="onSubmit"
          @reset="onCancel"
          class="q-gutter-sm q-ml-md"
        >
          <div class="row">
            <!-- NOMBRE DEL CLIENTE -->
            <div class="col-5">
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
                class="text-uppercase"
              />
            </div>
          </div>

          <div class="row">
            <!-- CEDULA O RIF DEL CLIENTE -->
            <div class="col-5">
              <q-input
                v-model="getCedulaCliente"
                type="text"
                label="Cedula/RIF"
                class="q-mr-xl text-uppercase"
                disable
              />
            </div>
            <!-- CORREO DEL CLIENTE -->
            <div class="col-4">
              <q-input
                v-model="correo"
                type="text"
                label="Correo"
                class="text-uppercase"
              />
            </div>
          </div>

          <div class="row">
            <!-- TELEFONO DEL CLIENTE -->
            <div class="col-5">
              <q-input
                v-model="telefono"
                type="text"
                label="Telefono"
                class="q-mr-xl text-uppercase"
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
              class="q-mr-md"
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
  props: ["cedula", "tipo"],
  data() {
    let nombre = ref(null);
    let apellido = ref(null);
    let cedulaRIF = this.cedula;
    let correo = ref(null);
    let telefono = ref(null);

    const ip = process.env.BASE_URL;

    return {
      nombre,
      apellido,
      cedulaRIF,
      correo,
      telefono,
      ip,
    };
  },

  methods: {
    // ENVIAR CLIENTE //
    onSubmit() {
      let num = 1;
      console.log("elnum " + num);
      console.log(this.tipo + this.cedula)

      let cliente = {
        num,
        id_cliente: this.id,
        cliente_nombre: this.nombre.toUpperCase(),
        cliente_apellido: this.apellido.toUpperCase(),
        cedula_RIF: this.tipo + this.cedula,
        correo: this.correo,
        telefono: this.telefono,
        id_tipo_cliente: 1,
      };

      console.log(cliente);
      console.log("ENVIADITTO");
      axios
        .post(this.ip + "crearYEnviarCliente", cliente)
        .then((response) => {
          console.log(response.data);
          if (response.data === "ERROR EN AGREGAR USUARIO!") {
            // EL MANEJO DE ERRORES
            console.log("NO DEBERIA ENTRAR");
          } else {
            console.log("ENTRO");
            this.$emit("agregarCliente", response.data);
          }
        })
        .catch((err) => console.log(err.message));
    },

    onCancel() {
      this.$emit("cancelarCliente", false);
    },
  },

  computed: {
    getCedulaCliente() {
      return this.tipo + this.cedula;
    },
  },
};
</script>
