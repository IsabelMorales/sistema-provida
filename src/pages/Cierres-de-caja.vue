<template>
  <q-page padding v-if="getAcceso == 1">
    <div class="fit row justify-center" v-show="cierreCaja">
      <div class="col-11 q-pa-md">
        <q-card flat bordered class="cards">
          <div class="row">
            <div class="col-12">
              <h6 class="q-my-md q-ml-md">CIERRE DE CAJA</h6>
            </div>
          </div>

          <div class="row q-mb-xl">
            <!-- SELECCION DE FECHA -->
            <!-- DESDE -->
            <div class="col-2 q-ml-md">
              <q-input v-model="from" label="Desde" class="text-uppercase" />
            </div>

            <!-- HASTA -->
            <div class="col-2 q-ml-lg">
              <q-input v-model="to" label="Hasta" class="text-uppercase" />
            </div>

            <!-- SELECCION DE LOS USUARIOS -->
            <div class="col-3 q-ml-lg">
              <q-select
                emit-value
                map-options
                multiple
                max-values="3"
                option-label="usuario_username"
                v-model="usuarios"
                :options="listaUsuariosData"
                label="Usuarios"
                class="text-uppercase"
              />
            </div>

            <!-- SELECCION DEL TIPO DE CIERRE DE CAJA -->
            <div class="col-3 q-ml-lg" v-if="this.rol == 6">
              <q-select
                emit-value
                map-options
                option-value="id"
                option-label="nombre"
                v-model="tipoCierreCaja"
                :options="tipoCierreCajaData"
                label="Tipo de cierre"
                class="q-mr-lg text-uppercase"
              />
            </div>

            <div class="col-3 q-ml-lg" v-if="this.rol == 20">
              <q-select
                emit-value
                map-options
                option-value="id"
                option-label="nombre"
                v-model="tipoCierreCaja"
                :options="tipoReporteContador"
                label="Tipo de cierre"
                class="q-mr-lg text-uppercase"
              />
            </div>

            <div class="col-1">
              <q-btn
                label="Buscar"
                @click="finalizar"
                color="primary"
                class="q-mt-sm"
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <CierreCajaFiscal
      v-if="this.cierreFiscal"
      :data="this.cierreData"
      :from="this.from"
      :to="this.to"
      :usuarios="this.usuariosSeleccionados"
    >
    </CierreCajaFiscal>

    <CierreCajaNoFiscal
      v-if="this.cierreNoFiscal"
      :data="this.cierreData"
      :from="this.from"
      :to="this.to"
      :usuarios="this.usuariosSeleccionados"
    >
    </CierreCajaNoFiscal>

    <CierreCajaConsolidado
      v-if="this.cierreConsolidado"
      :data="this.cierreData"
      :from="this.from"
      :to="this.to"
      :usuarios="this.usuariosSeleccionados"
    >
    </CierreCajaConsolidado>
  </q-page>

  <q-page padding v-else-if="getAcceso == 0">
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
import CierreCajaFiscal from "./Cierre-caja-fiscal.vue";
import CierreCajaNoFiscal from "./Cierre-caja-no-fiscal.vue";
import CierreCajaConsolidado from "./Cierre-caja-consolidado.vue";

