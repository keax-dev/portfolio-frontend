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
  confirmDelete: {
    title: { en: 'Are you sure?', es: '¿Estás seguro?' },
    message: {
      en: "You won't be able to undo this action",
      es: 'No podrás deshacer esta acción',
    },
  },
} as const;
