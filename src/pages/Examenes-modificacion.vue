<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE EXAMEN -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              examenes
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
                <!-- CODIGO DEL EXAMEN -->
                <div class="col-4">
                  <q-input
                    v-model="codigo"
                    type="text"
                    label="Codigo del examen"
                    class="q-mr-xl text-uppercase"
                  />
                </div>
                <!-- NOMBRE DEL EXAMEN -->
                <div class="col-4">
                  <q-input
                    v-model="nombre"
                    type="text"
                    label="Nombre"
                    class="q-ml-xl text-uppercase"
                  />
                </div>
              </div>

              <div class="row">
                <!-- DEPARTAMENTOS -->
                <div class="col-4">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_departamento"
                    option-label="departamento_nombre"
                    v-model="departamento_nombre"
                    :options="departamentosData"
                    label="Departamento"
                    class="q-mr-xl"
                  />
                </div>

                <!-- CATEGORIAS -->
                <div class="col-4">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_categoria"
                    option-label="categoria_nombre"
                    v-model="categoria_nombre"
                    :options="categoriasData"
                    label="Categoria"
                    class="q-ml-xl"
                  />
                </div>
              </div>

              <div class="row">
                <!-- PRECIO DEL EXAMEN -->
                <div class="col-4">
                  <q-input
                    v-model="precio"
                    type="text"
                    label="Precio (Dólares)"
                    class="q-mr-xl"
                    v-if="this.id_usuario != 29"
                  />
                </div>
                <!-- COLOR DEL TUBO DEL EXAMEN -->
                <div class="col-4">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_tubo"
                    option-label="tubo_color"
                    v-model="tubo"
                    :options="tuboData"
                    label="Color del tubo"
                    class="q-ml-xl"
                  />
                </div>
              </div>

              <div class="row">
                <!-- PRECIO DEL EXAMEN -->
                <div class="col-10">
                  <q-input
                    v-model="referencia"
                    type="textarea"
                    label="REFERENCIA"
                    class="q-mr-xl"
                    
                  />
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <!-- TABLA DE PRUEBAS PERTENECIENTES AL EXAMEN -->
              <q-table
                title="Pruebas"
                :rows="rows"
                :columns="columns"
                :loading="loading"
                :pagination="initialPagination"
                :filter="filter"
                no-data-label="No hay data disponible"
                row-key="prueba_nombre"
              >
                <template v-slot:top-right>
                  <!-- BARRA DE BUSQUEDA -->
                  <q-input
                    outlined
                    dense
                    debounce="300"
                    v-model="filter"
                    placeholder="Buscar"
                    class="q-mr-xl"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>

                  <!-- BOTON AGREGAR NUEVA PRUEBA -->
                  <q-btn
                    class="q-ml-xl"
                    color="secondary"
                    text-color="accent"
                    label="Agregar prueba"
                    @click="agregarPrueba()"
                    icon="add"
                  />
                </template>

                <!-- SECCION BOTONES OPCIONES -->
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <!-- BOTON ELIMINAR PRUEBA -->
                    <q-btn
                      padding="md"
                      dense
                      round
                      flat
                      color="grey"
                      @click="deleteRow(props.row.id_prueba)"
                      icon="delete"
                    >
                    </q-btn>
                  </q-td>
                </template>
              </q-table>

              <!-- MODAL AGREGAR PRUEBA -->
              <q-dialog v-model="confirm" full-width>
                <q-card>
                  <q-card-section class="q-pb-sm">
                    <!-- TABLA QUE MUESTRA TODAS LAS PRUEBAS -->
                    <q-table
                      title="Agregar prueba"
                      :rows="rows_pruebas"
                      :columns="columns_pruebas"
                      :pagination="initialPagination"
                      :loading="carga"
                      row-key="prueba_nombre"
                      selection="multiple"
                      v-model:selected="selected"
                      :filter="filterPruebas"
                    >
                      <template v-slot:top-right>
                        <!-- BARRA DE BUSQUEDA -->
                        <q-input
                          outlined
                          dense
                          debounce="300"
                          v-model="filterPruebas"
                          placeholder="Buscar"
                          class="q-mr-xl"
                        >
                          <template v-slot:append>
                            <q-icon name="search" />
                          </template>
                        </q-input>

                        <!-- BOTON CIERRE MODAL -->
                        <q-btn
                          class="q-ml-xl"
                          icon="close"
                          flat
                          round
                          dense
                          v-close-popup
                        />
                      </template>

                      <!--SECCION BOTONES OPCIONES -->
                      <template v-slot:body-cell-actions="opt">
                        <q-td :props="opt">
                          <!--BOTON AGREGAR PRUEBA AL EXAMEN -->
                          <q-btn
                            padding="md"
                            dense
                            round
                            flat
                            color="grey"
                            @click="
                              addPrueba(
                                opt.row.id_prueba,
                                opt.row.prueba_nombre
                              )
                            "
                            icon="done"
                          >
                          </q-btn>
                        </q-td>
                      </template>
                    </q-table>
                  </q-card-section>

                  <q-card-section class="q-pt-none q-pb-sm">
                    <div class="row justify-end">
                      <div class="col-1">
                        <!-- BOTON GUARDAR -->
                        <q-btn
                          label="Guardar"
                          @click="addPruebas(selected)"
                          color="primary"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-dialog>

              <div class="row justify-end">
                <div class="col-3 q-gutter-x-xl q-mt-lg">
                  <!-- BOTON CANCELAR -->
                  <q-btn
                    label="Cancelar"
                    type="reset"
                    color="grey-9"
                    flat
                    class="q-ml-sm"
                    @click="onCancel()"
                  />

                  <!-- BOTON GUARDAR -->
                  <q-btn
                    v-if="this.create === 'false'"
                    :disable="this.enviando == true"
                    label="Guardar"
                    type="submit"
                    color="primary"
                  />

                  <!-- BOTON CREAR -->
                  <q-btn
                    v-if="this.create === 'true'"
                    :disable="this.enviando == true"
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

    <!-- MODAL FALTAN PRUEBAS -->
    <q-dialog v-model="faltanPruebas">
      <q-card>
        <q-card-section class="row items-center q-ma-md">
          <q-avatar icon="warning" color="amber-14" text-color="grey-10" />
          <span class="q-ml-sm">
            <div class="text-subtitle1">
              No se puede crear un examen sin pruebas
            </div>
          </span>
        </q-card-section>

        <q-card-actions align="center" class="q-mb-md">
          <q-btn
            label="Aceptar"
            color="primary"
            class="q-mr-lg"
            v-close-popup
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
  props: ["id", "create"],

  data() {
    let examen;
    let codigo = ref(null);
    let nombre = ref(null);
    let precio = 0;
    let tubo = ref(null);
    let departamento_nombre = ref(null);
    let categoria_nombre = ref(null);
    let referencia = ref(null);
    let departamentosData;
    let categoriasData;
    let tuboData;
    const selected = ref([]);
    const rows = ref([]);
    let rows_pruebas = ref([]);
    const loading = ref(true);
    const carga = ref(true);
    let faltanPruebas = ref(false);
    let enviando = ref(false);
    let acceso = ref(null);
    let id_usuario = parseInt(localStorage.id);

    const ip = process.env.BASE_URL;
    const columns = [
      {
        name: "prueba_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.prueba_nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const columns_pruebas = [
      {
        name: "prueba_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row_prueba) => row_prueba.prueba_nombre,
        format: (val_prueba) => `${val_prueba}`,
        sortable: true,
      },
      { name: "actions", label: "Agregar prueba", field: "", align: "center" },
    ];

    // SE TRAE LA LISTA DE PRUEBAS //
    axios
      .get(ip + "pruebas")
      .then((response) => {
        rows_pruebas.value = response.data;
        console.log(rows_pruebas.value);
      })
      .finally(() => {
        carga.value = false;
      });

    // AGREGA UNA SOLA PRUEBA A LA LISTA DE PRUEBAS //
    const addPrueba = (prueba_id, nombre_prueba) => {
      rows.value = [
        ...rows.value,
        {
          id_prueba: prueba_id,
          prueba_nombre: nombre_prueba,
        },
      ];
      this.selected = [];
      this.filterPruebas = "";
      this.confirm = false;
    };

    // AGREGA VARIAS PRUEBAS A LA LISTA DE PRUEBAS //
    const addPruebas = (selected) => {
      console.log("el selected", selected[0].id_prueba);
      for (let i = 0; i < selected.length; i++) {
        rows.value = [
          ...rows.value,
          {
            id_prueba: selected[i].id_prueba,
            prueba_nombre: selected[i].prueba_nombre,
          },
        ];
      }
      this.filterPruebas = "";
      this.selected = [];
      this.confirm = false;
    };

    // ELIMINAR UNA PRUEBA DEL EXAMEN //
    const deletePrueba = (prueba_id) => {
      let tamano = rows.value.length;
      for (let i = 0; i < tamano; i++) {
        console.log("entro al for");
        if (rows.value[i].id_prueba == prueba_id) {
          var prueba = this.rows.splice(i, 1);
          console.log("la prueba", prueba);
          break;
        }
      }
    };

    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      examen,
      codigo,
      nombre,
      precio,
      tubo,
      departamento_nombre,
      categoria_nombre,
      departamentosData,
      categoriasData,
      referencia,
      tuboData,
      ip,
      qeditor: ref(""),
      columns,
      columns_pruebas,
      rows,
      rows_pruebas,
      loading,
      addPrueba,
      addPruebas,
      filter: ref(""),
      filterPruebas: ref(""),
      selected,
      carga,
      confirm: ref(false),
      deletePrueba,
      faltanPruebas,
      enviando,
      acceso,
      id_usuario,
    };
  },

  methods: {
    // MODAL AGREGAR PRUEBA //
    agregarPrueba() {
      this.confirm = true;
    },

    // SE TRAE LAS PRUEBAS PERTENECIENTES AL EXAMEN //
    async getPruebas() {
      let examen_id = {
        id_examen: this.id,
      };

      axios
        .post(this.ip + "examenPruebas", examen_id)
        .then((response) => {
          this.rows = response.data;
          console.log("LAS PRUEBAS DEL EXAMEN", this.rows);
          console.log("el id", examen_id);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // SE TRAE EL EXAMEN A MODIFICAR //
    async getExamen() {
      console.log("el id", this.id);
      let examen = {
        id_examen: this.id,
      };

      let datos = await axios.post(this.ip + "buscarExamen", examen);

      console.log(datos.data);
      this.codigo = datos.data[0].examen_codigo;
      this.nombre = datos.data[0].examen_nombre;
      this.precio = datos.data[0].examen_precio;
      this.departamento_nombre = datos.data[0].id_departamento;
      this.categoria_nombre = datos.data[0].id_categoria;
      this.tubo = datos.data[0].id_color_tubo;
      this.referencia = datos.data[0].examen_referencia;
      console.log(this.codigo);

      /*this.algo = datos.data;
      console.log(datos.data)
      return datos.data
      this.rows = datos.data;*/
    },

    // SE TRAE LOS DEPARTAMENTOS, CATEGORIAS Y COLOR DE TUBO //
    async getDepartamentosExamenes() {
      let datos = await axios.get(this.ip + "departamentosCategoriasTubos");
      console.log(datos.data[0].categorias);
      this.categoriasData = datos.data[0].categorias;
      console.log(datos.data[0].departamentos);
      this.departamentosData = datos.data[0].departamentos;
      this.tuboData = datos.data[0].tubos;
    },

    // ENVIAR EXAMEN //
    onSubmit() {
      this.enviando = true;

      if (this.rows.length == 0) {
        this.faltanPruebas = true;
        this.enviando = false;
      } else {
        let num = 1;

        console.log("elnum " + num);
        let cosa = [];

        for (let i = 0; i < this.rows.length; i++) {
          cosa.push({
            idPrueba: this.rows[i].id_prueba,
          });
        }

        let examen = {
          num,
          id_examen: parseInt(this.id),
          examen_codigo: this.codigo.toUpperCase(),
          examen_nombre: this.nombre.toUpperCase(),
          examen_precio: this.precio,
          id_departamento: this.departamento_nombre,
          id_categoria: this.categoria_nombre,
          id_color_tubo: this.tubo,
          examen_referencia: this.referencia,
          pruebas: cosa,
        };

        console.log(examen);
        console.log("ENVIADITTO");
        if (this.create === "true") {
          axios
            .post(this.ip + "configExamenes", examen)
            .then((response) => {
              console.log(response);
              this.enviando = false;
              if (
                response.data === "MODIFICO!" ||
                response.data === "AGREGO!"
              ) {
                this.$router.push({ name: "Examenes" });
              }
            })
            .catch((err) => console.log(err.message));
        } else {
          axios
            .post(this.ip + "configExamenPruebas", examen)
            .then((response) => {
              console.log(response);
              if (
                response.data === "MODIFICO!" ||
                response.data === "AGREGO!"
              ) {
                this.$router.push({ name: "Examenes" });
              }
            })
            .catch((err) => console.log(err.message));
        }
      }
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Examenes");
    },

    // ELIMINAR UNA PRUEBA //
    deleteRow(prueba_id) {
      let eliminar = {
        num: 2,
        id_examen: this.id,
        id_prueba: prueba_id,
      };
      console.log("id examen" + this.id);
      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configExamenPruebas", eliminar)
        .then((response) => {
          console.log(response.data);
          console.log("es es el response");

          if (response.data === 1) {
            this.deletePrueba(prueba_id);
          }
        })
        .catch((err) => console.log(err.message));
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 5,
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
          id_tarea: 25,
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
    console.log("funciona?", this.create, this.id);
    if (this.create === "false") {
      this.getExamen();
    }
    this.getPruebas();
    this.getDepartamentosExamenes();
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
