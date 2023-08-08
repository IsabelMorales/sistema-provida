<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE CULTIVO -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              cultivos
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
                <!-- CODIGO DEL CULTIVO -->
                <div class="col-4">
                  <q-input
                    v-model="codigo"
                    type="text"
                    label="Codigo"
                    class="q-mr-xl text-uppercase"
                  />
                </div>
                <!-- NOMBRE DEL CULTIVO -->
                <div class="col-4">
                  <q-input
                    v-model="nombre"
                    type="text"
                    label="Nombre"
                    class="q-mr-xl text-uppercase"
                  />
                </div>
                <!-- PRECIO DEL CULTIVO -->
                <div class="col-4">
                  <q-input
                    v-model="precio"
                    type="text"
                    label="Precio (Dólares)"
                    class="q-ml-xl"
                    v-if="this.id_usuario != 29"
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
                    v-model="departamento_id"
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
                    v-model="categoria_id"
                    :options="categoriasData"
                    label="Categoria"
                    class="q-ml-xl"
                  />
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <div class="row">
                <div class="col-12">
                  <h6 class="q-my-none">BACTERIAS</h6>
                </div>
              </div>

              <div class="row">
                <div class="col-12 text-right">
                  <q-btn
                    label="Añadir bacteria"
                    color="primary"
                    class="q-mr-md"
                    @click="addBacteria()"
                  />
                </div>
              </div>

              <div
                class="row q-mb-lg"
                v-for="bacteria in bacterias"
                :key="bacteria.id_bacteria"
              >
                <div class="col-8">
                  <q-select
                    emit-value
                    map-options
                    option-value="id_bacteria"
                    option-label="bacteria_nombre"
                    v-model="bacteria.id_bacteria"
                    :options="bacteriasData"
                    label="Bacteria"
                    class="q-mb-lg text-uppercase"
                  />
                </div>
                <div class="col-3">
                  <q-btn
                    label="Eliminar bacteria"
                    color="primary"
                    class="q-ml-lg q-mt-md"
                    @click="deleteBacteria(bacteria.id_bacteria)"
                  />
                </div>

                <div class="col-10">
                  <q-table
                    title="Antibioticos"
                    :rows="bacteria.antibioticos"
                    :columns="columns_antibioticos"
                    :loading="loading"
                    :pagination="initialPagination"
                    row-key="antibiotico_id"
                    :filter="filter"
                    no-data-label="No hay data disponible"
                  >
                    <template v-slot:top-right>
                      <!-- BOTON AGREGAR NUEVA PRUEBA -->
                      <q-btn
                        class="q-ml-xl"
                        color="secondary"
                        text-color="accent"
                        label="Agregar antibioticos"
                        @click="agregarAntibioticos(bacteria.id_bacteria)"
                        icon="add"
                      />
                    </template>

                    <!-- SECCION BOTONES OPCIONES -->
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <!-- BOTON ELIMINAR ANTIBIOTICO -->
                        <q-btn
                          padding="md"
                          dense
                          round
                          flat
                          color="grey"
                          @click="
                            deleteAntibiotico(
                              bacteria.id_bacteria,
                              props.row.id_antibiotico,
                              props.row.id_detalle_cultivo_bacteria_antibiotico
                            )
                          "
                          icon="delete"
                        >
                        </q-btn>
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </div>

              <div class="row justify-end">
                <div class="col-3 q-gutter-x-xl q-mt-lg">
                  <!-- BOTON CANCELAR -->
                  <q-btn
                    label="Cancelar"
                    color="grey-9"
                    flat
                    class="q-ml-sm"
                    @click="onCancel()"
                  />

                  <!-- BOTON GUARDAR -->
                  <q-btn
                    v-if="this.create === 'false'"
                    label="Guardar"
                    type="submit"
                    color="primary"
                  />

                  <!-- BOTON CREAR -->
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

    <!-- MODAL DE ANTIBIOTICOS -->
    <q-dialog v-model="modalAntibioticos" full-width>
      <q-card>
        <q-card-section class="q-pb-sm">
          <!-- TABLA QUE MUESTRA TODAS LAS PRUEBAS -->
          <q-table
            title="Agregar antibiotico"
            :rows="rows_antibioticos"
            :columns="columns_antibioticos"
            :pagination="initialPagination"
            :loading="carga"
            row-key="id_antibiotico"
            selection="multiple"
            v-model:selected="selected"
            :filter="filterAntibioticos"
          >
            <template v-slot:top-right>
              <!-- BARRA DE BUSQUEDA -->
              <q-input
                outlined
                dense
                debounce="300"
                v-model="filterAntibioticos"
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
                    addAntibiotico(
                      opt.row.id_antibiotico,
                      opt.row.antibiotico_nombre,
                      this.bacteriaSeleccionada
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
                @click="addAntibioticos(selected, bacteriaSeleccionada)"
                color="primary"
              />
            </div>
          </div>
        </q-card-section>
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
    let cultivo;
    let codigo = ref(null);
    let nombre = ref(null);
    let precio = ref(null);
    let departamento_id = ref(null);
    let categoria_id = ref(null);
    let departamentosData;
    let categoriasData;
    let bacteriasData = ref([]);
    const selected = ref([]);
    const rows = ref([]);
    const idBacteriaAntibiotico = ref([]);
    let rows_antibioticos = ref([]);
    const loading = ref(true);
    const carga = ref(true);
    const bacterias = ref([]);
    const modalAntibioticos = ref(false);
    let acceso = ref(null);
    let id_usuario = parseInt(localStorage.id);

    const ip = process.env.BASE_URL;

    const columns = [
      {
        name: "relacion_bacteria_antibiotico",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.relacion_bacteria_antibiotico,
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const columns_antibioticos = [
      {
        name: "antibiotico_nombre",
        required: true,
        label: "Nombre",
        align: "left",
        field: (row) => row.antibiotico_nombre,
        format: (val) => `${val}`,
        sortable: true,
      },
      { name: "actions", field: "", align: "center" },
    ];

    // SE TRAE LAS BACT-ANTI PERTENECIENTES AL CULTIVO //
    axios
      .get(ip + "bacterias")
      .then((response) => {
        bacteriasData.value = response.data;
        console.log("LAS BACTERIAS", bacteriasData.value);
      })
      .finally(() => {
        loading.value = false;
      });

    // SE TRAE LA LISTA DE BACT-ANTI //
    axios
      .get(ip + "antibioticos")
      .then((response) => {
        rows_antibioticos.value = response.data;
        console.log(rows_antibioticos.value);
      })
      .finally(() => {
        carga.value = false;
      });

    // AGREGA UNA SOLA BACT-ANTI A LA LISTA DE BACT-ANTIS //
    const addAntibiotico = (anti_id, nombre_anti, bact_id) => {
      console.log(
        "EL ARRAY DE BACT AGREGANDO ANTI",
        this.bacterias[0],
        bact_id
      );
      console.log("el id bact", bact_id);
      for (let i = 0; i < this.bacterias.length; i++) {
        if (this.bacterias[i].id_bacteria == bact_id) {
          this.bacterias[i].antibioticos = [
            ...this.bacterias[i].antibioticos,
            {
              id_antibiotico: anti_id,
              antibiotico_nombre: nombre_anti,
            },
          ];
        }
      }

      console.log(this.bacterias);
      this.filter = "";
      this.modalAntibioticos = false;
    };

    // AGREGA VARIAS BACT-ANTIS A LA LISTA DE BACT-ANTIS //
    const addAntibioticos = (selected, bact_id) => {
      console.log("el selected", selected[0], bact_id);

      for (let i = 0; i < this.bacterias.length; i++) {
        if (this.bacterias[i].id_bacteria == bact_id) {
          for (let j = 0; j < selected.length; j++) {
            this.bacterias[i].antibioticos = [
              ...this.bacterias[i].antibioticos,
              {
                id_antibiotico: selected[j].id_antibiotico,
                antibiotico_nombre: selected[j].antibiotico_nombre,
              },
            ];
          }
        }
      }

      console.log(this.bacterias);
      this.selected = [];
      this.filter = "";
      this.modalAntibioticos = false;
    };

    return {
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
      },
      cultivo,
      codigo,
      nombre,
      precio,
      departamento_id,
      categoria_id,
      departamentosData,
      categoriasData,
      bacteriasData,
      ip,
      qeditor: ref(""),
      columns,
      columns_antibioticos,
      rows,
      rows_antibioticos,
      loading,
      addAntibiotico,
      addAntibioticos,
      filter: ref(""),
      filterAntibioticos: ref(""),
      selected,
      carga,
      idBacteriaAntibiotico,
      bacterias,
      modalAntibioticos,
      bacteriaSeleccionada: null,
      acceso,
      id_usuario,
    };
  },

  methods: {
    // AGREGAR BACTERIA
    addBacteria() {
      this.bacterias.push({
        id_bacteria: null,
        antibioticos: [],
      });

      console.log(this.bacterias);
    },

    // ANULA LA RELACION DE UN ANTIBIOTICO //
    deleteBacteria(id_bacteria) {
      let eliminar = {
        num: 4,
        id_cultivo: this.id,
        id_bacteria: id_bacteria,
      };

      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configCultivoBacteriasAntibioticos", eliminar)
        .then((response) => {
          console.log(response.data);
          console.log("este es el response");

          if (response.data === 1) {
            this.eliminarBacteria(id_bacteria);
          }
        })
        .catch((err) => console.log(err.message));
    },

    //ELIMINAR BACTERIA
    eliminarBacteria(bact_id) {
      for (let i = 0; this.bacterias.length; i++) {
        if (this.bacterias[i].id_bacteria == bact_id) {
          console.log(this.bacterias[i]);
          var eliminado = this.bacterias.splice(i, 1);

          console.log("el eliminado", eliminado);
          break;
        }
      }
    },

    // ANULA LA RELACION DE UN ANTIBIOTICO //
    deleteAntibiotico(id_bacteria, id_antibiotico, id_detalle) {
      let eliminar = {
        num: 2,
        id_cultivo: this.id,
        id_detalle_cultivo_bacteria_antibiotico: id_detalle,
      };

      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configCultivoBacteriasAntibioticos", eliminar)
        .then((response) => {
          console.log(response.data);
          console.log("este es el response");

          if (response.data === 1) {
            this.eliminarAntibiotico(id_bacteria, id_antibiotico);
          }
        })
        .catch((err) => console.log(err.message));
    },

    // ELIMINAR UN ANTIBIOTICO DE UNA BACTERIA
    eliminarAntibiotico(bact_id, anti_id) {
      for (let i = 0; i < this.bacterias.length; i++) {
        if (this.bacterias[i].id_bacteria == bact_id) {
          for (let j = 0; j < this.bacterias[i].antibioticos.length; j++) {
            if (this.bacterias[i].antibioticos[j].id_antibiotico == anti_id) {
              var eliminado = this.bacterias[i].antibioticos.splice(j, 1);

              console.log("el eliminado", eliminado);
              break;
            }
          }
        }
      }
    },

    //AGREGAR BACTERIAS
    agregarAntibioticos(id_bacteria) {
      this.bacteriaSeleccionada = id_bacteria;
      this.modalAntibioticos = true;
    },

    // SE TRAE EL CULTIVO A MODIFICAR //
    async getCultivo() {
      let cultivo = {
        id_cultivo: this.id,
      };

      let datos = await axios.post(this.ip + "buscarCultivo", cultivo);
      console.log("el cultivo", datos.data);

      console.log(datos.data);
      this.codigo = datos.data.cultivo.cultivo_codigo;
      this.nombre = datos.data.cultivo.cultivo_nombre;
      this.precio = datos.data.cultivo.cultivo_precio;
      this.departamento_id = datos.data.cultivo.id_departamento;
      this.categoria_id = datos.data.cultivo.id_categoria;
      this.bacterias = datos.data.cultivo.bacterias;
    },

    // SE TRAE LOS DEPARTAMENTOS Y CATEGORIAS //
    async getDepartamentos() {
      let datos = await axios.get(this.ip + "departamentosCategoriasTubos");
      console.log(datos.data[0].categorias);
      this.categoriasData = datos.data[0].categorias;
      console.log(datos.data[0].departamentos);
      this.departamentosData = datos.data[0].departamentos;
    },

    // ENVIAR CULTIVO //
    onSubmit() {
      let num = 1;

      console.log("elnum " + num);

      const cult_id = parseInt(this.id);

      let cultivo = {
        num: 1,
        id_cultivo: cult_id,
        cultivo_codigo: this.codigo.toUpperCase(),
        cultivo_nombre: this.nombre.toUpperCase(),
        cultivo_precio: parseInt(this.precio),
        id_departamento: this.departamento_id,
        id_categoria: this.categoria_id,
        bacteria: this.bacterias,
      };

      console.log("EL CULTIVO WE", cultivo);
      console.log("ENVIADITTO");

      if (this.create === "true") {
        axios
          .post(this.ip + "configCultivos", cultivo)
          .then((response) => {
            console.log(response.data);
            if (response.data === 1) {
              console.log("es 1", response.data);
              this.$router.push({ name: "Cultivos" });
            }
          })
          .catch((err) => console.log(err.message));
      } else {
        axios
          .post(this.ip + "configCultivoBacteriasAntibioticos", cultivo)
          .then((response) => {
            console.log(response);
            if (response.data === 1) {
              this.$router.push({ name: "Cultivos" });
            }
          })
          .catch((err) => console.log(err.message));
      }
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Cultivos");
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 8,
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
          id_tarea: 28,
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
    console.log("HOLAAA", this.create, this.id);
    if (this.create === "false") {
      console.log("el get cultivo", this.create);
      this.getCultivo();
    } else {
      this.addBacteria();
    }
    this.getDepartamentos();
    console.log("EL ARRAY DE BACTERIAS", this.bacterias);
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