export default {
  components: {
    CierreCajaFiscal,
    CierreCajaNoFiscal,
    CierreCajaConsolidado,
  },

  data() {
    var today = new Date();
    let from =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      "06:00:00";

    let to =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      "16:00:00";

    let usuarios = ref(null);
    let listaUsuariosData = ref(null);
    let usuariosSeleccionados = ref([]);
    let tipoCierreCaja = ref(null);
    let cierreFiscal = ref(false);
    let cierreNoFiscal = ref(false);
    let cierreConsolidado = ref(false);
    let cierreData = ref(null);
    let cierreCaja = ref(true);
    let acceso = ref(null);
    let rol = parseInt(localStorage.rol)

    const tipoCierreCajaData = [
      {
        nombre: "FISCAL",
        id: 1,
      },
      {
        nombre: "NO FISCAL",
        id: 2,
      },
      {
        nombre: "CONSOLIDADO",
        id: 3,
      },
    ];

    const tipoReporteContador= [
      {
        nombre: "FISCAL",
        id: 1,
      },
    ];

    const ip = process.env.BASE_URL;

    axios.get(ip + "usuarios").then((response) => {
      console.log(response.data);

      listaUsuariosData.value = [
        {
          id_usuario: 0,
          usuario_apellido: "-",
          usuario_cedula: "-",
          usuario_correo: "-",
          usuario_nombre: "-",
          usuario_telefono: "-",
          usuario_username: "Todos",
        },
        ...response.data,
      ];
    });

    return {
      from,
      to,
      usuarios,
      listaUsuariosData,
      usuariosSeleccionados,
      tipoCierreCaja,
      tipoCierreCajaData,
      tipoReporteContador,
      ip,
      cierreFiscal,
      cierreNoFiscal,
      cierreConsolidado,
      cierreData,
      cierreCaja,
      acceso,
      rol
    };
  },

  methods: {
    finalizar() {
      let tipo = ref(null);
      let usuario = ref(null);
      let usuario2 = ref(null);
      let usuario3 = ref(null);
      console.log("el length", this.usuarios.length);

      if (this.usuarios[0].id_usuario == 0) {
        console.log("entro en todos");
        tipo.value = 1;

        this.usuariosSeleccionados.push({
          nombre: this.usuarios[0].usuario_username,
        });
      } else {
        if (this.usuarios.length == 1 && this.usuarios[0].id_usuario != 0) {
          console.log("entro en uno");
          tipo.value = 2;

          usuario.value = this.usuarios[0].id_usuario;

          this.usuariosSeleccionados.push({
            nombre: this.usuarios[0].usuario_username,
          });
        } else if (this.usuarios.length == 2) {
          console.log("entro en dos");
          tipo.value = 3;

          usuario.value = this.usuarios[0].id_usuario;
          usuario2.value = this.usuarios[1].id_usuario;

          this.usuariosSeleccionados.push(
            {
              nombre: this.usuarios[0].usuario_username,
            },
            {
              nombre: this.usuarios[1].usuario_username,
            }
          );
        } else if (this.usuarios.length == 3) {
          console.log("entro en tres");
          tipo.value = 4;

          usuario.value = this.usuarios[0].id_usuario;
          usuario2.value = this.usuarios[1].id_usuario;
          usuario3.value = this.usuarios[2].id_usuario;

          this.usuariosSeleccionados.push(
            {
              nombre: this.usuarios[0].usuario_username,
            },
            {
              nombre: this.usuarios[1].usuario_username,
            },
            {
              nombre: this.usuarios[2].usuario_username,
            }
          );
        }
      }

      let busqueda = {
        from: this.from,
        to: this.to,
        id_usuario: usuario.value,
        id_usuario2: usuario2.value,
        id_usuario3: usuario3.value,
        tipo: tipo.value,
      };

      console.log(busqueda);

      if (this.tipoCierreCaja == 1) {
        console.log("entro fiscal");
        axios
          .post(this.ip + "cierreDeCajaFiscal", busqueda)
          .then((response) => {
            //console.log("EL RESPONSE", response.data);
            this.cierreData = response.data;
            console.log(this.cierreData);
            this.cierreCaja = false;
            this.cierreFiscal = true;
          });
      } else if (this.tipoCierreCaja == 2) {
        console.log("entro no fiscal");
        axios
          .post(this.ip + "cierreDeCajaNoFiscal", busqueda)
          .then((response) => {
            //console.log("EL RESPONSE", response.data);
            this.cierreData = response.data;
            console.log(this.cierreData);
            this.cierreCaja = false;
            this.cierreNoFiscal = true;
          });
      } else {
        console.log("entro consolidado");
        axios
          .post(this.ip + "cierreDeCajaConsolidado", busqueda)
          .then((response) => {
            console.log("EL RESPONSEs", response.data);
            this.cierreData = response.data;
            console.log(this.cierreData);
            this.cierreCaja = false;
            this.cierreConsolidado = true;
          });
      }
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 61,
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
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
