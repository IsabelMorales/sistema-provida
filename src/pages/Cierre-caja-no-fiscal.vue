<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-12 q-py-md">
        <q-card flat bordered class="cards" id="impresion">
          <div class="row">
            <div class="col-10">
              <h6 class="q-my-md q-ml-md">CIERRE DE CAJA NO FISCAL</h6>
            </div>
            <div class="col-2 text-right">
              <q-btn
                color="primary"
                class="q-mt-md q-mr-md"
                label="Imprimir"
                v-show="imprimirBtn"
                @click="imprimir"
              />
            </div>
          </div>

          <q-separator />

          <div class="row">
            <div class="col-12">
              <p class="q-ml-md text-subtitle1">
                Desde: {{ this.from }} | Hasta: {{ this.to }} | Usuario:
                <span
                  v-for="usuario in usuarios"
                  :key="usuario.nombre"
                  class="text-bold"
                >
                  {{ usuario.nombre }}
                </span>
                | Primera factura:
                <span class="text-bold">{{
                  this.data.primera_factura.orden_trabajo
                }}</span>
                | Ultima factura:
                <span class="text-bold">{{
                  this.data.segunda_factura.orden_trabajo
                }}</span>
                | Tasa del dia (BCV): {{ this.tasaBolivares }}
              </p>
            </div>
          </div>

          <q-separator />

          <!-- FACTURACION -->
          <div class="row justify-center q-mt-md">
            <div class="col-12 q-px-md">
              <q-card class="my-card">
                <div class="row">
                  <div class="col-12">
                    <p class="text-subtitle1 text-bold q-ml-md">Facturación</p>
                  </div>
                </div>
                <div class="row q-ml-md q-pb-md">
                  <div class="col">
                    <div class="row">
                      <div class="col-12"><br /></div>
                      <div class="col-12 text-bold">Total BsF</div>
                      <div class="col-12 text-bold">Total COP</div>
                      <div class="col-12 text-bold">Total USD</div>
                      <div class="col-12 text-bold">Total IGTF BsF</div>
                      <div class="col-12 text-bold">Total IGTF COP</div>
                      <div class="col-12 text-bold">Total IGTF USD</div>
                      <div class="col-12 text-bold">
                        <q-separator />Cantidad
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Facturas al contado</div>
                      <div class="col-12">
                        {{ this.data.ganancia_factura_contado_bolivares }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_factura_contado_pesos }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_factura_contado_dolares }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_factura_contado }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_factura_contado }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_factura_contado }} USD
                      </div>
                      <div class="col-12">
                        <q-separator />{{ this.data.cantidad_facturas_contado }}
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Facturas a credito</div>
                      <div class="col-12">
                        {{ this.data.ganancia_factura_credito_bolivares }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_factura_credito_pesos }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_factura_credito_dolares }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_factura_credito }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_factura_credito }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_factura_credito }} USD
                      </div>
                      <div class="col-12">
                        <q-separator />{{ this.data.cantidad_facturas_credito }}
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Facturas credito part.</div>
                      <div class="col-12">
                        {{
                          this.data
                            .sumatoria_bolivares_factura_credito_particulares
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data.sumatoria_pesos_factura_credito_particulares
                        }}
                        COP
                      </div>
                      <div class="col-12">
                        {{
                          this.data
                            .sumatoria_dolares_factura_credito_particulares
                        }}
                        USD
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_factura_credito }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_factura_credito }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_factura_credito }} USD
                      </div>
                      <div class="col-12">
                        <q-separator />{{
                          this.data.cantidad_facturas_credito_particulares
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Facturas credito conv.</div>
                      <div class="col-12">
                        {{
                          this.data.sumatoria_bolivares_factura_credito_convenio
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.sumatoria_pesos_factura_credito_convenio }}
                        COP
                      </div>
                      <div class="col-12">
                        {{
                          this.data.sumatoria_dolares_factura_credito_convenio
                        }}
                        USD
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_factura_credito }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_factura_credito }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_factura_credito }} USD
                      </div>
                      <div class="col-12">
                        <q-separator />{{
                          this.data.cantidad_facturas_credito_convenio
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Descuentos aplicados</div>
                      <div class="col-12">
                        {{ this.data.descuento_total_bolivares }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.descuento_total_pesos }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.descuento_total_dolares }} USD
                      </div>
                      <div class="col-12">-</div>
                      <div class="col-12">-</div>
                      <div class="col-12">-</div>
                      <div class="col-12"><q-separator />0</div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Facturas anuladas</div>
                      <div class="col-12">
                        {{ this.data.factura_anulada_bolivares }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.factura_anulada_pesos }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.factura_anulada_dolares }} USD
                      </div>
                      <div class="col-12">-</div>
                      <div class="col-12">-</div>
                      <div class="col-12">-</div>
                      <div class="col-12">
                        <q-separator />{{
                          this.data.cantidad_facturas_anuladas
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Total operaciones</div>
                      <div class="col-12">
                        {{ this.data.monto_total_facturas_bolivares }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.monto_total_facturas_pesos }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.monto_total_facturas_dolares }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares }} BsF
                      </div>
                      <div class="col-12">{{ this.data.IGTF_pesos }} COP</div>
                      <div class="col-12">{{ this.data.IGTF_dolares }} USD</div>

                      <div class="col-12">
                        <q-separator />{{
                          this.data.cantidad_facturas_anuladas +
                          this.data.cantidad_facturas_credito +
                          this.data.cantidad_facturas_contado
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <!-- INGRESOS -->
          <div class="row q-mt-lg">
            <!-- POR VENTAS -->
            <div class="col-4 q-pl-md">
              <q-card class="my-card">
                <div class="row q-ml-md q-pt-sm">
                  <div class="col-12 text-bold">Ingresos por ventas</div>
                  <div class="col-12">Ingresos por caja</div>
                </div>

                <q-separator />

                <div class="row q-mx-md q-pb-sm">
                  <div class="col-6">
                    <div class="row">
                      <div class="col-12">Efectivo</div>
                      <div class="col-12">Efectivo</div>
                      <div class="col-12">Efectivo</div>
                      <div class="col-12">Bancolombia</div>
                      <div class="col-12">Transf. Zelle</div>
                      <div class="col-12">Transf. PayPal</div>
                      <div class="col-12">Transferencia</div>
                      <div class="col-12">Débito</div>
                      <div class="col-12">Crédito</div>
                      <div class="col-12">IGTF BsF efectivo</div>
                      <div class="col-12">IGTF BsF crédito</div>
                      <div class="col-12">IGTF BsF débito</div>
                      <div class="col-12">IGTF BsF transferencia</div>
                      <div class="col-12">IGTF COP efectivo</div>
                      <div class="col-12">IGTF COP crédito</div>
                      <div class="col-12">IGTF COP débito</div>
                      <div class="col-12">IGTF COP transferencia</div>
                      <div class="col-12">IGTF USD efectivo</div>
                      <div class="col-12">IGTF USD crédito</div>
                      <div class="col-12">IGTF USD débito</div>
                      <div class="col-12">IGTF USD transferencia</div>
                      <div class="col-12"><q-separator /> Total ingresos</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="row text-right">
                      <div class="col-12">
                        {{ this.data.efectivo_bolivares_factura_contado }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.efectivo_dolares_factura_contado }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.efectivo_pesos_factura_contado }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.bancolombia_factura_contado }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.zelle_factura_contado }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.paypal_factura_contado }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.total_transBancos_factura_contado }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.total_debitoBancos_factura_contado }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.total_creditoBancos_factura_contado }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_efectivo_factura_contado }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data
                            .IGTF_bolivares_tarjeta_credito_factura_contado
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data
                            .IGTF_bolivares_tarjeta_debito_factura_contado
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_bolivares_transferencia_factura_contado
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_efectivo_factura_contado }} COP
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_pesos_tarjeta_debito_factura_contado
                        }}
                        COP
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_pesos_tarjeta_credito_factura_contado
                        }}
                        COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_transferencia_factura_contado }}
                        COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_efectivo_factura_contado }}
                        USD
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_dolares_tarjeta_credito_factura_contado
                        }}
                        USD
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_dolares_factura_debito_factura_contado
                        }}
                        USD
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_dolares_transferencia_factura_contado
                        }}
                        USD
                      </div>
                      <div class="col-12">
                        <q-separator />{{ this.data.total_factura_contado }} BsF
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- CUENTAS POR COBRAR -->
            <div class="col-4 q-px-md">
              <q-card class="my-card">
                <div class="row q-ml-md q-pt-sm">
                  <div class="col-12 text-bold">
                    Ingresos por cuentas por cobrar
                  </div>
                  <div class="col-12">Abonos y cobros a facturas</div>
                </div>

                <q-separator />

                <div class="row q-mx-md q-pb-sm">
                  <div class="col-6">
                    <div class="row">
                      <div class="col-12">Efectivo</div>
                      <div class="col-12">Efectivo</div>
                      <div class="col-12">Efectivo</div>
                      <div class="col-12">Bancolombia</div>
                      <div class="col-12">Transf. Zelle</div>
                      <div class="col-12">Transf. PayPal</div>
                      <div class="col-12">Transferencia</div>
                      <div class="col-12">Débito</div>
                      <div class="col-12">Crédito</div>
                      <div class="col-12">IGTF BsF efectivo</div>
                      <div class="col-12">IGTF BsF crédito</div>
                      <div class="col-12">IGTF BsF débito</div>
                      <div class="col-12">IGTF BsF transferencia</div>
                      <div class="col-12">IGTF COP efectivo</div>
                      <div class="col-12">IGTF COP crédito</div>
                      <div class="col-12">IGTF COP débito</div>
                      <div class="col-12">IGTF COP transferencia</div>
                      <div class="col-12">IGTF USD efectivo</div>
                      <div class="col-12">IGTF USD crédito</div>
                      <div class="col-12">IGTF USD débito</div>
                      <div class="col-12">IGTF USD transferencia</div>
                      <div class="col-12"><q-separator /> Total ingresos</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="row text-right">
                      <div class="col-12">
                        {{ this.data.abonos_bolivares }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.abonos_dolares }} USD
                      </div>
                      <div class="col-12">{{ this.data.abonos_pesos }} COP</div>
                      <div class="col-12">
                        {{ this.data.bancolombiaFacturaCredito }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.zelleFacturaCredito }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.paypalFacturaCredito }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.total_transBancos_factura_credito }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.total_debitoBancos_factura_credito }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.total_creditoBancos_factura_credito }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_efectivo_factura_credito }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data
                            .IGTF_bolivares_tarjeta_credito_factura_credito
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data
                            .IGTF_bolivares_tarjeta_debito_factura_credito
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_bolivares_transferencia_factura_credito
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_efectivo_factura_credito }} COP
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_pesos_tarjeta_debito_factura_credito
                        }}
                        COP
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_pesos_tarjeta_credito_factura_credito
                        }}
                        COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_transferencia_factura_credito }}
                        COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_efectivo_factura_credito }}
                        USD
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_dolares_tarjeta_credito_factura_credito
                        }}
                        USD
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_dolares_factura_debito_factura_credito
                        }}
                        USD
                      </div>
                      <div class="col-12">
                        {{
                          this.data.IGTF_dolares_transferencia_factura_credito
                        }}
                        USD
                      </div>
                      <div class="col-12">
                        <q-separator />{{ this.data.total_factura_credito }} BsF
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- TOTAL -->
            <div class="col-4 q-pr-md">
              <q-card class="my-card">
                <div class="row q-ml-md q-pt-sm">
                  <div class="col-12 text-bold">Totales</div>
                  <div class="col-12">Caja + cobros</div>
                </div>

                <q-separator />

                <div class="row q-mx-md q-pb-sm">
                  <div class="col-6">
                    <div class="row">
                      <div class="col-12">Efectivo</div>
                      <div class="col-12">Efectivo</div>
                      <div class="col-12">Efectivo</div>
                      <div class="col-12">Bancolombia</div>
                      <div class="col-12">Transf. Zelle</div>
                      <div class="col-12">Transf. PayPal</div>
                      <div class="col-12">Transferencia</div>
                      <div class="col-12">Débito</div>
                      <div class="col-12">Crédito</div>
                      <div class="col-12">IGTF BsF efectivo</div>
                      <div class="col-12">IGTF BsF crédito</div>
                      <div class="col-12">IGTF BsF débito</div>
                      <div class="col-12">IGTF BsF transferencia</div>
                      <div class="col-12">IGTF COP efectivo</div>
                      <div class="col-12">IGTF COP crédito</div>
                      <div class="col-12">IGTF COP débito</div>
                      <div class="col-12">IGTF COP transferencia</div>
                      <div class="col-12">IGTF USD efectivo</div>
                      <div class="col-12">IGTF USD crédito</div>
                      <div class="col-12">IGTF USD débito</div>
                      <div class="col-12">IGTF USD transferencia</div>
                      <div class="col-12"><q-separator /> Total ingresos</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="row text-right">
                      <div class="col-12">
                        {{ this.data.efectivo_bolivares }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.efectivo_dolares }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.efectivo_pesos }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_transferencia_bancolombia }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_transferencia_zelle }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_transferencia_paypal }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.total_transferencias_bancos_nacionales }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.total_tarjeta_debito_bancos_nacionales }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.total_tarjeta_credito_bancos_nacionales }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_efectivo }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_tarjeta_credito }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_tarjeta_debito }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_bolivares_transferencia }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_efectivo }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_tarjeta_debito }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_tarjeta_credito }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_pesos_transferencia }} COP
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_efectivo }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_tarjeta_credito }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_factura_debito }} USD
                      </div>
                      <div class="col-12">
                        {{ this.data.IGTF_dolares_transferencia }} USD
                      </div>
                      <div class="col-12">
                        <q-separator />
                        {{
                          this.data.total_factura_contado +
                          this.data.total_factura_credito
                        }}
                        BsF
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <!-- DESGLOSE INGRESOS PUNTO DE VENTA -->
          <div class="row q-mt-lg">
            <div class="col-12 q-px-md">
              <q-card class="my-card">
                <div class="row q-mt-sm">
                  <div class="col-12">
                    <p class="text-subtitle1 text-bold q-ml-md">
                      Desglose de ingresos por punto de venta
                    </p>
                  </div>
                </div>
                <div class="row q-ml-md q-pb-md">
                  <div class="col">
                    <div class="row text-bold">
                      <div class="col-12">Bancos</div>
                      <div class="col-12">Provincial</div>
                      <div class="col-12">Sofitasa</div>
                      <div class="col-12">Mercantil</div>
                      <div class="col-12">Banesco</div>
                      <div class="col-12">Venezuela</div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Tarj Débito</div>
                      <div class="col-12">
                        {{ this.data.ganancia_debito_provincial }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_debito_sofitasa }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_debito_mercantil }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_debito_banesco }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_debito_venezuela }} BsF
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Tarj Crédito</div>
                      <div class="col-12">
                        {{ this.data.ganancia_credito_provincial }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_credito_sofitasa }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_credito_mercantil }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_credito_banesco }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_credito_venezuela }} BsF
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Subtotal tarjetas</div>
                      <div class="col-12">
                        {{
                          this.data.ganancia_credito_provincial +
                          this.data.ganancia_debito_provincial
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data.ganancia_credito_sofitasa +
                          this.data.ganancia_debito_sofitasa
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data.ganancia_credito_mercantil +
                          this.data.ganancia_debito_mercantil
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data.ganancia_credito_banesco +
                          this.data.ganancia_debito_banesco
                        }}
                        BsF
                      </div>
                      <div class="col-12">
                        {{
                          this.data.ganancia_credito_venezuela +
                          this.data.ganancia_debito_venezuela
                        }}
                        BsF
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">Transferencia</div>
                      <div class="col-12">
                        {{ this.data.ganancia_transferencia_provincial }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_transferencia_sofitasa }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_transferencia_mercantil }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_transferencia_banesco }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.ganancia_transferencia_venezuela }} BsF
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="row">
                      <div class="col-12 text-bold">
                        Total tarjetas + Transf
                      </div>
                      <div class="col-12">
                        {{ this.data.sumatoria_total_provincial }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.sumatoria_total_sofitasa }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.sumatoria_total_mercantil }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.sumatoria_total_banesco }} BsF
                      </div>
                      <div class="col-12">
                        {{ this.data.sumatoria_total_venezuela }} BsF
                      </div>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <!-- DETALLES FACTURAS ANULADAS -->
          <div class="row q-mt-lg">
            <div class="col-12 q-px-md">
              <q-card class="my-card">
                <div class="row q-mt-sm">
                  <div class="col-12">
                    <p class="text-subtitle1 text-bold q-ml-md">
                      Detalle de facturas anuladas
                    </p>
                  </div>
                </div>

                <div class="row q-ml-md">
                  <div
                    class="col-12 q-mb-xs"
                    v-for="factura in this.data.detalles_facturas_anuladas"
                    :key="factura.numero_factura"
                  >
                    <span class="text-bold">Factura:</span>
                    {{ factura.numero_factura }}
                    <span class="text-bold">Cliente:</span>
                    {{ factura.cliente }}
                    <span class="text-bold">Motivo:</span> {{ factura.motivo }}
                  </div>
                </div>
              </q-card>
            </div>
          </div>

          <!-- DETALLES DESCUENTOS -->
          <div class="row q-mt-lg">
            <div class="col-12 q-px-md">
              <q-card class="my-card">
                <div class="row q-mt-sm">
                  <div class="col-12">
                    <p class="text-subtitle1 text-bold q-ml-md">
                      Detalle de descuentos aplicados
                    </p>
                  </div>
                </div>

                <!--<div class="row q-ml-md">
                  <div class="col-12">
                    <span class="text-bold">Factura:</span> 0042798
                    <span class="text-bold">Cliente:</span> EMPERATRIZ ORTIZ
                    <span class="text-bold">Motivo:</span> error en examen nueva
                    factura 426199
                  </div>
                </div>-->
              </q-card>
            </div>
          </div>

          <!-- DETALLES NOTAS A CREDITO -->
          <div class="row q-mt-lg">
            <div class="col-12 q-px-md">
              <q-card class="my-card">
                <div class="row q-mt-sm">
                  <div class="col-12">
                    <p class="text-subtitle1 text-bold q-ml-md">
                      Detalle de notas a credito aplicadas
                    </p>
                  </div>
                </div>

                <!--<div class="row q-ml-md">
                  <div class="col-12">
                    <span class="text-bold">Factura:</span> 0042798
                    <span class="text-bold">Cliente:</span> EMPERATRIZ ORTIZ
                    <span class="text-bold">Motivo:</span> error en examen nueva
                    factura 426199
                  </div>
                </div>-->
              </q-card>
            </div>
          </div>

          <div class="row q-my-lg">
            <div class="col-12 q-px-md">
              <div class="row q-mt-sm q-pb-md">
                <!-- TOTAL DEVOLUCIONES -->
                <div class="col-6">
                  <q-card class="my-card q-mr-sm q-pb-sm">
                    <div class="row">
                      <div class="col-12">
                        <p class="text-bold q-ml-md q-my-sm">
                          Total de devoluciones
                        </p>
                      </div>
                    </div>
                    <div class="row q-ml-md">
                      <div class="col-6">Efectivo</div>
                      <div class="col-6">Transferencia</div>
                    </div>
                    <div class="row q-ml-md">
                      <div class="col-6">0.00</div>
                      <div class="col-6">0.00</div>
                    </div>
                  </q-card>
                </div>

                <!-- TOTAL FINAL -->
                <div class="col-6">
                  <q-card class="my-card q-ml-sm">
                    <div class="row q-ml-md q-pt-md q-pb-sm">
                      <div class="col-12">
                        Total facturado:
                        <span class="text-bold">
                          {{
                            this.data.total_factura_contado +
                            this.data.total_factura_credito
                          }}
                          BsF
                        </span>
                      </div>
                      <div class="col-12">
                        Menos anulaciones y/o devoluciones:
                        <span class="text-bold">0 BsF</span>
                      </div>
                      <div class="col-12">
                        Total ingresos:
                        <span class="text-bold"
                          >{{
                            this.data.total_factura_contado +
                            this.data.total_factura_credito
                          }}
                          BsF</span
                        >
                      </div>
                    </div>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
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
import { jsPDF } from "jspdf";

export default {
  props: ["data", "from", "to", "usuarios"],

  data() {
    let imprimirBtn = ref(true);
    let tasaBolivares = ref(null);
    let acceso = ref(null);
    const ip = process.env.BASE_URL;

    // SE TRAE LAS DIVISAS CON SUS TASAS //
    axios.get(ip + "registroDivisas").then((response) => {
      console.log(response.data.registroDivisas);
      let divisas = response.data.registroDivisas;

      for (let i = 0; i < divisas.length; i++) {
        if (divisas[i].id_divisa == 3) {
          tasaBolivares.value = divisas[i].tasa_actual;
        }
      }
    });

    return {
      ip,
      imprimirBtn,
      tasaBolivares,
      acceso,
    };
  },

  methods: {
    creado() {
      console.log(this.data);
      this.imprimirBtn = true;
    },

    imprimir() {
      //this.imprimirBtn = false;

      var doc = new jsPDF("p", "pt", "a5");
      doc.html(document.getElementById("impresion"), {
        //margin: [0, 0, 0, 0],
        callback: function (doc) {
          doc.autoPrint();
          doc.output("dataurlnewwindow");
        },
        windowWidth: 1000,
        width: 410,
        y: 3,
        x: 3,
      });
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
    this.creado();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
