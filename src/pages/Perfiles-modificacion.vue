<template>
  <q-page padding v-if="this.getAcceso == 1">
    <div class="fit row justify-center">
      <div class="col-10">
        <!-- CARD MODIFICACION DE PERFIL -->
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="text-h6">
              {{ this.create === "true" ? "Creación" : "Modificación" }} de
              perfiles
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
                <!-- NOMBRE DEL PERFIL -->
                <div class="col-4">
                  <q-input
                    v-model="nombre"
                    type="text"
                    label="Nombre"
                    class="q-ml-xl text-uppercase"
                  />
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <!-- TABLA DE EXAMENES PERTENECIENTES AL PERFIL -->
              <q-table
                title="Examenes"
                :rows="rows"
                :columns="columns"
                :loading="loading"
                :pagination="initialPagination"
                :filter="filter"
                no-data-label="No hay data disponible"
                row-key="examen_codigo"
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

                  <!-- BOTON AGREGAR NUEVO EXAMEN -->
                  <q-btn
                    class="q-ml-xl"
                    color="secondary"
                    text-color="accent"
                    label="Agregar examen"
                    @click="agregarExamen()"
                    icon="add"
                  />
                </template>

                <!-- SECCION BOTONES OPCIONES -->
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <!-- BOTON ELIMINAR PERFIL -->
                    <q-btn
                      padding="md"
                      dense
                      round
                      flat
                      color="grey"
                      @click="deleteRow(props.row.id_examen)"
                      icon="delete"
                    >
                    </q-btn>
                  </q-td>
                </template>
              </q-table>

              <!-- MODAL AGREGAR EXAMEN -->
              <q-dialog v-model="confirm" full-width>
                <q-card>
                  <q-card-section class="q-pb-sm">
                    <!-- TABLA QUE MUESTRA TODOS LOS EXAMENES -->
                    <q-table
                      title="Agregar examen"
                      :rows="rows_examenes"
                      :columns="columns_examenes"
                      :pagination="initialPagination"
                      :loading="carga"
                      row-key="examen_codigo"
                      selection="multiple"
                      v-model:selected="selected"
                      :filter="filterExams"
                    >
                      <template v-slot:top-right>
                        <!-- BARRA DE BUSQUEDA -->
                        <q-input
                          outlined
                          dense
                          debounce="300"
                          v-model="filterExams"
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
                          <!--BOTON AGREGAR EXAMEN AL PERFIL -->
                          <q-btn
                            padding="md"
                            dense
                            round
                            flat
                            color="grey"
                            @click="
                              addExam(
                                opt.row.id_examen,
                                opt.row.examen_codigo,
                                opt.row.examen_nombre
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
                          @click="addExamenes(selected)"
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
    let perfil;
    let codigo = ref(null);
    let nombre = ref(null);
    const rows = ref([]);
    const rows_test = ref([]);
    let rows_examenes = ref([]);
    const loading = ref(true);
    const carga = ref(true);
    const selected = ref([]);
    let idExamen = ref([]);
    let confirm = ref(false);
    let acceso = ref(null);
    let perfil_id = {
      id_perfil: this.id,
    };

    const ip = process.env.BASE_URL;

    const columns = [
      {
        name: "examen_codigo",
        required: true,
        label: "Codigo",
        align: "left",
        field: (row) => row.examen_codigo,
        format: (val) => `${val}`,
        sortable: true,
      },
      {
        name: "examen_nombre",
        align: "center",
        label: "Nombre",
        field: "examen_nombre",
        sortable: true,
      },
      { name: "actions", label: "Opciones", field: "", align: "center" },
    ];

    const columns_examenes = [
      {
        name: "examen_codigo",
        required: true,
        label: "Codigo",
        align: "left",
        field: (row_examen) => row_examen.examen_codigo,
        format: (val_examen) => `${val_examen}`,
        sortable: true,
      },
      {
        name: "examen_nombre",
        align: "center",
        label: "Nombre",
        field: "examen_nombre",
        sortable: true,
      },
      { name: "actions", label: "Agregar examen", field: "", align: "center" },
    ];

    // SE TRAE LOS EXAMENES PERTENECIENTES AL PEFIL //
    axios
      .post(ip + "perfilExamenes", perfil_id)
      .then((response) => {
        rows.value = response.data;
        console.log(rows.value);
      })
      .finally(() => {
        loading.value = false;
      });

    // SE TRAE LA LISTA DE EXAMENES //
    axios
      .get(ip + "examenes")
      .then((response) => {
        rows_examenes.value = response.data;
        console.log(rows_examenes.value);
      })
      .finally(() => {
        carga.value = false;
      });

    // AGREGA UN SOLO EXAMEN A LA LISTA DE EXAMENES //
    const addExam = (examen_id, codigo_examen, nombre_examen) => {
      rows.value = [
        ...rows.value,
        {
          id_examen: examen_id,
          examen_codigo: codigo_examen,
          examen_nombre: nombre_examen,
        },
      ];
      this.confirm = false;
    };

    // AGREGA VARIOS EXAMENES A LA LISTA DE EXAMENES //
    const addExamenes = (selected) => {
      console.log("el selected", selected[0].id_examen);
      for (let i = 0; i < selected.length; i++) {
        rows.value = [
          ...rows.value,
          {
            id_examen: selected[i].id_examen,
            examen_codigo: selected[i].examen_codigo,
            examen_nombre: selected[i].examen_nombre,
          },
        ];
      }
      this.selected = [];
      this.confirm = false;
    };

    // ELIMINAR UN EXAMEN DEL PERFIL //
    const deleteExamen = (examen_id) => {
      let tamano = rows.value.length;
      for (let i = 0; i < tamano; i++) {
        console.log("entro al for");
        if (rows.value[i].id_examen == examen_id) {
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
      perfil,
      codigo,
      nombre,
      ip,
      selected,
      columns,
      rows,
      rows_examenes,
      rows_test,
      columns_examenes,
      loading,
      confirm,
      carga,
      addExam,
      addExamenes,
      idExamen,
      filter: ref(""),
      filterExams: ref(""),
      deleteExamen,
      acceso,

      getSelectedString() {
        return selected.value.length === 0
          ? ""
          : `${selected.value.length} record${
              selected.value.length > 1 ? "s" : ""
            } selected of ${rows.value.length}`;
      },
    };
  },

  methods: {
    // MODAL AGREGAR EXAMEN //
    agregarExamen() {
      this.confirm = true;
    },

    // SE TRAE EL PERFIL A MODIFICAR //
    async getPerfil() {
      let perfil = {
        id_perfil: this.id,
      };

      let datos = await axios.post(this.ip + "buscarPerfil", perfil);

      console.log(datos.data);
      this.nombre = datos.data[0].perfil_nombre;
    },

    // ELIMINAR UN EXAMEN //
    deleteRow(examen_id) {
      console.log("EL DELETE ID", examen_id);

      let eliminar = {
        num: 2,
        id_perfil: this.id,
        id_examen: examen_id,
      };
      console.log("id perfil" + this.id);
      console.log("El eliminar" + eliminar);

      axios
        .post(this.ip + "configPerfilExamenes", eliminar)
        .then((response) => {
          console.log(response.data);
          console.log("es es el response");

          if (response.data === 1) {
            this.deleteExamen(examen_id);
          }
        })
        .catch((err) => console.log(err.message));
    },

    // ENVIAR PERFIL //
    onSubmit() {
      let num = 1;

      console.log("elnum ", num);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!", this.rows[0].id_examen);
      for (let i = 0; i < this.rows.length; i++) {
        this.idExamen.push({
          idExamen: this.rows[i].id_examen,
        });
      }

      let perfil = {
        num,
        id_perfil: this.id,
        perfil_nombre: this.nombre.toUpperCase(),
        examenes: this.idExamen,
      };

      console.log(perfil);
      console.log("EL ID EXAMEN EN JSONS", this.idExamen);
      console.log("ENVIADITTO");
      if (this.create === "true") {
        axios
          .post(this.ip + "configPerfiles", perfil)
          .then((response) => {
            console.log("el response", response.data);
            if (response.data === "MODIFICO!" || response.data === "AGREGO!") {
              this.$router.push({ name: "Perfiles" });
            }
          })
          .catch((err) => console.log(err.message));
      } else {
        axios
          .post(this.ip + "configPerfilExamenes", perfil)
          .then((response) => {
            console.log("el response", response.data);
            if (response.data === "MODIFICO!" || response.data === "AGREGO!") {
              this.$router.push({ name: "Perfiles" });
            }
          })
          .catch((err) => console.log(err.message));
      }
    },

    // CANCELAR //
    onCancel() {
      this.$router.push("/Perfiles");
    },

    validar() {
      if (this.create == true) {
        // VERIFICACION DE CREACION
        let usuario = {
          id_usuario: parseInt(localStorage.id),
          id_rol: parseInt(localStorage.rol),
          id_tarea: 7,
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
          id_tarea: 27,
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
      this.getPerfil();
    }
  },

  computed: {
    getAcceso() {
      console.log("ela", this.acceso);
      return this.acceso;
    },
  },
};
</script>
