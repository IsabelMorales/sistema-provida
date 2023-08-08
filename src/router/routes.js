const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/", name: "Index", component: () => import("pages/Index.vue") },
      {
        path: "/examenes",
        name: "Examenes",
        component: () => import("pages/Examenes.vue"),
      },
      {
        path: "/examenesMod/:id?",
        name: "ExamenesModificacion",
        component: () => import("pages/Examenes-modificacion.vue"),
        props: true,
      },
      {
        path: "/perfiles",
        name: "Perfiles",
        component: () => import("pages/Perfiles.vue"),
      },
      {
        path: "/perfilesMod/:id?",
        name: "PerfilesModificacion",
        component: () => import("pages/Perfiles-modificacion.vue"),
        props: true,
      },
      {
        path: "/clientes",
        name: "Clientes",
        component: () => import("pages/Clientes.vue"),
      },
      {
        path: "/clientesMod/:id?",
        name: "ClientesModificacion",
        component: () => import("pages/Clientes-modificacion.vue"),
        props: true,
      },
      {
        path: "/pacientes",
        name: "Pacientes",
        component: () => import("pages/Pacientes.vue"),
      },
      {
        path: "/pacientesMod/:id?",
        name: "PacientesModificacion",
        component: () => import("pages/Pacientes-modificacion.vue"),
        props: true,
      },
      {
        path: "/usuarios",
        name: "Usuarios",
        component: () => import("pages/Usuarios.vue"),
      },
      {
        path: "/usuariosMod/:id?",
        name: "UsuariosModificacion",
        component: () => import("pages/Usuarios-modificacion.vue"),
        props: true,
      },
      {
        path: "/pruebas",
        name: "Pruebas",
        component: () => import("pages/Pruebas.vue"),
      },
      {
        path: "/pruebasMod/:id?",
        name: "PruebasModificacion",
        component: () => import("pages/Pruebas-modificacion.vue"),
        props: true,
      },
      {
        path: "/antibioticos",
        name: "Antibioticos",
        component: () => import("pages/Antibioticos.vue"),
      },
      {
        path: "/antibioticosMod/:id?",
        name: "AntibioticosModificacion",
        component: () => import("pages/Antibioticos-modificacion.vue"),
        props: true,
      },
      {
        path: "/bacterias",
        name: "Bacterias",
        component: () => import("pages/Bacterias.vue"),
      },
      {
        path: "/bacteriasMod/:id?",
        name: "BacteriasModificacion",
        component: () => import("pages/Bacterias-modificacion.vue"),
        props: true,
      },
      {
        path: "/cultivos",
        name: "Cultivos",
        component: () => import("pages/Cultivos.vue"),
      },
      {
        path: "/cultivosMod/:id?",
        name: "CultivosModificacion",
        component: () => import("pages/Cultivos-modificacion.vue"),
        props: true,
      },
      {
        path: "/facturas",
        name: "Facturas",
        component: () => import("pages/Facturas.vue"),
      },
      {
        path: "/facturasDet/:id?",
        name: "FacturasDetalle",
        component: () => import("pages/Facturas-detalle.vue"),
        props: true,
      },
      {
        path: "/ordenesDeTrabajo",
        name: "OrdenesTrabajo",
        component: () => import("pages/Ordenes-trabajo.vue"),
      },
      {
        path: "/ordenTrabajoDet/:id?",
        name: "OrdenesTrabajoDetalle",
        component: () => import("pages/Ordenes-trabajo-detalle.vue"),
        props: true,
      },
      {
        path: "/notasCredito",
        name: "NotasCredito",
        component: () => import("pages/Notas-credito.vue"),
      },
      {
        path: "/ordenesTomaDeMuestra",
        name: "OrdenesTomaMuestra",
        component: () => import("pages/Ordenes-toma-de-muestra.vue"),
      },
      {
        path: "/ordenesDepHema",
        name: "ordenesDepHema",
        component: () => import("pages/Ordenes-hematologia.vue"),
      },
      {
        path: "/ordenesDepBioq",
        name: "ordenesDepBioq",
        component: () => import("pages/Ordenes-bioquimica.vue"),
      },
      {
        path: "/ordenesDepEsp",
        name: "ordenesDepEsp",
        component: () => import("pages/Ordenes-especiales.vue"),
      },
      {
        path: "/ordenesDepBact",
        name: "ordenesDepBact",
        component: () => import("pages/Ordenes-bacteriologia.vue"),
      },
      {
        path: "/ordenesDepCopro",
        name: "ordenesDepCopro",
        component: () => import("pages/Ordenes-coproanalisis.vue"),
      },
      {
        path: "/ordenesSueros",
        name: "OrdenesSueros",
        component: () => import("pages/Ordenes-sueros.vue"),
      },
      {
        path: "/facturacionPart",
        name: "FacturacionParticular",
        component: () => import("pages/Facturacion-particular.vue"),
      },
      {
        path: "/facturacionConv",
        name: "FacturacionConvenios",
        component: () => import("pages/Facturacion-convenios.vue"),
      },
      {
        path: "/ordenes",
        name: "Ordenes",
        component: () => import("pages/Ordenes.vue"),
      },
      {
        path: "/resultados/:idOrden?/:idFactura?",
        name: "Resultados",
        component: () => import("pages/Resultados.vue"),
        props: true,
      },
      {
        path: "/resultadosCultivos/:id_cultivo?",
        name: "ResultadosCultivos",
        component: () => import("components/ResultadosCultivos.vue"),
        props: true,
      },
      {
        path: "/registroConvenio",
        name: "RegistroConvenio",
        component: () => import("pages/RegistroConvenio.vue"),
      },
      {
        path: "/recibosRegistroConvenio",
        name: "RecibosRegistroConvenio",
        component: () => import("pages/Recibos-rc.vue"),
      },
      {
        path: "/recibosFacturasCredito",
        name: "RecibosFacturasCredito",
        component: () => import("pages/Recibos-facturas.vue"),
      },
      {
        path: "/divisas",
        name: "Divisas",
        component: () => import("pages/Divisas.vue"),
      },
      {
        path: "/roles",
        name: "Roles",
        component: () => import("pages/Roles.vue"),
      },
      {
        path: "/rolesMod/:id?",
        name: "RolesModificacion",
        component: () => import("pages/Roles-modificacion.vue"),
        props: true,
      },
      {
        path: "/buscador/:id",
        name: "BuscadorDeReportes",
        component: () => import("pages/Buscador-de-reportes.vue"),
        props: true,
      },
      {
        path: "/masterDeVentas",
        name: "MasterDeVentas",
        component: () => import("components/MasterDeVentas.vue"),
        props: true,
      },
      {
        path: "/relacionIGTF",
        name: "RelacionIGTF",
        component: () => import("components/RelacionIGTF.vue"),
        props: true,
      },
      {
        path: "/relacionNotasCredito",
        name: "RelacionNotasCredito",
        component: () => import("components/RelacionNotasCredito.vue"),
        props: true,
      },
      {
        path: "/relacionPacientesPruebas",
        name: "RelacionPacientesPruebas",
        component: () => import("components/RelacionPacientesPruebas.vue"),
        props: true,
      },
      {
        path: "/reporteDeVentas",
        name: "ReporteDeVentas",
        component: () => import("components/ReporteDeVentas.vue"),
        props: true,
      },
      {
        path: "/estadisticaExamenes",
        name: "EstadisticaExamenes",
        component: () => import("components/EstadisticaExamenes.vue"),
        props: true,
      },
      {
        path: "/cierresDeCaja",
        name: "CierresDeCaja",
        component: () => import("pages/Cierres-de-caja.vue"),
      },
      {
        path: "/presupuesto",
        name: "Presupuesto",
        component: () => import("pages/Presupuesto.vue"),
      },
      {
        path: "/carpetaPaciente",
        name: "CarpetaPaciente",
        component: () => import("pages/Carpeta-paciente.vue"),
      },
      {
        path: "/listaPrecios",
        name: "ListaPrecios",
        component: () => import("pages/Lista-precios.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
