<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <q-card flat bordered class="cards">
          <q-card-section>
            <div class="row">
              <div class="col-6">
                <p class="text-h6 q-mb-none q-mt-xs">
                  Detalle de registro convenio
                </p>
              </div>
              <div class="col-6 text-right align-center">
                <q-btn
                  color="primary"
                  label="Anular"
                  @click="modalAnular"
                  v-if="
                    (this.rol == 5 || this.rol == 6) &&
                    this.registro.estatus ==1
                  "
                  class="q-mr-md"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row">
              <div class="col-6">
                <div class="row">
                  <div class="col-12 text-subtitle1">
                    Nombre del cliente: {{ this.cliente.cliente_nombre }}
                    {{ this.cliente.cliente_apellido }}
                  </div>
                  <div class="col-12 text-subtitle1">
                    Cédula/RIF: {{ this.cliente.cedula_RIF }}
                  </div>
                  <div class="col-12 text-subtitle1">
                    Usuario de creación: {{ this.nombre_usuario }}
                  </div>
                  <div
                    class="col-12 text-subtitle1"
                    v-if="motivo_anulacion != null"
                  >
                    Motivo de anulación: {{ this.motivo_anulacion }}
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-12 text-subtitle1">
                    Numero de registro: {{ this.numero_factura }}
                  </div>
                  <div class="col-6 text-subtitle1" v-if="this.registro.estatus == 0">
                    Estatus: <span class="text-red">POR PAGAR</span>
                  </div>
                  <div class="col-6 text-subtitle1" v-else-if="this.registro.estatus == 1">Estatus: PAGADO</div>
                  <div class="col-6 text-subtitle1" v-else-if="this.registro.estatus == 2">Estatus: ANULADO</div>
                  <div class="col-6 text-subtitle1" v-else-if="this.registro.estatus == 3">Estatus: FACTURADO</div>
                  <div class="col-12 text-subtitle1">
                    Fecha de creación: {{ this.fecha_creacion }}
                  </div>
                </div>
              </div>
            </div>
            <div class="row text-subtitle1">
              Ordenes: -
              <template v-for="orden in ordenes">
                {{ orden.numero_orden }} -
              </template>
            </div>
            <div class="row q-mt-md">
              <div class="col-4 text-subtitle1">
                Total en Bolivares: {{ this.totalBs }}
              </div>
              <div class="col-4 text-subtitle1">
                Total en Dolares: {{ this.totalDolares }}
              </div>
              <div class="col-4 text-subtitle1">
                Total en Pesos: {{ this.totalPesos }}
              </div>
            </div>
          </q-card-section>

          <q-card-section class="text-right">
            <q-btn
              class="q-ml-xl"
              color="primary"
              label="Volver"
              @click="onCancelar"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- MODAL CONFIRMACION ANULACION FACTURA -->
    <q-dialog v-model="modalMotivo">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <span class="q-ml-sm">
            <div class="text-subtitle1">Ingrese el concepto.</div>
            <q-input v-model="motivo" label="concepto" class="text-uppercase" />
          </span>
        </q-card-section>

        <q-card-actions align="right" class="q-mb-md">
          <!-- CANCELAR INHABILITAR FACTURA -->
          <q-btn
            flat
            label="Cancelar"
            color="grey-9"
            class="q-mr-lg"
            v-close-popup
          />

          <!-- INHABILITAR FACTURA -->
          <q-btn
            unelevated
            label="Siguiente"
            color="primary"
            class="q-mr-md"
            @click="crearNota()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
  props: ["registro", "cliente"],

  data() {
    let fecha_creacion = this.registro.fecha;
    let numero_factura = this.registro.numero_registro_convenio;
    let tipo = ref(null);
    let status = ref(null);
    let nombre_usuario = ref(null);
    let nombre_cliente = ref(null);
    let cedula_RIF = ref(null);
    let totalDolares = this.registro.total_dolares;
    let totalPesos = this.registro.total_pesos;
    let totalBs = this.registro.total_bolivares;
    let modalMotivo = ref(false);
    let motivo = ref(null);
    let usuario_anulacion = ref(null);
    let motivo_anulacion = ref(null);
    let rol = parseInt(localStorage.rol);
    let acceso = ref(null);
    let ordenes = this.registro.ordenes;

    const ip = process.env.BASE_URL;

    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      ip,
      fecha_creacion,
      numero_factura,
      tipo,
      status,
      nombre_usuario,
      nombre_cliente,
      cedula_RIF,
      totalDolares,
      totalPesos,
      totalBs,
      modalMotivo,
      motivo,
      usuario_anulacion,
      motivo_anulacion,
      rol,
      acceso,
      ordenes,
    };
  },

  methods: {
    // CANCELAR //
    onCancelar() {
      this.$emit("onCancelar", false);
    },

    // ANULAR LA FACTURA SIN NOTA A CREDITO
    modalAnular() {
      console.log("teehee");
      this.modalMotivo = true;
    },

    // ACTIVA EL MODAL DE PAGOS DE LAS NOTAS O ENVIA LA ANULACION
    crearNota() {
      this.modalMotivo = false;
      let usuario = parseInt(localStorage.id);

      let anular = {
        anulacion_motivo: this.motivo.toUpperCase(),
        id_registro_convenio: this.registro.id_registro_convenio,
        id_usuario: usuario,
      };

      axios
        .post(this.ip + "anulacionRegistroConvenio", anular)
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
          this.$router.go();
        });
    },

    validar() {
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        id_rol: parseInt(localStorage.rol),
        id_tarea: 54,
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
    console.log("elreci", this.registro);
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);

      return this.acceso;
    },
  },
};
</script>
