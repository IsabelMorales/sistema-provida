<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Sistema Provida</q-toolbar-title>
        <q-space />
        <h6 class="q-my-none q-mr-sm">Bienvenido {{ getNombre }}</h6>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :show-if-above="false"
      bordered
      overlay
      class="bg-grey-1"
    >
      <q-list>
        <q-expansion-item
          v-for="link in essentialLinks"
          :key="link.title"
          expand-separator
          :icon="link.icon"
          :label="link.title"
        >
          <q-list>
            <EssentialLink
              v-for="item in link.children"
              :key="item.title"
              v-bind="item"
            />
          </q-list>
        </q-expansion-item>
        <q-separator class="q-mt-lg" />

        <q-item clickable @click="cerrarSesion()">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Cerrar sesion</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Administracion",
    icon: "work",
    children: [
      {
        title: "Facturas",
        icon: "description",
        link: "/Facturas",
      },
      {
        title: "Ordenes de trabajo",
        icon: "receipt_long",
        link: "/ordenesDeTrabajo",
      },
      {
        title: "Registro convenio",
        icon: "article",
        link: "/RegistroConvenio",
      },
      {
        title: "Recibos registro convenio",
        icon: "receipt",
        link: "/RecibosRegistroConvenio",
      },
      {
        title: "Recibos facturas a credito",
        icon: "receipt",
        link: "/RecibosFacturasCredito",
      },
      {
        title: "Notas a credito",
        icon: "feed",
        link: "/NotasCredito",
      },
      {
        title: "Divisas",
        icon: "paid",
        link: "/Divisas",
      },
      {
        title: "Carpeta paciente",
        icon: "folder_shared",
        link: "/CarpetaPaciente",
      },
      {
        title: "Lista de precios",
        icon: "list_alt",
        link: "/ListaPrecios",
      },
    ],
  },
  {
    title: "Reportes",
    icon: "topic",
    children: [
      {
        title: "Cierre de caja",
        icon: "account_balance_wallet",
        link: "/cierresDeCaja",
      },
      {
        title: "Master de ventas",
        icon: "request_page",
        link: "/Buscador/1",
      },
      {
        title: "Relación IGTF",
        icon: "price_check",
        link: "/Buscador/2",
      },
      {
        title: "Relación de notas a crédito",
        icon: "payments",
        link: "/Buscador/3",
      },
      {
        title: "Relación pacientes/pruebas",
        icon: "contact_page",
        link: "/Buscador/4",
      },
      {
        title: "Reporte de ventas",
        icon: "local_atm",
        link: "/Buscador/5",
      },
      {
        title: "Estadistica de examenes",
        icon: "bar_chart",
        link: "/Buscador/6",
      },
      {
        title: "Cuentas por cobrar",
        icon: "savings",
        link: "/Buscador/7",
      },
    ],
  },
  {
    title: "Bioanalisis",
    icon: "biotech",
    children: [
      {
        title: "Resultados",
        icon: "biotech",
        link: "/Ordenes",
      },
      {
        title: "Toma de muestra",
        icon: "vaccines",
        link: "/ordenesTomaDeMuestra",
      },
      {
        title: "Sueros",
        icon: "science",
        link: "/ordenesSueros",
      },
      {
        title: "Dep. Hematologia",
        icon: "biotech",
        link: "/ordenesDepHema",
      },
      {
        title: "Dep. Bioquimica",
        icon: "biotech",
        link: "/ordenesDepBioq",
      },
      {
        title: "Dep. Pruebas especiales",
        icon: "biotech",
        link: "/ordenesDepEsp",
      },
      {
        title: "Dep. Coproanalisis",
        icon: "biotech",
        link: "/ordenesDepCopro",
      },
      {
        title: "Dep. Bacteriologia",
        icon: "biotech",
        link: "/ordenesDepBact",
      },
    ],
  },
  {
    title: "Secretaria",
    icon: "point_of_sale",
    children: [
      {
        title: "Facturacion Particulares",
        icon: "person",
        link: "/facturacionPart",
      },
      {
        title: "Facturacion Convenios",
        icon: "groups",
        link: "/facturacionConv",
      },
      {
        title: "Presupuestar examenes",
        icon: "format_list_numbered",
        link: "/presupuesto",
      },
    ],
  },
  {
    title: "Configuración bioanalisis",
    icon: "settings",
    children: [
      {
        title: "Perfiles",
        icon: "list_alt",
        link: "/Perfiles",
      },
      {
        title: "Examenes",
        icon: "biotech",
        link: "/Examenes",
      },
      {
        title: "Pruebas",
        icon: "grid_on",
        link: "/Pruebas",
      },
      {
        title: "Cultivos",
        icon: "spoke",
        link: "/Cultivos",
      },
      {
        title: "Bacterias",
        icon: "coronavirus",
        link: "/Bacterias",
      },
      {
        title: "Antibioticos",
        icon: "medication",
        link: "/Antibioticos",
      },
    ],
  },
  {
    title: "Configuración administrativa",
    icon: "manage_accounts",
    children: [
      {
        title: "Clientes",
        icon: "person",
        link: "/Clientes",
      },
      {
        title: "Pacientes",
        icon: "supervisor_account",
        link: "/Pacientes",
      },
      {
        title: "Usuarios",
        icon: "badge",
        link: "/Usuarios",
      },
      {
        title: "Roles",
        icon: "admin_panel_settings",
        link: "/Roles",
      },
    ],
  },
];

import { defineComponent, ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const ip = process.env.BASE_URL;
    let name = localStorage.name;

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      ip,
      name,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },

  methods: {
    async cerrarSesion() {
      console.log(localStorage.id);
      let usuario = {
        id_usuario: parseInt(localStorage.id),
        token: localStorage.token,
      };

      let datos = await axios.post(this.ip + "logout", usuario);
      console.log("lada", datos.data);
      if (datos.data == 1) {
        console.log("entro");
        localStorage.clear();
        window.location = "/";
      }
    },
  },

  computed: {
    getNombre() {
      return this.name;
    },
  },
});
</script>
