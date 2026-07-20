import type { NavigationItem } from '@shared/interfaces/navigation-item';

export type LocalizedText = Readonly<{
  en: string;
  es: string;
}>;

export const uiText = {
  actions: {
    cancel: { en: 'Cancel', es: 'Cancelar' },
    confirm: { en: 'Confirm', es: 'Confirmar' },
    login: { en: 'Login', es: 'Iniciar sesión' },
    loggingIn: { en: 'Signing in...', es: 'Ingresando...' },
    logout: { en: 'Log Out', es: 'Cerrar sesión' },
    save: { en: 'Save', es: 'Guardar' },
    saving: { en: 'Saving...', es: 'Guardando...' },
    send: { en: 'Send', es: 'Enviar' },
    sending: { en: 'Sending...', es: 'Enviando...' },
  },
  alerts: {
    successTitle: { en: 'Success', es: 'Éxito' },
    infoTitle: { en: 'Message', es: 'Mensaje' },
    warningTitle: { en: 'Warning', es: 'Advertencia' },
    errorTitle: { en: 'An error occurred', es: 'Ocurrió un error' },
    invalidRequestTitle: { en: 'Invalid request', es: 'Solicitud inválida' },
    unauthorizedTitle: { en: 'Unauthorized', es: 'No autorizado' },
    forbiddenTitle: { en: 'Forbidden', es: 'Acceso denegado' },
    notFoundTitle: { en: 'Not found', es: 'No encontrado' },
    conflictTitle: { en: 'Conflict', es: 'Conflicto' },
    serverErrorTitle: { en: 'Server error', es: 'Error del servidor' },
    connectionErrorTitle: { en: 'Connection error', es: 'Error de conexión' },
    invalidRequestMessage: {
      en: 'Please review the submitted information',
      es: 'Revisa la información enviada',
    },
    unauthorizedMessage: {
      en: 'Your session is not valid',
      es: 'Tu sesión no es válida',
    },
    forbiddenMessage: {
      en: 'You do not have permission to perform this action',
      es: 'No tienes permisos para realizar esta acción',
    },
    notFoundMessage: {
      en: 'The requested resource could not be found',
      es: 'No se encontró el recurso solicitado',
    },
    conflictMessage: {
      en: 'The operation conflicts with existing data',
      es: 'La operación entra en conflicto con datos existentes',
    },
    serverErrorMessage: {
      en: 'Please try again later',
      es: 'Inténtalo nuevamente más tarde',
    },
    connectionErrorMessage: {
      en: 'Unable to connect to the server',
      es: 'No fue posible conectarse con el servidor',
    },
    contactSupport: {
      en: 'Please contact support',
      es: 'Comunícate con soporte',
    },
  },
  auth: {
    title: { en: 'Login', es: 'Iniciar sesión' },
    usernameLabel: { en: 'Username', es: 'Usuario' },
    passwordLabel: { en: 'Password', es: 'Contraseña' },
    showPassword: { en: 'Show password', es: 'Mostrar contraseña' },
    hidePassword: { en: 'Hide password', es: 'Ocultar contraseña' },
    usernameRequired: { en: 'The username is required', es: 'El usuario es requerido' },
    passwordRequired: { en: 'The password is required', es: 'La contraseña es requerida' },
    invalidToken: {
      en: 'The session token is invalid or expired',
      es: 'El token de sesión es inválido o expiró',
    },
  },
  common: {
    loading: { en: 'Loading...', es: 'Cargando...' },
    retry: { en: 'Try again', es: 'Intentar nuevamente' },
  },
  contact: {
    title: { en: 'Contact me', es: 'Contáctame' },
    nameLabel: { en: 'Name', es: 'Nombre' },
    emailLabel: { en: 'Email', es: 'Correo electrónico' },
    messageLabel: { en: 'Message', es: 'Mensaje' },
    nameRequired: { en: 'The name is required', es: 'El nombre es requerido' },
    emailRequired: { en: 'The email is required', es: 'El correo es requerido' },
    emailInvalid: { en: 'Enter a valid email', es: 'Ingresa un correo válido' },
    messageRequired: { en: 'The message is required', es: 'El mensaje es requerido' },
  },
  portfolio: {
    viewCv: { en: 'Show CV', es: 'Visualizar CV' },
    profilePhotoAltPrefix: { en: 'Photo of', es: 'Foto de' },
    primaryNavigation: { en: 'Primary navigation', es: 'Navegación principal' },
    footerNavigation: { en: 'Footer navigation', es: 'Navegación del pie de página' },
    socialMediaLinks: { en: 'Social media links', es: 'Enlaces a redes sociales' },
    toggleNavigation: { en: 'Toggle navigation', es: 'Alternar navegación' },
    openSocialPrefix: { en: 'Open', es: 'Abrir' },
    socialNetworksMessage: {
      en: 'You can contact me through my social networks.',
      es: 'Puedes contactarme a través de mis redes sociales.',
    },
    project: {
      technologies: { en: 'Project technologies', es: 'Tecnologías del proyecto' },
      openImage: { en: 'Open image of', es: 'Abrir imagen de' },
      previousImage: { en: 'Previous image', es: 'Imagen anterior' },
      nextImage: { en: 'Next image', es: 'Imagen siguiente' },
      of: { en: 'of', es: 'de' },
      closeDetails: { en: 'Close project details', es: 'Cerrar detalles del proyecto' },
      viewDetails: { en: 'View details', es: 'Ver detalles' },
      visitSite: { en: 'Visit site', es: 'Visitar sitio' },
      sourceCode: { en: 'Source code', es: 'Código fuente' },
      frontendCode: { en: 'Frontend code', es: 'Código frontend' },
      backendCode: { en: 'Backend code', es: 'Código backend' },
      linkFor: { en: 'for', es: 'de' },
    },
    rightsReserved: { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
    sections: {
      home: { en: 'Home', es: 'Inicio' },
      education: { en: 'Education', es: 'Educación' },
      skills: { en: 'Skills', es: 'Habilidades' },
      portfolio: { en: 'Portfolio', es: 'Portafolio' },
      contact: { en: 'Contact', es: 'Contacto' },
      login: { en: 'Login', es: 'Iniciar sesión' },
    },
    emptyRecords: { en: 'There are no records yet.', es: 'Todavía no hay registros.' },
  },
  session: {
    unauthorized: {
      en: 'You must sign in to continue',
      es: 'Debes iniciar sesión para continuar',
    },
    expired: {
      en: 'Session expired',
      es: 'La sesión ha expirado',
    },
    loggedOut: {
      en: 'Log out',
      es: 'Sesión cerrada',
    },
  },
  table: {
    actions: { en: 'Actions', es: 'Acciones' },
    deleteRecord: { en: 'Delete record', es: 'Eliminar registro' },
    details: { en: 'Details', es: 'Detalles' },
    editRecord: { en: 'Edit record', es: 'Editar registro' },
    emptyRecords: { en: 'There are no records.', es: 'No hay registros.' },
    emptySearchResults: {
      en: 'No records match the current search.',
      es: 'No hay registros que coincidan con la búsqueda actual.',
    },
    loadError: {
      en: 'We could not load the records. Please try again.',
      es: 'No se pudieron cargar los registros. Inténtalo nuevamente.',
    },
    loadErrorDescription: {
      en: 'The last request failed. Review the connection or try again later.',
      es: 'La última solicitud falló. Revisa la conexión o inténtalo nuevamente más tarde.',
    },
    loadingDescription: {
      en: 'Please wait while the latest records are loaded.',
      es: 'Espera mientras se cargan los registros más recientes.',
    },
    loadingRecords: { en: 'Loading records...', es: 'Cargando registros...' },
    newLabel: { en: 'New', es: 'Nuevo' },
    next: { en: 'Next', es: 'Siguiente' },
    noImage: { en: 'No image', es: 'Sin imagen' },
    page: { en: 'Page', es: 'Página' },
    previous: { en: 'Previous', es: 'Anterior' },
    recordImage: { en: 'Record image', es: 'Imagen del registro' },
    rows: { en: 'Rows', es: 'Filas' },
    searchAriaLabel: { en: 'Search records', es: 'Buscar registros' },
    searchPlaceholder: { en: 'Search', es: 'Buscar' },
    sortBy: { en: 'Sort by', es: 'Ordenar por' },
    viewDetails: { en: 'View details', es: 'Ver detalles' },
  },
  confirmDelete: {
    title: { en: 'Are you sure?', es: '¿Estás seguro?' },
    message: {
      en: "You won't be able to undo this action",
      es: 'No podrás deshacer esta acción',
    },
  },
} as const;

export const portfolioNavigationItems: readonly NavigationItem[] = [
  {
    label: uiText.portfolio.sections.home.en,
    label_es: uiText.portfolio.sections.home.es,
    routerLink: '#home',
  },
  {
    label: uiText.portfolio.sections.education.en,
    label_es: uiText.portfolio.sections.education.es,
    routerLink: '#education',
  },
  {
    label: uiText.portfolio.sections.skills.en,
    label_es: uiText.portfolio.sections.skills.es,
    routerLink: '#skills',
  },
  {
    label: uiText.portfolio.sections.portfolio.en,
    label_es: uiText.portfolio.sections.portfolio.es,
    routerLink: '#portfolio',
  },
  {
    label: uiText.portfolio.sections.contact.en,
    label_es: uiText.portfolio.sections.contact.es,
    routerLink: '',
  },
  {
    label: uiText.portfolio.sections.login.en,
    label_es: uiText.portfolio.sections.login.es,
    routerLink: '/login',
  },
] as const;
