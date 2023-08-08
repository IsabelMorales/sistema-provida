<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE PRUEBAS -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              Pruebas
            </div>
          </q-card-section>
          <q-separator />

          <q-card-section>
            <q-form
              @submit="onSubmit"
              @reset="onCancel"
              class="q-gutter-lg q-ml-lg"
            >
              <div class="row">
                <!-- NOMBRE DE LA PRUEBA -->
                <div class="col-6">
                  <q-input
                    v-model="nombre"
                    type="text"
                    label="Nombre"
                    class="q-ml-xl"
                    v-if="this.id_rol==6"
                  />
                  <q-input
                    v-model="nombre"
                    type="text"
                    label="Nombre"
                    class="q-ml-xl"
                    v-else
                  />
                </div>
              </div>

              <div class="row">
                <!-- NOMBRE DE LA PRUEBA -->
                <div class="col-2">
                  <q-input
                    v-model="unidad"
                    type="text"
                    label="Unidad"
                    class="q-ml-xl"
                  />
                </div>
              </div>

              <div class="row">
                <!-- VALOR DE REFERENCIA -->
                <div class="col-8">
                  <p class="text-subtitle-1 q-ml-xl q-mb-none text-grey-9">
                    VALOR DE REFERENCIA
                  </p>
                  <q-editor
                    class="q-ml-xl"
                    v-model="valorReferencia"
                    :dense="$q.screen.lt.md"
                    :toolbar="[
                      [
                        'bold',
                        'italic',
                        'strike',
                        'underline',
                        'subscript',
                        'superscript',
                        'hr',
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
                      [
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7',
                          ],
                        },
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          options: ['left', 'center', 'right', 'justify'],
                        },
                        {
                          label: $q.lang.editor.defaultFont,
                          icon: $q.iconSet.editor.font,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'default_font',
                            'arial',
                            'arial_black',
                            'comic_sans',
                            'courier_new',
                            'impact',
                            'lucida_grande',
                            'times_new_roman',
                            'verdana',
                          ],
                        },
                        'removeFormat',
                      ],
                      ['undo', 'redo'],
                    ]"
                    :fonts="{
                      arial: 'Arial',
                      arial_black: 'Arial Black',
                      comic_sans: 'Comic Sans MS',
                      courier_new: 'Courier New',
                      impact: 'Impact',
                      lucida_grande: 'Lucida Grande',
                      times_new_roman: 'Times New Roman',
                      verdana: 'Verdana',
                    }"
                  />
                </div>
              </div>

              <div class="row justify-end">
                <div class="col-3 q-gutter-x-lg">
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
    let valorReferencia = ref(null);
    let unidad = ref(null);
    let prueba_id = {
      id_prueba: this.id,
    };
    let acceso = ref(null);
    let id_rol=parseInt(localStorage.rol)

    const ip = process.env.BASE_URL;

    return {
      acceso,
      nombre,
      valorReferencia,
      unidad,
      prueba_id,
      ip,
      id_rol
    };
  },

  methods: {
    // SE TRAE LA PRUEBA A MODIFICAR //
    async getPrueba() {
      let idPrueba = {
        id_prueba: this.id,
      };

      let datos = await axios.post(this.ip + "buscarPrueba", idPrueba);

      console.log(datos.data);

      this.nombre = datos.data[0].prueba_nombre;
      this.valorReferencia = datos.data[0].valor_de_referencia;
      this.unidad = datos.data[0].prueba_unidad;
    },

    // ENVIAR PRUEBA //
    onSubmit() {
      let num;
      if (this.create === "true") {
        num = 1;
      } else {
        num = 2;
      }

      console.log("elnum " + num);
      console.log(this.nombre + "/" + this.nombre.toUpperCase());
      let prueba = {
        num,
        id_prueba: this.id,
        prueba_nombre: this.nombre,
        prueba_unidad: this.unidad,
        valor_de_referencia: this.valorReferencia,
        tipo_campo: 1,
      };

      console.log(prueba);
      console.log("ENVIADITTO");
      axios
        .post(this.ip + "configPruebas", prueba)
        .then((response) => {
          console.log(response);
          if (
            response.data === "MODIFICO!" ||
            response.data === "AGREGO PERFIL!"
          ) {
            this.$router.push({ name: "Pruebas" });
          }
        })
        .catch((err) => console.log(err.message));
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Pruebas");
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 6,
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
          id_tarea: 26,
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
      this.getPrueba();
    }
  },

  computed: {
    getAcceso() {
      return this.acceso;
    },
  },
};
</script>
