<template>
  <q-page padding>
    <div class="fit row justify-center">
      <div class="col-12">
        <!-- CARD DE FACTURACION -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">FORMAS DE PAGO</div>
          </q-card-section>

          <q-card-section>
            <div class="row text-blue-grey-7">
              <!-- TOTAL A PAGAR -->
              <div class="col-4">
                <div class="text-h6">
                  Total en bolivares:
                  {{ getBsFijo }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-h6">Total en pesos: {{ getPesosFijo }}</div>
              </div>
              <div class="col-3">
                <div class="text-h6">
                  Total en dolares:
                  {{ totalDolares }}
                </div>
              </div>
            </div>

            <div class="row">
              <!-- SUBTOTAL A PAGAR -->
              <div class="col-4">
                <div class="text-h5 text-weight-medium text-primary">
                  Subtotal en bolivares: {{ getBs }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-h5 text-weight-medium text-primary">
                  Subtotal en pesos: {{ getPesos }}
                </div>
              </div>
              <div class="col-3">
                <div class="text-h5 text-weight-medium text-primary">
                  Subtotal en dolares:
                  {{ getDolares }}
                </div>
              </div>
            </div>

            <template
              v-if="
                this.idTipoFactura != 3 &&
                this.idTipoFactura != 4 &&
                this.idTipoFactura != 5
              "
            >
              <div class="row" v-if="this.igtf === false">
                <!--IGTF A PAGAR -->
                <div class="col-4">
                  <div class="text-h6">IGTF en bolivares: {{ getIgtfBs }}</div>
                </div>
                <div class="col-4">
                  <div class="text-h6">IGTF en pesos: {{ getIgtfPesos }}</div>
                </div>
                <div class="col-3">
                  <div class="text-h6">
                    IGTF en dolares:
                    {{ getIgtfDolares }}
                  </div>
                </div>
              </div>
              <div class="row text-grey-7" v-else>
                <!--IGTF A PAGAR -->
                <div class="col-4">
                  <div class="text-h6">IGTF en bolivares: {{ getIgtfBs }}</div>
                </div>
                <div class="col-4">
                  <div class="text-h6">IGTF en pesos: {{ getIgtfPesos }}</div>
                </div>
                <div class="col-3">
                  <div class="text-h6">
                    IGTF en dolares:
                    {{ getIgtfDolares }}
                  </div>
                </div>
              </div>
            </template>

            <div class="row">
              <!-- VUELTOS A PAGAR -->
              <div class="col-4">
                <div class="text-h6">
                  Vueltos en bolivares: {{ getVueltosBs }}
                </div>
              </div>
              <div class="col-4">
                <div class="text-h6">
                  Vueltos en pesos: {{ getVueltosPesos }}
                </div>
              </div>
              <div class="col-3">
                <div class="text-h6">
                  Vueltos en dolares:
                  {{ getVueltosDolares }}
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="row justify-end q-mb-lg">
              <div class="col-3">
                <q-btn
                  label="Agregar metodo de pago"
                  @click="addMetodoDePago"
                  color="primary"
                />
              </div>
              <q-space />
              <div class="col-1">
                <q-input
                  v-model="descuento"
                  label="desc"
                  v-if="this.pagos.length == 0"
                >
                  <template v-slot:append> % </template>
                </q-input>
                <q-input v-model="descuento" label="desc" disable v-else>
                  <template v-slot:append> % </template>
                </q-input>
              </div>
              <div class="col-1 q-mt-md q-ml-lg">
                <q-btn
                  label="Verificar"
                  @click="aplicarDescuento"
                  color="primary"
                  v-if="
                    this.pagos.length == 0 &&
                    this.from == 1 &&
                    (this.rol == 5 || this.rol == 6)
                  "
                  id="descBtn"
                />
                <q-btn
                  label="Verificar"
                  @click="aplicarDescuento"
                  color="primary"
                  disable
                  v-else
                />
              </div>
            </div>

            <div v-for="(pago, index) in pagos" :key="index">
              <div class="row">
                <div class="col-1">
                  <q-input
                    v-model.number="pago.monto"
                    label="Monto"
                    type="number"
                  />
                </div>
                <div class="col-1">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_divisa"
                    option-label="divisa_nombre"
                    v-model="pago.id_divisa"
                    :options="divisasDatos"
                    label="Divisa"
                    class="q-ml-lg"
                  />
                </div>
                <div class="col-2">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_tipo_pago"
                    option-label="tipo_pago_nombre"
                    v-model="pago.id_tipo_pago"
                    :options="tiposDePagoDatos"
                    label="Tipo de pago"
                    class="q-ml-lg"
                  />
                </div>
                <div class="col-2">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_banco"
                    option-label="banco_nombre"
                    v-model="pago.id_banco"
                    :options="bancosDatos"
                    label="Banco"
                    class="q-ml-lg"
                    v-show="pago.id_tipo_pago != 2 && pago.id_tipo_pago != null"
                  />
                </div>
                <div class="col-2">
                  <q-input
                    v-model="pago.numero_referencia"
                    label="# de referencia"
                    class="q-ml-lg"
                    v-show="pago.id_tipo_pago == 1"
                  />
                </div>
                <div class="col-2 self-center text-center">
                  <q-checkbox
                    v-model="pago.tipo_registro"
                    label="Vueltos"
                    true-value="1"
                    false-value="0"
                    q-pb-none
                  />
                  <q-checkbox
                    v-model="pago.igtf_pago"
                    label="IGTF"
                    true-value="1"
                    false-value="0"
                  />
                </div>
                <div class="col-2 self-center text-right">
                  <q-btn
                    icon="done"
                    @click="restanteDolares(index)"
                    color="primary"
                  />
                  <q-btn
                    icon="delete"
                    @click="eliminarPago(index)"
                    color="primary"
                    class="q-ml-sm"
                  />
                </div>
              </div>
            </div>

            <div class="row q-mt-xl">
              <q-space />
              <div class="col-1 text-right q-pt-md">
                <q-btn
                  label="Cancelar"
                  @click="onCancel"
                  color="grey-9"
                  flat
                  v-if="this.ifCancel == 1"
                />
                <q-btn
                  label="Cancelar"
                  @click="cancelar"
                  color="grey-9"
                  flat
                  v-if="this.ifCancel == 0"
                />
              </div>
              <div class="col-1 text-right q-pt-md">
                <q-btn
                  label="Facturar"
                  @click="finalizar"
                  color="primary"
                  v-if="comprobacion == false"
                />
                <q-btn
                  label="Facturar"
                  @click="finalizar"
                  color="primary"
                  disable
                  v-else
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- MODAL VERIFICACION PAGO TOTAL -->
    <q-dialog
      v-model="faltaPlata"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">Saldo incompleto.</div>
          </span>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- ACEPTAR -->
          <q-btn
            unelevated
            label="Aceptar"
            color="primary"
            class="q-mr-md"
            @click="this.faltaPlata = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL VERIFICACION PAGO TOTAL -->
    <q-dialog
      v-model="modalMalPago"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">Por favor ingrese todos los campos</div>
          </span>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- ACEPTAR -->
          <q-btn
            unelevated
            label="Aceptar"
            color="primary"
            class="q-mr-md"
            @click="this.modalMalPago = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MODAL VERIFICACION PAGO TOTAL -->
    <q-dialog
      v-model="modalMalIGTF"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">El el monto de igtf es incorrecto.</div>
          </span>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <!-- ACEPTAR -->
          <q-btn
            unelevated
            label="Aceptar"
            color="primary"
            class="q-mr-md"
            @click="this.modalMalIGTF = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  props: [
    "totalDolares",
    "cambioPesosActual",
    "cambioPesosFactura",
    "cambioBs",
    "idFactura",
    "idTipoFactura",
    "from",
    "ifCancel",
    "pagosFactura",
    "debeDolares",
    "igtfDolares",
    "descuento_fijo",
  ],

  data() {
    // MODALES
    let faltaPlata = ref(false);
    let modalMalPago = ref(false);
    // VARIABLES
    let divisasDatos = ref(null);
    let bancosDatos = ref(null);
    let tiposDePagoDatos = ref(null);
    let divisa = ref(null);
    let id_dolares = ref(null);
    let id_pesos = ref(null);
    let id_bolivares = ref(null);
    let id_registro_dolares = ref(null);
    let id_registro_pesos = ref(null);
    let id_registro_bolivares = ref(null);
    const aux_total = ref([]);
    let total_dolares = this.totalDolares;
    let total_dolares_descuento = this.totalDolares;
    let descuento = this.descuento_fijo;
    let descuento_dolares = 0;
    let sumatoria_abono = 0;
    let precioFijoDolares = this.totalDolares;
    let precioFijoPesos = 0;
    let precioFijoBs = 0;
    let cambioPesosArreglado = 0;
    let igtf_dolares = 0;
    let sumDol = 0;
    let sumPesos = 0;
    let sumBs = 0;
    let comprobacion = ref(false);
    let rol = parseInt(localStorage.rol);

    const ip = process.env.BASE_URL;

    let pagos = ref([]);
    let pagos_aux = ref([]);
    let eliminados_aux = ref([]);

    return {
      comprobacion,
      divisasDatos,
      bancosDatos,
      tiposDePagoDatos,
      divisa,
      pagos,
      id_dolares,
      id_pesos,
      id_bolivares,
      id_registro_dolares,
      id_registro_pesos,
      id_registro_bolivares,
      aux_total,
      ip,
      total_dolares,
      total_dolares_descuento,
      faltaPlata,
      descuento,
      descuento_dolares,
      sumatoria_abono,
      pagos_aux,
      eliminados_aux,
      precioFijoDolares,
      precioFijoPesos,
      precioFijoBs,
      cambioPesosArreglado,
      igtf_dolares,
      sumDol,
      sumPesos,
      sumBs,
      igtf: false,
      igtf_acum: igtf_dolares,
      modalMalIGTF: false,
      malIGTF: false,
      modalMalPago,
      rol,
      agrego_pago: false,
    };
  },

  methods: {
    cancelar() {
      this.$router.go();
    },

    // CANCELAR EL PROCESO DE PAGOS
    onCancel() {
      this.$emit("cancelarPagos", false);
    },

    addMetodoDePago() {
      this.pagos.push({
        monto: 0,
        id_registro_divisa: null,
        divisa_nombre: null,
        id_divisa: null,
        id_tipo_pago: null,
        id_banco: null,
        numero_referencia: null,
        tipo_registro: "0",
        agregado: "0",
        igtf_pago: "0",
        igtf_monto: 0,
        accion: 1,
      });
    },

    aplicarDescuento() {
      console.log("entro jeje");

      let descuento = 0;
      descuento =
        this.totalDolares - (this.totalDolares * this.descuento) / 100;
      this.descuento_dolares = (this.totalDolares * this.descuento) / 100;
      this.total_dolares = descuento;
      this.total_dolares_descuento = this.total_dolares;
      //this.descuento = this.descuento_fijo;
      //document.getElementById("descBtn").disabled = true;

      console.log(this.total_dolares);
      console.log(this.descuento_dolares);
    },

    /* !!!!! ELIMINAR PAGOS !!!!!!!!*/
    eliminarPago(index) {
      console.log(this.pagos, this.pagos_aux);
      console.log("son vueltos eliminados??", this.pagos[index].tipo_registro);
      console.log("SE PUEDE ELIMINAR?", this.pagos[index].agregado);

      // EL PAGO HA SIDO AGREGADO, SE PUEDE ELIMINAR
      if (this.pagos[index].agregado == "1") {
        console.log("Si se puede eliminar");

        let sumar = 0;

        // NO ES IGTF
        if (this.pagos[index].igtf_pago == "0") {
          console.log("NO ES IGTF");
          if (this.pagos[index].id_divisa == this.id_dolares) {
            console.log("el eliminado es dolares");
            sumar = this.pagos[index].monto;
          } else if (this.pagos[index].id_divisa == this.id_pesos) {
            console.log("el eliminado es pesos");
            sumar = this.pagos[index].monto / this.cambioPesosArreglado;
          } else if (this.pagos[index].id_divisa == this.id_bolivares) {
            console.log("el eliminado es bolivares");
            sumar = this.pagos[index].monto / this.cambioBs;
          }

          console.log(this.pagos[index].accion, this.total_dolares, this.from);
          if (
            this.pagos[index].accion == 2 &&
            this.total_dolares == 0 &&
            this.from == 2
          ) {
            this.total_dolares = this.total_dolares - this.igtf_dolares;
          }
        } else {
          console.log("ES IGTF");
          this.igtf = false;
          this.malIGTF = false;
        }

        console.log(this.total_dolares);
        console.log("el sumar", sumar);
        console.log("lolares", this.totalDolares);
        console.log(this.total_dolares);

        sumar = Number(Math.round(sumar + "e+2") + "e-2");
        console.log("EL SUMAR AGAIN", sumar);

        if (this.pagos[index].tipo_registro == "1") {
          this.total_dolares = this.total_dolares - sumar;
        } else {
          this.total_dolares = this.total_dolares + sumar;
        }

        console.log("LOLARITOS", this.total_dolares);

        //// SI AL ELIMINAR EL total_dolares REDONDEADO ES IGUAL A
        //// totalDolares ENTONCES SE HACE QUE EL total_dolares SEA IGUAL
        //// AL totalDolares PARA QUE EL MONTO QUEDE COMO ES
        if (
          Number(Math.round(this.total_dolares + "e+2") + "e-2") ==
          this.totalDolares
        ) {
          this.total_dolares = this.totalDolares;
        }

        if (
          (this.pagos[index].id_divisa == this.id_dolares ||
            this.pagos[index].id_divisa == this.id_pesos) &&
          this.pagos[index].tipo_registro == "0" &&
          this.pagos[index].igtf_pago == "0"
        ) {
          console.log("2");
          this.igtf_dolares = this.igtf_dolares - this.pagos[index].igtf_monto;
        }

        this.igtf_dolares = Number(
          Math.round(this.igtf_dolares + "e+2") + "e-2"
        );

        console.log("EL IGTF ELIMINADO", this.igtf_dolares);

        this.eliminados_aux.push({
          id_registro_pago: this.pagos[index].id_registro_pago,
        });

        console.log("el aux_eliminados", this.eliminados_aux);

        var prueba = this.pagos_aux.splice(index, 1);
        console.log("LA ELIMINADA", prueba);
      }

      // IGUAL SE ELIMINA DEL REGISTRO PERO NO SE HACEN OPERACIONES
      var prueba = this.pagos.splice(index, 1);
      console.log("LA ELIMINADA", prueba);
    },

    // CALCULA EL RESTANTE A PAGAR
    restanteDolares(index) {
      this.agrego_pago = true;
      let acumDolares = 0;
      let acumPesos = 0;
      let acumBs = 0;
      let acumTotal = 0;
      let restDolares = 0;
      let restPesos = 0;
      let restBs = 0;
      let restTotal = 0;

      console.log("acum bs", acumBs);
      console.log("cambio pesos", this.cambioPesosArreglado);
      console.log("son vueltos agregando?", this.pagos[index].tipo_registro);

      ///////---- VERIFICA SI LOS DATOS OBLIGATORIOS DEL REGISTRO SE INGRESARON ------/////
      if (
        this.pagos[index].monto > 0 &&
        this.pagos[index].id_divisa != null &&
        this.pagos[index].id_tipo_pago != null
      ) {
        /////--- SI LOS INGRESO TODOS LOS OBLIGATORIOS ENTRA AQUI ---/////

        ////--- VERIFICA SI EL TIPO DE PAGO ES DIFERENTE A EFECTIVO---////
        if (this.pagos[index].id_tipo_pago != 2) {
          /////--- SI DIFERENTE DE EFECTIVO ENTRA PORQUE NECESITA UN BANCO ---/////

          ////--- VERIFICA QUE HAYA INGRESADO EL BANCO SI ES DIFERENTE DE EFECTIVO---////
          if (this.pagos[index].id_banco != null) {
            // SI INGRESO TODOS LOS DATOS OBLIGATORIOS, EL DIFERENTE DE EFECTIVO
            // Y METIERON EL BANCO PASA
            if (this.pagos[index].agregado == "1") {
              ////// ------- SI ES PARA MODIFICAR ------- //////
              console.log("entro a modificar");
              console.log("el pagos_aux", this.pagos_aux);

              //// ---- EL PAGO VIEJO NO ES IGTF ---- ////
              if (this.pagos_aux[index].igtf_pago == "0") {
                // ELIMINAR EL MONTO AGREGADO ANTERIORMENTE
                if (this.pagos_aux[index].id_divisa == this.id_dolares) {
                  // EN DOLARES
                  console.log("en dolares el aux", this.pagos_aux[index].monto);
                  restDolares = parseFloat(this.pagos_aux[index].monto);
                } else if (this.pagos_aux[index].id_divisa == this.id_pesos) {
                  //EN PESOS
                  console.log("en pesos el aux", this.pagos_aux[index].monto);
                  restPesos = parseFloat(this.pagos_aux[index].monto);
                  restPesos = restPesos / this.cambioPesosArreglado;
                } else if (
                  this.pagos_aux[index].id_divisa == this.id_bolivares
                ) {
                  // EN BOLIVARES
                  console.log("en bs el aux", this.pagos_aux[index].monto);
                  restBs = parseFloat(this.pagos_aux[index].monto);
                  restBs = restBs / this.cambioBs;
                  console.log("rest bs", restBs);
                }

                restTotal = restBs + restPesos + restDolares;

                console.log("EL REST TOTAL", restTotal);
                console.log("---------------!!!!!!!!!!!!!!--------------");

                console.log(
                  "EL TTTOTAL",
                  this.total_dolares,
                  restTotal,
                  this.pagos_aux,
                  this.pagos_aux[index],
                  this.igtf_dolares,
                  index
                );

                //// ---- REDONDEA EL TOTAL ACUM PARA VER SI ES MAYOR AL DE LA FACTURA ---- ////
                let aux_dol_redondeado_eliminar = Number(
                  Math.round(this.total_dolares + "e+2") + "e-2"
                );
                let igtf_antes = this.igtf_dolares;
                let igtfdepago = this.pagos_aux[index].igtf_monto;

                console.log("EL ITF ANTES", igtf_antes, igtfdepago);
                if (
                  this.pagos_aux[index].id_divisa == this.id_dolares ||
                  this.pagos_aux[index].id_divisa == this.id_pesos
                ) {
                  console.log("2");
                  this.igtf_dolares =
                    this.igtf_dolares - this.pagos_aux[index].igtf_monto;
                }
                console.log("EL ITF DESPUES", this.igtf_dolares);

                //// ---- SI ERAN VUELTOS LE RESTA AL TOTAL ACUM ---- ////
                if (this.pagos_aux[index].tipo_registro == "1") {
                  console.log("es vueltos");
                  this.total_dolares = this.total_dolares - restTotal;
                } else {
                  // -- SI NO SON VUELTOS SE SUMA -- //
                  console.log("no es vueltos");
                  this.total_dolares = this.total_dolares + restTotal;
                }

                console.log("los lolares totales", this.total_dolares);
              } else {
                //// SI EL PAGO ANTERIOR ERA IGTF --revisar
                this.igtf = false;
                this.malIGTF = false;
                console.log(
                  "ERA IGTF, SE RESETEA TODO",
                  this.igtf,
                  this.malIGTF
                );
              }

              // SI EL NUEVO ES IGTF -- revisar
              if (this.pagos[index].igtf_pago == "1") {
                this.igtf = true;
                console.log("entro a modificacion", this.pagos[index]);

                // AGREGAR EL MONTO NUEVO
                if (this.pagos[index].id_divisa == this.id_dolares) {
                  // EN DOLARES
                  console.log("EL IGTF LOLARES", this.pagos[index].monto);
                  if (this.pagos[index].monto == this.igtf_dolares) {
                    this.pagos[index].id_registro_divisa =
                      this.id_registro_dolares;
                    this.pagos[index].divisa_nombre = "DOLARES";
                    console.log("en dolares", this.pagos[index].monto);
                    console.log(
                      "el registro divisa",
                      this.pagos[index].id_registro_divisa
                    );
                    this.malIGTF = false;
                  } else {
                    this.modalMalIGTF = true;
                    this.malIGTF = true;
                    console.log("SE HIZO UN MAL IGTF");
                  }
                } else if (this.pagos[index].id_divisa == this.id_pesos) {
                  //EN PESOS
                  let igtfPesos = Number(
                    Math.round(
                      this.pagos[index].monto / this.cambioPesosArreglado +
                        "e+2"
                    ) + "e-2"
                  );

                  console.log(
                    "EL IGTF PEPSOS",
                    igtfPesos,
                    this.pagos[index].monto / this.cambioPesosArreglado
                  );
                  if (igtfPesos == this.igtf_dolares) {
                    this.pagos[index].id_registro_divisa =
                      this.id_registro_pesos;
                    this.pagos[index].divisa_nombre = "PESOS";
                    this.malIGTF = false;
                  } else {
                    this.modalMalIGTF = true;
                    this.malIGTF = true;
                  }
                } else if (this.pagos[index].id_divisa == this.id_bolivares) {
                  // EN BOLIVARES
                  let igtfBs = Number(
                    Math.round(
                      this.pagos[index].monto / this.cambioBs + "e+2"
                    ) + "e-2"
                  );

                  console.log(
                    "EL IGTF BOLOS",
                    igtfBs,
                    this.pagos[index].monto / this.cambioBs
                  );

                  if (igtfBs == this.igtf_dolares) {
                    this.pagos[index].id_registro_divisa =
                      this.id_registro_bolivares;
                    this.pagos[index].divisa_nombre = "BOLIVARES";
                    this.malIGTF = false;
                  } else {
                    this.modalMalIGTF = true;
                    this.malIGTF = true;
                  }
                }
              } else {
                //// ---- SI NO ES IGTF ---- ////

                //// ----------- AGREGAR EL MONTO NUEVO ----------- ////
                if (this.pagos[index].id_divisa == this.id_dolares) {
                  // EN DOLARES
                  this.pagos[index].id_registro_divisa =
                    this.id_registro_dolares;
                  this.pagos[index].divisa_nombre = "DOLARES";
                  console.log("en dolares", this.pagos[index].monto);
                  console.log(
                    "el registro divisa",
                    this.pagos[index].id_registro_divisa
                  );
                  acumDolares += parseFloat(this.pagos[index].monto);
                } else if (this.pagos[index].id_divisa == this.id_pesos) {
                  //EN PESOS
                  this.pagos[index].id_registro_divisa = this.id_registro_pesos;
                  this.pagos[index].divisa_nombre = "PESOS";
                  acumPesos += parseFloat(this.pagos[index].monto);

                  console.log(
                    "el registro divisa",
                    this.pagos[index].id_registro_divisa
                  );
                  acumPesos = acumPesos / this.cambioPesosArreglado;
                } else if (this.pagos[index].id_divisa == this.id_bolivares) {
                  // EN BOLIVARES
                  this.pagos[index].id_registro_divisa =
                    this.id_registro_bolivares;
                  this.pagos[index].divisa_nombre = "BOLIVARES";
                  acumBs += parseFloat(this.pagos[index].monto);
                  acumBs = acumBs / this.cambioBs;
                  console.log("acum bs", acumBs);
                }
              }

              console.log("el pagos_aux", this.pagos_aux[index]);
            } else {
              // ------------ SI ES PARA AGREGAR  ------------ //
              console.log("entro a crear", this.pagos[index]);

              //////// SI EL PAGO ES IGTF /////////
              if (this.pagos[index].igtf_pago == "1") {
                //--------- AGREGAR EL MONTO NUEVO ---------//
                if (this.pagos[index].id_divisa == this.id_dolares) {
                  // EN DOLARES
                  console.log("EL IGTF LOLARES", this.pagos[index].monto);
                  if (
                    this.pagos[index].monto ==
                    Number(Math.round(this.igtf_dolares + "e+2") + "e-2")
                  ) {
                    this.pagos[index].id_registro_divisa =
                      this.id_registro_dolares;
                    this.pagos[index].divisa_nombre = "DOLARES";
                    console.log("en dolares", this.pagos[index].monto);
                    console.log(
                      "el registro divisa",
                      this.pagos[index].id_registro_divisa
                    );
                    this.malIGTF = false;
                  } else {
                    this.modalMalIGTF = true;
                    this.malIGTF = true;
                  }
                } else if (this.pagos[index].id_divisa == this.id_pesos) {
                  //EN PESOS
                  let igtfPesos = Number(
                    Math.round(
                      this.pagos[index].monto / this.cambioPesosArreglado +
                        "e+2"
                    ) + "e-2"
                  );

                  console.log(
                    "EL IGTF PEPSOS",
                    igtfPesos,
                    this.pagos[index].monto / this.cambioPesosArreglado
                  );
                  if (
                    igtfPesos ==
                    Number(Math.round(this.igtf_dolares + "e+2") + "e-2")
                  ) {
                    this.pagos[index].id_registro_divisa =
                      this.id_registro_pesos;
                    this.pagos[index].divisa_nombre = "PESOS";
                    this.malIGTF = false;
                  } else {
                    this.modalMalIGTF = true;
                    this.malIGTF = true;
                  }
                } else if (this.pagos[index].id_divisa == this.id_bolivares) {
                  // EN BOLIVARES
                  let igtfBs = Number(
                    Math.round(
                      this.pagos[index].monto / this.cambioBs + "e+2"
                    ) + "e-2"
                  );

                  console.log(
                    "EL IGTF BOLOS",
                    igtfBs,
                    this.pagos[index].monto / this.cambioBs,
                    this.igtf_dolares
                  );

                  if (
                    igtfBs ==
                    Number(Math.round(this.igtf_dolares + "e+2") + "e-2")
                  ) {
                    this.pagos[index].id_registro_divisa =
                      this.id_registro_bolivares;
                    this.pagos[index].divisa_nombre = "BOLIVARES";
                    this.malIGTF = false;
                  } else {
                    this.modalMalIGTF = true;
                    this.malIGTF = true;
                  }
                }

                if (this.modalMalIGTF == false) {
                  console.log("AAAY YA");
                  this.igtf = true;
                  console.log("entro a igtf", this.igtf);
                  this.pagos[index].agregado = "1";
                }
              } else {
                /////////// SI EL PAGO ES PAGO /////////////

                console.log("el aux de pagos", this.pagos_aux);

                // CALCULA EL TOTAL
                if (this.pagos[index].id_divisa == this.id_dolares) {
                  // EN DOLARES
                  this.pagos[index].id_registro_divisa =
                    this.id_registro_dolares;
                  this.pagos[index].divisa_nombre = "DOLARES";
                  console.log("en dolares", this.pagos[index].monto);
                  console.log(
                    "el registro divisa",
                    this.pagos[index].id_registro_divisa
                  );
                  acumDolares += parseFloat(this.pagos[index].monto);
                } else if (this.pagos[index].id_divisa == this.id_pesos) {
                  //EN PESOS
                  this.pagos[index].id_registro_divisa = this.id_registro_pesos;
                  this.pagos[index].divisa_nombre = "PESOS";
                  console.log("en pesos", this.pagos[index].monto);
                  console.log(
                    "el registro divisa",
                    this.pagos[index].id_registro_divisa
                  );
                  acumPesos += parseFloat(this.pagos[index].monto);
                  acumPesos = acumPesos / this.cambioPesosArreglado;
                } else if (this.pagos[index].id_divisa == this.id_bolivares) {
                  // EN BOLIVARES
                  this.pagos[index].id_registro_divisa =
                    this.id_registro_bolivares;
                  this.pagos[index].divisa_nombre = "BOLIVARES";

                  console.log("en bs", this.pagos[index].monto);
                  console.log(
                    "el registro divisa",
                    this.pagos[index].id_registro_divisa
                  );

                  acumBs += parseFloat(this.pagos[index].monto);
                  acumBs = acumBs / this.cambioBs;
                  console.log("acum bs", acumBs);
                }

                this.pagos[index].agregado = "1";
                console.log("el agregado en true", this.pagos[index].agregado);
                console.log(
                  "los vueltos en true?",
                  this.pagos[index].tipo_registro
                );
              }
            }

            if (this.modalMalIGTF == false) {
              acumTotal = acumBs + acumPesos + acumDolares;

              console.log("EL ACUM TOTAL", acumTotal);
              console.log("----------------!!!!!!!!!!!!!!--------------");
              console.log(
                "ANTES DE AGGREGAR",
                this.total_dolares,
                acumTotal,
                this.pagos[index]
              );

              let aux_dol_redondeado = Number(
                Math.round(this.total_dolares + "e+2") + "e-2"
              );

              // ----- PARA EL CALCULO DE IGTF ----- //
              if (aux_dol_redondeado > 0) {
                // --- SON DOLARES???
                if (this.pagos[index].id_divisa == this.id_dolares) {
                  console.log("entro 2");
                  if (acumDolares < aux_dol_redondeado) {
                    this.igtf_dolares += acumDolares * 0.03;
                    this.pagos[index].igtf_monto = acumDolares * 0.03;
                    console.log("EL ITF KE ES", this.pagos[index].igtf_monto);
                  } else if (acumDolares >= aux_dol_redondeado) {
                    this.igtf_dolares += aux_dol_redondeado * 0.03;
                    this.pagos[index].igtf_monto = aux_dol_redondeado * 0.03;
                    console.log("EL ITF KE ES", this.pagos[index].igtf_monto);
                  }

                  // --- SON PESOS???
                } else if (this.pagos[index].id_divisa == this.id_pesos) {
                  console.log("entro 3");
                  if (acumPesos < aux_dol_redondeado) {
                    this.igtf_dolares += acumPesos * 0.03;
                    this.pagos[index].igtf_monto = acumPesos * 0.03;
                    console.log("EL ITF KE ES", this.pagos[index].igtf_monto);
                  } else if (acumPesos >= aux_dol_redondeado) {
                    this.igtf_dolares += aux_dol_redondeado * 0.03;
                    this.pagos[index].igtf_monto = aux_dol_redondeado * 0.03;
                    console.log("EL ITF KE ES", this.pagos[index].igtf_monto);
                  }
                }
              }

              this.igtf_dolares = Number(
                Math.round(this.igtf_dolares + "e+2") + "e-2"
              );

              //// ---- VERIFICA SI EL PAGO SON VUELTOS ---- ////
              ////// SI SON VUELTOS SE SUMAN AL TOTAL ACUM //////
              // ------ OJO EL TOTAL ACUM CUANDO SE PAGA TODO ES CERO POR ESO SE SUMA ------ //
              if (this.pagos[index].tipo_registro == "1") {
                this.total_dolares = this.total_dolares + acumTotal;
              } else {
                //// SI ES UN PAGO NORMAL SE LE RESTA AL TOTAL ACUM ////
                this.total_dolares = this.total_dolares - acumTotal;
              }

              this.pagos_aux[index] = {
                monto: this.pagos[index].monto,
                id_divisa: this.pagos[index].id_divisa,
                tipo_registro: this.pagos[index].tipo_registro,
                igtf_pago: this.pagos[index].igtf_pago,
                igtf_monto: this.pagos[index].igtf_monto,
              };

              // --- SI LO QUE HAN PAGADO ES MAYOR AL TOTAL SE CALCULA EL IGTF POR EL TOTAL
              // --- SI ES MENOR, SE CALCULA POR LA CANTIDAD QUE SE HA ACUMULADO
              console.log(
                "AL AGGREGAR",
                this.total_dolares,
                acumTotal,
                this.pagos[index],
                this.pagos_aux
              );

              console.log(
                "el totalito dol",
                this.total_dolares,
                this.igtf_dolares
              );
            }

            ////--- SI EL PAGO ES DIFERENTE A EFECTIVO Y NO PONEN BANCO AVISA ---////
          } else {
            this.modalMalPago = true;
          }

          ////--- SI EL PAGO ES EFECTIVO LO DEJA PASAR PORQUE NO NECESITA BANCO
        } else {
          if (this.pagos[index].agregado == "1") {
            ////// ------- SI ES PARA MODIFICAR ------- //////
            console.log("entro a modificar");
            console.log("el pagos_aux", this.pagos_aux);

            //// ---- EL PAGO VIEJO NO ES IGTF ---- ////
            if (this.pagos_aux[index].igtf_pago == "0") {
              // ELIMINAR EL MONTO AGREGADO ANTERIORMENTE
              if (this.pagos_aux[index].id_divisa == this.id_dolares) {
                // EN DOLARES
                console.log("en dolares el aux", this.pagos_aux[index].monto);
                restDolares = parseFloat(this.pagos_aux[index].monto);
              } else if (this.pagos_aux[index].id_divisa == this.id_pesos) {
                //EN PESOS
                console.log("en pesos el aux", this.pagos_aux[index].monto);
                restPesos = parseFloat(this.pagos_aux[index].monto);
                restPesos = restPesos / this.cambioPesosArreglado;
              } else if (this.pagos_aux[index].id_divisa == this.id_bolivares) {
                // EN BOLIVARES
                console.log("en bs el aux", this.pagos_aux[index].monto);
                restBs = parseFloat(this.pagos_aux[index].monto);
                restBs = restBs / this.cambioBs;
                console.log("rest bs", restBs);
              }

              restTotal = restBs + restPesos + restDolares;

              console.log("EL REST TOTAL", restTotal);
              console.log("---------------!!!!!!!!!!!!!!--------------");

              console.log(
                "EL TTTOTAL",
                this.total_dolares,
                restTotal,
                this.pagos_aux,
                this.pagos_aux[index],
                this.igtf_dolares,
                index
              );

              //// ---- REDONDEA EL TOTAL ACUM PARA VER SI ES MAYOR AL DE LA FACTURA ---- ////
              let aux_dol_redondeado_eliminar = Number(
                Math.round(this.total_dolares + "e+2") + "e-2"
              );
              let igtf_antes = this.igtf_dolares;
              let igtfdepago = this.pagos_aux[index].igtf_monto;

              console.log("EL ITF ANTES", igtf_antes, igtfdepago);
              if (
                this.pagos_aux[index].id_divisa == this.id_dolares ||
                this.pagos_aux[index].id_divisa == this.id_pesos
              ) {
                console.log("2");
                this.igtf_dolares =
                  this.igtf_dolares - this.pagos_aux[index].igtf_monto;
              }
              console.log("EL ITF DESPUES", this.igtf_dolares);

              //// ---- SI ERAN VUELTOS LE RESTA AL TOTAL ACUM ---- ////
              if (this.pagos_aux[index].tipo_registro == "1") {
                console.log("es vueltos");
                this.total_dolares = this.total_dolares - restTotal;
              } else {
                // -- SI NO SON VUELTOS SE SUMA -- //
                console.log("no es vueltos");
                this.total_dolares = this.total_dolares + restTotal;
              }

              console.log("los lolares totales", this.total_dolares);
            } else {
              //// SI EL PAGO ANTERIOR ERA IGTF --revisar
              this.igtf = false;
              this.malIGTF = false;
              console.log("ERA IGTF, SE RESETEA TODO", this.igtf, this.malIGTF);
            }

            // SI EL NUEVO ES IGTF -- revisar
            if (this.pagos[index].igtf_pago == "1") {
              this.igtf = true;
              console.log("entro a modificacion", this.pagos[index]);

              // AGREGAR EL MONTO NUEVO
              if (this.pagos[index].id_divisa == this.id_dolares) {
                // EN DOLARES
                console.log("EL IGTF LOLARES", this.pagos[index].monto);
                if (this.pagos[index].monto == this.igtf_dolares) {
                  this.pagos[index].id_registro_divisa =
                    this.id_registro_dolares;
                  this.pagos[index].divisa_nombre = "DOLARES";
                  console.log("en dolares", this.pagos[index].monto);
                  console.log(
                    "el registro divisa",
                    this.pagos[index].id_registro_divisa
                  );
                  this.malIGTF = false;
                } else {
                  this.modalMalIGTF = true;
                  this.malIGTF = true;
                  console.log("SE HIZO UN MAL IGTF");
                }
              } else if (this.pagos[index].id_divisa == this.id_pesos) {
                //EN PESOS
                let igtfPesos = Number(
                  Math.round(
                    this.pagos[index].monto / this.cambioPesosArreglado + "e+2"
                  ) + "e-2"
                );

                console.log(
                  "EL IGTF PEPSOS",
                  igtfPesos,
                  this.pagos[index].monto / this.cambioPesosArreglado
                );
                if (igtfPesos == this.igtf_dolares) {
                  this.pagos[index].id_registro_divisa = this.id_registro_pesos;
                  this.pagos[index].divisa_nombre = "PESOS";
                  this.malIGTF = false;
                } else {
                  this.modalMalIGTF = true;
                  this.malIGTF = true;
                }
              } else if (this.pagos[index].id_divisa == this.id_bolivares) {
                // EN BOLIVARES
                let igtfBs = Number(
                  Math.round(this.pagos[index].monto / this.cambioBs + "e+2") +
                    "e-2"
                );

                console.log(
                  "EL IGTF BOLOS",
                  igtfBs,
                  this.pagos[index].monto / this.cambioBs
                );

                if (igtfBs == this.igtf_dolares) {
                  this.pagos[index].id_registro_divisa =
                    this.id_registro_bolivares;
                  this.pagos[index].divisa_nombre = "BOLIVARES";
                  this.malIGTF = false;
                } else {
                  this.modalMalIGTF = true;
                  this.malIGTF = true;
                }
              }
            } else {
              //// ---- SI NO ES IGTF ---- ////

              //// ----------- AGREGAR EL MONTO NUEVO ----------- ////
              if (this.pagos[index].id_divisa == this.id_dolares) {
                // EN DOLARES
                this.pagos[index].id_registro_divisa = this.id_registro_dolares;
                this.pagos[index].divisa_nombre = "DOLARES";
                console.log("en dolares", this.pagos[index].monto);
                console.log(
                  "el registro divisa",
                  this.pagos[index].id_registro_divisa
                );
                acumDolares += parseFloat(this.pagos[index].monto);
              } else if (this.pagos[index].id_divisa == this.id_pesos) {
                //EN PESOS
                this.pagos[index].id_registro_divisa = this.id_registro_pesos;
                this.pagos[index].divisa_nombre = "PESOS";
                acumPesos += parseFloat(this.pagos[index].monto);

                console.log(
                  "el registro divisa",
                  this.pagos[index].id_registro_divisa
                );
                acumPesos = acumPesos / this.cambioPesosArreglado;
              } else if (this.pagos[index].id_divisa == this.id_bolivares) {
                // EN BOLIVARES
                this.pagos[index].id_registro_divisa =
                  this.id_registro_bolivares;
                this.pagos[index].divisa_nombre = "BOLIVARES";
                acumBs += parseFloat(this.pagos[index].monto);
                acumBs = acumBs / this.cambioBs;
                console.log("acum bs", acumBs);
              }
            }

            console.log("el pagos_aux", this.pagos_aux[index]);
          } else {
            // ------------ SI ES PARA AGREGAR  ------------ //
            console.log("entro a crear", this.pagos[index]);

            //////// SI EL PAGO ES IGTF /////////
            if (this.pagos[index].igtf_pago == "1") {
              //--------- AGREGAR EL MONTO NUEVO ---------//
              if (this.pagos[index].id_divisa == this.id_dolares) {
                // EN DOLARES
                console.log("EL IGTF LOLARES", this.pagos[index].monto);
                if (
                  this.pagos[index].monto ==
                  Number(Math.round(this.igtf_dolares + "e+2") + "e-2")
                ) {
                  this.pagos[index].id_registro_divisa =
                    this.id_registro_dolares;
                  this.pagos[index].divisa_nombre = "DOLARES";
                  console.log("en dolares", this.pagos[index].monto);
                  console.log(
                    "el registro divisa",
                    this.pagos[index].id_registro_divisa
                  );
                  this.malIGTF = false;
                } else {
                  this.modalMalIGTF = true;
                  this.malIGTF = true;
                }
              } else if (this.pagos[index].id_divisa == this.id_pesos) {
                //EN PESOS
                let igtfPesos = Number(
                  Math.round(
                    this.pagos[index].monto / this.cambioPesosArreglado + "e+2"
                  ) + "e-2"
                );

                console.log(
                  "EL IGTF PEPSOS",
                  igtfPesos,
                  this.pagos[index].monto / this.cambioPesosArreglado
                );
                if (
                  igtfPesos ==
                  Number(Math.round(this.igtf_dolares + "e+2") + "e-2")
                ) {
                  this.pagos[index].id_registro_divisa = this.id_registro_pesos;
                  this.pagos[index].divisa_nombre = "PESOS";
                  this.malIGTF = false;
                } else {
                  this.modalMalIGTF = true;
                  this.malIGTF = true;
                }
              } else if (this.pagos[index].id_divisa == this.id_bolivares) {
                // EN BOLIVARES
                let igtfBs = Number(
                  Math.round(this.pagos[index].monto / this.cambioBs + "e+2") +
                    "e-2"
                );

                console.log(
                  "EL IGTF BOLOS",
                  igtfBs,
                  this.pagos[index].monto / this.cambioBs,
                  this.igtf_dolares
                );

                if (
                  igtfBs ==
                  Number(Math.round(this.igtf_dolares + "e+2") + "e-2")
                ) {
                  this.pagos[index].id_registro_divisa =
                    this.id_registro_bolivares;
                  this.pagos[index].divisa_nombre = "BOLIVARES";
                  this.malIGTF = false;
                } else {
                  this.modalMalIGTF = true;
                  this.malIGTF = true;
                }
              }

              if (this.modalMalIGTF == false) {
                console.log("AAAY YA");
                this.igtf = true;
                console.log("entro a igtf", this.igtf);
                this.pagos[index].agregado = "1";
              }
            } else {
              /////////// SI EL PAGO ES PAGO /////////////

              console.log("el aux de pagos", this.pagos_aux);

              // CALCULA EL TOTAL
              if (this.pagos[index].id_divisa == this.id_dolares) {
                // EN DOLARES
                this.pagos[index].id_registro_divisa = this.id_registro_dolares;
                this.pagos[index].divisa_nombre = "DOLARES";
                console.log("en dolares", this.pagos[index].monto);
                console.log(
                  "el registro divisa",
                  this.pagos[index].id_registro_divisa
                );
                acumDolares += parseFloat(this.pagos[index].monto);
              } else if (this.pagos[index].id_divisa == this.id_pesos) {
                //EN PESOS
                this.pagos[index].id_registro_divisa = this.id_registro_pesos;
                this.pagos[index].divisa_nombre = "PESOS";
                console.log("en pesos", this.pagos[index].monto);
                console.log(
                  "el registro divisa",
                  this.pagos[index].id_registro_divisa
                );
                acumPesos += parseFloat(this.pagos[index].monto);
                acumPesos = acumPesos / this.cambioPesosArreglado;
              } else if (this.pagos[index].id_divisa == this.id_bolivares) {
                // EN BOLIVARES
                this.pagos[index].id_registro_divisa =
                  this.id_registro_bolivares;
                this.pagos[index].divisa_nombre = "BOLIVARES";

                console.log("en bs", this.pagos[index].monto);
                console.log(
                  "el registro divisa",
                  this.pagos[index].id_registro_divisa
                );

                acumBs += parseFloat(this.pagos[index].monto);
                acumBs = acumBs / this.cambioBs;
                console.log("acum bs", acumBs);
              }

              this.pagos[index].agregado = "1";
              console.log("el agregado en true", this.pagos[index].agregado);
              console.log(
                "los vueltos en true?",
                this.pagos[index].tipo_registro
              );
            }
          }

          if (this.modalMalIGTF == false) {
            acumTotal = acumBs + acumPesos + acumDolares;

            console.log("EL ACUM TOTAL", acumTotal);
            console.log("----------------!!!!!!!!!!!!!!--------------");
            console.log(
              "ANTES DE AGGREGAR",
              this.total_dolares,
              acumTotal,
              this.igtf_dolares,
              this.pagos[index]
            );

            let aux_dol_redondeado = Number(
              Math.round(this.total_dolares + "e+2") + "e-2"
            );

            // ----- PARA EL CALCULO DE IGTF ----- //
            if (aux_dol_redondeado > 0) {
              // --- SON DOLARES???
              if (this.pagos[index].id_divisa == this.id_dolares) {
                console.log("entro 2");
                if (acumDolares < aux_dol_redondeado) {
                  this.igtf_dolares += acumDolares * 0.03;
                  this.pagos[index].igtf_monto = acumDolares * 0.03;
                  console.log("EL ITF KE ES", this.pagos[index].igtf_monto);
                } else if (acumDolares >= aux_dol_redondeado) {
                  this.igtf_dolares += aux_dol_redondeado * 0.03;
                  this.pagos[index].igtf_monto = aux_dol_redondeado * 0.03;
                  console.log("EL ITF KE ES", this.pagos[index].igtf_monto);
                }

                // --- SON PESOS???
              } else if (this.pagos[index].id_divisa == this.id_pesos) {
                console.log("entro 3");
                if (acumPesos < aux_dol_redondeado) {
                  this.igtf_dolares += acumPesos * 0.03;
                  this.pagos[index].igtf_monto = acumPesos * 0.03;
                  console.log("EL ITF KE ES", this.pagos[index].igtf_monto);
                } else if (acumPesos >= aux_dol_redondeado) {
                  this.igtf_dolares += aux_dol_redondeado * 0.03;
                  this.pagos[index].igtf_monto = aux_dol_redondeado * 0.03;
                  console.log("EL ITF KE ES", this.pagos[index].igtf_monto);
                }
              }
            }

            this.igtf_dolares = Number(
              Math.round(this.igtf_dolares + "e+2") + "e-2"
            );

            //// ---- VERIFICA SI EL PAGO SON VUELTOS ---- ////
            ////// SI SON VUELTOS SE SUMAN AL TOTAL ACUM //////
            // ------ OJO EL TOTAL ACUM CUANDO SE PAGA TODO ES CERO POR ESO SE SUMA ------ //
            if (this.pagos[index].tipo_registro == "1") {
              this.total_dolares = this.total_dolares + acumTotal;
            } else {
              //// SI ES UN PAGO NORMAL SE LE RESTA AL TOTAL ACUM ////
              this.total_dolares = this.total_dolares - acumTotal;
            }

            this.pagos_aux[index] = {
              monto: this.pagos[index].monto,
              id_divisa: this.pagos[index].id_divisa,
              tipo_registro: this.pagos[index].tipo_registro,
              igtf_pago: this.pagos[index].igtf_pago,
              igtf_monto: this.pagos[index].igtf_monto,
            };

            // --- SI LO QUE HAN PAGADO ES MAYOR AL TOTAL SE CALCULA EL IGTF POR EL TOTAL
            // --- SI ES MENOR, SE CALCULA POR LA CANTIDAD QUE SE HA ACUMULADO
            console.log(
              "AL AGGREGAR",
              this.total_dolares,
              acumTotal,
              this.igtf_dolares,
              this.pagos[index],
              this.pagos_aux
            );

            console.log(
              "el totalito dol",
              this.total_dolares,
              this.igtf_dolares
            );
          }
        }
      } else {
        ////--- SI NO PONE LOS CAMPOS OBLIGATORIOS DEL REGISTRO AVISA ---////
        this.modalMalPago = true;
      }
    },

    finalizar() {
      this.comprobacion = true;

      console.log(
        "EL TOTAL DOLARESSS!!!!",
        this.total_dolares,
        this.totalDolares,
        this.igtf_dolares,
        this.total_dolares + this.igtf_dolares
      );
      console.log("DE DONDE VIENE", this.from);

      // SI ES CREANDO FACTURA
      if (this.from == 1) {
        // PARA FACTURA A CONTADO, ORDEN DE TRABAJO O REGISTRO CONVENIO //
        console.log("EL ID TIPO", this.idTipoFactura);

        if (
          this.idTipoFactura == 1 ||
          this.idTipoFactura == 3 ||
          this.idTipoFactura == 4
        ) {
          console.log(
            "EL TOTAL DOLARESSS",
            this.total_dolares,
            this.totalDolares
          );

          let total_dolares_aux = 0;
          total_dolares_aux = this.total_dolares;

          console.log("totaaalll", this.total_dolares, total_dolares_aux);
          this.total_dolares = this.total_dolares.toFixed(20);
          this.total_dolares = Number(
            Math.round(this.total_dolares + "e+2") + "e-2"
          );

          console.log("despues del totaaalll", this.total_dolares);

          if (this.idTipoFactura == 1) {
            if (this.total_dolares == 0) {
              this.total_dolares = this.total_dolares.toFixed(20);
              console.log("entro 1 en finalizar", this.total_dolares);
            } else {
              //console.log("el igtf acum", this.igtf_acum);
              //if (this.igtf_acum == 0) {
              console.log("antes de 2", this.total_dolares, this.igtf_dolares);
              this.total_dolares = (
                this.total_dolares + this.igtf_dolares
              ).toFixed(20);
              console.log("entro 2 en finalizar", this.total_dolares);
              //}
            }
          } else {
            this.total_dolares = this.total_dolares.toFixed(20);
            if (this.igtf_dolares != 0) {
              this.igtf = true;
            }

            console.log("entro 3 en finalizar", this.total_dolares);
          }

          this.total_dolares = Number(
            Math.round(this.total_dolares + "e+2") + "e-2"
          );

          console.log("EL TOTAL DOLARESSS", this.total_dolares, this.malIGTF);

          // SI EL TOTAL ES CERO //
          if (this.total_dolares == 0 && this.malIGTF == false) {
            ////NO MONTAR CREO QUE ESTA MAL!!!!!!!!!!!!!!!!
            console.log("entro, vamo a ve IGTF", this.igtf_dolares, this.igtf);
            if (
              (this.igtf_dolares != 0 && this.igtf == true) ||
              (this.igtf_dolares == 0 && this.igtf == false)
            ) {
              console.log("entrooooo");
              this.total_dolares = Number(
                Math.round(this.total_dolares + "e+2") + "e-2"
              );

              this.aux_total.push({
                // LOS PAGOS
                pagos: this.pagos,
                // LOS BS
                total_bolivares_descuento: Number(
                  Math.round(this.totalDolares * this.cambioBs + "e+2") + "e-2"
                ),
                descuento_bolivares: Number(
                  Math.round(this.descuento_dolares * this.cambioBs + "e+2") +
                    "e-2"
                ),
                igtf_bs: Number(
                  Math.round(this.igtf_dolares * this.cambioBs + "e+2") + "e-2"
                ),
                // LOS PESOS
                descuento_pesos: Number(
                  Math.round(
                    this.descuento_dolares * this.cambioPesosArreglado + "e+2"
                  ) + "e-2"
                ),
                total_pesos_descuento: Number(
                  Math.round(
                    this.totalDolares * this.cambioPesosArreglado + "e+2"
                  ) + "e-2"
                ),
                igtf_pesos: Number(
                  Math.round(
                    this.igtf_dolares * this.cambioPesosArreglado + "e+2"
                  ) + "e-2"
                ),
                // LOS DOLARES
                total_dolares_descuento: this.totalDolares,
                descuento_dolares: this.descuento_dolares,
                igtf_dolares: Number(
                  Math.round(this.igtf_dolares + "e+2") + "e-2"
                ),
                cambio_pesos_arreglado: this.cambioPesosArreglado,
              });

              console.log("LOS PAGOS", this.aux_total);
              this.$emit("finalizarPagos", this.aux_total);
            } else {
              console.log(
                "ERROR CON ALGO DE IGTF!!!!",
                this.igtf_dolares,
                this.igtf
              );

              this.faltaPlata = true;
              this.comprobacion = false;
            }
          } else {
            // SI NO ES CERO AVISA //
            this.faltaPlata = true;
            this.comprobacion = false;
            console.log(this.total_dolares, total_dolares_aux);
            this.total_dolares = total_dolares_aux;
          }
        } else {
          // SI ES FACTURA U ORDEN DE TRABAJO A CREDITO //
          this.aux_total.push({
            // LOS PAGOS
            pagos: this.pagos,
            // LOS BS
            total_bolivares_descuento: Number(
              Math.round(this.totalDolares * this.cambioBs + "e+2") + "e-2"
            ),
            descuento_bolivares: Number(
              Math.round(this.descuento_dolares * this.cambioBs + "e+2") + "e-2"
            ),
            igtf_bs: Number(
              Math.round(this.igtf_dolares * this.cambioBs + "e+2") + "e-2"
            ),
            // LOS PESOS
            descuento_pesos: Number(
              Math.round(
                this.descuento_dolares * this.cambioPesosArreglado + "e+2"
              ) + "e-2"
            ),
            total_pesos_descuento: Number(
              Math.round(
                this.totalDolares * this.cambioPesosArreglado + "e+2"
              ) + "e-2"
            ),
            igtf_pesos: Number(
              Math.round(
                this.igtf_dolares * this.cambioPesosArreglado + "e+2"
              ) + "e-2"
            ),
            // LOS DOLARES
            total_dolares_descuento: this.totalDolares,
            descuento_dolares: this.descuento_dolares,
            igtf_dolares: Number(Math.round(this.igtf_dolares + "e+2") + "e-2"),
            cambio_pesos_arreglado: this.cambioPesosArreglado,
          });

          console.log("LOS PAGOS", this.aux_total);
          this.$emit("finalizarPagos", this.aux_total);
        }
      } else if (this.from == 2) {
        // SI ESTA MODIFICANDO LOS PAGOS //
        this.total_dolares = this.total_dolares.toFixed(20);
        this.total_dolares = Number(
          Math.round(this.total_dolares + "e+2") + "e-2"
        );

        console.log("el id factura", this.idFactura, this.total_dolares);
        let usuario = parseInt(localStorage.id);

        let modificado = {
          id_usuario: usuario,
          id_factura: parseInt(this.idFactura),
          agregar_modificar: this.pagos,
          eliminar: this.eliminados_aux,
        };

        console.log("LOS PAGOS MODIFICADOS", modificado);

        axios
          .post(this.ip + "modificarPago", modificado)
          .then((response) => {
            console.log(response);
            if (response.data === 1) {
              this.$router.go();
            }
          })
          .catch((err) => console.log(err.message));
      } else if (this.from == 3) {
        // SI ESTA CREANDO UN RECIBO //
        //---- SI REALMENTE AGREGO UN PAGO ----//
        if (this.agrego_pago == true) {
          this.total_dolares = this.total_dolares.toFixed(20);
          this.total_dolares = Number(
            Math.round(this.total_dolares + "e+2") + "e-2"
          );

          console.log("el id factura", this.idFactura);
          let total = 0;

          for (let i = 0; i < this.pagos.length; i++) {
            if (this.pagos[i].id_divisa == this.id_dolares) {
              this.sumDol += parseFloat(this.pagos[i].monto);
            } else if (this.pagos[i].id_divisa == this.id_pesos) {
              this.sumPesos += parseFloat(this.pagos[i].monto);
            } else if (this.pagos[i].id_divisa == this.id_bolivares) {
              this.sumBs += parseFloat(this.pagos[i].monto);
            }
          }

          console.log("las sum", this.sumDol, this.sumPesos, this.sumBs);
          this.sumPesos = this.sumPesos / this.cambioPesosArreglado;
          this.sumBs = this.sumBs / this.cambioBs;
          total = this.sumDol + this.sumPesos + this.sumBs;
          console.log("el total", total);
          let usuario = parseInt(localStorage.id);

          let agregar;

          if (this.idTipoFactura != 5) {
            agregar = {
              id_usuario: usuario,
              id_factura: parseInt(this.idFactura),
              monto_bolivares: Number(
                Math.round(
                  (total - this.igtf_dolares) * this.cambioBs + "e+2"
                ) + "e-2"
              ),
              monto_pesos: Number(
                Math.round(
                  (total - this.igtf_dolares) * this.cambioPesosArreglado +
                    "e+2"
                ) + "e-2"
              ),
              monto_dolares: Number(
                Math.round(total - this.igtf_dolares + "e+2") + "e-2"
              ),
              IGTF_bolivares: Number(
                Math.round(this.igtf_dolares * this.cambioBs + "e+2") + "e-2"
              ),
              IGTF_dolares: Number(
                Math.round(this.igtf_dolares + "e+2") + "e-2"
              ),
              IGTF_pesos: Number(
                Math.round(
                  this.igtf_dolares * this.cambioPesosArreglado + "e+2"
                ) + "e-2"
              ),
              pagos: this.pagos,
            };
          } else {
            agregar = {
              id_usuario: usuario,
              id_factura: parseInt(this.idFactura),
              monto_bolivares: Number(
                Math.round(total * this.cambioBs + "e+2") + "e-2"
              ),
              monto_pesos: Number(
                Math.round(total * this.cambioPesosArreglado + "e+2") + "e-2"
              ),
              monto_dolares: Number(Math.round(total + "e+2") + "e-2"),
              IGTF_bolivares: 0,
              IGTF_dolares: 0,
              IGTF_pesos: 0,
              pagos: this.pagos,
            };
          }

          console.log("LOS PAGOS MODIFICADOS", agregar);

          axios
            .post(this.ip + "crearRecibo", agregar)
            .then((response) => {
              console.log(response.data);
              console.log("ESTA EN EL RESPONSE DE LOS ABONOS");
              //this.$router.go();
              this.$emit("abonoListo", response.data);
            })
            .catch((err) => console.log(err.message));
        } else {
          this.modalMalPago = true;
          this.comprobacion = false;
          console.log("MARIK AGREGA EL PAGO ANTES DE FINALIZAR");
        }
      }
    },

    // LLENAR EL ARRAY DE PAGOS CUANDO SE VA A MODIFICAR
    onLlenarPagos() {
      if (this.from == 2 || this.from == 3) {
        this.total_dolares = this.debeDolares;
      }

      if (this.from == 2) {
        this.pagos = this.getPagos();

        for (let i = 0; i < this.pagos.length; i++) {
          this.pagos_aux[i] = {
            monto: this.pagos[i].monto,
            id_divisa: this.pagos[i].id_divisa,
            tipo_registro: this.pagos[i].tipo_registro,
            igtf_pago: this.pagos[i].igtf_pago,
            igtf_monto: this.pagos[i].igtf_monto,
          };
        }
        console.log("el aux pagos pa mod", this.pagos_aux);
        console.log("el debe", this.total_dolares);
        console.log(this.debeDolares);
      }

      console.log("EL ARRAY DE PAGOS", this.pagos);
    },

    // CALCULAR LA TASA REAL DE LOS PESOS
    calculoPesos() {
      let pesos = Number(
        Math.round(this.total_dolares * this.cambioPesosActual + "e+2") + "e-2"
      );
      console.log(
        "Total dol y cambio",
        this.total_dolares,
        this.cambioPesosActual
      );
      console.log("los pesos pa calcular", pesos);
      console.log("el cambio", this.cambioPesosActual);

      var digits = pesos.toString().split("");
      console.log("el digits", digits);
      var largo = digits.length;
      console.log("el punto", digits[largo - 2]);

      if (digits[largo - 2] == ".") {
        digits.splice(largo - 2, 2);
      }

      console.log("el digits", digits);
      var realDigits = digits.map(Number);
      var i = realDigits.length;

      console.log(realDigits[i - 3]);
      console.log(realDigits);

      if (
        realDigits[i - 3] != 0 ||
        realDigits[i - 2] != 0 ||
        realDigits[i - 1] != 0
      ) {
        realDigits[i - 1] = 0;
        realDigits[i - 2] = 0;
        realDigits[i - 3] = 0;
        console.log("pos 4 ", realDigits[i - 4]);
        realDigits[i - 4] = realDigits[i - 4] + 1;
        console.log("pos 4 desp", realDigits[i - 4]);
        if (realDigits[i - 4] == "10") {
          console.log("pos 4 ", realDigits[i - 4]);
          realDigits[i - 4] = "0";
          realDigits[i - 5] = parseInt(realDigits[i - 5]) + 1;
          realDigits[i - 5].toString();

          if (realDigits[i - 5] == "10") {
            console.log("pos 5 ", realDigits[i - 5]);
            realDigits[i - 5] = "0";
            realDigits[i - 6] = parseInt(realDigits[i - 6]) + 1;
            realDigits[i - 6].toString();

            if (realDigits[i - 6] == "10") {
              realDigits[i - 6] = "0";
              realDigits[i - 7] = parseInt(realDigits[i - 7]) + 1;
              realDigits[i - 7].toString();

              if (realDigits[i - 7] == "10") {
                realDigits[i - 7] = "0";
                realDigits[i - 8] = parseInt(realDigits[i - 8]) + 1;
                realDigits[i - 8].toString();

                if (realDigits[i - 7] == "10") {
                  realDigits[i - 7] = "0";
                  realDigits[i - 8] = parseInt(realDigits[i - 8]) + 1;
                  realDigits[i - 8].toString();

                  if (realDigits[i - 8] == "10") {
                    realDigits[i - 8] = "0";
                    realDigits[i - 9] = parseInt(realDigits[i - 9]) + 1;
                    realDigits[i - 9].toString();
                  }
                }
              }
            }
          }
        }
      }

      console.log(realDigits);
      pesos = realDigits.join("");
      console.log("Los pesos arreglados", pesos);
      console.log("el cambio a pesos arreglado", pesos / this.total_dolares);
      this.cambioPesosArreglado = pesos / this.total_dolares;
    },

    async getDivisas() {
      let datos = await axios.get(this.ip + "registroDivisas");
      console.log("LAS DIVISAS", datos.data.registroDivisas);
      this.divisasDatos = datos.data.registroDivisas;

      for (let i = 0; i < this.divisasDatos.length; i++) {
        if (this.divisasDatos[i].divisa_nombre == "DOLARES") {
          this.id_registro_dolares = this.divisasDatos[i].id_registro_divisa;
          this.id_dolares = this.divisasDatos[i].id_divisa;
        }
        if (this.divisasDatos[i].divisa_nombre == "PESOS") {
          this.id_registro_pesos = this.divisasDatos[i].id_registro_divisa;
          this.id_pesos = this.divisasDatos[i].id_divisa;
        }
        if (this.divisasDatos[i].divisa_nombre == "BOLIVARES") {
          this.id_registro_bolivares = this.divisasDatos[i].id_registro_divisa;
          this.id_bolivares = this.divisasDatos[i].id_divisa;
        }
      }
    },

    async getBancos() {
      let datos = await axios.get(this.ip + "bancos");
      console.log("LOS BANCOS", datos.data);
      this.bancosDatos = datos.data;
    },

    async getTiposDePago() {
      let datos = await axios.get(this.ip + "tiposDePago");
      console.log("LOS TIPOS DE PAGO", datos.data);
      this.tiposDePagoDatos = datos.data;
    },

    getPagos() {
      console.log("LOS PAGUITOSS", JSON.parse(this.pagosFactura));
      console.log(this.debeDolares);
      return JSON.parse(this.pagosFactura);
    },
  },

  created() {
    if (this.from == 2) {
      this.cambioPesosArreglado = this.cambioPesosFactura;
      
      if (this.idTipoFactura != 3 || this.idTipoFactura != 5) {
        this.igtf_dolares = this.igtfDolares;
      }

      console.log(
        "ENTRO A PESOS 2",
        this.cambioPesosArreglado,
        this.igtf_dolares
      );
    } else if (this.from == 3) {
      this.cambioPesosArreglado = this.cambioPesosActual;
      this.calculoPesos();
    }
    this.getDivisas();
    this.getBancos();
    this.getTiposDePago();
  },

  mounted() {
    this.onLlenarPagos();
    if (this.from == 1) {
      console.log("entro a calculo pesos");
      this.calculoPesos();
      if (this.descuento != 0) {
        this.aplicarDescuento();
      }
    }
  },

  computed: {
    // MUESTRA LOS DOLARES RESTANTES POR PAGAR
    getDolares() {
      console.log(
        "LOS DOLARES EN COMPUTED 1",
        this.total_dolares,
        this.totalDolares
      );
      let dol = 0;
      if (this.total_dolares < 0) {
        return 0;
      } else {
        dol = this.total_dolares.toFixed(20);
        return Number(Math.round(dol + "e+2") + "e-2");
      }
    },

    // MUESTRA LOS VUELTOS EN DOLARES A PAGAR
    getVueltosDolares() {
      //console.log("LOS DOLARES EN COMPUTED 2", this.total_dolares);
      let vueltos = 0;
      if (this.total_dolares < 0) {
        vueltos = this.total_dolares * -1;
        console.log("VUELTOSS DOLL", vueltos);
        vueltos = vueltos.toFixed(20);
        console.log("vuelticos ddol", vueltos);
        vueltos = Number(Math.round(vueltos + "e+2") + "e-2");
        console.log(
          "vuelticos ddol",
          vueltos,
          this.igtf_dolares,
          this.idTipoFactura
        );

        if (vueltos != 0) {
          console.log("si entro a vueltos");
          if (this.idTipoFactura == 3) {
            console.log("vueltos sin igtf");
            vueltos = vueltos;
          } else {
            console.log("vueltos con igtf");
            vueltos = vueltos - this.igtf_dolares;
            console.log(vueltos);
          }
        }

        vueltos = Number(Math.round(vueltos + "e+2") + "e-2");

        console.log("vuelticos", vueltos);
        return vueltos;
      } else {
        return vueltos;
      }
    },

    // MUESTRA EL IGFT A PAGAR EN DOLARES
    getIgtfDolares() {
      console.log("el igtf lolares", this.igtf_dolares);
      return Number(Math.round(this.igtf_dolares + "e+2") + "e-2");
    },

    // MUESTRA LOS PESOS RESTANTES POR PAGAR
    getPesos() {
      let pesos;
      if (this.total_dolares < 0) {
        return 0;
      } else {
        console.log("el cambio pesos", this.cambioPesosArreglado);
        pesos = this.total_dolares * this.cambioPesosArreglado;
        console.log("los dolares y los pesos", this.total_dolares, pesos);
        pesos = pesos.toFixed(20);
        pesos = Number(Math.round(pesos + "e+2") + "e-2");
        var digits = pesos.toString().split("");
        console.log("los pesos string!!", digits);
        var i = digits.length;
        if (digits[i - 3] == ".") {
          digits.splice(i - 3, 3);
          var realDigits = digits.map(Number);
          pesos = realDigits.join("");
        }

        return pesos;
      }
    },

    // MUESTRA LOS VUELTOS EN PESOS A PAGAR
    getVueltosPesos() {
      let vueltos = 0;
      if (this.total_dolares < 0) {
        console.log(
          "DOLARES EN VUELTOS",
          this.total_dolares,
          this.totalDolares
        );
        vueltos = this.total_dolares * -1;
        vueltos = vueltos.toFixed(20);
        vueltos = Number(Math.round(vueltos + "e+2") + "e-2");

        if (vueltos != 0) {
          if (this.idTipoFactura == 3) {
            vueltos = vueltos;
          } else {
            vueltos = vueltos - this.igtf_dolares;
          }
        }

        console.log("llos vueltos", vueltos);
        vueltos = vueltos * this.cambioPesosArreglado;
        console.log("los vueltos fijos", vueltos);
        vueltos = Number(Math.round(vueltos + "e+2") + "e-2");
        console.log("los dolares y los pesos", this.total_dolares, vueltos);

        var digits = vueltos.toString().split("");
        console.log("los pesos string!!", digits);
        var i = digits.length;

        if (digits[i - 3] == ".") {
          digits.splice(i - 3, 3);
          var realDigits = digits.map(Number);
          vueltos = realDigits.join("");
        } else if (digits[i - 2] == ".") {
          digits.splice(i - 2, 2);
          var realDigits = digits.map(Number);
          vueltos = realDigits.join("");
        }

        return vueltos;
      } else {
        return vueltos;
      }
    },

    // MUESTRA EL TOTAL A PAGAR EN PESOS
    getPesosFijo() {
      let pesos;
      //console.log("el cambio pesos", this.cambioPesosArreglado);
      pesos = this.totalDolares * this.cambioPesosArreglado;
      console.log("los dolares y los pesos", this.totalDolares, pesos);
      pesos = pesos.toFixed(20);
      //console.log(pesos);
      pesos = Number(Math.round(pesos + "e+2") + "e-2");
      //console.log(pesos);
      var digits = pesos.toString().split("");
      //console.log("los pesos string!!", digits);
      var i = digits.length;

      if (digits[i - 3] == ".") {
        if (digits[i - 2] == "9") {
          digits[i - 4] = parseInt(digits[i - 4]) + 1;
          digits[i - 4].toString();
          if (digits[i - 4] == "10") {
            digits[i - 4] = "0";
            digits[i - 5] = parseInt(digits[i - 5]) + 1;
            digits[i - 5].toString();

            if (digits[i - 5] == "10") {
              digits[i - 5] = "0";
              digits[i - 6] = parseInt(digits[i - 6]) + 1;
              digits[i - 6].toString();

              if (digits[i - 6] == "10") {
                digits[i - 6] = "0";
                digits[i - 7] = parseInt(digits[i - 7]) + 1;
                digits[i - 7].toString();

                if (digits[i - 7] == "10") {
                  digits[i - 7] = "0";
                  digits[i - 8] = parseInt(digits[i - 8]) + 1;
                  digits[i - 8].toString();

                  if (digits[i - 7] == "10") {
                    digits[i - 7] = "0";
                    digits[i - 8] = parseInt(digits[i - 8]) + 1;
                    digits[i - 8].toString();

                    if (digits[i - 8] == "10") {
                      digits[i - 8] = "0";
                      digits[i - 9] = parseInt(digits[i - 9]) + 1;
                      digits[i - 9].toString();
                    }
                  }
                }
              }
            }
          }
        }
        digits.splice(i - 3, 3);
        var realDigits = digits.map(Number);
        pesos = realDigits.join("");
      }

      return pesos;
      /*return Number(
        Math.round(this.totalDolares * this.cambioPesosArreglado + "e+2") +
          "e-2"
      );*/
    },

    // MUESTRA EL IGTF A PAGAR EN PESOS
    getIgtfPesos() {
      console.log(
        "el igtf pesos",
        Number(
          Math.round(this.igtf_dolares * this.cambioPesosArreglado + "e+2") +
            "e-2"
        )
      );

      let igtf = 0;
      igtf = Number(
        Math.round(this.igtf_dolares * this.cambioPesosArreglado + "e+2") +
          "e-2"
      );

      var digits = igtf.toString().split("");
      console.log("los pesos string!!", digits);
      var i = digits.length;

      if (digits[i - 3] == ".") {
        digits.splice(i - 3, 3);
        var realDigits = digits.map(Number);
        igtf = realDigits.join("");
      } else if (digits[i - 2] == ".") {
        digits.splice(i - 2, 2);
        var realDigits = digits.map(Number);
        igtf = realDigits.join("");
      }
      return igtf;
    },

    // MUESTRA EL MONTO TOTAL A PAGAR EN BS
    getBsFijo() {
      return Number(
        Math.round(this.totalDolares * this.cambioBs + "e+2") + "e-2"
      );
    },

    // MUESTRA EL RESTANTE A PAGAR EN BS
    getBs() {
      let bs = 0;
      if (this.total_dolares < 0) {
        return 0;
      } else {
        bs = this.total_dolares * this.cambioBs;
        bs = bs.toFixed(20);
        return Number(Math.round(bs + "e+2") + "e-2");
      }
    },

    // MUESTRA LOS VUELTOS A PAGAR EN BS
    getVueltosBs() {
      let vueltos = 0;
      if (this.total_dolares < 0) {
        vueltos = this.total_dolares * -1;
        vueltos = vueltos.toFixed(20);
        vueltos = Number(Math.round(vueltos + "e+2") + "e-2");

        if (vueltos != 0) {
          if (this.idTipoFactura == 3) {
            vueltos = vueltos;
          } else {
            vueltos = vueltos - this.igtf_dolares;
          }
        }

        vueltos = vueltos * this.cambioBs;
        vueltos = Number(Math.round(vueltos + "e+2") + "e-2");
        return vueltos;
      } else {
        return vueltos;
      }
    },

    // MUESTRA EL IGTF A PAGAR EN BS
    getIgtfBs() {
      console.log(
        "el igtf bs",
        Number(Math.round(this.igtf_dolares * this.cambioBs + "e+2") + "e-2")
      );
      return Number(
        Math.round(this.igtf_dolares * this.cambioBs + "e+2") + "e-2"
      );
    },
  },
};
</script>
